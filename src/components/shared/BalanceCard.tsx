import React from 'react';
import { View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { TrendingUp } from 'lucide-react-native';
import { useTheme } from '@hooks/useTheme';
import { Text } from '@components/ui/Text';

export interface BalanceCardProps {
    label?: string;
    amount: number;
    changePercent?: number;
    currency?: string;
    style?: ViewStyle;
}

export function BalanceCard({
    label = 'Total Balance',
    amount,
    changePercent,
    currency = '$',
    style,
}: BalanceCardProps) {
    const { colors, Radius, Spacing } = useTheme();

    const formatted = amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const isPositive = (changePercent ?? 0) >= 0;

    return (
        <LinearGradient
            colors={[colors.gradientPrimaryStart, colors.gradientPrimaryEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
                {
                    borderRadius: Radius['3xl'],
                    padding: Spacing.xl,
                    overflow: 'hidden',
                    shadowColor: colors.shadowColorBrand,
                    shadowOffset: { width: 0, height: 12 },
                    shadowOpacity: 0.35,
                    shadowRadius: 24,
                    elevation: 8,
                },
                style,
            ]}
        >
            {/* Decorative circle */}
            <View
                style={{
                    position: 'absolute',
                    top: -30,
                    right: -30,
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    backgroundColor: 'rgba(255,255,255,0.15)',
                }}
            />

            <Text
                variant="meta"
                color="rgba(255,255,255,0.85)"
                style={{ textTransform: 'uppercase', marginBottom: Spacing.sm }}
            >
                {label}
            </Text>

            <Text
                variant="display"
                color="#FFFFFF"
                style={{ marginBottom: Spacing.md }}
            >
                {currency}
                {formatted}
            </Text>

            {changePercent !== undefined && (
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                        alignSelf: 'flex-start',
                        backgroundColor: 'rgba(255,255,255,0.22)',
                        paddingHorizontal: Spacing.sm,
                        paddingVertical: 5,
                        borderRadius: Radius.full,
                    }}
                >
                    <TrendingUp size={12} color="#FFFFFF" />
                    <Text variant="meta" color="#FFFFFF" weight="semibold">
                        {isPositive ? '+' : ''}
                        {changePercent.toFixed(1)}% this month
                    </Text>
                </View>
            )}
        </LinearGradient>
    );
}

export default BalanceCard;