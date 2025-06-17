-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  correct_answer BOOLEAN NOT NULL,
  subject TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create test_results table
CREATE TABLE IF NOT EXISTS test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  questions JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create study_resources table
CREATE TABLE IF NOT EXISTS study_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_resources ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Public profiles access" ON profiles;
CREATE POLICY "Public profiles access"
  ON profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Public questions access" ON questions;
CREATE POLICY "Public questions access"
  ON questions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can view own test results" ON test_results;
CREATE POLICY "Users can view own test results"
  ON test_results FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can insert own test results" ON test_results;
CREATE POLICY "Users can insert own test results"
  ON test_results FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Public study resources access" ON study_resources;
CREATE POLICY "Public study resources access"
  ON study_resources FOR SELECT
  USING (true);

-- Enable realtime
alter publication supabase_realtime add table questions;
alter publication supabase_realtime add table test_results;
alter publication supabase_realtime add table study_resources;
