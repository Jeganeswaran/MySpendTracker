/**
 * MySpendTracker Design System — Spacing Tokens
 * -------------------------------------
 * All padding, margin, gap, and inset values MUST come from here.
 * Never hardcode numbers like `padding: 16`.
 *
 * Scale: 4px base grid (multiples of 4)
 */

// ─────────────────────────────────────────────
// 1. SPACING INTERFACE
//    Single source of truth for shape validation.
// ─────────────────────────────────────────────

export interface SpacingTokens {
  /** 0px — no space */
  none: number;

  /** 2px — hairline gaps, tight icon padding */
  '3xs': number;

  /** 4px — icon-to-text, tiny gaps */
  '2xs': number;

  /** 6px — compact chip padding */
  xs: number;

  /** 8px — small gaps, list item padding */
  sm: number;

  /** 12px — standard gap between cards */
  md: number;

  /** 16px — page horizontal padding, card padding */
  lg: number;

  /** 20px — section spacing */
  xl: number;

  /** 24px — large section spacing */
  '2xl': number;

  /** 32px — screen-level padding, hero sections */
  '3xl': number;

  /** 40px — big separations */
  '4xl': number;

  /** 48px — screen top/bottom breathing room */
  '5xl': number;

  /** 64px — modal spacing, huge gaps */
  '6xl': number;

  /** 80px — hero padding */
  '7xl': number;
}

// ─────────────────────────────────────────────
// 2. SPACING SCALE
//    ✅ `as const satisfies SpacingTokens` → validates shape
//    AND preserves literal number types for autocomplete.
// ─────────────────────────────────────────────

export const Spacing = {
  none: 0,
  '3xs': 2,
  '2xs': 4,
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
  '7xl': 80,
} as const satisfies SpacingTokens;

// ─────────────────────────────────────────────
// 3. SEMANTIC SPACING ALIASES
//    Friendly names for specific layout roles.
// ─────────────────────────────────────────────

export interface SemanticSpacing {
  /** Page horizontal padding (screen edges) */
  screenPadding: number;

  /** Page vertical padding (top/bottom) */
  screenPaddingV: number;

  /** Card inner padding — standard */
  cardPadding: number;

  /** Card inner padding — compact */
  cardPaddingSm: number;

  /** Card inner padding — spacious (hero cards) */
  cardPaddingLg: number;

  /** Gap between cards in a grid/list */
  cardGap: number;

  /** Gap between bento grid items */
  gridGap: number;

  /** Gap between form fields */
  formGap: number;

  /** Section top margin (between major content blocks) */
  sectionGap: number;

  /** Section title bottom margin */
  sectionTitleGap: number;

  /** List item vertical padding */
  listItemPaddingV: number;

  /** List item horizontal padding */
  listItemPaddingH: number;

  /** Chip / tag padding — horizontal */
  chipPaddingH: number;

  /** Chip / tag padding — vertical */
  chipPaddingV: number;

  /** Button padding — horizontal */
  buttonPaddingH: number;

  /** Button padding — vertical */
  buttonPaddingV: number;

  /** Input padding — horizontal */
  inputPaddingH: number;

  /** Input padding — vertical */
  inputPaddingV: number;

  /** Nav bar padding — horizontal */
  navBarPaddingH: number;

  /** Nav bar padding — bottom (safe area offset) */
  navBarPaddingB: number;

  /** Modal padding */
  modalPadding: number;

  /** Bottom sheet padding */
  sheetPadding: number;

  /** Icon-to-text gap (small) */
  iconGap: number;

  /** Icon-to-text gap (medium) */
  iconGapMd: number;

  /** Avatar-to-text gap */
  avatarGap: number;

  /** Inline text spacing (chips row) */
  inlineGap: number;
}

export const SemanticSpacing = {
  // — Layout —
  screenPadding: Spacing.lg,           // 16
  screenPaddingV: Spacing.xl,          // 20
  sectionGap: Spacing['2xl'],          // 24
  sectionTitleGap: Spacing.md,         // 12
  gridGap: Spacing.md,                 // 12
  cardGap: Spacing.md,                 // 12
  formGap: Spacing.lg,                 // 16

  // — Cards —
  cardPadding: Spacing.lg,             // 16
  cardPaddingSm: Spacing.md,           // 12
  cardPaddingLg: Spacing.xl,           // 20

  // — Lists —
  listItemPaddingV: Spacing.lg,        // 16
  listItemPaddingH: Spacing.lg,        // 16

  // — Chips —
  chipPaddingH: Spacing.md,            // 12
  chipPaddingV: Spacing.xs,            // 6

  // — Buttons —
  buttonPaddingH: Spacing.xl,          // 20
  buttonPaddingV: Spacing.lg,          // 16

  // — Inputs —
  inputPaddingH: Spacing.lg,           // 16
  inputPaddingV: Spacing.md,           // 12

  // — Nav —
  navBarPaddingH: Spacing.xl,          // 20
  navBarPaddingB: Spacing['2xl'],      // 24

  // — Modals —
  modalPadding: Spacing.xl,            // 20
  sheetPadding: Spacing['2xl'],        // 24

  // — Gaps —
  iconGap: Spacing.xs,                 // 6
  iconGapMd: Spacing.md,               // 12
  avatarGap: Spacing.md,               // 12
  inlineGap: Spacing.sm,               // 8
} as const satisfies SemanticSpacing;

// ─────────────────────────────────────────────
// 4. INSET HELPERS
//    Pre-composed padding objects for common patterns.
// ─────────────────────────────────────────────

export interface SpacingPresets {
  screen: { paddingHorizontal: number };
  card: { padding: number };
  cardSm: { padding: number };
  cardLg: { padding: number };
  listItem: { paddingHorizontal: number; paddingVertical: number };
  chip: { paddingHorizontal: number; paddingVertical: number };
  button: { paddingHorizontal: number; paddingVertical: number };
  input: { paddingHorizontal: number; paddingVertical: number };
  navBar: { paddingHorizontal: number; paddingBottom: number };
  rowBetween: { flexDirection: 'row'; justifyContent: 'space-between'; alignItems: 'center' };
  rowCenter: { flexDirection: 'row'; alignItems: 'center' };
  columnCenter: { alignItems: 'center' };
}

export const SpacingPresets = {
  screen: { paddingHorizontal: Spacing.lg },
  card: { padding: Spacing.lg },
  cardSm: { padding: Spacing.md },
  cardLg: { padding: Spacing.xl },
  listItem: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg },
  chip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
  button: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg },
  input: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  navBar: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing['2xl'] },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  columnCenter: { alignItems: 'center' },
} as const satisfies SpacingPresets;

// ─────────────────────────────────────────────
// 5. GRID & LAYOUT CONSTANTS
// ─────────────────────────────────────────────

export const Layout = {
  /** Maximum content width (tablet / large screen clamp) */
  maxContentWidth: 480,

  /** Standard header height */
  headerHeight: 56,

  /** Bottom nav height (without safe area) */
  navBarHeight: 60,

  /** Bottom nav height including safe area (iOS) */
  navBarHeightSafe: 84,

  /** FAB diameter */
  fabSize: 56,

  /** Avatar sizes */
  avatarSm: 32,
  avatarMd: 40,
  avatarLg: 56,
  avatarXl: 72,

  /** Icon sizes */
  iconXs: 14,
  iconSm: 16,
  iconMd: 20,
  iconLg: 24,
  iconXl: 32,
  icon2xl: 40,

  /** Input / button heights */
  inputHeight: 52,
  buttonHeight: 52,
  buttonHeightSm: 40,

  /** Bento grid specific */
  bentoColumns: 2,
  bentoGap: 12,
} as const;

// ─────────────────────────────────────────────
// 6. TYPES EXPORT
// ─────────────────────────────────────────────

export type SpacingKey = keyof typeof Spacing;
export type SemanticSpacingKey = keyof typeof SemanticSpacing;
export type SpacingValue = (typeof Spacing)[SpacingKey];
export type LayoutKey = keyof typeof Layout;

// ─────────────────────────────────────────────
// 7. DEFAULT EXPORT
// ─────────────────────────────────────────────

export default Spacing;