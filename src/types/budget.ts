/**
 * MySpendTracker — Budget Types
 * -----------------------------
 */

import type { CategoryType } from './category';

export type BudgetPeriod = 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface Budget {
  id: string;
  /** Category this budget applies to */
  category: CategoryType;
  /** Max amount allowed */
  limit: number;
  /** Amount already spent */
  spent: number;
  /** Budget period */
  period: BudgetPeriod;
  /** YYYY-MM for monthly budgets */
  monthKey: string;
  /** Custom date range — used when period is 'custom' */
  startDate?: string;
  endDate?: string;
  /** Alerts */
  alertThreshold?: number; // e.g. 0.8 = alert at 80%
  alertEnabled?: boolean;
  /** Metadata */
  createdAt: string;
  updatedAt: string;
}

export interface BudgetSummary {
  totalLimit: number;
  totalSpent: number;
  remaining: number;
  percentUsed: number;
  overBudget: boolean;
  onTrack: boolean;
  budgets: Budget[];
}
