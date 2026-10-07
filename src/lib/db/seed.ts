/**
 * MySpendTracker — Seed Data (DEV ONLY)
 * -------------------------------------
 * Populates the database with realistic demo data.
 * Only runs in dev builds; uses a meta flag to prevent re-seeding.
 *
 * Usage (from App.tsx in dev):
 *   if (__DEV__) await seedIfEmpty();
 */

import { queryOne, execute, getDB } from './client';
import { TABLES } from './schema';
import { insertManyExpenses, getExpensesCount } from './queries/expenses';
import { insertBudget, getBudgetsByMonth } from './queries/budgets';
import { insertGoal, getAllGoals } from './queries/goals';
import { formatMonthKey, formatDateISO } from '@utils';
import type { CategoryType } from '@app-types';

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const SEED_FLAG = 'seed_v1_applied';

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return formatDateISO(d);
}

// ─────────────────────────────────────────────
// MAIN ENTRY
// ─────────────────────────────────────────────

export interface SeedOptions {
  /** Force re-seed even if data already exists */
  force?: boolean;
}

/**
 * Seeds the database with demo data if empty (and not already seeded).
 * Returns true if data was inserted, false otherwise.
 */
export async function seedIfEmpty(options: SeedOptions = {}): Promise<boolean> {
  if (!__DEV__) {
    console.warn('[seed] Skipped — not a dev build');
    return false;
  }

  // Check seed flag first
  if (!options.force) {
    const flag = await queryOne<{ value: string }>(
      `SELECT value FROM ${TABLES.META} WHERE key = ?`,
      [SEED_FLAG],
    );
    if (flag?.value === 'true') {
      console.log('[seed] Already seeded — skipping');
      return false;
    }
  }

  // Check if there's already data
  const count = await getExpensesCount();
  if (count > 0 && !options.force) {
    console.log('[seed] Data exists — skipping');
    return false;
  }

  console.log('[seed] Seeding demo data...');

  await seedExpenses();
  await seedBudgets();
  await seedGoals();

  // Set the flag so we don't re-seed
  await execute(
    `INSERT OR REPLACE INTO ${TABLES.META} (key, value, updated_at) VALUES (?, ?, ?)`,
    [SEED_FLAG, 'true', new Date().toISOString()],
  );

  console.log('[seed] Done ✅');
  return true;
}

// ─────────────────────────────────────────────
// EXPENSES
// ─────────────────────────────────────────────

async function seedExpenses(): Promise<void> {
  const samples = [
    // Today
    {
      title: "McDonald's Lunch",
      amount: 12.5,
      category: 'food',
      daysAgo: 0,
      wallet: 'cash',
      note: 'Big Mac meal',
    },
    {
      title: 'Starbucks Latte',
      amount: 5.4,
      category: 'food',
      daysAgo: 0,
      wallet: 'credit',
    },
    {
      title: 'Uber ride home',
      amount: 18.2,
      category: 'transport',
      daysAgo: 0,
      wallet: 'credit',
    },
    {
      title: 'Groceries — Whole Foods',
      amount: 85.3,
      category: 'food',
      daysAgo: 0,
      wallet: 'credit',
      note: 'Weekly groceries',
    },

    // Yesterday
    {
      title: 'Netflix subscription',
      amount: 15.99,
      category: 'entertainment',
      daysAgo: 1,
      wallet: 'credit',
    },
    {
      title: 'Electricity bill',
      amount: 85.4,
      category: 'bills',
      daysAgo: 1,
      wallet: 'bank',
    },
    {
      title: 'Pharmacy — CVS',
      amount: 24.5,
      category: 'health',
      daysAgo: 1,
      wallet: 'cash',
    },

    // 2 days ago
    {
      title: 'Nike Sneakers',
      amount: 120.0,
      category: 'shopping',
      daysAgo: 2,
      wallet: 'credit',
      note: 'Sale purchase',
    },
    {
      title: 'Coffee beans',
      amount: 24.99,
      category: 'shopping',
      daysAgo: 2,
      wallet: 'credit',
    },
    {
      title: 'Gym membership',
      amount: 45.0,
      category: 'health',
      daysAgo: 2,
      wallet: 'credit',
    },

    // 3 days ago
    {
      title: 'Movie tickets',
      amount: 28.0,
      category: 'entertainment',
      daysAgo: 3,
      wallet: 'credit',
    },
    {
      title: 'Pizza delivery',
      amount: 32.4,
      category: 'food',
      daysAgo: 3,
      wallet: 'credit',
    },

    // 4 days ago
    {
      title: 'Gas station',
      amount: 52.3,
      category: 'transport',
      daysAgo: 4,
      wallet: 'credit',
    },

    // 5 days ago
    {
      title: 'Amazon order',
      amount: 67.8,
      category: 'shopping',
      daysAgo: 5,
      wallet: 'credit',
    },
    {
      title: 'Book — Clean Code',
      amount: 34.99,
      category: 'education',
      daysAgo: 5,
      wallet: 'credit',
    },

    // 1 week ago
    {
      title: 'Internet bill',
      amount: 69.99,
      category: 'bills',
      daysAgo: 7,
      wallet: 'bank',
    },
    {
      title: 'Groceries — Trader Joes',
      amount: 92.4,
      category: 'food',
      daysAgo: 7,
      wallet: 'credit',
    },

    // 2 weeks ago
    {
      title: 'Restaurant dinner',
      amount: 68.5,
      category: 'food',
      daysAgo: 14,
      wallet: 'credit',
    },
    {
      title: 'Haircut',
      amount: 35.0,
      category: 'other',
      daysAgo: 14,
      wallet: 'cash',
    },

    // 3 weeks ago
    {
      title: 'Spotify',
      amount: 10.99,
      category: 'entertainment',
      daysAgo: 21,
      wallet: 'credit',
    },
  ];

  const inputs = samples.map(s => ({
    title: s.title,
    amount: s.amount,
    category: s.category as CategoryType,
    wallet: s.wallet as any,
    date: daysAgo(s.daysAgo),
    note: s.note,
    syncStatus: 'synced' as const,
  }));

  await insertManyExpenses(inputs);
  console.log(`[seed] → ${inputs.length} expenses`);
}

// ─────────────────────────────────────────────
// BUDGETS
// ─────────────────────────────────────────────

async function seedBudgets(): Promise<void> {
  const monthKey = formatMonthKey(new Date());

  const samples = [
    { category: 'food' as CategoryType, limit: 600 },
    { category: 'transport' as CategoryType, limit: 300 },
    { category: 'shopping' as CategoryType, limit: 500 },
    { category: 'bills' as CategoryType, limit: 400 },
    { category: 'health' as CategoryType, limit: 200 },
    { category: 'entertainment' as CategoryType, limit: 150 },
  ];

  const existing = await getBudgetsByMonth(monthKey);
  if (existing.length > 0) {
    console.log('[seed] Budgets already exist — skipping');
    return;
  }

  for (const b of samples) {
    await insertBudget({
      category: b.category,
      limit: b.limit,
      monthKey,
    });
  }

  console.log(`[seed] → ${samples.length} budgets for ${monthKey}`);
}

// ─────────────────────────────────────────────
// GOALS
// ─────────────────────────────────────────────

async function seedGoals(): Promise<void> {
  const existing = await getAllGoals();
  if (existing.length > 0) {
    console.log('[seed] Goals already exist — skipping');
    return;
  }

  const samples = [
    {
      title: 'House by the Sea',
      target: 17500,
      startingAmount: 8750,
      deadline: formatDateISO(new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)),
      icon: '🏖️',
      description: 'Save up for a vacation home',
      color: '#3B82F6',
    },
    {
      title: 'Save for a Car',
      target: 15000,
      startingAmount: 2500,
      deadline: formatDateISO(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)),
      icon: '🚗',
      description: 'Down payment for a new car',
      color: '#EF4444',
    },
    {
      title: 'Emergency Fund',
      target: 10000,
      startingAmount: 6500,
      deadline: formatDateISO(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)),
      icon: '🛡️',
      description: '6 months of expenses',
      color: '#22C55E',
    },
    {
      title: 'Japan Trip 2027',
      target: 5000,
      startingAmount: 750,
      deadline: formatDateISO(new Date(Date.now() + 400 * 24 * 60 * 60 * 1000)),
      icon: '🗾',
      description: 'Two weeks in Tokyo + Kyoto',
      color: '#A855F7',
    },
  ];

  for (const g of samples) {
    await insertGoal(g);
  }

  console.log(`[seed] → ${samples.length} goals`);
}

// ─────────────────────────────────────────────
// RESET (dev only)
// ─────────────────────────────────────────────

/**
 * Wipe all data and re-seed from scratch.
 * Requires force: true internally — safe for dev only.
 */
export async function reseed(): Promise<void> {
  if (!__DEV__) throw new Error('reseed is dev-only');

  const db = await getDB();

  await db.executeSql(`
    DELETE FROM ${TABLES.EXPENSES};
    DELETE FROM ${TABLES.BUDGETS};
    DELETE FROM ${TABLES.GOALS};
    DELETE FROM ${TABLES.META};
  `);

  await seedIfEmpty({ force: true });
}
