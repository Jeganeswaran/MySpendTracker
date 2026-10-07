/**
 * MySpendTracker — Array Helpers
 * ------------------------------
 */

// ─────────────────────────────────────────────
// 1. GROUPING
// ─────────────────────────────────────────────

/**
 * Group an array by a key function.
 * @example
 *   groupBy(expenses, (e) => e.date)  // → { '2026-10-06': [...], ... }
 */
export function groupBy<T, K extends string | number>(
  items: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return items.reduce<Record<K, T[]>>((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

// ─────────────────────────────────────────────
// 2. UNIQUE
// ─────────────────────────────────────────────

export function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

export function uniqueBy<T, K>(items: T[], keyFn: (item: T) => K): T[] {
  const seen = new Set<K>();
  return items.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ─────────────────────────────────────────────
// 3. SORTING
// ─────────────────────────────────────────────

export function sortBy<T>(items: T[], keyFn: (item: T) => number, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...items].sort((a, b) => {
    const av = keyFn(a);
    const bv = keyFn(b);
    return order === 'asc' ? av - bv : bv - av;
  });
}

// ─────────────────────────────────────────────
// 4. CHUNKING
// ─────────────────────────────────────────────

export function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

// ─────────────────────────────────────────────
// 5. RANGE
// ─────────────────────────────────────────────

export function range(start: number, end: number): number[] {
  return Array.from({ length: end - start }, (_, i) => start + i);
}