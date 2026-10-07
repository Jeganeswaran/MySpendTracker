/**
 * MySpendTracker — Goal Queries
 * -----------------------------
 */

import { execute, queryAll, queryOne } from '../client';
import { TABLES } from '../schema';
import { generateId } from '@utils/ids';
import type { Goal } from '@app-types/goal';

// ─────────────────────────────────────────────
// MAPPING
// ─────────────────────────────────────────────

interface GoalRow {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline: string;
  icon: string | null;
  description: string | null;
  color: string | null;
  completed: number;
  created_at: string;
  updated_at: string;
}

function rowToGoal(row: GoalRow): Goal {
  return {
    id: row.id,
    title: row.title,
    target: row.target,
    current: row.current,
    deadline: row.deadline,
    icon: row.icon ?? '🎯',
    description: row.description ?? undefined,
    color: row.color ?? undefined,
    completed: Boolean(row.completed),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ─────────────────────────────────────────────
// CRUD
// ─────────────────────────────────────────────

export async function insertGoal(input: {
  title: string;
  target: number;
  deadline: string;
  icon?: string;
  description?: string;
  color?: string;
  startingAmount?: number;
}): Promise<Goal> {
  const now = new Date().toISOString();
  const goal: Goal = {
    id: generateId(),
    title: input.title,
    target: input.target,
    current: input.startingAmount ?? 0,
    deadline: input.deadline,
    icon: input.icon ?? '🎯',
    description: input.description,
    color: input.color,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };

  await execute(
    `INSERT INTO ${TABLES.GOALS}
      (id, title, target, current, deadline, icon, description, color, completed, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [goal.id,
    goal.title,
    goal.target,
    goal.current,
    goal.deadline,
    goal.icon,
    goal.description ?? null,
    goal.color ?? null,
    goal.completed ? 1 : 0,
    goal.createdAt,
    goal.updatedAt,]
  );

  return goal;
}

export async function getAllGoals(): Promise<Goal[]> {
  const rows = await queryAll<GoalRow>(
    `SELECT * FROM ${TABLES.GOALS} ORDER BY completed ASC, created_at DESC`,
  );
  return rows.map(rowToGoal);
}

export async function getGoalById(id: string): Promise<Goal | null> {
  const row = await queryOne<GoalRow>(
    `SELECT * FROM ${TABLES.GOALS} WHERE id = ?`,
    [id],
  );
  return row ? rowToGoal(row) : null;
}

export async function updateGoalCurrent(
  id: string,
  current: number,
): Promise<void> {
  const goal = await getGoalById(id);
  if (!goal) return;

  const completed = current >= goal.target;
  await execute(
    `UPDATE ${TABLES.GOALS} SET current = ?, completed = ?, updated_at = ? WHERE id = ?`,
    [current,
    completed ? 1 : 0,
    new Date().toISOString(),
    id,
  ]);
}

export async function updateGoal(
  id: string,
  updates: Partial<Goal>,
): Promise<void> {
  const now = new Date().toISOString();
  const fields: string[] = [];
  const values: any[] = [];

  if (updates.title !== undefined) {
    fields.push('title = ?');
    values.push(updates.title);
  }
  if (updates.target !== undefined) {
    fields.push('target = ?');
    values.push(updates.target);
  }
  if (updates.current !== undefined) {
    fields.push('current = ?');
    values.push(updates.current);
  }
  if (updates.deadline !== undefined) {
    fields.push('deadline = ?');
    values.push(updates.deadline);
  }
  if (updates.icon !== undefined) {
    fields.push('icon = ?');
    values.push(updates.icon);
  }
  if (updates.description !== undefined) {
    fields.push('description = ?');
    values.push(updates.description);
  }
  if (updates.color !== undefined) {
    fields.push('color = ?');
    values.push(updates.color);
  }
  if (updates.completed !== undefined) {
    fields.push('completed = ?');
    values.push(updates.completed ? 1 : 0);
  }

  fields.push('updated_at = ?');
  values.push(now);
  values.push(id);

  await execute(
    `UPDATE ${TABLES.GOALS} SET ${fields.join(', ')} WHERE id = ?`,
    ...values,
  );
}

export async function deleteGoal(id: string): Promise<void> {
  await execute(`DELETE FROM ${TABLES.GOALS} WHERE id = ?`, [id]);
}

export async function deleteAllGoals(): Promise<void> {
  await execute(`DELETE FROM ${TABLES.GOALS}`);
}
