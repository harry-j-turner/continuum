// dateUtils.test.ts

import { formatDate, getOrdinalSuffix } from './utils';

describe('getOrdinalSuffix', () => {
  it('returns "st" for 1, 21, 31', () => {
    expect(getOrdinalSuffix(1)).toBe('st');
    expect(getOrdinalSuffix(21)).toBe('st');
    expect(getOrdinalSuffix(31)).toBe('st');
  });

  it('returns "nd" for 2, 22', () => {
    expect(getOrdinalSuffix(2)).toBe('nd');
    expect(getOrdinalSuffix(22)).toBe('nd');
  });

  it('returns "rd" for 3, 23', () => {
    expect(getOrdinalSuffix(3)).toBe('rd');
    expect(getOrdinalSuffix(23)).toBe('rd');
  });

  it('returns "th" for the rest', () => {
    expect(getOrdinalSuffix(4)).toBe('th');
    expect(getOrdinalSuffix(11)).toBe('th');
    expect(getOrdinalSuffix(12)).toBe('th');
    expect(getOrdinalSuffix(13)).toBe('th');
    expect(getOrdinalSuffix(100)).toBe('th');
  });
});

describe('formatDate', () => {
  it('formats regular dates correctly', () => {
    expect(formatDate('2024-02-07')).toBe('Feb 7th');
    expect(formatDate('2024-03-01')).toBe('Mar 1st');
    expect(formatDate('2024-09-26')).toBe('Sep 26th');
  });

  it('handles leap years', () => {
    expect(formatDate('2020-02-29')).toBe('Feb 29th');
  });

  it('handles invalid dates gracefully', () => {
    expect(formatDate('2024-02-30')).toBe('Invalid Date'); // February 30th does not exist
    expect(formatDate('This is not a date')).toBe('Invalid Date');
  });
});

describe('formatDate with date-times', () => {
  it('formats date-times without seconds correctly', () => {
    expect(formatDate('2024-02-07T15:30')).toBe('Feb 7th, 15:30');
    expect(formatDate('2024-03-01T00:00')).toBe('Mar 1st, 0:00'); // Edge case: midnight
    expect(formatDate('2024-11-15T23:59')).toBe('Nov 15th, 23:59'); // Edge case: one minute before midnight
  });

  it('formats date-times with seconds (ignoring seconds)', () => {
    // Assuming the implementation ignores seconds for simplicity
    expect(formatDate('2024-02-07T15:30:45')).toBe('Feb 7th, 15:30');
    expect(formatDate('2024-03-01T00:00:59')).toBe('Mar 1st, 0:00');
  });

  it('handles invalid date-times gracefully', () => {
    expect(formatDate('2024-02-30T15:30')).toBe('Invalid Date'); // February 30th does not exist
    expect(formatDate('2024-13-01T00:00')).toBe('Invalid Date'); // 13th month does not exist
    expect(formatDate('This is not a date-time')).toBe('Invalid Date');
  });
});

describe('formatDate with timeOnly flag', () => {
  it('returns only the time part when timeOnly is true', () => {
    expect(formatDate('2024-02-07T15:30', true)).toBe('15:30');
    expect(formatDate('2024-03-01T00:00', true)).toBe('0:00');
  });

  it('returns "Invalid Date" for invalid inputs with timeOnly flag', () => {
    expect(formatDate('2024-02-30T25:61', true)).toBe('Invalid Date'); // Invalid time
    expect(formatDate('This is not a datetime', true)).toBe('Invalid Date');
  });

  it('ignores timeOnly flag if there is no time part in the input', () => {
    expect(formatDate('2024-02-07', true)).toBe('Feb 7th');
  });
});
