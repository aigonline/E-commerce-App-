-- Create tables for our eBay-like application

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  total_ratings INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  parent_id UUID REFERENCES public.categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Products/Items table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  seller_id UUID REFERENCES auth.users(id) NOT NULL,
  category_id UUID REFERENCES public.categories(id) NOT NULL,
  condition TEXT NOT NULL,
  starting_price DECIMAL(10,2) NOT NULL,
  current_price DECIMAL(10,2) NOT NULL,
  buy_now_price DECIMAL(10,2),
  is_auction BOOLEAN DEFAULT true,
  is_buy_now BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active',
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  views INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Product Images table
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  position INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Bids table
CREATE TABLE IF NOT EXISTS public.bids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  bidder_id UUID REFERENCES auth.users(id) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Watchlist table
CREATE TABLE IF NOT EXISTS public.watchlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, product_id)
);

-- Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID REFERENCES auth.users(id) NOT NULL,
  seller_id UUID REFERENCES auth.users(id) NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address JSONB,
  tracking_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Products policies
CREATE POLICY "Products are viewable by everyone" 
ON public.products FOR SELECT USING (true);

CREATE POLICY "Users can insert their own products" 
ON public.products FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update their own products" 
ON public.products FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "Users can delete their own products" 
ON public.products FOR DELETE USING (auth.uid() = seller_id);

-- Product images policies
CREATE POLICY "Product images are viewable by everyone" 
ON public.product_images FOR SELECT USING (true);

CREATE POLICY "Users can insert images for their own products" 
ON public.product_images FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.products 
    WHERE id = product_id AND seller_id = auth.uid()
  )
);

CREATE POLICY "Users can delete images for their own products" 
ON public.product_images FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.products 
    WHERE id = product_id AND seller_id = auth.uid()
  )
);

-- Bids policies
CREATE POLICY "Bids are viewable by everyone" 
ON public.bids FOR SELECT USING (true);

CREATE POLICY "Users can insert their own bids" 
ON public.bids FOR INSERT WITH CHECK (auth.uid() = bidder_id);

-- Watchlist policies
CREATE POLICY "Users can view their own watchlist" 
ON public.watchlist FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own watchlist" 
ON public.watchlist FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own watchlist" 
ON public.watchlist FOR DELETE USING (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view their own orders as buyer or seller" 
ON public.orders FOR SELECT USING (
  auth.uid() = buyer_id OR auth.uid() = seller_id
);

CREATE POLICY "Users can insert their own orders as buyer" 
ON public.orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Users can update their own orders" 
ON public.orders FOR UPDATE USING (
  auth.uid() = buyer_id OR auth.uid() = seller_id
);

-- Create functions and triggers
CREATE OR REPLACE FUNCTION update_current_price()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET current_price = NEW.amount
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_price_after_bid
AFTER INSERT ON bids
FOR EACH ROW
EXECUTE FUNCTION update_current_price();

-- Create function to check if a bid is valid
CREATE OR REPLACE FUNCTION check_bid_validity()
RETURNS TRIGGER AS $$
DECLARE
  product_current_price DECIMAL(10,2);
  product_end_date TIMESTAMP WITH TIME ZONE;
  product_status TEXT;
BEGIN
  -- Get product details
  SELECT current_price, end_date, status INTO product_current_price, product_end_date, product_status
  FROM products
  WHERE id = NEW.product_id;
  
  -- Check if product exists
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product not found';
  END IF;
  
  -- Check if product is active
  IF product_status != 'active' THEN
    RAISE EXCEPTION 'Cannot bid on inactive product';
  END IF;
  
  -- Check if auction has ended
  IF product_end_date < NOW() THEN
    RAISE EXCEPTION 'Auction has ended';
  END IF;
  
  -- Check if bid amount is higher than current price
  IF NEW.amount <= product_current_price THEN
    RAISE EXCEPTION 'Bid must be higher than current price (%)%', product_current_price;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_bid_before_insert
BEFORE INSERT ON bids
FOR EACH ROW
EXECUTE FUNCTION check_bid_validity();

-- Create function to update product status when auction ends
CREATE OR REPLACE FUNCTION update_ended_auctions()
RETURNS void AS $$
BEGIN
  UPDATE products
  SET status = 'ended'
  WHERE end_date < NOW() AND status = 'active';
END;
$$ LANGUAGE plpgsql;

-- Create a cron job to run this function every hour
SELECT cron.schedule('0 * * * *', 'SELECT update_ended_auctions()');
