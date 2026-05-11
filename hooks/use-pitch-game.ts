import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PitchGameState {
  // Counts
  outCount: number;
  walkCount: number;
  hitCount: number;
  totalBalls: number;
  totalStrikes: number;
  totalPitches: number;
  // Current count (resets with each batter)
  currentBalls: number;
  currentStrikes: number;
  // Stats
  strikePercentage: number;
  ballPercentage: number;
  // Timer
  isTimerRunning: boolean;
  gameStarted?: string;
  lastTime?: string;
  // Actions
  loadGame: () => Promise<void>;
  resetGame: () => Promise<void>;
  incrementStrike: () => void;
  incrementBall: () => void;
  incrementHit: () => void;
  incrementWalk: () => void;
  incrementOut: () => void;
  resetCounters: () => void;
  toggleTimer: () => void;
  exportToJson: () => string;
  exportToCsv: () => string;
}

const GAME_STORAGE_KEY = '@pitch-game';

function calcPercentages(totalStrikes: number, totalBalls: number, hitCount: number) {
  const totalPitches = totalStrikes + totalBalls + hitCount;
  return {
    strikePercentage: totalPitches > 0 ? Math.round((totalStrikes / totalPitches) * 100) : 0,
    ballPercentage: totalPitches > 0 ? Math.round((totalBalls / totalPitches) * 100) : 0,
  };
}

export const usePitchGame = create<PitchGameState>((set, get) => ({
  outCount: 0,
  walkCount: 0,
  hitCount: 0,
  totalBalls: 0,
  totalStrikes: 0,
  totalPitches: 0,
  currentBalls: 0,
  currentStrikes: 0,
  strikePercentage: 0,
  ballPercentage: 0,
  isTimerRunning: false,

  async loadGame() {
    try {
      const stored = await AsyncStorage.getItem(GAME_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        set({
          outCount: parsed.outCount ?? 0,
          walkCount: parsed.walkCount ?? 0,
          hitCount: parsed.hitCount ?? 0,
          totalBalls: parsed.totalBalls ?? 0,
          totalStrikes: parsed.totalStrikes ?? 0,
          totalPitches: parsed.totalPitches ?? 0,
          currentBalls: parsed.currentBalls ?? 0,
          currentStrikes: parsed.currentStrikes ?? 0,
          strikePercentage: parsed.strikePercentage ?? 0,
          ballPercentage: parsed.ballPercentage ?? 0,
          isTimerRunning: parsed.isTimerRunning ?? false,
          gameStarted: parsed.gameStarted ?? undefined,
          lastTime: parsed.lastTime ?? undefined,
        });
      }
    } catch (error) {
      console.error('Failed to load game:', error);
    }
  },

  async resetGame() {
    const resetState = {
      outCount: 0,
      walkCount: 0,
      hitCount: 0,
      totalBalls: 0,
      totalStrikes: 0,
      totalPitches: 0,
      currentBalls: 0,
      currentStrikes: 0,
      strikePercentage: 0,
      ballPercentage: 0,
      isTimerRunning: false,
      gameStarted: undefined,
      lastTime: undefined,
    };
    set(resetState);
    await _saveGameState(resetState);
  },

  incrementStrike() {
    const state = get();
    const newCurrentStrikes = state.currentStrikes + 1;
    const newTotalStrikes = state.totalStrikes + 1;
    const newTotalPitches = state.totalPitches + 1;

    let newCurrentBalls = state.currentBalls;
    let newCurrentStrikesAfterOut = newCurrentStrikes;
    let newOutCount = state.outCount;

    if (newCurrentStrikes >= 3) {
      newOutCount = state.outCount + 1;
      newCurrentBalls = 0;
      newCurrentStrikesAfterOut = 0;
    }

    const pcts = calcPercentages(newTotalStrikes, state.totalBalls, state.hitCount);

    const update = {
      outCount: newOutCount,
      currentBalls: newCurrentBalls,
      currentStrikes: newCurrentStrikesAfterOut,
      totalStrikes: newTotalStrikes,
      totalPitches: newTotalPitches,
      ...pcts,
    };
    set(update);
    _saveCurrentState();
  },

  incrementBall() {
    const state = get();
    const newCurrentBalls = state.currentBalls + 1;
    const newTotalBalls = state.totalBalls + 1;
    const newTotalPitches = state.totalPitches + 1;

    let newWalkCount = state.walkCount;
    let newCurrentBallsAfterWalk = newCurrentBalls;
    let newCurrentStrikes = state.currentStrikes;

    if (newCurrentBalls >= 4) {
      newWalkCount = state.walkCount + 1;
      newCurrentBallsAfterWalk = 0;
      newCurrentStrikes = 0;
    }

    const pcts = calcPercentages(state.totalStrikes, newTotalBalls, state.hitCount);

    const update = {
      walkCount: newWalkCount,
      currentBalls: newCurrentBallsAfterWalk,
      currentStrikes: newCurrentStrikes,
      totalBalls: newTotalBalls,
      totalPitches: newTotalPitches,
      ...pcts,
    };
    set(update);
    _saveCurrentState();
  },

  incrementHit() {
    const state = get();
    const newHitCount = state.hitCount + 1;
    const newTotalPitches = state.totalPitches + 1;
    const pcts = calcPercentages(state.totalStrikes, state.totalBalls, newHitCount);

    const update = {
      hitCount: newHitCount,
      currentBalls: 0,
      currentStrikes: 0,
      totalPitches: newTotalPitches,
      ...pcts,
    };
    set(update);
    _saveCurrentState();
  },

  incrementWalk() {
    const state = get();
    const newWalkCount = state.walkCount + 1;

    const update = {
      walkCount: newWalkCount,
      currentBalls: 0,
      currentStrikes: 0,
    };
    set(update);
    _saveCurrentState();
  },

  incrementOut() {
    const state = get();

    const update = {
      outCount: state.outCount + 1,
      currentBalls: 0,
      currentStrikes: 0,
    };
    set(update);
    _saveCurrentState();
  },

  resetCounters() {
    const resetState = {
      outCount: 0,
      walkCount: 0,
      hitCount: 0,
      totalBalls: 0,
      totalStrikes: 0,
      totalPitches: 0,
      currentBalls: 0,
      currentStrikes: 0,
      strikePercentage: 0,
      ballPercentage: 0,
      isTimerRunning: false,
      gameStarted: undefined,
      lastTime: undefined,
    };
    set(resetState);
    _saveGameState(resetState);
  },

  toggleTimer() {
    const state = get();

    if (state.isTimerRunning) {
      set({ isTimerRunning: false, lastTime: new Date().toISOString() });
    } else {
      set({ isTimerRunning: true, gameStarted: new Date().toISOString() });
    }
    _saveCurrentState();
  },

  exportToJson() {
    const state = get();
    return JSON.stringify({
      timestamp: state.gameStarted ?? new Date().toISOString(),
      ballCount: state.totalBalls,
      strikeCount: state.totalStrikes,
      hitCount: state.hitCount,
      walkCount: state.walkCount,
      outCount: state.outCount,
      pitchCount: state.totalPitches,
      strikePercentage: state.strikePercentage,
      ballPercentage: state.ballPercentage,
    });
  },

  exportToCsv() {
    const state = get();
    const timestamp = state.gameStarted ?? new Date().toISOString();
    return `Timestamp,Ball Count,Strike Count,Hit Count,Walk Count,Out Count,Pitch Count,Strike %,Ball %\n${timestamp},${state.totalBalls},${state.totalStrikes},${state.hitCount},${state.walkCount},${state.outCount},${state.totalPitches},${state.strikePercentage},${state.ballPercentage}`;
  },
}));

function _saveCurrentState() {
  const state = usePitchGame.getState();
  _saveGameState(state);
}

async function _saveGameState(state: Partial<PitchGameState>) {
  const storedState = {
    outCount: state.outCount,
    walkCount: state.walkCount,
    hitCount: state.hitCount,
    totalBalls: state.totalBalls,
    totalStrikes: state.totalStrikes,
    totalPitches: state.totalPitches,
    currentBalls: state.currentBalls,
    currentStrikes: state.currentStrikes,
    strikePercentage: state.strikePercentage,
    ballPercentage: state.ballPercentage,
    isTimerRunning: state.isTimerRunning,
    gameStarted: state.gameStarted,
    lastTime: state.lastTime,
  };
  try {
    await AsyncStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(storedState));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}
