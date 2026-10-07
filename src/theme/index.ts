/**
 * MySpendTracker Design System — Unified Theme
 * ------------------------------------
 * Single entry point for all design tokens.
 *
 * Usage:
 *   import { theme } from '@theme';
 *   import { Colors, Spacing } from '@theme';
 *   import { useTheme } from '@hooks/useTheme';
 */

// ─────────────────────────────────────────────
// 1. IMPORTS (for building the theme object)
// ─────────────────────────────────────────────

import { Colors, Palette, LightColors, DarkColors } from './colors';
import {
  Radius,
  SemanticRadius,
  RadiusPresets,
} from './radius';
import {
  Shadows,
  SemanticShadows,
  ShadowColor,
  createShadow,
} from './shadows';
import {
  Spacing,
  SemanticSpacing,
  SpacingPresets,
  Layout,
} from './spacing';
import {
  Typography,
  SemanticTypography,
  FontFamily,
  FontSize,
  FontWeight,
  LineHeight,
  LetterSpacing,
} from './typography';

// ─────────────────────────────────────────────
// 2. RE-EXPORTS (single strategy — wildcard only)
//    ✅ No duplicates — every token + type flows through.
// ─────────────────────────────────────────────

export * from './colors';
export * from './radius';
export * from './shadows';
export * from './spacing';
export * from './typography';

// ─────────────────────────────────────────────
// 3. UNIFIED THEME OBJECT
//    ✅ No annotation — let TS infer each property.
// ─────────────────────────────────────────────

export const theme = {
  // — Colors —
  Colors,           // { light, dark }
  Palette,          // raw atomic colors
  LightColors,      // light palette only
  DarkColors,       // dark palette only

  // — Radius —
  Radius,
  SemanticRadius,
  RadiusPresets,

  // — Shadows —
  Shadows,
  SemanticShadows,
  ShadowColor,
  createShadow,     // helper: platform-aware shadow

  // — Spacing & Layout —
  Spacing,
  SemanticSpacing,
  SpacingPresets,
  Layout,

  // — Typography —
  Typography,
  SemanticTypography,
  FontFamily,
  FontSize,
  FontWeight,
  LineHeight,
  LetterSpacing,
} as const;

// ─────────────────────────────────────────────
// 4. TYPE EXPORTS
// ─────────────────────────────────────────────

/** The full theme shape — inferred */
export type AppTheme = typeof theme;

/** The current color palette type (light or dark shape) */
export type AppColors = typeof Colors.light;

/** All typography variant keys — "hero" | "display" | "h1" | ... */
export type TypographyVariant = keyof typeof Typography;

/** All semantic typography keys — "balanceHero" | "cardAmount" | ... */
export type SemanticTypographyVariant = keyof typeof SemanticTypography;

// ─────────────────────────────────────────────
// 5. DEFAULT EXPORT
// ─────────────────────────────────────────────

export default theme;