import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

const MEMES = ['🤡', '👽', '🦄', '🐸', '🤖', '👹', '🤠', '😈', '👺', '🧙'];

const BATTLES = [
  { id: '1', left: { name: 'iOS', emoji: '🍎' }, right: { name: 'Android', emoji: '🤖' } },
  { id: '2', left: { name: 'McDonalds', emoji: '🍔' }, right: { name: 'Burger King', emoji: '👑' } },
  { id: '3', left: { name: 'Cats', emoji: '🐱' }, right: { name: 'Dogs', emoji: '🐕' } },
  { id: '4', left: { name: 'Coffee', emoji: '☕' }, right: { name: 'Tea', emoji: '🍵' } },
  { id: '5', left: { name: 'PlayStation', emoji: '🎮' }, right: { name: 'Xbox', emoji: '🕹️' } },
  { id: '6', left: { name: 'Pineapple on Pizza', emoji: '🍍' }, right: { name: 'No Pineapple', emoji: '🍕' } },
  { id: '7', left: { name: 'Summer', emoji: '☀️' }, right: { name: 'Winter', emoji: '❄️' } },
  { id: '8', left: { name: 'Twitter', emoji: '🐦' }, right: { name: 'Threads', emoji: '🧵' } },
];

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { forceReset = false } = body;

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
      return NextResponse.json({ error: 'Failed to fetch active round' }, { status: 500 });
    }

    // Check if reset is needed
    let needsReset = false;
    let resetReason = '';

    if (!activeRound) {
      needsReset = true;
      resetReason = 'No active round found';
    } else {
      const startTime = new Date(activeRound.start_time);
      const now = new Date();
      const hoursPassed = (now.getTime() - startTime.getTime()) / (1000 * 60 * 60);

      if (hoursPassed >= 48) {
        needsReset = true;
        resetReason = '48 hours passed';
      } else if (forceReset) {
        needsReset = true;
        resetReason = 'Early reset requested';
      }
    }

    if (!needsReset) {
      return NextResponse.json({
        message: 'No reset needed',
        resetPerformed: false,
        activeRound,
      });
    }

    // If there's an active round, mark it as completed
    if (activeRound) {
      const status = forceReset ? 'early_reset' : 'completed';
      await supabase
        .from('game_rounds')
        .update({
          status,
          end_time: new Date().toISOString(),
          reset_early: forceReset,
          reset_reason: resetReason,
        })
        .eq('id', activeRound.id);
    }

    // Get the next round number
    const { data: allRounds } = await supabase
      .from('game_rounds')
      .select('round_number')
      .order('round_number', { ascending: false })
      .limit(1);

    const nextRoundNumber = (allRounds?.[0]?.round_number || 0) + 1;

    // Create new round
    const { data: newRound, error: newRoundError } = await supabase
      .from('game_rounds')
      .insert({
        round_number: nextRoundNumber,
        status: 'active',
        start_time: new Date().toISOString(),
      })
      .select()
      .single();

    if (newRoundError || !newRound) {
      console.error('Error creating new round:', newRoundError);
      return NextResponse.json({ error: 'Failed to create new round' }, { status: 500 });
    }

    // Initialize moon ball state with position 50
    const { error: moonBallError } = await supabase.from('moon_ball_state').insert({
      round_id: newRound.id,
      ball_position: 50,
      total_pushes_moon: 0,
      total_pushes_earth: 0,
      moon_reached: false,
      earth_reached: false,
    });

    if (moonBallError) {
      console.error('Error initializing moon ball state:', moonBallError);
    }

    // Initialize meme game state with random meme position
    const randomMemePosition = Math.floor(Math.random() * 100);
    const randomMemeEmoji = MEMES[Math.floor(Math.random() * MEMES.length)];

    const { error: memeGameError } = await supabase.from('meme_game_state').insert({
      round_id: newRound.id,
      meme_position: randomMemePosition,
      meme_emoji: randomMemeEmoji,
      total_reveals: 0,
      meme_found: false,
    });

    if (memeGameError) {
      console.error('Error initializing meme game state:', memeGameError);
    }

    // Initialize team vote state with random battle
    const randomBattle = BATTLES[Math.floor(Math.random() * BATTLES.length)];

    const { error: teamVoteError } = await supabase.from('team_vote_state').insert({
      round_id: newRound.id,
      battle_id: randomBattle.id,
      left_name: randomBattle.left.name,
      left_emoji: randomBattle.left.emoji,
      right_name: randomBattle.right.name,
      right_emoji: randomBattle.right.emoji,
      left_votes: 0,
      right_votes: 0,
    });

    if (teamVoteError) {
      console.error('Error initializing team vote state:', teamVoteError);
    }

    return NextResponse.json({
      message: 'Game reset successfully',
      resetPerformed: true,
      resetReason,
      newRound,
      initializedGames: {
        moonBall: { position: 50 },
        memeGame: { position: randomMemePosition, emoji: randomMemeEmoji },
        teamVote: { battle: randomBattle },
      },
    });
  } catch (error) {
    console.error('Error in game reset API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
