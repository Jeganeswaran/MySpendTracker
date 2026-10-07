import React, { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '@hooks/useTheme';
import { useExpenseStore } from '@stores/useExpenseStore';
import { useToastStore } from '@stores/useToastStore';
import { Text } from '@components/ui/Text';
import { Button } from '@components/ui/Button';
import { IconButton } from '@components/ui/IconButton';
import { Input } from '@components/ui/Input';

import { X, Delete } from 'lucide-react-native';
import { EXPENSE_CATEGORIES } from '@constants/categories';
import { getTodayISO } from '@utils/formatDate';
import type { CategoryType } from '@app-types/category';

export function AddExpenseScreen() {
    const { colors, Spacing, Radius } = useTheme();
    const navigation = useNavigation();

    const addExpense = useExpenseStore((s) => s.addExpense);
    const toast = useToastStore();

    const [amount, setAmount] = useState('0');
    const [category, setCategory] = useState<CategoryType>('food');
    const [title, setTitle] = useState('');
    const [note, setNote] = useState('');

    const handleKey = (key: string) => {
        if (key === '⌫') {
            setAmount((prev) => (prev.length <= 1 ? '0' : prev.slice(0, -1)));
            return;
        }
        if (key === '.' && amount.includes('.')) return;
        setAmount((prev) => (prev === '0' && key !== '.' ? key : prev + key));
    };

    const handleSave = () => {
        const numAmount = parseFloat(amount);
        if (!numAmount || numAmount <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }
        if (!title.trim()) {
            toast.error('Please add a title');
            return;
        }

        addExpense({
            title: title.trim(),
            amount: numAmount,
            category,
            date: getTodayISO(),
            note: note.trim() || undefined,
        });

        toast.success('Expense saved!');
        navigation.goBack();
    };

    const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
            {/* Header */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: Spacing.lg,
                    paddingVertical: Spacing.md,
                }}
            >
                <IconButton
                    icon={<X size={18} color={colors.text} />}
                    onPress={() => navigation.goBack()}
                />
                <Text variant="body" weight="bold">Add Expense</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: 40 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Amount Card */}
                <View
                    style={{
                        backgroundColor: colors.primarySoft,
                        borderRadius: Radius['3xl'],
                        paddingVertical: Spacing['2xl'],
                        alignItems: 'center',
                        marginBottom: Spacing.xl,
                    }}
                >
                    <Text variant="meta" color={colors.primary} weight="bold">
                        AMOUNT
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            gap: 2,
                            marginTop: Spacing.sm,
                        }}
                    >
                        <Text variant="h2" color={colors.primary} style={{ marginTop: 6 }}>$</Text>
                        <Text variant="hero" weight="bold">{amount}</Text>
                    </View>
                </View>

                {/* Categories */}
                <Text variant="body" weight="bold" style={{ marginBottom: Spacing.md }}>
                    Category
                </Text>
                <View
                    style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        gap: Spacing.sm,
                        marginBottom: Spacing.xl,
                    }}
                >
                    {EXPENSE_CATEGORIES.map((cat) => {
                        const active = cat.key === category;
                        return (
                            <Pressable
                                key={cat.key}
                                onPress={() => setCategory(cat.key as CategoryType)}
                                style={{
                                    width: '23%',
                                    aspectRatio: 1,
                                    borderRadius: Radius['2xl'],
                                    backgroundColor: active ? colors.primarySoft : colors.card,
                                    borderWidth: 2,
                                    borderColor: active ? colors.primary : colors.border,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 4,
                                }}
                            >
                                <Text style={{ fontSize: 22 }}>{cat.emoji}</Text>
                                <Text variant="label" color={active ? colors.primary : colors.text}>
                                    {cat.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                {/* Title + Note */}
                <View style={{ gap: Spacing.md, marginBottom: Spacing.xl }}>
                    <Input
                        label="Title"
                        placeholder="e.g. Coffee at Starbucks"
                        value={title}
                        onChangeText={setTitle}
                    />
                    <Input
                        label="Note (optional)"
                        placeholder="Add a note..."
                        value={note}
                        onChangeText={setNote}
                        multiline
                    />
                </View>

                {/* Keypad */}
                <View
                    style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        gap: Spacing.sm,
                        marginBottom: Spacing.xl,
                    }}
                >
                    {KEYS.map((key) => (
                        <Pressable
                            key={key}
                            onPress={() => handleKey(key)}
                            style={{
                                width: '31.5%',
                                height: 56,
                                borderRadius: Radius.xl,
                                backgroundColor: colors.card,
                                borderWidth: 1,
                                borderColor: colors.border,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {key === '⌫' ? (
                                <Delete size={20} color={colors.text} />
                            ) : (
                                <Text variant="h3">{key}</Text>
                            )}
                        </Pressable>
                    ))}
                </View>
            </ScrollView>

            {/* Save Button */}
            <View
                style={{
                    paddingHorizontal: Spacing.lg,
                    paddingBottom: Spacing.lg,
                    backgroundColor: colors.background,
                }}
            >
                <Button label="Save Expense" onPress={handleSave} fullWidth size="lg" />
            </View>
        </SafeAreaView>
    );
}

export default AddExpenseScreen;