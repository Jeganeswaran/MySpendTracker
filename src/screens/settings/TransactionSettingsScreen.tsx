import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';

import { useTheme } from '@hooks/useTheme';
import { useSettingsStore } from '@stores/useSettingsStore';
import { Text } from '@components/ui/Text';
import { Card } from '@components/ui/Card';
import { Switch } from '@components/ui/Switch';
import { IconButton } from '@components/ui/IconButton';
import { SegmentControl } from '@components/ui/SegmentControl';

const DAY_OPTIONS = Array.from({ length: 28 }, (_, i) => i + 1);
const WEEK_DAYS = [
    { label: 'Su', value: 0 },
    { label: 'Mo', value: 1 },
    { label: 'Tu', value: 2 },
    { label: 'We', value: 3 },
    { label: 'Th', value: 4 },
    { label: 'Fr', value: 5 },
    { label: 'Sa', value: 6 },
];

const PERIOD_OPTIONS = [
    { label: 'Monthly', value: 'monthly' as const },
    { label: 'Weekly', value: 'weekly' as const },
];

export function TransactionSettingsScreen() {
    const { colors, Spacing, Radius } = useTheme();
    const navigation = useNavigation();

    const monthlyStartDay = useSettingsStore((s) => s.monthlyStartDay);
    const weeklyStartDay = useSettingsStore((s) => s.weeklyStartDay);
    const periodType = useSettingsStore((s) => s.periodType);
    const carryOver = useSettingsStore((s) => s.carryOver);
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
                <Text variant="h2">Transaction Settings</Text>
            </View>

            <ScrollView
                contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: 60 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Period Type */}
                <Text variant="meta" color={colors.textSecondary} style={{ marginBottom: Spacing.sm }}>
                    PERIOD TYPE
                </Text>
                <Card style={{ marginBottom: Spacing.xl }}>
                    <SegmentControl
                        options={PERIOD_OPTIONS}
                        value={periodType}
                        onChange={(v) => updateSettings({ periodType: v })}
                    />
                </Card>

                {/* Monthly Start Day */}
                <Text variant="meta" color={colors.textSecondary} style={{ marginBottom: Spacing.sm }}>
                    MONTHLY START DAY
                </Text>
                <Card style={{ marginBottom: Spacing.xl }}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                        {DAY_OPTIONS.map((day) => {
                            const active = monthlyStartDay === day;
                            return (
                                <Pressable
                                    key={day}
                                    onPress={() => updateSettings({ monthlyStartDay: day })}
                                    style={{
                                        width: 38,
                                        height: 38,
                                        borderRadius: Radius.md,
                                        backgroundColor: active ? colors.primary : colors.cardAlt,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text
                                        variant="caption"
                                        weight="semibold"
                                        color={active ? '#FFF' : colors.text}
                                    >
                                        {day}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </Card>

                {/* Weekly Start Day */}
                <Text variant="meta" color={colors.textSecondary} style={{ marginBottom: Spacing.sm }}>
                    WEEKLY START DAY
                </Text>
                <Card style={{ marginBottom: Spacing.xl }}>
                    <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
                        {WEEK_DAYS.map((wd) => {
                            const active = weeklyStartDay === wd.value;
                            return (
                                <Pressable
                                    key={wd.value}
                                    onPress={() => updateSettings({ weeklyStartDay: wd.value })}
                                    style={{
                                        flex: 1,
                                        height: 40,
                                        borderRadius: Radius.md,
                                        backgroundColor: active ? colors.primary : colors.cardAlt,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text
                                        variant="label"
                                        weight="semibold"
                                        color={active ? '#FFF' : colors.text}
                                    >
                                        {wd.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </Card>

                {/* Carry-Over */}
                <Text variant="meta" color={colors.textSecondary} style={{ marginBottom: Spacing.sm }}>
                    CARRY-OVER TO NEXT PERIOD
                </Text>
                <Card style={{ marginBottom: Spacing.xl, padding: 0 }}>
                    <CarryRow
                        label="Enable Carry-Over"
                        value={carryOver.enabled}
                        onValueChange={(v) =>
                            updateSettings({ carryOver: { ...carryOver, enabled: v } })
                        }
                    />
                    <SectionDivider />
                    <CarryRow
                        label="Include Income Balance"
                        value={carryOver.income}
                        disabled={!carryOver.enabled}
                        onValueChange={(v) =>
                            updateSettings({ carryOver: { ...carryOver, income: v } })
                        }
                    />
                    <SectionDivider />
                    <CarryRow
                        label="Include Expense Balance"
                        value={carryOver.expense}
                        disabled={!carryOver.enabled}
                        onValueChange={(v) =>
                            updateSettings({ carryOver: { ...carryOver, expense: v } })
                        }
                    />
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}

function CarryRow({
    label,
    value,
    disabled,
    onValueChange,
}: {
    label: string;
    value: boolean;
    disabled?: boolean;
    onValueChange: (v: boolean) => void;
}) {
    const { Spacing } = useTheme();
    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: Spacing.lg,
                paddingVertical: Spacing.md,
            }}
        >
            <Text variant="body" style={{ flex: 1 }}>
                {label}
            </Text>
            <Switch value={value} onValueChange={onValueChange} disabled={disabled} />
        </View>
    );
}

function SectionDivider() {
    const { colors, Spacing } = useTheme();
    return (
        <View
            style={{
                height: 1,
                backgroundColor: colors.border,
                marginLeft: Spacing.lg,
            }}
        />
    );
}

export default TransactionSettingsScreen;
