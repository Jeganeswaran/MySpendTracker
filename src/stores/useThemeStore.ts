/**
 * Persisted theme mode: 'system' | 'light' | 'dark'
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeState {
  /** Current mode — 'system' follows the device */
  mode: ThemeMode;

  /** Set a specific mode */
  setMode: (mode: ThemeMode) => void;

  /** Toggle between light & dark (skips 'system') */
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system',

      setMode: (mode) => set({ mode }),

      toggleMode: () => {
        const current = get().mode;
        // If on 'system', pick the opposite of the current scheme
        // (Simplicity: default to 'dark' if currently light)
        const next: ThemeMode =
          current === 'light' ? 'dark' : current === 'dark' ? 'light' : 'dark';
        set({ mode: next });
      },
    }),
    {
      name: 'myspendtracker-theme',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useThemeStore;