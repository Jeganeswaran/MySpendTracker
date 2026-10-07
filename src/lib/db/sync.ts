/**
 * MySpendTracker — Zustand ↔ SQLite Sync
 * --------------------------------------
 * Auto-write-through from Zustand stores to SQLite.
 *
 * Design:
 *   - Subscribes to store changes with Zustand's `.subscribe()`
 *   - Diffs prev vs. next state to detect add/update/delete
 *   - Fires DB writes in the background (fire-and-forget)
 *   - Skips the initial hydration load (snapshot, don't write back)
 *
 * Usage (from App.tsx after store hydration):
 *   const detach = attachSync();
 *   // Later, on cleanup: detach();
 */

import { useExpenseStore } from '@stores/useExpenseStore';
import { useBudgetStore } from '@stores/useBudgetStore';
import { useGoalStore } from '@stores/useGoalStore';

import {
  insertExpense,
  updateExpense,
  deleteExpense,
} from './queries/expenses';
import { insertBudget, updateBudget, deleteBudget } from './queries/budgets';
import { insertGoal, updateGoal, deleteGoal } from './queries/goals';

import type { Expense } from '@app-types/expense';
import type { Budget } from '@app-types/budget';
import type { Goal } from '@app-types/goal';

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const log = (msg: string, err?: unknown) => {
  if (__DEV__) {
    if (err) console.warn(`[sync] ${msg}`, err);
    else console.log(`[sync] ${msg}`);
  }
};

/**
 * Generic diff between two ID-indexed arrays.
 */
function diffById<T extends { id: string; updatedAt: string }>(
  prev: T[],
  next: T[],
): {
  added: T[];
  updated: T[];
  removed: string[];
} {
  const prevMap = new Map(prev.map(item => [item.id, item]));
  const nextMap = new Map(next.map(item => [item.id, item]));

  const added: T[] = [];
  const updated: T[] = [];
  const removed: string[] = [];

  for (const [id, item] of nextMap) {
    const prevItem = prevMap.get(id);
    if (!prevItem) {
      added.push(item);
    } else if (prevItem.updatedAt !== item.updatedAt) {
      updated.push(item);
    }
  }

  for (const id of prevMap.keys()) {
    if (!nextMap.has(id)) removed.push(id);
  }

  return { added, updated, removed };
}

// ─────────────────────────────────────────────
// EXPENSE SYNC
// ─────────────────────────────────────────────

export function attachExpenseSync(): () => void {
  const initial = useExpenseStore.getState();
  let previous: Expense[] = initial.expenses;
  let initialized = initial.isHydrated;

  const unsubscribe = useExpenseStore.subscribe(state => {
    // Wait until store is hydrated
    if (!state.isHydrated) return;

    // First hydrated state → snapshot only, don't write back
    if (!initialized) {
      previous = state.expenses;
      initialized = true;
      return;
    }

    const { added, updated, removed } = diffById(previous, state.expenses);

    // Persist in background — never block the UI
    for (const expense of added) {
      insertExpense(expense).catch(err =>
        log(`insert expense ${expense.id} failed`, err),
      );
    }

    for (const expense of updated) {
      updateExpense(expense.id, expense).catch(err =>
        log(`update expense ${expense.id} failed`, err),
      );
    }

    for (const id of removed) {
      deleteExpense(id).catch(err => log(`delete expense ${id} failed`, err));
    }

    if (__DEV__ && (added.length || updated.length || removed.length)) {
      log(`expenses: +${added.length} ~${updated.length} -${removed.length}`);
    }

    previous = state.expenses;
  });

  return unsubscribe;
}

// ─────────────────────────────────────────────
// BUDGET SYNC
// ─────────────────────────────────────────────

export function attachBudgetSync(): () => void {
  const initial = useBudgetStore.getState();
  let previous: Budget[] = initial.budgets;
  let initialized = initial.isHydrated;

  const unsubscribe = useBudgetStore.subscribe(state => {
    if (!state.isHydrated) return;

    if (!initialized) {
      previous = state.budgets;
      initialized = true;
      return;
    }

    const { added, updated, removed } = diffById(previous, state.budgets);

    for (const budget of added) {
      insertBudget({
        category: budget.category,
        limit: budget.limit,
        period: budget.period,
        monthKey: budget.monthKey,
        alertThreshold: budget.alertThreshold,
        alertEnabled: budget.alertEnabled,
      }).catch(err => log(`insert budget ${budget.id} failed`, err));
    }

    for (const budget of updated) {
      updateBudget(budget.id, budget).catch(err =>
        log(`update budget ${budget.id} failed`, err),
      );
    }

    for (const id of removed) {
      deleteBudget(id).catch(err => log(`delete budget ${id} failed`, err));
    }

    previous = state.budgets;
  });

  return unsubscribe;
}

// ─────────────────────────────────────────────
// GOAL SYNC
// ─────────────────────────────────────────────

export function attachGoalSync(): () => void {
  const initial = useGoalStore.getState();
  let previous: Goal[] = initial.goals;
  let initialized = initial.isHydrated;

  const unsubscribe = useGoalStore.subscribe(state => {
    if (!state.isHydrated) return;

    if (!initialized) {
      previous = state.goals;
      initialized = true;
      return;
    }

    const { added, updated, removed } = diffById(previous, state.goals);

    for (const goal of added) {
      insertGoal({
        title: goal.title,
        target: goal.target,
        deadline: goal.deadline,
        icon: goal.icon,
        description: goal.description,
        color: goal.color,
        startingAmount: goal.current,
      }).catch(err => log(`insert goal ${goal.id} failed`, err));
    }

    for (const goal of updated) {
      updateGoal(goal.id, goal).catch(err =>
        log(`update goal ${goal.id} failed`, err),
      );
    }

    for (const id of removed) {
      deleteGoal(id).catch(err => log(`delete goal ${id} failed`, err));
    }

    previous = state.goals;
  });

  return unsubscribe;
}

// ─────────────────────────────────────────────
// COMBINED
// ─────────────────────────────────────────────

/**
 * Attach all store syncs. Returns a single cleanup function.
 *
 * @example
 *   const detach = attachSync();
 *   // Later
 *   detach();
 */
export function attachSync(): () => void {
  const detachExpenses = attachExpenseSync();
  const detachBudgets = attachBudgetSync();
  const detachGoals = attachGoalSync();

  return () => {
    detachExpenses();
    detachBudgets();
    detachGoals();
  };
}
