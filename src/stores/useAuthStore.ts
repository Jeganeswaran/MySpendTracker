/**
 * MySpendTracker — Auth Store
 * ---------------------------
 * User session, login/logout, and account state.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@constants';
import type { User, UserPreferences } from '@app-types/user';

// ─────────────────────────────────────────────
// DEFAULT PREFERENCES
// ─────────────────────────────────────────────

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  notifications: {
    budgetAlerts: true,
    billReminders: true,
    weeklySummary: true,
  },
  biometricLock: false,
  cloudSync: true,
  weekStartsOn: 1,
};

// ─────────────────────────────────────────────
// STORE INTERFACE
// ─────────────────────────────────────────────

interface AuthState {
  // — State —
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  // — Actions —
  login: (
    user: Omit<User, 'preferences' | 'isPro' | 'createdAt' | 'updatedAt'>,
  ) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  upgradeToPro: (expiresAt: string) => void;
  setHydrated: () => void;
}

// ─────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      // ─── Initial ───
      user: null,
      isAuthenticated: false,
      isHydrated: false,

      // ─── Login ───
      login: input => {
        const now = new Date().toISOString();
        const user: User = {
          ...input,
          isPro: false,
          preferences: DEFAULT_PREFERENCES,
          createdAt: now,
          updatedAt: now,
        };

        set({ user, isAuthenticated: true });
      },

      // ─── Logout ───
      logout: () => set({ user: null, isAuthenticated: false }),

      // ─── Update ───
      updateUser: updates =>
        set(state => ({
          user: state.user
            ? { ...state.user, ...updates, updatedAt: new Date().toISOString() }
            : null,
        })),

      updatePreferences: prefs =>
        set(state => ({
          user: state.user
            ? {
                ...state.user,
                preferences: { ...state.user.preferences, ...prefs },
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      upgradeToPro: expiresAt =>
        set(state => ({
          user: state.user
            ? {
                ...state.user,
                isPro: true,
                proExpiresAt: expiresAt,
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      // ─── Hydration ───
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: STORAGE_KEYS.AUTH,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => state => {
        state?.setHydrated();
      },
    },
  ),
);

// ─────────────────────────────────────────────
// SELECTORS
// ─────────────────────────────────────────────

export const selectUserName = (state: AuthState) => state.user?.name ?? 'Guest';
export const selectIsPro = (state: AuthState) => state.user?.isPro ?? false;
export const selectUserPreferences = (state: AuthState) =>
  state.user?.preferences ?? DEFAULT_PREFERENCES;
