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
import { Alert } from 'react-native';
import HistoryScreen from '../history';
import {
  useSessionHistory,
  type SessionRecord,
} from '@/hooks/use-session-history';

type AlertButton = { text: string; style?: string; onPress?: () => void };

function autoConfirm() {
  return vi.spyOn(Alert, 'alert').mockImplementation((_t: unknown, _m: unknown, buttons?: AlertButton[]) => {
    const destructive = buttons?.find((b) => b.style === 'destructive');
    destructive?.onPress?.();
  });
}

function autoCancel() {
  return vi.spyOn(Alert, 'alert').mockImplementation(() => {
    // do nothing — simulate user tapping Cancel
  });
}

const sample: SessionRecord = {
  id: 'session-1',
  startedAt: '2026-05-10T00:00:00.000Z',
  endedAt: '2026-05-10T00:30:00.000Z',
  durationMs: 30 * 60 * 1000,
  totals: {
    strikes: 12,
    balls: 8,
    hits: 3,
    walks: 1,
    outs: 4,
    pitches: 23,
    strikePercentage: 52,
    ballPercentage: 35,
  },
};

describe('HistoryScreen', () => {
  beforeEach(async () => {
    memoryStore.clear();
    vi.clearAllMocks();
    await useSessionHistory.getState().clearAll();
  });

  it('shows the empty state when there are no sessions', () => {
    render(<HistoryScreen />);
    expect(screen.getByText(/No sessions yet/i)).toBeTruthy();
    expect(screen.getByText(/Tap Reset in Game Mode/i)).toBeTruthy();
  });

  it('lists a session card with totals', async () => {
    await act(async () => {
      await useSessionHistory.getState().addSession({
        startedAt: sample.startedAt,
        endedAt: sample.endedAt,
        durationMs: sample.durationMs,
        totals: sample.totals,
      });
    });

    render(<HistoryScreen />);

    expect(screen.getByText('Pitches')).toBeTruthy();
    expect(screen.getByText('Strikes')).toBeTruthy();
    expect(screen.getByText('Balls')).toBeTruthy();
    expect(screen.getByText('Hits')).toBeTruthy();
    expect(screen.getByText('Walks')).toBeTruthy();
    expect(screen.getByText('Outs')).toBeTruthy();
    expect(screen.getByText('23')).toBeTruthy(); // pitches
    expect(screen.getByText('12')).toBeTruthy(); // strikes
    expect(screen.getByText('52%')).toBeTruthy(); // strike %
    expect(screen.getByText('35%')).toBeTruthy(); // ball %
  });

  it('shows correct singular vs plural session count', async () => {
    await act(async () => {
      await useSessionHistory.getState().addSession({
        startedAt: sample.startedAt,
        endedAt: sample.endedAt,
        durationMs: 0,
        totals: sample.totals,
      });
    });
    render(<HistoryScreen />);
    expect(screen.getByText('1 session')).toBeTruthy();
  });

  it('deletes a session via the per-card delete button after confirm', async () => {
    const spy = autoConfirm();
    await act(async () => {
      await useSessionHistory.getState().addSession({
        startedAt: sample.startedAt,
        endedAt: sample.endedAt,
        durationMs: 0,
        totals: sample.totals,
      });
    });

    render(<HistoryScreen />);
    expect(useSessionHistory.getState().sessions).toHaveLength(1);

    await act(async () => {
      fireEvent.press(screen.getByLabelText('Delete this session'));
    });

    expect(useSessionHistory.getState().sessions).toHaveLength(0);
    spy.mockRestore();
  });

  it('clears all sessions via the Clear all action', async () => {
    const spy = autoConfirm();
    await act(async () => {
      await useSessionHistory.getState().addSession({
        startedAt: sample.startedAt,
        endedAt: sample.endedAt,
        durationMs: 0,
        totals: sample.totals,
      });
      await useSessionHistory.getState().addSession({
        startedAt: sample.startedAt,
        endedAt: sample.endedAt,
        durationMs: 0,
        totals: sample.totals,
      });
    });

    render(<HistoryScreen />);
    expect(useSessionHistory.getState().sessions).toHaveLength(2);

    await act(async () => {
      fireEvent.press(screen.getByLabelText('Clear all sessions'));
    });

    expect(useSessionHistory.getState().sessions).toHaveLength(0);
    spy.mockRestore();
  });

  it('does not delete when the confirm dialog is cancelled', async () => {
    const spy = autoCancel();
    await act(async () => {
      await useSessionHistory.getState().addSession({
        startedAt: sample.startedAt,
        endedAt: sample.endedAt,
        durationMs: 0,
        totals: sample.totals,
      });
    });

    render(<HistoryScreen />);
    await act(async () => {
      fireEvent.press(screen.getByLabelText('Delete this session'));
    });

    expect(useSessionHistory.getState().sessions).toHaveLength(1);
    spy.mockRestore();
  });
});
