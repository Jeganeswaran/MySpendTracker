/**
 * MySpendTracker — ID Generation
 * ------------------------------
 * UUID helpers with fallback for older RN versions.
 */

// ─────────────────────────────────────────────
// 1. UUID v4
// ─────────────────────────────────────────────

/**
 * Generate a UUID v4 string.
 * Uses crypto.randomUUID() if available (RN 0.71+), else falls back
 * to a Math.random-based generator.
 */
export function generateId(): string {
  // Try native crypto
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  // Fallback — v4-like UUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ─────────────────────────────────────────────
// 2. SHORT ID
// ─────────────────────────────────────────────

/**
 * Short prefixed ID for local entities.
 * @example
 *   shortId('exp')  // → "exp_kx9f2a"
 */
export function shortId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${timestamp}${random}`;
}

// ─────────────────────────────────────────────
// 3. NUMBER ID (legacy compatibility)
// ─────────────────────────────────────────────

export function numericId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}
