import React, { useMemo, useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { addMonths, subMonths, getDaysInMonth } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

import { useTheme } from '@hooks/useTheme';
import { useExpenseStore } from '@stores/useExpenseStore';
import { Text } from '@components/ui/Text';
import { IconButton } from '@components/ui/IconButton';
import { TransactionItem } from '@components/shared/TransactionItem';
import { formatCurrency } from '@utils/formatCurrency';
import { formatDate } from '@utils/formatDate';

const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function CalendarScreen() {
    const { colors, Spacing, Radius } = useTheme();
    const navigation = useNavigation();
    const expenses = useExpenseStore((s) => s.expenses);

    const [currentMonth, setCurrentMonth] = useState(() => {
        const d = new Date();
        return new Date(d.getFullYear(), d.getMonth(), 1);
    });
    const [selectedDay, setSelectedDay] = useState<string | null>(null);

    const todayISO = new Date().toISOString().slice(0, 10);

    // Group expenses by date
    const expensesByDate = useMemo(() => {
        const map: Record<string, typeof expenses> = {};
        for (const e of expenses) {
            if (!map[e.date]) map[e.date] = [];
            map[e.date].push(e);
        }
        return map;
    }, [expenses]);

    // Build calendar grid (Monday-first)
    const calendarDays = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const totalDays = getDaysInMonth(currentMonth);
        // Monday-first offset: (getDay() + 6) % 7
        const offset = (firstDay.getDay() + 6) % 7;
        const cells: (string | null)[] = [];
        for (let i = 0; i < offset; i++) cells.push(null);
        for (let d = 1; d <= totalDays; d++) {
            const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            cells.push(iso);
        }
        // Pad to multiple of 7
        while (cells.length % 7 !== 0) cells.push(null);
        return cells;
    }, [currentMonth]);

    const monthLabel = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

    const selectedExpenses = selectedDay ? (expensesByDate[selectedDay] ?? []) : [];
    const selectedTotal = selectedExpenses.reduce((s, e) => s + e.amount, 0);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
            {/* Header */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: Spacing.lg,
                    paddingTop: Spacing.lg,
                    paddingBottom: Spacing.sm,
                }}
            >
                <IconButton
                    icon={<ChevronLeft size={20} color={colors.text} />}
                    onPress={() => navigation.goBack()}
                />
                <Text variant="h2" style={{ flex: 1, textAlign: 'center' }}>
                    {monthLabel}
                </Text>
                <View style={{ flexDirection: 'row', gap: 4 }}>
                    <IconButton
                        icon={<ChevronLeft size={18} color={colors.text} />}
                        onPress={() => {
                            setCurrentMonth((m) => subMonths(m, 1));
                            setSelectedDay(null);
                        }}
                    />
                    <IconButton
                        icon={<ChevronRight size={18} color={colors.text} />}
                        onPress={() => {
                            setCurrentMonth((m) => addMonths(m, 1));
                            setSelectedDay(null);
                        }}
                    />
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Day headers */}
                <View
                    style={{
                        flexDirection: 'row',
                        paddingHorizontal: Spacing.md,
                        marginBottom: Spacing.xs,
                    }}
                >
                    {DAY_HEADERS.map((d) => (
                        <Text
                            key={d}
                            variant="label"
                            color={colors.textSecondary}
                            style={{ flex: 1, textAlign: 'center' }}
                        >
                            {d}
                        </Text>
                    ))}
                </View>

                {/* Calendar Grid */}
                <View
                    style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        paddingHorizontal: Spacing.md,
                        marginBottom: Spacing.lg,
                    }}
                >
                    {calendarDays.map((iso, idx) => {
                        if (!iso) {
                            return (
                                <View
                                    key={`empty-${idx}`}
                                    style={{ width: `${100 / 7}%`, aspectRatio: 1 }}
                                />
                            );
                        }

                        const dayExpenses = expensesByDate[iso] ?? [];
                        const hasTx = dayExpenses.length > 0;
                        const dayTotal = dayExpenses.reduce((s, e) => s + e.amount, 0);
                        const isSelected = selectedDay === iso;
                        const isToday = iso === todayISO;
                        const dayNum = parseInt(iso.slice(8, 10), 10);

                        return (
                            <Pressable
                                key={iso}
                                onPress={() => setSelectedDay(isSelected ? null : iso)}
                                style={{
                                    width: `${100 / 7}%`,
                                    aspectRatio: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: Radius.lg,
                                    backgroundColor: isSelected ? colors.primarySoft : 'transparent',
                                    padding: 2,
                                }}
                            >
                                <Text
                                    variant="caption"
                                    weight={isToday ? 'bold' : 'regular'}
                                    color={isSelected ? colors.primary : isToday ? colors.primary : colors.text}
                                >
                                    {dayNum}
                                </Text>
                                {hasTx && (
                                    <>
                                        <View
                                            style={{
                                                width: 5,
                                                height: 5,
                                                borderRadius: 3,
                                                backgroundColor: isSelected ? colors.primary : colors.danger,
                                                marginTop: 1,
                                            }}
                                        />
                                        <Text
                                            variant="label"
                                            color={isSelected ? colors.primary : colors.textTertiary}
                                            style={{ fontSize: 8 }}
                                        >
                                            {formatCurrency(dayTotal, undefined, { compact: true })}
                                        </Text>
                                    </>
                                )}
                            </Pressable>
                        );
                    })}
                </View>

                {/* Selected Day Detail */}
                {selectedDay && (
                    <View style={{ paddingHorizontal: Spacing.lg }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: Spacing.md,
                            }}
                        >
                            <Text variant="body" weight="bold">
                                {formatDate(selectedDay, 'MMMM d, yyyy')}
                            </Text>
                            <Text variant="caption" color={colors.textSecondary}>
                                {formatCurrency(selectedTotal)}
                            </Text>
                        </View>

                        {selectedExpenses.length === 0 ? (
                            <View style={{ paddingVertical: Spacing.xl, alignItems: 'center' }}>
                                <Text variant="caption" color={colors.textSecondary}>
                                    No transactions on this day
                                </Text>
                            </View>
                        ) : (
                            <View style={{ gap: Spacing.sm, paddingBottom: 120 }}>
                                {selectedExpenses.map((e) => (
                                    <TransactionItem
                                        key={e.id}
                                        title={e.title}
                                        amount={-e.amount}
                                        category={e.category}
                                        date={formatDate(e.date, 'h:mm a')}
                                        onPress={() =>
                                            (navigation as any).navigate('AddExpense', { expenseId: e.id })
                                        }
                                    />
                                ))}
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

export default CalendarScreen;
