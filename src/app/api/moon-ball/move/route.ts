import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

interface MoveRequest {
  playerId: string;
  direction: 'moon' | 'earth';
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
    const body: MoveRequest = await request.json();
    const { playerId, direction } = body;

    // Validate input
    if (!playerId || typeof playerId !== 'string') {
      return NextResponse.json({ error: 'Player ID is required' }, { status: 400 });
    }

    if (!direction || !['moon', 'earth'].includes(direction)) {
      return NextResponse.json({ error: 'Direction must be "moon" or "earth"' }, { status: 400 });
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

    // Get moon ball state
    const { data: moonBallState, error: moonBallError } = await supabase
      .from('moon_ball_state')
      .select('*')
      .eq('round_id', activeRound.id)
      .single();

    if (moonBallError || !moonBallState) {
      return NextResponse.json({ error: 'Moon ball state not found' }, { status: 400 });
    }

    // Check if game already ended
    if (moonBallState.moon_reached || moonBallState.earth_reached) {
      return NextResponse.json({ error: 'Game already ended' }, { status: 400 });
    }

    // Calculate random distance (5-15)
    const distance = Math.floor(Math.random() * 11) + 5; // 5 to 15

    // Calculate new position
    let newPosition: number;
    if (direction === 'moon') {
      newPosition = Math.min(moonBallState.ball_position + distance, 100);
    } else {
      newPosition = Math.max(moonBallState.ball_position - distance, 0);
    }

    const positionBefore = moonBallState.ball_position;

    // Deduct energy from player
    await supabase
      .from('players')
      .update({
        energy: currentEnergy - 1,
        last_energy_update: new Date().toISOString(),
      })
      .eq('id', playerId);

    // Record the move
    await supabase.from('moon_ball_moves').insert({
      round_id: activeRound.id,
      player_id: playerId,
      direction,
      distance_moved: distance,
      position_before: positionBefore,
      position_after: newPosition,
    });

    // Check for win condition
    let winType: 'moon' | 'earth' | null = null;
    const moonReached = newPosition >= 100;
    const earthReached = newPosition <= 0;

    // Update moon ball state
    const updateData: Record<string, unknown> = {
      ball_position: newPosition,
      total_pushes_moon: moonBallState.total_pushes_moon + (direction === 'moon' ? 1 : 0),
      total_pushes_earth: moonBallState.total_pushes_earth + (direction === 'earth' ? 1 : 0),
    };

    if (moonReached) {
      updateData.moon_reached = true;
      winType = 'moon';
    } else if (earthReached) {
      updateData.earth_reached = true;
      winType = 'earth';
    }

    await supabase
      .from('moon_ball_state')
      .update(updateData)
      .eq('id', moonBallState.id);

    // Handle win
    let newEnergy = currentEnergy - 1;
    if (winType) {
      // Add to hall of fame
      await supabase.from('hall_of_fame').insert({
        round_id: activeRound.id,
        player_id: playerId,
        player_name: player.username,
        win_type: winType,
        ball_position: newPosition,
      });

      // Give player +5 energy and update wins
      newEnergy = Math.min(currentEnergy - 1 + 5, (player as Player).max_energy);
      await supabase
        .from('players')
        .update({
          energy: newEnergy,
          total_wins: player.total_wins + 1,
          moon_wins: player.moon_wins + (winType === 'moon' ? 1 : 0),
          earth_wins: player.earth_wins + (winType === 'earth' ? 1 : 0),
        })
        .eq('id', playerId);
    }

    return NextResponse.json({
      success: true,
      moonBallState: {
        ball_position: newPosition,
        moon_reached: moonReached || moonBallState.moon_reached,
        earth_reached: earthReached || moonBallState.earth_reached,
        total_pushes_moon: moonBallState.total_pushes_moon + (direction === 'moon' ? 1 : 0),
        total_pushes_earth: moonBallState.total_pushes_earth + (direction === 'earth' ? 1 : 0),
      },
      winner: winType,
      player: {
        ...player,
        energy: newEnergy,
        total_wins: winType ? player.total_wins + 1 : player.total_wins,
        moon_wins: winType === 'moon' ? player.moon_wins + 1 : player.moon_wins,
        earth_wins: winType === 'earth' ? player.earth_wins + 1 : player.earth_wins,
      },
    });
  } catch (error) {
    console.error('Error in moon ball move API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
