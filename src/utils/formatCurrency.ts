/**
 * MySpendTracker — Currency Formatting
 * ------------------------------------
 * Consistent money formatting across the app.
 */

import { DEFAULT_CURRENCY, getCurrency } from '@constants/currencies';

// ─────────────────────────────────────────────
// 1. BASIC FORMATTING
// ─────────────────────────────────────────────

/**
 * Format a number as currency.
 * Uses Intl.NumberFormat with the correct locale for the currency code.
 *
 * @example
 *   formatCurrency(12450.80)        // → "$12,450.80"
 *   formatCurrency(12450.80, 'INR') // → "₹12,450.80"
 *   formatCurrency(-85.5)           // → "-$85.50"
 */
export function formatCurrency(
  amount: number,
  currencyCode: string = DEFAULT_CURRENCY.code,
  options?: {
    showSymbol?: boolean;
    decimals?: number;
    compact?: boolean;
  },
): string {
  const { showSymbol = true, decimals = 2, compact = false } = options ?? {};
  const currency = getCurrency(currencyCode);

  try {
    return new Intl.NumberFormat(currency.locale, {
      style: showSymbol ? 'currency' : 'decimal',
      currency: currency.code,
      minimumFractionDigits: compact ? 0 : decimals,
      maximumFractionDigits: compact ? 0 : decimals,
      notation: compact ? 'compact' : 'standard',
    }).format(amount);
  } catch {
    // Fallback if Intl fails
    const sign = amount < 0 ? '-' : '';
    return `${sign}${currency.symbol}${Math.abs(amount).toFixed(decimals)}`;
  }
}

// ─────────────────────────────────────────────
// 2. COMPACT FORMATTING
// ─────────────────────────────────────────────

/**
 * Compact format for large amounts.
 * @example
 *   formatCompact(12450.80)   // → "$12.5K"
 *   formatCompact(1500000)    // → "$1.5M"
 */
export function formatCompact(
  amount: number,
  currencyCode: string = DEFAULT_CURRENCY.code,
): string {
  return formatCurrency(amount, currencyCode, { compact: true });
}

// ─────────────────────────────────────────────
// 3. SIGNED FORMATTING
// ─────────────────────────────────────────────

/**
 * Format with explicit +/- prefix.
 * @example
 *   formatSigned(12.5, 'expense')  // → "-$12.50"
 *   formatSigned(3200, 'income')   // → "+$3,200.00"
 */
export function formatSigned(
  amount: number,
  type: 'expense' | 'income',
  currencyCode: string = DEFAULT_CURRENCY.code,
): string {
  const prefix = type === 'income' ? '+' : '-';
  return `${prefix}${formatCurrency(Math.abs(amount), currencyCode)}`;
}

// ─────────────────────────────────────────────
// 4. PERCENTAGE FORMATTING
// ─────────────────────────────────────────────

/**
 * @example
 *   formatPercent(62.458)  // → "62.5%"
 *   formatPercent(0.625)   // → "62.5%" (if isDecimal)
 */
export function formatPercent(value: number, isDecimal = false): string {
  const pct = isDecimal ? value * 100 : value;
  return `${pct.toFixed(1)}%`;
}

// ─────────────────────────────────────────────
// 5. SYMBOL ONLY
// ─────────────────────────────────────────────

export function getCurrencySymbol(
  currencyCode: string = DEFAULT_CURRENCY.code,
): string {
  return getCurrency(currencyCode).symbol;
}

// ─────────────────────────────────────────────
// 6. PARSE INPUT
// ─────────────────────────────────────────────

/**
 * Parse a currency string back to number.
 * @example
 *   parseCurrency("$12,450.80")  // → 12450.8
 */
export function parseCurrency(input: string): number {
  const cleaned = input.replace(/[^0-9.-]/g, '');
  const value = parseFloat(cleaned);
  return Number.isNaN(value) ? 0 : value;
}
