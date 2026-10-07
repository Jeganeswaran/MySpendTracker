/**
 * MySpendTracker — Stores
 * -----------------------
 * Single entry point for all Zustand stores.
 *
 * Usage:
 *   import { useExpenseStore, useAuthStore } from '@stores';
 */

// Stores
export { useExpenseStore } from './useExpenseStore';
export { useBudgetStore } from './useBudgetStore';
export { useGoalStore } from './useGoalStore';
export { useAuthStore } from './useAuthStore';
export {
  useOnboardingStore,
  ONBOARDING_TOTAL_SLIDES,
} from './useOnboardingStore';
export { useThemeStore } from './useThemeStore';
export { useToastStore } from './useToastStore';
export { useIncomeStore } from './useIncomeStore';
export { useSettingsStore } from './useSettingsStore';

// Types
export type { NewExpenseInput, UpdateExpenseInput } from './useExpenseStore';
export type { NewBudgetInput } from './useBudgetStore';
export type { NewGoalInput } from './useGoalStore';
export type { ThemeMode } from './useThemeStore';
export type { ToastMessage, ToastVariant } from './useToastStore';
export type { NewIncomeInput, UpdateIncomeInput } from './useIncomeStore';

// Selectors
export { selectExpenseCount, selectRecentExpenses } from './useExpenseStore';
export {
  selectUserName,
  selectIsPro,
  selectUserPreferences,
} from './useAuthStore';
export { selectIncomeCount } from './useIncomeStore';
