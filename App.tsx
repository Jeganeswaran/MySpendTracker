/**
 * MySpendTracker — Root Component
 * -------------------------------
 * Boots the app: DB → seed → hydrate → sync → splash → navigate.
 * Shows a live status message + progress bar while bootstrapping.
 *
 * All colors, spacing, and typography come from the theme system.
 */

import React, { useMemo, useEffect, useRef } from 'react';
import { View, StyleSheet, useColorScheme, StatusBar, Animated, Easing, } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme, type Theme as NavTheme, } from '@react-navigation/native';
import { Wallet } from 'lucide-react-native';

import { RootNavigator } from '@navigation';
import { ToastContainer } from '@components/shared';
import { useBootstrap, type BootstrapStatus } from '@hooks/useBootstrap';
import { useTheme } from '@hooks/useTheme';
import { Text } from '@components/ui';

// ─────────────────────────────────────────────
// NAVIGATION THEME FACTORY
// ─────────────────────────────────────────────

function buildNavTheme(
  base: typeof DefaultTheme,
  colors: ReturnType<typeof useTheme>['colors'],
): NavTheme {
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      notification: colors.danger,
    },
  };
}

// ─────────────────────────────────────────────
// LOADING SCREEN (with progress)
// ─────────────────────────────────────────────

function LoadingScreen({ status }: { status: BootstrapStatus }) {
  const { colors, Spacing, Radius, Typography } = useTheme();
  const isDarkMode = useColorScheme() === 'dark';

  // Animate the progress bar fill
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Animate the icon (subtle pulse)
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Progress bar transition
    Animated.timing(progressAnim, {
      toValue: status.progress,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [status.progress, progressAnim]);

  useEffect(() => {
    // Pulse loop for the icon
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Icon */}
      <Animated.View
        style={{
          width: 88,
          height: 88,
          borderRadius: Radius['3xl'],
          backgroundColor: colors.primarySoft,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: Spacing['2xl'],
          transform: [{ scale: pulseAnim }],
        }}
      >
        <Wallet size={40} color={colors.primary} strokeWidth={2} />
      </Animated.View>

      {/* App name */}
      <Text
        style={[
          Typography.h2,
          { color: colors.text, marginBottom: Spacing.xs },
        ]}
      >
        MySpendTracker
      </Text>

      {/* Status message */}
      <Text
        style={[
          Typography.caption,
          {
            color: colors.textSecondary,
            marginBottom: Spacing['3xl'],
            textAlign: 'center',
            minHeight: 20,
          },
        ]}
      >
        {status.message}
      </Text>

      {/* Progress bar */}
      <View
        style={{
          width: 220,
          height: 4,
          borderRadius: Radius.full,
          backgroundColor: colors.border,
          overflow: 'hidden',
        }}
      >
        <Animated.View
          style={{
            width: progressWidth,
            height: '100%',
            backgroundColor: colors.primary,
            borderRadius: Radius.full,
          }}
        />
      </View>

      {/* Progress percentage */}
      <Text
        style={[
          Typography.label,
          {
            color: colors.textTertiary,
            marginTop: Spacing.md,
            letterSpacing: 1,
          },
        ]}
      >
        {status.progress}%
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────
// ERROR SCREEN
// ─────────────────────────────────────────────

function ErrorScreen({ error }: { error: Error }) {
  const { colors, Spacing, Typography } = useTheme();

  return (
    <View
      style={[
        styles.errorContainer,
        {
          backgroundColor: colors.background,
          paddingHorizontal: Spacing['3xl'],
          paddingVertical: Spacing['2xl'],
        },
      ]}
    >
      <Text
        style={[
          Typography.hero,
          {
            color: colors.danger,
            marginBottom: Spacing.lg,
            textAlign: 'center',
          },
        ]}
      >
        😕
      </Text>

      <Text
        style={[
          Typography.h2,
          {
            color: colors.text,
            marginBottom: Spacing.sm,
            textAlign: 'center',
          },
        ]}
      >
        Something went wrong
      </Text>

      <Text
        style={[
          Typography.body,
          {
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: Typography.body.lineHeight,
          },
        ]}
      >
        {error.message}
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────

export default function App() {
  const { colors } = useTheme();
  const scheme = useColorScheme();
  const { ready, error, status } = useBootstrap();

  const navTheme = useMemo(
    () => buildNavTheme(scheme === 'dark' ? DarkTheme : DefaultTheme, colors),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scheme],
  );

  // ─── Render gates ───
  if (error) {
    return (
      <SafeAreaProvider>
        <ErrorScreen error={error} />
      </SafeAreaProvider>
    );
  }

  if (!ready) {
    return (
      <SafeAreaProvider>
        <LoadingScreen status={status} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navTheme}>
        <RootNavigator />
      </NavigationContainer>
      <ToastContainer />
    </SafeAreaProvider>
  );
}

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});