/**
 * MySpendTracker — Route Names
 * ----------------------------
 * Central registry for expo-router route paths.
 * Always use these instead of hardcoded strings.
 */

export const ROUTES = {
  // Tabs
  TABS: {
    HOME: '/(tabs)',
    TRANSACTIONS: '/(tabs)/transactions',
    BUDGET: '/(tabs)/budget',
    SETTINGS: '/(tabs)/settings',
  },

  // Auth
  AUTH: {
    LOGIN: '/login',
    SIGNUP: '/signup',
    ONBOARDING: '/onboarding',
  },

  // Modals
  MODALS: {
    ADD_EXPENSE: '/add-expense',
    SEARCH: '/search',
    NOTIFICATIONS: '/notifications',
  },

  // Other
  NOT_FOUND: '/+not-found',
} as const;

// ─────────────────────────────────────────────
// Type helpers
// ─────────────────────────────────────────────

export type AppRoute =
  | (typeof ROUTES.TABS)[keyof typeof ROUTES.TABS]
  | (typeof ROUTES.AUTH)[keyof typeof ROUTES.AUTH]
  | (typeof ROUTES.MODALS)[keyof typeof ROUTES.MODALS];

export const TAB_BAR_ROUTES = [
  ROUTES.TABS.HOME,
  ROUTES.TABS.TRANSACTIONS,
  ROUTES.TABS.BUDGET,
  ROUTES.TABS.SETTINGS,
] as const;
