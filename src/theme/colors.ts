/**
 * MySpendTracker Design System — Color Tokens
 * ------------------------------------
 * Two palettes (light & dark) with identical key structure.
 * Every color used in the app MUST come from here.
 */

// ─────────────────────────────────────────────
// 1. BASE PALETTE (raw brand colors)
//    These are the atomic values. Never use directly in components.
// ─────────────────────────────────────────────

export const Palette = {
  // Purple (primary brand)
  purple50: '#FAF5FF',
  purple100: '#F5F0FF',
  purple200: '#E9D5FF',
  purple300: '#D8B4FE',
  purple400: '#C084FC',
  purple500: '#A855F7', // ← Brand primary
  purple600: '#9333EA',
  purple700: '#7E22CE',

  // Green (income, success)
  green50: '#E8F9EE',
  green100: '#D1FAE5',
  green400: '#4ADE80',
  green500: '#22C55E', // ← Success
  green600: '#16A34A',

  // Red (expense, danger)
  red50: '#FFE8E8',
  red100: '#FEE2E2',
  red400: '#F87171',
  red500: '#EF4444', // ← Danger
  red600: '#DC2626',

  // Orange (warning, food)
  orange50: '#FFF1E5',
  orange100: '#FFEDD5',
  orange400: '#FB923C',
  orange500: '#FF8A3D', // ← Warning
  orange600: '#EA580C',

  // Blue (info, transport)
  blue50: '#E5F0FF',
  blue100: '#DBEAFE',
  blue400: '#60A5FA',
  blue500: '#3B82F6', // ← Info
  blue600: '#2563EB',

  // Pink (accent, advanced)
  pink50: '#FDE8F3',
  pink100: '#FCE7F3',
  pink400: '#F472B6',
  pink500: '#EC4899',
  pink600: '#DB2777',

  // Yellow (bills, warning alt)
  yellow50: '#FFF9E0',
  yellow100: '#FEF3C7',
  yellow400: '#FBBF24',
  yellow500: '#FACC15',
  yellow600: '#EAB308',

  // Neutral (grays)
  white: '#FFFFFF',
  gray50: '#FAFAFB',
  gray100: '#F7F7F9',
  gray200: '#F2F2F7', // ← iOS system gray 6
  gray300: '#E5E5EA', // ← iOS system gray 5
  gray400: '#C7C7CC', // ← iOS system gray 4
  gray500: '#AEAEB2', // ← iOS system gray 3
  gray600: '#8E8E93', // ← iOS system gray 2
  gray700: '#636366', // ← iOS system gray
  gray800: '#48484A', // ← iOS system gray dark
  gray900: '#1C1C1E', // ← iOS label
  gray950: '#0F0F14',
  black: '#000000',

  // iOS system colors (extra)
  iosBlue: '#007AFF',
  iosGreen: '#34C759',
  iosIndigo: '#5856D6',
  iosOrange: '#FF9500',
  iosPink: '#FF2D55',
  iosPurple: '#AF52DE',
  iosRed: '#FF3B30',
  iosTeal: '#5AC8FA',
  iosYellow: '#FFCC00',
} as const;

// ─────────────────────────────────────────────
// 2. THEME COLORS INTERFACE
//    Single source of truth for BOTH palettes.
// ─────────────────────────────────────────────

export interface ThemeColors {
  // — Surfaces —
  background: string;
  backgroundElevated: string;
  card: string;
  cardAlt: string;
  surface: string;
  overlay: string;

  // — Text —
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  textDisabled: string;

  // — Borders & Dividers —
  border: string;
  borderStrong: string;
  divider: string;
  separator: string;

  // — Brand / Primary —
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primarySoft: string;
  primarySubtle: string;
  primaryForeground: string;

  // — Semantic —
  success: string;
  successSoft: string;
  successForeground: string;

  danger: string;
  dangerSoft: string;
  dangerForeground: string;

  warning: string;
  warningSoft: string;
  warningForeground: string;

  info: string;
  infoSoft: string;
  infoForeground: string;

  // — Categories —
  food: string;
  foodTint: string;
  shopping: string;
  shoppingTint: string;
  transport: string;
  transportTint: string;
  bills: string;
  billsTint: string;
  health: string;
  healthTint: string;
  entertainment: string;
  entertainmentTint: string;
  education: string;
  educationTint: string;
  other: string;
  otherTint: string;

  // — Charts —
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  chart6: string;
  chartTrack: string;

  // — Tab bar / nav —
  tabBarBackground: string;
  tabBarActive: string;
  tabBarInactive: string;
  tabBarBorder: string;

  // — Gradients —
  gradientPrimaryStart: string;
  gradientPrimaryEnd: string;

  // — States —
  pressed: string;
  focused: string;
  disabled: string;

  // — Shadows —
  shadowColor: string;
  shadowColorBrand: string;

  // — Status bar —
  statusBarStyle: 'light-content' | 'dark-content';
}

// ─────────────────────────────────────────────
// 3. LIGHT THEME
// ─────────────────────────────────────────────

export const LightColors = {
  // — Surfaces —
  background: Palette.gray200,
  backgroundElevated: Palette.white,
  card: Palette.white,
  cardAlt: Palette.gray100,
  surface: Palette.white,
  overlay: 'rgba(0, 0, 0, 0.5)',

  // — Text —
  text: Palette.gray900,
  textSecondary: Palette.gray600,
  textTertiary: Palette.gray400,
  textInverse: Palette.white,
  textDisabled: Palette.gray500,

  // — Borders & Dividers —
  border: Palette.gray200,
  borderStrong: Palette.gray300,
  divider: Palette.gray300,
  separator: 'rgba(60, 60, 67, 0.12)',

  // — Brand / Primary —
  primary: Palette.purple500,
  primaryLight: Palette.purple400,
  primaryDark: Palette.purple600,
  primarySoft: Palette.purple100,
  primarySubtle: Palette.purple50,
  primaryForeground: Palette.white,

  // — Semantic —
  success: Palette.green500,
  successSoft: Palette.green50,
  successForeground: Palette.white,

  danger: Palette.red500,
  dangerSoft: Palette.red50,
  dangerForeground: Palette.white,

  warning: Palette.orange500,
  warningSoft: Palette.orange50,
  warningForeground: Palette.white,

  info: Palette.blue500,
  infoSoft: Palette.blue50,
  infoForeground: Palette.white,

  // — Category tints —
  food: Palette.orange500,
  foodTint: Palette.orange50,
  shopping: Palette.purple500,
  shoppingTint: Palette.purple100,
  transport: Palette.blue500,
  transportTint: Palette.blue50,
  bills: Palette.yellow500,
  billsTint: Palette.yellow50,
  health: Palette.green500,
  healthTint: Palette.green50,
  entertainment: Palette.red500,
  entertainmentTint: Palette.red50,
  education: Palette.pink500,
  educationTint: Palette.pink50,
  other: Palette.gray600,
  otherTint: Palette.gray200,

  // — Chart colors —
  chart1: Palette.purple500,
  chart2: Palette.orange500,
  chart3: Palette.blue500,
  chart4: Palette.green500,
  chart5: Palette.red500,
  chart6: Palette.yellow500,
  chartTrack: Palette.gray200,

  // — Tab bar / nav —
  tabBarBackground: Palette.white,
  tabBarActive: Palette.purple500,
  tabBarInactive: Palette.gray600,
  tabBarBorder: Palette.gray200,

  // — Gradients —
  gradientPrimaryStart: Palette.purple500,
  gradientPrimaryEnd: Palette.purple400,

  // — States —
  pressed: 'rgba(0, 0, 0, 0.05)',
  focused: 'rgba(168, 85, 247, 0.12)',
  disabled: Palette.gray200,

  // — Shadows —
  shadowColor: '#000000',
  shadowColorBrand: Palette.purple500,

  // — Status bar —
  statusBarStyle: 'dark-content',
} as const satisfies ThemeColors;

// ─────────────────────────────────────────────
// 4. DARK THEME
// ─────────────────────────────────────────────

export const DarkColors = {
  // — Surfaces —
  background: Palette.black,
  backgroundElevated: Palette.gray900,
  card: Palette.gray900,
  cardAlt: Palette.gray800,
  surface: Palette.gray900,
  overlay: 'rgba(0, 0, 0, 0.7)',

  // — Text —
  text: Palette.white,
  textSecondary: Palette.gray600,
  textTertiary: Palette.gray700,
  textInverse: Palette.gray900,
  textDisabled: Palette.gray800,

  // — Borders & Dividers —
  border: '#2C2C2E',
  borderStrong: '#38383A',
  divider: '#2C2C2E',
  separator: 'rgba(84, 84, 88, 0.65)',

  // — Brand / Primary —
  primary: Palette.purple400,
  primaryLight: Palette.purple300,
  primaryDark: Palette.purple500,
  primarySoft: 'rgba(168, 85, 247, 0.15)',
  primarySubtle: 'rgba(168, 85, 247, 0.08)',
  primaryForeground: Palette.white,

  // — Semantic —
  success: Palette.green400,
  successSoft: 'rgba(34, 197, 94, 0.15)',
  successForeground: Palette.white,

  danger: Palette.red400,
  dangerSoft: 'rgba(239, 68, 68, 0.15)',
  dangerForeground: Palette.white,

  warning: Palette.orange400,
  warningSoft: 'rgba(255, 138, 61, 0.15)',
  warningForeground: Palette.white,

  info: Palette.blue400,
  infoSoft: 'rgba(59, 130, 246, 0.15)',
  infoForeground: Palette.white,

  // — Category tints (dark variants) —
  food: Palette.orange400,
  foodTint: 'rgba(255, 138, 61, 0.15)',
  shopping: Palette.purple400,
  shoppingTint: 'rgba(168, 85, 247, 0.15)',
  transport: Palette.blue400,
  transportTint: 'rgba(59, 130, 246, 0.15)',
  bills: Palette.yellow400,
  billsTint: 'rgba(250, 204, 21, 0.15)',
  health: Palette.green400,
  healthTint: 'rgba(34, 197, 94, 0.15)',
  entertainment: Palette.red400,
  entertainmentTint: 'rgba(239, 68, 68, 0.15)',
  education: Palette.pink400,
  educationTint: 'rgba(236, 72, 153, 0.15)',
  other: Palette.gray600,
  otherTint: 'rgba(142, 142, 147, 0.15)',

  // — Chart colors —
  chart1: Palette.purple400,
  chart2: Palette.orange400,
  chart3: Palette.blue400,
  chart4: Palette.green400,
  chart5: Palette.red400,
  chart6: Palette.yellow400,
  chartTrack: '#2C2C2E',

  // — Tab bar / nav —
  tabBarBackground: Palette.gray900,
  tabBarActive: Palette.purple400,
  tabBarInactive: Palette.gray600,
  tabBarBorder: '#2C2C2E',

  // — Gradients —
  gradientPrimaryStart: Palette.purple500,
  gradientPrimaryEnd: Palette.purple400,

  // — States —
  pressed: 'rgba(255, 255, 255, 0.06)',
  focused: 'rgba(192, 132, 252, 0.2)',
  disabled: Palette.gray800,

  // — Shadows —
  shadowColor: '#000000',
  shadowColorBrand: Palette.purple500,

  // — Status bar —
  statusBarStyle: 'light-content',
} as const satisfies ThemeColors;

// ─────────────────────────────────────────────
// 5. TYPES
// ─────────────────────────────────────────────

export type ColorScheme = 'light' | 'dark';

export type ThemeColorsMap = {
  light: ThemeColors;
  dark: ThemeColors;
};

// ─────────────────────────────────────────────
// 6. EXPORT
// ─────────────────────────────────────────────

export const Colors = {
  light: LightColors,
  dark: DarkColors,
} as const;

export default Colors;
