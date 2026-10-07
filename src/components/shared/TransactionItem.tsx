import React from 'react';
import { View, Pressable, ViewStyle } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { Text } from '@components/ui/Text';
import { getCategoryConfig } from '@constants/categories';
import type { CategoryType } from '@app-types/expense';

export interface TransactionItemProps {
    title: string;
    amount: number;
    category: CategoryType;
    date: string;
    onPress?: () => void;
    style?: ViewStyle;
}

export function TransactionItem({
    title,
    amount,
    category,
    date,
    onPress,
    style,
}: TransactionItemProps) {
    const { colors, Radius, Spacing, Shadows } = useTheme();
    const config = getCategoryConfig(category);

    const isNegative = amount < 0;
    const formatted = Math.abs(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                {
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: Spacing.md,
                    padding: Spacing.lg,
                    backgroundColor: colors.card,
                    borderRadius: Radius['2xl'],
                    borderWidth: 1,
                    borderColor: colors.border,
                    ...Shadows.xs,
                },
                pressed && onPress && { opacity: 0.9, transform: [{ scale: 0.99 }] },
                style,
            ]}
        >
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

            <View style={{ flex: 1, minWidth: 0 }}>
                <Text variant="body" weight="semibold" numberOfLines={1}>
                    {title}
                </Text>
                <Text variant="meta" color={colors.textSecondary} style={{ marginTop: 2 }}>
                    {date}
                </Text>
            </View>

            <Text
                variant="amount"
                color={isNegative ? colors.danger : colors.success}
            >
                {isNegative ? '-' : '+'}${formatted}
            </Text>
        </Pressable>
    );
}

export default TransactionItem;