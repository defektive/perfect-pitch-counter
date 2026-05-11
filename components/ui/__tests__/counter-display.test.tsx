import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react-native';
import { CounterDisplay } from '../counter-display';

describe('CounterDisplay', () => {
  it('renders the count', () => {
    render(<CounterDisplay count={7} />);
    expect(screen.getByText('7')).toBeTruthy();
  });

  it('renders title and subtitle when provided', () => {
    render(<CounterDisplay count={3} title="Strikes" subtitle="Top of 1st" />);
    expect(screen.getByText('Strikes')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.getByText('Top of 1st')).toBeTruthy();
  });

  it('omits title and subtitle when not provided', () => {
    render(<CounterDisplay count={0} />);
    expect(screen.queryByText('Strikes')).toBeNull();
    expect(screen.queryByText('Top of 1st')).toBeNull();
  });

  it('renders count of zero', () => {
    render(<CounterDisplay count={0} title="Walks" />);
    expect(screen.getByText('0')).toBeTruthy();
  });
});
