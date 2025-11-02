/*
  # Dashboard Personalization Schema

  1. New Tables
    - `dashboard_layouts`
      - `id` (uuid, primary key)
      - `store_id` (uuid, foreign key to stores)
      - `layout_name` (text) - Name of the saved layout
      - `is_default` (boolean) - Whether this is the default layout
      - `widgets` (jsonb) - Widget configuration including positions and visibility
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `user_preferences`
      - `id` (uuid, primary key)
      - `store_id` (uuid, foreign key to stores)
      - `auto_refresh_enabled` (boolean) - Auto-refresh toggle
      - `auto_refresh_interval` (integer) - Interval in minutes
      - `compact_mode` (boolean) - Compact vs expanded view
      - `theme_preference` (text) - light, dark, or system
      - `notification_settings` (jsonb) - Notification preferences
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own layouts and preferences
*/

-- Create dashboard_layouts table
CREATE TABLE IF NOT EXISTS dashboard_layouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  layout_name text NOT NULL,
  is_default boolean DEFAULT false,
  widgets jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE NOT NULL UNIQUE,
  auto_refresh_enabled boolean DEFAULT false,
  auto_refresh_interval integer DEFAULT 5,
  compact_mode boolean DEFAULT false,
  theme_preference text DEFAULT 'system',
  notification_settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE dashboard_layouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Dashboard layouts policies
CREATE POLICY "Users can view layouts for their stores"
  ON dashboard_layouts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = dashboard_layouts.store_id
    )
  );

CREATE POLICY "Users can create layouts for their stores"
  ON dashboard_layouts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = dashboard_layouts.store_id
    )
  );

CREATE POLICY "Users can update layouts for their stores"
  ON dashboard_layouts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = dashboard_layouts.store_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = dashboard_layouts.store_id
    )
  );

CREATE POLICY "Users can delete layouts for their stores"
  ON dashboard_layouts FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = dashboard_layouts.store_id
    )
  );

-- User preferences policies
CREATE POLICY "Users can view preferences for their stores"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = user_preferences.store_id
    )
  );

CREATE POLICY "Users can create preferences for their stores"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = user_preferences.store_id
    )
  );

CREATE POLICY "Users can update preferences for their stores"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = user_preferences.store_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = user_preferences.store_id
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dashboard_layouts_store_id ON dashboard_layouts(store_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_layouts_is_default ON dashboard_layouts(is_default) WHERE is_default = true;
CREATE INDEX IF NOT EXISTS idx_user_preferences_store_id ON user_preferences(store_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_dashboard_layouts_updated_at'
  ) THEN
    CREATE TRIGGER update_dashboard_layouts_updated_at
      BEFORE UPDATE ON dashboard_layouts
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_user_preferences_updated_at'
  ) THEN
    CREATE TRIGGER update_user_preferences_updated_at
      BEFORE UPDATE ON user_preferences
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
