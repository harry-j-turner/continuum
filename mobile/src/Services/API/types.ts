// Timesheet API
// ##############

export type User = {
  id: string;
  username: string;
};

export type TimesheetEntry = {
  id: string;
  start_datetime: string;
  end_datetime: string;
};

export type Timesheet = {
  employee: User | null;
  employer: User | null;
  end_date: string;
  id: string;
  name: string;
  start_date: string;
  entries: TimesheetEntry[];
};

export type CreateTimesheetRequest = {
  employee?: string;
  employer?: string;
  name: string;
};

export type CreateTimesheetEntryRequest = {
  start_datetime: string;
  end_datetime: string;
};

export type UpdateTimesheetEntryRequest = {
  start_datetime: string;
  end_datetime: string;
};

export type Group = 'unassigned' | 'client' | 'personal_assistant';
