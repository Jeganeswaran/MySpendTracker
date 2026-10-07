/**
 * MySpendTracker — API Request / Response Types
 * ---------------------------------------------
 */

// ─────────────────────────────────────────────
// GENERIC WRAPPER
// ─────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
}

// ─────────────────────────────────────────────
// SYNC
// ─────────────────────────────────────────────

export interface SyncRequest {
  lastSyncedAt: string;
  changes: {
    expenses: unknown[];
    budgets: unknown[];
    goals: unknown[];
    wallets: unknown[];
  };
}

export interface SyncResponse {
  syncedAt: string;
  conflicts: SyncConflict[];
  serverChanges: {
    expenses: unknown[];
    budgets: unknown[];
    goals: unknown[];
    wallets: unknown[];
  };
}

export interface SyncConflict {
  id: string;
  entityType: 'expense' | 'budget' | 'goal' | 'wallet';
  localVersion: unknown;
  serverVersion: unknown;
  resolution: 'local' | 'server' | 'merge' | 'pending';
}