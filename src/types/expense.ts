/**
 * MySpendTracker — Expense Types
 * ------------------------------
 */

import type { CategoryType } from './category';
import type { WalletType } from './wallet';

export type { CategoryType } from './category';
export type { WalletType } from './wallet';

// ─────────────────────────────────────────────
// 1. EXPENSE ENTITY
// ─────────────────────────────────────────────

export interface Expense {
  /** UUID — primary key */
  id: string;

  /** Short description e.g. "McDonald's Lunch" */
  title: string;

  /** Positive number — always stored as positive */
  amount: number;

  /** Category key */
  category: CategoryType;

  /** Wallet used */
  wallet?: WalletType;

  /** ISO date — YYYY-MM-DD */
  date: string;

  /** Optional note */
  note?: string;

  /** Optional tags */
  tags?: string[];

  /** Recurring rule — if part of a recurring expense */
  recurring?: RecurringRule;

  /** Cloud sync metadata */
  syncStatus?: SyncStatus;

  /** Creation timestamp */
  createdAt: string;

  /** Last update timestamp */
  updatedAt: string;
}

// ─────────────────────────────────────────────
// 2. RECURRING RULE
// ─────────────────────────────────────────────

export type RecurringFrequency =
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'yearly';

export interface RecurringRule {
  /** Whether this expense repeats */
  enabled: boolean;

  /** How often */
  frequency: RecurringFrequency;

  /** Next due date — ISO */
  nextDueDate: string;

  /** Optional end date — ISO */
  endDate?: string;
}

// ─────────────────────────────────────────────
// 3. SYNC STATUS
// ─────────────────────────────────────────────

export type SyncStatus =
  | 'pending'
  | 'syncing'
  | 'synced'
  | 'failed'
  | 'conflict';

// ─────────────────────────────────────────────
// 4. FILTERS
// ─────────────────────────────────────────────

export type ExpensePeriod =
  | 'today'
  | 'week'
  | 'month'
  | 'year'
  | 'all'
  | 'custom';

export interface ExpenseFilters {
  /** Period */
  period?: ExpensePeriod;

  /** Custom date range */
  startDate?: string;
  endDate?: string;

  /** Filter by category */
  categories?: CategoryType[];

  /** Filter by wallet */
  wallets?: WalletType[];

  /** Amount range */
  minAmount?: number;
  maxAmount?: number;

  /** Search query */
  search?: string;

  /** Sort order */
  sortBy?: 'date' | 'amount' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// ─────────────────────────────────────────────
// 5. SUMMARY (for dashboard / analytics)
// ─────────────────────────────────────────────

export interface ExpenseSummary {
  total: number;
  count: number;
  average: number;
  byCategory: Record<CategoryType, number>;
  period: {
    start: string;
    end: string;
  };
}
