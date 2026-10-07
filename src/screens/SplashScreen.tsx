/**
 * MySpendTracker — Splash Screen
 * ------------------------------
 * Animated splash shown while the app bootstraps:
 *   - Loads fonts
 *   - Rehydrates Zustand stores (auth, expenses, etc.)
 *   - Prepares navigation
 *
 * Auto-dismisses when `onReady` is called (from App.tsx).
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { Wallet } from 'lucide-react-native';

import { useTheme } from '@hooks/useTheme';
import { Text } from '@components/ui/Text';

export interface SplashScreenProps {
    /** Optional status message — e.g. "Loading your data..." */
    message?: string;
}

export function SplashScreen({ message = 'Getting things ready...' }: SplashScreenProps) {
    const { colors, Spacing, Radius } = useTheme();

    // ─── Animations ───
    const logoScale = useRef(new Animated.Value(0.6)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;
    const dot1 = useRef(new Animated.Value(0.3)).current;
    const dot2 = useRef(new Animated.Value(0.3)).current;
    const dot3 = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        // ─── Logo entrance ───
        Animated.parallel([
            Animated.spring(logoScale, {
                toValue: 1,
                friction: 5,
                tension: 80,
                useNativeDriver: true,
            }),
            Animated.timing(logoOpacity, {
                toValue: 1,
                duration: 400,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start();

        // ─── Text fade-in (delayed) ───
        Animated.timing(textOpacity, {
            toValue: 1,
            duration: 500,
            delay: 350,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();

        // ─── Loading dots loop ───
        const createDotAnimation = (dot: Animated.Value, delay: number) =>
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(dot, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(dot, {
                        toValue: 0.3,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]),
            );

        const anim1 = createDotAnimation(dot1, 0);
        const anim2 = createDotAnimation(dot2, 150);
        const anim3 = createDotAnimation(dot3, 300);

        anim1.start();
        anim2.start();
        anim3.start();

        return () => {
            anim1.stop();
            anim2.stop();
            anim3.stop();
        };
    }, [logoScale, logoOpacity, textOpacity, dot1, dot2, dot3]);

    return (
        <LinearGradient
            colors={[colors.gradientPrimaryStart, colors.gradientPrimaryEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                {/* Decorative circles */}
                <View
                    style={[
                        styles.decorativeCircle,
                        { top: -80, right: -80, backgroundColor: 'rgba(255,255,255,0.08)' },
                    ]}
                />
                <View
                    style={[
                        styles.decorativeCircle,
                        { bottom: -100, left: -100, width: 260, height: 260, backgroundColor: 'rgba(255,255,255,0.06)' },
                    ]}
                />
                <View
                    style={[
                        styles.decorativeCircle,
                        { top: '40%', left: -60, width: 120, height: 120, backgroundColor: 'rgba(255,255,255,0.05)' },
                    ]}
                />

                {/* Logo + Brand */}
                <View style={styles.centerContent}>
                    <Animated.View
                        style={{
                            transform: [{ scale: logoScale }],
                            opacity: logoOpacity,
                        }}
                    >
                        <View
                            style={[
                                styles.logoBox,
                                {
                                    borderRadius: Radius['3xl'],
                                },
                            ]}
                        >
                            <Wallet size={48} color="#FFFFFF" strokeWidth={2} />
                        </View>
                    </Animated.View>

                    <Animated.View style={{ opacity: textOpacity, alignItems: 'center' }}>
                        <Text
                            variant="h1"
                            color="#FFFFFF"
                            align="center"
                            style={{ marginTop: Spacing.xl, letterSpacing: -0.6 }}
                        >
                            MySpendTracker
                        </Text>
                        <Text
                            variant="body"
                            color="rgba(255,255,255,0.85)"
                            align="center"
                            style={{ marginTop: Spacing.sm, maxWidth: 240 }}
                        >
                            Track expenses, grow savings, take control.
                        </Text>
                    </Animated.View>
                </View>

                {/* Loading */}
                <Animated.View style={[styles.bottomContent, { opacity: textOpacity }]}>
                    <View style={styles.dotsRow}>
                        <Animated.View style={[styles.dot, { opacity: dot1 }]} />
                        <Animated.View style={[styles.dot, { opacity: dot2 }]} />
                        <Animated.View style={[styles.dot, { opacity: dot3 }]} />
                    </View>
                    <Text
                        variant="caption"
                        color="rgba(255,255,255,0.7)"
                        align="center"
                        style={{ marginTop: Spacing.md }}
                    >
                        {message}
                    </Text>
                </Animated.View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 60,
    },
    decorativeCircle: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 999,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoBox: {
        width: 104,
        height: 104,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.22)'
        
    },
    bottomContent: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    dotsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
    },
});

export default SplashScreen;