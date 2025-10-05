import { format, isToday, isYesterday } from 'date-fns';
import { ru } from 'date-fns/locale';

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };
  return date.toLocaleString('en-US', options);
}

const parseDate = (dateStr: string | number | undefined | null): Date | null => {
  if (!dateStr) return null;
  try {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  } catch (e) {
    console.log('Error parsing date:', dateStr, e);
    return null;
  }
};

/**
 * Formats a timestamp for display within a chat bubble.
 * Example: "17:10" or "5 hours ago"
 */
export function formatTimestamp(timestamp: string | number | undefined | null): string {
  if (!timestamp) return '[No time]';

  const date = parseDate(timestamp);
  if (!date) {
    console.log('Failed to parse timestamp:', timestamp);
    return `${timestamp}`;
  }

  return format(date, 'HH:mm');
}

/**
 * Formats a date for the date separator in the chat list.
 * Example: "Today", "Yesterday", "May 20, 2024"
 */
export function formatChatDateSeparator(timestamp: string | undefined | null): string {
  const date = parseDate(timestamp);
  if (!date) return '';

  if (isToday(date)) {
    return 'Сегодня';
  }
  if (isYesterday(date)) {
    return 'Вчера';
  }

  return format(date, 'd MMMM yyyy', { locale: ru });
}

export const formatChatDate = (inputDate?: string | number) => {
  if (!inputDate) return;

  const date = new Date(inputDate);
  const today = new Date();

  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return isToday
    ? `${hours}:${minutes}`
    : `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};
