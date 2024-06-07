import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import TextButton from './index';

describe('Keypad Component', () => {
  test('triggers onPress when clicked', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <TextButton text="Click Me" onPress={onPressMock} disabled={false} />
    );

    fireEvent.press(getByText('Click Me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  test('does not trigger onPress when disabled', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <TextButton text="Click Me" onPress={onPressMock} disabled={true} />
    );

    fireEvent.press(getByText('Click Me'));
    expect(onPressMock).not.toHaveBeenCalled();
  });
});
