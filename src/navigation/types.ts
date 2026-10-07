import type { NavigatorScreenParams } from '@react-navigation/native';
import type { CategoryType } from '@app-types/category';

// ─────────────────────────────────────────────
// 1. ROOT STACK
// ─────────────────────────────────────────────

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;

  // Expense modals
  AddExpense: { expenseId?: string; category?: CategoryType } | undefined;
  Search: undefined;
  Notifications: undefined;

  // Income modal
  AddIncome: { incomeId?: string } | undefined;

  // Calendar
  Calendar: undefined;

  // Settings sub-screens
  TransactionSettings: undefined;
  RepeatSettings: undefined;
  IncomeCategories: undefined;
  ExpenseCategories: undefined;
  Accounts: undefined;
  Language: undefined;
};

// ─────────────────────────────────────────────
// 2. AUTH STACK
// ─────────────────────────────────────────────

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
};

// ─────────────────────────────────────────────
// 3. MAIN TABS
// ─────────────────────────────────────────────

export type MainTabParamList = {
  Home: undefined;
  Transactions: { filter?: string } | undefined;
  Analytics: undefined;
  Settings: undefined;
};

// ─────────────────────────────────────────────
// 4. GLOBAL AUGMENTATION
// ─────────────────────────────────────────────

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
