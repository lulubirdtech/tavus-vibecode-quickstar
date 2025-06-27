/*
  # Update doctors data with correct Tavus IDs

  1. Updates
    - Update existing doctors with correct Tavus replica and persona IDs
    - Add Radiologist for photo diagnosis
    - Ensure General Physician is available for free users
*/

-- Update existing doctors with correct Tavus IDs
UPDATE doctors SET 
  tavus_replica_id = 'rb17cf590e15',
  tavus_persona_id = 'pdcdad5c5f0e'
WHERE specialty = 'General Practitioner';

-- Insert Radiologist if not exists
INSERT INTO doctors (name, specialty, description, icon, tavus_replica_id, tavus_persona_id, is_premium, consultation_price) 
VALUES (
  'Dr. Alex Thompson', 
  'Radiologist', 
  'Medical imaging specialist with expertise in X-rays, MRIs, CT scans, and ultrasounds', 
  '📱', 
  'rb17cf590e15', 
  'pdcdad5c5f0e', 
  true, 
  120
)
ON CONFLICT DO NOTHING;