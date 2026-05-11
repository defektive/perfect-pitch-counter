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

import { render, fireEvent, screen, act } from '@testing-library/react-native';
import PitchGameScreen from '../index';
import { usePitchGame } from '@/hooks/use-pitch-game';
import { useSessionHistory } from '@/hooks/use-session-history';

describe('PitchGameScreen', () => {
  beforeEach(async () => {
    memoryStore.clear();
    vi.clearAllMocks();
    await usePitchGame.getState().resetGame();
    await useSessionHistory.getState().clearAll();
  });

  describe('rendering', () => {
    it('renders all stat rows', () => {
      render(<PitchGameScreen />);
      expect(screen.getByText('Practice time')).toBeTruthy();
      expect(screen.getByText('Hits')).toBeTruthy();
      expect(screen.getByText('Batters')).toBeTruthy();
      expect(screen.getByText('Outs')).toBeTruthy();
      expect(screen.getByText('Walks')).toBeTruthy();
      expect(screen.getByText('Runs')).toBeTruthy();
      expect(screen.getByText('Reset')).toBeTruthy();
    });

    it('starts the timer toggle in the play state', () => {
      render(<PitchGameScreen />);
      expect(screen.getByLabelText('Start practice timer')).toBeTruthy();
    });

    it('flips to stop state once the timer is running', async () => {
      render(<PitchGameScreen />);
      await act(async () => {
        fireEvent.press(screen.getByLabelText('Start practice timer'));
      });
      expect(screen.getByLabelText('Stop practice timer')).toBeTruthy();
    });
  });

  describe('counter actions', () => {
    it('adds a hit when the Hits chip is tapped', async () => {
      render(<PitchGameScreen />);
      await act(async () => {
        fireEvent.press(screen.getByLabelText('Add hit, currently 0'));
      });
      expect(usePitchGame.getState().hitCount).toBe(1);
    });

    it('adds a strike when the Strikes chip is tapped', async () => {
      render(<PitchGameScreen />);
      await act(async () => {
        fireEvent.press(screen.getByLabelText('Add strike, currently 0'));
      });
      expect(usePitchGame.getState().totalStrikes).toBe(1);
      expect(usePitchGame.getState().currentStrikes).toBe(1);
    });

    it('adds a ball when the Balls chip is tapped', async () => {
      render(<PitchGameScreen />);
      await act(async () => {
        fireEvent.press(screen.getByLabelText('Add ball, currently 0'));
      });
      expect(usePitchGame.getState().totalBalls).toBe(1);
    });
  });

  describe('reset', () => {
    it('archives a session and clears state when there was activity', async () => {
      await act(async () => {
        usePitchGame.getState().incrementStrike();
        usePitchGame.getState().incrementBall();
        usePitchGame.getState().incrementHit();
      });
      render(<PitchGameScreen />);

      await act(async () => {
        fireEvent.press(screen.getByLabelText('Reset all stats and save to history'));
      });

      expect(usePitchGame.getState().totalStrikes).toBe(0);
      expect(usePitchGame.getState().totalBalls).toBe(0);
      expect(usePitchGame.getState().hitCount).toBe(0);
      const sessions = useSessionHistory.getState().sessions;
      expect(sessions).toHaveLength(1);
      expect(sessions[0].totals.strikes).toBe(1);
      expect(sessions[0].totals.balls).toBe(1);
      expect(sessions[0].totals.hits).toBe(1);
    });

    it('does not archive an empty game on reset', async () => {
      render(<PitchGameScreen />);
      await act(async () => {
        fireEvent.press(screen.getByLabelText('Reset all stats and save to history'));
      });
      expect(useSessionHistory.getState().sessions).toHaveLength(0);
    });
  });
});
