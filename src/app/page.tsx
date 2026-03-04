'use client';

import { useState, useEffect, useCallback } from 'react';

// ============ TYPES ============
interface User {
  name: string;
  energy: number;
  votedBattles: string[];
  createdAt: Date;
}

interface Winner {
  id: number;
  name: string;
  type: 'moon' | 'earth' | 'meme';
  attempts?: number;
  timestamp: Date;
}

interface GameState {
  ballPosition: number;
  memeFound: boolean;
  memePosition: number;
  revealedCells: boolean[];
  currentBattleId: string;
  nextReset: Date;
  moonWinners: Winner[];
  earthWinners: Winner[];
  memeWinners: Winner[];
  totalVotes: { left: number; right: number };
}

// ============ CONSTANTS ============
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

const MEMES = ['🤡', '👽', '🦄', '🐸', '🤖', '👹', '🤠', '😈', '👺', '🧙'];
const GRID_SIZE = 100;
const USER_KEY = 'idiot-games-user';
const STATE_KEY = 'idiot-games-state';
const HOURS_48 = 48 * 60 * 60 * 1000;

// ============ STORAGE FUNCTIONS ============
function getInitialState(): GameState {
  const now = new Date();
  return {
    ballPosition: 50,
    memeFound: false,
    memePosition: Math.floor(Math.random() * GRID_SIZE),
    revealedCells: Array(GRID_SIZE).fill(false),
    currentBattleId: BATTLES[Math.floor(Math.random() * BATTLES.length)].id,
    nextReset: new Date(now.getTime() + HOURS_48),
    moonWinners: [],
    earthWinners: [],
    memeWinners: [],
    totalVotes: { left: Math.floor(Math.random() * 100) + 50, right: Math.floor(Math.random() * 100) + 50 },
  };
}

function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch {}
  return defaultValue;
}

function saveToStorage<T>(key: string, value: T) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

// ============ LOGIN MODAL ============
function LoginModal({ onLogin }: { onLogin: (name: string) => void }) {
  const [name, setName] = useState('');
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
        <div className="text-6xl mb-4">🎮</div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Idiot Games</h1>
        <p className="text-gray-500 mb-6">Enter your name to play!</p>
        <input
          type="text" value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Your name..."
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-center text-lg font-medium focus:outline-none focus:border-pink-500 mb-4"
          maxLength={15} autoFocus
        />
        <button
          onClick={() => name.trim() && onLogin(name.trim())}
          className={`w-full py-3 rounded-full font-bold text-lg transition-all ${
            name.trim() ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg' : 'bg-gray-200 text-gray-400'
          }`}
        >
          Play Now! 🚀
        </button>
      </div>
    </div>
  );
}

// ============ AD MODAL ============
function AdModal({ onComplete, action }: { onComplete: () => void; action: string }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setProgress(p => Math.min(100, p + 2)), 100);
    return () => clearInterval(interval);
  }, []);
  const canClose = progress >= 100;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center">
        <div className="text-4xl mb-3">📺</div>
        <h3 className="text-lg font-bold mb-1">Ad Break!</h3>
        <p className="text-gray-500 text-sm mb-4">Watch to {action}</p>
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-4 mb-4">
          <div className="text-2xl">⚡</div>
          <div className="font-bold text-sm">Win games = +5 Energy!</div>
        </div>
        <div className="bg-gray-200 rounded-full h-2 overflow-hidden mb-3">
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <button onClick={onComplete} disabled={!canClose}
          className={`w-full py-2.5 rounded-full font-bold transition-all ${canClose ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
          {canClose ? '✓ Continue' : `${Math.ceil((100 - progress) / 2)}s`}
        </button>
      </div>
    </div>
  );
}

// ============ WINNER MODAL ============
function WinnerModal({ type, attempts, onClose }: { type: 'moon' | 'earth' | 'meme'; attempts?: number; onClose: () => void }) {
  const info = { moon: { emoji: '🌙', title: 'Moon Reached!', desc: 'You sent the ball to the moon!' }, earth: { emoji: '🌍', title: 'Earth Reached!', desc: 'You brought the ball back!' }, meme: { emoji: '🔍', title: 'Meme Found!', desc: `Found in ${attempts} attempts!` } };
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
        <div className="text-7xl mb-4">{info[type].emoji}</div>
        <h2 className="text-2xl font-bold mb-2">{info[type].title}</h2>
        <p className="text-gray-500 mb-4">{info[type].desc}</p>
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 mb-4">
          <div className="text-2xl font-bold text-orange-500">+5 ⚡ Energy</div>
        </div>
        <button onClick={onClose} className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-bold hover:scale-105 transition-all">Continue! 🎮</button>
      </div>
    </div>
  );
}

// ============ TEAM VOTE ============
function TeamVote({ battleId, totalVotes, hasVoted, onVote }: { battleId: string; totalVotes: { left: number; right: number }; hasVoted: boolean; onVote: (side: 'left' | 'right') => void }) {
  const battle = BATTLES.find(b => b.id === battleId) || BATTLES[0];
  const total = totalVotes.left + totalVotes.right;
  const leftPercent = total > 0 ? Math.round((totalVotes.left / total) * 100) : 50;
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold mb-1">🗳️ Team Vote</h2>
        <p className="text-gray-500 text-sm">{hasVoted ? "Thanks for voting!" : "Pick your side! (1 vote per battle)"}</p>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => !hasVoted && onVote('left')} disabled={hasVoted}
          className={`flex-1 rounded-2xl p-4 transition-all ${hasVoted ? 'opacity-70' : 'hover:scale-105'} bg-gradient-to-br from-blue-400 to-purple-500 text-white`}>
          <div className="text-3xl mb-1">{battle.left.emoji}</div>
          <div className="font-bold">{battle.left.name}</div>
          <div className="text-xl font-bold mt-1">{leftPercent}%</div>
        </button>
        <div className="text-xl font-bold text-gray-300">VS</div>
        <button onClick={() => !hasVoted && onVote('right')} disabled={hasVoted}
          className={`flex-1 rounded-2xl p-4 transition-all ${hasVoted ? 'opacity-70' : 'hover:scale-105'} bg-gradient-to-br from-pink-400 to-orange-500 text-white`}>
          <div className="text-3xl mb-1">{battle.right.emoji}</div>
          <div className="font-bold">{battle.right.name}</div>
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
function MoonBall({ position, onMove, disabled }: { position: number; onMove: (d: 'up' | 'down') => void; disabled: boolean }) {
  const atMoon = position >= 100;
  const atEarth = position <= 0;
  return (
    <div className="bg-white rounded-3xl p-5 shadow-lg">
      <div className="text-center mb-3">
        <h2 className="text-xl font-bold mb-1">🌙 Moon Ball</h2>
        <p className="text-gray-500 text-sm">Send the ball to the moon or back to Earth!</p>
      </div>
      <div className="relative h-56 bg-gradient-to-b from-indigo-900 via-blue-800 to-green-700 rounded-2xl overflow-hidden mb-3">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-4xl">🌕</div>
        <div className="absolute top-4 left-8 text-xs text-white/40">✨</div>
        <div className="absolute top-10 right-6 text-xs text-white/40">⭐</div>
        <div className={`absolute left-1/2 text-xl transition-all duration-500 ease-out ${atMoon || atEarth ? 'animate-bounce' : ''}`}
          style={{ top: atMoon ? '24px' : atEarth ? '85%' : `${85 - position * 0.6}%`, transform: 'translateX(-50%)' }}>
          {atMoon ? '🎉' : atEarth ? '🏠' : '🏀'}
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-3xl">🌍</div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 rounded px-2 py-1 text-white text-xs font-bold">{position}%</div>
      </div>
      {atMoon || atEarth ? (
        <div className="text-center">
          <p className="text-lg font-bold text-green-500 mb-2">{atMoon ? '🌙 Moon Reached!' : '🌍 Earth Reached!'}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full font-medium">Reset</button>
        </div>
      ) : (
        <div className="flex gap-3">
          <button onClick={() => onMove('up')} disabled={disabled}
            className={`flex-1 py-3 rounded-xl font-bold ${disabled ? 'bg-gray-200 text-gray-400' : 'bg-gradient-to-r from-green-400 to-blue-500 text-white hover:scale-105'}`}>🚀 Moon</button>
          <button onClick={() => onMove('down')} disabled={disabled}
            className={`flex-1 py-3 rounded-xl font-bold ${disabled ? 'bg-gray-200 text-gray-400' : 'bg-gradient-to-r from-orange-400 to-red-500 text-white hover:scale-105'}`}>🪂 Earth</button>
        </div>
      )}
    </div>
  );
}

// ============ FIND MEME ============
function FindMeme({ memePosition, revealedCells, memeFound, onReveal, disabled }: { memePosition: number; revealedCells: boolean[]; memeFound: boolean; onReveal: (i: number) => void; disabled: boolean }) {
  const meme = MEMES[memePosition % MEMES.length];
  const count = revealedCells.filter(Boolean).length;
  if (memeFound) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-lg text-center">
        <div className="text-5xl mb-3">🎉</div>
        <h2 className="text-xl font-bold mb-2">Meme Found!</h2>
        <p className="text-gray-500 mb-2">The meme was: <span className="text-3xl">{meme}</span></p>
        <p className="text-sm text-gray-400">Found in {count} attempts!</p>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-3xl p-4 shadow-lg">
      <div className="text-center mb-2">
        <h2 className="text-lg font-bold mb-1">🔍 Find the Meme</h2>
        <p className="text-gray-500 text-xs">Find the hidden meme! {count}/{GRID_SIZE} revealed</p>
      </div>
      <div className="grid grid-cols-10 gap-0.5">
        {Array(GRID_SIZE).fill(null).map((_, i) => (
          <button key={i} onClick={() => !revealedCells[i] && !disabled && onReveal(i)} disabled={revealedCells[i] || disabled}
            className={`aspect-square rounded text-xs transition-all ${
              revealedCells[i] ? (i === memePosition ? 'bg-gradient-to-br from-yellow-300 to-orange-400' : 'bg-gray-100')
                : disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 hover:scale-105 cursor-pointer'
            }`}>
            {revealedCells[i] ? (i === memePosition ? meme : '·') : '?'}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============ LEADERBOARD ============
function Leaderboard({ moon, earth, meme }: { moon: Winner[]; earth: Winner[]; meme: Winner[] }) {
  const [tab, setTab] = useState<'moon' | 'earth' | 'meme'>('moon');
  const winners = tab === 'moon' ? moon : tab === 'earth' ? earth : meme;
  return (
    <div className="bg-white rounded-2xl p-4 shadow">
      <h3 className="font-bold text-center mb-2">🏆 Leaderboards</h3>
      <div className="flex gap-1 mb-2">
        {(['moon', 'earth', 'meme'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium ${tab === t ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
            {t === 'moon' ? '🌙' : t === 'earth' ? '🌍' : '🔍'}
          </button>
        ))}
      </div>
      {winners.length === 0 ? <p className="text-center text-gray-400 text-xs py-3">No winners yet!</p> : (
        <div className="space-y-1 max-h-28 overflow-y-auto">
          {winners.slice(-5).reverse().map((w, i) => (
            <div key={w.id} className={`flex items-center gap-2 p-1.5 rounded-lg ${i === 0 ? 'bg-yellow-50' : 'bg-gray-50'}`}>
              <span className="text-sm">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🏅'}</span>
              <span className="font-medium text-sm flex-1">{w.name}</span>
              {w.attempts && <span className="text-xs text-gray-400">{w.attempts} tries</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ TIMER ============
function ResetTimer({ nextReset }: { nextReset: Date }) {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () => {
      const diff = nextReset.getTime() - Date.now();
      if (diff <= 0) return setTime('Reset!');
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTime(`${h}h ${m}m ${s}s`);
    };
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, [nextReset]);
  return <span className="font-mono text-xs text-pink-500">{time}</span>;
}

// ============ MAIN ============
export default function IdiotGames() {
  const [user, setUser] = useState<User | null>(() => loadFromStorage(USER_KEY, null as User | null));
  const [state, setState] = useState<GameState>(() => {
    const saved = loadFromStorage(STATE_KEY, null as GameState | null);
    if (saved && new Date(saved.nextReset) > new Date()) return saved;
    return getInitialState();
  });
  const [game, setGame] = useState<'vote' | 'moon' | 'meme'>('vote');
  const [ad, setAd] = useState<{ action: string; cb: () => void } | null>(null);
  const [win, setWin] = useState<{ type: 'moon' | 'earth' | 'meme'; attempts?: number } | null>(null);

  useEffect(() => {
    const t = setTimeout(() => saveToStorage(STATE_KEY, state), 100);
    return () => clearTimeout(t);
  }, [state]);

  useEffect(() => {
    if (user) saveToStorage(USER_KEY, user);
  }, [user]);

  const login = useCallback((name: string) => {
    const u: User = { name, energy: 5, votedBattles: [], createdAt: new Date() };
    setUser(u);
  }, []);

  const spendEnergy = useCallback((action: string, cb: () => void) => {
    if (user && user.energy > 0) {
      setUser(u => u ? { ...u, energy: u.energy - 1 } : null);
      cb();
    } else {
      setAd({ action, cb });
    }
  }, [user]);

  const vote = useCallback((side: 'left' | 'right') => {
    if (!user || user.votedBattles.includes(state.currentBattleId)) return;
    spendEnergy(`vote Team ${side}`, () => {
      setState(s => ({ ...s, totalVotes: { ...s.totalVotes, [side]: s.totalVotes[side] + 1 } }));
      setUser(u => u ? { ...u, votedBattles: [...u.votedBattles, state.currentBattleId] } : null);
    });
  }, [user, state.currentBattleId, spendEnergy]);

  const move = useCallback((dir: 'up' | 'down') => {
    spendEnergy(`move ${dir}`, () => {
      setState(s => {
        const change = Math.floor(Math.random() * 10) + 5;
        const pos = dir === 'up' ? Math.min(100, s.ballPosition + change) : Math.max(0, s.ballPosition - change);
        if (pos >= 100) {
          const w: Winner = { id: Date.now(), name: user?.name || 'Anonymous', type: 'moon', timestamp: new Date() };
          setUser(u => u ? { ...u, energy: u.energy + 5 } : null);
          setTimeout(() => setWin({ type: 'moon' }), 500);
          return { ...s, ballPosition: pos, moonWinners: [...s.moonWinners, w] };
        }
        if (pos <= 0) {
          const w: Winner = { id: Date.now(), name: user?.name || 'Anonymous', type: 'earth', timestamp: new Date() };
          setUser(u => u ? { ...u, energy: u.energy + 5 } : null);
          setTimeout(() => setWin({ type: 'earth' }), 500);
          return { ...s, ballPosition: pos, earthWinners: [...s.earthWinners, w] };
        }
        return { ...s, ballPosition: pos };
      });
    });
  }, [spendEnergy, user]);

  const reveal = useCallback((i: number) => {
    spendEnergy('reveal cell', () => {
      setState(s => {
        const cells = [...s.revealedCells];
        cells[i] = true;
        if (i === s.memePosition) {
          const attempts = cells.filter(Boolean).length;
          const w: Winner = { id: Date.now(), name: user?.name || 'Anonymous', type: 'meme', attempts, timestamp: new Date() };
          setUser(u => u ? { ...u, energy: u.energy + 5 } : null);
          setTimeout(() => setWin({ type: 'meme', attempts }), 500);
          return { ...s, revealedCells: cells, memeFound: true, memeWinners: [...s.memeWinners, w] };
        }
        return { ...s, revealedCells: cells };
      });
    });
  }, [spendEnergy, user]);

  if (!user) return <LoginModal onLogin={login} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {ad && <AdModal onComplete={() => { ad.cb(); setAd(null); }} action={ad.action} />}
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
                <span className="font-bold text-orange-500">{user.energy}</span>
              </div>
              <ResetTimer nextReset={state.nextReset} />
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-500">👤 {user.name}</span>
            <div className="flex gap-1">
              {(['vote', 'moon', 'meme'] as const).map(g => (
                <button key={g} onClick={() => setGame(g)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${game === g ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
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
            {game === 'vote' && <TeamVote battleId={state.currentBattleId} totalVotes={state.totalVotes} hasVoted={user.votedBattles.includes(state.currentBattleId)} onVote={vote} />}
            {game === 'moon' && <MoonBall position={state.ballPosition} onMove={move} disabled={user.energy === 0} />}
            {game === 'meme' && <FindMeme memePosition={state.memePosition} revealedCells={state.revealedCells} memeFound={state.memeFound} onReveal={reveal} disabled={user.energy === 0} />}
          </div>
          <div className="space-y-4">
            <Leaderboard moon={state.moonWinners} earth={state.earthWinners} meme={state.memeWinners} />
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-4 text-center">
              <div className="text-xl mb-1">⚡</div>
              <div className="font-bold text-sm">Energy System</div>
              <p className="text-xs text-gray-500 mt-1">Win = +5 energy!</p>
              <p className="text-xs text-gray-400 mt-2">{user.energy} free plays left</p>
            </div>
          </div>
        </div>
      </main>
      <footer className="text-center py-4 text-xs text-gray-400">🎮 Idiot Games © 2025</footer>
    </div>
  );
}
