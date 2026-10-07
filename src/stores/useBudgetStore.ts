/**
 * MySpendTracker — Budget Store
 * -----------------------------
 * Per-category monthly budgets with spend tracking.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@constants';
import { generateId } from '@utils/ids';
import { formatMonthKey } from '@utils/formatDate';
import { getBudgetSummary } from '@utils/calculations';

import type { Budget, BudgetSummary, BudgetPeriod } from '@app-types/budget';
import type { CategoryType } from '@app-types/category';

// ─────────────────────────────────────────────
// INPUT
// ─────────────────────────────────────────────

export interface NewBudgetInput {
  category: CategoryType;
  limit: number;
  period?: BudgetPeriod;
  monthKey?: string;
  alertThreshold?: number;
  alertEnabled?: boolean;
}

// ─────────────────────────────────────────────
// STORE INTERFACE
// ─────────────────────────────────────────────

interface BudgetState {
  // — State —
  budgets: Budget[];
  isHydrated: boolean;

  // — CRUD —
  addBudget: (input: NewBudgetInput) => Budget;
  updateBudget: (id: string, updates: Partial<Budget>) => void;
  removeBudget: (id: string) => void;

  // — Spend Tracking —
  updateSpent: (
    category: CategoryType,
    monthKey: string,
    spent: number,
  ) => void;
  recalculateSpent: (
    expensesByCategory: Record<string, number>,
    monthKey?: string,
  ) => void;

  // — Queries —
  getById: (id: string) => Budget | undefined;
  getByCategory: (category: CategoryType) => Budget | undefined;
  getCurrentMonthBudgets: () => Budget[];
  getSummary: () => BudgetSummary;

  // — Helpers —
  clearAll: () => void;
  setHydrated: () => void;
}

// ─────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      // ─── Initial ───
      budgets: [],
      isHydrated: false,

      // ─── CRUD ───
      addBudget: input => {
        const now = new Date().toISOString();
        const monthKey = input.monthKey ?? formatMonthKey(new Date());

        // Check for duplicate category in the same month
        const existing = get().budgets.find(
          b => b.category === input.category && b.monthKey === monthKey,
        );
        if (existing) {
          throw new Error(
            `A budget for "${input.category}" already exists for ${monthKey}.`,
          );
        }

        const budget: Budget = {
          id: generateId(),
          category: input.category,
          limit: input.limit,
          spent: 0,
          period: input.period ?? 'monthly',
          monthKey,
          alertThreshold: input.alertThreshold ?? 0.8,
          alertEnabled: input.alertEnabled ?? true,
          createdAt: now,
          updatedAt: now,
        };

        set(state => ({ budgets: [...state.budgets, budget] }));
        return budget;
      },

      updateBudget: (id, updates) =>
        set(state => ({
          budgets: state.budgets.map(b =>
            b.id === id
              ? { ...b, ...updates, updatedAt: new Date().toISOString() }
              : b,
          ),
        })),

      removeBudget: id =>
        set(state => ({
          budgets: state.budgets.filter(b => b.id !== id),
        })),

      // ─── Spend Tracking ───
      updateSpent: (category, monthKey, spent) =>
        set(state => ({
          budgets: state.budgets.map(b =>
            b.category === category && b.monthKey === monthKey
              ? { ...b, spent, updatedAt: new Date().toISOString() }
              : b,
          ),
        })),

      recalculateSpent: (expensesByCategory, monthKey) => {
        const key = monthKey ?? formatMonthKey(new Date());
        set(state => ({
          budgets: state.budgets.map(b => {
            if (b.monthKey !== key) return b;
            const spent = expensesByCategory[b.category] ?? 0;
            return { ...b, spent, updatedAt: new Date().toISOString() };
          }),
        }));
      },

      // ─── Queries ───
      getById: id => get().budgets.find(b => b.id === id),

      getByCategory: category =>
        get().budgets.find(b => b.category === category),

      getCurrentMonthBudgets: () => {
        const monthKey = formatMonthKey(new Date());
        return get().budgets.filter(b => b.monthKey === monthKey);
      },

      getSummary: () => getBudgetSummary(get().getCurrentMonthBudgets()),

      // ─── Helpers ───
      clearAll: () => set({ budgets: [] }),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: STORAGE_KEYS.BUDGETS,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({ budgets: state.budgets }),
      onRehydrateStorage: () => state => {
        state?.setHydrated();
      },
    },
  ),
);
