import { isToday, isYesterday, differenceInCalendarDays } from 'date-fns';

export function getDayString(date: Date) {
  if (isToday(date)) {
    return 'Today';
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  const diff = differenceInCalendarDays(new Date(), date);
  if (diff < 7) {
    return `${diff} days ago`;
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() === new Date().getFullYear() ? undefined : 'numeric',
  });
}
