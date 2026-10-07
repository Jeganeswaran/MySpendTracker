import React from 'react';
import { View, Pressable, ViewStyle } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { Text } from '@components/ui/Text';
import { ProgressRing } from './ProgressRing';
import { formatCurrency } from '@utils/formatCurrency';
import { getBudgetProgress } from '@utils/calculations';
import { getCategoryConfig } from '@constants/categories';
import type { Budget } from '@app-types/budget';

export interface BudgetItemProps {
    budget: Budget;
    currency?: string;
    onPress?: () => void;
    style?: ViewStyle;
}

export function BudgetItem({
    budget,
    currency = 'USD',
    onPress,
    style,
}: BudgetItemProps) {
    const { colors, Radius, Spacing, Shadows } = useTheme();
    const config = getCategoryConfig(budget.category);
    const progress = getBudgetProgress(budget);

    const ringColor = progress.overBudget
        ? colors.danger
        : progress.percentUsed >= 80
            ? colors.warning
            : config.color;

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                {
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: Spacing.md,
                    backgroundColor: colors.card,
                    borderRadius: Radius['2xl'],
                    padding: Spacing.lg,
                    borderWidth: 1,
                    borderColor: colors.border,
                    ...Shadows.xs,
                },
                pressed && onPress && { opacity: 0.9, transform: [{ scale: 0.99 }] },
                style,
            ]}
        >
            {/* Category icon */}
            <View
                style={{
                    width: 42,
                    height: 42,
                    borderRadius: Radius.lg,
                    backgroundColor: config.tint,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text style={{ fontSize: 20 }}>{config.emoji}</Text>
            </View>

            {/* Info */}
            <View style={{ flex: 1, minWidth: 0 }}>
                <Text variant="body" weight="bold" numberOfLines={1}>
                    {config.label}
                </Text>
                <Text
                    variant="meta"
                    color={colors.textSecondary}
                    weight="medium"
                    style={{ marginTop: 3 }}
                >
                    {formatCurrency(budget.spent, currency)} of{' '}
                    {formatCurrency(budget.limit, currency)}
                </Text>
            </View>

            {/* Progress ring */}
            <ProgressRing
                percent={progress.percentUsed}
                size={44}
                strokeWidth={4}
                color={ringColor}
            />
        </Pressable>
    );
}

export default BudgetItem;