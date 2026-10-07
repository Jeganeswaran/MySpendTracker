/**
 * MySpendTracker — UI-only Types
 * ------------------------------
 * Toast, modal state, loading, etc.
 */

// ─────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  variant: ToastVariant;
  title?: string;
  message: string;
  duration?: number;
}

// ─────────────────────────────────────────────
// MODAL
// ─────────────────────────────────────────────

export type ModalName = 'add-expense' | 'search' | 'notifications' | 'delete-confirm' | 'goal-details';

export interface ModalState {
  name: ModalName;
  isOpen: boolean;
  data?: Record<string, unknown>;
}

// ─────────────────────────────────────────────
// LOADING
// ─────────────────────────────────────────────

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  status: LoadingState;
  error: string | null;
}

// ─────────────────────────────────────────────
// FORM
// ─────────────────────────────────────────────

export interface FormField<T = string> {
  value: T;
  error?: string;
  touched: boolean;
}