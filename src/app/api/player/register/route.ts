import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

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
  created_at: string;
  updated_at: string;
}

function calculateCurrentEnergy(player: Player): number {
  const lastUpdate = new Date(player.last_energy_update);
  const now = new Date();
  const hoursPassed = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
  const energyRegenerated = Math.floor(hoursPassed); // 1 energy per hour
  const newEnergy = Math.min(player.energy + energyRegenerated, player.max_energy);
  return newEnergy;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { username } = body;

    // Validate username
    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const trimmedUsername = username.trim().toLowerCase();

    if (trimmedUsername.length < 2 || trimmedUsername.length > 20) {
      return NextResponse.json({ error: 'Username must be between 2 and 20 characters' }, { status: 400 });
    }

    // Check if player exists
    const { data: existingPlayer, error: findError } = await supabase
      .from('players')
      .select('*')
      .eq('username', trimmedUsername)
      .single();

    if (findError && findError.code !== 'PGRST116') {
      console.error('Error finding player:', findError);
      return NextResponse.json({ error: 'Failed to check player' }, { status: 500 });
    }

    if (existingPlayer) {
      // Player exists - calculate current energy and return
      const currentEnergy = calculateCurrentEnergy(existingPlayer);

      // Update energy if it changed
      if (currentEnergy !== existingPlayer.energy) {
        const { data: updatedPlayer, error: updateError } = await supabase
          .from('players')
          .update({
            energy: currentEnergy,
            last_energy_update: new Date().toISOString(),
          })
          .eq('id', existingPlayer.id)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating player energy:', updateError);
          return NextResponse.json({ player: { ...existingPlayer, energy: currentEnergy } });
        }

        return NextResponse.json({
          player: updatedPlayer,
          isNew: false,
          message: 'Welcome back!',
        });
      }

      return NextResponse.json({
        player: existingPlayer,
        isNew: false,
        message: 'Welcome back!',
      });
    }

    // Create new player
    const { data: newPlayer, error: createError } = await supabase
      .from('players')
      .insert({
        username: trimmedUsername,
        energy: 10,
        max_energy: 10,
        total_wins: 0,
        moon_wins: 0,
        earth_wins: 0,
        meme_wins: 0,
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating player:', createError);
      return NextResponse.json({ error: 'Failed to create player' }, { status: 500 });
    }

    return NextResponse.json({
      player: newPlayer,
      isNew: true,
      message: 'Welcome to Idiot Games!',
    });
  } catch (error) {
    console.error('Error in player register API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
