import { describe, it, expect, beforeEach } from 'vitest';
import { useCounterManager } from '../use-counter-manager';

const store = useCounterManager.getState();

describe('CounterManager Model', () => {
  beforeEach(async () => {
    await store.resetAll();
  });

  describe('addCounter', () => {
    it('should throw error for empty name', async () => {
      await expect(store.addCounter('')).rejects.toThrow('Counter name cannot be empty');
    });

    it('should throw error for name exceeding 50 characters', async () => {
      const longName = 'a'.repeat(51);
      await expect(store.addCounter(longName)).rejects.toThrow('Counter name cannot exceed 50 characters');
    });

    it('should throw error for duplicate counter names (case-insensitive)', async () => {
      await store.addCounter('Test');
      await expect(store.addCounter('TEST')).rejects.toThrow('Counter with name "TEST" already exists');
    });
  });
});
