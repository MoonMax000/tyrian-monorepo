export function getRelativeDate(dateString: string, now: Date = new Date()): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';

  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}`;

  if (diffMs < 0) {
    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${timeStr}`;
  }

  if (diffMinutes < 1) return 'Just now';

  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;

  const isYesterday =
    diffDays === 1 &&
    date.getDate() === now.getDate() - 1 &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
  if (isYesterday) return `Yesterday at ${timeStr}`;

  if (diffDays >= 7) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  if (diffDays >= 1) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
}
