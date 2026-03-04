import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

interface RevealRequest {
  playerId: string;
  cellIndex: number;
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
    const body: RevealRequest = await request.json();
    const { playerId, cellIndex } = body;

    // Validate input
    if (!playerId || typeof playerId !== 'string') {
      return NextResponse.json({ error: 'Player ID is required' }, { status: 400 });
    }

    if (typeof cellIndex !== 'number' || cellIndex < 0 || cellIndex >= 100) {
      return NextResponse.json({ error: 'Cell index must be between 0 and 99' }, { status: 400 });
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

    // Get meme game state
    const { data: memeGameState, error: memeGameError } = await supabase
      .from('meme_game_state')
      .select('*')
      .eq('round_id', activeRound.id)
      .single();

    if (memeGameError || !memeGameState) {
      return NextResponse.json({ error: 'Meme game state not found' }, { status: 400 });
    }

    // Check if meme already found
    if (memeGameState.meme_found) {
      return NextResponse.json({ error: 'Meme already found this round' }, { status: 400 });
    }

    // Check if cell already revealed
    const { data: existingReveal, error: revealCheckError } = await supabase
      .from('revealed_cells')
      .select('*')
      .eq('round_id', activeRound.id)
      .eq('cell_index', cellIndex)
      .single();

    if (existingReveal) {
      return NextResponse.json({ error: 'Cell already revealed' }, { status: 400 });
    }

    // Deduct energy from player
    await supabase
      .from('players')
      .update({
        energy: currentEnergy - 1,
        last_energy_update: new Date().toISOString(),
      })
      .eq('id', playerId);

    // Check if this is the meme position
    const isMeme = cellIndex === memeGameState.meme_position;

    // Record the reveal
    await supabase.from('revealed_cells').insert({
      round_id: activeRound.id,
      player_id: playerId,
      cell_index: cellIndex,
      is_meme: isMeme,
    });

    // Update meme game state total reveals
    await supabase
      .from('meme_game_state')
      .update({
        total_reveals: memeGameState.total_reveals + 1,
        meme_found: isMeme,
      })
      .eq('id', memeGameState.id);

    // Handle win
    let newEnergy = currentEnergy - 1;
    if (isMeme) {
      // Add to hall of fame
      await supabase.from('hall_of_fame').insert({
        round_id: activeRound.id,
        player_id: playerId,
        player_name: player.username,
        win_type: 'meme',
        attempts: memeGameState.total_reveals + 1,
      });

      // Give player +5 energy and update wins
      newEnergy = Math.min(currentEnergy - 1 + 5, (player as Player).max_energy);
      await supabase
        .from('players')
        .update({
          energy: newEnergy,
          total_wins: player.total_wins + 1,
          meme_wins: player.meme_wins + 1,
        })
        .eq('id', playerId);
    }

    // Get all revealed cells for this round
    const { data: allRevealedCells } = await supabase
      .from('revealed_cells')
      .select('cell_index, is_meme, player_id')
      .eq('round_id', activeRound.id);

    return NextResponse.json({
      success: true,
      memeGameState: {
        ...memeGameState,
        total_reveals: memeGameState.total_reveals + 1,
        meme_found: isMeme,
      },
      revealedCells: allRevealedCells || [],
      winner: isMeme ? 'meme' : null,
      attempts: memeGameState.total_reveals + 1,
      player: {
        ...player,
        energy: newEnergy,
        total_wins: isMeme ? player.total_wins + 1 : player.total_wins,
        meme_wins: isMeme ? player.meme_wins + 1 : player.meme_wins,
      },
    });
  } catch (error) {
    console.error('Error in meme reveal API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
