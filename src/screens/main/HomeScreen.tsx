import React from 'react';
import { ScrollView, View, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTheme } from '@hooks/useTheme';
import { useExpenseStore } from '@stores/useExpenseStore';
import { useAuthStore } from '@stores/useAuthStore';

import { Text } from '@components/ui/Text';
import { IconButton } from '@components/ui/IconButton';
import { BalanceCard } from '@components/shared/BalanceCard';
import { TransactionItem } from '@components/shared/TransactionItem';
import { CategoryCard } from '@components/shared/CategoryCard';
import { ProgressRing } from '@components/shared/ProgressRing';

import { Bell, Search } from 'lucide-react-native';
import { getTimeOfDayGreeting, getTodayISO, formatDate } from '@utils/formatDate';
import { getExpenseSummary, getTopCategories, sum } from '@utils/calculations';
import { formatCurrency } from '@utils/formatCurrency';

import type { RootStackParamList } from '@navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
    const { colors, Spacing, Radius } = useTheme();
    const navigation = useNavigation<Nav>();

    const user = useAuthStore((s) => s.user);
    const expenses = useExpenseStore((s) => s.expenses);

    const today = getTodayISO();
    const todayExpenses = expenses.filter((e) => e.date === today);
    const summary = getExpenseSummary(expenses);
    const topCategories = getTopCategories(expenses, 3);

    const balance = 12450.8; // ← from a wallet store
    const monthlyBudget = 3800;
    const monthSpent = sum(expenses);

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 800);
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: Spacing.lg,
                    paddingBottom: 120,
                }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                }
            >
                {/* Header */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingVertical: Spacing.lg,
                    }}
                >
                    <View>
                        <Text variant="meta" color={colors.textSecondary}>
                            {getTimeOfDayGreeting()},
                        </Text>
                        <Text variant="h1" style={{ marginTop: 2 }}>
                            {user?.name?.split(' ')[0] ?? 'Guest'} 👋
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
                        <IconButton
                            icon={<Search size={18} color={colors.text} />}
                            onPress={() => navigation.navigate('Search')}
                            accessibilityLabel="Search"
                        />
                        <IconButton
                            icon={<Bell size={18} color={colors.text} />}
                            onPress={() => navigation.navigate('Notifications')}
                            accessibilityLabel="Notifications"
                        />
                    </View>
                </View>

                {/* Balance Hero */}
                <BalanceCard amount={balance} changePercent={12.5} />

                {/* Monthly Budget */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: Spacing.md,
                        backgroundColor: colors.card,
                        borderRadius: Radius['2xl'],
                        padding: Spacing.lg,
                        borderWidth: 1,
                        borderColor: colors.border,
                        marginTop: Spacing.md,
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <Text variant="meta" color={colors.textSecondary}>
                            Monthly Budget
                        </Text>
                        <Text variant="h2" style={{ marginTop: 4 }}>
                            {formatCurrency(monthSpent)}
                        </Text>
                        <Text variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
                            of {formatCurrency(monthlyBudget)} used
                        </Text>
                    </View>
                    <ProgressRing
                        percent={(monthSpent / monthlyBudget) * 100}
                        size={56}
                        strokeWidth={5}
                        color={monthSpent > monthlyBudget ? colors.danger : colors.primary}
                    />
                </View>

                {/* Today's activity */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: Spacing.xl,
                        marginBottom: Spacing.md,
                    }}
                >
                    <Text variant="h3">Today's Activity</Text>
                    <Text
                        variant="caption"
                        color={colors.primary}
                        weight="semibold"
                        onPress={() => navigation.navigate('Main', { screen: 'Transactions' })}
                    >
                        See all
                    </Text>
                </View>

                {todayExpenses.length === 0 ? (
                    <View
                        style={{
                            padding: Spacing.xl,
                            borderRadius: Radius['2xl'],
                            backgroundColor: colors.card,
                            borderWidth: 1,
                            borderColor: colors.border,
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ fontSize: 40, marginBottom: Spacing.sm }}>🍃</Text>
                        <Text variant="body" weight="semibold">No expenses today</Text>
                        <Text variant="caption" color={colors.textSecondary} style={{ marginTop: 4, textAlign: 'center' }}>
                            Tap the + button to add your first entry
                        </Text>
                    </View>
                ) : (
                    todayExpenses.slice(0, 3).map((expense) => (
                        <TransactionItem
                            key={expense.id}
                            title={expense.title}
                            amount={-expense.amount}
                            category={expense.category}
                            date={formatDate(expense.date, 'h:mm a')}
                            onPress={() => navigation.navigate('AddExpense', { expenseId: expense.id })}
                            style={{ marginBottom: Spacing.sm }}
                        />
                    ))
                )}

                {/* Top Categories */}
                {topCategories.length > 0 && (
                    <>
                        <Text variant="h3" style={{ marginTop: Spacing.xl, marginBottom: Spacing.md }}>
                            Top Categories
                        </Text>
                        {topCategories.map((cat) => (
                            <CategoryCard
                                key={cat.category}
                                category={cat.category}
                                amount={cat.total}
                                total={summary.total}
                                trend={5.2}
                                style={{ marginBottom: Spacing.sm }}
                            />
                        ))}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

export default HomeScreen;