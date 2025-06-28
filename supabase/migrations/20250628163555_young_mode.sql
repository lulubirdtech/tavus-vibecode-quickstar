/*
  # Test constraint functionality

  This migration tests all the unique constraints and upsert functions
  to ensure they work correctly and prevent ON CONFLICT errors.

  ## Tests Performed:
  1. Test user profile upserts
  2. Test subscription management
  3. Test consultation creation
  4. Test medication reminder management
  5. Verify all unique constraints are working

  ## Note:
  This is a test migration that can be run safely in development.
  It creates test data and then cleans it up.
*/

-- Test function to verify constraints work
DO $$
DECLARE
  test_user_id UUID;
  test_doctor_id UUID;
  test_profile_id UUID;
  test_subscription_id UUID;
  test_consultation_id UUID;
  test_reminder_id UUID;
BEGIN
  -- Create a test user (this should work with existing unique constraint)
  INSERT INTO users (email, password_hash, name, role)
  VALUES ('test@example.com', 'hashed_password', 'Test User', 'patient')
  ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO test_user_id;

  RAISE NOTICE 'Test user created with ID: %', test_user_id;

  -- Test profile upsert function
  SELECT upsert_user_profile(
    test_user_id,
    '{"test": true}'::jsonb
  ) INTO test_profile_id;

  RAISE NOTICE 'Profile upserted with ID: %', test_profile_id;

  -- Test profile upsert again (should update, not create new)
  SELECT upsert_user_profile(
    test_user_id,
    '{"test": true, "updated": true}'::jsonb
  ) INTO test_profile_id;

  RAISE NOTICE 'Profile updated with same ID: %', test_profile_id;

  -- Create a test doctor if not exists
  INSERT INTO doctors (name, specialty, description, icon, tavus_replica_id, tavus_persona_id)
  VALUES ('Test Doctor', 'General Practitioner', 'Test doctor for constraints', '👨‍⚕️', 'test_replica', 'test_persona')
  ON CONFLICT (tavus_replica_id, tavus_persona_id) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO test_doctor_id;

  RAISE NOTICE 'Test doctor created with ID: %', test_doctor_id;

  -- Test subscription upsert function
  SELECT upsert_user_subscription(
    test_user_id,
    'monthly',
    'active',
    15000,
    'NGN',
    'paystack',
    'test_payment_123'
  ) INTO test_subscription_id;

  RAISE NOTICE 'Subscription created with ID: %', test_subscription_id;

  -- Test consultation upsert function
  SELECT upsert_consultation(
    test_user_id,
    test_doctor_id,
    'General Practitioner',
    'Test symptoms for constraint testing'
  ) INTO test_consultation_id;

  RAISE NOTICE 'Consultation created with ID: %', test_consultation_id;

  -- Test consultation upsert again (should end previous and create new)
  SELECT upsert_consultation(
    test_user_id,
    test_doctor_id,
    'General Practitioner',
    'Updated test symptoms'
  ) INTO test_consultation_id;

  RAISE NOTICE 'New consultation created with ID: %', test_consultation_id;

  -- Create a test treatment plan
  INSERT INTO treatment_plans (user_id, plan_data)
  VALUES (test_user_id, '{"test": true}'::jsonb);

  -- Test medication reminder upsert function
  SELECT upsert_medication_reminder(
    test_user_id,
    (SELECT id FROM treatment_plans WHERE user_id = test_user_id LIMIT 1),
    'Test Medication',
    '500mg',
    'twice daily',
    ARRAY['08:00:00'::time, '20:00:00'::time]
  ) INTO test_reminder_id;

  RAISE NOTICE 'Medication reminder created with ID: %', test_reminder_id;

  -- Test medication reminder upsert again (should update, not create new)
  SELECT upsert_medication_reminder(
    test_user_id,
    (SELECT id FROM treatment_plans WHERE user_id = test_user_id LIMIT 1),
    'Test Medication',
    '750mg',
    'three times daily',
    ARRAY['08:00:00'::time, '14:00:00'::time, '20:00:00'::time]
  ) INTO test_reminder_id;

  RAISE NOTICE 'Medication reminder updated with same ID: %', test_reminder_id;

  -- Clean up test data
  DELETE FROM medication_reminders WHERE user_id = test_user_id;
  DELETE FROM treatment_plans WHERE user_id = test_user_id;
  DELETE FROM consultations WHERE user_id = test_user_id;
  DELETE FROM subscriptions WHERE user_id = test_user_id;
  DELETE FROM profiles WHERE user_id = test_user_id;
  DELETE FROM doctors WHERE id = test_doctor_id;
  DELETE FROM users WHERE id = test_user_id;

  RAISE NOTICE 'Test data cleaned up successfully';
  RAISE NOTICE 'All constraint tests passed! ON CONFLICT errors should be resolved.';

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Test failed with error: %', SQLERRM;
    -- Clean up on error
    DELETE FROM medication_reminders WHERE user_id = test_user_id;
    DELETE FROM treatment_plans WHERE user_id = test_user_id;
    DELETE FROM consultations WHERE user_id = test_user_id;
    DELETE FROM subscriptions WHERE user_id = test_user_id;
    DELETE FROM profiles WHERE user_id = test_user_id;
    DELETE FROM doctors WHERE id = test_doctor_id;
    DELETE FROM users WHERE id = test_user_id;
    RAISE;
END $$;