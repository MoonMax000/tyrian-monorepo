export const getDateDiff = (date1: Date, date2: Date = new Date()) => {
  const t1 = date1.getTime();
  const t2 = date2.getTime();

  let diff = Math.abs(t1 - t2);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * 1000 * 60 * 60 * 24;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * 1000 * 60 * 60;

  const minutes = Math.floor(diff / (1000 * 60));

  return `${days}d ${hours}h ${minutes}m`;
};
