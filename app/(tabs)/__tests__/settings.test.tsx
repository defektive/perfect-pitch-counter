import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react-native';
import SettingsScreen from '../settings';

describe('SettingsScreen', () => {
  it('renders the app name, version, and build number rows', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('Application')).toBeTruthy();
    expect(screen.getByText('Version')).toBeTruthy();
    expect(screen.getByText('Build Number')).toBeTruthy();
  });

  it('reads values from expoConfig', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('Pitch Counter')).toBeTruthy();
    expect(screen.getByText('1.2.3')).toBeTruthy();
    expect(screen.getByText('42')).toBeTruthy();
  });
});
