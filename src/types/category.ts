/**
 * MySpendTracker — Category Types
 * -------------------------------
 * Shared by expenses and income.
 */

export type ExpenseCategoryType =
  | 'food'
  | 'shopping'
  | 'transport'
  | 'bills'
  | 'health'
  | 'entertainment'
  | 'education'
  | 'other';

export type IncomeCategoryType = 'salary' | 'freelance' | 'gift' | 'other';

/** Union — any category key used in the app */
export type CategoryType = ExpenseCategoryType | IncomeCategoryType;

/** Group discriminator */
export type CategoryGroup = 'expense' | 'income';

/** Custom user-created category */
export interface CustomCategory {
  id: string;
  key: string; // e.g. "custom_coffee"
  label: string;
  emoji: string;
  color: string;
  tint: string;
  group: CategoryGroup;
  createdAt: string;
}
