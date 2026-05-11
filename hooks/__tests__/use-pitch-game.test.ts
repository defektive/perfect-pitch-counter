import { describe, it, expect, beforeEach, vi } from 'vitest';

const memoryStore = new Map<string, string>();

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(async (key: string) => memoryStore.get(key) ?? null),
    setItem: vi.fn(async (key: string, value: string) => {
      memoryStore.set(key, value);
    }),
    removeItem: vi.fn(async (key: string) => {
      memoryStore.delete(key);
    }),
    clear: vi.fn(async () => {
      memoryStore.clear();
    }),
  },
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePitchGame } from '../use-pitch-game';

const game = usePitchGame.getState;

describe('PitchGame', () => {
  beforeEach(async () => {
    memoryStore.clear();
    vi.clearAllMocks();
    await game().resetGame();
  });

  describe('initial state', () => {
    it('starts with all counters at zero', () => {
      const s = game();
      expect(s.outCount).toBe(0);
      expect(s.walkCount).toBe(0);
      expect(s.hitCount).toBe(0);
      expect(s.totalBalls).toBe(0);
      expect(s.totalStrikes).toBe(0);
      expect(s.totalPitches).toBe(0);
      expect(s.currentBalls).toBe(0);
      expect(s.currentStrikes).toBe(0);
      expect(s.strikePercentage).toBe(0);
      expect(s.ballPercentage).toBe(0);
      expect(s.isTimerRunning).toBe(false);
    });
  });

  describe('incrementStrike', () => {
    it('increments current strikes, total strikes, and total pitches', () => {
      game().incrementStrike();
      const s = game();
      expect(s.currentStrikes).toBe(1);
      expect(s.totalStrikes).toBe(1);
      expect(s.totalPitches).toBe(1);
    });

    it('records an out and resets count after 3 strikes', () => {
      game().incrementStrike();
      game().incrementStrike();
      game().incrementStrike();
      const s = game();
      expect(s.outCount).toBe(1);
      expect(s.currentStrikes).toBe(0);
      expect(s.currentBalls).toBe(0);
      expect(s.totalStrikes).toBe(3);
    });

    it('does not record an out before the third strike', () => {
      game().incrementStrike();
      game().incrementStrike();
      expect(game().outCount).toBe(0);
      expect(game().currentStrikes).toBe(2);
    });

    it('resets balls along with strikes when an out is recorded', () => {
      game().incrementBall();
      game().incrementStrike();
      game().incrementStrike();
      game().incrementStrike();
      const s = game();
      expect(s.currentBalls).toBe(0);
      expect(s.currentStrikes).toBe(0);
      expect(s.outCount).toBe(1);
    });
  });

  describe('incrementBall', () => {
    it('increments current balls, total balls, and total pitches', () => {
      game().incrementBall();
      const s = game();
      expect(s.currentBalls).toBe(1);
      expect(s.totalBalls).toBe(1);
      expect(s.totalPitches).toBe(1);
    });

    it('records a walk and resets count after 4 balls', () => {
      game().incrementBall();
      game().incrementBall();
      game().incrementBall();
      game().incrementBall();
      const s = game();
      expect(s.walkCount).toBe(1);
      expect(s.currentBalls).toBe(0);
      expect(s.currentStrikes).toBe(0);
      expect(s.totalBalls).toBe(4);
    });

    it('does not record a walk before the fourth ball', () => {
      game().incrementBall();
      game().incrementBall();
      game().incrementBall();
      expect(game().walkCount).toBe(0);
      expect(game().currentBalls).toBe(3);
    });
  });

  describe('incrementHit', () => {
    it('increments hit count and resets balls/strikes', () => {
      game().incrementBall();
      game().incrementStrike();
      game().incrementHit();
      const s = game();
      expect(s.hitCount).toBe(1);
      expect(s.currentBalls).toBe(0);
      expect(s.currentStrikes).toBe(0);
      expect(s.totalPitches).toBe(3);
    });
  });

  describe('incrementWalk / incrementOut', () => {
    it('incrementWalk bumps walk count and clears current count', () => {
      game().incrementBall();
      game().incrementStrike();
      game().incrementWalk();
      const s = game();
      expect(s.walkCount).toBe(1);
      expect(s.currentBalls).toBe(0);
      expect(s.currentStrikes).toBe(0);
    });

    it('incrementOut bumps out count and clears current count', () => {
      game().incrementBall();
      game().incrementStrike();
      game().incrementOut();
      const s = game();
      expect(s.outCount).toBe(1);
      expect(s.currentBalls).toBe(0);
      expect(s.currentStrikes).toBe(0);
    });
  });

  describe('percentages', () => {
    it('reports 0% when no pitches have been thrown', () => {
      expect(game().strikePercentage).toBe(0);
      expect(game().ballPercentage).toBe(0);
    });

    it('computes strike and ball percentages over total pitches', () => {
      game().incrementStrike();
      game().incrementStrike();
      game().incrementBall();
      game().incrementBall();
      const s = game();
      expect(s.strikePercentage).toBe(50);
      expect(s.ballPercentage).toBe(50);
    });

    it('factors hits into the denominator', () => {
      game().incrementStrike();
      game().incrementBall();
      game().incrementHit();
      const s = game();
      // 1 strike, 1 ball, 1 hit → 33% each
      expect(s.strikePercentage).toBe(33);
      expect(s.ballPercentage).toBe(33);
    });
  });

  describe('toggleTimer', () => {
    it('starts the timer and records a start time', () => {
      game().toggleTimer();
      const s = game();
      expect(s.isTimerRunning).toBe(true);
      expect(s.gameStarted).toBeTruthy();
    });

    it('stops the timer and records a last time', () => {
      game().toggleTimer();
      game().toggleTimer();
      const s = game();
      expect(s.isTimerRunning).toBe(false);
      expect(s.lastTime).toBeTruthy();
    });
  });

  describe('resetCounters / resetGame', () => {
    it('resetCounters clears counts and timer state', () => {
      game().incrementStrike();
      game().incrementBall();
      game().toggleTimer();
      game().resetCounters();
      const s = game();
      expect(s.totalStrikes).toBe(0);
      expect(s.totalBalls).toBe(0);
      expect(s.totalPitches).toBe(0);
      expect(s.isTimerRunning).toBe(false);
      expect(s.gameStarted).toBeUndefined();
    });

    it('resetGame persists the empty state', async () => {
      game().incrementStrike();
      vi.mocked(AsyncStorage.setItem).mockClear();
      await game().resetGame();
      expect(AsyncStorage.setItem).toHaveBeenCalled();
      const [, payload] = vi.mocked(AsyncStorage.setItem).mock.calls[0];
      expect(JSON.parse(payload)).toMatchObject({
        outCount: 0,
        totalStrikes: 0,
        totalBalls: 0,
        totalPitches: 0,
      });
    });
  });

  describe('loadGame', () => {
    it('hydrates state from storage', async () => {
      memoryStore.set(
        '@pitch-game',
        JSON.stringify({
          outCount: 2,
          walkCount: 1,
          hitCount: 3,
          totalBalls: 8,
          totalStrikes: 12,
          totalPitches: 23,
          currentBalls: 1,
          currentStrikes: 2,
          strikePercentage: 52,
          ballPercentage: 35,
          isTimerRunning: true,
          gameStarted: '2026-01-01T00:00:00Z',
        })
      );
      await game().loadGame();
      const s = game();
      expect(s.outCount).toBe(2);
      expect(s.walkCount).toBe(1);
      expect(s.hitCount).toBe(3);
      expect(s.totalBalls).toBe(8);
      expect(s.totalStrikes).toBe(12);
      expect(s.totalPitches).toBe(23);
      expect(s.isTimerRunning).toBe(true);
      expect(s.gameStarted).toBe('2026-01-01T00:00:00Z');
    });

    it('falls back to defaults for missing fields', async () => {
      memoryStore.set('@pitch-game', JSON.stringify({ totalStrikes: 5 }));
      await game().loadGame();
      const s = game();
      expect(s.totalStrikes).toBe(5);
      expect(s.totalBalls).toBe(0);
      expect(s.outCount).toBe(0);
      expect(s.isTimerRunning).toBe(false);
    });

    it('logs and recovers from malformed JSON', async () => {
      const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      memoryStore.set('@pitch-game', 'broken{');
      await expect(game().loadGame()).resolves.toBeUndefined();
      expect(errSpy).toHaveBeenCalled();
      errSpy.mockRestore();
    });
  });

  describe('exportToJson', () => {
    it('produces JSON with the current totals', () => {
      game().incrementStrike();
      game().incrementBall();
      game().incrementHit();
      const json = JSON.parse(game().exportToJson());
      expect(json).toMatchObject({
        ballCount: 1,
        strikeCount: 1,
        hitCount: 1,
        pitchCount: 3,
      });
      expect(json.timestamp).toBeTruthy();
    });

    it('uses gameStarted as the timestamp when available', () => {
      game().toggleTimer();
      const started = game().gameStarted;
      const json = JSON.parse(game().exportToJson());
      expect(json.timestamp).toBe(started);
    });
  });

  describe('exportToCsv', () => {
    it('produces a header row and a data row', () => {
      game().incrementStrike();
      game().incrementBall();
      const csv = game().exportToCsv();
      const [header, row] = csv.split('\n');
      expect(header).toBe(
        'Timestamp,Ball Count,Strike Count,Hit Count,Walk Count,Out Count,Pitch Count,Strike %,Ball %'
      );
      const cols = row.split(',');
      // timestamp + 8 numeric columns
      expect(cols).toHaveLength(9);
      // Ball Count, Strike Count
      expect(cols[1]).toBe('1');
      expect(cols[2]).toBe('1');
    });
  });
});
