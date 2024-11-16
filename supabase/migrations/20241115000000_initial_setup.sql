-- @@filename: supabase/migrations/20241115000000_initial_setup.sql

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS event_images CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS ticket_types CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users NOT NULL,
    full_name text,
    role text CHECK (role IN ('admin', 'organizer', 'user')) DEFAULT 'user',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_user_id UNIQUE (user_id)
);

-- Create events table
CREATE TABLE public.events (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    description text,
    venue text NOT NULL,
    date timestamp with time zone NOT NULL,
    organizer_id uuid REFERENCES auth.users NOT NULL,
    status text CHECK (status IN ('draft', 'published', 'cancelled')) DEFAULT 'draft',
    capacity integer CHECK (capacity > 0),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create ticket_types table
CREATE TABLE public.ticket_types (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id uuid REFERENCES events ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    price numeric(10,2) NOT NULL CHECK (price >= 0),
    quantity integer NOT NULL CHECK (quantity >= 0),
    quantity_sold integer DEFAULT 0 CHECK (quantity_sold >= 0),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    CONSTRAINT valid_quantity CHECK (quantity_sold <= quantity)
);

-- Create orders table
CREATE TABLE public.orders (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users NOT NULL,
    ticket_type_id uuid REFERENCES ticket_types NOT NULL,
    quantity integer NOT NULL CHECK (quantity > 0),
    total_amount numeric(10,2) NOT NULL CHECK (total_amount >= 0),
    payment_status text CHECK (payment_status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create event_images table
CREATE TABLE public.event_images (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id uuid REFERENCES events ON DELETE CASCADE NOT NULL,
    url text NOT NULL,
    alt text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Set up storage
INSERT INTO storage.buckets (id, name, public) 
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'event-images' );

CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND
  bucket_id = 'event-images'
);

CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
USING (
  auth.uid() = owner AND
  bucket_id = 'event-images'
);

CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (
  auth.uid() = owner AND
  bucket_id = 'event-images'
);

-- RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_images ENABLE ROW LEVEL SECURITY;

-- Profile policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE USING (
        auth.uid() = user_id
    );

-- Event policies
CREATE POLICY "Published events are viewable by everyone"
    ON events FOR SELECT
    USING (status = 'published' OR auth.uid() = organizer_id);

CREATE POLICY "Organizers can create events"
    ON events FOR INSERT
    WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update own events"
    ON events FOR UPDATE
    USING (auth.uid() = organizer_id);

CREATE POLICY "Organizers can delete own events"
    ON events FOR DELETE
    USING (auth.uid() = organizer_id);

-- Ticket type policies
CREATE POLICY "Published event tickets are viewable"
    ON ticket_types FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM events
            WHERE events.id = ticket_types.event_id
            AND (status = 'published' OR organizer_id = auth.uid())
        )
    );

CREATE POLICY "Event organizers can manage ticket types"
    ON ticket_types FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM events
            WHERE events.id = ticket_types.event_id
            AND organizer_id = auth.uid()
        )
    );

-- Order policies
CREATE POLICY "Users can view own orders"
    ON orders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
    ON orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Image policies
CREATE POLICY "Event images are viewable by everyone"
    ON event_images FOR SELECT
    USING (true);

CREATE POLICY "Event images can be managed by event organizers"
    ON event_images FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM events
            WHERE id = event_id
            AND organizer_id = auth.uid()
        )
    );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_ticket_types_event_id ON ticket_types(event_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_ticket_type_id ON orders(ticket_type_id);
CREATE INDEX IF NOT EXISTS idx_event_images_event_id ON event_images(event_id);