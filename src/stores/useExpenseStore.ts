/**
 * MySpendTracker — Expense Store
 * ------------------------------
 * CRUD, filters, and derived queries for expenses.
 * Persisted to AsyncStorage.
 *
 * Convention: use barrel imports (`@utils`, `@app-types`) — not subpaths.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@constants';
import { generateId, getTodayISO, sum, getExpenseSummary } from '@utils';

import type {
  Expense,
  ExpenseFilters,
  ExpenseSummary,
  CategoryType,
} from '@app-types';

// ─────────────────────────────────────────────
// INPUT TYPES
// ─────────────────────────────────────────────

export type NewExpenseInput = Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateExpenseInput = Partial<
  Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>
>;

// ─────────────────────────────────────────────
// STORE INTERFACE
// ─────────────────────────────────────────────

interface ExpenseState {
  // — State —
  expenses: Expense[];
  filters: ExpenseFilters;
  isHydrated: boolean;

  // — CRUD —
  addExpense: (input: NewExpenseInput) => Expense;
  updateExpense: (id: string, updates: UpdateExpenseInput) => void;
  removeExpense: (id: string) => void;
  clearAllExpenses: () => void;

  // — Bulk —
  setExpenses: (expenses: Expense[]) => void;
  addManyExpenses: (inputs: NewExpenseInput[]) => void;

  // — Filters —
  setFilters: (filters: Partial<ExpenseFilters>) => void;
  resetFilters: () => void;

  // — Queries (read-only) —
  getById: (id: string) => Expense | undefined;
  getByDate: (date: string) => Expense[];
  getByCategory: (category: CategoryType) => Expense[];
  getByDateRange: (start: string, end: string) => Expense[];
  getTodayExpenses: () => Expense[];
  getThisMonthExpenses: () => Expense[];
  getFilteredExpenses: () => Expense[];

  // — Aggregations —
  getTotal: () => number;
  getTotalByCategory: (category: CategoryType) => number;
  getSummary: () => ExpenseSummary;

  // — Hydration —
  setHydrated: () => void;
}

// ─────────────────────────────────────────────
// DEFAULT FILTERS
// ─────────────────────────────────────────────

const DEFAULT_FILTERS: ExpenseFilters = {
  period: 'month',
  sortBy: 'date',
  sortOrder: 'desc',
};

// ─────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      // ─── Initial state ───
      expenses: [],
      filters: DEFAULT_FILTERS,
      isHydrated: false,

      // ─── CRUD ───
      addExpense: input => {
        const now = new Date().toISOString();
        const expense: Expense = {
          ...input,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };

        set(state => ({
          expenses: [expense, ...state.expenses],
        }));

        return expense;
      },

      updateExpense: (id, updates) =>
        set(state => ({
          expenses: state.expenses.map(e =>
            e.id === id
              ? { ...e, ...updates, updatedAt: new Date().toISOString() }
              : e,
          ),
        })),

      removeExpense: id =>
        set(state => ({
          expenses: state.expenses.filter(e => e.id !== id),
        })),

      clearAllExpenses: () => set({ expenses: [] }),

      // ─── Bulk ───
      setExpenses: expenses => set({ expenses }),

      addManyExpenses: inputs => {
        const now = new Date().toISOString();
        const newExpenses = inputs.map(input => ({
          ...input,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        }));

        set(state => ({
          expenses: [...newExpenses, ...state.expenses],
        }));
      },

      // ─── Filters ───
      setFilters: filters =>
        set(state => ({
          filters: { ...state.filters, ...filters },
        })),

      resetFilters: () => set({ filters: DEFAULT_FILTERS }),

      // ─── Queries ───
      getById: id => get().expenses.find(e => e.id === id),

      getByDate: date => get().expenses.filter(e => e.date === date),

      getByCategory: category =>
        get().expenses.filter(e => e.category === category),

      getByDateRange: (start, end) =>
        get().expenses.filter(e => e.date >= start && e.date <= end),

      getTodayExpenses: () => {
        const today = getTodayISO();
        return get().expenses.filter(e => e.date === today);
      },

      getThisMonthExpenses: () => {
        const now = new Date();
        const monthKey = `${now.getFullYear()}-${String(
          now.getMonth() + 1,
        ).padStart(2, '0')}`;
        return get().expenses.filter(e => e.date.startsWith(monthKey));
      },

      getFilteredExpenses: () => {
        const { expenses, filters } = get();
        let filtered = [...expenses];

        // Period filter
        if (filters.period === 'today') {
          const today = getTodayISO();
          filtered = filtered.filter(e => e.date === today);
        } else if (filters.period === 'week') {
          const now = new Date();
          const day = now.getDay();
          const diffToMon = (day + 6) % 7;
          const monday = new Date(now);
          monday.setDate(now.getDate() - diffToMon);
          const mondayISO = monday.toISOString().slice(0, 10);
          filtered = filtered.filter(e => e.date >= mondayISO);
        } else if (filters.period === 'month') {
          const now = new Date();
          const monthKey = `${now.getFullYear()}-${String(
            now.getMonth() + 1,
          ).padStart(2, '0')}`;
          filtered = filtered.filter(e => e.date.startsWith(monthKey));
        } else if (filters.period === 'year') {
          const year = String(new Date().getFullYear());
          filtered = filtered.filter(e => e.date.startsWith(year));
        } else if (
          filters.period === 'custom' &&
          filters.startDate &&
          filters.endDate
        ) {
          filtered = filtered.filter(
            e => e.date >= filters.startDate! && e.date <= filters.endDate!,
          );
        }

        // Category filter
        if (filters.categories && filters.categories.length > 0) {
          filtered = filtered.filter(e =>
            filters.categories!.includes(e.category),
          );
        }

        // Search filter
        if (filters.search) {
          const q = filters.search.toLowerCase();
          filtered = filtered.filter(
            e =>
              e.title.toLowerCase().includes(q) ||
              e.note?.toLowerCase().includes(q),
          );
        }

        // Amount range
        if (filters.minAmount !== undefined) {
          filtered = filtered.filter(e => e.amount >= filters.minAmount!);
        }
        if (filters.maxAmount !== undefined) {
          filtered = filtered.filter(e => e.amount <= filters.maxAmount!);
        }

        // Sort
        const sortBy = filters.sortBy ?? 'date';
        const order = filters.sortOrder ?? 'desc';
        filtered.sort((a, b) => {
          const av =
            sortBy === 'date'
              ? a.date
              : sortBy === 'amount'
              ? a.amount
              : a.title;
          const bv =
            sortBy === 'date'
              ? b.date
              : sortBy === 'amount'
              ? b.amount
              : b.title;
          if (av < bv) return order === 'asc' ? -1 : 1;
          if (av > bv) return order === 'asc' ? 1 : -1;
          return 0;
        });

        return filtered;
      },

      // ─── Aggregations ───
      getTotal: () => sum(get().expenses),

      getTotalByCategory: category => {
        const items = get().expenses.filter(e => e.category === category);
        return sum(items);
      },

      getSummary: () => getExpenseSummary(get().expenses),

      // ─── Hydration ───
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: STORAGE_KEYS.EXPENSES,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        expenses: state.expenses,
        filters: state.filters,
      }),
      onRehydrateStorage: () => state => {
        state?.setHydrated();
      },
    },
  ),
);

// ─────────────────────────────────────────────
// SELECTORS (optional, for perf)
// ─────────────────────────────────────────────

export const selectExpenseCount = (state: ExpenseState) =>
  state.expenses.length;
export const selectRecentExpenses = (state: ExpenseState, limit = 5) =>
  state.expenses.slice(0, limit);
