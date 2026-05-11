import { describe, it, expect } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Collapsible } from '../collapsible';

describe('Collapsible', () => {
  it('renders the title', () => {
    render(
      <Collapsible title="Stats">
        <Text>hidden content</Text>
      </Collapsible>
    );
    expect(screen.getByText('Stats')).toBeTruthy();
  });

  it('hides children by default', () => {
    render(
      <Collapsible title="Stats">
        <Text>secret</Text>
      </Collapsible>
    );
    expect(screen.queryByText('secret')).toBeNull();
  });

  it('reveals children when the heading is tapped', () => {
    render(
      <Collapsible title="Stats">
        <Text>revealed</Text>
      </Collapsible>
    );
    fireEvent.press(screen.getByText('Stats'));
    expect(screen.getByText('revealed')).toBeTruthy();
  });

  it('hides children again on a second tap', () => {
    render(
      <Collapsible title="Stats">
        <Text>toggle-me</Text>
      </Collapsible>
    );
    const heading = screen.getByText('Stats');
    fireEvent.press(heading);
    expect(screen.getByText('toggle-me')).toBeTruthy();
    fireEvent.press(heading);
    expect(screen.queryByText('toggle-me')).toBeNull();
  });
});
