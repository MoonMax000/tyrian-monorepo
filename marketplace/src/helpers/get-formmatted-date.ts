export const getFormattedDate = (
  dateInput: Date | string | number,
  options?: Intl.DateTimeFormatOptions,
): string => {
  const date = new Date(dateInput);

  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    ...options,
  });

  const formattedDayString = formatter.format(date);
  return formattedDayString;
};
