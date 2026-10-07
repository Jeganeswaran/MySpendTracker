import React, { useMemo, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@hooks/useTheme';
import { useExpenseStore } from '@stores/useExpenseStore';
import { useIncomeStore } from '@stores/useIncomeStore';

import { Text } from '@components/ui/Text';
import { Card } from '@components/ui/Card';
import { SegmentControl } from '@components/ui/SegmentControl';
import { ProgressBar } from '@components/shared/ProgressBar';
import { DonutChart } from '@components/shared/DonutChart';
import { CategoryCard } from '@components/shared/CategoryCard';

import { formatCurrency } from '@utils/formatCurrency';
import { getTopCategories, getWeeklyTotals } from '@utils/calculations';
import { getCategoryConfig } from '@constants/categories';
import type { CategoryType } from '@app-types/category';

type Period = 'week' | 'month' | 'year';

const PERIOD_OPTIONS = [
    { label: 'Week', value: 'week' as Period },
    { label: 'Month', value: 'month' as Period },
    { label: 'Year', value: 'year' as Period },
];

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function AnalyticsScreen() {
    const { colors, Spacing, Radius } = useTheme();
    const [period, setPeriod] = useState<Period>('month');

    const allExpenses = useExpenseStore((s) => s.expenses);
    const allIncomes = useIncomeStore((s) => s.incomes);

    const { filteredExpenses, filteredIncomes } = useMemo(() => {
        const now = new Date();
        const todayISO = now.toISOString().slice(0, 10);

        if (period === 'week') {
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - 6);
            const weekStartISO = weekStart.toISOString().slice(0, 10);
            return {
                filteredExpenses: allExpenses.filter((e) => e.date >= weekStartISO),
                filteredIncomes: allIncomes.filter((i) => i.date >= weekStartISO),
            };
        }

        if (period === 'month') {
            const monthKey = todayISO.slice(0, 7);
            return {
                filteredExpenses: allExpenses.filter((e) => e.date.startsWith(monthKey)),
                filteredIncomes: allIncomes.filter((i) => i.date.startsWith(monthKey)),
            };
        }

        // year
        const yearKey = String(now.getFullYear());
        return {
            filteredExpenses: allExpenses.filter((e) => e.date.startsWith(yearKey)),
            filteredIncomes: allIncomes.filter((i) => i.date.startsWith(yearKey)),
        };
    }, [allExpenses, allIncomes, period]);

    const totalExpenses = filteredExpenses.reduce((s, e) => s + e.amount, 0);
    const totalIncome = filteredIncomes.reduce((s, i) => s + i.amount, 0);
    const net = totalIncome - totalExpenses;

    const topCategories = useMemo(
        () => getTopCategories(filteredExpenses, 5),
        [filteredExpenses],
    );

    const donutData = useMemo(
        () =>
            topCategories.map((c) => ({
                value: c.total,
                color: getCategoryConfig(c.category).color,
            })),
        [topCategories],
    );

    // Bar chart data
    const barData = useMemo(() => {
        if (period === 'week') {
            const totals = getWeeklyTotals(filteredExpenses);
            return DAY_LABELS.map((label, i) => ({ label, value: totals[i] }));
        }
        if (period === 'month') {
            const byDay: Record<string, number> = {};
            for (const e of filteredExpenses) {
                const day = e.date.slice(8, 10);
                byDay[day] = (byDay[day] ?? 0) + e.amount;
            }
            return Object.entries(byDay)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([label, value]) => ({ label, value }));
        }
        // year
        const byMonth = new Array(12).fill(0);
        for (const e of filteredExpenses) {
            const m = parseInt(e.date.slice(5, 7), 10) - 1;
            byMonth[m] += e.amount;
        }
        return MONTH_LABELS.map((label, i) => ({ label, value: byMonth[i] }));
    }, [filteredExpenses, period]);

    const maxBarValue = Math.max(...barData.map((d) => d.value), 1);

    const netColor = net >= 0 ? colors.success : colors.danger;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
            <ScrollView
                contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={{ paddingTop: Spacing.lg, marginBottom: Spacing.lg }}>
                    <Text variant="h1">Analytics</Text>
                </View>

                {/* Period Selector */}
                <SegmentControl
                    options={PERIOD_OPTIONS}
                    value={period}
                    onChange={setPeriod}
                    style={{ marginBottom: Spacing.xl }}
                />

                {/* Summary Row */}
                <View
                    style={{
                        flexDirection: 'row',
                        gap: Spacing.sm,
                        marginBottom: Spacing.xl,
                    }}
                >
                    <SummaryCard
                        label="Income"
                        value={totalIncome}
                        color={colors.success}
                        bg={colors.successSoft}
                    />
                    <SummaryCard
                        label="Expenses"
                        value={totalExpenses}
                        color={colors.danger}
                        bg={colors.dangerSoft}
                    />
                    <SummaryCard
                        label="Net"
                        value={Math.abs(net)}
                        color={netColor}
                        bg={net >= 0 ? colors.successSoft : colors.dangerSoft}
                        prefix={net < 0 ? '-' : '+'}
                    />
                </View>

                {/* Donut Chart */}
                {donutData.length > 0 && (
                    <Card style={{ alignItems: 'center', marginBottom: Spacing.xl, paddingVertical: Spacing.xl }}>
                        <Text variant="body" weight="bold" style={{ marginBottom: Spacing.lg }}>
                            Spending Breakdown
                        </Text>
                        <DonutChart
                            data={donutData}
                            size={200}
                            strokeWidth={28}
                            centerLabel="Total"
                            centerValue={formatCurrency(totalExpenses)}
                        />
                    </Card>
                )}

                {/* Bar Chart */}
                {barData.some((d) => d.value > 0) && (
                    <Card style={{ marginBottom: Spacing.xl }}>
                        <Text variant="body" weight="bold" style={{ marginBottom: Spacing.lg }}>
                            {period === 'week' ? 'Daily (This Week)' : period === 'month' ? 'Daily Spending' : 'Monthly Spending'}
                        </Text>
                        {barData.map((item) => (
                            <View
                                key={item.label}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: Spacing.sm,
                                    marginBottom: Spacing.sm,
                                }}
                            >
                                <Text
                                    variant="label"
                                    color={colors.textSecondary}
                                    style={{ width: 36 }}
                                >
                                    {item.label}
                                </Text>
                                <ProgressBar
                                    percent={(item.value / maxBarValue) * 100}
                                    height={8}
                                    color={colors.primary}
                                    style={{ flex: 1 }}
                                />
                                <Text
                                    variant="label"
                                    color={colors.textSecondary}
                                    style={{ width: 68, textAlign: 'right' }}
                                >
                                    {formatCurrency(item.value)}
                                </Text>
                            </View>
                        ))}
                    </Card>
                )}

                {/* Top Categories */}
                {topCategories.length > 0 && (
                    <>
                        <Text variant="body" weight="bold" style={{ marginBottom: Spacing.md }}>
                            Top Categories
                        </Text>
                        <View style={{ gap: Spacing.sm, marginBottom: Spacing.xl }}>
                            {topCategories.map((c) => (
                                <CategoryCard
                                    key={c.category}
                                    category={c.category as CategoryType}
                                    amount={c.total}
                                    total={totalExpenses}
                                    percent={c.percent}
                                />
                            ))}
                        </View>
                    </>
                )}

                {/* Income vs Expenses Ratio */}
                {(totalIncome > 0 || totalExpenses > 0) && (
                    <Card style={{ marginBottom: Spacing.xl }}>
                        <Text variant="body" weight="bold" style={{ marginBottom: Spacing.lg }}>
                            Income vs Expenses
                        </Text>
                        {[
                            { label: 'Income', value: totalIncome, color: colors.success, total: totalIncome + totalExpenses },
                            { label: 'Expenses', value: totalExpenses, color: colors.danger, total: totalIncome + totalExpenses },
                        ].map((row) => (
                            <View key={row.label} style={{ marginBottom: Spacing.md }}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginBottom: 4,
                                    }}
                                >
                                    <Text variant="caption" color={colors.textSecondary}>
                                        {row.label}
                                    </Text>
                                    <Text variant="caption" weight="semibold">
                                        {formatCurrency(row.value)}
                                    </Text>
                                </View>
                                <ProgressBar
                                    percent={row.total > 0 ? (row.value / row.total) * 100 : 0}
                                    height={10}
                                    color={row.color}
                                />
                            </View>
                        ))}
                    </Card>
                )}

                {/* Empty state */}
                {filteredExpenses.length === 0 && filteredIncomes.length === 0 && (
                    <View style={{ paddingVertical: 80, alignItems: 'center' }}>
                        <Text style={{ fontSize: 48 }}>📊</Text>
                        <Text variant="body" weight="semibold" style={{ marginTop: Spacing.md }}>
                            No data for this period
                        </Text>
                        <Text variant="caption" color={colors.textSecondary} style={{ marginTop: Spacing.sm }}>
                            Add transactions to see your analytics
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

interface SummaryCardProps {
    label: string;
    value: number;
    color: string;
    bg: string;
    prefix?: string;
}

function SummaryCard({ label, value, color, bg, prefix }: SummaryCardProps) {
    const { colors, Spacing, Radius } = useTheme();
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: bg,
                borderRadius: Radius.xl,
                padding: Spacing.md,
                alignItems: 'center',
            }}
        >
            <Text variant="meta" color={colors.textSecondary} style={{ marginBottom: 4 }}>
                {label}
            </Text>
            <Text variant="amount" weight="bold" color={color} numberOfLines={1}>
                {prefix}{formatCurrency(value)}
            </Text>
        </View>
    );
}

export default AnalyticsScreen;
