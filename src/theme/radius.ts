/**
 * MySpendTracker Design System — Corner Radius Tokens
 * -------------------------------------------
 * All border radius values in the app MUST come from here.
 * Never hardcode numbers like `borderRadius: 16`.
 */

// ─────────────────────────────────────────────
// 1. RADIUS INTERFACE
//    Single source of truth for shape validation.
// ─────────────────────────────────────────────

export interface RadiusTokens {
  /** 4px — tiny pills, badge dots */
  xs: number;

  /** 6px — small tags, chart legends */
  sm: number;

  /** 10px — icon chips, tiny cards */
  md: number;

  /** 12px — segment controls, chips, icon badges */
  lg: number;

  /** 14px — inputs, small buttons */
  xl: number;

  /** 16px — standard cards, inputs (default) */
  '2xl': number;

  /** 20px — feature cards, modals */
  '3xl': number;

  /** 24px — hero cards, large modals */
  '4xl': number;

  /** 28px — full-width feature cards, sheets */
  '5xl': number;

  /** 44px — iPhone screen mockup / device frame */
  '6xl': number;

  /** 9999 — fully rounded (circles, pills) */
  full: number;

  /** 0 — sharp corners (dividers, hairlines) */
  none: number;
}

// ─────────────────────────────────────────────
// 2. RADIUS SCALE
//    ✅ `as const satisfies RadiusTokens` → validates shape
//    AND preserves literal number types for autocomplete.
// ─────────────────────────────────────────────

export const Radius = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 12,
  xl: 14,
  '2xl': 16,
  '3xl': 20,
  '4xl': 24,
  '5xl': 28,
  '6xl': 44,
  full: 9999,
  none: 0,
} as const satisfies RadiusTokens;

// ─────────────────────────────────────────────
// 3. SEMANTIC ALIASES
//    Friendly names for specific UI roles.
//    ✅ Same pattern — validated against its own interface.
// ─────────────────────────────────────────────

export interface SemanticRadius {
  /** Small inline elements: dots, tiny badges */
  badge: number;

  /** Tags, category chips, filter pills */
  chip: number;

  /** Text inputs, dropdown fields */
  input: number;

  /** Standard buttons */
  button: number;

  /** Primary buttons, FABs (large touch targets) */
  buttonLg: number;

  /** Small cards, list items */
  cardSm: number;

  /** Standard cards (balance card, transaction item) */
  card: number;

  /** Feature cards (goal card, pro banner) */
  cardLg: number;

  /** Hero cards (balance hero, monthly budget) */
  hero: number;

  /** Bottom sheets */
  sheet: number;

  /** Full-screen modals, device frames */
  modal: number;

  /** Fully rounded — avatars, FABs, toggles */
  pill: number;

  /** Circular — icon buttons, avatars */
  circle: number;
}

export const SemanticRadius = {
  badge: Radius.sm,        // 6
  chip: Radius.lg,         // 12
  input: Radius['2xl'],    // 16
  button: Radius.xl,       // 14
  buttonLg: Radius['2xl'], // 16
  cardSm: Radius['2xl'],   // 16
  card: Radius['3xl'],     // 20
  cardLg: Radius['4xl'],   // 24
  hero: Radius['4xl'],     // 24
  sheet: Radius['5xl'],    // 28
  modal: Radius['6xl'],    // 44
  pill: Radius.full,       // 9999
  circle: Radius.full,     // 9999
} as const satisfies SemanticRadius;

// ─────────────────────────────────────────────
// 4. COMPOSITE PRESETS (optional)
//    Ready-made radius objects for common components.
// ─────────────────────────────────────────────

export interface RadiusPresets {
  card: {
    borderRadius: number;
  };
  pill: {
    borderRadius: number;
  };
  circle: {
    borderRadius: number;
  };
  input: {
    borderRadius: number;
  };
  button: {
    borderRadius: number;
  };
}

export const RadiusPresets = {
  card: { borderRadius: Radius['3xl'] },     // 20px
  pill: { borderRadius: Radius.full },       // 9999
  circle: { borderRadius: Radius.full },     // 9999
  input: { borderRadius: Radius['2xl'] },    // 16px
  button: { borderRadius: Radius.xl },       // 14px
} as const satisfies RadiusPresets;

// ─────────────────────────────────────────────
// 5. TYPES EXPORT
// ─────────────────────────────────────────────

export type RadiusKey = keyof typeof Radius;
export type SemanticRadiusKey = keyof typeof SemanticRadius;
export type RadiusValue = (typeof Radius)[RadiusKey];

// ─────────────────────────────────────────────
// 6. DEFAULT EXPORT
// ─────────────────────────────────────────────

export default Radius;