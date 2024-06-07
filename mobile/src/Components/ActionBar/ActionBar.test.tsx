import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ActionBar, { ActionBarButton } from './ActionBar';

describe('ActionBar Component', () => {
  it('renders correctly with no buttons', () => {
    const { queryByText } = render(<ActionBar buttons={[]} />);
    expect(queryByText(/.+/)).toBeNull();
  });

  it('renders correctly with buttons on the left', () => {
    const buttons: ActionBarButton[] = [
      { icon: 'information', onPress: jest.fn(), text: 'Info', position: 'left' }
    ];
    const { getByText } = render(<ActionBar buttons={buttons} />);
    expect(getByText('Info')).toBeTruthy();
  });

  it('renders correctly with buttons on the right', () => {
    const buttons: ActionBarButton[] = [
      { icon: 'settings', onPress: jest.fn(), text: 'Settings', position: 'right' }
    ];
    const { getByText } = render(<ActionBar buttons={buttons} />);
    expect(getByText('Settings')).toBeTruthy();
  });

  it('renders correctly with buttons on both sides', () => {
    const buttons: ActionBarButton[] = [
      { icon: 'information', onPress: jest.fn(), text: 'Info', position: 'left' },
      { icon: 'settings', onPress: jest.fn(), text: 'Settings', position: 'right' }
    ];
    const { getByText } = render(<ActionBar buttons={buttons} />);
    expect(getByText('Info')).toBeTruthy();
    expect(getByText('Settings')).toBeTruthy();
  });

  it('handles button press correctly', () => {
    const mockPressHandler = jest.fn();
    const buttons: ActionBarButton[] = [
      { icon: 'information', onPress: mockPressHandler, text: 'Info', position: 'left' }
    ];
    const { getByText } = render(<ActionBar buttons={buttons} />);

    fireEvent.press(getByText('Info'));
    expect(mockPressHandler).toHaveBeenCalledTimes(1);
  });
});
