-- Insert doctors with Tavus integration
INSERT INTO doctors (name, specialty, description, icon, tavus_replica_id, tavus_persona_id, is_premium, consultation_price) VALUES
-- Default General Physician (Free)
('Dr. Sarah Johnson', 'General Physician', 'Experienced general practitioner specializing in primary care, preventive medicine, and common health conditions. Available for comprehensive health consultations.', '🩺', 'rb17cf590e15', 'pdcdad5c5f0e', false, 0.00),

-- Premium Specialists
('Dr. Michael Chen', 'Cardiologist', 'Board-certified cardiologist with 15+ years experience in heart disease prevention, diagnosis, and treatment. Specializes in hypertension and cardiac rehabilitation.', '❤️', 'rb17cf590e16', 'pdcdad5c5f1e', true, 5000.00),

('Dr. Amara Okafor', 'Dermatologist', 'Expert dermatologist specializing in skin conditions, acne treatment, and cosmetic dermatology. Experienced in treating diverse skin types and conditions.', '🧴', 'rb17cf590e17', 'pdcdad5c5f2e', true, 4500.00),

('Dr. James Rodriguez', 'Orthopedic Surgeon', 'Orthopedic specialist focusing on bone, joint, and muscle disorders. Expert in sports injuries, arthritis, and joint replacement procedures.', '🦴', 'rb17cf590e18', 'pdcdad5c5f3e', true, 6000.00),

('Dr. Fatima Al-Rashid', 'Pediatrician', 'Dedicated pediatrician with expertise in child health, development, and vaccination schedules. Specializes in treating infants, children, and adolescents.', '👶', 'rb17cf590e19', 'pdcdad5c5f4e', true, 4000.00),

('Dr. Robert Kim', 'Neurologist', 'Neurologist specializing in brain and nervous system disorders. Expert in treating headaches, epilepsy, stroke, and neurodegenerative diseases.', '🧠', 'rb17cf590e20', 'pdcdad5c5f5e', true, 7000.00),

('Dr. Priya Sharma', 'Gynecologist', 'Women health specialist with expertise in reproductive health, pregnancy care, and gynecological conditions. Provides comprehensive women healthcare.', '🤱', 'rb17cf590e21', 'pdcdad5c5f6e', true, 5500.00),

('Dr. David Thompson', 'Psychiatrist', 'Mental health specialist focusing on anxiety, depression, and behavioral disorders. Provides therapy and medication management for mental wellness.', '🧘', 'rb17cf590e22', 'pdcdad5c5f7e', true, 6500.00),

('Dr. Aisha Kone', 'Infectious Disease Specialist', 'Expert in tropical diseases, HIV/AIDS, malaria, and tuberculosis. Specializes in infectious disease prevention and treatment in African contexts.', '🦠', 'rb17cf590e23', 'pdcdad5c5f8e', true, 5000.00),

('Dr. Mark Williams', 'Gastroenterologist', 'Digestive system specialist treating conditions like IBS, ulcers, and liver diseases. Expert in endoscopic procedures and digestive health.', '🫃', 'rb17cf590e24', 'pdcdad5c5f9e', true, 5500.00),

-- Additional Free Specialists
('Dr. Lisa Park', 'Nutritionist', 'Certified nutritionist specializing in dietary planning, weight management, and nutrition therapy for various health conditions.', '🥗', 'rb17cf590e25', 'pdcdad5c5f0f', false, 0.00),

('Dr. Ahmed Hassan', 'Emergency Medicine', 'Emergency medicine physician with expertise in acute care, trauma, and critical conditions. Available for urgent medical consultations.', '🚨', 'rb17cf590e26', 'pdcdad5c5f1f', false, 0.00);

-- Insert comprehensive medicine and food recommendations
INSERT INTO recommendations (name, category, description, price_ngn, price_usd, tags) VALUES
-- Common Medicines (Africa, USA, World)
('Paracetamol 500mg (20 tablets)', 'medicine', 'Pain relief and fever reducer - most commonly used worldwide', 800.00, 2.00, ARRAY['pain', 'fever', 'headache', 'common']),
('Ibuprofen 400mg (20 tablets)', 'medicine', 'Anti-inflammatory pain reliever', 1200.00, 3.00, ARRAY['pain', 'inflammation', 'fever']),
('Aspirin 75mg (30 tablets)', 'medicine', 'Blood thinner and pain relief', 600.00, 1.50, ARRAY['heart', 'pain', 'blood-thinner']),
('Amoxicillin 250mg (21 capsules)', 'medicine', 'Antibiotic for bacterial infections', 2000.00, 5.00, ARRAY['antibiotic', 'infection']),
('Chloroquine 250mg (20 tablets)', 'medicine', 'Anti-malarial medication - essential in Africa', 1500.00, 3.75, ARRAY['malaria', 'africa', 'antimalarial']),
('Artemether-Lumefantrine (Coartem)', 'medicine', 'WHO recommended malaria treatment', 3500.00, 8.75, ARRAY['malaria', 'who-approved', 'africa']),
('ORS Sachets (10 pack)', 'medicine', 'Oral rehydration salts for diarrhea', 500.00, 1.25, ARRAY['diarrhea', 'dehydration', 'essential']),
('Multivitamin Complex (30 tablets)', 'supplement', 'Daily vitamin and mineral supplement', 4000.00, 10.00, ARRAY['vitamin', 'daily', 'health']),
('Vitamin C 1000mg (30 tablets)', 'supplement', 'Immune system booster', 2500.00, 6.25, ARRAY['vitamin', 'immunity', 'antioxidant']),
('Vitamin D3 1000IU (30 tablets)', 'supplement', 'Bone health and immunity', 3000.00, 7.50, ARRAY['vitamin', 'bone', 'immunity']),
('Iron Tablets 65mg (30 tablets)', 'supplement', 'Iron deficiency and anemia treatment', 1800.00, 4.50, ARRAY['iron', 'anemia', 'blood']),
('Zinc Tablets 50mg (30 tablets)', 'supplement', 'Essential mineral for immune function', 2200.00, 5.50, ARRAY['mineral', 'immunity', 'healing']),
('Calcium + Magnesium (60 tablets)', 'supplement', 'Bone and muscle health', 3500.00, 8.75, ARRAY['bone', 'muscle', 'calcium']),
('Omega-3 Fish Oil (60 capsules)', 'supplement', 'Heart and brain health', 5000.00, 12.50, ARRAY['omega-3', 'heart', 'brain']),
('Probiotics (30 capsules)', 'supplement', 'Digestive health and gut flora', 4500.00, 11.25, ARRAY['probiotic', 'digestive', 'gut']),

-- Staple Foods (Africa, USA, World)
('Rice (5kg bag)', 'food', 'White rice - staple food worldwide', 4000.00, 10.00, ARRAY['staple', 'carbs', 'worldwide']),
('Brown Rice (2kg)', 'food', 'Whole grain rice with more nutrients', 3500.00, 8.75, ARRAY['whole-grain', 'fiber', 'healthy']),
('Beans (2kg)', 'food', 'Protein-rich legumes - African staple', 3000.00, 7.50, ARRAY['protein', 'africa', 'legumes']),
('Lentils (1kg)', 'food', 'High protein legumes', 2500.00, 6.25, ARRAY['protein', 'legumes', 'iron']),
('Quinoa (500g)', 'food', 'Complete protein superfood', 4500.00, 11.25, ARRAY['superfood', 'protein', 'complete']),
('Sweet Potatoes (3kg)', 'food', 'Vitamin A rich root vegetable', 2000.00, 5.00, ARRAY['vitamin-a', 'carbs', 'africa']),
('Cassava Flour (2kg)', 'food', 'Gluten-free flour from cassava root', 2500.00, 6.25, ARRAY['gluten-free', 'africa', 'flour']),
('Plantains (2kg)', 'food', 'Starchy banana variety - African staple', 1500.00, 3.75, ARRAY['africa', 'carbs', 'potassium']),
('Yam (2kg)', 'food', 'Starchy tuber vegetable', 2200.00, 5.50, ARRAY['africa', 'carbs', 'fiber']),

-- Vegetables (Common worldwide)
('Spinach (500g)', 'food', 'Iron-rich leafy green vegetable', 800.00, 2.00, ARRAY['iron', 'vegetable', 'leafy-green']),
('Kale (500g)', 'food', 'Nutrient-dense superfood green', 1200.00, 3.00, ARRAY['superfood', 'vitamin-k', 'antioxidant']),
('Tomatoes (2kg)', 'food', 'Lycopene-rich fruit vegetable', 1500.00, 3.75, ARRAY['lycopene', 'vitamin-c', 'antioxidant']),
('Onions (2kg)', 'food', 'Flavoring vegetable with health benefits', 1200.00, 3.00, ARRAY['flavoring', 'antioxidant', 'common']),
('Garlic (500g)', 'food', 'Natural antibiotic and immune booster', 2000.00, 5.00, ARRAY['antibiotic', 'immunity', 'natural']),
('Carrots (1kg)', 'food', 'Beta-carotene rich root vegetable', 1000.00, 2.50, ARRAY['beta-carotene', 'vitamin-a', 'eye-health']),
('Bell Peppers (1kg)', 'food', 'Vitamin C rich colorful vegetables', 2500.00, 6.25, ARRAY['vitamin-c', 'antioxidant', 'colorful']),
('Broccoli (1kg)', 'food', 'Cruciferous vegetable with multiple nutrients', 2000.00, 5.00, ARRAY['cruciferous', 'vitamin-c', 'fiber']),
('Cabbage (1 head)', 'food', 'Affordable cruciferous vegetable', 500.00, 1.25, ARRAY['cruciferous', 'affordable', 'fiber']),
('Okra (500g)', 'food', 'Mucilaginous vegetable popular in Africa', 800.00, 2.00, ARRAY['africa', 'fiber', 'folate']),

-- Fruits (Common worldwide)
('Bananas (2kg)', 'food', 'Potassium-rich fruit - available worldwide', 1500.00, 3.75, ARRAY['potassium', 'worldwide', 'energy']),
('Oranges (2kg)', 'food', 'Vitamin C rich citrus fruit', 2000.00, 5.00, ARRAY['vitamin-c', 'citrus', 'immunity']),
('Apples (1kg)', 'food', 'Fiber-rich fruit with antioxidants', 2500.00, 6.25, ARRAY['fiber', 'antioxidant', 'pectin']),
('Mangoes (2kg)', 'food', 'Vitamin A rich tropical fruit', 3000.00, 7.50, ARRAY['vitamin-a', 'tropical', 'africa']),
('Papayas (2kg)', 'food', 'Digestive enzyme rich tropical fruit', 2500.00, 6.25, ARRAY['digestive', 'tropical', 'vitamin-c']),
('Avocados (1kg)', 'food', 'Healthy fats and nutrients', 4000.00, 10.00, ARRAY['healthy-fats', 'nutrition', 'monounsaturated']),
('Watermelon (3kg)', 'food', 'Hydrating fruit with lycopene', 1500.00, 3.75, ARRAY['hydrating', 'lycopene', 'summer']),
('Pineapple (1 whole)', 'food', 'Bromelain enzyme rich tropical fruit', 2000.00, 5.00, ARRAY['bromelain', 'tropical', 'digestive']),
('Lemons (1kg)', 'food', 'Vitamin C and citric acid rich', 2500.00, 6.25, ARRAY['vitamin-c', 'citric-acid', 'detox']),
('Grapes (1kg)', 'food', 'Antioxidant-rich fruit', 4000.00, 10.00, ARRAY['antioxidant', 'resveratrol', 'heart']),

-- Protein Sources
('Chicken Breast (1kg)', 'food', 'Lean protein source', 4500.00, 11.25, ARRAY['protein', 'lean', 'poultry']),
('Beef (1kg)', 'food', 'Iron-rich red meat protein', 6000.00, 15.00, ARRAY['protein', 'iron', 'red-meat']),
('Fish - Tilapia (1kg)', 'food', 'Affordable white fish protein', 3500.00, 8.75, ARRAY['protein', 'fish', 'affordable']),
('Salmon Fillet (500g)', 'food', 'Omega-3 rich fatty fish', 8000.00, 20.00, ARRAY['omega-3', 'protein', 'fatty-fish']),
('Eggs (30 pieces)', 'food', 'Complete protein source', 3000.00, 7.50, ARRAY['protein', 'complete', 'affordable']),
('Milk (2 liters)', 'food', 'Calcium and protein rich dairy', 2000.00, 5.00, ARRAY['calcium', 'protein', 'dairy']),
('Greek Yogurt (1kg)', 'food', 'Probiotic-rich protein source', 4000.00, 10.00, ARRAY['probiotic', 'protein', 'calcium']),
('Cheese (500g)', 'food', 'Calcium and protein rich dairy', 3500.00, 8.75, ARRAY['calcium', 'protein', 'dairy']),

-- Nuts and Seeds
('Groundnuts/Peanuts (1kg)', 'food', 'Affordable protein and healthy fats', 2500.00, 6.25, ARRAY['protein', 'healthy-fats', 'africa']),
('Almonds (500g)', 'food', 'Vitamin E rich nuts', 5000.00, 12.50, ARRAY['vitamin-e', 'healthy-fats', 'protein']),
('Walnuts (500g)', 'food', 'Omega-3 rich nuts for brain health', 6000.00, 15.00, ARRAY['omega-3', 'brain', 'healthy-fats']),
('Sunflower Seeds (500g)', 'food', 'Vitamin E and healthy fats', 2000.00, 5.00, ARRAY['vitamin-e', 'healthy-fats', 'seeds']),
('Pumpkin Seeds (500g)', 'food', 'Zinc and magnesium rich seeds', 3000.00, 7.50, ARRAY['zinc', 'magnesium', 'seeds']),

-- Grains and Cereals
('Oats (1kg)', 'food', 'Fiber-rich whole grain cereal', 2500.00, 6.25, ARRAY['fiber', 'whole-grain', 'heart-healthy']),
('Whole Wheat Bread (1 loaf)', 'food', 'Fiber-rich bread option', 1500.00, 3.75, ARRAY['fiber', 'whole-grain', 'bread']),
('Millet (1kg)', 'food', 'Gluten-free ancient grain', 2000.00, 5.00, ARRAY['gluten-free', 'ancient-grain', 'africa']),
('Sorghum (1kg)', 'food', 'Drought-resistant grain popular in Africa', 1800.00, 4.50, ARRAY['africa', 'gluten-free', 'drought-resistant']),

-- Cooking Essentials
('Olive Oil (500ml)', 'food', 'Heart-healthy cooking oil', 4000.00, 10.00, ARRAY['heart-healthy', 'monounsaturated', 'cooking']),
('Coconut Oil (500ml)', 'food', 'Medium-chain fatty acid rich oil', 3500.00, 8.75, ARRAY['mct', 'cooking', 'tropical']),
('Palm Oil (1 liter)', 'food', 'Traditional African cooking oil', 2500.00, 6.25, ARRAY['africa', 'cooking', 'traditional']),
('Honey (500g)', 'food', 'Natural sweetener with antibacterial properties', 4000.00, 10.00, ARRAY['natural', 'antibacterial', 'sweetener']),
('Ginger (500g)', 'food', 'Anti-inflammatory spice and digestive aid', 1500.00, 3.75, ARRAY['anti-inflammatory', 'digestive', 'spice']),
('Turmeric Powder (250g)', 'food', 'Powerful anti-inflammatory spice', 2000.00, 5.00, ARRAY['anti-inflammatory', 'spice', 'curcumin']),

-- Beverages
('Green Tea (50 bags)', 'food', 'Antioxidant-rich herbal tea', 2500.00, 6.25, ARRAY['antioxidant', 'tea', 'healthy']),
('Hibiscus Tea (100g)', 'food', 'Vitamin C rich herbal tea popular in Africa', 1500.00, 3.75, ARRAY['vitamin-c', 'africa', 'herbal']),
('Moringa Powder (250g)', 'food', 'Nutrient-dense superfood powder', 4500.00, 11.25, ARRAY['superfood', 'africa', 'nutrient-dense'])

WHERE NOT EXISTS (SELECT 1 FROM recommendations WHERE name = 'Paracetamol 500mg (20 tablets)');