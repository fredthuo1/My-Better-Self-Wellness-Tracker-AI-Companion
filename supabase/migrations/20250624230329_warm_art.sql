/*
  # Create AI interactions table for chat history

  1. New Tables
    - `ai_interactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `message` (text) - User's message
      - `ai_response` (text) - AI's response
      - `conversation_id` (uuid) - Groups related messages
      - `message_type` (text) - 'user' or 'assistant'
      - `tokens_used` (integer) - Track API usage
      - `model_used` (text) - Track which AI model was used
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `ai_interactions` table
    - Add policy for users to read their own interactions
    - Add policy for users to insert their own interactions
*/

CREATE TABLE IF NOT EXISTS ai_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  ai_response text,
  conversation_id uuid DEFAULT gen_random_uuid(),
  message_type text CHECK (message_type IN ('user', 'assistant')) NOT NULL,
  tokens_used integer DEFAULT 0,
  model_used text DEFAULT 'gpt-4',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own interactions"
  ON ai_interactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interactions"
  ON ai_interactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS ai_interactions_user_id_idx ON ai_interactions(user_id);
CREATE INDEX IF NOT EXISTS ai_interactions_conversation_id_idx ON ai_interactions(conversation_id);
CREATE INDEX IF NOT EXISTS ai_interactions_created_at_idx ON ai_interactions(created_at);
CREATE INDEX IF NOT EXISTS ai_interactions_message_type_idx ON ai_interactions(message_type);