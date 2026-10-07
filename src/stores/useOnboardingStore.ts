/**
 * MySpendTracker — Onboarding Store
 * ---------------------------------
 * Tracks whether the user has seen the onboarding flow.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@constants';

interface OnboardingState {
  hasOnboarded: boolean;
  currentSlide: number;
  complete: () => void;
  reset: () => void;
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;
}

const TOTAL_SLIDES = 3;

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    set => ({
      hasOnboarded: false,
      currentSlide: 0,

      complete: () => set({ hasOnboarded: true, currentSlide: 0 }),

      reset: () => set({ hasOnboarded: false, currentSlide: 0 }),

      nextSlide: () =>
        set(state => ({
          currentSlide: Math.min(state.currentSlide + 1, TOTAL_SLIDES - 1),
        })),

      prevSlide: () =>
        set(state => ({
          currentSlide: Math.max(state.currentSlide - 1, 0),
        })),

      goToSlide: index =>
        set({
          currentSlide: Math.max(0, Math.min(index, TOTAL_SLIDES - 1)),
        }),
    }),
    {
      name: STORAGE_KEYS.HAS_ONBOARDED,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({ hasOnboarded: state.hasOnboarded }),
    },
  ),
);

export const ONBOARDING_TOTAL_SLIDES = TOTAL_SLIDES;
