import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AppIcon from '.';

describe('AppIcon', () => {
  it('renders the icon', () => {
    const { getByText } = render(
      <AppIcon size={100} name="icon" icon="information" onPress={() => {}} />
    );
    expect(getByText('icon')).toBeTruthy();
  });
  it('triggers onPress when clicked', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <AppIcon size={100} name="icon" icon="information" onPress={onPressMock} />
    );
    fireEvent.press(getByText('icon'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
  it('renders a disabled icon', () => {
    const { getByText } = render(
      <AppIcon size={100} name="icon" icon="information" onPress={() => {}} disabled />
    );
    expect(getByText('Coming soon')).toBeTruthy();
  });
  it('does not trigger onPress when clicked if disabled', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <AppIcon size={100} name="icon" icon="information" onPress={onPressMock} disabled />
    );
    fireEvent.press(getByText('icon'));
    expect(onPressMock).toHaveBeenCalledTimes(0);
  });
});
