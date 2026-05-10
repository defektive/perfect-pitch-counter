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
import { useCounterManager } from '../use-counter-manager';

const store = useCounterManager.getState;

describe('CounterManager Model', () => {
  beforeEach(async () => {
    memoryStore.clear();
    vi.clearAllMocks();
    await store().resetAll();
  });

  describe('addCounter', () => {
    it('throws on empty name', async () => {
      await expect(store().addCounter('')).rejects.toThrow('Counter name cannot be empty');
    });

    it('throws when name exceeds 50 characters', async () => {
      const longName = 'a'.repeat(51);
      await expect(store().addCounter(longName)).rejects.toThrow(
        'Counter name cannot exceed 50 characters'
      );
    });

    it('throws on duplicate names (case-insensitive)', async () => {
      await store().addCounter('Test');
      await expect(store().addCounter('TEST')).rejects.toThrow(
        'Counter with name "TEST" already exists'
      );
    });

    it('adds a counter with default fields', async () => {
      await store().addCounter('Curveball');
      const counters = store().counters;
      expect(counters).toHaveLength(1);
      expect(counters[0]).toMatchObject({
        name: 'Curveball',
        count: 0,
        totalIncrements: 0,
        hasBeenUsed: false,
        lastUsed: undefined,
      });
      expect(counters[0].id).toBeTruthy();
    });

    it('persists counters to AsyncStorage', async () => {
      await store().addCounter('Slider');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@counters',
        expect.stringContaining('Slider')
      );
    });

    it('supports multiple distinct counters', async () => {
      await store().addCounter('Fastball');
      await store().addCounter('Changeup');
      expect(store().counters.map((c) => c.name)).toEqual(['Fastball', 'Changeup']);
    });

    it('accepts a 50-character name (boundary)', async () => {
      const name = 'a'.repeat(50);
      await store().addCounter(name);
      expect(store().counters[0].name).toBe(name);
    });
  });

  describe('incrementCounter', () => {
    it('increments count, totalIncrements, and marks used', async () => {
      await store().addCounter('A');
      const id = store().counters[0].id;

      store().incrementCounter(id);
      const c = store().counters[0];
      expect(c.count).toBe(1);
      expect(c.totalIncrements).toBe(1);
      expect(c.hasBeenUsed).toBe(true);
      expect(c.lastUsed).toBeTruthy();
    });

    it('is a no-op for an unknown id', async () => {
      await store().addCounter('A');
      const before = JSON.stringify(store().counters);
      store().incrementCounter('does-not-exist');
      expect(JSON.stringify(store().counters)).toBe(before);
    });

    it('accumulates totalIncrements across multiple increments', async () => {
      await store().addCounter('A');
      const id = store().counters[0].id;
      store().incrementCounter(id);
      store().incrementCounter(id);
      store().incrementCounter(id);
      expect(store().counters[0].count).toBe(3);
      expect(store().counters[0].totalIncrements).toBe(3);
    });
  });

  describe('decrementCounter', () => {
    it('decrements when count > 0 without changing totalIncrements', async () => {
      await store().addCounter('A');
      const id = store().counters[0].id;
      store().incrementCounter(id);
      store().incrementCounter(id);
      store().decrementCounter(id);
      const c = store().counters[0];
      expect(c.count).toBe(1);
      expect(c.totalIncrements).toBe(2);
    });

    it('does not go below zero', async () => {
      await store().addCounter('A');
      const id = store().counters[0].id;
      store().decrementCounter(id);
      expect(store().counters[0].count).toBe(0);
    });

    it('is a no-op for an unknown id', async () => {
      await store().addCounter('A');
      const before = JSON.stringify(store().counters);
      store().decrementCounter('does-not-exist');
      expect(JSON.stringify(store().counters)).toBe(before);
    });
  });

  describe('resetCounter', () => {
    it('resets count and hasBeenUsed but preserves totalIncrements', async () => {
      await store().addCounter('A');
      const id = store().counters[0].id;
      store().incrementCounter(id);
      store().incrementCounter(id);
      store().resetCounter(id);
      const c = store().counters[0];
      expect(c.count).toBe(0);
      expect(c.hasBeenUsed).toBe(false);
      expect(c.totalIncrements).toBe(2);
    });
  });

  describe('removeCounter', () => {
    it('removes the counter by id', async () => {
      await store().addCounter('A');
      await store().addCounter('B');
      const idA = store().counters[0].id;
      await store().removeCounter(idA);
      expect(store().counters.map((c) => c.name)).toEqual(['B']);
    });

    it('persists removal', async () => {
      await store().addCounter('A');
      const id = store().counters[0].id;
      vi.mocked(AsyncStorage.setItem).mockClear();
      await store().removeCounter(id);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@counters', '[]');
    });
  });

  describe('resetAll', () => {
    it('empties counters and persists', async () => {
      await store().addCounter('A');
      await store().addCounter('B');
      await store().resetAll();
      expect(store().counters).toEqual([]);
      expect(AsyncStorage.setItem).toHaveBeenLastCalledWith('@counters', '[]');
    });
  });

  describe('loadCounters', () => {
    it('hydrates counters from storage', async () => {
      const sample = [
        { id: '1', name: 'Loaded', count: 5, totalIncrements: 10, hasBeenUsed: true },
      ];
      memoryStore.set('@counters', JSON.stringify(sample));
      await store().loadCounters();
      expect(store().counters).toHaveLength(1);
      expect(store().counters[0].name).toBe('Loaded');
      expect(store().counters[0].count).toBe(5);
    });

    it('leaves state unchanged when storage is empty', async () => {
      await store().loadCounters();
      expect(store().counters).toEqual([]);
    });

    it('logs and recovers from malformed JSON in storage', async () => {
      const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      memoryStore.set('@counters', 'not-json{');
      await expect(store().loadCounters()).resolves.toBeUndefined();
      expect(errSpy).toHaveBeenCalled();
      errSpy.mockRestore();
    });
  });
});
