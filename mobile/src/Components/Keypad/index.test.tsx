import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { Text } from 'react-native-paper';
import Keypad from './index';

describe('Keypad Component', () => {
  const undoElement = <Text>Undo</Text>;
  const onPressMock = jest.fn();

  beforeEach(() => {
    onPressMock.mockClear();
  });

  test('renders all keys correctly', () => {
    const { getByText } = render(
      <Keypad
        undoElement={undoElement}
        onPress={onPressMock}
        disabled={false}
      />
    );
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, -1];

    numbers.forEach((number) => {
      const textToFind = number === -1 ? 'Undo' : number.toString();
      expect(getByText(textToFind)).toBeTruthy();
    });
  });

  test('correctly triggers onPress when a key is pressed', () => {
    const { getByText } = render(
      <Keypad
        undoElement={undoElement}
        onPress={onPressMock}
        disabled={false}
      />
    );

    fireEvent.press(getByText('1'));
    expect(onPressMock).toHaveBeenCalledWith(1);

    fireEvent.press(getByText('2'));
    expect(onPressMock).toHaveBeenCalledWith(2);

    // Test other numbers as needed
  });

  test('does not trigger onPress when keys are disabled', () => {
    const { getByText } = render(
      <Keypad undoElement={undoElement} onPress={onPressMock} disabled={true} />
    );

    fireEvent.press(getByText('1'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  test('renders custom undo element', () => {
    const { getByText } = render(
      <Keypad
        undoElement={undoElement}
        onPress={onPressMock}
        disabled={false}
      />
    );
    expect(getByText('Undo')).toBeTruthy();
  });

  // Additional tests can include checking opacity for disabled keys,
  // but this might require more advanced testing techniques.
});
