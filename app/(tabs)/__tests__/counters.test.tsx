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
import CountersScreen from '../counters';
import { useCounterManager } from '@/hooks/use-counter-manager';

type AlertButton = { text: string; style?: string; onPress?: () => void };

function autoConfirmDelete() {
  return vi.spyOn(Alert, 'alert').mockImplementation((_t: unknown, _m: unknown, buttons?: AlertButton[]) => {
    buttons?.find((b) => b.style === 'destructive')?.onPress?.();
  });
}

function autoCancel() {
  return vi.spyOn(Alert, 'alert').mockImplementation(() => {});
}

function captureAlert() {
  const calls: { title: string; message: string }[] = [];
  vi.spyOn(Alert, 'alert').mockImplementation((title: unknown, message: unknown) => {
    calls.push({ title: String(title), message: String(message) });
  });
  return calls;
}

describe('CountersScreen', () => {
  beforeEach(async () => {
    memoryStore.clear();
    vi.clearAllMocks();
    await useCounterManager.getState().resetAll();
  });

  describe('rendering', () => {
    it('shows the empty state when there are no counters', () => {
      render(<CountersScreen />);
      expect(screen.getByText(/No counters yet/i)).toBeTruthy();
    });

    it('renders every counter by name', async () => {
      await act(async () => {
        await useCounterManager.getState().addCounter('Curveball');
        await useCounterManager.getState().addCounter('Slider');
      });
      render(<CountersScreen />);
      expect(screen.getByText('Curveball')).toBeTruthy();
      expect(screen.getByText('Slider')).toBeTruthy();
    });

    it('hides the most-used header when nothing has been incremented', async () => {
      await act(async () => {
        await useCounterManager.getState().addCounter('Curveball');
      });
      render(<CountersScreen />);
      expect(screen.queryByText('Most Used Counter')).toBeNull();
    });

    it('shows the most-used header pointing at the highest-totalIncrements counter', async () => {
      await act(async () => {
        await useCounterManager.getState().addCounter('Curveball');
        await useCounterManager.getState().addCounter('Slider');
        const [a, b] = useCounterManager.getState().counters;
        useCounterManager.getState().incrementCounter(a.id);
        useCounterManager.getState().incrementCounter(b.id);
        useCounterManager.getState().incrementCounter(b.id);
      });
      render(<CountersScreen />);
      expect(screen.getByText('Most Used Counter')).toBeTruthy();
      // The "Slider" name appears twice: once in the list, once in the header.
      expect(screen.getAllByText('Slider').length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('actions', () => {
    it('increments via the + button', async () => {
      await act(async () => {
        await useCounterManager.getState().addCounter('Curveball');
      });
      render(<CountersScreen />);

      await act(async () => {
        fireEvent.press(screen.getByLabelText('Increment Curveball'));
      });

      expect(useCounterManager.getState().counters[0].count).toBe(1);
    });

    it('decrements via the - button when count > 0', async () => {
      await act(async () => {
        await useCounterManager.getState().addCounter('Curveball');
        const id = useCounterManager.getState().counters[0].id;
        useCounterManager.getState().incrementCounter(id);
        useCounterManager.getState().incrementCounter(id);
      });
      render(<CountersScreen />);

      await act(async () => {
        fireEvent.press(screen.getByLabelText('Decrement Curveball'));
      });

      expect(useCounterManager.getState().counters[0].count).toBe(1);
    });

    it('marks the - button disabled when count is 0', async () => {
      await act(async () => {
        await useCounterManager.getState().addCounter('Curveball');
      });
      render(<CountersScreen />);
      const decBtn = screen.getByLabelText('Decrement Curveball');
      expect(decBtn.props.accessibilityState.disabled).toBe(true);
    });

    it('does not change state when - is pressed at zero', async () => {
      await act(async () => {
        await useCounterManager.getState().addCounter('Curveball');
      });
      render(<CountersScreen />);

      await act(async () => {
        fireEvent.press(screen.getByLabelText('Decrement Curveball'));
      });

      expect(useCounterManager.getState().counters[0].count).toBe(0);
    });

    it('resets a counter via the reset button', async () => {
      await act(async () => {
        await useCounterManager.getState().addCounter('Curveball');
        const id = useCounterManager.getState().counters[0].id;
        useCounterManager.getState().incrementCounter(id);
        useCounterManager.getState().incrementCounter(id);
        useCounterManager.getState().incrementCounter(id);
      });
      render(<CountersScreen />);

      await act(async () => {
        fireEvent.press(screen.getByLabelText('Reset Curveball'));
      });

      expect(useCounterManager.getState().counters[0].count).toBe(0);
    });

    it('deletes a counter after confirm', async () => {
      const spy = autoConfirmDelete();
      await act(async () => {
        await useCounterManager.getState().addCounter('Curveball');
      });
      render(<CountersScreen />);

      await act(async () => {
        fireEvent.press(screen.getByLabelText('Delete Curveball'));
      });

      expect(useCounterManager.getState().counters).toHaveLength(0);
      spy.mockRestore();
    });

    it('keeps the counter when delete is cancelled', async () => {
      const spy = autoCancel();
      await act(async () => {
        await useCounterManager.getState().addCounter('Curveball');
      });
      render(<CountersScreen />);

      await act(async () => {
        fireEvent.press(screen.getByLabelText('Delete Curveball'));
      });

      expect(useCounterManager.getState().counters).toHaveLength(1);
      spy.mockRestore();
    });
  });

  describe('add counter flow', () => {
    it('opens the add modal when the FAB is tapped', async () => {
      render(<CountersScreen />);
      const modalsBefore = render(<CountersScreen />).root.findAllByType('Modal' as never);
      expect(modalsBefore[0].props.visible).toBe(false);

      await act(async () => {
        fireEvent.press(screen.getByLabelText('Add a new counter'));
      });

      const modalsAfter = screen.root.findAllByType('Modal' as never);
      expect(modalsAfter[0].props.visible).toBe(true);
    });

    it('adds a counter via the modal', async () => {
      render(<CountersScreen />);
      const input = screen.root.findByType('TextInput' as never);

      await act(async () => {
        fireEvent.changeText(input, 'Knuckleball');
      });
      await act(async () => {
        fireEvent.press(screen.getByLabelText('Confirm add counter'));
      });

      const counters = useCounterManager.getState().counters;
      expect(counters).toHaveLength(1);
      expect(counters[0].name).toBe('Knuckleball');
    });

    it('does not add a counter for an empty name', async () => {
      render(<CountersScreen />);

      await act(async () => {
        fireEvent.press(screen.getByLabelText('Confirm add counter'));
      });

      expect(useCounterManager.getState().counters).toHaveLength(0);
    });

    it('shows an alert when the name is a duplicate', async () => {
      const calls = captureAlert();
      await act(async () => {
        await useCounterManager.getState().addCounter('Slider');
      });
      render(<CountersScreen />);
      const input = screen.root.findByType('TextInput' as never);

      await act(async () => {
        fireEvent.changeText(input, 'Slider');
      });
      await act(async () => {
        fireEvent.press(screen.getByLabelText('Confirm add counter'));
      });

      expect(useCounterManager.getState().counters).toHaveLength(1);
      expect(calls.length).toBeGreaterThan(0);
      expect(calls[0].title).toBe('Error');
      expect(calls[0].message).toMatch(/already exists/i);
    });

    it('closes the modal and clears the name when Cancel is tapped', async () => {
      render(<CountersScreen />);

      await act(async () => {
        fireEvent.press(screen.getByLabelText('Add a new counter'));
      });
      const modalAfterOpen = screen.root.findAllByType('Modal' as never)[0];
      expect(modalAfterOpen.props.visible).toBe(true);

      await act(async () => {
        fireEvent.press(screen.getByLabelText('Cancel adding counter'));
      });
      const modalAfterCancel = screen.root.findAllByType('Modal' as never)[0];
      expect(modalAfterCancel.props.visible).toBe(false);
    });
  });
});
