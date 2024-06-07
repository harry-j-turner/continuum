import React from 'react';
import { Provider } from 'react-native-paper';
import { fireEvent, act, render, waitFor } from '@testing-library/react-native';
import FormPopup, { FormPopupHandle, FormPopupBodyElement } from '.';

// Render wrapped in react-native-paper provider.
const renderWithProvider = (children: React.ReactNode) => {
  return render(<Provider>{children}</Provider>);
};

describe('FormPopup', () => {
  it('shows the popup when triggered', async () => {
    const ref = React.createRef<FormPopupHandle>();

    const { getByText, queryByText } = render(
      <Provider>
        <FormPopup
          ref={ref}
          onConfirm={() => {}}
          title="Confirm delete?"
          body={[
            {
              type: 'text',
              key: 'text1',
              text: 'some text'
            }
          ]}
        />
      </Provider>
    );

    expect(queryByText('Confirm delete?')).toBeNull();

    act(() => {
      ref.current?.show();
    });

    await waitFor(() => {
      expect(getByText('Confirm delete?')).toBeTruthy();
      expect(getByText('some text')).toBeTruthy();
    });
  });
  it('shows a text input and returns the value when confirmed', async () => {
    const onConfirm = jest.fn();
    const ref = React.createRef<FormPopupHandle>();

    const { getByText, getByTestId } = renderWithProvider(
      <FormPopup
        ref={ref}
        onConfirm={onConfirm}
        title="Confirm delete?"
        body={[
          {
            type: 'input',
            label: 'Input label',
            key: 'input1',
            validator: (value) =>
              value === 'duff' ? Promise.resolve('Invalid') : Promise.resolve('')
          }
        ]}
      />
    );

    act(() => {
      ref.current?.show();
    });

    await waitFor(() => {
      expect(getByTestId('input-input1')).toBeTruthy();
    });

    // Bad input
    fireEvent.changeText(getByTestId('input-input1'), 'duff');

    await waitFor(() => {
      expect(getByText('Invalid')).toBeTruthy();
    });

    // TODO: Fix async issues here so we can test the confirm button.
  });
  it('validates the input on mount', async () => {
    const ref = React.createRef<FormPopupHandle>();

    const { getByTestId, getByText } = renderWithProvider(
      <FormPopup
        ref={ref}
        onConfirm={() => {}}
        title="Confirm delete?"
        body={[
          {
            type: 'input',
            label: 'Input label',
            key: 'input1',
            validator: (value) => (value === '' ? Promise.resolve('Invalid') : Promise.resolve(''))
          }
        ]}
      />
    );

    act(() => {
      ref.current?.show();
    });

    await waitFor(() => {
      expect(getByTestId('input-input1')).toBeTruthy();
      expect(getByText('Invalid')).toBeTruthy();
    });
  });
});
