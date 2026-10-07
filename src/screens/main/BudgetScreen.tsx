import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@hooks/useTheme';
import { useBudgetStore } from '@stores/useBudgetStore';
import { useGoalStore } from '@stores/useGoalStore';

import { Text } from '@components/ui/Text';
import { IconButton } from '@components/ui/IconButton';
import { GoalCard } from '@components/shared/GoalCard';
import { BudgetItem } from '@components/shared/BudgetItem';
import { ProgressBar } from '@components/shared/ProgressBar';
import { Plus } from 'lucide-react-native';

import { getBudgetSummary } from '@utils/calculations';
import { formatCurrency } from '@utils/formatCurrency';
import { formatMonthKey } from '@utils/formatDate';

export function BudgetScreen() {
    const { colors, Spacing, Radius } = useTheme();

    const budgets = useBudgetStore((s) => s.budgets);
    const goals = useGoalStore((s) => s.goals);

    const summary = getBudgetSummary(budgets);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
            <ScrollView
                contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: Spacing.lg,
                        marginBottom: Spacing.lg,
                    }}
                >
                    <Text variant="h1">My Plan</Text>
                    <IconButton
                        variant="filled"
                        icon={<Plus size={18} color="#FFF" />}
                        onPress={() => { }}
                    />
                </View>

                {/* Monthly Budget Hero */}
                <View
                    style={{
                        backgroundColor: colors.primarySoft,
                        borderRadius: Radius['3xl'],
                        padding: Spacing.xl,
                        marginBottom: Spacing.xl,
                    }}
                >
                    <Text variant="meta" color={colors.textSecondary}>
                        {formatMonthKey(new Date())} Budget
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'baseline',
                            gap: Spacing.sm,
                            marginTop: Spacing.sm,
                            marginBottom: Spacing.md,
                        }}
                    >
                        <Text variant="display" weight="bold">
                            {formatCurrency(summary.totalSpent)}
                        </Text>
                        <Text variant="caption" color={colors.textSecondary}>
                            of {formatCurrency(summary.totalLimit)}
                        </Text>
                    </View>
                    <ProgressBar
                        percent={summary.percentUsed}
                        color={summary.overBudget ? colors.danger : colors.primary}
                    />
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: Spacing.sm,
                        }}
                    >
                        <Text variant="meta" color={colors.textSecondary}>
                            {Math.round(summary.percentUsed)}% used
                        </Text>
                        <Text variant="meta" color={colors.textSecondary}>
                            {formatCurrency(summary.remaining)} left
                        </Text>
                    </View>
                </View>

                {/* Goals */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: Spacing.md,
                    }}
                >
                    <Text variant="h3">Goals</Text>
                    <Text variant="caption" color={colors.primary} weight="semibold">
                        View All
                    </Text>
                </View>

                {goals.slice(0, 2).map((goal) => (
                    <GoalCard key={goal.id} goal={goal} style={{ marginBottom: Spacing.md }} />
                ))}

                {/* Budgets */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: Spacing.lg,
                        marginBottom: Spacing.md,
                    }}
                >
                    <Text variant="h3">Category Budgets</Text>
                    <Text variant="caption" color={colors.primary} weight="semibold">
                        View All
                    </Text>
                </View>

                {budgets.map((budget) => (
                    <BudgetItem key={budget.id} budget={budget} style={{ marginBottom: Spacing.sm }} />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

export default BudgetScreen;