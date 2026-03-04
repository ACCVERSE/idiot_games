import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

interface CastVoteRequest {
  playerId: string;
  battleId: string;
  side: 'left' | 'right';
}

interface Player {
  id: string;
  username: string;
  energy: number;
  max_energy: number;
  last_energy_update: string;
  total_wins: number;
  moon_wins: number;
  earth_wins: number;
  meme_wins: number;
}

function calculateCurrentEnergy(player: Player): number {
  const lastUpdate = new Date(player.last_energy_update);
  const now = new Date();
  const hoursPassed = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
  const energyRegenerated = Math.floor(hoursPassed);
  return Math.min(player.energy + energyRegenerated, player.max_energy);
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body: CastVoteRequest = await request.json();
    const { playerId, battleId, side } = body;

    // Validate input
    if (!playerId || typeof playerId !== 'string') {
      return NextResponse.json({ error: 'Player ID is required' }, { status: 400 });
    }

    if (!battleId || typeof battleId !== 'string') {
      return NextResponse.json({ error: 'Battle ID is required' }, { status: 400 });
    }

    if (!side || !['left', 'right'].includes(side)) {
      return NextResponse.json({ error: 'Side must be "left" or "right"' }, { status: 400 });
    }

    // Get player
    const { data: player, error: playerError } = await supabase
      .from('players')
      .select('*')
      .eq('id', playerId)
      .single();

    if (playerError || !player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    // Calculate current energy
    const currentEnergy = calculateCurrentEnergy(player as Player);

    // Check if player has enough energy
    if (currentEnergy < 1) {
      return NextResponse.json({ error: 'Not enough energy' }, { status: 400 });
    }

    // Get active round
    const { data: activeRound, error: roundError } = await supabase
      .from('game_rounds')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (roundError || !activeRound) {
      return NextResponse.json({ error: 'No active round found' }, { status: 400 });
    }

    // Get team vote state
    const { data: teamVoteState, error: teamVoteError } = await supabase
      .from('team_vote_state')
      .select('*')
      .eq('round_id', activeRound.id)
      .single();

    if (teamVoteError || !teamVoteState) {
      return NextResponse.json({ error: 'Team vote state not found' }, { status: 400 });
    }

    // Check if player has already voted for this battle in this round
    const { data: existingVote, error: voteCheckError } = await supabase
      .from('player_votes')
      .select('*')
      .eq('round_id', activeRound.id)
      .eq('player_id', playerId)
      .eq('battle_id', battleId)
      .single();

    if (existingVote) {
      return NextResponse.json({ error: 'You have already voted for this battle' }, { status: 400 });
    }

    // Deduct energy from player
    await supabase
      .from('players')
      .update({
        energy: currentEnergy - 1,
        last_energy_update: new Date().toISOString(),
      })
      .eq('id', playerId);

    // Record the vote
    await supabase.from('player_votes').insert({
      round_id: activeRound.id,
      player_id: playerId,
      battle_id: battleId,
      vote_side: side,
    });

    // Update team vote state counts
    const updateData: Record<string, number> = {};
    if (side === 'left') {
      updateData.left_votes = teamVoteState.left_votes + 1;
    } else {
      updateData.right_votes = teamVoteState.right_votes + 1;
    }

    await supabase
      .from('team_vote_state')
      .update(updateData)
      .eq('id', teamVoteState.id);

    return NextResponse.json({
      success: true,
      teamVoteState: {
        ...teamVoteState,
        left_votes: side === 'left' ? teamVoteState.left_votes + 1 : teamVoteState.left_votes,
        right_votes: side === 'right' ? teamVoteState.right_votes + 1 : teamVoteState.right_votes,
      },
      player: {
        ...player,
        energy: currentEnergy - 1,
      },
    });
  } catch (error) {
    console.error('Error in vote cast API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
