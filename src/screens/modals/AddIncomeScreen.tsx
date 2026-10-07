import React, { useState } from 'react';
import { View, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';

import { useTheme } from '@hooks/useTheme';
import { useIncomeStore } from '@stores/useIncomeStore';
import { useToastStore } from '@stores/useToastStore';
import { Text } from '@components/ui/Text';
import { Button } from '@components/ui/Button';
import { IconButton } from '@components/ui/IconButton';
import { Input } from '@components/ui/Input';

import { X, Delete, Trash2 } from 'lucide-react-native';
import { INCOME_CATEGORIES } from '@constants/categories';
import { getTodayISO } from '@utils/formatDate';
import type { IncomeCategoryType } from '@app-types/category';
import type { RootStackParamList } from '@navigation/types';

type AddIncomeRouteProp = RouteProp<RootStackParamList, 'AddIncome'>;

export function AddIncomeScreen() {
    const { colors, Spacing, Radius } = useTheme();
    const navigation = useNavigation();
    const route = useRoute<AddIncomeRouteProp>();

    const incomeId = route.params?.incomeId;
    const existingIncome = useIncomeStore((s) =>
        incomeId ? s.incomes.find((i) => i.id === incomeId) : undefined,
    );
    const isEditing = !!existingIncome;

    const addIncome = useIncomeStore((s) => s.addIncome);
    const updateIncome = useIncomeStore((s) => s.updateIncome);
    const removeIncome = useIncomeStore((s) => s.removeIncome);
    const toast = useToastStore();

    const [amount, setAmount] = useState(
        existingIncome ? String(existingIncome.amount) : '0',
    );
    const [category, setCategory] = useState<IncomeCategoryType>(
        existingIncome?.category ?? 'salary',
    );
    const [title, setTitle] = useState(existingIncome?.title ?? '');
    const [note, setNote] = useState(existingIncome?.note ?? '');

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

        if (isEditing) {
            updateIncome(incomeId!, {
                title: title.trim(),
                amount: numAmount,
                category,
                note: note.trim() || undefined,
            });
            toast.success('Income updated!');
        } else {
            addIncome({
                title: title.trim(),
                amount: numAmount,
                category,
                date: getTodayISO(),
                note: note.trim() || undefined,
            });
            toast.success('Income saved!');
        }

        navigation.goBack();
    };

    const handleDelete = () => {
        Alert.alert('Delete income', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                    removeIncome(incomeId!);
                    toast.success('Income deleted');
                    navigation.goBack();
                },
            },
        ]);
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
                <Text variant="body" weight="bold">
                    {isEditing ? 'Edit Income' : 'Add Income'}
                </Text>
                {isEditing ? (
                    <IconButton
                        icon={<Trash2 size={18} color={colors.danger} />}
                        onPress={handleDelete}
                    />
                ) : (
                    <View style={{ width: 40 }} />
                )}
            </View>

            <ScrollView
                contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: 40 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Amount Card */}
                <View
                    style={{
                        backgroundColor: colors.successSoft,
                        borderRadius: Radius['3xl'],
                        paddingVertical: Spacing['2xl'],
                        alignItems: 'center',
                        marginBottom: Spacing.xl,
                    }}
                >
                    <Text variant="meta" color={colors.success} weight="bold">
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
                        <Text variant="h2" color={colors.success} style={{ marginTop: 6 }}>$</Text>
                        <Text variant="hero" weight="bold" color={colors.success}>{amount}</Text>
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
                    {INCOME_CATEGORIES.map((cat) => {
                        const active = cat.key === category;
                        return (
                            <Pressable
                                key={cat.key}
                                onPress={() => setCategory(cat.key as IncomeCategoryType)}
                                style={{
                                    width: '23%',
                                    aspectRatio: 1,
                                    borderRadius: Radius['2xl'],
                                    backgroundColor: active ? colors.successSoft : colors.card,
                                    borderWidth: 2,
                                    borderColor: active ? colors.success : colors.border,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 4,
                                }}
                            >
                                <Text style={{ fontSize: 22 }}>{cat.emoji}</Text>
                                <Text variant="label" color={active ? colors.success : colors.text}>
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
                        placeholder="e.g. Monthly salary"
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
                <Button
                    label={isEditing ? 'Save Changes' : 'Save Income'}
                    onPress={handleSave}
                    fullWidth
                    size="lg"
                />
            </View>
        </SafeAreaView>
    );
}

export default AddIncomeScreen;
