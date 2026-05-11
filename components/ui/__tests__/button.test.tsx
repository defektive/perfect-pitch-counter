import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Button } from '../button';

describe('Button', () => {
  it('renders the title', () => {
    render(<Button title="Strike" />);
    expect(screen.getByText('Strike')).toBeTruthy();
  });

  it('fires onPress when tapped', () => {
    const onPress = vi.fn();
    render(<Button title="Tap me" onPress={onPress} />);
    fireEvent.press(screen.getByText('Tap me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('forwards the disabled prop to the underlying touchable', () => {
    const { root } = render(<Button title="Off" disabled />);
    const touchable = root.findByType('TouchableOpacity' as never);
    expect(touchable.props.disabled).toBe(true);
  });

  it('renders the variant title even with no onPress', () => {
    render(<Button title="Idle" />);
    expect(screen.getByText('Idle')).toBeTruthy();
  });
});
