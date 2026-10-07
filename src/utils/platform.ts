/**
 * MySpendTracker — Platform Helpers
 * ---------------------------------
 * Small wrappers for platform-specific behaviors.
 */

import { Platform, Dimensions, PixelRatio } from 'react-native';

// ─────────────────────────────────────────────
// 1. PLATFORM CHECKS
// ─────────────────────────────────────────────

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isWeb = Platform.OS === 'web';

// ─────────────────────────────────────────────
// 2. SCREEN
// ─────────────────────────────────────────────

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get('window');

/**
 * Scale a size from the design system to the device screen.
 * Base design width: 390 (iPhone 14 Pro).
 */
export function scale(size: number, baseWidth = 390): number {
  return (SCREEN_WIDTH / baseWidth) * size;
}

/**
 * Convert dp → pixels.
 */
export function dp(size: number): number {
  return PixelRatio.roundToNearestPixel(size);
}

// ─────────────────────────────────────────────
// 3. KEYBOARD BEHAVIOR
// ─────────────────────────────────────────────

export const keyboardBehavior = isIOS ? 'padding' : 'height';
export const keyboardVerticalOffset = isIOS ? 0 : 24;

// ─────────────────────────────────────────────
// 4. HIT SLOP
// ─────────────────────────────────────────────

/**
 * Increase touch area without changing visible size.
 * Helps meet iOS 44pt minimum touch target.
 */
export const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };
