/*
  # Update doctors table with Tavus IDs

  1. Updates
    - Update General Practitioner with specific Tavus replica and persona IDs
    - Ensure the doctor is available for all users

  2. Data
    - Replica ID: rb17cf590e15
    - Persona ID: pdcdad5c5f0e
*/

-- Update the General Practitioner with Tavus IDs
UPDATE doctors 
SET 
  tavus_replica_id = 'rb17cf590e15',
  tavus_persona_id = 'pdcdad5c5f0e'
WHERE specialty = 'General Practitioner';

-- If no General Practitioner exists, insert one
INSERT INTO doctors (
  name, 
  specialty, 
  description, 
  icon, 
  tavus_replica_id, 
  tavus_persona_id, 
  is_premium, 
  consultation_price
)
SELECT 
  'Dr. Sarah Johnson',
  'General Practitioner',
  'Experienced general physician providing comprehensive primary care and health consultations.',
  '👩‍⚕️',
  'rb17cf590e15',
  'pdcdad5c5f0e',
  false,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM doctors WHERE specialty = 'General Practitioner'
);