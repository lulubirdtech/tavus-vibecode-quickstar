/*
  # Populate recommendations with global foods and medicines

  1. New Data
    - Popular medicines from Africa, USA, and worldwide
    - Common foods, fruits, vegetables, meat, and fish
    - Prices in both NGN and USD
  2. Categories
    - medicine: Common medications and supplements
    - food: Fruits, vegetables, grains, proteins
    - supplement: Vitamins and health supplements
*/

-- Insert medicines
INSERT INTO recommendations (name, category, description, price_ngn, price_usd, image_url, tags) VALUES
-- Common Pain Relief
('Paracetamol 500mg', 'medicine', 'Pain relief and fever reducer', 150.00, 0.10, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', ARRAY['pain-relief', 'fever', 'headache']),
('Ibuprofen 400mg', 'medicine', 'Anti-inflammatory pain reliever', 200.00, 0.13, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', ARRAY['pain-relief', 'inflammation', 'fever']),
('Aspirin 75mg', 'medicine', 'Low-dose aspirin for heart health', 180.00, 0.12, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', ARRAY['heart-health', 'blood-thinner']),

-- Antibiotics (Common)
('Amoxicillin 500mg', 'medicine', 'Broad-spectrum antibiotic', 800.00, 0.53, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', ARRAY['antibiotic', 'infection']),
('Ciprofloxacin 500mg', 'medicine', 'Antibiotic for bacterial infections', 1200.00, 0.80, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', ARRAY['antibiotic', 'uti', 'respiratory']),

-- Digestive Health
('ORS Sachets', 'medicine', 'Oral rehydration salts', 50.00, 0.03, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', ARRAY['dehydration', 'diarrhea', 'electrolytes']),
('Loperamide 2mg', 'medicine', 'Anti-diarrheal medication', 300.00, 0.20, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', ARRAY['diarrhea', 'digestive']),

-- Malaria (Africa-specific)
('Artemether-Lumefantrine', 'medicine', 'Anti-malarial medication', 1500.00, 1.00, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', ARRAY['malaria', 'antimalarial', 'africa']),
('Chloroquine 250mg', 'medicine', 'Malaria prevention and treatment', 400.00, 0.27, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', ARRAY['malaria', 'prevention']),

-- Vitamins and Supplements
('Vitamin C 1000mg', 'supplement', 'Immune system support', 800.00, 0.53, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', ARRAY['vitamin', 'immune', 'antioxidant']),
('Vitamin D3 1000IU', 'supplement', 'Bone health and immunity', 1200.00, 0.80, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', ARRAY['vitamin', 'bone-health', 'immunity']),
('Multivitamin Complex', 'supplement', 'Daily nutritional support', 2000.00, 1.33, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', ARRAY['multivitamin', 'daily-health']),
('Iron Tablets 65mg', 'supplement', 'Iron deficiency supplement', 600.00, 0.40, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', ARRAY['iron', 'anemia', 'energy']),
('Calcium + Magnesium', 'supplement', 'Bone and muscle health', 1500.00, 1.00, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', ARRAY['calcium', 'magnesium', 'bone-health']),

-- Fruits
('Bananas (1kg)', 'food', 'Rich in potassium and energy', 500.00, 0.33, 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg', ARRAY['fruit', 'potassium', 'energy']),
('Oranges (1kg)', 'food', 'High in Vitamin C', 800.00, 0.53, 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg', ARRAY['fruit', 'vitamin-c', 'citrus']),
('Apples (1kg)', 'food', 'Fiber and antioxidants', 1200.00, 0.80, 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg', ARRAY['fruit', 'fiber', 'antioxidants']),
('Pineapple (1 piece)', 'food', 'Digestive enzymes and Vitamin C', 600.00, 0.40, 'https://images.pexels.com/photos/947879/pexels-photo-947879.jpeg', ARRAY['fruit', 'digestive', 'tropical']),
('Watermelon (1kg)', 'food', 'Hydrating and low calorie', 400.00, 0.27, 'https://images.pexels.com/photos/1313267/pexels-photo-1313267.jpeg', ARRAY['fruit', 'hydrating', 'low-calorie']),
('Avocado (1 piece)', 'food', 'Healthy fats and fiber', 300.00, 0.20, 'https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg', ARRAY['fruit', 'healthy-fats', 'fiber']),
('Mango (1kg)', 'food', 'Vitamin A and tropical flavor', 700.00, 0.47, 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg', ARRAY['fruit', 'vitamin-a', 'tropical']),

-- Vegetables
('Tomatoes (1kg)', 'food', 'Lycopene and Vitamin C', 600.00, 0.40, 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg', ARRAY['vegetable', 'lycopene', 'vitamin-c']),
('Onions (1kg)', 'food', 'Antioxidants and flavor base', 400.00, 0.27, 'https://images.pexels.com/photos/533342/pexels-photo-533342.jpeg', ARRAY['vegetable', 'antioxidants', 'cooking']),
('Spinach (500g)', 'food', 'Iron and folate rich', 300.00, 0.20, 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg', ARRAY['vegetable', 'iron', 'folate', 'leafy-green']),
('Carrots (1kg)', 'food', 'Beta-carotene for eye health', 500.00, 0.33, 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg', ARRAY['vegetable', 'beta-carotene', 'eye-health']),
('Sweet Potatoes (1kg)', 'food', 'Complex carbs and Vitamin A', 800.00, 0.53, 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg', ARRAY['vegetable', 'carbohydrates', 'vitamin-a']),
('Bell Peppers (500g)', 'food', 'Vitamin C and antioxidants', 700.00, 0.47, 'https://images.pexels.com/photos/1268101/pexels-photo-1268101.jpeg', ARRAY['vegetable', 'vitamin-c', 'antioxidants']),

-- Grains and Staples
('Brown Rice (1kg)', 'food', 'Whole grain with fiber', 800.00, 0.53, 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg', ARRAY['grain', 'fiber', 'whole-grain']),
('Quinoa (500g)', 'food', 'Complete protein grain', 2000.00, 1.33, 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg', ARRAY['grain', 'protein', 'superfood']),
('Oats (1kg)', 'food', 'Heart-healthy breakfast grain', 1200.00, 0.80, 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg', ARRAY['grain', 'heart-healthy', 'breakfast']),
('Whole Wheat Bread (1 loaf)', 'food', 'Fiber-rich bread', 400.00, 0.27, 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg', ARRAY['grain', 'fiber', 'bread']),

-- Proteins
('Chicken Breast (1kg)', 'food', 'Lean protein source', 2500.00, 1.67, 'https://images.pexels.com/photos/616354/pexels-photo-616354.jpeg', ARRAY['protein', 'lean', 'poultry']),
('Salmon Fillet (500g)', 'food', 'Omega-3 rich fish', 4000.00, 2.67, 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg', ARRAY['protein', 'omega-3', 'fish']),
('Tilapia (1kg)', 'food', 'Affordable white fish', 2000.00, 1.33, 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg', ARRAY['protein', 'fish', 'affordable']),
('Eggs (12 pieces)', 'food', 'Complete protein and vitamins', 800.00, 0.53, 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg', ARRAY['protein', 'vitamins', 'versatile']),
('Lean Beef (1kg)', 'food', 'Iron and protein rich', 3500.00, 2.33, 'https://images.pexels.com/photos/616354/pexels-photo-616354.jpeg', ARRAY['protein', 'iron', 'beef']),
('Black Beans (500g)', 'food', 'Plant protein and fiber', 600.00, 0.40, 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', ARRAY['protein', 'plant-based', 'fiber']),

-- Dairy and Alternatives
('Greek Yogurt (500g)', 'food', 'Probiotics and protein', 1200.00, 0.80, 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg', ARRAY['dairy', 'probiotics', 'protein']),
('Milk (1 liter)', 'food', 'Calcium and protein', 500.00, 0.33, 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg', ARRAY['dairy', 'calcium', 'protein']),
('Almonds (250g)', 'food', 'Healthy fats and protein', 1500.00, 1.00, 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg', ARRAY['nuts', 'healthy-fats', 'protein']),

-- African Staples
('Plantain (1kg)', 'food', 'Starchy fruit rich in potassium', 600.00, 0.40, 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg', ARRAY['fruit', 'starchy', 'african', 'potassium']),
('Yam (1kg)', 'food', 'Complex carbohydrates', 800.00, 0.53, 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg', ARRAY['vegetable', 'carbohydrates', 'african']),
('Cassava (1kg)', 'food', 'Gluten-free carbohydrate source', 500.00, 0.33, 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg', ARRAY['vegetable', 'gluten-free', 'african']),
('Palm Oil (500ml)', 'food', 'Traditional cooking oil', 800.00, 0.53, 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg', ARRAY['oil', 'cooking', 'african']),

-- Specialty Items
('Moringa Powder (100g)', 'supplement', 'Superfood powder rich in nutrients', 1500.00, 1.00, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', ARRAY['superfood', 'african', 'nutrients']),
('Baobab Powder (100g)', 'supplement', 'Vitamin C rich superfruit', 2000.00, 1.33, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', ARRAY['superfood', 'vitamin-c', 'african']),
('Honey (500g)', 'food', 'Natural sweetener with antibacterial properties', 1200.00, 0.80, 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg', ARRAY['sweetener', 'natural', 'antibacterial'])

ON CONFLICT (name) DO NOTHING;