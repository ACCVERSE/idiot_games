'use client';

import { useState, useEffect, useCallback } from 'react';

// ============ TYPES ============
interface Player {
  id: string;
  username: string;
  energy: number;
  max_energy: number;
  total_wins: number;
  moon_wins: number;
  earth_wins: number;
  meme_wins: number;
}

interface GameRound {
  id: string;
  round_number: number;
  start_time: string;
  status: string;
}

interface MoonBallState {
  ball_position: number;
  moon_reached: boolean;
  earth_reached: boolean;
  total_pushes_moon: number;
  total_pushes_earth: number;
}

interface MemeGameState {
  meme_position: number;
  meme_emoji: string;
  meme_found: boolean;
  total_reveals: number;
}

interface TeamVoteState {
  battle_id: string;
  left_name: string;
  left_emoji: string;
  right_name: string;
  right_emoji: string;
  left_votes: number;
  right_votes: number;
}

interface RevealedCell {
  cell_index: number;
  is_meme: boolean;
}

interface HallOfFameEntry {
  id: string;
  player_name: string;
  win_type: 'moon' | 'earth' | 'meme';
  attempts?: number;
  created_at: string;
}

interface GameState {
  activeRound: GameRound | null;
  moonBallState: MoonBallState | null;
  memeGameState: MemeGameState | null;
  teamVoteState: TeamVoteState | null;
  revealedCells: RevealedCell[];
  hallOfFame: HallOfFameEntry[];
}

// ============ CONSTANTS ============
const GRID_SIZE = 100;
const HOURS_48 = 48 * 60 * 60 * 1000;
const STORAGE_KEY = 'idiot-games-player';

// ============ LOGIN MODAL ============
function LoginModal({ onLogin, loading }: { onLogin: (name: string) => void; loading: boolean }) {
  const [name, setName] = useState('');
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
        <div className="text-6xl mb-4">🎮</div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Idiot Games</h1>
        <p className="text-gray-500 mb-6">Enter your name to play!</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name..."
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-center text-lg font-medium focus:outline-none focus:border-pink-500 mb-4"
          maxLength={20}
          autoFocus
          disabled={loading}
        />
        <button
          onClick={() => name.trim() && onLogin(name.trim())}
          disabled={!name.trim() || loading}
          className={`w-full py-3 rounded-full font-bold text-lg transition-all ${
            name.trim() && !loading
              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg'
              : 'bg-gray-200 text-gray-400'
          }`}
        >
          {loading ? 'Loading...' : 'Play Now! 🚀'}
        </button>
      </div>
    </div>
  );
}

// ============ AD MODAL ============
function AdModal({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setProgress((p) => Math.min(100, p + 2)), 100);
    return () => clearInterval(interval);
  }, []);
  const canClose = progress >= 100;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center">
        <div className="text-4xl mb-3">📺</div>
        <h3 className="text-lg font-bold mb-1">Out of Energy!</h3>
        <p className="text-gray-500 text-sm mb-4">Energy regenerates: 1/hour</p>
        <div className="bg-gray-200 rounded-full h-2 overflow-hidden mb-3">
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <button
          onClick={onComplete}
          disabled={!canClose}
          className={`w-full py-2.5 rounded-full font-bold transition-all ${
            canClose ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-gray-200 text-gray-400'
          }`}
        >
          {canClose ? '✓ Continue' : `${Math.ceil((100 - progress) / 2)}s`}
        </button>
      </div>
    </div>
  );
}

// ============ WINNER MODAL ============
function WinnerModal({
  type,
  attempts,
  onClose,
}: {
  type: 'moon' | 'earth' | 'meme';
  attempts?: number;
  onClose: () => void;
}) {
  const info = {
    moon: { emoji: '🌙', title: 'Moon Reached!', desc: 'You sent the ball to the moon!' },
    earth: { emoji: '🌍', title: 'Earth Reached!', desc: 'You brought the ball back!' },
    meme: { emoji: '🔍', title: 'Meme Found!', desc: `Found in ${attempts} attempts!` },
  };
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
        <div className="text-7xl mb-4">{info[type].emoji}</div>
        <h2 className="text-2xl font-bold mb-2">{info[type].title}</h2>
        <p className="text-gray-500 mb-4">{info[type].desc}</p>
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 mb-4">
          <div className="text-2xl font-bold text-orange-500">+5 ⚡ Energy</div>
        </div>
        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-bold hover:scale-105 transition-all"
        >
          Continue! 🎮
        </button>
      </div>
    </div>
  );
}

// ============ TEAM VOTE ============
function TeamVote({
  voteState,
  hasVoted,
  onVote,
  playerEnergy,
}: {
  voteState: TeamVoteState;
  hasVoted: boolean;
  onVote: (side: 'left' | 'right') => void;
  playerEnergy: number;
}) {
  const total = voteState.left_votes + voteState.right_votes;
  const leftPercent = total > 0 ? Math.round((voteState.left_votes / total) * 100) : 50;
  const canVote = !hasVoted && playerEnergy > 0;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold mb-1">🗳️ Team Vote</h2>
        <p className="text-gray-500 text-sm">
          {hasVoted ? 'Thanks for voting!' : 'Pick your side!'}
        </p>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => canVote && onVote('left')}
          disabled={!canVote}
          className={`flex-1 rounded-2xl p-4 transition-all ${
            hasVoted ? 'opacity-70' : 'hover:scale-105'
          } bg-gradient-to-br from-blue-400 to-purple-500 text-white`}
        >
          <div className="text-3xl mb-1">{voteState.left_emoji}</div>
          <div className="font-bold">{voteState.left_name}</div>
          <div className="text-xl font-bold mt-1">{leftPercent}%</div>
        </button>
        <div className="text-xl font-bold text-gray-300">VS</div>
        <button
          onClick={() => canVote && onVote('right')}
          disabled={!canVote}
          className={`flex-1 rounded-2xl p-4 transition-all ${
            hasVoted ? 'opacity-70' : 'hover:scale-105'
          } bg-gradient-to-br from-pink-400 to-orange-500 text-white`}
        >
          <div className="text-3xl mb-1">{voteState.right_emoji}</div>
          <div className="font-bold">{voteState.right_name}</div>
          <div className="text-xl font-bold mt-1">{100 - leftPercent}%</div>
        </button>
      </div>
      <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
        <div className="flex h-full">
          <div className="bg-gradient-to-r from-blue-400 to-purple-500" style={{ width: `${leftPercent}%` }} />
          <div className="bg-gradient-to-r from-pink-400 to-orange-500" style={{ width: `${100 - leftPercent}%` }} />
        </div>
      </div>
      <p className="text-center text-xs text-gray-400 mt-3">{total} total votes</p>
    </div>
  );
}

// ============ MOON BALL ============
function MoonBall({
  state,
  onMove,
  playerEnergy,
}: {
  state: MoonBallState;
  onMove: (d: 'moon' | 'earth') => void;
  playerEnergy: number;
}) {
  const atMoon = state.moon_reached || state.ball_position >= 100;
  const atEarth = state.earth_reached || state.ball_position <= 0;
  const canMove = !atMoon && !atEarth && playerEnergy > 0;

  return (
    <div className="bg-white rounded-3xl p-5 shadow-lg">
      <div className="text-center mb-3">
        <h2 className="text-xl font-bold mb-1">🌙 Moon Ball</h2>
        <p className="text-gray-500 text-sm">Send the ball to the moon or back to Earth!</p>
      </div>
      <div className="relative h-56 bg-gradient-to-b from-indigo-900 via-blue-800 to-green-700 rounded-2xl overflow-hidden mb-3">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-4xl">🌕</div>
        <div
          className={`absolute left-1/2 text-xl transition-all duration-500 ${atMoon || atEarth ? 'animate-bounce' : ''}`}
          style={{
            top: atMoon ? '24px' : atEarth ? '85%' : `${85 - state.ball_position * 0.6}%`,
            transform: 'translateX(-50%)',
          }}
        >
          {atMoon ? '🎉' : atEarth ? '🏠' : '🏀'}
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-3xl">🌍</div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 rounded px-2 py-1 text-white text-xs font-bold">
          {state.ball_position}%
        </div>
      </div>
      {atMoon || atEarth ? (
        <div className="text-center">
          <p className="text-lg font-bold text-green-500 mb-2">
            {atMoon ? '🌙 Moon Reached!' : '🌍 Earth Reached!'}
          </p>
        </div>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={() => onMove('moon')}
            disabled={!canMove}
            className={`flex-1 py-3 rounded-xl font-bold ${
              canMove ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white hover:scale-105' : 'bg-gray-200 text-gray-400'
            }`}
          >
            🚀 Moon
          </button>
          <button
            onClick={() => onMove('earth')}
            disabled={!canMove}
            className={`flex-1 py-3 rounded-xl font-bold ${
              canMove ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white hover:scale-105' : 'bg-gray-200 text-gray-400'
            }`}
          >
            🪂 Earth
          </button>
        </div>
      )}
    </div>
  );
}

// ============ FIND MEME ============
function FindMeme({
  memeState,
  revealedCells,
  onReveal,
  playerEnergy,
}: {
  memeState: MemeGameState;
  revealedCells: RevealedCell[];
  onReveal: (i: number) => void;
  playerEnergy: number;
}) {
  const revealedSet = new Set(revealedCells.map((c) => c.cell_index));

  if (memeState.meme_found) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-lg text-center">
        <div className="text-5xl mb-3">🎉</div>
        <h2 className="text-xl font-bold mb-2">Meme Found!</h2>
        <p className="text-gray-500 mb-2">
          The meme was: <span className="text-3xl">{memeState.meme_emoji}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-4 shadow-lg">
      <div className="text-center mb-2">
        <h2 className="text-lg font-bold mb-1">🔍 Find the Meme</h2>
        <p className="text-gray-500 text-xs">
          Find the hidden meme! {revealedCells.length}/{GRID_SIZE} revealed
        </p>
      </div>
      <div className="grid grid-cols-10 gap-0.5">
        {Array(GRID_SIZE)
          .fill(null)
          .map((_, i) => {
            const isRevealed = revealedSet.has(i);
            const isMeme = revealedCells.find((c) => c.cell_index === i)?.is_meme;
            const canReveal = !isRevealed && playerEnergy > 0;

            return (
              <button
                key={i}
                onClick={() => canReveal && onReveal(i)}
                disabled={isRevealed || playerEnergy === 0}
                className={`aspect-square rounded text-xs transition-all ${
                  isRevealed
                    ? isMeme
                      ? 'bg-gradient-to-br from-yellow-300 to-orange-400'
                      : 'bg-gray-100'
                    : playerEnergy === 0
                      ? 'bg-gray-100 cursor-not-allowed'
                      : 'bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 hover:scale-105 cursor-pointer'
                }`}
              >
                {isRevealed ? (isMeme ? memeState.meme_emoji : '·') : '?'}
              </button>
            );
          })}
      </div>
    </div>
  );
}

// ============ LEADERBOARD ============
function Leaderboard({ hallOfFame }: { hallOfFame: HallOfFameEntry[] }) {
  const [tab, setTab] = useState<'moon' | 'earth' | 'meme'>('moon');
  const filtered = hallOfFame.filter((w) => w.win_type === tab);

  return (
    <div className="bg-white rounded-2xl p-4 shadow">
      <h3 className="font-bold text-center mb-2">🏆 Leaderboards</h3>
      <div className="flex gap-1 mb-2">
        {(['moon', 'earth', 'meme'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium ${
              tab === t ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {t === 'moon' ? '🌙' : t === 'earth' ? '🌍' : '🔍'}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 text-xs py-3">No winners yet!</p>
      ) : (
        <div className="space-y-1 max-h-28 overflow-y-auto">
          {filtered.slice(0, 5).map((w, i) => (
            <div key={w.id} className={`flex items-center gap-2 p-1.5 rounded-lg ${i === 0 ? 'bg-yellow-50' : 'bg-gray-50'}`}>
              <span className="text-sm">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🏅'}</span>
              <span className="font-medium text-sm flex-1">{w.player_name}</span>
              {w.attempts && <span className="text-xs text-gray-400">{w.attempts} tries</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ TIMER ============
function ResetTimer({ startTime }: { startTime: string }) {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () => {
      const start = new Date(startTime).getTime();
      const end = start + HOURS_48;
      const diff = end - Date.now();
      if (diff <= 0) return setTime('Reset!');
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTime(`${h}h ${m}m ${s}s`);
    };
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, [startTime]);
  return <span className="font-mono text-xs text-pink-500">{time}</span>;
}

// ============ MAIN ============
export default function IdiotGames() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [playerVotes, setPlayerVotes] = useState<Set<string>>(new Set());
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [game, setGame] = useState<'vote' | 'moon' | 'meme'>('vote');
  const [showAd, setShowAd] = useState(false);
  const [win, setWin] = useState<{ type: 'moon' | 'earth' | 'meme'; attempts?: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize on mount
  useEffect(() => {
    initGame();
  }, []);

  const initGame = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check for saved player
      const savedPlayerData = localStorage.getItem(STORAGE_KEY + '-data');
      let currentPlayer: Player | null = null;

      if (savedPlayerData) {
        try {
          currentPlayer = JSON.parse(savedPlayerData);
          setPlayer(currentPlayer);
        } catch {
          localStorage.removeItem(STORAGE_KEY + '-data');
        }
      }

      // Fetch game state
      const stateRes = await fetch('/api/game/state');
      if (!stateRes.ok) {
        throw new Error(`Failed to fetch game state: ${stateRes.status}`);
      }
      let stateData = await stateRes.json();

      // If no active round, initialize one
      if (!stateData.activeRound) {
        console.log('No active round, creating one...');
        const resetRes = await fetch('/api/game/reset', { method: 'POST' });
        if (!resetRes.ok) {
          throw new Error(`Failed to initialize game: ${resetRes.status}`);
        }
        const newStateRes = await fetch('/api/game/state');
        stateData = await newStateRes.json();
      }

      setGameState(stateData);

      // Load player votes for this round
      if (currentPlayer && stateData.activeRound) {
        const votesRes = await fetch(`/api/vote/check?playerId=${currentPlayer.id}&roundId=${stateData.activeRound.id}`);
        if (votesRes.ok) {
          const votesData = await votesRes.json();
          if (votesData.votedBattles) {
            setPlayerVotes(new Set(votesData.votedBattles));
          }
        }
      }

    } catch (err) {
      console.error('Init error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load game');
    } finally {
      setLoading(false);
    }
  };

  // Handle login
  const handleLogin = async (name: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/player/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else if (data.player) {
        setPlayer(data.player);
        localStorage.setItem(STORAGE_KEY, data.player.id);
        localStorage.setItem(STORAGE_KEY + '-data', JSON.stringify(data.player));
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to login');
    }
    setLoading(false);
  };

  // Handle vote
  const handleVote = async (side: 'left' | 'right') => {
    if (!player || !gameState?.teamVoteState) return;

    try {
      const res = await fetch('/api/vote/cast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: player.id,
          battleId: gameState.teamVoteState.battle_id,
          side,
        }),
      });
      const data = await res.json();
      if (data.error) {
        if (data.error.toLowerCase().includes('energy')) {
          setShowAd(true);
        }
      } else {
        setPlayer(data.player);
        localStorage.setItem(STORAGE_KEY + '-data', JSON.stringify(data.player));
        setPlayerVotes(new Set([...playerVotes, gameState.teamVoteState.battle_id]));
        setGameState({ ...gameState, teamVoteState: data.teamVoteState });
      }
    } catch (err) {
      console.error('Vote error:', err);
    }
  };

  // Handle moon ball move
  const handleMove = async (direction: 'moon' | 'earth') => {
    if (!player || !gameState?.moonBallState) return;

    try {
      const res = await fetch('/api/moon-ball/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: player.id,
          direction,
        }),
      });
      const data = await res.json();
      if (data.error) {
        if (data.error.toLowerCase().includes('energy')) {
          setShowAd(true);
        }
      } else {
        setPlayer(data.player);
        localStorage.setItem(STORAGE_KEY + '-data', JSON.stringify(data.player));
        setGameState({
          ...gameState,
          moonBallState: data.moonBallState,
          hallOfFame: gameState.hallOfFame,
        });
        if (data.winner) {
          setTimeout(() => setWin({ type: data.winner }), 500);
          // Refresh hall of fame
          const stateRes = await fetch('/api/game/state');
          const stateData = await stateRes.json();
          setGameState(stateData);
        }
      }
    } catch (err) {
      console.error('Move error:', err);
    }
  };

  // Handle meme reveal
  const handleReveal = async (cellIndex: number) => {
    if (!player || !gameState?.memeGameState) return;

    try {
      const res = await fetch('/api/meme/reveal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: player.id,
          cellIndex,
        }),
      });
      const data = await res.json();
      if (data.error) {
        if (data.error.toLowerCase().includes('energy')) {
          setShowAd(true);
        }
      } else {
        setPlayer(data.player);
        localStorage.setItem(STORAGE_KEY + '-data', JSON.stringify(data.player));
        setGameState({
          ...gameState,
          memeGameState: data.memeGameState,
          revealedCells: data.revealedCells,
        });
        if (data.winner) {
          setTimeout(() => setWin({ type: 'meme', attempts: data.attempts }), 500);
          // Refresh hall of fame
          const stateRes = await fetch('/api/game/state');
          const stateData = await stateRes.json();
          setGameState(stateData);
        }
      }
    } catch (err) {
      console.error('Reveal error:', err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-bounce mb-4">🎮</div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-bold mb-2">Oops!</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => initGame()}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-bold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Login state
  if (!player) {
    return <LoginModal onLogin={handleLogin} loading={loading} />;
  }

  // Game loading state
  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-bounce mb-4">🎮</div>
          <p className="text-gray-500">Loading game...</p>
        </div>
      </div>
    );
  }

  const hasVotedCurrent = gameState.teamVoteState ? playerVotes.has(gameState.teamVoteState.battle_id) : false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {showAd && <AdModal onComplete={() => setShowAd(false)} />}
      {win && <WinnerModal type={win.type} attempts={win.attempts} onClose={() => setWin(null)} />}
      <header className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎮</span>
              <h1 className="text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Idiot Games</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-100 to-orange-100 px-3 py-1 rounded-full">
                <span className="text-sm">⚡</span>
                <span className="font-bold text-orange-500">{player.energy}</span>
              </div>
              {gameState.activeRound && <ResetTimer startTime={gameState.activeRound.start_time} />}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-500">👤 {player.username}</span>
            <div className="flex gap-1">
              {(['vote', 'moon', 'meme'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGame(g)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    game === g ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {g === 'vote' ? '🗳️' : g === 'moon' ? '🌙' : '🔍'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            {game === 'vote' && gameState.teamVoteState && (
              <TeamVote
                voteState={gameState.teamVoteState}
                hasVoted={hasVotedCurrent}
                onVote={handleVote}
                playerEnergy={player.energy}
              />
            )}
            {game === 'moon' && gameState.moonBallState && (
              <MoonBall state={gameState.moonBallState} onMove={handleMove} playerEnergy={player.energy} />
            )}
            {game === 'meme' && gameState.memeGameState && (
              <FindMeme
                memeState={gameState.memeGameState}
                revealedCells={gameState.revealedCells}
                onReveal={handleReveal}
                playerEnergy={player.energy}
              />
            )}
          </div>
          <div className="space-y-4">
            <Leaderboard hallOfFame={gameState.hallOfFame} />
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-4 text-center">
              <div className="text-xl mb-1">⚡</div>
              <div className="font-bold text-sm">Energy System</div>
              <p className="text-xs text-gray-500 mt-1">Win = +5 energy!</p>
              <p className="text-xs text-gray-400 mt-2">{player.energy} plays left</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow">
              <div className="text-center">
                <div className="text-lg font-bold mb-1">🏆 Your Stats</div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-xl">🌙</div>
                    <div className="font-bold text-lg">{player.moon_wins}</div>
                  </div>
                  <div>
                    <div className="text-xl">🌍</div>
                    <div className="font-bold text-lg">{player.earth_wins}</div>
                  </div>
                  <div>
                    <div className="text-xl">🔍</div>
                    <div className="font-bold text-lg">{player.meme_wins}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="text-center py-4 text-xs text-gray-400">🎮 Idiot Games © 2025</footer>
    </div>
  );
}
