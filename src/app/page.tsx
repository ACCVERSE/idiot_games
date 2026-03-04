'use client';

import { useState, useEffect, useCallback } from 'react';

// ============ TYPES ============
interface Battle {
  id: string;
  left: { name: string; emoji: string; votes: number };
  right: { name: string; emoji: string; votes: number };
}

interface Winner {
  id: number;
  name: string;
  game: string;
  timestamp: Date;
}

interface GameState {
  ballPosition: number; // 0-100
  memeFound: boolean;
  memePosition: number;
  revealedCells: boolean[];
  currentBattle: Battle;
  winners: Winner[];
  nextReset: Date;
  totalVotes: { left: number; right: number };
}

// ============ INITIAL DATA ============
const BATTLES: Battle[] = [
  { id: '1', left: { name: 'iOS', emoji: '🍎', votes: 0 }, right: { name: 'Android', emoji: '🤖', votes: 0 } },
  { id: '2', left: { name: 'McDonalds', emoji: '🍔', votes: 0 }, right: { name: 'Burger King', emoji: '👑', votes: 0 } },
  { id: '3', left: { name: 'Cats', emoji: '🐱', votes: 0 }, right: { name: 'Dogs', emoji: '🐕', votes: 0 } },
  { id: '4', left: { name: 'Coffee', emoji: '☕', votes: 0 }, right: { name: 'Tea', emoji: '🍵', votes: 0 } },
  { id: '5', left: { name: 'PlayStation', emoji: '🎮', votes: 0 }, right: { name: 'Xbox', emoji: '🕹️', votes: 0 } },
  { id: '6', left: { name: 'Pineapple on Pizza', emoji: '🍍', votes: 0 }, right: { name: 'No Pineapple', emoji: '🍕', votes: 0 } },
  { id: '7', left: { name: 'Summer', emoji: '☀️', votes: 0 }, right: { name: 'Winter', emoji: '❄️', votes: 0 } },
  { id: '8', left: { name: 'Twitter', emoji: '🐦', votes: 0 }, right: { name: 'Threads', emoji: '🧵', votes: 0 } },
];

const MEMES = ['🤡', '👽', '🦄', '🐸', '🤖', '👹', '🤠', '😈'];

const GRID_SIZE = 64; // 8x8 grid

// ============ LOCAL STORAGE HELPERS ============
const HOURS_48 = 48 * 60 * 60 * 1000;

function getInitialState(): GameState {
  const now = new Date();
  const nextReset = new Date(now.getTime() + HOURS_48);
  const randomBattle = BATTLES[Math.floor(Math.random() * BATTLES.length)];
  
  return {
    ballPosition: 0,
    memeFound: false,
    memePosition: Math.floor(Math.random() * GRID_SIZE),
    revealedCells: Array(GRID_SIZE).fill(false),
    currentBattle: { 
      ...randomBattle, 
      left: { ...randomBattle.left, votes: Math.floor(Math.random() * 100) }, 
      right: { ...randomBattle.right, votes: Math.floor(Math.random() * 100) } 
    },
    winners: [],
    nextReset,
    totalVotes: { left: 0, right: 0 },
  };
}

function loadState(): GameState {
  if (typeof window === 'undefined') {
    return getInitialState();
  }
  
  const saved = localStorage.getItem('idiot-games-state');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Check if reset is needed
      if (new Date(parsed.nextReset) < new Date()) {
        return getInitialState();
      }
      return {
        ...parsed,
        nextReset: new Date(parsed.nextReset),
        winners: parsed.winners.map((w: Winner) => ({ ...w, timestamp: new Date(w.timestamp) })),
      };
    } catch {
      return getInitialState();
    }
  }
  return getInitialState();
}

function saveState(state: GameState) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('idiot-games-state', JSON.stringify(state));
  }
}

// ============ AD MODAL COMPONENT ============
function AdModal({ onComplete, action }: { onComplete: () => void; action: string }) {
  const [progress, setProgress] = useState(0);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          setCanClose(true);
          return 100;
        }
        return p + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
        <div className="text-4xl mb-4">📺</div>
        <h3 className="text-xl font-bold mb-2">Ad Break!</h3>
        <p className="text-muted-foreground mb-4">
          Watch this ad to {action}
        </p>
        
        {/* Fake ad content */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 mb-4 text-white">
          <div className="text-2xl mb-2">🎮</div>
          <div className="font-bold">Want to remove ads?</div>
          <div className="text-sm opacity-80">Get Premium for $2.99/mo</div>
        </div>
        
        {/* Progress bar */}
        <div className="bg-secondary rounded-full h-3 overflow-hidden mb-4">
          <div 
            className="bg-gradient-to-r from-pink-500 to-purple-500 h-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <button
          onClick={onComplete}
          disabled={!canClose}
          className={`w-full py-3 rounded-full font-bold transition-all ${
            canClose 
              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg' 
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          {canClose ? '✓ Continue' : `Wait ${Math.ceil((100 - progress) / 2)}s`}
        </button>
      </div>
    </div>
  );
}

// ============ TEAM VOTE COMPONENT ============
function TeamVote({ 
  battle, 
  totalVotes,
  onVote 
}: { 
  battle: Battle; 
  totalVotes: { left: number; right: number };
  onVote: (side: 'left' | 'right') => void;
}) {
  const leftPercent = totalVotes.left + totalVotes.right > 0 
    ? Math.round((totalVotes.left / (totalVotes.left + totalVotes.right)) * 100) 
    : 50;
  const rightPercent = 100 - leftPercent;

  return (
    <div className="bg-card rounded-3xl p-6 shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-1">🗳️ Team Vote</h2>
        <p className="text-muted-foreground text-sm">Pick your side!</p>
      </div>

      {/* Vote bars */}
      <div className="flex items-center gap-4 mb-6">
        {/* Left team */}
        <button
          onClick={() => onVote('left')}
          className="flex-1 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-2xl p-4 hover:scale-105 transition-transform"
        >
          <div className="text-4xl mb-2">{battle.left.emoji}</div>
          <div className="font-bold">{battle.left.name}</div>
          <div className="text-2xl font-bold mt-1">{leftPercent}%</div>
        </button>

        <div className="text-2xl font-bold text-muted-foreground">VS</div>

        {/* Right team */}
        <button
          onClick={() => onVote('right')}
          className="flex-1 bg-gradient-to-br from-pink-500 to-orange-500 text-white rounded-2xl p-4 hover:scale-105 transition-transform"
        >
          <div className="text-4xl mb-2">{battle.right.emoji}</div>
          <div className="font-bold">{battle.right.name}</div>
          <div className="text-2xl font-bold mt-1">{rightPercent}%</div>
        </button>
      </div>

      {/* Progress bar */}
      <div className="bg-secondary rounded-full h-4 overflow-hidden">
        <div className="flex h-full">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${leftPercent}%` }}
          />
          <div 
            className="bg-gradient-to-r from-pink-500 to-orange-500 transition-all duration-500"
            style={{ width: `${rightPercent}%` }}
          />
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-4">
        {totalVotes.left + totalVotes.right} total votes
      </p>
    </div>
  );
}

// ============ MOON BALL COMPONENT ============
function MoonBall({ 
  position, 
  onMove,
  onReset 
}: { 
  position: number; 
  onMove: (direction: 'up' | 'down') => void;
  onReset: () => void;
}) {
  const moonReached = position >= 100;

  return (
    <div className="bg-card rounded-3xl p-6 shadow-lg">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold mb-1">🌙 Moon Ball</h2>
        <p className="text-muted-foreground text-sm">Send the ball to the moon!</p>
      </div>

      {/* Game area */}
      <div className="relative h-80 bg-gradient-to-b from-purple-200 via-blue-100 to-green-200 rounded-2xl overflow-hidden mb-4">
        {/* Moon */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-6xl">
          🌕
        </div>
        
        {/* Ball */}
        <div 
          className="absolute left-1/2 text-5xl transition-all duration-500 ease-out"
          style={{ 
            top: moonReached ? '60px' : `${80 - (position * 0.7)}%`,
            transform: `translateX(-50%) ${moonReached ? 'scale(1.2)' : ''}`
          }}
        >
          {moonReached ? '🎉' : '🏀'}
        </div>

        {/* Earth */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-5xl">
          🌍
        </div>

        {/* Progress indicator */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 rounded-full px-2 py-1 text-white text-sm font-bold">
          {position}%
        </div>
      </div>

      {/* Controls */}
      {moonReached ? (
        <div className="text-center">
          <p className="text-xl font-bold text-green-500 mb-4 animate-bounce">🎉 Moon Reached! 🎉</p>
          <button
            onClick={onReset}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-bold hover:shadow-lg transition-all"
          >
            🔄 Reset Game
          </button>
        </div>
      ) : (
        <div className="flex gap-4">
          <button
            onClick={() => onMove('up')}
            className="flex-1 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl font-bold text-lg hover:shadow-lg hover:scale-105 transition-all"
          >
            🚀 Up!
          </button>
          <button
            onClick={() => onMove('down')}
            className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold text-lg hover:shadow-lg hover:scale-105 transition-all"
          >
            🪂 Down!
          </button>
        </div>
      )}
    </div>
  );
}

// ============ FIND MEME COMPONENT ============
function FindMeme({ 
  memePosition,
  revealedCells,
  memeFound,
  onReveal,
  onReset,
}: { 
  memePosition: number;
  revealedCells: boolean[];
  memeFound: boolean;
  onReveal: (index: number) => void;
  onReset: () => void;
}) {
  const meme = MEMES[memePosition % MEMES.length];
  const revealedCount = revealedCells.filter(Boolean).length;

  if (memeFound) {
    return (
      <div className="bg-card rounded-3xl p-6 shadow-lg text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2">Found the Meme!</h2>
        <p className="text-muted-foreground mb-4">
          The meme was: <span className="text-4xl">{meme}</span>
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Found in {revealedCount} attempts!
        </p>
        <button
          onClick={onReset}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-bold hover:shadow-lg transition-all"
        >
          🔄 New Game
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-3xl p-6 shadow-lg">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold mb-1">🔍 Find the Meme</h2>
        <p className="text-muted-foreground text-sm">
          One cell hides a secret meme. Find it to win!
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {revealedCount} / {GRID_SIZE} cells revealed
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-8 gap-1 mb-4">
        {Array(GRID_SIZE).fill(null).map((_, index) => (
          <button
            key={index}
            onClick={() => !revealedCells[index] && onReveal(index)}
            disabled={revealedCells[index]}
            className={`aspect-square rounded-lg text-lg sm:text-xl transition-all ${
              revealedCells[index]
                ? index === memePosition
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                  : 'bg-secondary'
                : 'bg-gradient-to-br from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 hover:scale-105 cursor-pointer'
            }`}
          >
            {revealedCells[index] ? (
              index === memePosition ? meme : '❌'
            ) : '?'}
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Click a cell to reveal • Watch a short ad to continue
      </p>
    </div>
  );
}

// ============ HALL OF FAME COMPONENT ============
function HallOfFame({ winners }: { winners: Winner[] }) {
  if (winners.length === 0) {
    return (
      <div className="bg-card rounded-3xl p-6 shadow-lg text-center">
        <div className="text-4xl mb-2">🏆</div>
        <h3 className="text-lg font-bold mb-1">Hall of Fame</h3>
        <p className="text-muted-foreground text-sm">No winners yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-3xl p-6 shadow-lg">
      <div className="text-center mb-4">
        <div className="text-4xl mb-2">🏆</div>
        <h3 className="text-lg font-bold">Hall of Fame</h3>
      </div>
      
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {winners.slice(-10).reverse().map((winner, index) => (
          <div 
            key={winner.id}
            className={`flex items-center gap-3 p-2 rounded-xl ${
              index === 0 ? 'bg-gradient-to-r from-yellow-100 to-orange-100' : 'bg-secondary'
            }`}
          >
            <span className="text-xl">
              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'}
            </span>
            <span className="font-medium flex-1">{winner.name}</span>
            <span className="text-xs text-muted-foreground">{winner.game}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ TIMER COMPONENT ============
function ResetTimer({ nextReset }: { nextReset: Date }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = nextReset.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft('Resetting...');
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [nextReset]);

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">Next reset:</span>
      <span className="font-mono font-bold text-pink-500">{timeLeft}</span>
    </div>
  );
}

// ============ NAME INPUT MODAL ============
function NameInputModal({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [name, setName] = useState('');

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
        <div className="text-5xl mb-4">🏆</div>
        <h3 className="text-2xl font-bold mb-2">You Won!</h3>
        <p className="text-muted-foreground mb-6">Enter your name for the Hall of Fame</p>
        
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name..."
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4"
          maxLength={20}
          autoFocus
        />
        
        <button
          onClick={() => onSubmit(name || 'Anonymous')}
          disabled={!name.trim()}
          className={`w-full py-3 rounded-full font-bold transition-all ${
            name.trim()
              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

// ============ MAIN PAGE ============
export default function IdiotGames() {
  const [activeGame, setActiveGame] = useState<'vote' | 'moon' | 'meme'>('vote');
  const [state, setState] = useState<GameState>(() => {
    // Use lazy initialization to load from localStorage
    if (typeof window !== 'undefined') {
      return loadState();
    }
    return getInitialState();
  });
  const [showAd, setShowAd] = useState<{ action: string; callback: () => void } | null>(null);
  const [showNameInput, setShowNameInput] = useState(false);
  const [adWatched, setAdWatched] = useState(false);

  // Save state on change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveState(state);
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [state]);

  // Handle voting
  const handleVote = useCallback((side: 'left' | 'right') => {
    if (adWatched) {
      setState(prev => ({
        ...prev,
        totalVotes: {
          ...prev.totalVotes,
          [side]: prev.totalVotes[side] + 1
        }
      }));
      setAdWatched(false);
    } else {
      setShowAd({
        action: `vote for Team ${side === 'left' ? state.currentBattle.left.name : state.currentBattle.right.name}`,
        callback: () => {
          setAdWatched(true);
          setTimeout(() => {
            setState(prev => ({
              ...prev,
              totalVotes: {
                ...prev.totalVotes,
                [side]: prev.totalVotes[side] + 1
              }
            }));
            setAdWatched(false);
          }, 100);
        }
      });
    }
  }, [adWatched, state.currentBattle]);

  // Handle ball movement
  const handleMove = useCallback((direction: 'up' | 'down') => {
    if (adWatched) {
      setState(prev => {
        const newPos = direction === 'up' 
          ? Math.min(100, prev.ballPosition + Math.floor(Math.random() * 10) + 5)
          : Math.max(0, prev.ballPosition - Math.floor(Math.random() * 10) - 5);
        
        return { ...prev, ballPosition: newPos };
      });
      setAdWatched(false);
    } else {
      setShowAd({
        action: `move the ball ${direction}`,
        callback: () => {
          setAdWatched(true);
          setTimeout(() => {
            setState(prev => {
              const newPos = direction === 'up' 
                ? Math.min(100, prev.ballPosition + Math.floor(Math.random() * 10) + 5)
                : Math.max(0, prev.ballPosition - Math.floor(Math.random() * 10) - 5);
              
              return { ...prev, ballPosition: newPos };
            });
            setAdWatched(false);
          }, 100);
        }
      });
    }
  }, [adWatched]);

  // Handle cell reveal
  const handleReveal = useCallback((index: number) => {
    if (adWatched) {
      setState(prev => {
        const newRevealed = [...prev.revealedCells];
        newRevealed[index] = true;
        
        const found = index === prev.memePosition;
        
        if (found) {
          setShowNameInput(true);
          return { ...prev, revealedCells: newRevealed, memeFound: true };
        }
        
        return { ...prev, revealedCells: newRevealed };
      });
      setAdWatched(false);
    } else {
      setShowAd({
        action: 'reveal this cell',
        callback: () => {
          setAdWatched(true);
          setTimeout(() => {
            setState(prev => {
              const newRevealed = [...prev.revealedCells];
              newRevealed[index] = true;
              
              const found = index === prev.memePosition;
              
              if (found) {
                setShowNameInput(true);
                return { ...prev, revealedCells: newRevealed, memeFound: true };
              }
              
              return { ...prev, revealedCells: newRevealed };
            });
            setAdWatched(false);
          }, 100);
        }
      });
    }
  }, [adWatched]);

  // Handle winner name submission
  const handleWinnerSubmit = useCallback((name: string) => {
    setState(prev => ({
      ...prev,
      winners: [...prev.winners, {
        id: Date.now(),
        name,
        game: 'Find the Meme',
        timestamp: new Date()
      }]
    }));
    setShowNameInput(false);
  }, []);

  // Handle game reset
  const handleResetMeme = useCallback(() => {
    setState(prev => ({
      ...prev,
      memeFound: false,
      memePosition: Math.floor(Math.random() * GRID_SIZE),
      revealedCells: Array(GRID_SIZE).fill(false),
    }));
  }, []);

  const handleResetMoon = useCallback(() => {
    setState(prev => ({
      ...prev,
      ballPosition: 0,
    }));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Ad Modal */}
      {showAd && (
        <AdModal 
          onComplete={() => {
            showAd.callback();
            setShowAd(null);
          }}
          action={showAd.action}
        />
      )}

      {/* Name Input Modal */}
      {showNameInput && (
        <NameInputModal onSubmit={handleWinnerSubmit} />
      )}

      {/* Header */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎮</span>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">Idiot Games</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">The dumbest games on Earth</p>
              </div>
            </div>
            <ResetTimer nextReset={state.nextReset} />
          </div>

          {/* Game Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveGame('vote')}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                activeGame === 'vote'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              🗳️ Team Vote
            </button>
            <button
              onClick={() => setActiveGame('moon')}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                activeGame === 'moon'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              🌙 Moon Ball
            </button>
            <button
              onClick={() => setActiveGame('meme')}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                activeGame === 'meme'
                  ? 'bg-gradient-to-r from-green-500 to-yellow-500 text-white shadow-lg'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              🔍 Find Meme
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Game Area */}
          <div className="lg:col-span-2">
            {activeGame === 'vote' && (
              <TeamVote 
                battle={state.currentBattle}
                totalVotes={state.totalVotes}
                onVote={handleVote}
              />
            )}
            {activeGame === 'moon' && (
              <MoonBall 
                position={state.ballPosition}
                onMove={handleMove}
                onReset={handleResetMoon}
              />
            )}
            {activeGame === 'meme' && (
              <FindMeme 
                memePosition={state.memePosition}
                revealedCells={state.revealedCells}
                memeFound={state.memeFound}
                onReveal={handleReveal}
                onReset={handleResetMeme}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <HallOfFame winners={state.winners} />
            
            {/* Premium Promo */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-6 text-center">
              <div className="text-3xl mb-2">✨</div>
              <h3 className="font-bold mb-1">Remove Ads</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Get Premium for unlimited ad-free gameplay
              </p>
              <div className="text-2xl font-bold text-pink-500 mb-3">$2.99/mo</div>
              <button className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-medium hover:shadow-lg transition-all">
                Upgrade
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            🎮 Idiot Games © 2025 • The dumbest games on Earth
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Simple. Addictive. Viral.
          </p>
        </div>
      </footer>
    </div>
  );
}
