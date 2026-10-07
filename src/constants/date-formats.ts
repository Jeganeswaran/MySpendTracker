/**
 * MySpendTracker — Date Formats
 * -----------------------------
 * Consistent date handling across the app.
 */

export const DATE_FORMATS = {
  /** YYYY-MM-DD — for storage and API */
  ISO: 'yyyy-MM-dd',

  /** e.g. "Oct 6, 2026" */
  READABLE: 'MMM d, yyyy',

  /** e.g. "Monday, October 6" */
  FULL: 'EEEE, MMMM d',

  /** e.g. "Oct 6" */
  SHORT: 'MMM d',

  /** e.g. "10/06/2026" */
  NUMERIC: 'MM/dd/yyyy',

  /** e.g. "3:45 PM" */
  TIME: 'h:mm a',

  /** e.g. "Oct 6, 3:45 PM" */
  DATETIME: 'MMM d, h:mm a',

  /** e.g. "October 2026" */
  MONTH_YEAR: 'MMMM yyyy',

  /** e.g. "2026-10" — for budget periods */
  MONTH_KEY: 'yyyy-MM',
} as const;

export const DATE_LABELS = {
  TODAY: 'Today',
  YESTERDAY: 'Yesterday',
  TOMORROW: 'Tomorrow',
  THIS_WEEK: 'This Week',
  THIS_MONTH: 'This Month',
  LAST_MONTH: 'Last Month',
  THIS_YEAR: 'This Year',
} as const;
