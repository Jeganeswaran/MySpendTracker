/**
 * MySpendTracker — App Config
 * ---------------------------
 * Feature flags, API URLs, timeouts, and app-wide settings.
 */

import { Platform } from 'react-native';

// ─────────────────────────────────────────────
// 1. APP INFO
// ─────────────────────────────────────────────

export const APP_INFO = {
  name: 'MySpendTracker',
  version: '1.0.0',
  buildNumber: 1,
  bundleId: Platform.select({
    ios: 'com.myspendtracker',
    android: 'com.myspendtracker',
    default: 'com.myspendtracker',
  }) as string,
} as const;

// ─────────────────────────────────────────────
// 2. API / NETWORK
// ─────────────────────────────────────────────

export const API_CONFIG = {
  /** Base URL from .env — falls back to local dev */
  baseUrl: process.env.API_BASE_URL ?? 'http://localhost:3000',

  /** Request timeout in ms */
  timeout: 15000,

  /** Retry attempts on failure */
  maxRetries: 3,

  /** Backoff multiplier between retries */
  retryDelay: 1000,
} as const;

// ─────────────────────────────────────────────
// 3. CLOUD SYNC (Turso)
// ─────────────────────────────────────────────

export const SYNC_CONFIG = {
  enabled: true,

  /** Auto-sync interval in ms — 5 minutes */
  autoSyncInterval: 5 * 60 * 1000,

  /** Sync only over Wi-Fi (saves mobile data) */
  wifiOnly: false,

  /** Batch size for syncing records */
  batchSize: 100,
} as const;

// ─────────────────────────────────────────────
// 4. LOCAL EXPORT SERVER
// ─────────────────────────────────────────────

export const LOCAL_SERVER_CONFIG = {
  /** Default port for the local PC export server */
  port: 8080,

  /** Enable/disable the local export feature */
  enabled: true,

  /** Auto-shutdown after idle (ms) — 5 minutes */
  idleTimeout: 5 * 60 * 1000,
} as const;

// ─────────────────────────────────────────────
// 5. ADS
// ─────────────────────────────────────────────

export const ADS_CONFIG = {
  enabled: true,

  /** Use test IDs in development */
  useTestIds: __DEV__,

  testIds: {
    banner: 'ca-app-pub-3940256099942544/6300978111',
    interstitial: 'ca-app-pub-3940256099942544/1033173712',
    rewarded: 'ca-app-pub-3940256099942544/5224354917',
  },

  productionIds: {
    banner: process.env.ADMOB_BANNER_ID ?? '',
    interstitial: process.env.ADMOB_INTERSTITIAL_ID ?? '',
    rewarded: process.env.ADMOB_REWARDED_ID ?? '',
  },
} as const;

// ─────────────────────────────────────────────
// 6. FEATURE FLAGS
// ─────────────────────────────────────────────

export const FEATURES = {
  cloudSync: true,
  localExport: true,
  ads: true,
  reminders: true,
  multipleWallets: true,
  recurringTransactions: true,
  charts: true,
  biometricLock: false,
  darkMode: true,
} as const;

// ─────────────────────────────────────────────
// 7. PAGINATION
// ─────────────────────────────────────────────

export const PAGINATION = {
  /** Default page size for transaction lists */
  defaultLimit: 20,

  /** Max items to load per batch */
  maxLimit: 100,
} as const;

// ─────────────────────────────────────────────
// 8. VALIDATION
// ─────────────────────────────────────────────

export const VALIDATION = {
  /** Maximum expense amount */
  maxAmount: 1_000_000_000,

  /** Minimum expense amount */
  minAmount: 0.01,

  /** Max note length */
  maxNoteLength: 200,

  /** Max category name length */
  maxCategoryNameLength: 40,

  /** Min password length */
  minPasswordLength: 8,
} as const;

// ─────────────────────────────────────────────
// 9. TIMING
// ─────────────────────────────────────────────

export const TIMING = {
  /** Toast display duration */
  toastDuration: 2500,

  /** Debounce delay for search input */
  searchDebounce: 300,

  /** Animation duration for modals */
  modalAnimation: 300,

  /** Splash screen minimum duration */
  splashMinDuration: 1200,
} as const;
