/*
  # Populate doctors with Tavus avatars

  1. New Data
    - Specialist doctors with Tavus integration
    - Default General Physician with provided credentials
    - Various medical specialties
  2. Tavus Integration
    - Replica IDs and Persona IDs for each doctor
    - Premium and free consultation options
*/

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

('Dr. Priya Sharma', 'Gynecologist', 'Women\'s health specialist with expertise in reproductive health, pregnancy care, and gynecological conditions. Provides comprehensive women\'s healthcare.', '🤱', 'rb17cf590e21', 'pdcdad5c5f6e', true, 5500.00),

('Dr. David Thompson', 'Psychiatrist', 'Mental health specialist focusing on anxiety, depression, and behavioral disorders. Provides therapy and medication management for mental wellness.', '🧘', 'rb17cf590e22', 'pdcdad5c5f7e', true, 6500.00),

('Dr. Aisha Kone', 'Infectious Disease Specialist', 'Expert in tropical diseases, HIV/AIDS, malaria, and tuberculosis. Specializes in infectious disease prevention and treatment in African contexts.', '🦠', 'rb17cf590e23', 'pdcdad5c5f8e', true, 5000.00),

('Dr. Mark Williams', 'Gastroenterologist', 'Digestive system specialist treating conditions like IBS, ulcers, and liver diseases. Expert in endoscopic procedures and digestive health.', '🫃', 'rb17cf590e24', 'pdcdad5c5f9e', true, 5500.00),

-- Additional Free Specialists
('Dr. Lisa Park', 'Nutritionist', 'Certified nutritionist specializing in dietary planning, weight management, and nutrition therapy for various health conditions.', '🥗', 'rb17cf590e25', 'pdcdad5c5f0f', false, 0.00),

('Dr. Ahmed Hassan', 'Emergency Medicine', 'Emergency medicine physician with expertise in acute care, trauma, and critical conditions. Available for urgent medical consultations.', '🚨', 'rb17cf590e26', 'pdcdad5c5f1f', false, 0.00)

ON CONFLICT (tavus_replica_id) DO NOTHING;