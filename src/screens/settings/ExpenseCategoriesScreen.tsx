import React from 'react';
import { View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';

import { useTheme } from '@hooks/useTheme';
import { useSettingsStore } from '@stores/useSettingsStore';
import { Text } from '@components/ui/Text';
import { Switch } from '@components/ui/Switch';
import { IconButton } from '@components/ui/IconButton';
import { EXPENSE_CATEGORIES } from '@constants/categories';

export function ExpenseCategoriesScreen() {
    const { colors, Spacing, Radius } = useTheme();
    const navigation = useNavigation();

    const disabledExpenseCategories = useSettingsStore((s) => s.disabledExpenseCategories);
    const toggleExpenseCategory = useSettingsStore((s) => s.toggleExpenseCategory);

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
                    gap: Spacing.sm,
                }}
            >
                <IconButton
                    icon={<ChevronLeft size={20} color={colors.text} />}
                    onPress={() => navigation.goBack()}
                />
                <Text variant="h2">Expense Categories</Text>
            </View>

            <Text
                variant="caption"
                color={colors.textSecondary}
                style={{ paddingHorizontal: Spacing.lg, marginBottom: Spacing.md }}
            >
                Toggle which categories appear when adding expenses
            </Text>

            <FlatList
                data={EXPENSE_CATEGORIES}
                keyExtractor={(item) => item.key}
                contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: 60 }}
                ItemSeparatorComponent={() => (
                    <View style={{ height: 1, backgroundColor: colors.border }} />
                )}
                renderItem={({ item }) => {
                    const enabled = !disabledExpenseCategories.includes(item.key);
                    return (
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: Spacing.md,
                                gap: Spacing.md,
                            }}
                        >
                            <View
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: Radius.lg,
                                    backgroundColor: item.tint,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Text style={{ fontSize: 20 }}>{item.emoji}</Text>
                            </View>
                            <Text variant="body" weight="semibold" style={{ flex: 1 }}>
                                {item.label}
                            </Text>
                            <Switch
                                value={enabled}
                                onValueChange={() => toggleExpenseCategory(item.key)}
                            />
                        </View>
                    );
                }}
            />
        </SafeAreaView>
    );
}

export default ExpenseCategoriesScreen;
