/**
 * MySpendTracker — Environment Variable Types
 * -------------------------------------------
 * Declares types for process.env so TS knows about them.
 */

declare namespace NodeJS {
  interface ProcessEnv {
    /** Base URL for API server */
    API_BASE_URL?: string;

    /** Turso database URL */
    TURSO_DATABASE_URL?: string;

    /** Turso auth token */
    TURSO_AUTH_TOKEN?: string;

    /** AdMob IDs */
    ADMOB_ANDROID_APP_ID?: string;
    ADMOB_IOS_APP_ID?: string;
    ADMOB_BANNER_ID?: string;
    ADMOB_INTERSTITIAL_ID?: string;
    ADMOB_REWARDED_ID?: string;

    /** Node environment */
    NODE_ENV?: 'development' | 'production' | 'test';

    /** Public Expo env vars (must be prefixed with EXPO_PUBLIC_) */
    EXPO_PUBLIC_API_URL?: string;
    EXPO_PUBLIC_ENV?: 'development' | 'production';
  }
}

// ─────────────────────────────────────────────
// Global `__DEV__` (React Native)
// ─────────────────────────────────────────────

declare const __DEV__: boolean;