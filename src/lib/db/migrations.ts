/**
 * MySpendTracker — Database Migrations
 * ------------------------------------
 * Versioned schema migrations for react-native-nitro-sqlite.
 *
 * Rules:
 *   - Migrations are immutable once shipped
 *   - Each runs inside its own transaction
 *   - Inside a transaction, use the passed `Transaction` object
 */

import type {
  NitroSQLiteConnection,
  Transaction,
} from 'react-native-nitro-sqlite';
import { TABLES } from './schema';

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface Migration {
  version: number;
  name: string;
  up: (tx: Transaction) => void;
  down?: (tx: Transaction) => void;
}

// ─────────────────────────────────────────────
// MIGRATION 1 — Initial schema
// ─────────────────────────────────────────────

const migration1_initialSchema: Migration = {
  version: 1,
  name: 'initial_schema',

  up: tx => {
    // ── expenses ──
    tx.execute(`
      CREATE TABLE IF NOT EXISTS ${TABLES.EXPENSES} (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        wallet TEXT,
        date TEXT NOT NULL,
        note TEXT,
        tags TEXT,
        recurring TEXT,
        sync_status TEXT DEFAULT 'pending',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);
    tx.execute(`
      CREATE INDEX IF NOT EXISTS idx_expenses_date
      ON ${TABLES.EXPENSES}(date DESC);
    `);
    tx.execute(`
      CREATE INDEX IF NOT EXISTS idx_expenses_category
      ON ${TABLES.EXPENSES}(category);
    `);

    // ── budgets ──
    tx.execute(`
      CREATE TABLE IF NOT EXISTS ${TABLES.BUDGETS} (
        id TEXT PRIMARY KEY NOT NULL,
        category TEXT NOT NULL,
        "limit" REAL NOT NULL,
        spent REAL DEFAULT 0,
        period TEXT NOT NULL DEFAULT 'monthly',
        month_key TEXT NOT NULL,
        start_date TEXT,
        end_date TEXT,
        alert_threshold REAL DEFAULT 0.8,
        alert_enabled INTEGER DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        UNIQUE(category, month_key)
      );
    `);
    tx.execute(`
      CREATE INDEX IF NOT EXISTS idx_budgets_month
      ON ${TABLES.BUDGETS}(month_key);
    `);

    // ── goals ──
    tx.execute(`
      CREATE TABLE IF NOT EXISTS ${TABLES.GOALS} (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        target REAL NOT NULL,
        current REAL DEFAULT 0,
        deadline TEXT NOT NULL,
        icon TEXT DEFAULT '🎯',
        description TEXT,
        color TEXT,
        completed INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // ── wallets ──
    tx.execute(`
      CREATE TABLE IF NOT EXISTS ${TABLES.WALLETS} (
        id TEXT PRIMARY KEY NOT NULL,
        type TEXT NOT NULL,
        name TEXT NOT NULL,
        balance REAL DEFAULT 0,
        currency TEXT DEFAULT 'USD',
        color TEXT,
        icon TEXT,
        archived INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // ── meta ──
    tx.execute(`
      CREATE TABLE IF NOT EXISTS ${TABLES.META} (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);
  },

  down: tx => {
    tx.execute(`DROP TABLE IF EXISTS ${TABLES.EXPENSES};`);
    tx.execute(`DROP TABLE IF EXISTS ${TABLES.BUDGETS};`);
    tx.execute(`DROP TABLE IF EXISTS ${TABLES.GOALS};`);
    tx.execute(`DROP TABLE IF EXISTS ${TABLES.WALLETS};`);
    tx.execute(`DROP TABLE IF EXISTS ${TABLES.META};`);
  },
};

// ─────────────────────────────────────────────
// REGISTRY
// ─────────────────────────────────────────────

export const MIGRATIONS: Migration[] = [migration1_initialSchema];

// ─────────────────────────────────────────────
// VERSION HELPERS
// ─────────────────────────────────────────────

export async function getCurrentVersion(
  db: NitroSQLiteConnection,
): Promise<number> {
  await db.executeAsync(`
    CREATE TABLE IF NOT EXISTS ${TABLES.META} (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  const result = await db.executeAsync(
    `SELECT value FROM ${TABLES.META} WHERE key = 'schema_version'`,
  );

  const rows = (result.results ?? []) as Array<{ value: string }>;
  if (rows.length === 0) return 0;
  return parseInt(rows[0].value, 10) || 0;
}

export async function setCurrentVersion(
  db: NitroSQLiteConnection,
  version: number,
): Promise<void> {
  await db.executeAsync(
    `INSERT OR REPLACE INTO ${TABLES.META} (key, value, updated_at)
     VALUES (?, ?, ?)`,
    ['schema_version', String(version), new Date().toISOString()],
  );
}

export function getLatestVersion(): number {
  if (MIGRATIONS.length === 0) return 0;
  return MIGRATIONS[MIGRATIONS.length - 1].version;
}

// ─────────────────────────────────────────────
// RUNNER
// ─────────────────────────────────────────────

export interface MigrationResult {
  from: number;
  to: number;
  applied: Migration[];
  changed: boolean;
}

export async function runMigrations(
  db: NitroSQLiteConnection,
): Promise<MigrationResult> {
  const from = await getCurrentVersion(db);
  const latest = getLatestVersion();

  if (from >= latest) {
    return { from, to: from, applied: [], changed: false };
  }

  const pending = MIGRATIONS.filter(m => m.version > from).sort(
    (a, b) => a.version - b.version,
  );

  const applied: Migration[] = [];

  for (const migration of pending) {
    const startedAt = Date.now();
    console.log(`[migrate] → v${migration.version} "${migration.name}" ...`);

    await db.transaction(async tx => {
      migration.up(tx);
    });

    await setCurrentVersion(db, migration.version);
    applied.push(migration);

    const elapsed = Date.now() - startedAt;
    console.log(`[migrate] ✓ v${migration.version} applied in ${elapsed}ms`);
  }

  return { from, to: latest, applied, changed: true };
}

// ─────────────────────────────────────────────
// ROLLBACK (DEV ONLY)
// ─────────────────────────────────────────────

export async function rollbackTo(
  db: NitroSQLiteConnection,
  targetVersion: number,
): Promise<void> {
  if (!__DEV__) throw new Error('rollbackTo is dev-only');

  const current = await getCurrentVersion(db);
  if (targetVersion >= current) return;

  const toRollback = MIGRATIONS.filter(
    m => m.version > targetVersion && m.version <= current,
  ).sort((a, b) => b.version - a.version);

  for (const migration of toRollback) {
    if (!migration.down) {
      console.warn(
        `[migrate] ✗ v${migration.version} has no down migration — skipping`,
      );
      continue;
    }

    console.log(`[migrate] ← rolling back v${migration.version} ...`);

    await db.transaction(async tx => {
      migration.down!(tx);
    });

    await setCurrentVersion(db, migration.version - 1);
    console.log(`[migrate] ✓ rolled back v${migration.version}`);
  }
}

export async function resetMigrations(
  db: NitroSQLiteConnection,
): Promise<void> {
  if (!__DEV__) throw new Error('resetMigrations is dev-only');

  console.log('[migrate] 🔥 Resetting all migrations');

  for (const migration of [...MIGRATIONS].reverse()) {
    if (migration.down) {
      try {
        await db.transaction(async tx => {
          migration.down!(tx);
        });
      } catch (err) {
        console.warn(`[migrate] Down failed for v${migration.version}:`, err);
      }
    }
  }

  await db.executeAsync(
    `DELETE FROM ${TABLES.META} WHERE key = 'schema_version'`,
  );

  await runMigrations(db);
}

// ─────────────────────────────────────────────
// DEBUG HELPERS
// ─────────────────────────────────────────────

export interface MigrationStatus {
  version: number;
  name: string;
  applied: boolean;
}

export async function getMigrationStatus(
  db: NitroSQLiteConnection,
): Promise<MigrationStatus[]> {
  const current = await getCurrentVersion(db);
  return MIGRATIONS.map(m => ({
    version: m.version,
    name: m.name,
    applied: m.version <= current,
  }));
}

export async function printMigrationStatus(
  db: NitroSQLiteConnection,
): Promise<void> {
  if (!__DEV__) return;

  const status = await getMigrationStatus(db);
  const current = await getCurrentVersion(db);
  const latest = getLatestVersion();

  console.log('\n[migrate] Migration status:');
  console.log('─'.repeat(50));
  for (const m of status) {
    const icon = m.applied ? '✓' : '○';
    const pad = m.version < 10 ? '  ' : ' ';
    console.log(`  ${icon}${pad}v${m.version}  ${m.name}`);
  }
  console.log('─'.repeat(50));
  console.log(`  Current: v${current}`);
  console.log(`  Latest:  v${latest}\n`);
}
