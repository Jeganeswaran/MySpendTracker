/**
 * MySpendTracker Design System — Shadow & Elevation Tokens
 * ------------------------------------------------
 * Unified shadow presets that work on both iOS and Android.
 *
 * iOS:      uses shadowColor, shadowOffset, shadowOpacity, shadowRadius
 * Android:  uses elevation (ignores the shadow* props)
 *
 * Every shadow in the app MUST come from here.
 */

import type { ViewStyle } from 'react-native';

// ─────────────────────────────────────────────
// 1. SHADOW INTERFACE
//    Single source of truth for shape validation.
// ─────────────────────────────────────────────

export interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number; // Android
}

export interface ShadowsTokens {
  /** No shadow — for flat elements, dividers */
  none: ShadowStyle;

  /** Subtle lift — table rows, list items */
  xs: ShadowStyle;

  /** Standard card shadow — matches iOS card feel */
  sm: ShadowStyle;

  /** Elevated card — popovers, floating cards */
  md: ShadowStyle;

  /** Modal shadow — bottom sheets, dialog boxes */
  lg: ShadowStyle;

  /** Hero shadow — modals, prominent overlays */
  xl: ShadowStyle;

  /** FAB / primary CTA — purple brand glow */
  brand: ShadowStyle;

  /** Purple glow (smaller) — active states, pills */
  brandSm: ShadowStyle;

  /** Purple glow (larger) — hero cards, FABs */
  brandLg: ShadowStyle;

  /** Success glow — positive confirmations */
  success: ShadowStyle;

  /** Danger glow — destructive actions */
  danger: ShadowStyle;

  /** Warning glow — alerts */
  warning: ShadowStyle;

  /** Inset top shadow — nav bars, sticky headers */
  topNav: ShadowStyle;

  /** Bottom sheet shadow — upward shadow */
  bottomSheet: ShadowStyle;
}

// ─────────────────────────────────────────────
// 2. SHADOW PALETTE (raw color values)
// ─────────────────────────────────────────────

export const ShadowColor = {
  black: '#000000',
  purple: '#A855F7',
  green: '#22C55E',
  red: '#EF4444',
  orange: '#FF8A3D',
  blue: '#3B82F6',
} as const;

// ─────────────────────────────────────────────
// 3. SHADOW SCALE
//    ✅ `as const satisfies ShadowsTokens` → validates shape
//    AND preserves literal types for autocomplete.
// ─────────────────────────────────────────────

export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  // — Neutral scale (matching iOS elevation conventions) —

  xs: {
    shadowColor: ShadowColor.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },

  sm: {
    shadowColor: ShadowColor.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  md: {
    shadowColor: ShadowColor.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },

  lg: {
    shadowColor: ShadowColor.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },

  xl: {
    shadowColor: ShadowColor.black,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 12,
  },

  // — Brand glows (purple) —

  brandSm: {
    shadowColor: ShadowColor.purple,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },

  brand: {
    shadowColor: ShadowColor.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },

  brandLg: {
    shadowColor: ShadowColor.purple,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 10,
  },

  // — Semantic glows —

  success: {
    shadowColor: ShadowColor.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },

  danger: {
    shadowColor: ShadowColor.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },

  warning: {
    shadowColor: ShadowColor.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },

  // — Directional —

  topNav: {
    shadowColor: ShadowColor.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },

  bottomSheet: {
    shadowColor: ShadowColor.black,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
} as const satisfies ShadowsTokens;

// ─────────────────────────────────────────────
// 4. SEMANTIC ALIASES
//    Friendly names for specific UI roles.
// ─────────────────────────────────────────────

export interface SemanticShadows {
  /** Table row, small list item */
  row: ShadowStyle;

  /** Standard card (transaction item, budget item) */
  card: ShadowStyle;

  /** Elevated card (goal card, hero card) */
  cardElevated: ShadowStyle;

  /** Bottom nav bar */
  navBar: ShadowStyle;

  /** Top sticky header */
  header: ShadowStyle;

  /** Floating action button (purple glow) */
  fab: ShadowStyle;

  /** Primary CTA button (purple glow) */
  buttonPrimary: ShadowStyle;

  /** Secondary button — subtle */
  buttonSecondary: ShadowStyle;

  /** Modal overlay content */
  modal: ShadowStyle;

  /** Bottom sheet */
  sheet: ShadowStyle;

  /** Toast / snackbar */
  toast: ShadowStyle;

  /** Dropdown / popover */
  popover: ShadowStyle;
}

export const SemanticShadows = {
  row: Shadows.xs,
  card: Shadows.sm,
  cardElevated: Shadows.md,
  navBar: Shadows.topNav,
  header: Shadows.topNav,
  fab: Shadows.brandLg,
  buttonPrimary: Shadows.brand,
  buttonSecondary: Shadows.sm,
  modal: Shadows.xl,
  sheet: Shadows.bottomSheet,
  toast: Shadows.lg,
  popover: Shadows.md,
} as const satisfies SemanticShadows;

// ─────────────────────────────────────────────
// 5. HELPER: Platform-aware shadow
//    Some Android versions render shadows oddly when combined with
//    borderWidth. This helper strips conflicting props if needed.
// ─────────────────────────────────────────────

import { Platform } from 'react-native';

/**
 * Returns a platform-appropriate shadow style.
 * On Android, only `elevation` matters — this strips iOS-only props.
 */
export function createShadow(shadow: ShadowStyle): ViewStyle {
  if (Platform.OS === 'android') {
    return { elevation: shadow.elevation };
  }
  return {
    shadowColor: shadow.shadowColor,
    shadowOffset: shadow.shadowOffset,
    shadowOpacity: shadow.shadowOpacity,
    shadowRadius: shadow.shadowRadius,
  };
}

// ─────────────────────────────────────────────
// 6. TYPES EXPORT
// ─────────────────────────────────────────────

export type ShadowKey = keyof typeof Shadows;
export type SemanticShadowKey = keyof typeof SemanticShadows;
export type ShadowValue = (typeof Shadows)[ShadowKey];

// ─────────────────────────────────────────────
// 7. DEFAULT EXPORT
// ─────────────────────────────────────────────

export default Shadows;