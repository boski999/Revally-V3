/*
  # Enhanced Analytics Schema

  1. New Tables
    - `analytics_snapshots`
      - `id` (uuid, primary key)
      - `store_id` (uuid, foreign key to stores)
      - `snapshot_date` (date)
      - `total_reviews` (integer)
      - `average_rating` (decimal)
      - `response_rate` (decimal)
      - `avg_response_time_hours` (decimal)
      - `positive_sentiment_count` (integer)
      - `neutral_sentiment_count` (integer)
      - `negative_sentiment_count` (integer)
      - `pending_count` (integer)
      - `approved_count` (integer)
      - `published_count` (integer)
      - `created_at` (timestamp)
    
    - `review_keywords`
      - `id` (uuid, primary key)
      - `review_id` (uuid, foreign key to reviews)
      - `keyword` (text)
      - `sentiment` (text)
      - `frequency` (integer)
      - `created_at` (timestamp)
    
    - `platform_benchmarks`
      - `id` (uuid, primary key)
      - `platform` (text)
      - `industry_avg_rating` (decimal)
      - `industry_avg_response_time` (decimal)
      - `updated_at` (timestamp)
    
    - `analytics_goals`
      - `id` (uuid, primary key)
      - `store_id` (uuid, foreign key to stores)
      - `goal_type` (text) - 'rating', 'response_rate', 'response_time'
      - `target_value` (decimal)
      - `current_value` (decimal)
      - `start_date` (date)
      - `target_date` (date)
      - `status` (text) - 'active', 'completed', 'missed'
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users to read their store data
*/

-- Analytics Snapshots Table
CREATE TABLE IF NOT EXISTS analytics_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  snapshot_date date NOT NULL DEFAULT CURRENT_DATE,
  total_reviews integer DEFAULT 0,
  average_rating decimal(3,2) DEFAULT 0.0,
  response_rate decimal(5,2) DEFAULT 0.0,
  avg_response_time_hours decimal(8,2) DEFAULT 0.0,
  positive_sentiment_count integer DEFAULT 0,
  neutral_sentiment_count integer DEFAULT 0,
  negative_sentiment_count integer DEFAULT 0,
  pending_count integer DEFAULT 0,
  approved_count integer DEFAULT 0,
  published_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(store_id, snapshot_date)
);

ALTER TABLE analytics_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view analytics snapshots"
  ON analytics_snapshots FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert analytics snapshots"
  ON analytics_snapshots FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Review Keywords Table
CREATE TABLE IF NOT EXISTS review_keywords (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid REFERENCES reviews(id) ON DELETE CASCADE NOT NULL,
  keyword text NOT NULL,
  sentiment text CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  frequency integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE review_keywords ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view review keywords"
  ON review_keywords FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert review keywords"
  ON review_keywords FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Platform Benchmarks Table
CREATE TABLE IF NOT EXISTS platform_benchmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL UNIQUE,
  industry_avg_rating decimal(3,2) DEFAULT 4.0,
  industry_avg_response_time decimal(8,2) DEFAULT 24.0,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE platform_benchmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view platform benchmarks"
  ON platform_benchmarks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can manage platform benchmarks"
  ON platform_benchmarks FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Analytics Goals Table
CREATE TABLE IF NOT EXISTS analytics_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  goal_type text NOT NULL CHECK (goal_type IN ('rating', 'response_rate', 'response_time')),
  target_value decimal(10,2) NOT NULL,
  current_value decimal(10,2) DEFAULT 0.0,
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  target_date date NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'missed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE analytics_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view analytics goals"
  ON analytics_goals FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage analytics goals"
  ON analytics_goals FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default platform benchmarks
INSERT INTO platform_benchmarks (platform, industry_avg_rating, industry_avg_response_time)
VALUES 
  ('Google', 4.2, 18.5),
  ('Yelp', 4.0, 24.0),
  ('Facebook', 4.3, 20.0),
  ('TripAdvisor', 4.1, 22.0)
ON CONFLICT (platform) DO NOTHING;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_analytics_snapshots_store_date 
  ON analytics_snapshots(store_id, snapshot_date DESC);

CREATE INDEX IF NOT EXISTS idx_review_keywords_review 
  ON review_keywords(review_id);

CREATE INDEX IF NOT EXISTS idx_review_keywords_keyword 
  ON review_keywords(keyword);

CREATE INDEX IF NOT EXISTS idx_analytics_goals_store 
  ON analytics_goals(store_id, status);
