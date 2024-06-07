import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import TimesheetEditor from './TimesheetEditor';
import { Provider } from 'react-native-paper';

jest.mock('./TimesheetEntry', () => {
  return {
    __esModule: true,
    default: () => <div>Mock Timesheet Entry</div>
  };
});

// Render wrapped in react-native-paper provider.
const renderWithProvider = (children: React.ReactNode) => {
  return render(<Provider>{children}</Provider>);
};

describe('TimesheetEditor', () => {
  const handleNewTimesheetEntry = jest.fn();
  const handleCloseTimesheet = jest.fn();
  const handleDeleteTimesheetEntry = jest.fn();
  const handleDeleteTimesheet = jest.fn();
  const handleUpdateTimesheetEntry = jest.fn();

  const timesheet = {
    id: '1',
    name: 'Kwik-E-Mart',
    employee: { id: 'homer', username: 'homer' },
    employer: { id: 'burns', username: 'burns' },
    start_date: '2024-02-07',
    end_date: '2024-02-14',
    entries: []
  };

  it('renders the editor', () => {
    renderWithProvider(
      <TimesheetEditor
        timesheet={timesheet}
        onNewTimesheetEntry={handleNewTimesheetEntry}
        onCloseTimesheet={handleCloseTimesheet}
        onDeleteTimesheetEntry={handleDeleteTimesheetEntry}
        onDeleteTimesheet={handleDeleteTimesheet}
        onUpdateTimesheetEntry={handleUpdateTimesheetEntry}
      />
    );
  });
  it('renders a "no entries" message when there are no entries', () => {
    const { getByText } = renderWithProvider(
      <TimesheetEditor
        timesheet={timesheet}
        onNewTimesheetEntry={handleNewTimesheetEntry}
        onCloseTimesheet={handleCloseTimesheet}
        onDeleteTimesheetEntry={handleDeleteTimesheetEntry}
        onDeleteTimesheet={handleDeleteTimesheet}
        onUpdateTimesheetEntry={handleUpdateTimesheetEntry}
      />
    );
    expect(getByText('No entries')).toBeTruthy();
  });

  it('calls the close timesheet handler when clicked', () => {
    const { getByText } = renderWithProvider(
      <TimesheetEditor
        timesheet={timesheet}
        onNewTimesheetEntry={handleNewTimesheetEntry}
        onCloseTimesheet={handleCloseTimesheet}
        onDeleteTimesheetEntry={handleDeleteTimesheetEntry}
        onDeleteTimesheet={handleDeleteTimesheet}
        onUpdateTimesheetEntry={handleUpdateTimesheetEntry}
      />
    );
    fireEvent.press(getByText('Back'));
    expect(handleCloseTimesheet).toHaveBeenCalled();
  });
  it('calls the delete timesheet handler when clicked', () => {
    const { getByText, getByTestId } = renderWithProvider(
      <TimesheetEditor
        timesheet={timesheet}
        onNewTimesheetEntry={handleNewTimesheetEntry}
        onCloseTimesheet={handleCloseTimesheet}
        onDeleteTimesheetEntry={handleDeleteTimesheetEntry}
        onDeleteTimesheet={handleDeleteTimesheet}
        onUpdateTimesheetEntry={handleUpdateTimesheetEntry}
      />
    );
    fireEvent.press(getByTestId('menu'));
    fireEvent.press(getByText('Delete'));
    expect(getByText('Delete entire timesheet?')).toBeTruthy();
    fireEvent.press(getByText('Confirm'));
    expect(handleDeleteTimesheet).toHaveBeenCalled();
  });
  it('calls the new timesheet entry handler when clicked', () => {
    const { getByText } = renderWithProvider(
      <TimesheetEditor
        timesheet={timesheet}
        onNewTimesheetEntry={handleNewTimesheetEntry}
        onCloseTimesheet={handleCloseTimesheet}
        onDeleteTimesheetEntry={handleDeleteTimesheetEntry}
        onDeleteTimesheet={handleDeleteTimesheet}
        onUpdateTimesheetEntry={handleUpdateTimesheetEntry}
      />
    );
    fireEvent.press(getByText('Add time'));
    expect(handleNewTimesheetEntry).toHaveBeenCalled();
  });
});
