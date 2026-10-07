/**
 * MySpendTracker — Expense & Income Categories
 * --------------------------------------------
 * Single source of truth for category keys, labels, emojis, and colors.
 */

import { CategoryType } from "@app-types/expense";


// ─────────────────────────────────────────────
// 1. CATEGORY INTERFACE
// ─────────────────────────────────────────────

export interface CategoryConfig {
  key: CategoryType;
  label: string;
  emoji: string;
  /** Solid color — for icons, chart slices */
  color: string;
  /** Tint color — for icon backgrounds */
  tint: string;
  /** Group — used to separate expense vs income */
  group: 'expense' | 'income';
}

// ─────────────────────────────────────────────
// 2. EXPENSE CATEGORIES
// ─────────────────────────────────────────────

export const EXPENSE_CATEGORIES = [
  {
    key: 'food',
    label: 'Food',
    emoji: '🍔',
    color: '#FF8A3D',
    tint: '#FFF1E5',
    group: 'expense',
  },
  {
    key: 'shopping',
    label: 'Shopping',
    emoji: '🛍️',
    color: '#A855F7',
    tint: '#F5F0FF',
    group: 'expense',
  },
  {
    key: 'transport',
    label: 'Transport',
    emoji: '🚗',
    color: '#3B82F6',
    tint: '#E5F0FF',
    group: 'expense',
  },
  {
    key: 'bills',
    label: 'Bills',
    emoji: '💡',
    color: '#FACC15',
    tint: '#FFF9E0',
    group: 'expense',
  },
  {
    key: 'health',
    label: 'Health',
    emoji: '💊',
    color: '#22C55E',
    tint: '#E8F9EE',
    group: 'expense',
  },
  {
    key: 'entertainment',
    label: 'Fun',
    emoji: '🎬',
    color: '#EF4444',
    tint: '#FFE8E8',
    group: 'expense',
  },
  {
    key: 'education',
    label: 'Education',
    emoji: '📚',
    color: '#22C55E',
    tint: '#E8F9EE',
    group: 'expense',
  },
  {
    key: 'other',
    label: 'Other',
    emoji: '➕',
    color: '#8E8E93',
    tint: '#F2F2F7',
    group: 'expense',
  },
] as const satisfies readonly CategoryConfig[];

// ─────────────────────────────────────────────
// 3. INCOME CATEGORIES
// ─────────────────────────────────────────────

export const INCOME_CATEGORIES = [
  {
    key: 'salary',
    label: 'Salary',
    emoji: '💼',
    color: '#22C55E',
    tint: '#E8F9EE',
    group: 'income',
  },
  {
    key: 'freelance',
    label: 'Freelance',
    emoji: '💻',
    color: '#3B82F6',
    tint: '#E5F0FF',
    group: 'income',
  },
  {
    key: 'gift',
    label: 'Gift',
    emoji: '🎁',
    color: '#A855F7',
    tint: '#F5F0FF',
    group: 'income',
  },
  {
    key: 'other',
    label: 'Other',
    emoji: '➕',
    color: '#8E8E93',
    tint: '#F2F2F7',
    group: 'income',
  },
] as const satisfies readonly CategoryConfig[];

// ─────────────────────────────────────────────
// 4. COMBINED LIST
// ─────────────────────────────────────────────

export const CATEGORIES = [
  ...EXPENSE_CATEGORIES,
  ...INCOME_CATEGORIES,
] as const;

// ─────────────────────────────────────────────
// 5. LOOKUP HELPERS
// ─────────────────────────────────────────────

export const DEFAULT_CATEGORY: CategoryConfig = EXPENSE_CATEGORIES[0];

/** Get category config by key — falls back to "other" */
export function getCategoryConfig(key: CategoryType): CategoryConfig {
  const found = CATEGORIES.find(c => c.key === key);
  return (found ?? DEFAULT_CATEGORY) as CategoryConfig;
}

/** Get all expense categories */
export function getExpenseCategories(): readonly CategoryConfig[] {
  return EXPENSE_CATEGORIES;
}

/** Get all income categories */
export function getIncomeCategories(): readonly CategoryConfig[] {
  return INCOME_CATEGORIES;
}

// ─────────────────────────────────────────────
// 6. TYPES
// ─────────────────────────────────────────────

export type ExpenseCategoryKey = (typeof EXPENSE_CATEGORIES)[number]['key'];
export type IncomeCategoryKey = (typeof INCOME_CATEGORIES)[number]['key'];
