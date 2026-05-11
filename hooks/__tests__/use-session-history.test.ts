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
import { useSessionHistory, type SessionTotals } from '../use-session-history';

const store = useSessionHistory.getState;

const sampleTotals: SessionTotals = {
  strikes: 12,
  balls: 8,
  hits: 3,
  walks: 1,
  outs: 4,
  pitches: 23,
  strikePercentage: 52,
  ballPercentage: 35,
};

describe('SessionHistory', () => {
  beforeEach(async () => {
    memoryStore.clear();
    vi.clearAllMocks();
    await store().clearAll();
  });

  describe('addSession', () => {
    it('prepends a new session with a generated id', async () => {
      const created = await store().addSession({
        startedAt: '2026-05-10T00:00:00Z',
        endedAt: '2026-05-10T00:30:00Z',
        durationMs: 30 * 60 * 1000,
        totals: sampleTotals,
      });
      expect(created.id).toBeTruthy();
      expect(store().sessions).toHaveLength(1);
      expect(store().sessions[0].totals.strikes).toBe(12);
    });

    it('persists added sessions to AsyncStorage', async () => {
      await store().addSession({
        startedAt: '2026-05-10T00:00:00Z',
        endedAt: '2026-05-10T00:30:00Z',
        durationMs: 30 * 60 * 1000,
        totals: sampleTotals,
      });
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@sessions',
        expect.stringContaining('"strikes":12')
      );
    });

    it('newest sessions appear first', async () => {
      const first = await store().addSession({
        startedAt: '2026-05-10T00:00:00Z',
        endedAt: '2026-05-10T00:30:00Z',
        durationMs: 0,
        totals: sampleTotals,
      });
      const second = await store().addSession({
        startedAt: '2026-05-10T01:00:00Z',
        endedAt: '2026-05-10T01:30:00Z',
        durationMs: 0,
        totals: sampleTotals,
      });
      expect(store().sessions.map((s) => s.id)).toEqual([second.id, first.id]);
    });
  });

  describe('removeSession', () => {
    it('removes a session by id', async () => {
      const a = await store().addSession({
        startedAt: 't',
        endedAt: 't',
        durationMs: 0,
        totals: sampleTotals,
      });
      await store().addSession({
        startedAt: 't',
        endedAt: 't',
        durationMs: 0,
        totals: sampleTotals,
      });
      await store().removeSession(a.id);
      expect(store().sessions).toHaveLength(1);
      expect(store().sessions[0].id).not.toBe(a.id);
    });

    it('persists removal', async () => {
      const a = await store().addSession({
        startedAt: 't',
        endedAt: 't',
        durationMs: 0,
        totals: sampleTotals,
      });
      vi.mocked(AsyncStorage.setItem).mockClear();
      await store().removeSession(a.id);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@sessions', '[]');
    });
  });

  describe('clearAll', () => {
    it('empties and persists', async () => {
      await store().addSession({
        startedAt: 't',
        endedAt: 't',
        durationMs: 0,
        totals: sampleTotals,
      });
      await store().clearAll();
      expect(store().sessions).toEqual([]);
      expect(AsyncStorage.setItem).toHaveBeenLastCalledWith('@sessions', '[]');
    });
  });

  describe('loadSessions', () => {
    it('hydrates from storage', async () => {
      memoryStore.set(
        '@sessions',
        JSON.stringify([
          {
            id: 'a',
            startedAt: 'x',
            endedAt: 'y',
            durationMs: 1000,
            totals: sampleTotals,
          },
        ])
      );
      await store().loadSessions();
      expect(store().sessions).toHaveLength(1);
      expect(store().sessions[0].id).toBe('a');
    });

    it('leaves state empty when storage has nothing', async () => {
      await store().loadSessions();
      expect(store().sessions).toEqual([]);
    });

    it('logs and recovers from malformed JSON', async () => {
      const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      memoryStore.set('@sessions', 'not-json{');
      await expect(store().loadSessions()).resolves.toBeUndefined();
      expect(errSpy).toHaveBeenCalled();
      errSpy.mockRestore();
    });
  });
});
