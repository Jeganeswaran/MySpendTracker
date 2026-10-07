import React, { useMemo, useState } from 'react';
import { View, SectionList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '@hooks/useTheme';
import { useExpenseStore } from '@stores/useExpenseStore';
import { Text } from '@components/ui/Text';
import { Chip } from '@components/ui/Chip';
import { IconButton } from '@components/ui/IconButton';
import { TransactionItem } from '@components/shared/TransactionItem';
import { Plus, Search } from 'lucide-react-native';

import { formatDate, getDateGroupLabel } from '@utils/formatDate';
import { groupBy } from '@utils/array';
import { sum } from '@utils/calculations';
import { formatCurrency } from '@utils/formatCurrency';

type Filter = 'all' | 'today' | 'week' | 'month';

const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
];

export function TransactionsScreen() {
    const { colors, Spacing } = useTheme();
    const navigation = useNavigation<any>();
    const [filter, setFilter] = useState<Filter>('all');
    const expenses = useExpenseStore((s) => s.expenses);

    // Group by date
    const sections = useMemo(() => {
        const grouped = groupBy(expenses, (e) => e.date);
        return Object.entries(grouped)
            .sort(([a], [b]) => (a > b ? -1 : 1))
            .map(([date, items]) => ({
                title: getDateGroupLabel(date),
                total: sum(items),
                data: items,
            }));
    }, [expenses]);

    const total = sum(expenses);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
            {/* Header */}
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: Spacing.lg,
                    paddingTop: Spacing.lg,
                }}
            >
                <Text variant="h1">Transactions</Text>
                <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
                    <IconButton
                        icon={<Search size={18} color={colors.text} />}
                        onPress={() => navigation.navigate('Search')}
                    />
                    <IconButton
                        variant="filled"
                        icon={<Plus size={18} color="#FFF" />}
                        onPress={() => navigation.navigate('AddExpense')}
                    />
                </View>
            </View>

            {/* Total */}
            <View style={{ paddingHorizontal: Spacing.lg, marginTop: Spacing.lg }}>
                <Text variant="meta" color={colors.textSecondary}>
                    Total this month
                </Text>
                <Text variant="display" style={{ marginTop: 4 }}>
                    {formatCurrency(total)}
                </Text>
            </View>

            {/* Filters */}
            <View
                style={{
                    flexDirection: 'row',
                    gap: Spacing.sm,
                    paddingHorizontal: Spacing.lg,
                    marginTop: Spacing.lg,
                    marginBottom: Spacing.sm,
                }}
            >
                {FILTERS.map((f) => (
                    <Chip
                        key={f.key}
                        label={f.label}
                        active={filter === f.key}
                        onPress={() => setFilter(f.key)}
                        size="sm"
                    />
                ))}
            </View>

            {/* List */}
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{
                    paddingHorizontal: Spacing.lg,
                    paddingBottom: 120,
                }}
                showsVerticalScrollIndicator={false}
                renderSectionHeader={({ section }) => (
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingTop: Spacing.lg,
                            paddingBottom: Spacing.sm,
                        }}
                    >
                        <Text variant="meta" color={colors.textSecondary} weight="bold">
                            {section.title}
                        </Text>
                        <Text variant="meta" color={colors.textSecondary} weight="bold">
                            {formatCurrency(section.total)}
                        </Text>
                    </View>
                )}
                renderItem={({ item }) => (
                    <TransactionItem
                        title={item.title}
                        amount={-item.amount}
                        category={item.category}
                        date={formatDate(item.date, 'MMM d')}
                        onPress={() => navigation.navigate('AddExpense', { expenseId: item.id })}
                        style={{ marginBottom: Spacing.sm }}
                    />
                )}
                ListEmptyComponent={
                    <View style={{ paddingVertical: 80, alignItems: 'center' }}>
                        <Text style={{ fontSize: 48 }}>📭</Text>
                        <Text variant="body" weight="semibold" style={{ marginTop: Spacing.md }}>
                            No transactions yet
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

export default TransactionsScreen;