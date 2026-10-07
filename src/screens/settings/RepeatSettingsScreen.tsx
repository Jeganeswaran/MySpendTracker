import React from 'react';
import { View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Check } from 'lucide-react-native';

import { useTheme } from '@hooks/useTheme';
import { useSettingsStore } from '@stores/useSettingsStore';
import { Text } from '@components/ui/Text';
import { Card } from '@components/ui/Card';
import { IconButton } from '@components/ui/IconButton';
import type { RepeatInterval } from '@app-types/settings';

const INTERVALS: { label: string; value: RepeatInterval; description: string }[] = [
    { label: 'None', value: 'none', description: 'No repeat' },
    { label: 'Daily', value: 'daily', description: 'Repeats every day' },
    { label: 'Weekly', value: 'weekly', description: 'Repeats every week' },
    { label: 'Monthly', value: 'monthly', description: 'Repeats every month' },
    { label: 'Yearly', value: 'yearly', description: 'Repeats every year' },
];

export function RepeatSettingsScreen() {
    const { colors, Spacing } = useTheme();
    const navigation = useNavigation();

    const defaultRepeatInterval = useSettingsStore((s) => s.defaultRepeatInterval);
    const updateSettings = useSettingsStore((s) => s.updateSettings);

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
                <Text variant="h2">Repeat Settings</Text>
            </View>

            <Text
                variant="caption"
                color={colors.textSecondary}
                style={{ paddingHorizontal: Spacing.lg, marginBottom: Spacing.md }}
            >
                Default repeat interval for new transactions
            </Text>

            <Card style={{ marginHorizontal: Spacing.lg, padding: 0 }}>
                {INTERVALS.map((item, index) => {
                    const isActive = defaultRepeatInterval === item.value;
                    const isLast = index === INTERVALS.length - 1;
                    return (
                        <React.Fragment key={item.value}>
                            <Pressable
                                onPress={() => updateSettings({ defaultRepeatInterval: item.value })}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingHorizontal: Spacing.lg,
                                    paddingVertical: Spacing.md,
                                }}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text variant="body" weight={isActive ? 'semibold' : 'regular'}>
                                        {item.label}
                                    </Text>
                                    <Text variant="caption" color={colors.textSecondary}>
                                        {item.description}
                                    </Text>
                                </View>
                                {isActive && (
                                    <Check size={18} color={colors.primary} />
                                )}
                            </Pressable>
                            {!isLast && (
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: colors.border,
                                        marginLeft: Spacing.lg,
                                    }}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </Card>
        </SafeAreaView>
    );
}

export default RepeatSettingsScreen;
