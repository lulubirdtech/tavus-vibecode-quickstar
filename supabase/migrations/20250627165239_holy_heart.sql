/*
  # Fix consultations RLS policy

  1. Security Updates
    - Update RLS policy for consultations table to allow authenticated users to insert their own consultations
    - Ensure proper user authentication flow

  2. Changes
    - Drop existing restrictive policy
    - Create new policy that allows users to manage their own consultations
    - Add policy for inserting consultations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage own consultations" ON consultations;

-- Create separate policies for different operations
CREATE POLICY "Users can read own consultations"
  ON consultations
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own consultations"
  ON consultations
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own consultations"
  ON consultations
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own consultations"
  ON consultations
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());