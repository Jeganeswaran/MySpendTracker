export type AccountType =
  | 'cash'
  | 'debit_card'
  | 'credit_card'
  | 'bank_account'
  | 'loan'
  | 'other';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  group?: string;
  balance: number;
  currency: string;
  color?: string;
  icon?: string;
  archived: boolean;
  createdAt: string;
}

export type RepeatInterval = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export type WeeklyStartDayBehavior = 'day' | 'previousFriday' | 'previousWeekday';

export interface AppSettings {
  monthlyStartDay: number;
  weeklyStartDay: number;
  weeklyStartDayBehavior: WeeklyStartDayBehavior;
  periodType: 'monthly' | 'weekly';
  carryOver: {
    enabled: boolean;
    income: boolean;
    expense: boolean;
  };
  defaultRepeatInterval: RepeatInterval;
  language: string;
  accounts: Account[];
  disabledExpenseCategories: string[];
  disabledIncomeCategories: string[];
}
