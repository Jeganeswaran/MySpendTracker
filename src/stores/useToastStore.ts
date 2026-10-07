import { create } from 'zustand';
import { generateId } from '@utils/ids';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  variant: ToastVariant;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastState {
  toasts: ToastMessage[];
  show: (toast: Omit<ToastMessage, 'id'>) => string;
  dismiss: (id: string) => void;
  clear: () => void;
  // Convenience methods
  success: (message: string, title?: string) => string;
  error: (message: string, title?: string) => string;
  warning: (message: string, title?: string) => string;
  info: (message: string, title?: string) => string;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  show: toast => {
    const id = generateId();
    const duration = toast.duration ?? 2500;

    set(state => ({
      toasts: [...state.toasts, { ...toast, id, duration }],
    }));

    // Auto-dismiss
    if (duration > 0) {
      setTimeout(() => get().dismiss(id), duration);
    }

    return id;
  },

  dismiss: id =>
    set(state => ({
      toasts: state.toasts.filter(t => t.id !== id),
    })),

  clear: () => set({ toasts: [] }),

  success: (message, title) =>
    get().show({ variant: 'success', message, title }),

  error: (message, title) =>
    get().show({ variant: 'error', message, title, duration: 3500 }),

  warning: (message, title) =>
    get().show({ variant: 'warning', message, title, duration: 3000 }),

  info: (message, title) => get().show({ variant: 'info', message, title }),
}));
