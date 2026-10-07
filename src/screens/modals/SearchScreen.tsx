import React, { useState, useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '@hooks/useTheme';
import { Text } from '@components/ui/Text';
import { SearchBar } from '@components/shared/SearchBar';
import { TransactionItem } from '@components/shared/TransactionItem';
import { Chip } from '@components/ui/Chip';

import { EXPENSE_CATEGORIES } from '@constants/categories';
import { formatDate } from '@utils/formatDate';
import type { CategoryType } from '@app-types/category';
import { useExpenseStore } from '@stores';

export function SearchScreen() {
    const { colors, Spacing } = useTheme();
    const navigation = useNavigation<any>();
    const expenses = useExpenseStore((s) => s.expenses);

    const [query, setQuery] = useState('');
    const [category, setCategory] = useState<CategoryType | 'all'>('all');

    const results = useMemo(() => {
        return expenses.filter((e) => {
            const matchesQuery =
                !query ||
                e.title.toLowerCase().includes(query.toLowerCase()) ||
                e.note?.toLowerCase().includes(query.toLowerCase());
            const matchesCategory = category === 'all' || e.category === category;
            return matchesQuery && matchesCategory;
        });
    }, [expenses, query, category]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
            {/* Search Row */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: Spacing.sm,
                    paddingHorizontal: Spacing.lg,
                    paddingVertical: Spacing.md,
                }}
            >
                <SearchBar
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Search expenses..."
                    style={{ flex: 1 }}
                />
                <Text
                    variant="body"
                    color={colors.primary}
                    weight="semibold"
                    onPress={() => navigation.goBack()}
                >
                    Cancel
                </Text>
            </View>

            {/* Category Chips */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: Spacing.lg,
                    gap: Spacing.sm,
                    paddingBottom: Spacing.sm,
                }}
            >
                <Chip
                    label="All"
                    active={category === 'all'}
                    onPress={() => setCategory('all')}
                    size="sm"
                />
                {EXPENSE_CATEGORIES.map((cat) => (
                    <Chip
                        key={cat.key}
                        label={`${cat.emoji} ${cat.label}`}
                        active={category === cat.key}
                        onPress={() => setCategory(cat.key as CategoryType)}
                        size="sm"
                    />
                ))}
            </ScrollView>

            {/* Results */}
            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: Spacing.lg,
                    paddingBottom: 40,
                    paddingTop: Spacing.lg,
                }}
                showsVerticalScrollIndicator={false}
            >
                <Text variant="meta" color={colors.textSecondary} style={{ marginBottom: Spacing.md }}>
                    {results.length} result{results.length === 1 ? '' : 's'}
                </Text>

                {results.map((expense) => (
                    <TransactionItem
                        key={expense.id}
                        title={expense.title}
                        amount={-expense.amount}
                        category={expense.category}
                        date={formatDate(expense.date, 'MMM d, h:mm a')}
                        onPress={() => navigation.navigate('AddExpense', { expenseId: expense.id })}
                        style={{ marginBottom: Spacing.sm }}
                    />
                ))}

                {results.length === 0 && (
                    <View style={{ alignItems: 'center', paddingVertical: 80 }}>
                        <Text style={{ fontSize: 48 }}>🔍</Text>
                        <Text variant="body" weight="semibold" style={{ marginTop: Spacing.md }}>
                            No matches found
                        </Text>
                        <Text variant="caption" color={colors.textSecondary} style={{ marginTop: 4 }}>
                            Try a different search or filter
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

export default SearchScreen;