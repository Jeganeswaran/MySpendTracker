/**
 * MySpendTracker — Expense Queries
 * --------------------------------
 * Typed CRUD against the expenses table.
 */

import { execute, queryAll, queryOne, withTransaction } from '../client';
import { TABLES } from '../schema';
import { generateId } from '@utils/ids';
import type { Expense } from '@app-types/expense';
import type { CategoryType } from '@app-types/category';

// ─────────────────────────────────────────────
// ROW <-> ENTITY MAPPING
// ─────────────────────────────────────────────

interface ExpenseRow {
  id: string;
  title: string;
  amount: number;
  category: string;
  wallet: string | null;
  date: string;
  note: string | null;
  tags: string | null;
  recurring: string | null;
  sync_status: string | null;
  created_at: string;
  updated_at: string;
}

function rowToExpense(row: ExpenseRow): Expense {
  return {
    id: row.id,
    title: row.title,
    amount: row.amount,
    category: row.category as CategoryType,
    wallet: (row.wallet ?? undefined) as any,
    date: row.date,
    note: row.note ?? undefined,
    tags: row.tags ? JSON.parse(row.tags) : undefined,
    recurring: row.recurring ? JSON.parse(row.recurring) : undefined,
    syncStatus: (row.sync_status ?? undefined) as any,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ─────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────

export async function insertExpense(
  input: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Expense> {
  const now = new Date().toISOString();
  const expense: Expense = {
    ...input,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
    syncStatus: 'pending',
  };

  await execute(
    `INSERT INTO ${TABLES.EXPENSES}
      (id, title, amount, category, wallet, date, note, tags, recurring, sync_status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      expense.id,
      expense.title,
      expense.amount,
      expense.category,
      expense.wallet ?? null,
      expense.date,
      expense.note ?? null,
      expense.tags ? JSON.stringify(expense.tags) : null,
      expense.recurring ? JSON.stringify(expense.recurring) : null,
      expense.syncStatus ?? 'pending',
      expense.createdAt,
      expense.updatedAt,
    ],
  );

  return expense;
}

export async function insertManyExpenses(
  inputs: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>[],
): Promise<Expense[]> {
  return withTransaction(async () => {
    const results: Expense[] = [];
    for (const input of inputs) {
      const expense = await insertExpense(input);
      results.push(expense);
    }
    return results;
  });
}

// ─────────────────────────────────────────────
// READ
// ─────────────────────────────────────────────

export async function getAllExpenses(): Promise<Expense[]> {
  const rows = await queryAll<ExpenseRow>(
    `SELECT * FROM ${TABLES.EXPENSES} ORDER BY date DESC, created_at DESC`,
  );
  return rows.map(rowToExpense);
}

export async function getExpenseById(id: string): Promise<Expense | null> {
  const row = await queryOne<ExpenseRow>(
    `SELECT * FROM ${TABLES.EXPENSES} WHERE id = ?`,
    [id],
  );
  return row ? rowToExpense(row) : null;
}

export async function getExpensesByDate(date: string): Promise<Expense[]> {
  const rows = await queryAll<ExpenseRow>(
    `SELECT * FROM ${TABLES.EXPENSES} WHERE date = ? ORDER BY created_at DESC`,
    [date],
  );
  return rows.map(rowToExpense);
}

export async function getExpensesByCategory(
  category: CategoryType,
): Promise<Expense[]> {
  const rows = await queryAll<ExpenseRow>(
    `SELECT * FROM ${TABLES.EXPENSES} WHERE category = ? ORDER BY date DESC`,
    [category],
  );
  return rows.map(rowToExpense);
}

export async function getExpensesByMonth(monthKey: string): Promise<Expense[]> {
  const rows = await queryAll<ExpenseRow>(
    `SELECT * FROM ${TABLES.EXPENSES}
     WHERE date LIKE ?
     ORDER BY date DESC, created_at DESC`,
    [`${monthKey}%`],
  );
  return rows.map(rowToExpense);
}

export async function getExpensesBetween(
  startDate: string,
  endDate: string,
): Promise<Expense[]> {
  const rows = await queryAll<ExpenseRow>(
    `SELECT * FROM ${TABLES.EXPENSES}
     WHERE date >= ? AND date <= ?
     ORDER BY date DESC`,
    [startDate, endDate],
  );
  return rows.map(rowToExpense);
}

export async function searchExpenses(query: string): Promise<Expense[]> {
  const q = `%${query.toLowerCase()}%`;
  const rows = await queryAll<ExpenseRow>(
    `SELECT * FROM ${TABLES.EXPENSES}
     WHERE LOWER(title) LIKE ? OR LOWER(note) LIKE ?
     ORDER BY date DESC`,
    [q, q],
  );
  return rows.map(rowToExpense);
}

// ─────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────

export async function updateExpense(
  id: string,
  updates: Partial<Omit<Expense, 'id' | 'createdAt'>>,
): Promise<void> {
  const now = new Date().toISOString();
  const fields: string[] = [];
  const values: any[] = [];

  if (updates.title !== undefined) {
    fields.push('title = ?');
    values.push(updates.title);
  }
  if (updates.amount !== undefined) {
    fields.push('amount = ?');
    values.push(updates.amount);
  }
  if (updates.category !== undefined) {
    fields.push('category = ?');
    values.push(updates.category);
  }
  if (updates.wallet !== undefined) {
    fields.push('wallet = ?');
    values.push(updates.wallet);
  }
  if (updates.date !== undefined) {
    fields.push('date = ?');
    values.push(updates.date);
  }
  if (updates.note !== undefined) {
    fields.push('note = ?');
    values.push(updates.note);
  }
  if (updates.tags !== undefined) {
    fields.push('tags = ?');
    values.push(JSON.stringify(updates.tags));
  }
  if (updates.syncStatus !== undefined) {
    fields.push('sync_status = ?');
    values.push(updates.syncStatus);
  }

  fields.push('updated_at = ?');
  values.push(now);
  values.push(id);

  await execute(
    `UPDATE ${TABLES.EXPENSES} SET ${fields.join(', ')} WHERE id = ?`,
    values,
  );
}

// ─────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────

export async function deleteExpense(id: string): Promise<void> {
  await execute(`DELETE FROM ${TABLES.EXPENSES} WHERE id = ?`, [id]);
}

export async function deleteAllExpenses(): Promise<void> {
  await execute(`DELETE FROM ${TABLES.EXPENSES}`);
}

// ─────────────────────────────────────────────
// AGGREGATES
// ─────────────────────────────────────────────

export async function getTotalExpenses(): Promise<number> {
  const row = await queryOne<{ total: number }>(
    `SELECT COALESCE(SUM(amount), 0) as total FROM ${TABLES.EXPENSES}`,
  );
  return row?.total ?? 0;
}

export async function getTotalByCategory(
  category: CategoryType,
): Promise<number> {
  const row = await queryOne<{ total: number }>(
    `SELECT COALESCE(SUM(amount), 0) as total FROM ${TABLES.EXPENSES} WHERE category = ?`,
    [category],
  );
  return row?.total ?? 0;
}

export async function getExpensesCount(): Promise<number> {
  const row = await queryOne<{ count: number }>(
    `SELECT COUNT(*) as count FROM ${TABLES.EXPENSES}`,
  );
  return row?.count ?? 0;
}
