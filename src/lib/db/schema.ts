/**
 * MySpendTracker — Database Schema Constants
 * ------------------------------------------
 * Defines table names + current version.
 * Actual migration logic lives in `migrations.ts`.
 */

// ─────────────────────────────────────────────
// CURRENT VERSION
//   Must match the highest migration version in `migrations.ts`.
//   When you add a new migration, bump this.
// ─────────────────────────────────────────────

export const DB_VERSION = 1;

export const DB_NAME = 'myspendtracker.db';

// ─────────────────────────────────────────────
// TABLE NAMES
// ─────────────────────────────────────────────

export const TABLES = {
  EXPENSES: 'expenses',
  BUDGETS: 'budgets',
  GOALS: 'goals',
  WALLETS: 'wallets',
  META: 'meta',
} as const;

export type TableName = (typeof TABLES)[keyof typeof TABLES];
