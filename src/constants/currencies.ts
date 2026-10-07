/**
 * MySpendTracker — Currencies
 * ---------------------------
 * Common currencies with symbols. Extend as needed.
 */

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  /** Locale for Intl.NumberFormat */
  locale: string;
}

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', locale: 'de-CH' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', locale: 'ar-AE' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR' },
] as const satisfies readonly Currency[];

export const DEFAULT_CURRENCY: Currency = CURRENCIES[0];

export function getCurrency(code: string): Currency {
  return CURRENCIES.find(c => c.code === code) ?? DEFAULT_CURRENCY;
}
