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
  gameStarted?: Date;
  lastTime?: Date;
  // Persistence
  persistenceKey: string;
  loadGame: () => Promise<void>;
  resetGame: () => Promise<void>;
  // Pitch type counts
  fbCount: number;
  cuCount: number;
  sfCount: number;
  // Actions
  incrementStrike: () => void;
  incrementBall: () => void;
  incrementHit: () => void;
  incrementWalk: () => void;
  incrementOut: () => void;
  resetCounters: () => void;
  toggleTimer: () => void;
  getDuration: () => Date | undefined;
  exportToJson: () => string;
  exportToCsv: () => string;
}

const GAME_STORAGE_KEY = '@pitch-game';

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
  fbCount: 0,
  cuCount: 0,
  sfCount: 0,
  isTimerRunning: false,
  persistenceKey: GAME_STORAGE_KEY,

  async loadGame() {
    try {
      const stored = await AsyncStorage.getItem(GAME_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        set(parsed as PitchGameState);
      }
    } catch (error) {
      console.error('Failed to load game:', error);
    }
  },

  async resetGame() {
    await _saveGameState({
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
    });
  },

  incrementStrike() {
    const state = get();
    const newCurrentStrikes = state.currentStrikes + 1;
    const newTotalStrikes = state.totalStrikes + 1;
    const newTotalPitches = state.totalPitches + 1;

    // 3 strikes = 1 out, reset current count for next batter
    let newCurrentBalls = state.currentBalls;
    let newCurrentStrikesAfterOut = newCurrentStrikes;
    let newOutCount = newCurrentStrikes >= 3 ? state.outCount + 1 : state.outCount;

    if (newCurrentStrikes >= 3) {
      // Batter is out, reset current count for next batter
      newCurrentBalls = 0;
      newCurrentStrikesAfterOut = 0;
    }

    const newStrikePercentage = newTotalPitches > 0 ? Math.round((newTotalStrikes / newTotalPitches) * 100) : 0;

    set({
      outCount: newOutCount,
      currentBalls: newCurrentBalls,
      currentStrikes: newCurrentStrikesAfterOut,
      totalStrikes: newTotalStrikes,
      totalPitches: newTotalPitches,
      strikePercentage: newStrikePercentage,
    });
  },

  incrementBall() {
    const state = get();
    const newCurrentBalls = state.currentBalls + 1;
    const newTotalBalls = state.totalBalls + 1;
    const newTotalPitches = state.totalPitches + 1;

    // 4 balls = 1 walk, reset current count for next batter
    let newWalkCount = state.walkCount;
    let newCurrentBallsAfterWalk = newCurrentBalls;

    if (newCurrentBalls >= 4) {
      // Batter walks, reset current count for next batter
      newWalkCount = state.walkCount + 1;
      newCurrentBallsAfterWalk = 0;
    }

    const newBallPercentage = newTotalPitches > 0 ? Math.round((newTotalBalls / newTotalPitches) * 100) : 0;

    set({
      walkCount: newWalkCount,
      currentBalls: newCurrentBallsAfterWalk,
      totalBalls: newTotalBalls,
      totalPitches: newTotalPitches,
      ballPercentage: newBallPercentage,
    });
  },

  incrementHit() {
    const state = get();

    // On a hit, reset current count for next batter
    set({
      hitCount: state.hitCount + 1,
      currentBalls: 0,
      currentStrikes: 0,
      totalPitches: state.totalPitches + 1,
      totalStrikes: state.totalStrikes,
      totalBalls: state.totalBalls,
    });
  },

  incrementWalk() {
    // Walk is same as ball, but we still count it
    const state = get();
    const newCurrentBalls = state.currentBalls + 1;
    const newTotalBalls = state.totalBalls + 1;
    const newTotalPitches = state.totalPitches + 1;

    const newWalkCount = state.walkCount + 1;

    const newBallPercentage = newTotalPitches > 0 ? Math.round((newTotalBalls / newTotalPitches) * 100) : 0;

    // Check if this walk resulted in a walk
    let newCurrentBallsAfterWalk = newCurrentBalls;
    if (newCurrentBalls >= 4) {
      newCurrentBallsAfterWalk = 0;
    }

    set({
      walkCount: newWalkCount,
      currentBalls: newCurrentBallsAfterWalk,
      totalBalls: newTotalBalls,
      totalPitches: newTotalPitches,
      ballPercentage: newBallPercentage,
    });
  },

  incrementOut() {
    const state = get();

    set({
      outCount: state.outCount + 1,
      currentBalls: 0,
      currentStrikes: 0,
    });
  },

  resetCounters() {
    set({
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
      fbCount: 0,
      cuCount: 0,
      sfCount: 0,
      isTimerRunning: false,
      gameStarted: undefined,
      lastTime: undefined,
    });
  },

  toggleTimer() {
    const state = get();

    if (state.isTimerRunning) {
      set({ isTimerRunning: false });
    } else {
      set({ isTimerRunning: true, gameStarted: new Date() });
    }
  },

  getDuration() {
    const state = get();
    if (state.isTimerRunning && state.gameStarted) {
      return new Date();
    }
    return state.lastTime;
  },

  getFbCount() {
    return get().fbCount;
  },

  getCuCount() {
    return get().cuCount;
  },

  getSfCount() {
    return get().sfCount;
  },

  exportToJson() {
    const state = get();
    return JSON.stringify({
      timestamp: state.gameStarted ? state.gameStarted.toISOString() : new Date().toISOString(),
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
    const timestamp = state.gameStarted
      ? state.gameStarted.toISOString()
      : new Date().toISOString();
    return `Timestamp,Ball Count,Strike Count,Hit Count,Walk Count,Out Count,Pitch Count,Strike %,Ball %\n${timestamp},${state.totalBalls},${state.totalStrikes},${state.hitCount},${state.walkCount},${state.outCount},${state.totalPitches},${state.strikePercentage},${state.ballPercentage}`;
  },
}));

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
    gameStarted: state.gameStarted?.toISOString(),
    lastTime: state.lastTime?.toISOString(),
  };
  try {
    await AsyncStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(storedState));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}
