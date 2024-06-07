import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import TimesheetCard from './TimesheetCard';

describe('TimesheetCard', () => {
  const timesheet = {
    id: '1',
    name: 'Kwik-E-Mart',
    employee: { id: 'homer', username: 'homer' },
    employer: { id: 'burns', username: 'burns' },
    start_date: '2024-02-07',
    end_date: '2024-02-14',
    entries: []
  };

  const handleOpenTimesheet = jest.fn();
  it('renders the name and employee names for clients', () => {
    const { getByText } = render(
      <TimesheetCard timesheet={timesheet} group="client" onOpenTimesheet={handleOpenTimesheet} />
    );
    expect(getByText(`Kwik-E-Mart`)).toBeTruthy();
    expect(getByText(`with homer`)).toBeTruthy();
    expect(getByText(`Open`)).toBeTruthy();
  });
  it('renders the the name and employer name for personal_assistants', () => {
    const { getByText } = render(
      <TimesheetCard
        timesheet={timesheet}
        group="personal_assistant"
        onOpenTimesheet={handleOpenTimesheet}
      />
    );
    expect(getByText(`Kwik-E-Mart`)).toBeTruthy();
    expect(getByText(`with burns`)).toBeTruthy();
    expect(getByText(`Open`)).toBeTruthy();
  });
  it('calls the open timesheet handler when clicked', () => {
    const { getByText } = render(
      <TimesheetCard timesheet={timesheet} group="client" onOpenTimesheet={handleOpenTimesheet} />
    );
    fireEvent.press(getByText(`Kwik-E-Mart`));
    expect(handleOpenTimesheet).toHaveBeenCalledWith(timesheet.id);
  });
  it('shows "no assignee" message when no employee is assigned', () => {
    const timesheetNoEmployee = { ...timesheet, employee: null };
    const { getByText } = render(
      <TimesheetCard
        timesheet={timesheetNoEmployee}
        group="client"
        onOpenTimesheet={handleOpenTimesheet}
      />
    );
    expect(getByText(`Kwik-E-Mart`)).toBeTruthy();
    expect(getByText(`Not yet assigned`)).toBeTruthy();
    expect(getByText(`Open`)).toBeTruthy();
  });
});
