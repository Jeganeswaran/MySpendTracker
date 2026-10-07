/**
 * Runtime theme hook for MySpendTracker.
 *
 * Resolves the active color scheme using this priority:
 *   1. Manual override  (from useThemeStore, e.g. "dark")
 *   2. System scheme    (from useColorScheme(), e.g. "light")
 *   3. Fallback         ("light")
 *
 * Returns:
 *   - colors             → scheme-aware palette (light OR dark)
 *   - scheme             → resolved scheme: "light" | "dark"
 *   - isDark             → convenience boolean
 *   - all token groups   → Radius, Spacing, Typography, Shadows, ...
 */

import { useColorScheme } from 'react-native';
import theme, { ThemeColors } from '../theme';
import { useThemeStore } from '../stores/useThemeStore';

// ─────────────────────────────────────────────
// 1. RESOLVED SCHEME TYPE
// ─────────────────────────────────────────────

export type ResolvedScheme = 'light' | 'dark';

// ─────────────────────────────────────────────
// 2. HOOK RETURN TYPE
// ─────────────────────────────────────────────

export interface UseThemeReturn {
  // — Resolved state —
  /** The active color palette (scheme-aware) */
  colors: ThemeColors;

  /** The resolved scheme after applying override + system */
  scheme: ResolvedScheme;

  /** Convenience boolean — true when dark */
  isDark: boolean;

  // — Direct token access —
  /** { light, dark } — full palette map */
  Colors: typeof theme.Colors;

  /** Raw atomic colors — purple500, gray200, etc. */
  Palette: typeof theme.Palette;

  // — Radius —
  Radius: typeof theme.Radius;
  SemanticRadius: typeof theme.SemanticRadius;
  RadiusPresets: typeof theme.RadiusPresets;

  // — Shadows —
  Shadows: typeof theme.Shadows;
  SemanticShadows: typeof theme.SemanticShadows;
  ShadowColor: typeof theme.ShadowColor;
  createShadow: typeof theme.createShadow;

  // — Spacing & Layout —
  Spacing: typeof theme.Spacing;
  SemanticSpacing: typeof theme.SemanticSpacing;
  SpacingPresets: typeof theme.SpacingPresets;
  Layout: typeof theme.Layout;

  // — Typography —
  Typography: typeof theme.Typography;
  SemanticTypography: typeof theme.SemanticTypography;
  FontFamily: typeof theme.FontFamily;
  FontSize: typeof theme.FontSize;
  FontWeight: typeof theme.FontWeight;
  LineHeight: typeof theme.LineHeight;
  LetterSpacing: typeof theme.LetterSpacing;
}

// ─────────────────────────────────────────────
// 3. THE HOOK
// ─────────────────────────────────────────────

export function useTheme(): UseThemeReturn {
  // System scheme (may be null on some devices)
  const systemScheme = useColorScheme();

  // Manual override from Zustand store
  // 'system' | 'light' | 'dark'
  const override = useThemeStore((s) => s.mode);

  // Resolve final scheme — override wins, fallback to system, then light
  const scheme: ResolvedScheme =
    override === 'system'
      ? ((systemScheme ?? 'light') as ResolvedScheme)
      : (override as ResolvedScheme);

  // Pick the correct palette from the Colors map
  const colors = theme.Colors[scheme];

  return {
    colors,
    scheme,
    isDark: scheme === 'dark',

    // Token groups (static — same across schemes)
    Colors: theme.Colors,
    Palette: theme.Palette,

    Radius: theme.Radius,
    SemanticRadius: theme.SemanticRadius,
    RadiusPresets: theme.RadiusPresets,

    Shadows: theme.Shadows,
    SemanticShadows: theme.SemanticShadows,
    ShadowColor: theme.ShadowColor,
    createShadow: theme.createShadow,

    Spacing: theme.Spacing,
    SemanticSpacing: theme.SemanticSpacing,
    SpacingPresets: theme.SpacingPresets,
    Layout: theme.Layout,

    Typography: theme.Typography,
    SemanticTypography: theme.SemanticTypography,
    FontFamily: theme.FontFamily,
    FontSize: theme.FontSize,
    FontWeight: theme.FontWeight,
    LineHeight: theme.LineHeight,
    LetterSpacing: theme.LetterSpacing,
  };
}

export default useTheme;