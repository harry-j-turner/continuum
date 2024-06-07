export function getOrdinalSuffix(date: number): string {
  const j = date % 10,
    k = date % 100;
  if (j == 1 && k != 11) {
    return 'st';
  }
  if (j == 2 && k != 12) {
    return 'nd';
  }
  if (j == 3 && k != 13) {
    return 'rd';
  }
  return 'th';
}

export function getDate(isoDateTimeString: string) {
  const inputDate = new Date(isoDateTimeString);
  if (isNaN(inputDate.getTime())) {
    return 'Invalid Date';
  }

  const dateParts = isoDateTimeString.split('T')[0].split('-').map(Number);
  const [year, month, day] = dateParts;
  const ordinalSuffix = getOrdinalSuffix(day);
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  const formattedMonth = monthNames[inputDate.getMonth()];
  return `${formattedMonth} ${day}${ordinalSuffix}`;
}

export function formatDate(isoDateTimeString: string, timeOnly: boolean = false): string {
  const inputDate = new Date(isoDateTimeString);

  if (isNaN(inputDate.getTime())) {
    return 'Invalid Date';
  }

  // Extract the time part if present
  const dateTimeParts = isoDateTimeString.split('T');
  const timePart = dateTimeParts.length > 1 ? dateTimeParts[1].split(':') : null;

  if (timeOnly && timePart) {
    const hours = parseInt(timePart[0], 10);
    const minutes = timePart[1]; // Already a string in "MM" format
    return `${hours}:${minutes}`;
  }

  // Continue with the date formatting if timeOnly is not requested or there's no time part
  const dateParts = dateTimeParts[0].split('-').map(Number);
  const [year, month, day] = dateParts;

  if (
    inputDate.getFullYear() !== year ||
    inputDate.getMonth() + 1 !== month ||
    inputDate.getDate() !== day
  ) {
    return 'Invalid Date';
  }

  const ordinalSuffix = getOrdinalSuffix(day);
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  const formattedMonth = monthNames[inputDate.getMonth()];
  let formattedDate = `${formattedMonth} ${day}${ordinalSuffix}`;

  if (timePart) {
    const hours = parseInt(timePart[0], 10);
    const minutes = timePart[1];
    formattedDate += `, ${hours}:${minutes}`;
  }

  return formattedDate;
}
