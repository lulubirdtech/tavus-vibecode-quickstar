/*
  # Fix get_available_doctors function

  1. Drop existing function if it exists
  2. Create new function with proper parameter handling
  3. Ensure it works with user authentication
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_available_doctors();
DROP FUNCTION IF EXISTS get_available_doctors(uuid);

-- Create the function with proper parameter
CREATE OR REPLACE FUNCTION get_available_doctors(target_user_id uuid DEFAULT NULL)
RETURNS TABLE (
  id uuid,
  name text,
  specialty text,
  description text,
  icon text,
  tavus_replica_id text,
  tavus_persona_id text,
  is_premium boolean,
  is_available boolean
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_has_premium boolean := false;
  actual_user_id uuid;
BEGIN
  -- Use provided user_id or fall back to auth.uid()
  actual_user_id := COALESCE(target_user_id, auth.uid());
  
  -- Check if user has active premium subscription
  IF actual_user_id IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM subscriptions s 
      WHERE s.user_id = actual_user_id 
      AND s.status = 'active' 
      AND s.plan_type IN ('monthly', 'yearly')
      AND (s.end_date IS NULL OR s.end_date > now())
    ) INTO user_has_premium;
  END IF;

  -- Return doctors based on subscription status
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
    CASE 
      WHEN d.is_premium = false THEN true
      WHEN d.is_premium = true AND user_has_premium = true THEN true
      ELSE false
    END as is_available
  FROM doctors d
  ORDER BY d.is_premium ASC, d.name ASC;
END;
$$;