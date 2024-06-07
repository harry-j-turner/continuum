import React from 'react';
import { render } from '@testing-library/react-native';
import IconText from './index';

describe('IconText', () => {
  it('renders the icontext correctly', () => {
    const text = 'Hello World';
    const { getByText, getByTestId } = render(<IconText icon="star" text={text} />);
    expect(getByText(text)).toBeTruthy();
    expect(getByTestId('icon')).toBeTruthy();
  });
});
