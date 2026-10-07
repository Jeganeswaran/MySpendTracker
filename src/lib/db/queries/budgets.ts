/**
 * MySpendTracker — Budget Queries
 * -------------------------------
 */

import { execute, queryAll, queryOne } from '../client';
import { TABLES } from '../schema';
import { generateId } from '@utils/ids';
import { formatMonthKey } from '@utils/formatDate';
import type { Budget } from '@app-types/budget';
import type { CategoryType } from '@app-types/category';

// ─────────────────────────────────────────────
// MAPPING
// ─────────────────────────────────────────────

interface BudgetRow {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: string;
  month_key: string;
  start_date: string | null;
  end_date: string | null;
  alert_threshold: number | null;
  alert_enabled: number | null;
  created_at: string;
  updated_at: string;
}

function rowToBudget(row: BudgetRow): Budget {
  return {
    id: row.id,
    category: row.category as CategoryType,
    limit: row.limit,
    spent: row.spent,
    period: row.period as any,
    monthKey: row.month_key,
    startDate: row.start_date ?? undefined,
    endDate: row.end_date ?? undefined,
    alertThreshold: row.alert_threshold ?? 0.8,
    alertEnabled: Boolean(row.alert_enabled),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ─────────────────────────────────────────────
// CRUD
// ─────────────────────────────────────────────

export async function insertBudget(input: {
  category: CategoryType;
  limit: number;
  period?: string;
  monthKey?: string;
  alertThreshold?: number;
  alertEnabled?: boolean;
}): Promise<Budget> {
  const now = new Date().toISOString();
  const budget: Budget = {
    id: generateId(),
    category: input.category,
    limit: input.limit,
    spent: 0,
    period: (input.period ?? 'monthly') as any,
    monthKey: input.monthKey ?? formatMonthKey(new Date()),
    alertThreshold: input.alertThreshold ?? 0.8,
    alertEnabled: input.alertEnabled ?? true,
    createdAt: now,
    updatedAt: now,
  };

  await execute(
    `INSERT INTO ${TABLES.BUDGETS}
      (id, category, "limit", spent, period, month_key, alert_threshold, alert_enabled, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      budget.id,
      budget.category,
      budget.limit,
      budget.spent,
      budget.period,
      budget.monthKey,
      budget.alertThreshold,
      budget.alertEnabled ? 1 : 0,
      budget.createdAt,
      budget.updatedAt,
    ],
  );

  return budget;
}

export async function getAllBudgets(): Promise<Budget[]> {
  const rows = await queryAll<BudgetRow>(
    `SELECT * FROM ${TABLES.BUDGETS} ORDER BY created_at DESC`,
  );
  return rows.map(rowToBudget);
}

export async function getBudgetsByMonth(monthKey: string): Promise<Budget[]> {
  const rows = await queryAll<BudgetRow>(
    `SELECT * FROM ${TABLES.BUDGETS} WHERE month_key = ?`,
    [monthKey],
  );
  return rows.map(rowToBudget);
}

export async function getBudgetByCategory(
  category: CategoryType,
  monthKey: string,
): Promise<Budget | null> {
  const row = await queryOne<BudgetRow>(
    `SELECT * FROM ${TABLES.BUDGETS} WHERE category = ? AND month_key = ?`,
    [category, monthKey],
  );
  return row ? rowToBudget(row) : null;
}

export async function updateBudgetSpent(
  category: CategoryType,
  monthKey: string,
  spent: number,
): Promise<void> {
  await execute(
    `UPDATE ${TABLES.BUDGETS} SET spent = ?, updated_at = ? WHERE category = ? AND month_key = ?`,
    [spent, new Date().toISOString(), category, monthKey],
  );
}

export async function updateBudget(
  id: string,
  updates: Partial<Budget>,
): Promise<void> {
  const now = new Date().toISOString();
  const fields: string[] = [];
  const values: any[] = [];

  if (updates.limit !== undefined) {
    fields.push('"limit" = ?');
    values.push(updates.limit);
  }
  if (updates.spent !== undefined) {
    fields.push('spent = ?');
    values.push(updates.spent);
  }
  if (updates.alertThreshold !== undefined) {
    fields.push('alert_threshold = ?');
    values.push(updates.alertThreshold);
  }
  if (updates.alertEnabled !== undefined) {
    fields.push('alert_enabled = ?');
    values.push(updates.alertEnabled ? 1 : 0);
  }

  fields.push('updated_at = ?');
  values.push(now);
  values.push(id);

  await execute(
    `UPDATE ${TABLES.BUDGETS} SET ${fields.join(', ')} WHERE id = ?`,
    ...values,
  );
}

export async function deleteBudget(id: string): Promise<void> {
  await execute(`DELETE FROM ${TABLES.BUDGETS} WHERE id = ?`, [id]);
}

export async function deleteAllBudgets(): Promise<void> {
  await execute(`DELETE FROM ${TABLES.BUDGETS}`);
}
