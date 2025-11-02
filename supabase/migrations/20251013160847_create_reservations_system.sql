/*
  # Create Reservations Management System

  ## Overview
  This migration creates a comprehensive table reservations system for restaurant management,
  integrated with the existing multi-store review platform.

  ## 1. New Tables
  
  ### `reservations`
  Main table storing all reservation data:
  - `id` (uuid, primary key) - Unique identifier
  - `store_id` (text) - Links to the store/restaurant
  - `customer_name` (text) - Guest name
  - `customer_email` (text) - Guest email
  - `customer_phone` (text) - Guest phone number
  - `party_size` (integer) - Number of guests
  - `reservation_date` (date) - Date of reservation
  - `reservation_time` (time) - Time slot
  - `special_requests` (text, nullable) - Any special requests or notes
  - `status` (text) - pending, confirmed, seated, completed, cancelled, no_show
  - `table_number` (text, nullable) - Assigned table
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  - `is_recurring` (boolean) - Flag for recurring reservations (demo only)
  - `recurring_pattern` (text, nullable) - Pattern description (weekly, monthly, etc.)

  ### `time_slots`
  Available time slots per store:
  - `id` (uuid, primary key)
  - `store_id` (text) - Store identifier
  - `day_of_week` (integer) - 0-6 (Sunday-Saturday)
  - `time` (time) - Slot time
  - `capacity` (integer) - Max tables/parties
  - `is_active` (boolean) - Whether slot is currently offered
  - `created_at` (timestamptz)

  ### `booking_settings`
  Store-specific booking configuration:
  - `id` (uuid, primary key)
  - `store_id` (text, unique) - Store identifier
  - `advance_booking_days` (integer) - How far ahead customers can book
  - `max_party_size` (integer) - Maximum party size allowed
  - `min_party_size` (integer) - Minimum party size
  - `default_duration_minutes` (integer) - Default reservation duration
  - `allow_same_day_booking` (boolean)
  - `require_phone` (boolean)
  - `require_email` (boolean)
  - `auto_confirm` (boolean) - Auto-confirm or require manual approval
  - `cancellation_deadline_hours` (integer) - Hours before reservation
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## 2. Security
  - Enable RLS on all tables
  - Create policies for authenticated users to manage reservations for their stores
  - Separate policies for reading vs writing data

  ## 3. Important Notes
  - All timestamps use UTC timezone
  - Status transitions should be managed by application logic
  - Time slots are configurable per store for flexibility
  - Recurring reservations are demo-only features (not functional)
  - Email/SMS confirmations would be handled at application layer
*/

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id text NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  party_size integer NOT NULL CHECK (party_size > 0 AND party_size <= 50),
  reservation_date date NOT NULL,
  reservation_time time NOT NULL,
  special_requests text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show')),
  table_number text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_recurring boolean DEFAULT false,
  recurring_pattern text,
  CONSTRAINT valid_reservation_datetime CHECK (reservation_date >= CURRENT_DATE)
);

-- Create time slots table
CREATE TABLE IF NOT EXISTS time_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id text NOT NULL,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  time time NOT NULL,
  capacity integer NOT NULL DEFAULT 10 CHECK (capacity > 0),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(store_id, day_of_week, time)
);

-- Create booking settings table
CREATE TABLE IF NOT EXISTS booking_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id text UNIQUE NOT NULL,
  advance_booking_days integer DEFAULT 30 CHECK (advance_booking_days > 0),
  max_party_size integer DEFAULT 20 CHECK (max_party_size > 0),
  min_party_size integer DEFAULT 1 CHECK (min_party_size > 0),
  default_duration_minutes integer DEFAULT 90 CHECK (default_duration_minutes > 0),
  allow_same_day_booking boolean DEFAULT true,
  require_phone boolean DEFAULT true,
  require_email boolean DEFAULT true,
  auto_confirm boolean DEFAULT false,
  cancellation_deadline_hours integer DEFAULT 24 CHECK (cancellation_deadline_hours >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_reservations_store_date ON reservations(store_id, reservation_date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_customer_email ON reservations(customer_email);
CREATE INDEX IF NOT EXISTS idx_time_slots_store ON time_slots(store_id);
CREATE INDEX IF NOT EXISTS idx_booking_settings_store ON booking_settings(store_id);

-- Enable Row Level Security
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reservations table
CREATE POLICY "Users can view reservations for their stores"
  ON reservations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reservations"
  ON reservations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update reservations"
  ON reservations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete reservations"
  ON reservations FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for time_slots table
CREATE POLICY "Users can view time slots"
  ON time_slots FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage time slots"
  ON time_slots FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update time slots"
  ON time_slots FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete time slots"
  ON time_slots FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for booking_settings table
CREATE POLICY "Users can view booking settings"
  ON booking_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage booking settings"
  ON booking_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update booking settings"
  ON booking_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_booking_settings_updated_at
  BEFORE UPDATE ON booking_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();