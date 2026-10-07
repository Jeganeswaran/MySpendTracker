/**
 * MySpendTracker — Database Client (react-native-nitro-sqlite)
 * ------------------------------------------------------------
 * Singleton connection + init using Nitro SQLite (JSI-based).
 *
 * Requires React Native 0.75+ and the New Architecture.
 *
 * Public API (unchanged from react-native-sqlite-storage version):
 *   - getDB()           → opens + migrates, returns connection
 *   - queryAll<T>()     → SELECT many rows
 *   - queryOne<T>()     → SELECT one row (or null)
 *   - execute()         → INSERT / UPDATE / DELETE
 *   - withTransaction() → run a callback in a transaction
 *   - wipeDatabase()    → dev only
 *   - resetDatabase()   → dev only
 */

import {  open,  NitroSQLiteError,  type NitroSQLiteConnection,  type QueryResult,  type SQLiteValue } from 'react-native-nitro-sqlite';

import { DB_NAME } from './schema';
import { runMigrations, printMigrationStatus } from './migrations';

// ─────────────────────────────────────────────
// SINGLETON
// ─────────────────────────────────────────────

let db: NitroSQLiteConnection | null = null;
let initPromise: Promise<NitroSQLiteConnection> | null = null;

/**
 * Get the initialized database. Opens + migrates on first call.
 */
export async function getDB(): Promise<NitroSQLiteConnection> {
  if (db) return db;
  if (initPromise) return initPromise;

  initPromise = initDB();
  db = await initPromise;
  return db;
}

// ─────────────────────────────────────────────
// INIT + MIGRATE
// ─────────────────────────────────────────────

async function initDB(): Promise<NitroSQLiteConnection> {
  const database = open({ name: DB_NAME });

  // Enable foreign keys + WAL mode for performance
  database.execute('PRAGMA foreign_keys = ON;');
  database.execute('PRAGMA journal_mode = WAL;');

  // Run migrations
  const result = await runMigrations(database);

  if (__DEV__) {
    if (result.changed) {
      console.log(
        `[db] Migrated v${result.from} → v${result.to} (${result.applied.length} applied)`,
      );
    } else {
      console.log(`[db] Up to date at v${result.from}`);
    }
    await printMigrationStatus(database);
  }

  return database;
}

// ─────────────────────────────────────────────
// QUERY HELPERS
// ─────────────────────────────────────────────

/**
 * Run a SELECT and return all rows as plain objects.
 * Uses the async API so heavy queries don't block the JS thread.
 */
export async function queryAll<T>(
  sql: string,
  params: any[] = [],
): Promise<T[]> {
  const database = await getDB();
  const result = await database.executeAsync(sql, params);
  return (result.results ?? []) as T[];
}

/**
 * Run a SELECT and return the first row, or null.
 */
export async function queryOne<T>(
  sql: string,
  params: any[] = [],
): Promise<T | null> {
  const rows = await queryAll<T>(sql, params);
  return rows[0] ?? null;
}

/**
 * Run INSERT / UPDATE / DELETE.
 * Returns the raw QueryResult (has `results`, `rowsAffected`, `insertId`).
 */
export async function execute(
  sql: string,
  params: any[] = [],
): Promise<QueryResult> {
  const database = await getDB();
  return database.executeAsync(sql, params);
}

// ─────────────────────────────────────────────
// TRANSACTIONS
// ─────────────────────────────────────────────

/**
 * Run a callback inside a transaction. Rolls back on error.
 *
 * IMPORTANT: Nitro SQLite requires all DB work inside the callback to
 * use the passed `tx` object — do NOT call `db.executeAsync()` or
 * another queued operation on the same database inside the callback,
 * or you'll deadlock.
 *
 * The callback receives a `Transaction` with:
 *   - tx.execute(query, params?)      — sync
 *   - tx.executeAsync(query, params?) — async
 *   - tx.commit() / tx.rollback()     — explicit control
 */
export async function withTransaction<T>(
  callback: (tx: NitroSQLiteConnection) => Promise<T>,
): Promise<T> {
  const database = await getDB();

  let result: T | undefined;
  let callbackError: unknown;

  await database.transaction(async (tx) => {
    try {
      result = await callback(tx as unknown as NitroSQLiteConnection);
    } catch (err) {
      callbackError = err;
      throw err; // propagate so transaction rolls back
    }
  });

  if (callbackError) throw callbackError;
  return result as T;
}

// ─────────────────────────────────────────────
// DANGER ZONE (dev only)
// ─────────────────────────────────────────────

/**
 * Wipe all rows but keep the schema intact. DEV ONLY.
 */
export async function wipeDatabase(): Promise<void> {
  if (!__DEV__) throw new Error('wipeDatabase is dev-only');

  const database = await getDB();

  const { TABLES } = await import('./schema');

  await database.executeBatchAsync([
    { query: `DELETE FROM ${TABLES.EXPENSES}` },
    { query: `DELETE FROM ${TABLES.BUDGETS}` },
    { query: `DELETE FROM ${TABLES.GOALS}` },
    { query: `DELETE FROM ${TABLES.WALLETS}` },
    { query: `DELETE FROM ${TABLES.META}` },
  ]);
}

/**
 * Delete the DB file and recreate it fresh. DEV ONLY.
 *
 * Sequence: close current connection → delete file → reopen.
 */
export async function resetDatabase(): Promise<void> {
  if (!__DEV__) throw new Error('resetDatabase is dev-only');

  // Close + delete existing connection
  if (db) {
    try {
      db.close();
      db.delete();
    } catch (err) {
      console.warn('[db] Failed to close/delete DB:', err);
    }
    db = null;
    initPromise = null;
  } else {
    // No active connection — open one just to delete the file
    try {
      const temp = open({ name: DB_NAME });
      temp.delete();
    } catch {
      // Ignore — file may not exist
    }
  }

  // Reopen fresh
  await getDB();
}

// ─────────────────────────────────────────────
// ERROR HELPERS
// ─────────────────────────────────────────────

/**
 * True if the given error came from Nitro SQLite.
 */
export function isDBError(error: unknown): error is NitroSQLiteError {
  return error instanceof NitroSQLiteError;
}

// ─────────────────────────────────────────────
// RE-EXPORTS (convenience)
//   Consumers can import migration helpers from '@lib/db' (barrel)
//   without needing to know they live in './migrations'.
// ─────────────────────────────────────────────

export {
  getCurrentVersion,
  getLatestVersion,
  getMigrationStatus,
  printMigrationStatus,
  runMigrations,
  rollbackTo,
} from './migrations';

// Re-export nitro-sqlite types for consumers
export type { NitroSQLiteConnection, QueryResult, SQLiteValue };