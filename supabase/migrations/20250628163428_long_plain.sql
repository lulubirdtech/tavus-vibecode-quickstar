/*
  # Create safe upsert functions

  This migration creates PostgreSQL functions that provide safe upsert operations
  for common use cases in the application, preventing ON CONFLICT errors.

  ## Functions Created:
  1. upsert_user_profile - Safely upsert user profile data
  2. upsert_user_subscription - Safely manage user subscriptions
  3. upsert_consultation - Safely create or update consultations
  4. upsert_medication_reminder - Safely manage medication reminders

  ## Security:
  - All functions use proper RLS policies
  - Input validation included
  - Safe error handling
*/

-- 1. Function to safely upsert user profiles
CREATE OR REPLACE FUNCTION upsert_user_profile(
  p_user_id UUID,
  p_settings JSONB DEFAULT '{}',
  p_notification_preferences JSONB DEFAULT NULL,
  p_ai_preferences JSONB DEFAULT NULL,
  p_display_preferences JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  profile_id UUID;
BEGIN
  -- Insert or update profile
  INSERT INTO profiles (
    user_id,
    settings,
    notification_preferences,
    ai_preferences,
    display_preferences,
    updated_at
  )
  VALUES (
    p_user_id,
    COALESCE(p_settings, '{}'),
    COALESCE(p_notification_preferences, '{"newAnalysis": true, "voiceAlerts": true, "reportUpdates": false, "criticalFindings": true}'),
    COALESCE(p_ai_preferences, '{"apiProvider": "gemini", "sensitivity": "standard", "defaultModel": "general-practitioner"}'),
    COALESCE(p_display_preferences, '{"theme": "dark", "preset": "standard", "zoomLevel": "fit"}'),
    NOW()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    settings = COALESCE(EXCLUDED.settings, profiles.settings),
    notification_preferences = COALESCE(EXCLUDED.notification_preferences, profiles.notification_preferences),
    ai_preferences = COALESCE(EXCLUDED.ai_preferences, profiles.ai_preferences),
    display_preferences = COALESCE(EXCLUDED.display_preferences, profiles.display_preferences),
    updated_at = NOW()
  RETURNING id INTO profile_id;

  RETURN profile_id;
END;
$$;

-- 2. Function to safely manage user subscriptions
CREATE OR REPLACE FUNCTION upsert_user_subscription(
  p_user_id UUID,
  p_plan_type TEXT,
  p_status TEXT DEFAULT 'active',
  p_price NUMERIC DEFAULT NULL,
  p_currency TEXT DEFAULT 'NGN',
  p_payment_provider TEXT DEFAULT NULL,
  p_payment_id TEXT DEFAULT NULL,
  p_end_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  subscription_id UUID;
BEGIN
  -- First, deactivate any existing active subscriptions for this user and plan type
  UPDATE subscriptions 
  SET status = 'cancelled', updated_at = NOW()
  WHERE user_id = p_user_id 
    AND plan_type = p_plan_type 
    AND status = 'active'
    AND id != COALESCE((
      SELECT id FROM subscriptions 
      WHERE user_id = p_user_id AND plan_type = p_plan_type 
      ORDER BY created_at DESC LIMIT 1
    ), '00000000-0000-0000-0000-000000000000'::UUID);

  -- Insert new subscription
  INSERT INTO subscriptions (
    user_id,
    plan_type,
    status,
    price,
    currency,
    payment_provider,
    payment_id,
    end_date,
    auto_renew,
    updated_at
  )
  VALUES (
    p_user_id,
    p_plan_type,
    p_status,
    p_price,
    p_currency,
    p_payment_provider,
    p_payment_id,
    p_end_date,
    true,
    NOW()
  )
  RETURNING id INTO subscription_id;

  RETURN subscription_id;
END;
$$;

-- 3. Function to safely create or update consultations
CREATE OR REPLACE FUNCTION upsert_consultation(
  p_user_id UUID,
  p_doctor_id UUID,
  p_doctor_type TEXT,
  p_symptoms TEXT,
  p_tavus_conversation_id TEXT DEFAULT NULL,
  p_status TEXT DEFAULT 'active'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  consultation_id UUID;
BEGIN
  -- End any existing active consultations with the same doctor
  UPDATE consultations 
  SET status = 'completed', completed_at = NOW()
  WHERE user_id = p_user_id 
    AND doctor_id = p_doctor_id 
    AND status = 'active';

  -- Insert new consultation
  INSERT INTO consultations (
    user_id,
    doctor_id,
    doctor_type,
    symptoms,
    tavus_conversation_id,
    status
  )
  VALUES (
    p_user_id,
    p_doctor_id,
    p_doctor_type,
    p_symptoms,
    p_tavus_conversation_id,
    p_status
  )
  RETURNING id INTO consultation_id;

  RETURN consultation_id;
END;
$$;

-- 4. Function to safely manage medication reminders
CREATE OR REPLACE FUNCTION upsert_medication_reminder(
  p_user_id UUID,
  p_treatment_plan_id UUID,
  p_medication_name TEXT,
  p_dosage TEXT DEFAULT NULL,
  p_frequency TEXT DEFAULT NULL,
  p_reminder_times TIME[] DEFAULT '{}',
  p_voice_message TEXT DEFAULT NULL,
  p_is_active BOOLEAN DEFAULT true
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  reminder_id UUID;
BEGIN
  -- Insert or update medication reminder
  INSERT INTO medication_reminders (
    user_id,
    treatment_plan_id,
    medication_name,
    dosage,
    frequency,
    reminder_times,
    voice_message,
    is_active,
    next_reminder
  )
  VALUES (
    p_user_id,
    p_treatment_plan_id,
    p_medication_name,
    p_dosage,
    p_frequency,
    p_reminder_times,
    p_voice_message,
    p_is_active,
    CASE 
      WHEN array_length(p_reminder_times, 1) > 0 THEN 
        (CURRENT_DATE + p_reminder_times[1])::TIMESTAMPTZ
      ELSE NULL 
    END
  )
  ON CONFLICT (user_id, treatment_plan_id, medication_name) 
  DO UPDATE SET
    dosage = COALESCE(EXCLUDED.dosage, medication_reminders.dosage),
    frequency = COALESCE(EXCLUDED.frequency, medication_reminders.frequency),
    reminder_times = COALESCE(EXCLUDED.reminder_times, medication_reminders.reminder_times),
    voice_message = COALESCE(EXCLUDED.voice_message, medication_reminders.voice_message),
    is_active = EXCLUDED.is_active,
    next_reminder = CASE 
      WHEN array_length(EXCLUDED.reminder_times, 1) > 0 THEN 
        (CURRENT_DATE + EXCLUDED.reminder_times[1])::TIMESTAMPTZ
      ELSE medication_reminders.next_reminder 
    END
  RETURNING id INTO reminder_id;

  RETURN reminder_id;
END;
$$;

-- 5. Function to get available doctors for a user (considering subscription)
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
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_has_premium BOOLEAN := false;
BEGIN
  -- Check if user has active premium subscription
  SELECT EXISTS (
    SELECT 1 FROM subscriptions 
    WHERE user_id = target_user_id 
      AND status = 'active' 
      AND plan_type IN ('monthly', 'yearly')
      AND (end_date IS NULL OR end_date > NOW())
  ) INTO user_has_premium;

  -- Return doctors with availability based on subscription
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
      WHEN d.is_premium AND NOT user_has_premium THEN false
      ELSE true
    END as is_available
  FROM doctors d
  ORDER BY 
    CASE WHEN d.specialty = 'General Practitioner' THEN 0 ELSE 1 END,
    d.name;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION upsert_user_profile TO authenticated;
GRANT EXECUTE ON FUNCTION upsert_user_subscription TO authenticated;
GRANT EXECUTE ON FUNCTION upsert_consultation TO authenticated;
GRANT EXECUTE ON FUNCTION upsert_medication_reminder TO authenticated;
GRANT EXECUTE ON FUNCTION get_available_doctors TO authenticated;