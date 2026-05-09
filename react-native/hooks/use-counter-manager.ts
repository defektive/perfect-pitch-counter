import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ArbitraryCounter {
  id: string;
  name: string;
  count: number;
  totalIncrements: number;
  lastUsed?: Date;
  hasBeenUsed: boolean;
}

interface CounterManagerState {
  counters: ArbitraryCounter[];
  addCounter: (name: string) => Promise<void>;
  incrementCounter: (id: string) => void;
  decrementCounter: (id: string) => void;
  resetCounter: (id: string) => void;
  removeCounter: (id: string) => Promise<void>;
  resetAll: () => Promise<void>;
  loadCounters: () => Promise<void>;
  totalCount: number;
}

const STORAGE_KEY = '@counters';

export const useCounterManager = create<CounterManagerState>((set, get) => ({
  counters: [],
  totalCount: 0,

  async loadCounters() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ArbitraryCounter[];
        set({
          counters: parsed.map((c) => ({
            ...c,
            lastUsed: c.lastUsed
              ? new Date(c.lastUsed)
              : undefined,
          })),
        });
      }
    } catch (error) {
      console.error('Failed to load counters:', error);
    }
  },

  async addCounter(name: string) {
    if (!name) throw new Error('Counter name cannot be empty');
    if (name.length > 50) throw new Error('Counter name cannot exceed 50 characters');
    if (get().counters.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      throw new Error(`Counter with name "${name}" already exists`);
    }

    const id = `${Date.now()}_${++_nextId}`;
    const counter: ArbitraryCounter = {
      id,
      name,
      count: 0,
      totalIncrements: 0,
      lastUsed: undefined,
      hasBeenUsed: false,
    };

    set((state) => ({
      counters: [...state.counters, counter],
    }));

    await _saveCounters();
  },

  incrementCounter(id: string) {
    set((state) => {
      const counter = state.counters.find((c) => c.id === id);
      if (!counter) return state;

      const updatedCounter = {
        ...counter,
        count: counter.count + 1,
        totalIncrements: counter.totalIncrements + 1,
        lastUsed: new Date(),
        hasBeenUsed: true,
      };

      return {
        counters: state.counters.map((c) => (c.id === id ? updatedCounter : c)),
        totalCount: state.totalCount + 1,
      };
    });
  },

  decrementCounter(id: string) {
    set((state) => {
      const counter = state.counters.find((c) => c.id === id);
      if (!counter) return state;

      if (counter.count > 0) {
        const updatedCounter = {
          ...counter,
          count: counter.count - 1,
          lastUsed: new Date(),
        };
        return {
          counters: state.counters.map((c) => (c.id === id ? updatedCounter : c)),
          totalCount: Math.max(0, state.totalCount - 1),
        };
      }
      return state;
    });
  },

  resetCounter(id: string) {
    set((state) => ({
      counters: state.counters.map((c) =>
        c.id === id ? { ...c, count: 0, hasBeenUsed: false } : c
      ),
      totalCount: Math.max(0, state.totalCount - c.count),
    }));
  },

  async removeCounter(id: string) {
    await _saveCounters();
    set((state) => ({
      counters: state.counters.filter((c) => c.id !== id),
      totalCount: state.totalCount - (state.counters.find((c) => c.id === id)?.count || 0),
    }));
  },

  async resetAll() {
    await _saveCounters();
    set({ counters: [], totalCount: 0 });
  },

  get totalCount() {
    return this.counters.reduce((sum, c) => sum + c.count, 0);
  },
}));

let _nextId = 1;

async function _saveCounters() {
  const counters = useCounterManager.getState().counters;
  const json = JSON.stringify(counters);
  try {
    await AsyncStorage.setItem(STORAGE_KEY, json);
  } catch (error) {
    console.error('Failed to save counters:', error);
  }
}
