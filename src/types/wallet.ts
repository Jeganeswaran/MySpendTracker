/**
 * MySpendTracker — Wallet Types
 * -----------------------------
 */

export type WalletType = 'cash' | 'credit' | 'bank' | 'savings' | 'other';

export interface Wallet {
  id: string;
  type: WalletType;
  /** User-visible name e.g. "HDFC Savings" */
  name: string;
  /** Current balance */
  balance: number;
  /** Currency code */
  currency: string;
  /** Optional color */
  color?: string;
  /** Optional icon */
  icon?: string;
  /** Whether it's archived */
  archived?: boolean;
  /** Metadata */
  createdAt: string;
  updatedAt: string;
}
