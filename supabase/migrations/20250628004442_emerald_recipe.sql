/*
  # Fix Schema Constraints and Populate Database

  1. Schema Fixes
    - Add missing UNIQUE constraints for ON CONFLICT operations
    - Ensure proper indexing for performance
    
  2. Data Population
    - Insert comprehensive recommendations (medicines, foods, supplements)
    - Insert doctors with Tavus integration
    - Set up proper pricing in NGN and USD
    
  3. Security
    - Maintain existing RLS policies
    - Ensure data integrity with constraints
*/

-- Add missing UNIQUE constraints for recommendations table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'recommendations_name_key' 
    AND table_name = 'recommendations'
  ) THEN
    ALTER TABLE recommendations ADD CONSTRAINT recommendations_name_key UNIQUE(name);
  END IF;
END $$;

-- Add missing UNIQUE constraints for doctors table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'doctors_name_specialty_key' 
    AND table_name = 'doctors'
  ) THEN
    ALTER TABLE doctors ADD CONSTRAINT doctors_name_specialty_key UNIQUE(name, specialty);
  END IF;
END $$;

-- Clear existing data to avoid conflicts
DELETE FROM recommendations;
DELETE FROM doctors;

-- Insert comprehensive recommendations data
INSERT INTO recommendations (name, category, description, price_ngn, price_usd, image_url, tags) VALUES
-- Medicines
('Paracetamol 500mg (20 tablets)', 'medicine', 'Pain relief and fever reducer tablets', 300, 0.75, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', ARRAY['pain', 'fever', 'headache', 'africa']),
('Ibuprofen 400mg (10 tablets)', 'medicine', 'Anti-inflammatory pain reliever', 450, 1.12, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', ARRAY['pain', 'inflammation', 'fever']),
('Vitamin C 1000mg (30 tablets)', 'medicine', 'Immune system booster', 800, 2.00, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', ARRAY['vitamin', 'immunity', 'antioxidant']),
('Zinc Tablets 15mg (30 tablets)', 'medicine', 'Essential mineral supplement', 600, 1.50, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', ARRAY['mineral', 'immunity', 'healing']),
('Multivitamin Complex (30 tablets)', 'medicine', 'Complete daily vitamin supplement', 1200, 3.00, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', ARRAY['vitamin', 'daily', 'health']),
('Omeprazole 20mg (14 capsules)', 'medicine', 'Acid reflux and heartburn relief', 900, 2.25, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', ARRAY['stomach', 'acid', 'heartburn']),
('Cetirizine 10mg (10 tablets)', 'medicine', 'Antihistamine for allergies', 350, 0.87, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', ARRAY['allergy', 'antihistamine', 'hay fever']),
('Aspirin 75mg (28 tablets)', 'medicine', 'Low-dose aspirin for heart health', 400, 1.00, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', ARRAY['heart', 'blood', 'prevention']),
('Magnesium 250mg (60 tablets)', 'medicine', 'Muscle and nerve function support', 1000, 2.50, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', ARRAY['mineral', 'muscle', 'sleep']),
('Probiotics 10 Billion CFU (30 capsules)', 'medicine', 'Digestive health support', 1500, 3.75, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', ARRAY['digestive', 'gut health', 'probiotics']),

-- Foods
('Organic Honey (500g)', 'food', 'Pure raw honey with antibacterial properties', 2500, 6.25, 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg', ARRAY['natural', 'antibacterial', 'sweetener', 'africa']),
('Fresh Ginger Root (250g)', 'food', 'Anti-inflammatory root for digestive health', 800, 2.00, 'https://images.pexels.com/photos/161556/ginger-plant-asia-rhizome-161556.jpeg', ARRAY['anti-inflammatory', 'digestive', 'natural', 'spice']),
('Turmeric Powder (200g)', 'food', 'Golden spice with powerful anti-inflammatory properties', 1200, 3.00, 'https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg', ARRAY['anti-inflammatory', 'spice', 'healing', 'golden']),
('Garlic Bulbs (500g)', 'food', 'Natural antibiotic and immune booster', 600, 1.50, 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg', ARRAY['antibiotic', 'immunity', 'natural', 'cooking']),
('Lemon (6 pieces)', 'food', 'Vitamin C rich citrus for immunity', 400, 1.00, 'https://images.pexels.com/photos/1414110/pexels-photo-1414110.jpeg', ARRAY['vitamin c', 'citrus', 'immunity', 'detox']),
('Spinach (1 bunch)', 'food', 'Iron-rich leafy green vegetable', 300, 0.75, 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg', ARRAY['iron', 'leafy green', 'vitamin', 'healthy']),
('Sweet Potatoes (1kg)', 'food', 'Beta-carotene rich root vegetable', 800, 2.00, 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg', ARRAY['beta-carotene', 'vitamin a', 'fiber', 'healthy']),
('Avocado (3 pieces)', 'food', 'Healthy fats and fiber fruit', 900, 2.25, 'https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg', ARRAY['healthy fats', 'fiber', 'potassium', 'fruit']),
('Almonds (250g)', 'food', 'Protein and healthy fat nuts', 1800, 4.50, 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg', ARRAY['protein', 'healthy fats', 'nuts', 'vitamin e']),
('Green Tea (50 bags)', 'food', 'Antioxidant-rich herbal tea', 1000, 2.50, 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg', ARRAY['antioxidant', 'tea', 'metabolism', 'healthy']),
('Oats (1kg)', 'food', 'Fiber-rich whole grain cereal', 1200, 3.00, 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg', ARRAY['fiber', 'whole grain', 'heart healthy', 'breakfast']),
('Blueberries (250g)', 'food', 'Antioxidant-rich superfruit', 1500, 3.75, 'https://images.pexels.com/photos/1414110/pexels-photo-1414110.jpeg', ARRAY['antioxidant', 'superfruit', 'brain health', 'vitamin c']),

-- Supplements
('Moringa Powder (250g)', 'supplement', 'Nutrient-dense African superfood powder', 4500, 11.25, 'https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg', ARRAY['superfood', 'africa', 'nutrient-dense', 'moringa']),
('Spirulina Tablets (100 tablets)', 'supplement', 'Blue-green algae superfood supplement', 3500, 8.75, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', ARRAY['superfood', 'algae', 'protein', 'detox']),
('Fish Oil Omega-3 (60 capsules)', 'supplement', 'Essential fatty acids for heart and brain health', 2800, 7.00, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', ARRAY['omega-3', 'heart health', 'brain health', 'fish oil']),
('Ashwagandha Extract (60 capsules)', 'supplement', 'Adaptogenic herb for stress relief', 3200, 8.00, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', ARRAY['adaptogen', 'stress relief', 'ayurveda', 'herb']),
('Elderberry Syrup (250ml)', 'supplement', 'Immune-boosting berry extract', 2200, 5.50, 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg', ARRAY['immunity', 'berry', 'natural', 'syrup']),
('Collagen Peptides (300g)', 'supplement', 'Skin, hair, and joint health support', 4800, 12.00, 'https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg', ARRAY['collagen', 'skin health', 'joint health', 'protein']),
('Echinacea Extract (60 capsules)', 'supplement', 'Immune system support herb', 1800, 4.50, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', ARRAY['immunity', 'herb', 'natural', 'extract']),
('Ginkgo Biloba (60 tablets)', 'supplement', 'Brain health and circulation support', 2400, 6.00, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', ARRAY['brain health', 'circulation', 'herb', 'memory']),
('Milk Thistle Extract (60 capsules)', 'supplement', 'Liver detox and protection support', 2000, 5.00, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', ARRAY['liver health', 'detox', 'herb', 'protection']),
('Coenzyme Q10 (30 capsules)', 'supplement', 'Cellular energy and heart health support', 3600, 9.00, 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', ARRAY['energy', 'heart health', 'cellular', 'antioxidant'])

ON CONFLICT (name) DO UPDATE SET
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  price_ngn = EXCLUDED.price_ngn,
  price_usd = EXCLUDED.price_usd,
  image_url = EXCLUDED.image_url,
  tags = EXCLUDED.tags,
  in_stock = true;

-- Insert doctors with Tavus integration
INSERT INTO doctors (name, specialty, description, icon, tavus_replica_id, tavus_persona_id, is_premium, consultation_price) VALUES
('Dr. Sarah Johnson', 'General Practitioner', 'Experienced family doctor specializing in primary care, preventive medicine, and holistic health approaches. Available 24/7 for consultations.', '👩‍⚕️', 'rb17cf590e15', 'pdcdad5c5f0e', false, 0.00),
('Dr. Michael Chen', 'Radiologist', 'Expert in medical imaging interpretation including X-rays, CT scans, MRI, and ultrasound. Specialized in diagnostic imaging analysis.', '🔬', 'rb17cf590e15', 'pdcdad5c5f0e', true, 15000.00),
('Dr. Emily Rodriguez', 'Cardiologist', 'Heart specialist with expertise in cardiovascular diseases, heart conditions, and cardiac imaging interpretation.', '❤️', 'rb17cf590e15', 'pdcdad5c5f0e', true, 20000.00),
('Dr. James Wilson', 'Dermatologist', 'Skin specialist focusing on dermatological conditions, skin cancer detection, and cosmetic dermatology.', '🧴', 'rb17cf590e15', 'pdcdad5c5f0e', true, 18000.00),
('Dr. Lisa Thompson', 'Neurologist', 'Brain and nervous system specialist dealing with neurological disorders, headaches, and cognitive health.', '🧠', 'rb17cf590e15', 'pdcdad5c5f0e', true, 22000.00),
('Dr. Robert Kim', 'Orthopedic Surgeon', 'Bone and joint specialist focusing on musculoskeletal injuries, fractures, and joint problems.', '🦴', 'rb17cf590e15', 'pdcdad5c5f0e', true, 25000.00),
('Dr. Maria Garcia', 'Pediatrician', 'Children''s health specialist providing comprehensive care for infants, children, and adolescents.', '👶', 'rb17cf590e15', 'pdcdad5c5f0e', true, 16000.00),
('Dr. David Brown', 'Psychiatrist', 'Mental health specialist focusing on psychological disorders, therapy, and mental wellness.', '🧘', 'rb17cf590e15', 'pdcdad5c5f0e', true, 20000.00),
('Dr. Jennifer Lee', 'Gynecologist', 'Women''s health specialist focusing on reproductive health, pregnancy care, and gynecological conditions.', '🤱', 'rb17cf590e15', 'pdcdad5c5f0e', true, 18000.00),
('Dr. Thomas Anderson', 'Gastroenterologist', 'Digestive system specialist dealing with stomach, liver, and intestinal conditions.', '🫁', 'rb17cf590e15', 'pdcdad5c5f0e', true, 19000.00)

ON CONFLICT (name, specialty) DO UPDATE SET
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  tavus_replica_id = EXCLUDED.tavus_replica_id,
  tavus_persona_id = EXCLUDED.tavus_persona_id,
  is_premium = EXCLUDED.is_premium,
  consultation_price = EXCLUDED.consultation_price;

-- Create function to check doctor availability based on user subscription
CREATE OR REPLACE FUNCTION get_available_doctors(target_user_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  specialty TEXT,
  description TEXT,
  icon TEXT,
  tavus_replica_id TEXT,
  tavus_persona_id TEXT,
  is_premium BOOLEAN,
  consultation_price NUMERIC,
  is_available BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.name,
    d.specialty,
    d.description,
    d.icon,
    d.tavus_replica_id,
    d.tavus_persona_id,
    d.is_premium,
    d.consultation_price,
    CASE 
      WHEN d.is_premium = false THEN true
      WHEN EXISTS (
        SELECT 1 FROM subscriptions s 
        WHERE s.user_id = target_user_id 
        AND s.status = 'active' 
        AND s.plan_type IN ('monthly', 'yearly')
        AND (s.end_date IS NULL OR s.end_date > NOW())
      ) THEN true
      ELSE false
    END as is_available
  FROM doctors d
  ORDER BY 
    CASE WHEN d.specialty = 'General Practitioner' THEN 0 ELSE 1 END,
    d.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_available_doctors(UUID) TO authenticated;

-- Update RLS policies to ensure proper access
DROP POLICY IF EXISTS "Doctors readable by all" ON doctors;
CREATE POLICY "Doctors readable by all"
  ON doctors
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Recommendations readable by all" ON recommendations;
CREATE POLICY "Recommendations readable by all"
  ON recommendations
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_doctors_specialty_premium ON doctors(specialty, is_premium);
CREATE INDEX IF NOT EXISTS idx_recommendations_category_stock ON recommendations(category, in_stock);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON subscriptions(user_id, status, plan_type);

-- Verify data insertion
DO $$
DECLARE
  doctor_count INTEGER;
  recommendation_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO doctor_count FROM doctors;
  SELECT COUNT(*) INTO recommendation_count FROM recommendations;
  
  RAISE NOTICE 'Successfully inserted % doctors and % recommendations', doctor_count, recommendation_count;
END $$;