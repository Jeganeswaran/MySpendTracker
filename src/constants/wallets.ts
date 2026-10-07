/**
 * MySpendTracker — Wallet Types
 * -----------------------------
 * Supports Cash, Credit Card, Bank, and custom wallets.
 */

// ─────────────────────────────────────────────
// 1. WALLET INTERFACE
// ─────────────────────────────────────────────

export type WalletType = 'cash' | 'credit' | 'bank' | 'savings' | 'other';

export interface WalletConfig {
  key: WalletType;
  label: string;
  emoji: string;
  color: string;
  tint: string;
}

// ─────────────────────────────────────────────
// 2. WALLET TYPES
// ─────────────────────────────────────────────

export const WALLET_TYPES = [
  {
    key: 'cash',
    label: 'Cash',
    emoji: '💵',
    color: '#22C55E',
    tint: '#E8F9EE',
  },
  {
    key: 'credit',
    label: 'Credit Card',
    emoji: '💳',
    color: '#A855F7',
    tint: '#F5F0FF',
  },
  {
    key: 'bank',
    label: 'Bank Account',
    emoji: '🏦',
    color: '#3B82F6',
    tint: '#E5F0FF',
  },
  {
    key: 'savings',
    label: 'Savings',
    emoji: '🎯',
    color: '#FACC15',
    tint: '#FFF9E0',
  },
  {
    key: 'other',
    label: 'Other',
    emoji: '📦',
    color: '#8E8E93',
    tint: '#F2F2F7',
  },
] as const satisfies readonly WalletConfig[];

// ─────────────────────────────────────────────
// 3. DEFAULT WALLET
// ─────────────────────────────────────────────

export const DEFAULT_WALLET: WalletConfig = WALLET_TYPES[0];

// ─────────────────────────────────────────────
// 4. LOOKUP
// ─────────────────────────────────────────────

export function getWalletConfig(key: WalletType): WalletConfig {
  const found = WALLET_TYPES.find(w => w.key === key);
  return (found ?? DEFAULT_WALLET) as WalletConfig;
}
