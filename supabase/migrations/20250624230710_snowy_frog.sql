/*
  # Create wellness tracking tables

  1. New Tables
    - `mood_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `mood` (integer, 1-5 scale)
      - `notes` (text, optional)
      - `tags` (text array)
      - `date` (date)
      - `created_at` (timestamptz)

    - `health_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `sleep_hours` (decimal)
      - `steps` (integer)
      - `water_glasses` (integer)
      - `exercise_minutes` (integer)
      - `weight` (decimal, optional)
      - `date` (date)
      - `created_at` (timestamptz)

    - `finance_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `amount` (decimal)
      - `category` (text)
      - `description` (text)
      - `type` (text, 'expense' or 'income')
      - `date` (date)
      - `created_at` (timestamptz)

    - `goals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text)
      - `description` (text)
      - `is_completed` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for users to manage their own data
*/

-- Mood logs table
CREATE TABLE IF NOT EXISTS mood_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mood integer CHECK (mood >= 1 AND mood <= 5) NOT NULL,
  notes text,
  tags text[] DEFAULT '{}',
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Health logs table
CREATE TABLE IF NOT EXISTS health_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sleep_hours decimal(3,1),
  steps integer DEFAULT 0,
  water_glasses integer DEFAULT 0,
  exercise_minutes integer DEFAULT 0,
  weight decimal(5,2),
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Finance logs table
CREATE TABLE IF NOT EXISTS finance_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount decimal(10,2) NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  type text CHECK (type IN ('expense', 'income')) NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Mood logs policies
CREATE POLICY "Users can read own mood logs"
  ON mood_logs FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood logs"
  ON mood_logs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mood logs"
  ON mood_logs FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own mood logs"
  ON mood_logs FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Health logs policies
CREATE POLICY "Users can read own health logs"
  ON health_logs FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health logs"
  ON health_logs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health logs"
  ON health_logs FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own health logs"
  ON health_logs FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Finance logs policies
CREATE POLICY "Users can read own finance logs"
  ON finance_logs FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own finance logs"
  ON finance_logs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own finance logs"
  ON finance_logs FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own finance logs"
  ON finance_logs FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Goals policies
CREATE POLICY "Users can read own goals"
  ON goals FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
  ON goals FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON goals FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON goals FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS mood_logs_user_id_date_idx ON mood_logs(user_id, date);
CREATE INDEX IF NOT EXISTS health_logs_user_id_date_idx ON health_logs(user_id, date);
CREATE INDEX IF NOT EXISTS finance_logs_user_id_date_idx ON finance_logs(user_id, date);
CREATE INDEX IF NOT EXISTS goals_user_id_idx ON goals(user_id);

-- Create unique constraints to prevent duplicate entries per day
CREATE UNIQUE INDEX IF NOT EXISTS mood_logs_user_date_unique ON mood_logs(user_id, date);
CREATE UNIQUE INDEX IF NOT EXISTS health_logs_user_date_unique ON health_logs(user_id, date);