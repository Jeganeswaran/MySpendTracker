import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@constants';
import { generateId } from '@utils/ids';
import { sum } from '@utils/calculations';

import type { Income } from '@app-types/income';
import type { IncomeCategoryType } from '@app-types/category';

export type NewIncomeInput = Omit<Income, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateIncomeInput = Partial<Omit<Income, 'id' | 'createdAt' | 'updatedAt'>>;

interface IncomeState {
  incomes: Income[];
  isHydrated: boolean;

  addIncome: (input: NewIncomeInput) => Income;
  updateIncome: (id: string, updates: UpdateIncomeInput) => void;
  removeIncome: (id: string) => void;
  clearAllIncomes: () => void;

  getById: (id: string) => Income | undefined;
  getThisMonthIncomes: () => Income[];
  getTotalByCategory: (category: IncomeCategoryType) => number;
  getTotal: () => number;

  setHydrated: () => void;
}

export const useIncomeStore = create<IncomeState>()(
  persist(
    (set, get) => ({
      incomes: [],
      isHydrated: false,

      addIncome: input => {
        const now = new Date().toISOString();
        const income: Income = {
          ...input,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };
        set(state => ({ incomes: [income, ...state.incomes] }));
        return income;
      },

      updateIncome: (id, updates) =>
        set(state => ({
          incomes: state.incomes.map(i =>
            i.id === id
              ? { ...i, ...updates, updatedAt: new Date().toISOString() }
              : i,
          ),
        })),

      removeIncome: id =>
        set(state => ({ incomes: state.incomes.filter(i => i.id !== id) })),

      clearAllIncomes: () => set({ incomes: [] }),

      getById: id => get().incomes.find(i => i.id === id),

      getThisMonthIncomes: () => {
        const now = new Date();
        const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        return get().incomes.filter(i => i.date.startsWith(monthKey));
      },

      getTotalByCategory: category => {
        const items = get().incomes.filter(i => i.category === category);
        return sum(items);
      },

      getTotal: () => sum(get().incomes),

      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: STORAGE_KEYS.INCOME,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({ incomes: state.incomes }),
      onRehydrateStorage: () => state => {
        state?.setHydrated();
      },
    },
  ),
);

export const selectIncomeCount = (state: IncomeState) => state.incomes.length;
