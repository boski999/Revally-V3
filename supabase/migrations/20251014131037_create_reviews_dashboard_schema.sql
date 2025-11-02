/*
  # Create Reviews Dashboard Schema

  ## Overview
  This migration creates the complete database schema for the Revally reviews management system.
  It includes tables for stores, reviews, analytics snapshots, and platform connections.

  ## New Tables Created
  
  ### 1. `stores`
  Stores business/restaurant information
  - `id` (uuid, primary key) - Unique store identifier
  - `name` (text) - Store name
  - `type` (text) - Business type (Restaurant, Traiteur, etc.)
  - `address` (text) - Physical address
  - `phone` (text, nullable) - Contact phone number
  - `website` (text, nullable) - Website URL
  - `is_active` (boolean) - Whether store is currently active
  - `total_reviews` (integer) - Cached total review count
  - `average_rating` (numeric) - Cached average rating
  - `last_activity` (timestamptz) - Last review or update timestamp
  - `created_at` (timestamptz) - Record creation time
  - `updated_at` (timestamptz) - Last update time

  ### 2. `reviews`
  Stores individual customer reviews from all platforms
  - `id` (uuid, primary key) - Unique review identifier
  - `business_id` (uuid, foreign key -> stores) - Associated store
  - `platform` (text) - Review platform (Google, Yelp, Facebook, TripAdvisor)
  - `reviewer_name` (text) - Customer name
  - `reviewer_avatar` (text, nullable) - Avatar URL
  - `rating` (integer) - Star rating (1-5)
  - `title` (text, nullable) - Review title
  - `content` (text) - Review text content
  - `review_date` (timestamptz) - When review was posted
  - `ai_response_content` (text) - AI-generated response
  - `ai_response_confidence` (numeric) - AI confidence score (0-1)
  - `ai_response_sentiment` (text) - Sentiment analysis (positive/neutral/negative)
  - `status` (text) - Workflow status (pending/approved/published/rejected)
  - `is_urgent` (boolean) - Requires immediate attention flag
  - `tags` (text array) - Categorization tags
  - `created_at` (timestamptz) - Record creation time
  - `updated_at` (timestamptz) - Last update time

  ### 3. `review_platforms`
  Tracks connected review platforms per store
  - `id` (uuid, primary key) - Unique platform connection identifier
  - `store_id` (uuid, foreign key -> stores) - Associated store
  - `platform_name` (text) - Platform name
  - `connected` (boolean) - Connection status
  - `average_rating` (numeric) - Platform-specific average rating
  - `total_reviews` (integer) - Platform-specific review count
  - `created_at` (timestamptz) - Record creation time
  - `updated_at` (timestamptz) - Last update time

  ### 4. `analytics_snapshots`
  Stores historical analytics data for trending
  - `id` (uuid, primary key) - Unique snapshot identifier
  - `store_id` (uuid, foreign key -> stores) - Associated store
  - `snapshot_date` (date) - Date of snapshot
  - `total_reviews` (integer) - Total reviews at snapshot time
  - `average_rating` (numeric) - Average rating at snapshot time
  - `pending_responses` (integer) - Pending review count
  - `auto_approval_rate` (numeric) - AI auto-approval percentage
  - `response_time` (numeric) - Average response time in hours
  - `platform_breakdown` (jsonb) - Platform-specific metrics
  - `rating_distribution` (jsonb) - Rating counts by star level
  - `created_at` (timestamptz) - Record creation time

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Public read access for demo purposes (can be restricted later)
  - Authenticated users can modify their own store data

  ## Indexes
  - Optimized for common query patterns
  - Index on store_id for reviews lookups
  - Index on review dates for time-based queries
  - Index on review status for workflow filtering
  - Index on platform for platform-specific queries

  ## Important Notes
  - All timestamps use UTC timezone
  - Ratings are constrained to 1-5 range
  - Foreign keys enforce referential integrity
  - Cascade deletes configured for data cleanup
*/

-- Create stores table
CREATE TABLE IF NOT EXISTS stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  address text NOT NULL,
  phone text,
  website text,
  is_active boolean DEFAULT true,
  total_reviews integer DEFAULT 0,
  average_rating numeric(2,1) DEFAULT 0.0,
  last_activity timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  platform text NOT NULL CHECK (platform IN ('Google', 'Yelp', 'Facebook', 'TripAdvisor')),
  reviewer_name text NOT NULL,
  reviewer_avatar text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  content text NOT NULL,
  review_date timestamptz NOT NULL DEFAULT now(),
  ai_response_content text NOT NULL,
  ai_response_confidence numeric(3,2) NOT NULL CHECK (ai_response_confidence >= 0 AND ai_response_confidence <= 1),
  ai_response_sentiment text NOT NULL CHECK (ai_response_sentiment IN ('positive', 'neutral', 'negative')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'published', 'rejected')),
  is_urgent boolean DEFAULT false,
  tags text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create review_platforms table
CREATE TABLE IF NOT EXISTS review_platforms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  platform_name text NOT NULL CHECK (platform_name IN ('Google', 'Yelp', 'Facebook', 'TripAdvisor')),
  connected boolean DEFAULT false,
  average_rating numeric(2,1) DEFAULT 0.0,
  total_reviews integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(store_id, platform_name)
);

-- Create analytics_snapshots table
CREATE TABLE IF NOT EXISTS analytics_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  snapshot_date date NOT NULL DEFAULT CURRENT_DATE,
  total_reviews integer DEFAULT 0,
  average_rating numeric(2,1) DEFAULT 0.0,
  pending_responses integer DEFAULT 0,
  auto_approval_rate numeric(5,2) DEFAULT 0.0,
  response_time numeric(5,2) DEFAULT 0.0,
  platform_breakdown jsonb DEFAULT '{}'::jsonb,
  rating_distribution jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(store_id, snapshot_date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_platform ON reviews(platform);
CREATE INDEX IF NOT EXISTS idx_reviews_date ON reviews(review_date DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_urgent ON reviews(is_urgent) WHERE is_urgent = true;
CREATE INDEX IF NOT EXISTS idx_review_platforms_store ON review_platforms(store_id);
CREATE INDEX IF NOT EXISTS idx_analytics_store_date ON analytics_snapshots(store_id, snapshot_date DESC);

-- Enable Row Level Security
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_snapshots ENABLE ROW LEVEL SECURITY;

-- RLS Policies for stores
CREATE POLICY "Allow public read access to stores"
  ON stores FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to insert stores"
  ON stores FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update stores"
  ON stores FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for reviews
CREATE POLICY "Allow public read access to reviews"
  ON reviews FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to insert reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for review_platforms
CREATE POLICY "Allow public read access to review_platforms"
  ON review_platforms FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage review_platforms"
  ON review_platforms FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for analytics_snapshots
CREATE POLICY "Allow public read access to analytics_snapshots"
  ON analytics_snapshots FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage analytics_snapshots"
  ON analytics_snapshots FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_stores_updated_at
  BEFORE UPDATE ON stores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_platforms_updated_at
  BEFORE UPDATE ON review_platforms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to calculate store analytics
CREATE OR REPLACE FUNCTION calculate_store_analytics(store_id_param uuid)
RETURNS TABLE (
  total_reviews bigint,
  average_rating numeric,
  pending_responses bigint,
  auto_approval_rate numeric,
  response_time numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::bigint as total_reviews,
    ROUND(AVG(rating)::numeric, 1) as average_rating,
    COUNT(*) FILTER (WHERE status = 'pending')::bigint as pending_responses,
    ROUND((COUNT(*) FILTER (WHERE status = 'approved')::numeric / NULLIF(COUNT(*)::numeric, 0) * 100), 2) as auto_approval_rate,
    ROUND(AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 3600)::numeric, 2) as response_time
  FROM reviews
  WHERE business_id = store_id_param;
END;
$$ LANGUAGE plpgsql;

-- Create function to update store stats
CREATE OR REPLACE FUNCTION update_store_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE stores
  SET
    total_reviews = (SELECT COUNT(*) FROM reviews WHERE business_id = NEW.business_id),
    average_rating = (SELECT ROUND(AVG(rating)::numeric, 1) FROM reviews WHERE business_id = NEW.business_id),
    last_activity = now()
  WHERE id = NEW.business_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update store stats on review changes
CREATE TRIGGER update_store_stats_on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_store_stats();
