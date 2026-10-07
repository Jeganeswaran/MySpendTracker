import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@constants';
import { generateId } from '@utils/ids';

import type { AppSettings, Account } from '@app-types/settings';

const DEFAULT_SETTINGS: AppSettings = {
  monthlyStartDay: 1,
  weeklyStartDay: 0,
  weeklyStartDayBehavior: 'day',
  periodType: 'monthly',
  carryOver: { enabled: false, income: false, expense: false },
  defaultRepeatInterval: 'none',
  language: 'en',
  accounts: [],
  disabledExpenseCategories: [],
  disabledIncomeCategories: [],
};

interface SettingsState extends AppSettings {
  isHydrated: boolean;

  updateSettings: (partial: Partial<AppSettings>) => void;

  addAccount: (input: Omit<Account, 'id' | 'createdAt'>) => Account;
  updateAccount: (id: string, updates: Partial<Omit<Account, 'id' | 'createdAt'>>) => void;
  removeAccount: (id: string) => void;

  toggleExpenseCategory: (key: string) => void;
  toggleIncomeCategory: (key: string) => void;

  setHydrated: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    set => ({
      ...DEFAULT_SETTINGS,
      isHydrated: false,

      updateSettings: partial =>
        set(state => ({ ...state, ...partial })),

      addAccount: input => {
        const account: Account = {
          ...input,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        set(state => ({ accounts: [...state.accounts, account] }));
        return account;
      },

      updateAccount: (id, updates) =>
        set(state => ({
          accounts: state.accounts.map(a =>
            a.id === id ? { ...a, ...updates } : a,
          ),
        })),

      removeAccount: id =>
        set(state => ({ accounts: state.accounts.filter(a => a.id !== id) })),

      toggleExpenseCategory: key =>
        set(state => ({
          disabledExpenseCategories: state.disabledExpenseCategories.includes(key)
            ? state.disabledExpenseCategories.filter(k => k !== key)
            : [...state.disabledExpenseCategories, key],
        })),

      toggleIncomeCategory: key =>
        set(state => ({
          disabledIncomeCategories: state.disabledIncomeCategories.includes(key)
            ? state.disabledIncomeCategories.filter(k => k !== key)
            : [...state.disabledIncomeCategories, key],
        })),

      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: STORAGE_KEYS.SETTINGS,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        monthlyStartDay: state.monthlyStartDay,
        weeklyStartDay: state.weeklyStartDay,
        weeklyStartDayBehavior: state.weeklyStartDayBehavior,
        periodType: state.periodType,
        carryOver: state.carryOver,
        defaultRepeatInterval: state.defaultRepeatInterval,
        language: state.language,
        accounts: state.accounts,
        disabledExpenseCategories: state.disabledExpenseCategories,
        disabledIncomeCategories: state.disabledIncomeCategories,
      }),
      onRehydrateStorage: () => state => {
        state?.setHydrated();
      },
    },
  ),
);
