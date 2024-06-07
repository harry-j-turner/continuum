import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TimesheetActions from './TimesheetActions';

describe('TimesheetActions', () => {
  const handleNewTimesheet = jest.fn();
  it('renders the timesheet actions', () => {
    const { getByText } = render(<TimesheetActions onNewTimesheet={handleNewTimesheet} />);
    expect(getByText(`New timesheet`)).toBeTruthy();
  });

  it('calls the onNewTimesheet function when the new timesheet button is pressed', () => {
    const { getByText } = render(<TimesheetActions onNewTimesheet={handleNewTimesheet} />);
    fireEvent.press(getByText('New timesheet'));
    expect(handleNewTimesheet).toHaveBeenCalled();
  });
});
