import type { IncomeCategoryType } from './category';
import type { WalletType } from './wallet';
import type { RecurringRule, SyncStatus } from './expense';

export interface Income {
  id: string;
  title: string;
  amount: number;
  category: IncomeCategoryType;
  wallet?: WalletType;
  date: string;
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
  byCategory: Record<IncomeCategoryType, number>;
  period: {
    start: string;
    end: string;
  };
}
