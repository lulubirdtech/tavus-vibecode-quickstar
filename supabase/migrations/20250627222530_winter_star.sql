/*
  # Populate recommendations table with medicine and food data

  1. New Data
    - Medicine items with prices in NGN and USD
    - Food items including African, USA, and global foods
    - Proper categorization and tagging
  
  2. Data Structure
    - All items have both NGN and USD pricing
    - Comprehensive tagging for easy filtering
    - In-stock status set to true by default
*/

-- Insert medicine recommendations
INSERT INTO recommendations (name, category, description, price_ngn, price_usd, image_url, in_stock, tags)
VALUES 
  ('Paracetamol 500mg (20 tablets)', 'medicine', 'Pain relief and fever reducer', 800.00, 2.00, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', true, ARRAY['painkiller', 'fever', 'common']),
  ('Ibuprofen 400mg (20 tablets)', 'medicine', 'Anti-inflammatory pain reliever', 1200.00, 3.00, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', true, ARRAY['anti-inflammatory', 'painkiller', 'common']),
  ('Vitamin C 1000mg (30 tablets)', 'supplement', 'Immune system booster', 2500.00, 6.25, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', true, ARRAY['vitamin', 'immunity', 'supplement']),
  ('Multivitamin Complex (30 tablets)', 'supplement', 'Complete daily vitamin supplement', 4000.00, 10.00, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', true, ARRAY['multivitamin', 'daily', 'supplement']),
  ('Zinc Tablets 50mg (30 tablets)', 'supplement', 'Essential mineral for immune health', 1800.00, 4.50, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', true, ARRAY['zinc', 'immunity', 'mineral']),
  ('Omega-3 Fish Oil (60 capsules)', 'supplement', 'Heart and brain health supplement', 6000.00, 15.00, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', true, ARRAY['omega-3', 'heart', 'brain']),
  ('Probiotics (30 capsules)', 'supplement', 'Digestive health support', 5500.00, 13.75, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', true, ARRAY['probiotics', 'digestive', 'gut-health']),
  ('Magnesium 400mg (60 tablets)', 'supplement', 'Muscle and nerve function support', 3200.00, 8.00, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', true, ARRAY['magnesium', 'muscle', 'nerve']),
  ('Iron Tablets 65mg (30 tablets)', 'supplement', 'Iron deficiency supplement', 2200.00, 5.50, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', true, ARRAY['iron', 'anemia', 'mineral']),
  ('Calcium + Vitamin D (60 tablets)', 'supplement', 'Bone health supplement', 3800.00, 9.50, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', true, ARRAY['calcium', 'vitamin-d', 'bone-health']);

-- Insert African foods
INSERT INTO recommendations (name, category, description, price_ngn, price_usd, image_url, in_stock, tags)
VALUES 
  ('Plantain (1kg)', 'food', 'Fresh green plantains', 800.00, 2.00, 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg', true, ARRAY['plantain', 'africa', 'carbohydrate']),
  ('Yam (1kg)', 'food', 'Fresh yam tubers', 1200.00, 3.00, 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg', true, ARRAY['yam', 'africa', 'carbohydrate']),
  ('Cassava (1kg)', 'food', 'Fresh cassava roots', 600.00, 1.50, 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg', true, ARRAY['cassava', 'africa', 'carbohydrate']),
  ('Sweet Potato (1kg)', 'food', 'Orange-fleshed sweet potatoes', 900.00, 2.25, 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg', true, ARRAY['sweet-potato', 'africa', 'vitamin-a']),
  ('Moringa Powder (250g)', 'food', 'Nutrient-dense superfood powder', 4500.00, 11.25, 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg', true, ARRAY['superfood', 'africa', 'nutrient-dense']),
  ('Baobab Powder (200g)', 'food', 'Vitamin C rich superfruit powder', 3800.00, 9.50, 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg', true, ARRAY['superfood', 'africa', 'vitamin-c']),
  ('Palm Oil (1L)', 'food', 'Red palm oil rich in vitamin A', 2500.00, 6.25, 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg', true, ARRAY['oil', 'africa', 'vitamin-a']),
  ('Groundnuts (500g)', 'food', 'Raw peanuts', 1500.00, 3.75, 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg', true, ARRAY['nuts', 'africa', 'protein']),
  ('Bitter Leaf (Fresh bunch)', 'food', 'Traditional African vegetable', 800.00, 2.00, 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg', true, ARRAY['vegetable', 'africa', 'traditional']),
  ('Okra (500g)', 'food', 'Fresh okra pods', 700.00, 1.75, 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg', true, ARRAY['vegetable', 'africa', 'fiber']);

-- Insert global fruits and vegetables
INSERT INTO recommendations (name, category, description, price_ngn, price_usd, image_url, in_stock, tags)
VALUES 
  ('Bananas (1kg)', 'food', 'Fresh ripe bananas', 1000.00, 2.50, 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg', true, ARRAY['fruit', 'potassium', 'global']),
  ('Oranges (1kg)', 'food', 'Fresh citrus oranges', 1200.00, 3.00, 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg', true, ARRAY['fruit', 'vitamin-c', 'citrus']),
  ('Apples (1kg)', 'food', 'Fresh red apples', 2000.00, 5.00, 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg', true, ARRAY['fruit', 'fiber', 'global']),
  ('Carrots (1kg)', 'food', 'Fresh orange carrots', 800.00, 2.00, 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg', true, ARRAY['vegetable', 'vitamin-a', 'global']),
  ('Spinach (500g)', 'food', 'Fresh green spinach leaves', 600.00, 1.50, 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg', true, ARRAY['vegetable', 'iron', 'leafy-green']),
  ('Tomatoes (1kg)', 'food', 'Fresh red tomatoes', 1500.00, 3.75, 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg', true, ARRAY['vegetable', 'lycopene', 'global']),
  ('Onions (1kg)', 'food', 'Fresh yellow onions', 800.00, 2.00, 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg', true, ARRAY['vegetable', 'flavor', 'global']),
  ('Garlic (250g)', 'food', 'Fresh garlic bulbs', 1200.00, 3.00, 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg', true, ARRAY['vegetable', 'immunity', 'flavor']),
  ('Ginger (250g)', 'food', 'Fresh ginger root', 1000.00, 2.50, 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg', true, ARRAY['spice', 'anti-inflammatory', 'digestive']),
  ('Avocado (3 pieces)', 'food', 'Fresh ripe avocados', 1800.00, 4.50, 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg', true, ARRAY['fruit', 'healthy-fats', 'global']);

-- Insert protein sources (meat and fish)
INSERT INTO recommendations (name, category, description, price_ngn, price_usd, image_url, in_stock, tags)
VALUES 
  ('Chicken Breast (1kg)', 'food', 'Fresh boneless chicken breast', 3500.00, 8.75, 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg', true, ARRAY['protein', 'chicken', 'lean']),
  ('Beef (1kg)', 'food', 'Fresh lean beef cuts', 5000.00, 12.50, 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg', true, ARRAY['protein', 'beef', 'iron']),
  ('Fish - Tilapia (1kg)', 'food', 'Fresh tilapia fish', 2800.00, 7.00, 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg', true, ARRAY['protein', 'fish', 'omega-3']),
  ('Fish - Mackerel (1kg)', 'food', 'Fresh mackerel fish', 3200.00, 8.00, 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg', true, ARRAY['protein', 'fish', 'omega-3']),
  ('Eggs (30 pieces)', 'food', 'Fresh chicken eggs', 2500.00, 6.25, 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg', true, ARRAY['protein', 'eggs', 'complete-protein']),
  ('Beans - Black Beans (1kg)', 'food', 'Dried black beans', 1800.00, 4.50, 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg', true, ARRAY['protein', 'legumes', 'fiber']),
  ('Lentils (1kg)', 'food', 'Red lentils', 2200.00, 5.50, 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg', true, ARRAY['protein', 'legumes', 'iron']),
  ('Quinoa (500g)', 'food', 'Organic quinoa grains', 4500.00, 11.25, 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg', true, ARRAY['protein', 'grain', 'complete-protein']),
  ('Almonds (500g)', 'food', 'Raw almonds', 3800.00, 9.50, 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg', true, ARRAY['nuts', 'protein', 'healthy-fats']),
  ('Greek Yogurt (500g)', 'food', 'Plain Greek yogurt', 2000.00, 5.00, 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg', true, ARRAY['dairy', 'protein', 'probiotics']);

-- Insert grains and staples
INSERT INTO recommendations (name, category, description, price_ngn, price_usd, image_url, in_stock, tags)
VALUES 
  ('Brown Rice (2kg)', 'food', 'Whole grain brown rice', 2500.00, 6.25, 'https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg', true, ARRAY['grain', 'carbohydrate', 'fiber']),
  ('Oats (1kg)', 'food', 'Rolled oats', 2200.00, 5.50, 'https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg', true, ARRAY['grain', 'fiber', 'heart-healthy']),
  ('Whole Wheat Bread (1 loaf)', 'food', 'Fresh whole wheat bread', 800.00, 2.00, 'https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg', true, ARRAY['grain', 'carbohydrate', 'fiber']),
  ('Millet (1kg)', 'food', 'Whole millet grains', 1800.00, 4.50, 'https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg', true, ARRAY['grain', 'africa', 'gluten-free']),
  ('Sorghum (1kg)', 'food', 'Whole sorghum grains', 1600.00, 4.00, 'https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg', true, ARRAY['grain', 'africa', 'gluten-free']),
  ('Coconut Oil (500ml)', 'food', 'Virgin coconut oil', 3500.00, 8.75, 'https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg', true, ARRAY['oil', 'healthy-fats', 'cooking']),
  ('Olive Oil (500ml)', 'food', 'Extra virgin olive oil', 4200.00, 10.50, 'https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg', true, ARRAY['oil', 'healthy-fats', 'mediterranean']),
  ('Honey (500g)', 'food', 'Pure natural honey', 3000.00, 7.50, 'https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg', true, ARRAY['sweetener', 'natural', 'antibacterial']),
  ('Chia Seeds (250g)', 'food', 'Organic chia seeds', 3200.00, 8.00, 'https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg', true, ARRAY['seeds', 'omega-3', 'fiber']),
  ('Flax Seeds (250g)', 'food', 'Ground flax seeds', 2800.00, 7.00, 'https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg', true, ARRAY['seeds', 'omega-3', 'fiber']);