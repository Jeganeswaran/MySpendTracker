/**
 * src/hooks/useBootstrap.ts
 * -------------------------
 * Full app bootstrap with progress reporting:
 *   1. Init DB (runs migrations)
 *   2. Seed demo data (dev only)
 *   3. Hydrate Zustand stores from SQLite
 *   4. Attach write-through sync
 *   5. Hide native splash
 */

import { useEffect, useState } from 'react';
import BootSplash from 'react-native-bootsplash';

import { getDB } from '@lib/db/client';
import { getAllExpenses, getAllBudgets, getAllGoals } from '@lib/db/queries';
import { seedIfEmpty } from '@lib/db/seed';
import { attachSync } from '@lib/db/sync';

import { useExpenseStore } from '@stores/useExpenseStore';
import { useBudgetStore } from '@stores/useBudgetStore';
import { useGoalStore } from '@stores/useGoalStore';

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type BootstrapStep =
  | 'idle'
  | 'database'
  | 'seed'
  | 'hydrate'
  | 'sync'
  | 'ready'
  | 'error';

export interface BootstrapStatus {
  step: BootstrapStep;
  message: string;
  /** 0–100 */
  progress: number;
}

export interface BootstrapResult {
  ready: boolean;
  error: Error | null;
  status: BootstrapStatus;
}

// ─────────────────────────────────────────────
// STATUS MAP
// ─────────────────────────────────────────────

const STATUS_STEPS: Record<BootstrapStep, BootstrapStatus> = {
  idle: { step: 'idle', message: 'Starting up...', progress: 0 },
  database: {
    step: 'database',
    message: 'Initializing database...',
    progress: 20,
  },
  seed: {
    step: 'seed',
    message: 'Preparing your data...',
    progress: 45,
  },
  hydrate: {
    step: 'hydrate',
    message: 'Loading your expenses...',
    progress: 70,
  },
  sync: {
    step: 'sync',
    message: 'Syncing in the background...',
    progress: 90,
  },
  ready: { step: 'ready', message: 'Ready!', progress: 100 },
  error: {
    step: 'error',
    message: 'Something went wrong',
    progress: 0,
  },
};

// ─────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────

export function useBootstrap(): BootstrapResult {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<BootstrapStatus>(STATUS_STEPS.idle);

  useEffect(() => {
    let mounted = true;
    let detachSync: (() => void) | null = null;

    const setStep = (step: BootstrapStep) => {
      if (!mounted) return;
      setStatus(STATUS_STEPS[step]);
    };

    (async () => {
      try {
        console.log('[bootstrap] Starting...');

        // ─── 1. Init DB ───
        setStep('database');
        await getDB();
        console.log('[bootstrap] ✓ DB ready');
        if (!mounted) return;

        // ─── 2. Seed demo data (dev only) ───
        setStep('seed');
        await seedIfEmpty();
        console.log('[bootstrap] ✓ Seed check complete');
        if (!mounted) return;

        // ─── 3. Hydrate stores from SQLite ───
        setStep('hydrate');
        const [expenses, budgets, goals] = await Promise.all([
          getAllExpenses(),
          getAllBudgets(),
          getAllGoals(),
        ]);
        if (!mounted) return;

        useExpenseStore.setState({ expenses, isHydrated: true });
        useBudgetStore.setState({ budgets, isHydrated: true });
        useGoalStore.setState({ goals, isHydrated: true });

        console.log(
          `[bootstrap] ✓ Hydrated: ${expenses.length} expenses, ${budgets.length} budgets, ${goals.length} goals`,
        );

        // ─── 4. Attach write-through sync ───
        setStep('sync');
        detachSync = attachSync();
        console.log('[bootstrap] ✓ Sync attached');

        // ─── 5. Hide native splash ───
        setStep('ready');
        await BootSplash.hide({ fade: true });
        console.log('[bootstrap] ✓ Splash hidden');

        if (mounted) setReady(true);
      } catch (err) {
        console.error('[bootstrap] ✗ Failed:', err);
        if (mounted) {
          setError(err as Error);
          setStatus(STATUS_STEPS.error);
        }
      }
    })();

    return () => {
      mounted = false;
      detachSync?.();
    };
  }, []);

  return { ready, error, status };
}

export default useBootstrap;
