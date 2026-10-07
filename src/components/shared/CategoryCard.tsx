import React from 'react';
import { View, Pressable, ViewStyle } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { Text } from '@components/ui/Text';
import { ProgressBar } from './ProgressBar';
import { formatCurrency } from '@utils/formatCurrency';
import { getCategoryConfig } from '@constants/categories';
import type { CategoryType } from '@app-types/category';

export interface CategoryCardProps {
    category: CategoryType;
    amount: number;
    /** Total for the period — used to compute % */
    total?: number;
    /** Percentage of total — if not provided, computed from total */
    percent?: number;
    /** Trend vs previous period — e.g. +12.5 or -4.2 */
    trend?: number;
    currency?: string;
    onPress?: () => void;
    style?: ViewStyle;
}

export function CategoryCard({
    category,
    amount,
    total,
    percent,
    trend,
    currency = 'USD',
    onPress,
    style,
}: CategoryCardProps) {
    const { colors, Radius, Spacing, Shadows } = useTheme();
    const config = getCategoryConfig(category);

    const computedPercent =
        percent ?? (total && total > 0 ? (amount / total) * 100 : 0);

    const trendPositive = (trend ?? 0) >= 0;
    const trendBg = trendPositive ? colors.successSoft : colors.dangerSoft;
    const trendColor = trendPositive ? colors.success : colors.danger;

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                {
                    backgroundColor: colors.card,
                    borderRadius: Radius['2xl'],
                    padding: Spacing.lg,
                    borderWidth: 1,
                    borderColor: colors.border,
                    ...Shadows.xs,
                },
                pressed && onPress && { opacity: 0.95 },
                style,
            ]}
        >
            {/* Top row: icon + amount + trend */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: Spacing.md,
                    marginBottom: Spacing.md,
                }}
            >
                <View
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: Radius.lg,
                        backgroundColor: config.tint,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text style={{ fontSize: 18 }}>{config.emoji}</Text>
                </View>

                <View style={{ flex: 1, minWidth: 0 }}>
                    <Text variant="body" weight="bold" numberOfLines={1}>
                        {config.label}
                    </Text>
                    <Text variant="meta" color={colors.textSecondary} style={{ marginTop: 2 }}>
                        {computedPercent.toFixed(1)}% of total
                    </Text>
                </View>

                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                    <Text variant="amount" weight="bold">
                        {formatCurrency(amount, currency)}
                    </Text>
                    {trend !== undefined && (
                        <View
                            style={{
                                paddingHorizontal: 6,
                                paddingVertical: 2,
                                borderRadius: Radius.sm,
                                backgroundColor: trendBg,
                            }}
                        >
                            <Text variant="label" color={trendColor} weight="bold">
                                {trendPositive ? '+' : ''}
                                {trend.toFixed(1)}%
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Progress bar */}
            <ProgressBar percent={computedPercent} color={config.color} />
        </Pressable>
    );
}

export default CategoryCard;