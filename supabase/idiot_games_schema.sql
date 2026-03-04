-- Idiot Games Database Schema for Supabase
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============ PLAYERS ============
-- User accounts with persistent usernames and energy
CREATE TABLE IF NOT EXISTS players (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  energy INTEGER DEFAULT 10 CHECK (energy >= 0 AND energy <= 50),
  max_energy INTEGER DEFAULT 10,
  last_energy_update TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_wins INTEGER DEFAULT 0,
  moon_wins INTEGER DEFAULT 0,
  earth_wins INTEGER DEFAULT 0,
  meme_wins INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ GAME ROUNDS ============
-- Each 48-hour round has its own record
CREATE TABLE IF NOT EXISTS game_rounds (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  round_number INTEGER NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  reset_early BOOLEAN DEFAULT FALSE,
  reset_reason TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'early_reset')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ MOON BALL GAME ============
-- Current ball position and state
CREATE TABLE IF NOT EXISTS moon_ball_state (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  round_id UUID REFERENCES game_rounds(id) ON DELETE CASCADE NOT NULL,
  ball_position INTEGER DEFAULT 50 CHECK (ball_position >= 0 AND ball_position <= 100),
  total_pushes_moon INTEGER DEFAULT 0,
  total_pushes_earth INTEGER DEFAULT 0,
  moon_reached BOOLEAN DEFAULT FALSE,
  earth_reached BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(round_id)
);

-- Moon ball moves history
CREATE TABLE IF NOT EXISTS moon_ball_moves (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  round_id UUID REFERENCES game_rounds(id) ON DELETE CASCADE NOT NULL,
  player_id UUID REFERENCES players(id) ON DELETE SET NULL,
  direction TEXT NOT NULL CHECK (direction IN ('moon', 'earth')),
  distance_moved INTEGER NOT NULL,
  position_before INTEGER NOT NULL,
  position_after INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ FIND THE MEME GAME ============
-- Meme position and revealed cells
CREATE TABLE IF NOT EXISTS meme_game_state (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  round_id UUID REFERENCES game_rounds(id) ON DELETE CASCADE NOT NULL,
  meme_position INTEGER NOT NULL CHECK (meme_position >= 0 AND meme_position < 100),
  meme_emoji TEXT DEFAULT '🤡',
  total_reveals INTEGER DEFAULT 0,
  meme_found BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(round_id)
);

-- Revealed cells tracking
CREATE TABLE IF NOT EXISTS revealed_cells (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  round_id UUID REFERENCES game_rounds(id) ON DELETE CASCADE NOT NULL,
  player_id UUID REFERENCES players(id) ON DELETE SET NULL,
  cell_index INTEGER NOT NULL CHECK (cell_index >= 0 AND cell_index < 100),
  is_meme BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(round_id, cell_index)
);

-- ============ TEAM VOTE GAME ============
-- Current battle and vote counts
CREATE TABLE IF NOT EXISTS team_vote_state (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  round_id UUID REFERENCES game_rounds(id) ON DELETE CASCADE NOT NULL,
  battle_id TEXT NOT NULL,
  left_name TEXT NOT NULL,
  left_emoji TEXT NOT NULL,
  right_name TEXT NOT NULL,
  right_emoji TEXT NOT NULL,
  left_votes INTEGER DEFAULT 0,
  right_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(round_id)
);

-- Individual votes tracking (one vote per player per battle)
CREATE TABLE IF NOT EXISTS player_votes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  round_id UUID REFERENCES game_rounds(id) ON DELETE CASCADE NOT NULL,
  player_id UUID REFERENCES players(id) ON DELETE SET NULL,
  battle_id TEXT NOT NULL,
  vote_side TEXT NOT NULL CHECK (vote_side IN ('left', 'right')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(round_id, player_id, battle_id)
);

-- ============ HALL OF FAME ============
-- Winners of each game type
CREATE TABLE IF NOT EXISTS hall_of_fame (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  round_id UUID REFERENCES game_rounds(id) ON DELETE CASCADE NOT NULL,
  player_id UUID REFERENCES players(id) ON DELETE SET NULL,
  player_name TEXT NOT NULL,
  win_type TEXT NOT NULL CHECK (win_type IN ('moon', 'earth', 'meme')),
  attempts INTEGER,
  ball_position INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ ROW LEVEL SECURITY (RLS) ============

-- Enable RLS on all tables
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE moon_ball_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE moon_ball_moves ENABLE ROW LEVEL SECURITY;
ALTER TABLE meme_game_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE revealed_cells ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_vote_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE hall_of_fame ENABLE ROW LEVEL SECURITY;

-- Players policies (public read, insert allowed)
CREATE POLICY "Anyone can view players" ON players FOR SELECT USING (true);
CREATE POLICY "Anyone can insert players" ON players FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update players" ON players FOR UPDATE USING (true);

-- Game rounds policies
CREATE POLICY "Anyone can view game rounds" ON game_rounds FOR SELECT USING (true);
CREATE POLICY "Anyone can insert game rounds" ON game_rounds FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update game rounds" ON game_rounds FOR UPDATE USING (true);

-- Moon ball policies
CREATE POLICY "Anyone can view moon ball state" ON moon_ball_state FOR SELECT USING (true);
CREATE POLICY "Anyone can insert moon ball state" ON moon_ball_state FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update moon ball state" ON moon_ball_state FOR UPDATE USING (true);
CREATE POLICY "Anyone can view moon ball moves" ON moon_ball_moves FOR SELECT USING (true);
CREATE POLICY "Anyone can insert moon ball moves" ON moon_ball_moves FOR INSERT WITH CHECK (true);

-- Meme game policies
CREATE POLICY "Anyone can view meme game state" ON meme_game_state FOR SELECT USING (true);
CREATE POLICY "Anyone can insert meme game state" ON meme_game_state FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update meme game state" ON meme_game_state FOR UPDATE USING (true);
CREATE POLICY "Anyone can view revealed cells" ON revealed_cells FOR SELECT USING (true);
CREATE POLICY "Anyone can insert revealed cells" ON revealed_cells FOR INSERT WITH CHECK (true);

-- Team vote policies
CREATE POLICY "Anyone can view team vote state" ON team_vote_state FOR SELECT USING (true);
CREATE POLICY "Anyone can insert team vote state" ON team_vote_state FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update team vote state" ON team_vote_state FOR UPDATE USING (true);
CREATE POLICY "Anyone can view player votes" ON player_votes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert player votes" ON player_votes FOR INSERT WITH CHECK (true);

-- Hall of fame policies
CREATE POLICY "Anyone can view hall of fame" ON hall_of_fame FOR SELECT USING (true);
CREATE POLICY "Anyone can insert hall of fame" ON hall_of_fame FOR INSERT WITH CHECK (true);

-- ============ FUNCTIONS AND TRIGGERS ============

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_moon_ball_state_updated_at BEFORE UPDATE ON moon_ball_state
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meme_game_state_updated_at BEFORE UPDATE ON meme_game_state
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_vote_state_updated_at BEFORE UPDATE ON team_vote_state
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============ INITIAL DATA ============

-- Insert first game round
INSERT INTO game_rounds (round_number, status)
SELECT 1, 'active'
WHERE NOT EXISTS (SELECT 1 FROM game_rounds WHERE round_number = 1);

-- ============ INDEXES FOR PERFORMANCE ============

CREATE INDEX IF NOT EXISTS idx_players_username ON players(username);
CREATE INDEX IF NOT EXISTS idx_game_rounds_status ON game_rounds(status);
CREATE INDEX IF NOT EXISTS idx_hall_of_fame_win_type ON hall_of_fame(win_type);
CREATE INDEX IF NOT EXISTS idx_hall_of_fame_created_at ON hall_of_fame(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_revealed_cells_round ON revealed_cells(round_id);
CREATE INDEX IF NOT EXISTS idx_player_votes_round ON player_votes(round_id);
