-- Accverse Database Schema for Supabase
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar TEXT,
  region TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pets table
CREATE TABLE IF NOT EXISTS pets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  species TEXT NOT NULL CHECK (species IN ('dog', 'cat', 'rabbit', 'bird', 'other')),
  breed TEXT NOT NULL,
  birthdate DATE NOT NULL,
  sex TEXT NOT NULL CHECK (sex IN ('male', 'female')),
  sterilized BOOLEAN DEFAULT FALSE,
  description TEXT,
  photo TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'lost', 'deceased')),
  allergies TEXT[] DEFAULT '{}',
  is_reactive BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table (from pet's perspective)
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  image TEXT,
  likes INTEGER DEFAULT 0,
  is_national BOOLEAN DEFAULT FALSE,
  region TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vaccine records
CREATE TABLE IF NOT EXISTS vaccine_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  next_due DATE,
  veterinarian TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Treatment records
CREATE TABLE IF NOT EXISTS treatment_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  veterinarian TEXT NOT NULL,
  medications TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health observations
CREATE TABLE IF NOT EXISTS health_observations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('note', 'weight', 'symptom', 'medication')),
  content TEXT NOT NULL,
  value TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Photo albums
CREATE TABLE IF NOT EXISTS photo_albums (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Photos
CREATE TABLE IF NOT EXISTS photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  album_id UUID REFERENCES photo_albums(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  caption TEXT,
  shared_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Outings/Meetups
CREATE TABLE IF NOT EXISTS outings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  host_pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  max_participants INTEGER DEFAULT 10,
  species_filter TEXT[],
  sterilized_only BOOLEAN DEFAULT FALSE,
  exclude_reactive BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Outing participants
CREATE TABLE IF NOT EXISTS outing_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  outing_id UUID REFERENCES outings(id) ON DELETE CASCADE NOT NULL,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'interested' CHECK (status IN ('going', 'interested', 'maybe')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(outing_id, pet_id)
);

-- Professionals
CREATE TABLE IF NOT EXISTS professionals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('vet', 'groomer', 'breeder', 'rescue', 'trainer', 'pet_sitter')),
  description TEXT,
  photo TEXT,
  address TEXT,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  phone TEXT,
  email TEXT,
  services TEXT[],
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'pro', 'premium')),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Operating hours for professionals
CREATE TABLE IF NOT EXISTS operating_hours (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  open_time TEXT,
  close_time TEXT,
  is_closed BOOLEAN DEFAULT FALSE
);

-- Professional reviews
CREATE TABLE IF NOT EXISTS professional_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Likes tracking (for posts)
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, pet_id)
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccine_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE outings ENABLE ROW LEVEL SECURITY;
ALTER TABLE outing_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE operating_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Pets policies
CREATE POLICY "Users can view all pets" ON pets FOR SELECT USING (true);
CREATE POLICY "Users can insert own pets" ON pets FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own pets" ON pets FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own pets" ON pets FOR DELETE USING (auth.uid() = owner_id);

-- Posts policies
CREATE POLICY "Anyone can view posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Users can insert posts for own pets" ON posts FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM pets WHERE pets.id = posts.pet_id AND pets.owner_id = auth.uid())
);
CREATE POLICY "Users can delete own posts" ON posts FOR DELETE USING (
  EXISTS (SELECT 1 FROM pets WHERE pets.id = posts.pet_id AND pets.owner_id = auth.uid())
);

-- Comments policies
CREATE POLICY "Anyone can view comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Users can insert comments for own pets" ON comments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM pets WHERE pets.id = comments.pet_id AND pets.owner_id = auth.uid())
);

-- Vaccine records policies
CREATE POLICY "Users can view own pet vaccines" ON vaccine_records FOR SELECT USING (
  EXISTS (SELECT 1 FROM pets WHERE pets.id = vaccine_records.pet_id AND pets.owner_id = auth.uid())
);
CREATE POLICY "Users can manage own pet vaccines" ON vaccine_records FOR ALL USING (
  EXISTS (SELECT 1 FROM pets WHERE pets.id = vaccine_records.pet_id AND pets.owner_id = auth.uid())
);

-- Treatment records policies
CREATE POLICY "Users can view own pet treatments" ON treatment_records FOR SELECT USING (
  EXISTS (SELECT 1 FROM pets WHERE pets.id = treatment_records.pet_id AND pets.owner_id = auth.uid())
);
CREATE POLICY "Users can manage own pet treatments" ON treatment_records FOR ALL USING (
  EXISTS (SELECT 1 FROM pets WHERE pets.id = treatment_records.pet_id AND pets.owner_id = auth.uid())
);

-- Health observations policies
CREATE POLICY "Users can view own pet observations" ON health_observations FOR SELECT USING (
  EXISTS (SELECT 1 FROM pets WHERE pets.id = health_observations.pet_id AND pets.owner_id = auth.uid())
);
CREATE POLICY "Users can manage own pet observations" ON health_observations FOR ALL USING (
  EXISTS (SELECT 1 FROM pets WHERE pets.id = health_observations.pet_id AND pets.owner_id = auth.uid())
);

-- Photo albums policies
CREATE POLICY "Users can view own pet albums" ON photo_albums FOR SELECT USING (
  EXISTS (SELECT 1 FROM pets WHERE pets.id = photo_albums.pet_id AND pets.owner_id = auth.uid())
);
CREATE POLICY "Users can manage own pet albums" ON photo_albums FOR ALL USING (
  EXISTS (SELECT 1 FROM pets WHERE pets.id = photo_albums.pet_id AND pets.owner_id = auth.uid())
);

-- Photos policies
CREATE POLICY "Users can view own pet photos" ON photos FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM photo_albums
    JOIN pets ON pets.id = photo_albums.pet_id
    WHERE photo_albums.id = photos.album_id AND pets.owner_id = auth.uid()
  )
);
CREATE POLICY "Users can manage own pet photos" ON photos FOR ALL USING (
  EXISTS (
    SELECT 1 FROM photo_albums
    JOIN pets ON pets.id = photo_albums.pet_id
    WHERE photo_albums.id = photos.album_id AND pets.owner_id = auth.uid()
  )
);

-- Outings policies
CREATE POLICY "Anyone can view outings" ON outings FOR SELECT USING (true);
CREATE POLICY "Users can create outings for own pets" ON outings FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM pets WHERE pets.id = outings.host_pet_id AND pets.owner_id = auth.uid())
);

-- Professionals policies
CREATE POLICY "Anyone can view professionals" ON professionals FOR SELECT USING (true);
CREATE POLICY "Professionals can update own profile" ON professionals FOR UPDATE USING (auth.uid() = user_id);

-- Functions and triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON pets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professionals_updated_at BEFORE UPDATE ON professionals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, avatar)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
