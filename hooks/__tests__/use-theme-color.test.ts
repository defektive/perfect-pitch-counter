import { describe, it, expect, vi, beforeEach } from 'vitest';

let mockedScheme: 'light' | 'dark' | null = 'light';

vi.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => mockedScheme,
}));

import { useThemeColor } from '../use-theme-color';
import { Colors } from '@/constants/theme';

describe('useThemeColor', () => {
  beforeEach(() => {
    mockedScheme = 'light';
  });

  it('returns the override prop when provided for the active theme', () => {
    expect(useThemeColor({ light: '#abcdef' }, 'background')).toBe('#abcdef');
  });

  it('falls back to the theme color when no override is given', () => {
    mockedScheme = 'dark';
    expect(useThemeColor({}, 'background')).toBe(Colors.dark.background);
  });

  it('uses the dark override when scheme is dark', () => {
    mockedScheme = 'dark';
    expect(useThemeColor({ light: '#111111', dark: '#222222' }, 'background')).toBe('#222222');
  });

  it('defaults to light when the scheme is null', () => {
    mockedScheme = null;
    expect(useThemeColor({}, 'background')).toBe(Colors.light.background);
  });
});
