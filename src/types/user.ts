/**
 * MySpendTracker — User + Auth Types
 * ----------------------------------
 */

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  currency: string;
  /** Pro member flag */
  isPro: boolean;
  /** Pro expiry — ISO */
  proExpiresAt?: string;
  /** Preferences */
  preferences: UserPreferences;
  /** Metadata */
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  /** Theme mode */
  theme: 'system' | 'light' | 'dark';
  /** Notifications */
  notifications: {
    budgetAlerts: boolean;
    billReminders: boolean;
    weeklySummary: boolean;
  };
  /** Privacy */
  biometricLock: boolean;
  /** Sync */
  cloudSync: boolean;
  /** First day of week */
  weekStartsOn: 0 | 1;   // 0 = Sunday, 1 = Monday
}

// ─────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken?: string;
  expiresAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  name: string;
}

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';