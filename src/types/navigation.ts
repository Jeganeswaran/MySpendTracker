/**
 * MySpendTracker — Navigation Param Lists
 * ---------------------------------------
 * Types for expo-router / react-navigation.
 */

import type { CategoryType } from './category';

// ─────────────────────────────────────────────
// ROOT STACK
// ─────────────────────────────────────────────

export type RootStackParamList = {
  '(tabs)': undefined;
  'add-expense': { expenseId?: string; category?: CategoryType } | undefined;
  'search': undefined;
  'notifications': undefined;
  'login': undefined;
  'signup': undefined;
  'onboarding': undefined;
  '+not-found': undefined;
};

// ─────────────────────────────────────────────
// TAB NAVIGATOR
// ─────────────────────────────────────────────

export type TabParamList = {
  'index': undefined;                    // Home
  'transactions': { filter?: string } | undefined;
  'budget': undefined;
  'settings': undefined;
};

// ─────────────────────────────────────────────
// COMBINED (for useNavigation typing)
// ─────────────────────────────────────────────

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}