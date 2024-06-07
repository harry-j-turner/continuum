import React from 'react';
import { render } from '@testing-library/react-native';
import TimesheetList from './TimesheetList';
import { Timesheet } from '../../Services/API/types';

describe('Timesheet', () => {
  const handleOpenTimesheet = jest.fn();

  it('renders the timesheet list', () => {
    const timesheets = [
      {
        id: '1',
        name: "Moe's Tavern",
        entries: [],
        employee: { id: 'homer', username: 'homer' },
        employer: { id: 'moe', username: 'moe' },
        start_date: '2024-02-07',
        end_date: '2024-02-14'
      },
      {
        id: '2',
        entries: [],
        name: 'Springfield Elementary',
        employee: { id: 'bart', username: 'bart' },
        employer: { id: 'lisa', username: 'lisa' },
        start_date: '2024-03-07',
        end_date: '2024-03-14'
      }
    ];

    const { getByText } = render(
      <TimesheetList timesheets={timesheets} group="client" onOpenTimesheet={handleOpenTimesheet} />
    );
    expect(getByText(`Moe's Tavern`)).toBeTruthy();
    expect(getByText(`Springfield Elementary`)).toBeTruthy();
  });

  it('renders a nice message if no timesheets are found', () => {
    const timesheets: Timesheet[] = [];

    const { getByText } = render(
      <TimesheetList timesheets={timesheets} group="client" onOpenTimesheet={handleOpenTimesheet} />
    );
    expect(getByText(`No timesheets`)).toBeTruthy();
  });

  it('renders a loading message if timesheets are not yet loaded', () => {
    const timesheets = null;

    const { getByText } = render(
      <TimesheetList timesheets={timesheets} group="client" onOpenTimesheet={handleOpenTimesheet} />
    );
    expect(getByText(`Fetching timesheets...`)).toBeTruthy();
  });
});
