import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Get active round
    const { data: activeRound, error: roundError } = await supabase
      .from('game_rounds')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (roundError && roundError.code !== 'PGRST116') {
      console.error('Error fetching active round:', roundError);
      return NextResponse.json({ error: 'Failed to fetch game state' }, { status: 500 });
    }

    if (!activeRound) {
      return NextResponse.json({
        activeRound: null,
        moonBallState: null,
        memeGameState: null,
        teamVoteState: null,
        revealedCells: [],
        hallOfFame: [],
      });
    }

    // Get moon ball state for current round
    const { data: moonBallState, error: moonBallError } = await supabase
      .from('moon_ball_state')
      .select('*')
      .eq('round_id', activeRound.id)
      .single();

    if (moonBallError && moonBallError.code !== 'PGRST116') {
      console.error('Error fetching moon ball state:', moonBallError);
    }

    // Get meme game state for current round
    const { data: memeGameState, error: memeGameError } = await supabase
      .from('meme_game_state')
      .select('*')
      .eq('round_id', activeRound.id)
      .single();

    if (memeGameError && memeGameError.code !== 'PGRST116') {
      console.error('Error fetching meme game state:', memeGameError);
    }

    // Get team vote state for current round
    const { data: teamVoteState, error: teamVoteError } = await supabase
      .from('team_vote_state')
      .select('*')
      .eq('round_id', activeRound.id)
      .single();

    if (teamVoteError && teamVoteError.code !== 'PGRST116') {
      console.error('Error fetching team vote state:', teamVoteError);
    }

    // Get revealed cells for current round
    const { data: revealedCells, error: revealedError } = await supabase
      .from('revealed_cells')
      .select('cell_index, is_meme, created_at, player_id')
      .eq('round_id', activeRound.id)
      .order('created_at', { ascending: true });

    if (revealedError) {
      console.error('Error fetching revealed cells:', revealedError);
    }

    // Get recent hall of fame entries (last 20)
    const { data: hallOfFame, error: hallOfFameError } = await supabase
      .from('hall_of_fame')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (hallOfFameError) {
      console.error('Error fetching hall of fame:', hallOfFameError);
    }

    return NextResponse.json({
      activeRound,
      moonBallState: moonBallState || null,
      memeGameState: memeGameState || null,
      teamVoteState: teamVoteState || null,
      revealedCells: revealedCells || [],
      hallOfFame: hallOfFame || [],
    });
  } catch (error) {
    console.error('Error in game state API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
