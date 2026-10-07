/**
 * MySpendTracker Design System — Typography Tokens
 * ----------------------------------------
 * All text styles in the app MUST come from here.
 * Never hardcode fontSize / fontWeight in components.
 *
 * Font family: Inclusive Sans (10 variants)
 * Fallback:    System font (SF Pro on iOS, Roboto on Android)
 */

import { Platform, TextStyle } from 'react-native';

// ─────────────────────────────────────────────
// 1. FONT FAMILIES
//    Reference names match the .ttf filenames (postscript name).
// ─────────────────────────────────────────────

export interface FontFamilies {
  /** 300 — light body text */
  light: string;

  /** 300 italic */
  lightItalic: string;

  /** 400 — regular body text (default) */
  regular: string;

  /** 400 italic */
  italic: string;

  /** 500 — subtle emphasis, UI text */
  medium: string;

  /** 500 italic */
  mediumItalic: string;

  /** 600 — card titles, labels */
  semibold: string;

  /** 600 italic */
  semiboldItalic: string;

  /** 700 — headings, numbers */
  bold: string;

  /** 700 italic */
  boldItalic: string;

  /**
   * Alias for `bold` — Inclusive Sans has no ExtraBold weight.
   * Kept for API compatibility with tokens that expect extrabold.
   */
  extrabold: string;

  /** Monospace — numeric data, code snippets */
  mono: string;
}

/**
 * Inclusive Sans is registered identically on both iOS and Android
 * (postscript name = filename without extension).
 * No platform branching needed — unlike Inter.
 */
export const FontFamily = {
  light: 'InclusiveSans-Light',
  lightItalic: 'InclusiveSans-LightItalic',
  regular: 'InclusiveSans-Regular',
  italic: 'InclusiveSans-Italic',
  medium: 'InclusiveSans-Medium',
  mediumItalic: 'InclusiveSans-MediumItalic',
  semibold: 'InclusiveSans-SemiBold',
  semiboldItalic: 'InclusiveSans-SemiBoldItalic',
  bold: 'InclusiveSans-Bold',
  boldItalic: 'InclusiveSans-BoldItalic',

  // Alias — mapped to Bold since no ExtraBold exists
  extrabold: 'InclusiveSans-Bold',

  // Monospace (system fallback)
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }) as string,
} as const satisfies FontFamilies;

// ─────────────────────────────────────────────
// 2. FONT WEIGHTS
//    Used for web fallback only.
//    On native, weight is baked into the font file.
// ─────────────────────────────────────────────

export interface FontWeights {
  light: TextStyle['fontWeight'];
  regular: TextStyle['fontWeight'];
  medium: TextStyle['fontWeight'];
  semibold: TextStyle['fontWeight'];
  bold: TextStyle['fontWeight'];
  extrabold: TextStyle['fontWeight'];
}

export const FontWeight = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '700',  // Falls back to bold — no 800 in Inclusive Sans
} as const satisfies FontWeights;

// ─────────────────────────────────────────────
// 3. FONT SIZES (scale)
// ─────────────────────────────────────────────

export interface FontSizes {
  /** 10px — tiny labels, nav labels */
  '3xs': number;

  /** 11px — captions, meta text */
  '2xs': number;

  /** 12px — small body, tags */
  xs: number;

  /** 13px — secondary body */
  sm: number;

  /** 14px — standard body */
  md: number;

  /** 16px — large body, input text */
  lg: number;

  /** 18px — subtitle */
  xl: number;

  /** 20px — card title */
  '2xl': number;

  /** 22px — section header */
  '3xl': number;

  /** 26px — page title */
  '4xl': number;

  /** 32px — display amount */
  '5xl': number;

  /** 44px — hero number */
  '6xl': number;
}

export const FontSize = {
  '3xs': 10,
  '2xs': 11,
  xs: 12,
  sm: 13,
  md: 14,
  lg: 16,
  xl: 18,
  '2xl': 20,
  '3xl': 22,
  '4xl': 26,
  '5xl': 32,
  '6xl': 44,
} as const satisfies FontSizes;

// ─────────────────────────────────────────────
// 4. LINE HEIGHTS (multiplier)
// ─────────────────────────────────────────────

export interface LineHeights {
  /** 1.0 — display numbers, no wrap */
  none: number;

  /** 1.2 — tight — headings */
  tight: number;

  /** 1.35 — snug — subheadings */
  snug: number;

  /** 1.5 — normal — body text */
  normal: number;

  /** 1.6 — relaxed — long form */
  relaxed: number;

  /** 1.75 — loose — captions, tiny text */
  loose: number;
}

export const LineHeight = {
  none: 1,
  tight: 1.2,
  snug: 1.35,
  normal: 1.5,
  relaxed: 1.6,
  loose: 1.75,
} as const satisfies LineHeights;

// ─────────────────────────────────────────────
// 5. LETTER SPACING
//    Inclusive Sans is slightly wider than Inter, so tracking
//    values are slightly loosened to avoid cramping.
// ─────────────────────────────────────────────

export interface LetterSpacings {
  /** -0.8px — large display numbers */
  tighter: number;

  /** -0.5px — page titles */
  tight: number;

  /** -0.2px — card titles */
  snug: number;

  /** 0 — body text (default) */
  normal: number;

  /** +0.3px — small caps */
  wide: number;

  /** +0.7px — labels, tags */
  wider: number;

  /** +1.4px — section headers, uppercase labels */
  widest: number;
}

export const LetterSpacing = {
  tighter: -0.8,
  tight: -0.5,
  snug: -0.2,
  normal: 0,
  wide: 0.3,
  wider: 0.7,
  widest: 1.4,
} as const satisfies LetterSpacings;

// ─────────────────────────────────────────────
// 6. TEXT STYLES
//    Full TextStyle objects — spread into StyleSheet.
// ─────────────────────────────────────────────

export interface TypographyTokens {
  /** 44px / bold — hero balance */
  hero: TextStyle;

  /** 32px / bold — main amounts */
  display: TextStyle;

  /** 26px / bold — page titles */
  h1: TextStyle;

  /** 22px / bold — section titles */
  h2: TextStyle;

  /** 20px / semibold — card titles */
  h3: TextStyle;

  /** 18px / semibold — subtitles */
  h4: TextStyle;

  /** 16px / semibold — emphasized body */
  bodyLg: TextStyle;

  /** 14px / medium — standard body */
  body: TextStyle;

  /** 13px / medium — secondary body */
  bodySm: TextStyle;

  /** 12px / medium — captions */
  caption: TextStyle;

  /** 11px / semibold — meta, timestamps */
  meta: TextStyle;

  /** 10px / semibold — tiny labels, tab labels */
  label: TextStyle;

  /** 10px / bold / uppercase — section headers */
  overline: TextStyle;

  /** 14px / bold — button text */
  button: TextStyle;

  /** 16px / bold — large button */
  buttonLg: TextStyle;

  /** 10px / semibold — navigation tab labels */
  tabLabel: TextStyle;

  /** 14px / bold — chips, tags */
  chip: TextStyle;

  /** 12px / bold — numeric amounts (transaction rows) */
  amount: TextStyle;

  /** 20px / bold — card amounts */
  amountLg: TextStyle;

  /** 14px / medium — input text */
  input: TextStyle;

  /** 12px / semibold — input labels */
  inputLabel: TextStyle;

  /** 14px / light — long-form paragraphs */
  paragraph: TextStyle;

  /** 14px / italic — quotes, hints */
  italic: TextStyle;
}

export const Typography = {
  // — Display / Hero —
  hero: {
    fontFamily: FontFamily.extrabold,
    fontSize: FontSize['6xl'],
    fontWeight: FontWeight.extrabold,
    lineHeight: FontSize['6xl'] * LineHeight.none,
    letterSpacing: LetterSpacing.tighter,
  },
  display: {
    fontFamily: FontFamily.extrabold,
    fontSize: FontSize['5xl'],
    fontWeight: FontWeight.extrabold,
    lineHeight: FontSize['5xl'] * LineHeight.tight,
    letterSpacing: LetterSpacing.tighter,
  },

  // — Headings —
  h1: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['4xl'],
    fontWeight: FontWeight.bold,
    lineHeight: FontSize['4xl'] * LineHeight.tight,
    letterSpacing: LetterSpacing.tight,
  },
  h2: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    lineHeight: FontSize['3xl'] * LineHeight.tight,
    letterSpacing: LetterSpacing.tight,
  },
  h3: {
    fontFamily: FontFamily.semibold,
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.semibold,
    lineHeight: FontSize['2xl'] * LineHeight.snug,
    letterSpacing: LetterSpacing.snug,
  },
  h4: {
    fontFamily: FontFamily.semibold,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    lineHeight: FontSize.xl * LineHeight.snug,
    letterSpacing: LetterSpacing.snug,
  },

  // — Body —
  bodyLg: {
    fontFamily: FontFamily.semibold,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    lineHeight: FontSize.lg * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  },
  body: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.md * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  },
  bodySm: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.sm * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  },
  paragraph: {
    fontFamily: FontFamily.light,
    fontSize: FontSize.md,
    fontWeight: FontWeight.light,
    lineHeight: FontSize.md * LineHeight.relaxed,
    letterSpacing: LetterSpacing.normal,
  },
  italic: {
    fontFamily: FontFamily.italic,
    fontSize: FontSize.md,
    fontWeight: FontWeight.regular,
    fontStyle: 'italic',
    lineHeight: FontSize.md * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  },

  // — Small text —
  caption: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.xs * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  },
  meta: {
    fontFamily: FontFamily.semibold,
    fontSize: FontSize['2xs'],
    fontWeight: FontWeight.semibold,
    lineHeight: FontSize['2xs'] * LineHeight.normal,
    letterSpacing: LetterSpacing.wide,
  },
  label: {
    fontFamily: FontFamily.semibold,
    fontSize: FontSize['3xs'],
    fontWeight: FontWeight.semibold,
    lineHeight: FontSize['3xs'] * LineHeight.normal,
    letterSpacing: LetterSpacing.wider,
  },
  overline: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['3xs'],
    fontWeight: FontWeight.bold,
    lineHeight: FontSize['3xs'] * LineHeight.normal,
    letterSpacing: LetterSpacing.widest,
    textTransform: 'uppercase',
  },

  // — Interactive —
  button: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    lineHeight: FontSize.md * LineHeight.tight,
    letterSpacing: LetterSpacing.wide,
  },
  buttonLg: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    lineHeight: FontSize.lg * LineHeight.tight,
    letterSpacing: LetterSpacing.wide,
  },
  tabLabel: {
    fontFamily: FontFamily.semibold,
    fontSize: FontSize['3xs'],
    fontWeight: FontWeight.semibold,
    lineHeight: FontSize['3xs'] * LineHeight.tight,
    letterSpacing: LetterSpacing.wide,
  },
  chip: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    lineHeight: FontSize.md * LineHeight.tight,
    letterSpacing: LetterSpacing.wide,
  },

  // — Numeric —
  amount: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    lineHeight: FontSize.xs * LineHeight.tight,
    letterSpacing: LetterSpacing.snug,
  },
  amountLg: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    lineHeight: FontSize['2xl'] * LineHeight.tight,
    letterSpacing: LetterSpacing.snug,
  },

  // — Forms —
  input: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.md * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  },
  inputLabel: {
    fontFamily: FontFamily.semibold,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    lineHeight: FontSize.xs * LineHeight.tight,
    letterSpacing: LetterSpacing.wide,
  },
} as const satisfies TypographyTokens;

// ─────────────────────────────────────────────
// 7. SEMANTIC ALIASES
// ─────────────────────────────────────────────

export interface SemanticTypography {
  /** Big hero number on Home (total balance) */
  balanceHero: TextStyle;

  /** Card amount (transaction, category) */
  cardAmount: TextStyle;

  /** Page title ("Report", "Settings") */
  pageTitle: TextStyle;

  /** Section header ("Recent Transactions", "Budgets") */
  sectionTitle: TextStyle;

  /** Card title ("House by the Sea") */
  cardTitle: TextStyle;

  /** Item name ("McDonald's", "Walmart") */
  itemName: TextStyle;

  /** Item meta ("Today, 12:45 PM") */
  itemMeta: TextStyle;

  /** Category label */
  categoryLabel: TextStyle;

  /** FAB plus sign */
  fabIcon: TextStyle;

  /** Alert / toast text */
  alert: TextStyle;

  /** Pro banner title */
  proTitle: TextStyle;

  /** Pro banner subtitle */
  proSub: TextStyle;

  /** Long-form paragraphs (privacy, terms) */
  longForm: TextStyle;
}

export const SemanticTypography = {
  balanceHero: Typography.display,
  cardAmount: Typography.amountLg,
  pageTitle: Typography.h1,
  sectionTitle: Typography.h3,
  cardTitle: Typography.h4,
  itemName: Typography.body,
  itemMeta: Typography.meta,
  categoryLabel: Typography.caption,
  fabIcon: {
    fontFamily: FontFamily.light,
    fontSize: 26,
    fontWeight: FontWeight.light,
    lineHeight: 26,
  } as TextStyle,
  alert: Typography.bodySm,
  proTitle: Typography.body,
  proSub: Typography.meta,
  longForm: Typography.paragraph,
} as const satisfies SemanticTypography;

// ─────────────────────────────────────────────
// 8. TYPES EXPORT
// ─────────────────────────────────────────────

export type TypographyKey = keyof typeof Typography;
export type SemanticTypographyKey = keyof typeof SemanticTypography;
export type FontSizeKey = keyof typeof FontSize;
export type FontFamilyKey = keyof typeof FontFamily;
export type FontWeightKey = keyof typeof FontWeight;

// ─────────────────────────────────────────────
// 9. DEFAULT EXPORT
// ─────────────────────────────────────────────

export default Typography;