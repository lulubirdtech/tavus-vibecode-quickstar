/*
  # Fix ON CONFLICT constraint errors

  This migration adds missing unique constraints that are required for ON CONFLICT clauses
  to work properly in PostgreSQL/Supabase.

  ## Changes Made:
  1. Add unique constraint for user_id in profiles table (one profile per user)
  2. Add unique constraint for user_id + plan_type in subscriptions table (one active subscription per plan type per user)
  3. Add unique constraint for user_id + doctor_id + status in consultations table (prevent duplicate active consultations)
  4. Add unique constraint for user_id + treatment_plan_id + medication_name in medication_reminders table
  5. Add unique constraint for email in users table (if not already exists)
  6. Add composite unique constraints where needed for business logic

  ## Security:
  - All constraints maintain data integrity
  - No breaking changes to existing functionality
*/

-- 1. Ensure users table has unique email constraint (should already exist but let's be safe)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'users_email_key' 
    AND table_name = 'users'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);
  END IF;
END $$;

-- 2. Add unique constraint for profiles (one profile per user)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_user_id_unique' 
    AND table_name = 'profiles'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);
  END IF;
END $$;

-- 3. Add unique constraint for active subscriptions (one active subscription per plan type per user)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'subscriptions_user_plan_active_unique' 
    AND table_name = 'subscriptions'
  ) THEN
    -- Create partial unique index for active subscriptions only
    CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS subscriptions_user_plan_active_unique 
    ON subscriptions (user_id, plan_type) 
    WHERE status = 'active';
  END IF;
END $$;

-- 4. Add unique constraint for active consultations (prevent duplicate active consultations with same doctor)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'consultations_user_doctor_active_unique' 
    AND table_name = 'consultations'
  ) THEN
    -- Create partial unique index for active consultations only
    CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS consultations_user_doctor_active_unique 
    ON consultations (user_id, doctor_id) 
    WHERE status = 'active';
  END IF;
END $$;

-- 5. Add unique constraint for medication reminders (one reminder per medication per treatment plan)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'medication_reminders_unique' 
    AND table_name = 'medication_reminders'
  ) THEN
    ALTER TABLE medication_reminders 
    ADD CONSTRAINT medication_reminders_unique 
    UNIQUE (user_id, treatment_plan_id, medication_name);
  END IF;
END $$;

-- 6. Add unique constraint for user symptoms (prevent duplicate symptom entries for same user at same time)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_symptoms_user_time_unique' 
    AND table_name = 'user_symptoms'
  ) THEN
    -- Create unique index on user_id and created_at (rounded to minute to prevent rapid duplicates)
    CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS user_symptoms_user_time_unique 
    ON user_symptoms (user_id, date_trunc('minute', created_at));
  END IF;
END $$;

-- 7. Add unique constraint for prevention tips (one tip per category per user)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'prevention_tips_user_category_unique' 
    AND table_name = 'prevention_tips'
  ) THEN
    ALTER TABLE prevention_tips 
    ADD CONSTRAINT prevention_tips_user_category_unique 
    UNIQUE (user_id, category, tip_text);
  END IF;
END $$;

-- 8. Add unique constraint for purchases (prevent duplicate purchase records)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'purchases_user_item_time_unique' 
    AND table_name = 'purchases'
  ) THEN
    -- Create unique index to prevent duplicate purchases of same item by same user within same minute
    CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS purchases_user_item_time_unique 
    ON purchases (user_id, item_id, date_trunc('minute', created_at));
  END IF;
END $$;

-- 9. Add unique constraint for alerts (prevent duplicate alerts)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'alerts_user_type_time_unique' 
    AND table_name = 'alerts'
  ) THEN
    -- Create unique index to prevent duplicate alerts of same type for same user within same minute
    CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS alerts_user_type_time_unique 
    ON alerts (user_id, type, date_trunc('minute', created_at));
  END IF;
END $$;

-- 10. Ensure doctors table has proper unique constraints
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'doctors_replica_persona_unique' 
    AND table_name = 'doctors'
  ) THEN
    ALTER TABLE doctors 
    ADD CONSTRAINT doctors_replica_persona_unique 
    UNIQUE (tavus_replica_id, tavus_persona_id);
  END IF;
END $$;

-- 11. Add unique constraint for recommendations (prevent duplicate items)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'recommendations_name_category_unique' 
    AND table_name = 'recommendations'
  ) THEN
    ALTER TABLE recommendations 
    ADD CONSTRAINT recommendations_name_category_unique 
    UNIQUE (name, category);
  END IF;
END $$;