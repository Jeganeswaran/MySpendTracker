/**
 * MySpendTracker — Date Formatting
 * --------------------------------
 * Consistent date handling + grouping (Today, Yesterday, etc.)
 */

import {
  format,
  isToday,
  isYesterday,
  isTomorrow,
  isThisWeek,
  isThisMonth,
  isThisYear,
  differenceInCalendarDays,
  parseISO,
} from 'date-fns';
import { DATE_FORMATS, DATE_LABELS } from '@constants/date-formats';

// ─────────────────────────────────────────────
// 1. BASIC FORMATTING
// ─────────────────────────────────────────────

/**
 * Format a date string (ISO or Date) into a displayable string.
 */
export function formatDate(
  date: string | Date,
  formatStr: string = DATE_FORMATS.READABLE,
): string {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, formatStr);
  } catch {
    return '';
  }
}

/** Short format — "Oct 6" */
export function formatDateShort(date: string | Date): string {
  return formatDate(date, DATE_FORMATS.SHORT);
}

/** Full format — "Monday, October 6" */
export function formatDateFull(date: string | Date): string {
  return formatDate(date, DATE_FORMATS.FULL);
}

/** ISO format — "2026-10-06" */
export function formatDateISO(date: string | Date = new Date()): string {
  return formatDate(date, DATE_FORMATS.ISO);
}

/** Month key — "2026-10" */
export function formatMonthKey(date: string | Date = new Date()): string {
  return formatDate(date, DATE_FORMATS.MONTH_KEY);
}

/** Time only — "3:45 PM" */
export function formatTime(date: string | Date): string {
  return formatDate(date, DATE_FORMATS.TIME);
}

/** Date + time — "Oct 6, 3:45 PM" */
export function formatDateTime(date: string | Date): string {
  return formatDate(date, DATE_FORMATS.DATETIME);
}

// ─────────────────────────────────────────────
// 2. RELATIVE LABELS
// ─────────────────────────────────────────────

/**
 * Human-friendly label: "Today", "Yesterday", "Oct 6", etc.
 */
export function formatRelativeDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;

  if (isToday(d)) return DATE_LABELS.TODAY;
  if (isYesterday(d)) return DATE_LABELS.YESTERDAY;
  if (isTomorrow(d)) return DATE_LABELS.TOMORROW;

  const daysDiff = differenceInCalendarDays(new Date(), d);

  // Within last 7 days — "3 days ago"
  if (daysDiff > 0 && daysDiff <= 7) {
    return `${daysDiff} day${daysDiff === 1 ? '' : 's'} ago`;
  }

  // Same year — "Oct 6"
  if (isThisYear(d)) {
    return formatDate(d, DATE_FORMATS.SHORT);
  }

  // Otherwise — "Oct 6, 2024"
  return formatDate(d, DATE_FORMATS.READABLE);
}

/**
 * Group label for transaction lists: "Today", "Yesterday", "This Week", etc.
 */
export function getDateGroupLabel(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;

  if (isToday(d)) return DATE_LABELS.TODAY;
  if (isYesterday(d)) return DATE_LABELS.YESTERDAY;
  if (isThisWeek(d, { weekStartsOn: 1 })) return DATE_LABELS.THIS_WEEK;
  if (isThisMonth(d)) return DATE_LABELS.THIS_MONTH;
  if (isThisYear(d)) return formatDate(d, 'MMMM');

  return formatDate(d, DATE_FORMATS.MONTH_YEAR);
}

// ─────────────────────────────────────────────
// 3. RANGE HELPERS
// ─────────────────────────────────────────────

export interface DateRange {
  start: string;
  end: string;
}

/** Get start + end of the current month (ISO strings) */
export function getCurrentMonthRange(): DateRange {
  const now = new Date();
  return {
    start: formatDate(
      new Date(now.getFullYear(), now.getMonth(), 1),
      DATE_FORMATS.ISO,
    ),
    end: formatDate(
      new Date(now.getFullYear(), now.getMonth() + 1, 0),
      DATE_FORMATS.ISO,
    ),
  };
}

/** Get start + end of the current week (Mon–Sun) */
export function getCurrentWeekRange(): DateRange {
  const now = new Date();
  const day = now.getDay();
  const diffToMon = (day + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMon);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    start: formatDateISO(monday),
    end: formatDateISO(sunday),
  };
}

/** Get today's ISO date */
export function getTodayISO(): string {
  return formatDateISO(new Date());
}

// ─────────────────────────────────────────────
// 4. GREETING
// ─────────────────────────────────────────────

export function getTimeOfDayGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
