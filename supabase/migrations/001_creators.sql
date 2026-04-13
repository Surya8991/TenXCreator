-- Creator profiles table
CREATE TABLE IF NOT EXISTS creators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT NOT NULL,
  niche TEXT NOT NULL,
  stage INTEGER NOT NULL DEFAULT 1 CHECK (stage BETWEEN 1 AND 5),
  subscribers INTEGER,
  monthly_revenue NUMERIC,
  platforms TEXT[] DEFAULT ARRAY['youtube'],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON creators
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON creators
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON creators
  FOR INSERT WITH CHECK (auth.uid() = id);
