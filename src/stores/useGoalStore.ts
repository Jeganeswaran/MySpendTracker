/**
 * MySpendTracker — Savings Goal Store
 * -----------------------------------
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@constants';
import { generateId } from '@utils/ids';
import { getGoalProgress } from '@utils/calculations';

import type { Goal, GoalProgress } from '@app-types/goal';

// ─────────────────────────────────────────────
// INPUT
// ─────────────────────────────────────────────

export interface NewGoalInput {
  title: string;
  target: number;
  deadline: string;
  icon?: string;
  description?: string;
  color?: string;
  startingAmount?: number;
}

// ─────────────────────────────────────────────
// STORE INTERFACE
// ─────────────────────────────────────────────

interface GoalState {
  // — State —
  goals: Goal[];
  isHydrated: boolean;

  // — CRUD —
  addGoal: (input: NewGoalInput) => Goal;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  removeGoal: (id: string) => void;

  // — Contributions —
  contribute: (id: string, amount: number) => void;
  withdraw: (id: string, amount: number) => void;

  // — Completion —
  markCompleted: (id: string) => void;
  reopenGoal: (id: string) => void;

  // — Queries —
  getById: (id: string) => Goal | undefined;
  getActiveGoals: () => Goal[];
  getCompletedGoals: () => Goal[];
  getProgress: (id: string) => GoalProgress | null;
  getTotalSaved: () => number;
  getTotalTarget: () => number;

  // — Helpers —
  clearAll: () => void;
  setHydrated: () => void;
}

// ─────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────

export const useGoalStore = create<GoalState>()(
  persist(
    (set, get) => ({
      // ─── Initial ───
      goals: [],
      isHydrated: false,

      // ─── CRUD ───
      addGoal: input => {
        const now = new Date().toISOString();
        const goal: Goal = {
          id: generateId(),
          title: input.title,
          target: input.target,
          current: input.startingAmount ?? 0,
          deadline: input.deadline,
          icon: input.icon ?? '🎯',
          description: input.description,
          color: input.color,
          completed: false,
          createdAt: now,
          updatedAt: now,
        };

        set(state => ({ goals: [...state.goals, goal] }));
        return goal;
      },

      updateGoal: (id, updates) =>
        set(state => ({
          goals: state.goals.map(g =>
            g.id === id
              ? { ...g, ...updates, updatedAt: new Date().toISOString() }
              : g,
          ),
        })),

      removeGoal: id =>
        set(state => ({
          goals: state.goals.filter(g => g.id !== id),
        })),

      // ─── Contributions ───
      contribute: (id, amount) =>
        set(state => ({
          goals: state.goals.map(g => {
            if (g.id !== id) return g;
            const newCurrent = Math.min(g.target, g.current + amount);
            return {
              ...g,
              current: newCurrent,
              completed: newCurrent >= g.target,
              updatedAt: new Date().toISOString(),
            };
          }),
        })),

      withdraw: (id, amount) =>
        set(state => ({
          goals: state.goals.map(g =>
            g.id === id
              ? {
                  ...g,
                  current: Math.max(0, g.current - amount),
                  completed: false,
                  updatedAt: new Date().toISOString(),
                }
              : g,
          ),
        })),

      // ─── Completion ───
      markCompleted: id =>
        set(state => ({
          goals: state.goals.map(g =>
            g.id === id ? { ...g, completed: true, current: g.target } : g,
          ),
        })),

      reopenGoal: id =>
        set(state => ({
          goals: state.goals.map(g =>
            g.id === id ? { ...g, completed: false } : g,
          ),
        })),

      // ─── Queries ───
      getById: id => get().goals.find(g => g.id === id),

      getActiveGoals: () => get().goals.filter(g => !g.completed),

      getCompletedGoals: () => get().goals.filter(g => g.completed),

      getProgress: id => {
        const goal = get().goals.find(g => g.id === id);
        return goal ? getGoalProgress(goal) : null;
      },

      getTotalSaved: () =>
        get().goals.reduce((total, g) => total + g.current, 0),

      getTotalTarget: () =>
        get().goals.reduce((total, g) => total + g.target, 0),

      // ─── Helpers ───
      clearAll: () => set({ goals: [] }),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: STORAGE_KEYS.GOALS,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({ goals: state.goals }),
      onRehydrateStorage: () => state => {
        state?.setHydrated();
      },
    },
  ),
);
