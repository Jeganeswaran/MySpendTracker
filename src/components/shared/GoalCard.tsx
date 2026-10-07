import React from 'react';
import { View, Pressable, ViewStyle } from 'react-native';
import { MoreVertical, Clock } from 'lucide-react-native';
import { useTheme } from '@hooks/useTheme';
import { Text } from '@components/ui/Text';
import { ProgressBar } from './ProgressBar';
import { formatCurrency } from '@utils/formatCurrency';
import { getGoalProgress } from '@utils/calculations';
import type { Goal } from '@app-types/goal';

export interface GoalCardProps {
    goal: Goal;
    currency?: string;
    onPress?: () => void;
    onMenuPress?: () => void;
    style?: ViewStyle;
}

export function GoalCard({
    goal,
    currency = 'USD',
    onPress,
    onMenuPress,
    style,
}: GoalCardProps) {
    const { colors, Radius, Spacing, Shadows } = useTheme();
    const progress = getGoalProgress(goal);

    const statusColor =
        progress.status === 'completed'
            ? colors.success
            : progress.status === 'ahead'
                ? colors.success
                : progress.status === 'behind'
                    ? colors.danger
                    : colors.warning;

    const statusBg =
        progress.status === 'behind'
            ? colors.dangerSoft
            : progress.status === 'completed' || progress.status === 'ahead'
                ? colors.successSoft
                : colors.warningSoft;

    const statusMessage =
        progress.status === 'behind'
            ? `You're behind schedule — ${Math.abs(progress.daysLeft)} days left`
            : progress.status === 'ahead'
                ? 'Great job — ahead of schedule!'
                : progress.status === 'completed'
                    ? 'Goal completed 🎉'
                    : `${progress.daysLeft} days left`;

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                {
                    backgroundColor: colors.card,
                    borderRadius: Radius['3xl'],
                    padding: Spacing.lg,
                    borderWidth: 1,
                    borderColor: colors.border,
                    ...Shadows.sm,
                },
                pressed && onPress && { opacity: 0.95, transform: [{ scale: 0.99 }] },
                style,
            ]}
        >
            {/* Header */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: Spacing.md,
                    marginBottom: Spacing.lg,
                }}
            >
                <View
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: Radius.lg,
                        backgroundColor: colors.warningSoft,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text style={{ fontSize: 22 }}>{goal.icon}</Text>
                </View>

                <View style={{ flex: 1, minWidth: 0 }}>
                    <Text variant="body" weight="bold" numberOfLines={1}>
                        {goal.title}
                    </Text>
                    <Text
                        variant="meta"
                        color={colors.textSecondary}
                        style={{ marginTop: 2 }}
                    >
                        Target: {formatCurrency(goal.target, currency)}
                    </Text>
                </View>

                {onMenuPress && (
                    <Pressable onPress={onMenuPress} hitSlop={8}>
                        <MoreVertical size={18} color={colors.textSecondary} />
                    </Pressable>
                )}
            </View>

            {/* Amount */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'baseline',
                    gap: Spacing.xs,
                    marginBottom: Spacing.md,
                }}
            >
                <Text variant="h2" weight="bold">
                    {formatCurrency(goal.current, currency)}
                </Text>
                <Text variant="caption" color={colors.textSecondary}>
                    of {formatCurrency(goal.target, currency)}
                </Text>
            </View>

            {/* Progress bar */}
            <ProgressBar
                percent={progress.percent}
                color={statusColor}
                style={{ marginBottom: Spacing.sm }}
            />

            {/* Bottom labels */}
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: Spacing.md,
                }}
            >
                <Text variant="meta" color={colors.textSecondary} weight="semibold">
                    {Math.round(progress.percent)}% complete
                </Text>
                <Text variant="meta" color={colors.textSecondary} weight="semibold">
                    {formatCurrency(progress.remaining, currency)} to go
                </Text>
            </View>

            {/* Status banner */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: Spacing.sm,
                    backgroundColor: statusBg,
                    paddingHorizontal: Spacing.md,
                    paddingVertical: Spacing.sm,
                    borderRadius: Radius.lg,
                }}
            >
                <Clock size={14} color={statusColor} />
                <Text variant="meta" color={statusColor} weight="semibold" style={{ flex: 1 }}>
                    {statusMessage}
                </Text>
            </View>
        </Pressable>
    );
}

export default GoalCard;