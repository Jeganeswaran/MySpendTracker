import React from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Sparkles, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@hooks/useTheme';
import { Text } from '@components/ui/Text';

export interface ProBannerProps {
    onPress?: () => void;
    title?: string;
    subtitle?: string;
    style?: ViewStyle;
}

export function ProBanner({
    onPress,
    title = 'MySpendTracker Pro',
    subtitle = 'Unlock all features with Pro',
    style,
}: ProBannerProps) {
    const { colors, Radius, Spacing, Shadows } = useTheme();

    return (
        <Pressable onPress={onPress} style={({ pressed }) => [pressed && { opacity: 0.95 }, style]}>
            <LinearGradient
                colors={[colors.gradientPrimaryStart, colors.gradientPrimaryEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                    {
                        borderRadius: Radius['2xl'],
                        padding: Spacing.lg,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: Spacing.md,
                        overflow: 'hidden',
                    },
                    Shadows.brand,
                ]}
            >
                {/* Decorative circles */}
                <View
                    style={{
                        position: 'absolute',
                        top: -30,
                        right: -30,
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        backgroundColor: 'rgba(255,255,255,0.15)',
                    }}
                />
                <View
                    style={{
                        position: 'absolute',
                        bottom: -40,
                        right: 20,
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                    }}
                />

                <View
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: 'rgba(255,255,255,0.25)',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Sparkles size={18} color="#FFFFFF" />
                </View>

                <View style={{ flex: 1 }}>
                    <Text variant="body" color="#FFFFFF" weight="bold">
                        {title}
                    </Text>
                    <Text variant="meta" color="rgba(255,255,255,0.9)" style={{ marginTop: 2 }}>
                        {subtitle}
                    </Text>
                </View>

                <ChevronRight size={18} color="#FFFFFF" opacity={0.8} />
            </LinearGradient>
        </Pressable>
    );
}

export default ProBanner;