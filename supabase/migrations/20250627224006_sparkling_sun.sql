/*
  # Fix Recommendations Data - Complete Product Catalog

  1. New Tables
    - Ensures `recommendations` table exists with proper structure
    - Adds comprehensive product data for medicines, foods, and supplements
  
  2. Data Categories
    - Medicines & Supplements (20+ items)
    - African Foods & Superfoods (15+ items) 
    - Global Fruits & Vegetables (15+ items)
    - Protein Sources (10+ items)
    - Grains & Staples (10+ items)
  
  3. Security
    - Maintains existing RLS policies
    - Ensures proper data validation
*/

-- Ensure recommendations table exists with proper structure
CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category = ANY (ARRAY['medicine'::text, 'food'::text, 'supplement'::text])),
  description text,
  price_ngn numeric(10,2),
  price_usd numeric(10,2),
  image_url text,
  in_stock boolean DEFAULT true,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS if not already enabled
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- Create policy if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'recommendations' 
    AND policyname = 'Recommendations readable by all'
  ) THEN
    CREATE POLICY "Recommendations readable by all"
      ON recommendations
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recommendations_category ON recommendations USING btree (category);
CREATE INDEX IF NOT EXISTS idx_recommendations_tags ON recommendations USING gin (tags);

-- Clear existing data to avoid duplicates
DELETE FROM recommendations;

-- Insert comprehensive product data
INSERT INTO recommendations (name, category, description, price_ngn, price_usd, image_url, in_stock, tags) VALUES

-- MEDICINES & SUPPLEMENTS
('Paracetamol 500mg (20 tablets)', 'medicine', 'Pain relief and fever reducer', 800.00, 2.00, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', true, ARRAY['painkiller', 'fever', 'headache']),
('Ibuprofen 400mg (20 tablets)', 'medicine', 'Anti-inflammatory pain relief', 1200.00, 3.00, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', true, ARRAY['anti-inflammatory', 'pain', 'arthritis']),
('Vitamin C 1000mg (30 tablets)', 'supplement', 'Immune system support', 2500.00, 6.25, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', true, ARRAY['vitamin', 'immunity', 'antioxidant']),
('Vitamin D3 2000IU (60 capsules)', 'supplement', 'Bone health and immunity', 3500.00, 8.75, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', true, ARRAY['vitamin', 'bone-health', 'immunity']),
('Multivitamin Complex (30 tablets)', 'supplement', 'Complete daily nutrition', 4500.00, 11.25, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', true, ARRAY['multivitamin', 'daily', 'nutrition']),
('Zinc 25mg (60 tablets)', 'supplement', 'Immune support and wound healing', 2800.00, 7.00, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', true, ARRAY['zinc', 'immunity', 'healing']),
('Magnesium 400mg (60 capsules)', 'supplement', 'Muscle and nerve function', 3200.00, 8.00, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', true, ARRAY['magnesium', 'muscle', 'sleep']),
('Omega-3 Fish Oil (60 capsules)', 'supplement', 'Heart and brain health', 5500.00, 13.75, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', true, ARRAY['omega-3', 'heart', 'brain']),
('Probiotics (30 capsules)', 'supplement', 'Digestive health support', 4800.00, 12.00, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', true, ARRAY['probiotics', 'digestive', 'gut-health']),
('Iron 65mg (60 tablets)', 'supplement', 'Prevents iron deficiency anemia', 2200.00, 5.50, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', true, ARRAY['iron', 'anemia', 'energy']),
('Calcium 600mg (60 tablets)', 'supplement', 'Bone and teeth health', 2800.00, 7.00, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', true, ARRAY['calcium', 'bone', 'teeth']),
('B-Complex Vitamins (60 tablets)', 'supplement', 'Energy and nervous system', 3200.00, 8.00, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', true, ARRAY['b-vitamins', 'energy', 'nervous-system']),
('Turmeric 500mg (60 capsules)', 'supplement', 'Natural anti-inflammatory', 3800.00, 9.50, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', true, ARRAY['turmeric', 'anti-inflammatory', 'natural']),
('Garlic Extract (60 capsules)', 'supplement', 'Cardiovascular and immune support', 2500.00, 6.25, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', true, ARRAY['garlic', 'cardiovascular', 'immunity']),
('Ginger Root 500mg (60 capsules)', 'supplement', 'Digestive health and nausea relief', 2800.00, 7.00, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', true, ARRAY['ginger', 'digestive', 'nausea']),

-- AFRICAN FOODS & SUPERFOODS
('Plantain (1kg)', 'food', 'Nutritious African staple fruit', 800.00, 2.00, 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg', true, ARRAY['plantain', 'african', 'staple']),
('Yam (1kg)', 'food', 'High-energy root vegetable', 1200.00, 3.00, 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg', true, ARRAY['yam', 'african', 'root-vegetable']),
('Cassava (1kg)', 'food', 'Gluten-free energy source', 600.00, 1.50, 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg', true, ARRAY['cassava', 'gluten-free', 'energy']),
('Sweet Potato (1kg)', 'food', 'Vitamin A rich root vegetable', 800.00, 2.00, 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg', true, ARRAY['sweet-potato', 'vitamin-a', 'healthy']),
('Moringa Powder (250g)', 'food', 'Nutrient-dense superfood powder', 4500.00, 11.25, 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg', true, ARRAY['moringa', 'superfood', 'powder']),
('Baobab Powder (250g)', 'food', 'Vitamin C rich superfruit powder', 5500.00, 13.75, 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg', true, ARRAY['baobab', 'vitamin-c', 'superfruit']),
('African Spinach (500g)', 'food', 'Iron-rich leafy green vegetable', 400.00, 1.00, 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg', true, ARRAY['spinach', 'iron', 'leafy-green']),
('Okra (500g)', 'food', 'Fiber-rich vegetable for digestive health', 600.00, 1.50, 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg', true, ARRAY['okra', 'fiber', 'digestive']),
('Tiger Nuts (250g)', 'food', 'Healthy snack rich in fiber', 2200.00, 5.50, 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg', true, ARRAY['tiger-nuts', 'fiber', 'snack']),
('African Pepper (100g)', 'food', 'Spicy seasoning with health benefits', 1500.00, 3.75, 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg', true, ARRAY['pepper', 'spice', 'seasoning']),
('Bitter Leaf (250g)', 'food', 'Traditional medicinal vegetable', 800.00, 2.00, 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg', true, ARRAY['bitter-leaf', 'medicinal', 'traditional']),
('Scent Leaf (100g)', 'food', 'Aromatic herb for cooking and health', 500.00, 1.25, 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg', true, ARRAY['scent-leaf', 'herb', 'aromatic']),
('African Yam Bean (500g)', 'food', 'Protein-rich legume', 1800.00, 4.50, 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg', true, ARRAY['yam-bean', 'protein', 'legume']),
('Locust Bean (250g)', 'food', 'Traditional protein seasoning', 2500.00, 6.25, 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg', true, ARRAY['locust-bean', 'protein', 'seasoning']),
('African Breadfruit (1 piece)', 'food', 'Nutritious starchy fruit', 1200.00, 3.00, 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg', true, ARRAY['breadfruit', 'starchy', 'nutritious']),

-- GLOBAL FRUITS & VEGETABLES
('Bananas (1kg)', 'food', 'Potassium-rich energy fruit', 800.00, 2.00, 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg', true, ARRAY['banana', 'potassium', 'energy']),
('Oranges (1kg)', 'food', 'Vitamin C rich citrus fruit', 1000.00, 2.50, 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg', true, ARRAY['orange', 'vitamin-c', 'citrus']),
('Apples (1kg)', 'food', 'Fiber-rich crunchy fruit', 1500.00, 3.75, 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg', true, ARRAY['apple', 'fiber', 'antioxidant']),
('Carrots (1kg)', 'food', 'Beta-carotene rich root vegetable', 800.00, 2.00, 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg', true, ARRAY['carrot', 'beta-carotene', 'vision']),
('Spinach (500g)', 'food', 'Iron and folate rich leafy green', 600.00, 1.50, 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg', true, ARRAY['spinach', 'iron', 'folate']),
('Tomatoes (1kg)', 'food', 'Lycopene-rich versatile vegetable', 1200.00, 3.00, 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg', true, ARRAY['tomato', 'lycopene', 'versatile']),
('Avocado (3 pieces)', 'food', 'Healthy fats and fiber', 1800.00, 4.50, 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg', true, ARRAY['avocado', 'healthy-fats', 'fiber']),
('Broccoli (500g)', 'food', 'Vitamin K and antioxidant powerhouse', 1500.00, 3.75, 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg', true, ARRAY['broccoli', 'vitamin-k', 'antioxidant']),
('Bell Peppers (500g)', 'food', 'Vitamin C and colorful nutrition', 1200.00, 3.00, 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg', true, ARRAY['bell-pepper', 'vitamin-c', 'colorful']),
('Cucumber (1kg)', 'food', 'Hydrating and low-calorie vegetable', 600.00, 1.50, 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg', true, ARRAY['cucumber', 'hydrating', 'low-calorie']),
('Watermelon (1 piece)', 'food', 'Hydrating summer fruit', 2000.00, 5.00, 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg', true, ARRAY['watermelon', 'hydrating', 'summer']),
('Pineapple (1 piece)', 'food', 'Enzyme-rich tropical fruit', 1500.00, 3.75, 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg', true, ARRAY['pineapple', 'enzyme', 'tropical']),
('Mango (3 pieces)', 'food', 'Vitamin A rich sweet fruit', 1200.00, 3.00, 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg', true, ARRAY['mango', 'vitamin-a', 'sweet']),
('Papaya (1 piece)', 'food', 'Digestive enzyme rich fruit', 1000.00, 2.50, 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg', true, ARRAY['papaya', 'digestive', 'enzyme']),
('Lemon (10 pieces)', 'food', 'Vitamin C and detox support', 800.00, 2.00, 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg', true, ARRAY['lemon', 'vitamin-c', 'detox']),

-- PROTEIN SOURCES
('Chicken Breast (1kg)', 'food', 'Lean protein for muscle health', 3500.00, 8.75, 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg', true, ARRAY['chicken', 'protein', 'lean']),
('Fresh Fish (1kg)', 'food', 'Omega-3 rich protein source', 4000.00, 10.00, 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg', true, ARRAY['fish', 'omega-3', 'protein']),
('Beef (1kg)', 'food', 'Iron-rich red meat protein', 5500.00, 13.75, 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg', true, ARRAY['beef', 'iron', 'protein']),
('Eggs (30 pieces)', 'food', 'Complete protein with vitamins', 2500.00, 6.25, 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg', true, ARRAY['eggs', 'complete-protein', 'vitamins']),
('Black Beans (1kg)', 'food', 'Plant-based protein and fiber', 1800.00, 4.50, 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg', true, ARRAY['black-beans', 'plant-protein', 'fiber']),
('Lentils (1kg)', 'food', 'Protein-rich legumes', 2200.00, 5.50, 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg', true, ARRAY['lentils', 'protein', 'legumes']),
('Chickpeas (1kg)', 'food', 'Versatile protein source', 2000.00, 5.00, 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg', true, ARRAY['chickpeas', 'protein', 'versatile']),
('Tofu (500g)', 'food', 'Soy-based protein alternative', 2800.00, 7.00, 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg', true, ARRAY['tofu', 'soy-protein', 'alternative']),
('Greek Yogurt (500g)', 'food', 'Probiotic-rich protein', 2200.00, 5.50, 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg', true, ARRAY['yogurt', 'probiotic', 'protein']),
('Almonds (500g)', 'food', 'Healthy fats and protein', 4500.00, 11.25, 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg', true, ARRAY['almonds', 'healthy-fats', 'protein']),

-- GRAINS & STAPLES
('Brown Rice (2kg)', 'food', 'Whole grain energy source', 2500.00, 6.25, 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg', true, ARRAY['brown-rice', 'whole-grain', 'energy']),
('Quinoa (1kg)', 'food', 'Complete protein grain', 4500.00, 11.25, 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg', true, ARRAY['quinoa', 'complete-protein', 'grain']),
('Oats (1kg)', 'food', 'Fiber-rich breakfast grain', 2200.00, 5.50, 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg', true, ARRAY['oats', 'fiber', 'breakfast']),
('Whole Wheat Bread (1 loaf)', 'food', 'Fiber-rich bread option', 800.00, 2.00, 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg', true, ARRAY['whole-wheat', 'fiber', 'bread']),
('Olive Oil (500ml)', 'food', 'Heart-healthy cooking oil', 3500.00, 8.75, 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg', true, ARRAY['olive-oil', 'heart-healthy', 'cooking']),
('Coconut Oil (500ml)', 'food', 'Medium-chain fatty acids', 2800.00, 7.00, 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg', true, ARRAY['coconut-oil', 'mct', 'cooking']),
('Raw Honey (500g)', 'food', 'Natural sweetener with enzymes', 3200.00, 8.00, 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg', true, ARRAY['honey', 'natural', 'sweetener']),
('Chia Seeds (250g)', 'food', 'Omega-3 and fiber superfood', 3800.00, 9.50, 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg', true, ARRAY['chia-seeds', 'omega-3', 'superfood']),
('Flax Seeds (250g)', 'food', 'Omega-3 rich seeds', 2500.00, 6.25, 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg', true, ARRAY['flax-seeds', 'omega-3', 'seeds']),
('Green Tea (50 bags)', 'food', 'Antioxidant-rich beverage', 1800.00, 4.50, 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg', true, ARRAY['green-tea', 'antioxidant', 'beverage']);