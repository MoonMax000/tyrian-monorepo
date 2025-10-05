export const getMonthData = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const shift = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  return { shift, daysInMonth };
};
