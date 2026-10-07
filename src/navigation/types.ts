/**
 * MySpendTracker — Navigation Param Lists
 * ---------------------------------------
 * Central registry of every screen + its params.
 * Use these types everywhere instead of `any`.
 */

import type { NavigatorScreenParams } from '@react-navigation/native';
import type { CategoryType } from '@app-types/category';

// ─────────────────────────────────────────────
// 1. ROOT STACK
// ─────────────────────────────────────────────

export type RootStackParamList = {
  // Auth flow
  Auth: NavigatorScreenParams<AuthStackParamList>;

  // Main app (tabs)
  Main: NavigatorScreenParams<MainTabParamList>;

  // Modals (rendered above tabs)
  AddExpense: { expenseId?: string; category?: CategoryType } | undefined;
  Search: undefined;
  Notifications: undefined;
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
  Budget: undefined;
  Settings: undefined;
};

// ─────────────────────────────────────────────
// 4. GLOBAL AUGMENTATION
//    Gives `useNavigation()` full autocomplete everywhere.
// ─────────────────────────────────────────────

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
