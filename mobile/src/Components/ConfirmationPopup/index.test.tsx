import React from 'react';
import { Provider } from 'react-native-paper';
import { fireEvent, act, render, waitFor } from '@testing-library/react-native';
import ConfirmationPopup, { ConfirmationPopupHandle } from '.';

// Render wrapped in react-native-paper provider.
const renderWithProvider = (children: React.ReactNode) => {
  return render(<Provider>{children}</Provider>);
};

describe('Popup', () => {
  it('shows the popup when triggered', async () => {
    const ref = React.createRef<ConfirmationPopupHandle>();

    const { getByText, queryByText } = render(
      <Provider>
        <ConfirmationPopup
          ref={ref}
          onConfirm={() => {}}
          title="Confirm delete?"
          body="Are you sure you want to delete this item? This action cannot be undone."
        />
      </Provider>
    );

    expect(queryByText('Confirm delete?')).toBeNull();

    act(() => {
      ref.current?.show();
    });

    await waitFor(() => {
      expect(getByText('Confirm delete?')).toBeTruthy();
      expect(
        getByText('Are you sure you want to delete this item? This action cannot be undone.')
      ).toBeTruthy();
    });
  });
  it('calls the onConfirm function when the confirm button is pressed', async () => {
    const onConfirm = jest.fn();
    const ref = React.createRef<ConfirmationPopupHandle>();

    const { getByText, getByTestId } = renderWithProvider(
      <ConfirmationPopup
        ref={ref}
        onConfirm={onConfirm}
        title="Confirm delete?"
        body="Are you sure you want to delete this item? This action cannot be undone."
      />
    );

    act(() => {
      ref.current?.show();
    });

    await waitFor(() => {
      expect(getByText('Confirm delete?')).toBeTruthy();
      expect(
        getByText('Are you sure you want to delete this item? This action cannot be undone.')
      ).toBeTruthy();
    });

    fireEvent.press(getByTestId('confirmButton'));

    expect(onConfirm).toHaveBeenCalled();
  });
});
