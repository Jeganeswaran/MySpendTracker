/**
 * MySpendTracker — Storage Keys
 * -----------------------------
 * Every AsyncStorage / Zustand persist key goes here.
 * Never hardcode string keys in stores.
 */

export const STORAGE_KEYS = {
  /** Zustand: expenses list */
  EXPENSES: 'myspendtracker:expenses',

  /** Zustand: budgets */
  BUDGETS: 'myspendtracker:budgets',

  /** Zustand: goals */
  GOALS: 'myspendtracker:goals',

  /** Zustand: auth state */
  AUTH: 'myspendtracker:auth',

  /** Zustand: theme mode */
  THEME: 'myspendtracker:theme',

  /** Zustand: user preferences */
  PREFERENCES: 'myspendtracker:preferences',

  /** Zustand: wallets */
  WALLETS: 'myspendtracker:wallets',

  /** Selected currency */
  CURRENCY: 'myspendtracker:currency',

  /** Onboarding completion flag */
  HAS_ONBOARDED: 'myspendtracker:has-onboarded',

  /** Last sync timestamp */
  LAST_SYNC_AT: 'myspendtracker:last-sync-at',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
