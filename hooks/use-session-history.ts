import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SessionTotals {
  strikes: number;
  balls: number;
  hits: number;
  walks: number;
  outs: number;
  pitches: number;
  strikePercentage: number;
  ballPercentage: number;
}

export interface SessionRecord {
  id: string;
  startedAt: string;
  endedAt: string;
  durationMs: number;
  totals: SessionTotals;
}

interface SessionHistoryState {
  sessions: SessionRecord[];
  addSession: (input: Omit<SessionRecord, 'id'>) => Promise<SessionRecord>;
  removeSession: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  loadSessions: () => Promise<void>;
}

const STORAGE_KEY = '@sessions';

let _nextId = 1;

async function _saveSessions() {
  const sessions = useSessionHistory.getState().sessions;
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to save sessions:', error);
  }
}

export const useSessionHistory = create<SessionHistoryState>((set) => ({
  sessions: [],

  async loadSessions() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SessionRecord[];
        set({ sessions: parsed });
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  },

  async addSession(input) {
    const session: SessionRecord = {
      ...input,
      id: `${Date.now()}_${++_nextId}`,
    };
    set((state) => ({ sessions: [session, ...state.sessions] }));
    await _saveSessions();
    return session;
  },

  async removeSession(id) {
    set((state) => ({ sessions: state.sessions.filter((s) => s.id !== id) }));
    await _saveSessions();
  },

  async clearAll() {
    set({ sessions: [] });
    await _saveSessions();
  },
}));
