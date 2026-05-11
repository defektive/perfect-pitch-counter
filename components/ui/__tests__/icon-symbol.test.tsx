import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react-native';
import { IconSymbol } from '../icon-symbol';

describe('IconSymbol', () => {
  it('maps an SF Symbol name to the corresponding Material icon and forwards props', () => {
    const { root } = render(<IconSymbol name="trash" color="#F44336" />);
    const icon = root.findByType('MaterialIcons' as never);
    expect(icon.props.name).toBe('delete');
    expect(icon.props.color).toBe('#F44336');
    expect(icon.props.size).toBe(24);
  });

  it('honors a custom size', () => {
    const { root } = render(<IconSymbol name="house.fill" size={32} color="#111" />);
    const icon = root.findByType('MaterialIcons' as never);
    expect(icon.props.size).toBe(32);
    expect(icon.props.name).toBe('home');
  });

  it('maps each entry in the SF Symbols → Material mapping', () => {
    const cases: Array<[string, string]> = [
      ['paperplane.fill', 'send'],
      ['chevron.right', 'chevron-right'],
      ['baseball', 'sports-baseball'],
      ['dashboard', 'dashboard'],
      ['list.bullet', 'format-list-bulleted'],
      ['gear', 'settings'],
      ['clock', 'schedule'],
    ];
    for (const [sfName, materialName] of cases) {
      const { root } = render(<IconSymbol name={sfName as never} color="#000" />);
      const icon = root.findByType('MaterialIcons' as never);
      expect(icon.props.name).toBe(materialName);
    }
  });
});
