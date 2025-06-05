-- Seed data for categories
INSERT INTO public.categories (name, slug, description, icon) VALUES
('Electronics', 'electronics', 'Computers, phones, tablets, cameras, and more', 'cpu'),
('Fashion', 'fashion', 'Clothing, shoes, accessories, and jewelry', 'shirt'),
('Home & Garden', 'home-garden', 'Furniture, decor, appliances, and outdoor', 'home'),
('Collectibles', 'collectibles', 'Rare items, antiques, coins, and memorabilia', 'gift'),
('Jewelry & Watches', 'jewelry-watches', 'Fine jewelry, watches, and accessories', 'watch'),
('Cameras', 'cameras', 'Digital cameras, film cameras, and accessories', 'camera'),
('Music', 'music', 'Instruments, records, CDs, and equipment', 'music'),
('Tickets', 'tickets', 'Event tickets, experiences, and travel', 'ticket'),
('Other', 'other', 'Everything else', 'shopping-bag')
ON CONFLICT (slug) DO NOTHING;

-- Add some subcategoriess
INSERT INTO public.categories (name, slug, description, icon, parent_id) VALUES
('Smartphones', 'smartphones', 'Mobile phones and accessories', 'smartphone', (SELECT id FROM public.categories WHERE slug = 'electronics')),
('Laptops', 'laptops', 'Notebook computers and accessories', 'laptop', (SELECT id FROM public.categories WHERE slug = 'electronics')),
('Men''s Clothing', 'mens-clothing', 'Shirts, pants, outerwear for men', 'user', (SELECT id FROM public.categories WHERE slug = 'fashion')),
('Women''s Clothing', 'womens-clothing', 'Dresses, tops, outerwear for women', 'user', (SELECT id FROM public.categories WHERE slug = 'fashion')),
('Furniture', 'furniture', 'Tables, chairs, sofas, and more', 'armchair', (SELECT id FROM public.categories WHERE slug = 'home-garden')),
('Kitchen', 'kitchen', 'Cookware, appliances, and utensils', 'utensils', (SELECT id FROM public.categories WHERE slug = 'home-garden')),
('Coins', 'coins', 'Rare and collectible coins', 'circle-dollar-sign', (SELECT id FROM public.categories WHERE slug = 'collectibles')),
('Trading Cards', 'trading-cards', 'Sports and gaming cards', 'layers', (SELECT id FROM public.categories WHERE slug = 'collectibles'))
ON CONFLICT (slug) DO NOTHING;

-- Create some sample products (only if we don't have any users yet)
DO $$
DECLARE
  user_count INTEGER;
  sample_user_id UUID;
BEGIN
  SELECT COUNT(*) INTO user_count FROM auth.users;
  
  IF user_count = 0 THEN
    -- No real users yet, create a sample user for demo purposes
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
    VALUES (
      uuid_generate_v4(),
      'demo@example.com',
      crypt('demo_password_not_real', gen_salt('bf')),
      NOW()
    )
    RETURNING id INTO sample_user_id;
    
    -- Create profile for sample user
    INSERT INTO public.profiles (id, username, full_name, avatar_url)
    VALUES (
      sample_user_id,
      'demo_user',
      'Demo User',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=demo'
    );
    
    -- Add some sample products
    INSERT INTO public.products (
      title, 
      description, 
      seller_id, 
      category_id, 
      condition, 
      starting_price, 
      current_price, 
      buy_now_price, 
      is_auction, 
      is_buy_now, 
      end_date
    ) VALUES
    (
      'Vintage Polaroid SX-70 Land Camera',
      'This is a vintage Polaroid SX-70 Land Camera in excellent working condition. The camera has been fully refurbished and tested. It comes with the original leather case and manual.',
      sample_user_id,
      (SELECT id FROM public.categories WHERE slug = 'cameras'),
      'Used - Excellent',
      100.00,
      120.50,
      200.00,
      TRUE,
      TRUE,
      NOW() + INTERVAL '3 days'
    ),
    (
      'Apple iPhone 13 Pro - 256GB - Sierra Blue (Unlocked)',
      'Brand new, unopened Apple iPhone 13 Pro with 256GB storage in Sierra Blue. Factory unlocked for all carriers.',
      sample_user_id,
      (SELECT id FROM public.categories WHERE slug = 'smartphones'),
      'New',
      799.99,
      799.99,
      NULL,
      FALSE,
      TRUE,
      NOW() + INTERVAL '7 days'
    ),
    (
      'Vintage Leather Messenger Bag - Handcrafted Brown Satchel',
      'Handcrafted genuine leather messenger bag in rich brown color. Features multiple compartments, adjustable strap, and brass hardware. Perfect for daily use or travel.',
      sample_user_id,
      (SELECT id FROM public.categories WHERE slug = 'fashion'),
      'New',
      50.00,
      89.00,
      120.00,
      TRUE,
      TRUE,
      NOW() + INTERVAL '5 days'
    ),
    (
      'Sony WH-1000XM4 Wireless Noise Cancelling Headphones',
      'Industry-leading noise cancellation, exceptional sound quality, and long battery life. Includes carrying case, charging cable, and audio cable.',
      sample_user_id,
      (SELECT id FROM public.categories WHERE slug = 'electronics'),
      'New',
      249.99,
      249.99,
      NULL,
      FALSE,
      TRUE,
      NOW() + INTERVAL '10 days'
    ),
    (
      'Antique Bronze Pocket Watch with Chain - Working Condition',
      'Beautiful antique bronze pocket watch with intricate engravings. Fully functional with accurate timekeeping. Includes matching chain.',
      sample_user_id,
      (SELECT id FROM public.categories WHERE slug = 'jewelry-watches'),
      'Used - Good',
      30.00,
      45.00,
      NULL,
      TRUE,
      FALSE,
      NOW() + INTERVAL '2 days'
    );
    
    -- Add some sample bids
    INSERT INTO public.bids (product_id, bidder_id, amount)
    SELECT 
      p.id, 
      sample_user_id, 
      p.current_price
    FROM public.products p
    WHERE p.is_auction = TRUE
    LIMIT 3;
  END IF;
END $$;
