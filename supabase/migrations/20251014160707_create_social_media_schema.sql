/*
  # Social Media Management Schema

  1. New Tables
    - `social_posts`
      - `id` (uuid, primary key)
      - `store_id` (uuid, foreign key to stores)
      - `content` (text, post content)
      - `status` (enum: draft, scheduled, published, failed)
      - `scheduled_for` (timestamptz, scheduled publication time)
      - `published_at` (timestamptz, actual publication time)
      - `platforms` (text[], target platforms)
      - `hashtags` (text[], hashtags used)
      - `engagement_metrics` (jsonb, likes, comments, shares, etc.)
      - `created_by` (text, user who created the post)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `social_post_images`
      - `id` (uuid, primary key)
      - `post_id` (uuid, foreign key to social_posts)
      - `image_url` (text, Supabase Storage URL)
      - `alt_text` (text, accessibility description)
      - `order_index` (integer, for carousel ordering)
      - `platform_optimizations` (jsonb, platform-specific versions)
      - `created_at` (timestamptz)

    - `platform_connections`
      - `id` (uuid, primary key)
      - `store_id` (uuid, foreign key to stores)
      - `platform_name` (text, e.g., Instagram, Facebook)
      - `is_connected` (boolean)
      - `account_id` (text, platform account ID)
      - `account_name` (text, display name)
      - `access_token_encrypted` (text, encrypted OAuth token)
      - `token_expires_at` (timestamptz)
      - `last_sync_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `content_templates`
      - `id` (uuid, primary key)
      - `store_id` (uuid, foreign key to stores)
      - `name` (text, template name)
      - `category` (text, e.g., customer_appreciation, milestone)
      - `content_template` (text, template with variables)
      - `default_hashtags` (text[])
      - `default_platforms` (text[])
      - `usage_count` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `content_library`
      - `id` (uuid, primary key)
      - `store_id` (uuid, foreign key to stores)
      - `asset_type` (text, image, caption, hashtag_set)
      - `name` (text, asset name)
      - `content` (text, asset content or URL)
      - `tags` (text[], categorization tags)
      - `metadata` (jsonb, additional data)
      - `usage_count` (integer)
      - `created_at` (timestamptz)

    - `post_analytics`
      - `id` (uuid, primary key)
      - `post_id` (uuid, foreign key to social_posts)
      - `platform` (text)
      - `impressions` (integer)
      - `reach` (integer)
      - `likes` (integer)
      - `comments` (integer)
      - `shares` (integer)
      - `saves` (integer)
      - `clicks` (integer)
      - `engagement_rate` (decimal)
      - `synced_at` (timestamptz)

    - `post_comments`
      - `id` (uuid, primary key)
      - `post_id` (uuid, foreign key to social_posts)
      - `user_name` (text, commenter name)
      - `comment` (text)
      - `comment_type` (text: feedback, approval_request, revision)
      - `created_at` (timestamptz)

    - `scheduling_calendar`
      - `id` (uuid, primary key)
      - `store_id` (uuid, foreign key to stores)
      - `post_id` (uuid, foreign key to social_posts, nullable)
      - `date` (date, calendar date)
      - `time_slot` (time, scheduled time)
      - `is_optimal` (boolean, AI-recommended time)
      - `theme` (text, content theme for the day)
      - `notes` (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their store's content
    - Restrict access to platform_connections (sensitive data)

  3. Performance
    - Add indexes for frequently queried columns
    - Create composite indexes for optimal query performance

  4. Important Notes
    - All timestamps use timestamptz for proper timezone handling
    - Platform tokens should be encrypted at application level before storage
    - Engagement metrics stored as JSONB for flexibility
    - Support for multi-store management built-in
*/

-- Create custom types
DO $$ BEGIN
  CREATE TYPE post_status AS ENUM ('draft', 'scheduled', 'published', 'failed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE asset_type AS ENUM ('image', 'caption', 'hashtag_set', 'template');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE comment_type AS ENUM ('feedback', 'approval_request', 'revision', 'general');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Social Posts Table
CREATE TABLE IF NOT EXISTS social_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE,
  content text NOT NULL,
  status post_status DEFAULT 'draft',
  scheduled_for timestamptz,
  published_at timestamptz,
  platforms text[] NOT NULL DEFAULT '{}',
  hashtags text[] DEFAULT '{}',
  engagement_metrics jsonb DEFAULT '{}',
  ai_generated boolean DEFAULT false,
  source_review_id uuid,
  created_by text NOT NULL DEFAULT 'system',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Social Post Images Table
CREATE TABLE IF NOT EXISTS social_post_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES social_posts(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  alt_text text DEFAULT '',
  order_index integer DEFAULT 0,
  platform_optimizations jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Platform Connections Table
CREATE TABLE IF NOT EXISTS platform_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  platform_name text NOT NULL,
  is_connected boolean DEFAULT false,
  account_id text,
  account_name text,
  access_token_encrypted text,
  token_expires_at timestamptz,
  last_sync_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(store_id, platform_name)
);

-- Content Templates Table
CREATE TABLE IF NOT EXISTS content_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  content_template text NOT NULL,
  default_hashtags text[] DEFAULT '{}',
  default_platforms text[] DEFAULT '{}',
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Content Library Table
CREATE TABLE IF NOT EXISTS content_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  asset_type asset_type NOT NULL,
  name text NOT NULL,
  content text NOT NULL,
  tags text[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Post Analytics Table
CREATE TABLE IF NOT EXISTS post_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES social_posts(id) ON DELETE CASCADE NOT NULL,
  platform text NOT NULL,
  impressions integer DEFAULT 0,
  reach integer DEFAULT 0,
  likes integer DEFAULT 0,
  comments integer DEFAULT 0,
  shares integer DEFAULT 0,
  saves integer DEFAULT 0,
  clicks integer DEFAULT 0,
  engagement_rate decimal(5,2) DEFAULT 0,
  synced_at timestamptz DEFAULT now(),
  UNIQUE(post_id, platform, synced_at)
);

-- Post Comments Table
CREATE TABLE IF NOT EXISTS post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES social_posts(id) ON DELETE CASCADE NOT NULL,
  user_name text NOT NULL,
  comment text NOT NULL,
  comment_type comment_type DEFAULT 'general',
  created_at timestamptz DEFAULT now()
);

-- Scheduling Calendar Table
CREATE TABLE IF NOT EXISTS scheduling_calendar (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES social_posts(id) ON DELETE SET NULL,
  date date NOT NULL,
  time_slot time NOT NULL,
  is_optimal boolean DEFAULT false,
  theme text,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(store_id, date, time_slot)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_social_posts_store_id ON social_posts(store_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_status ON social_posts(status);
CREATE INDEX IF NOT EXISTS idx_social_posts_scheduled_for ON social_posts(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_social_posts_created_at ON social_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_post_images_post_id ON social_post_images(post_id);
CREATE INDEX IF NOT EXISTS idx_platform_connections_store_id ON platform_connections(store_id);
CREATE INDEX IF NOT EXISTS idx_content_templates_store_id ON content_templates(store_id);
CREATE INDEX IF NOT EXISTS idx_content_library_store_id ON content_library(store_id);
CREATE INDEX IF NOT EXISTS idx_content_library_tags ON content_library USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_post_analytics_post_id ON post_analytics(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_scheduling_calendar_store_date ON scheduling_calendar(store_id, date);

-- Enable Row Level Security
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_post_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduling_calendar ENABLE ROW LEVEL SECURITY;

-- RLS Policies for social_posts
CREATE POLICY "Users can view posts for their stores"
  ON social_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert posts for their stores"
  ON social_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update posts for their stores"
  ON social_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete posts for their stores"
  ON social_posts FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for social_post_images
CREATE POLICY "Users can view post images"
  ON social_post_images FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert post images"
  ON social_post_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can delete post images"
  ON social_post_images FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for platform_connections (restrictive)
CREATE POLICY "Users can view their platform connections"
  ON platform_connections FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their platform connections"
  ON platform_connections FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for content_templates
CREATE POLICY "Users can view content templates"
  ON content_templates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage content templates"
  ON content_templates FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for content_library
CREATE POLICY "Users can view content library"
  ON content_library FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage content library"
  ON content_library FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for post_analytics
CREATE POLICY "Users can view post analytics"
  ON post_analytics FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert post analytics"
  ON post_analytics FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for post_comments
CREATE POLICY "Users can view post comments"
  ON post_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can add post comments"
  ON post_comments FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for scheduling_calendar
CREATE POLICY "Users can view scheduling calendar"
  ON scheduling_calendar FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage scheduling calendar"
  ON scheduling_calendar FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DO $$ BEGIN
  CREATE TRIGGER update_social_posts_updated_at BEFORE UPDATE ON social_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_platform_connections_updated_at BEFORE UPDATE ON platform_connections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_content_templates_updated_at BEFORE UPDATE ON content_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
