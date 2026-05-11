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
import { Share } from 'react-native';
import CounterModeScreen from '../counter-mode';
import { usePitchGame } from '@/hooks/use-pitch-game';

describe('CounterModeScreen', () => {
  beforeEach(async () => {
    memoryStore.clear();
    vi.clearAllMocks();
    await usePitchGame.getState().resetGame();
  });

  describe('rendering', () => {
    it('renders the Strikes, Balls, and Outs rows', () => {
      render(<CounterModeScreen />);
      expect(screen.getByText('Strikes')).toBeTruthy();
      expect(screen.getByText('Balls')).toBeTruthy();
      expect(screen.getByText('Outs')).toBeTruthy();
    });

    it('reflects the current totals', async () => {
      await act(async () => {
        usePitchGame.getState().incrementStrike();
        usePitchGame.getState().incrementStrike();
        usePitchGame.getState().incrementBall();
      });
      render(<CounterModeScreen />);
      // Strike total = 2, Ball total = 1; the chip values come from totalStrikes/totalBalls.
      const strikeBtn = screen.getByLabelText(/Add strike/);
      const ballBtn = screen.getByLabelText(/Add ball/);
      expect(strikeBtn.props.accessibilityLabel).toBe('Add strike, currently 2');
      expect(ballBtn.props.accessibilityLabel).toBe('Add ball, currently 1');
    });
  });

  describe('counter taps', () => {
    it('adds a strike when the Strikes chip is tapped', async () => {
      render(<CounterModeScreen />);
      await act(async () => {
        fireEvent.press(screen.getByLabelText('Add strike, currently 0'));
      });
      expect(usePitchGame.getState().totalStrikes).toBe(1);
    });

    it('adds a ball when the Balls chip is tapped', async () => {
      render(<CounterModeScreen />);
      await act(async () => {
        fireEvent.press(screen.getByLabelText('Add ball, currently 0'));
      });
      expect(usePitchGame.getState().totalBalls).toBe(1);
    });
  });

  describe('export modal', () => {
    it('opens when the export FAB is tapped', async () => {
      render(<CounterModeScreen />);
      const modalsBefore = screen.root.findAllByType('Modal' as never);
      expect(modalsBefore[0].props.visible).toBe(false);

      await act(async () => {
        fireEvent.press(screen.getByLabelText('Export game data'));
      });

      const modalsAfter = screen.root.findAllByType('Modal' as never);
      expect(modalsAfter[0].props.visible).toBe(true);
    });

    it('shares as JSON when the JSON option is tapped', async () => {
      const spy = vi.spyOn(Share, 'share').mockResolvedValue({ action: 'sharedAction' } as never);
      await act(async () => {
        usePitchGame.getState().incrementStrike();
        usePitchGame.getState().incrementBall();
      });
      render(<CounterModeScreen />);

      await act(async () => {
        fireEvent.press(screen.getByLabelText('Export game data'));
      });
      await act(async () => {
        fireEvent.press(screen.getByLabelText('Share game data as JSON'));
      });

      expect(spy).toHaveBeenCalledTimes(1);
      const [{ message, title }] = spy.mock.calls[0] as [{ message: string; title: string }];
      expect(title).toMatch(/JSON/);
      const parsed = JSON.parse(message);
      expect(parsed.strikeCount).toBe(1);
      expect(parsed.ballCount).toBe(1);
      spy.mockRestore();
    });

    it('shares as CSV when the CSV option is tapped', async () => {
      const spy = vi.spyOn(Share, 'share').mockResolvedValue({ action: 'sharedAction' } as never);
      await act(async () => {
        usePitchGame.getState().incrementStrike();
      });
      render(<CounterModeScreen />);

      await act(async () => {
        fireEvent.press(screen.getByLabelText('Export game data'));
      });
      await act(async () => {
        fireEvent.press(screen.getByLabelText('Share game data as CSV'));
      });

      expect(spy).toHaveBeenCalledTimes(1);
      const [{ message, title }] = spy.mock.calls[0] as [{ message: string; title: string }];
      expect(title).toMatch(/CSV/);
      const [header] = message.split('\n');
      expect(header).toContain('Strike Count');
      spy.mockRestore();
    });

    it('shares both formats when the Share Both button is tapped', async () => {
      const spy = vi.spyOn(Share, 'share').mockResolvedValue({ action: 'sharedAction' } as never);
      render(<CounterModeScreen />);

      await act(async () => {
        fireEvent.press(screen.getByLabelText('Export game data'));
      });
      await act(async () => {
        fireEvent.press(screen.getByLabelText('Share game data in both formats'));
      });

      expect(spy).toHaveBeenCalledTimes(1);
      const [{ message }] = spy.mock.calls[0] as [{ message: string }];
      expect(message).toContain('--- JSON ---');
      expect(message).toContain('--- CSV ---');
      spy.mockRestore();
    });
  });
});
