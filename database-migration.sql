-- Migration script to update existing Supabase database
-- Run this in your Supabase SQL Editor

-- Add missing columns to existing tables (if they don't exist)
DO $$ 
BEGIN
    -- Add columns to profiles table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'bio') THEN
        ALTER TABLE public.profiles ADD COLUMN bio TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'rating') THEN
        ALTER TABLE public.profiles ADD COLUMN rating DECIMAL(3,2) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'total_ratings') THEN
        ALTER TABLE public.profiles ADD COLUMN total_ratings INT DEFAULT 0;
    END IF;

    -- Add columns to categories table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'icon') THEN
        ALTER TABLE public.categories ADD COLUMN icon TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'parent_id') THEN
        ALTER TABLE public.categories ADD COLUMN parent_id UUID REFERENCES public.categories(id);
    END IF;

    -- Add columns to products table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'views') THEN
        ALTER TABLE public.products ADD COLUMN views INT DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'is_buy_now') THEN
        ALTER TABLE public.products ADD COLUMN is_buy_now BOOLEAN DEFAULT false;
    END IF;
    
    -- Add missing tables if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orders') THEN
        CREATE TABLE public.orders (
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
        
        ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
        
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
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'watchlist') THEN
        CREATE TABLE public.watchlist (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
            product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
            UNIQUE(user_id, product_id)
        );
        
        ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Users can view their own watchlist" 
        ON public.watchlist FOR SELECT USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can insert into their own watchlist" 
        ON public.watchlist FOR INSERT WITH CHECK (auth.uid() = user_id);
        
        CREATE POLICY "Users can delete from their own watchlist" 
        ON public.watchlist FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Update existing functions or create them
CREATE OR REPLACE FUNCTION update_current_price()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET current_price = NEW.amount,
      updated_at = NOW()
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger
DROP TRIGGER IF EXISTS update_product_price_after_bid ON bids;
CREATE TRIGGER update_product_price_after_bid
AFTER INSERT ON bids
FOR EACH ROW
EXECUTE FUNCTION update_current_price();

-- Create or update bid validation function
CREATE OR REPLACE FUNCTION check_bid_validity()
RETURNS TRIGGER AS $$
DECLARE
  product_current_price DECIMAL(10,2);
  product_end_date TIMESTAMP WITH TIME ZONE;
  product_status TEXT;
  product_seller_id UUID;
BEGIN
  -- Get product details
  SELECT current_price, end_date, status, seller_id 
  INTO product_current_price, product_end_date, product_status, product_seller_id
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
  
  -- Check if user is not the seller
  IF product_seller_id = NEW.bidder_id THEN
    RAISE EXCEPTION 'Cannot bid on your own item';
  END IF;
  
  -- Check if bid amount is higher than current price
  IF NEW.amount <= product_current_price THEN
    RAISE EXCEPTION 'Bid must be higher than current price: $%', product_current_price;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate bid validation trigger
DROP TRIGGER IF EXISTS check_bid_before_insert ON bids;
CREATE TRIGGER check_bid_before_insert
BEFORE INSERT ON bids
FOR EACH ROW
EXECUTE FUNCTION check_bid_validity();

-- Insert updated categories (will ignore duplicates)
INSERT INTO public.categories (id, name, slug, description, icon) VALUES
  ('c47b4ecc-1234-4b4c-9aaa-dc98e8a1a3d1', 'Electronics', 'electronics', 'Computers, phones, tablets, cameras, and more', 'Laptop'),
  ('d5e6f788-5678-4321-bbbb-abc123def456', 'Fashion', 'fashion', 'Clothing, shoes, accessories, and jewelry', 'Shirt'),
  ('a1b2c3d4-9012-4567-cccc-456789abcdef', 'Home & Garden', 'home-garden', 'Furniture, decor, appliances, and outdoor', 'Home'),
  ('e5f6a7b8-3456-7890-dddd-789012345678', 'Sports', 'sports', 'Equipment, apparel, memorabilia, and tickets', 'Trophy'),
  ('19a0b1c2-6789-0123-eeee-abcdef123456', 'Toys & Hobbies', 'toys-hobbies', 'Games, puzzles, models, and crafts', 'Gamepad2'),
  ('f3e4d5c6-4567-8901-ffff-fedcba987654', 'Collectibles', 'collectibles', 'Rare items, antiques, coins, and memorabilia', 'Gem'),
  ('b8c9d0e1-2345-6789-aaaa-123456789abc', 'Music', 'music', 'Instruments, vinyl, CDs, and equipment', 'Music'),
  ('a7b8c9d0-1234-5678-bbbb-987654321def', 'Cameras', 'cameras', 'Digital cameras, lenses, and photography equipment', 'Camera')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  updated_at = NOW();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        AND table_name != 'schema_migrations'
    LOOP
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = t AND column_name = 'updated_at'
        ) THEN
            EXECUTE format('DROP TRIGGER IF EXISTS update_%I_updated_at ON %I', t, t);
            EXECUTE format('CREATE TRIGGER update_%I_updated_at 
                           BEFORE UPDATE ON %I 
                           FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', t, t);
        END IF;
    END LOOP;
END $$;
