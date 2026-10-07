import React, { useState } from 'react';
import { View, FlatList, Pressable, Alert, ActionSheetIOS, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Plus, Trash2 } from 'lucide-react-native';

import { useTheme } from '@hooks/useTheme';
import { useSettingsStore } from '@stores/useSettingsStore';
import { Text } from '@components/ui/Text';
import { Card } from '@components/ui/Card';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { IconButton } from '@components/ui/IconButton';
import { CURRENCIES } from '@constants/currencies';
import type { AccountType } from '@app-types/settings';

const ACCOUNT_TYPES: { label: string; value: AccountType; emoji: string }[] = [
    { label: 'Cash', value: 'cash', emoji: '💵' },
    { label: 'Debit Card', value: 'debit_card', emoji: '💳' },
    { label: 'Credit Card', value: 'credit_card', emoji: '💎' },
    { label: 'Bank Account', value: 'bank_account', emoji: '🏦' },
    { label: 'Loan', value: 'loan', emoji: '📋' },
    { label: 'Other', value: 'other', emoji: '📂' },
];

const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
    cash: 'Cash',
    debit_card: 'Debit Card',
    credit_card: 'Credit Card',
    bank_account: 'Bank Account',
    loan: 'Loan',
    other: 'Other',
};

export function AccountsScreen() {
    const { colors, Spacing, Radius } = useTheme();
    const navigation = useNavigation();

    const accounts = useSettingsStore((s) => s.accounts);
    const addAccount = useSettingsStore((s) => s.addAccount);
    const removeAccount = useSettingsStore((s) => s.removeAccount);

    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [accountType, setAccountType] = useState<AccountType>('cash');
    const [balance, setBalance] = useState('');
    const [currency, setCurrency] = useState('USD');

    const handlePickCurrency = () => {
        const options = CURRENCIES.map((c) => `${c.code} — ${c.name}`);
        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                { options: [...options, 'Cancel'], cancelButtonIndex: options.length },
                (index) => {
                    if (index < options.length) setCurrency(CURRENCIES[index].code);
                },
            );
        } else {
            Alert.alert(
                'Select Currency',
                undefined,
                [
                    ...CURRENCIES.map((c) => ({
                        text: `${c.code} — ${c.name}`,
                        onPress: () => setCurrency(c.code),
                    })),
                    { text: 'Cancel', style: 'cancel' as const },
                ],
            );
        }
    };

    const handleSave = () => {
        if (!name.trim()) {
            Alert.alert('Name required', 'Please enter an account name.');
            return;
        }
        addAccount({
            name: name.trim(),
            type: accountType,
            balance: parseFloat(balance) || 0,
            currency,
            archived: false,
        });
        setName('');
        setBalance('');
        setAccountType('cash');
        setCurrency('USD');
        setShowForm(false);
    };

    const handleDelete = (id: string, accountName: string) => {
        Alert.alert(`Delete "${accountName}"?`, 'This cannot be undone.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => removeAccount(id) },
        ]);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
            {/* Header */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: Spacing.lg,
                    paddingTop: Spacing.lg,
                    paddingBottom: Spacing.md,
                }}
            >
                <IconButton
                    icon={<ChevronLeft size={20} color={colors.text} />}
                    onPress={() => navigation.goBack()}
                />
                <Text variant="h2" style={{ flex: 1 }}>
                    Accounts
                </Text>
                <IconButton
                    icon={<Plus size={20} color={colors.primary} />}
                    onPress={() => setShowForm((v) => !v)}
                />
            </View>

            <FlatList
                data={accounts}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: 60 }}
                ListHeaderComponent={
                    showForm ? (
                        <Card style={{ marginBottom: Spacing.lg }}>
                            <Text variant="body" weight="bold" style={{ marginBottom: Spacing.md }}>
                                New Account
                            </Text>
                            <View style={{ gap: Spacing.md }}>
                                <Input
                                    label="Account Name"
                                    placeholder="e.g. Main Checking"
                                    value={name}
                                    onChangeText={setName}
                                />

                                <Text variant="caption" color={colors.textSecondary} style={{ marginBottom: 4 }}>
                                    TYPE
                                </Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
                                    {ACCOUNT_TYPES.map((t) => {
                                        const active = accountType === t.value;
                                        return (
                                            <Pressable
                                                key={t.value}
                                                onPress={() => setAccountType(t.value)}
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    gap: 6,
                                                    paddingHorizontal: Spacing.md,
                                                    paddingVertical: 8,
                                                    borderRadius: Radius.full,
                                                    backgroundColor: active ? colors.primarySoft : colors.cardAlt,
                                                    borderWidth: 1,
                                                    borderColor: active ? colors.primary : colors.border,
                                                }}
                                            >
                                                <Text style={{ fontSize: 14 }}>{t.emoji}</Text>
                                                <Text
                                                    variant="label"
                                                    color={active ? colors.primary : colors.text}
                                                >
                                                    {t.label}
                                                </Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>

                                <Input
                                    label="Opening Balance"
                                    placeholder="0.00"
                                    value={balance}
                                    onChangeText={setBalance}
                                    keyboardType="decimal-pad"
                                />

                                <Pressable
                                    onPress={handlePickCurrency}
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingVertical: Spacing.sm,
                                        borderBottomWidth: 1,
                                        borderBottomColor: colors.border,
                                    }}
                                >
                                    <Text variant="caption" color={colors.textSecondary}>
                                        Currency
                                    </Text>
                                    <Text variant="body" weight="semibold">
                                        {currency}
                                    </Text>
                                </Pressable>

                                <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm }}>
                                    <Button
                                        label="Cancel"
                                        variant="ghost"
                                        onPress={() => setShowForm(false)}
                                        style={{ flex: 1 }}
                                    />
                                    <Button
                                        label="Save"
                                        onPress={handleSave}
                                        style={{ flex: 1 }}
                                    />
                                </View>
                            </View>
                        </Card>
                    ) : null
                }
                ListEmptyComponent={
                    !showForm ? (
                        <View style={{ paddingVertical: 60, alignItems: 'center' }}>
                            <Text style={{ fontSize: 40 }}>🏦</Text>
                            <Text variant="body" weight="semibold" style={{ marginTop: Spacing.md }}>
                                No accounts yet
                            </Text>
                            <Text variant="caption" color={colors.textSecondary} style={{ marginTop: 4 }}>
                                Tap + to add your first account
                            </Text>
                        </View>
                    ) : null
                }
                renderItem={({ item }) => (
                    <Card
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: Spacing.sm,
                        }}
                    >
                        <Text style={{ fontSize: 24, marginRight: Spacing.md }}>
                            {ACCOUNT_TYPES.find((t) => t.value === item.type)?.emoji ?? '📂'}
                        </Text>
                        <View style={{ flex: 1 }}>
                            <Text variant="body" weight="semibold">
                                {item.name}
                            </Text>
                            <Text variant="caption" color={colors.textSecondary}>
                                {ACCOUNT_TYPE_LABELS[item.type]} · {item.currency}
                            </Text>
                        </View>
                        <IconButton
                            icon={<Trash2 size={16} color={colors.danger} />}
                            onPress={() => handleDelete(item.id, item.name)}
                        />
                    </Card>
                )}
            />
        </SafeAreaView>
    );
}

export default AccountsScreen;
