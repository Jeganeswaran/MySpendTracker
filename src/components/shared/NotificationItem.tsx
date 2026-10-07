import React from 'react';
import { View, Pressable, ViewStyle } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { Text } from '@components/ui/Text';
import { formatRelativeDate } from '@utils/formatDate';
import { formatSigned } from '@utils/formatCurrency';

export type NotificationVariant =
    | 'payment'
    | 'budget'
    | 'income'
    | 'goal'
    | 'summary'
    | 'system';

export interface NotificationItemProps {
    id: string;
    variant: NotificationVariant;
    title: string;
    message: string;
    /** ISO date string */
    timestamp: string;
    /** Optional amount — displays on the right */
    amount?: number;
    /** Amount type — determines +/- sign */
    amountType?: 'income' | 'expense';
    currency?: string;
    unread?: boolean;
    onPress?: () => void;
    style?: ViewStyle;
}

// ─────────────────────────────────────────────
// ICON MAP
// ─────────────────────────────────────────────

const VARIANT_CONFIG: Record<
    NotificationVariant,
    { emoji: string; bg: string; fg: string }
> = {
    payment: { emoji: '💳', bg: 'dangerSoft', fg: 'danger' },
    budget: { emoji: '⚠️', bg: 'warningSoft', fg: 'warning' },
    income: { emoji: '💰', bg: 'successSoft', fg: 'success' },
    goal: { emoji: '🎯', bg: 'primarySoft', fg: 'primary' },
    summary: { emoji: '📊', bg: 'infoSoft', fg: 'info' },
    system: { emoji: '✨', bg: 'primarySoft', fg: 'primary' },
};

export function NotificationItem({
    variant,
    title,
    message,
    timestamp,
    amount,
    amountType = 'expense',
    currency = 'USD',
    unread,
    onPress,
    style,
}: NotificationItemProps) {
    const { colors, Radius, Spacing, Shadows } = useTheme();
    const vc = VARIANT_CONFIG[variant];

    // Resolve dynamic color tokens
    const iconBg = (colors as any)[vc.bg] ?? colors.cardAlt;

    const amountColor =
        amountType === 'income' ? colors.success : colors.danger;

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                {
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    gap: Spacing.md,
                    backgroundColor: unread
                        ? colors.primarySubtle ?? colors.card
                        : colors.card,
                    borderRadius: Radius['2xl'],
                    padding: Spacing.lg,
                    borderWidth: 1,
                    borderColor: unread ? colors.primarySoft : colors.border,
                    ...Shadows.xs,
                    position: 'relative',
                },
                pressed && onPress && { opacity: 0.92 },
                style,
            ]}
        >
            {/* Unread indicator */}
            {unread && (
                <View
                    style={{
                        position: 'absolute',
                        left: 8,
                        top: '50%',
                        transform: [{ translateY: -10 }],
                        width: 4,
                        height: 20,
                        borderRadius: 2,
                        backgroundColor: colors.primary,
                    }}
                />
            )}

            {/* Icon */}
            <View
                style={{
                    width: 42,
                    height: 42,
                    borderRadius: Radius.lg,
                    backgroundColor: iconBg,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text style={{ fontSize: 18 }}>{vc.emoji}</Text>
            </View>

            {/* Body */}
            <View style={{ flex: 1, minWidth: 0 }}>
                <Text variant="body" weight="bold" numberOfLines={1}>
                    {title}
                </Text>
                <Text
                    variant="caption"
                    color={colors.textSecondary}
                    numberOfLines={2}
                    style={{ marginTop: 3, lineHeight: 18 }}
                >
                    {message}
                </Text>
                <Text
                    variant="label"
                    color={colors.textTertiary}
                    weight="semibold"
                    style={{ marginTop: 6 }}
                >
                    {formatRelativeDate(timestamp)}
                </Text>
            </View>

            {/* Amount */}
            {amount !== undefined && (
                <Text variant="amount" color={amountColor} weight="bold">
                    {formatSigned(amount, amountType, currency)}
                </Text>
            )}
        </Pressable>
    );
}

export default NotificationItem;