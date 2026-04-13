-- Creator metrics tracking over time
CREATE TABLE IF NOT EXISTS metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
  subscribers INTEGER,
  views_last_28d INTEGER,
  watch_hours_last_28d NUMERIC,
  revenue_last_28d NUMERIC,
  ctr NUMERIC,
  avd NUMERIC,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_metrics_creator ON metrics(creator_id);
CREATE INDEX idx_metrics_date ON metrics(recorded_at DESC);

ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own metrics" ON metrics
  FOR SELECT USING (creator_id = auth.uid());

CREATE POLICY "Users can insert own metrics" ON metrics
  FOR INSERT WITH CHECK (creator_id = auth.uid());
