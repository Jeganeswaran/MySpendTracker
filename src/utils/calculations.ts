/**
 * MySpendTracker — Calculations
 * -----------------------------
 * Pure functions for sums, averages, and groupings.
 */

import type { Expense, ExpenseSummary } from '@app-types/expense';
import type { Income, IncomeSummary } from '@app-types/income';
import type { Budget, BudgetSummary } from '@app-types/budget';
import type { CategoryType, IncomeCategoryType } from '@app-types/category';
import type { Goal, GoalProgress } from '@app-types/goal';
import { differenceInCalendarDays, parseISO } from 'date-fns';

// ─────────────────────────────────────────────
// 1. BASIC MATH
// ─────────────────────────────────────────────

export function sum(items: { amount: number }[]): number {
  return items.reduce((total, item) => total + item.amount, 0);
}

export function average(items: { amount: number }[]): number {
  if (items.length === 0) return 0;
  return sum(items) / items.length;
}

export function max(items: { amount: number }[]): number {
  if (items.length === 0) return 0;
  return Math.max(...items.map(i => i.amount));
}

export function min(items: { amount: number }[]): number {
  if (items.length === 0) return 0;
  return Math.min(...items.map(i => i.amount));
}

// ─────────────────────────────────────────────
// 2. CATEGORY GROUPING
// ─────────────────────────────────────────────

/**
 * Group items by category, summing amounts per category.
 */
export function groupByCategory<
  T extends { category: CategoryType; amount: number },
>(items: T[]): Record<string, number> {
  return items.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + item.amount;
    return acc;
  }, {});
}

/**
 * Get top N categories by amount.
 */
export function getTopCategories<
  T extends { category: CategoryType; amount: number },
>(
  items: T[],
  count = 4,
): { category: CategoryType; total: number; percent: number }[] {
  const grouped = groupByCategory(items);
  const total = sum(items);

  return Object.entries(grouped)
    .map(([category, categoryTotal]) => ({
      category: category as CategoryType,
      total: categoryTotal,
      percent: total > 0 ? (categoryTotal / total) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, count);
}

// ─────────────────────────────────────────────
// 3. SUMMARIES
// ─────────────────────────────────────────────

export function getExpenseSummary(expenses: Expense[]): ExpenseSummary {
  return {
    total: sum(expenses),
    count: expenses.length,
    average: average(expenses),
    byCategory: groupByCategory(expenses) as Record<CategoryType, number>,
    period: {
      start: expenses[0]?.date ?? '',
      end: expenses[expenses.length - 1]?.date ?? '',
    },
  };
}

export function getIncomeSummary(incomes: Income[]): IncomeSummary {
  return {
    total: sum(incomes),
    count: incomes.length,
    average: average(incomes),
    byCategory: groupByCategory(incomes) as Record<IncomeCategoryType, number>,
    period: {
      start: incomes[0]?.date ?? '',
      end: incomes[incomes.length - 1]?.date ?? '',
    },
  };
}

// ─────────────────────────────────────────────
// 4. BUDGET CALCULATIONS
// ─────────────────────────────────────────────

export function getBudgetProgress(budget: Budget): {
  remaining: number;
  percentUsed: number;
  overBudget: boolean;
} {
  const remaining = budget.limit - budget.spent;
  const percentUsed =
    budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;

  return {
    remaining,
    percentUsed: Math.min(100, Math.max(0, percentUsed)),
    overBudget: budget.spent > budget.limit,
  };
}

export function getBudgetSummary(budgets: Budget[]): BudgetSummary {
  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const remaining = totalLimit - totalSpent;
  const percentUsed = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;

  return {
    totalLimit,
    totalSpent,
    remaining,
    percentUsed: Math.min(100, Math.max(0, percentUsed)),
    overBudget: totalSpent > totalLimit,
    onTrack: totalSpent <= totalLimit * 0.9,
    budgets,
  };
}

// ─────────────────────────────────────────────
// 5. GOAL CALCULATIONS
// ─────────────────────────────────────────────

export function getGoalProgress(goal: Goal): GoalProgress {
  const percent = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
  const remaining = Math.max(0, goal.target - goal.current);
  const daysLeft = differenceInCalendarDays(
    parseISO(goal.deadline),
    new Date(),
  );

  let status: GoalProgress['status'] = 'on-track';
  if (percent >= 100) status = 'completed';
  else if (daysLeft < 0) status = 'behind';
  else {
    const totalDays = differenceInCalendarDays(
      parseISO(goal.deadline),
      parseISO(goal.createdAt),
    );
    const expectedPercent =
      totalDays > 0 ? ((totalDays - daysLeft) / totalDays) * 100 : 100;
    if (percent > expectedPercent + 10) status = 'ahead';
    else if (percent < expectedPercent - 10) status = 'behind';
  }

  return {
    percent: Math.min(100, Math.max(0, percent)),
    remaining,
    daysLeft,
    status,
  };
}

// ─────────────────────────────────────────────
// 6. PERCENTAGE / CHANGE
// ─────────────────────────────────────────────

/**
 * Percentage change from previous value to current.
 * @example
 *   percentChange(100, 112)  // → 12
 */
export function percentChange(previous: number, current: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

// ─────────────────────────────────────────────
// 7. WEEKLY / MONTHLY BREAKDOWN
// ─────────────────────────────────────────────

/**
 * Get daily totals for a given week (Mon–Sun).
 */
export function getWeeklyTotals(expenses: Expense[]): number[] {
  const totals = [0, 0, 0, 0, 0, 0, 0];
  for (const expense of expenses) {
    const day = (new Date(expense.date).getDay() + 6) % 7; // Mon = 0
    totals[day] += expense.amount;
  }
  return totals;
}
