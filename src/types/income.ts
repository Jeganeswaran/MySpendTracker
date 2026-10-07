/**
 * MySpendTracker — Income Types
 * -----------------------------
 */

import type { CategoryType } from './category';
import type { WalletType } from './wallet';
import type { RecurringRule, SyncStatus } from './expense';

export interface Income {
  id: string;
  title: string;
  amount: number;      // positive
  category: CategoryType;
  wallet?: WalletType;
  date: string;        // ISO YYYY-MM-DD
  note?: string;
  tags?: string[];
  recurring?: RecurringRule;
  syncStatus?: SyncStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IncomeSummary {
  total: number;
  count: number;
  average: number;
  byCategory: Record<CategoryType, number>;
  period: {
    start: string;
    end: string;
  };
}