import React from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@hooks/useTheme';
import { useAuthStore } from '@stores/useAuthStore';
import { useThemeStore } from '@stores/useThemeStore';

import { Text } from '@components/ui/Text';
import { Card } from '@components/ui/Card';
import { Switch } from '@components/ui/Switch';
import { Avatar } from '@components/ui/Avatar';
import { ProBanner } from '@components/shared/ProBanner';

import {
    DollarSign,
    Tag,
    Bell,
    Palette,
    Cloud,
    Wrench,
    LogOut,
    ChevronRight,
} from 'lucide-react-native';

export function SettingsScreen() {
    const { colors, Spacing, Radius } = useTheme();

    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);
    const themeMode = useThemeStore((s) => s.mode);
    const setMode = useThemeStore((s) => s.setMode);

    const handleLogout = () => {
        Alert.alert('Log out', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Log out', style: 'destructive', onPress: logout },
        ]);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
            <ScrollView
                contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={{ paddingTop: Spacing.lg, marginBottom: Spacing.lg }}>
                    <Text variant="h1">Settings</Text>
                </View>

                {/* Profile */}
                <Card variant="elevated" style={{ marginBottom: Spacing.lg }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
                        <Avatar name={user?.name ?? 'Guest'} size="lg" />
                        <View style={{ flex: 1 }}>
                            <Text variant="h3">{user?.name ?? 'Guest'}</Text>
                            <Text variant="caption" color={colors.textSecondary}>
                                {user?.email ?? 'Not signed in'}
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Pro Banner */}
                <ProBanner onPress={() => { }} style={{ marginBottom: Spacing.xl }} />

                {/* Preferences */}
                <Text variant="meta" color={colors.textSecondary} style={{ marginBottom: Spacing.sm }}>
                    PREFERENCES
                </Text>
                <Card style={{ marginBottom: Spacing.lg, padding: 0 }}>
                    <SettingsRow
                        icon={<DollarSign size={16} color={colors.primary} />}
                        iconBg={colors.primarySoft}
                        label="Currency"
                        value="USD"
                        onPress={() => { }}
                    />
                    <Divider />
                    <SettingsRow
                        icon={<Tag size={16} color={colors.warning} />}
                        iconBg={colors.warningSoft}
                        label="Categories"
                        onPress={() => { }}
                    />
                    <Divider />
                    <SettingsRow
                        icon={<Bell size={16} color={colors.success} />}
                        iconBg={colors.successSoft}
                        label="Reminders"
                        right={
                            <Switch
                                value={true}
                                onValueChange={() => { }}
                            />
                        }
                    />
                </Card>

                {/* Tools */}
                <Text variant="meta" color={colors.textSecondary} style={{ marginBottom: Spacing.sm }}>
                    TOOLS & DATA
                </Text>
                <Card style={{ marginBottom: Spacing.lg, padding: 0 }}>
                    <SettingsRow
                        icon={<Palette size={16} color={colors.danger} />}
                        iconBg={colors.dangerSoft}
                        label="Appearance"
                        value={themeMode === 'system' ? 'System' : themeMode === 'dark' ? 'Dark' : 'Light'}
                        onPress={() => {
                            const next = themeMode === 'dark' ? 'light' : 'dark';
                            setMode(next);
                        }}
                    />
                    <Divider />
                    <SettingsRow
                        icon={<Cloud size={16} color={colors.info} />}
                        iconBg={colors.infoSoft}
                        label="Cloud Backups"
                        right={<Switch value={true} onValueChange={() => { }} />}
                    />
                    <Divider />
                    <SettingsRow
                        icon={<Wrench size={16} color={colors.textSecondary} />}
                        iconBg={colors.cardAlt}
                        label="Advanced Settings"
                        onPress={() => { }}
                    />
                </Card>

                {/* Logout */}
                <Card
                    onPress={handleLogout}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: Spacing.md,
                        padding: Spacing.lg,
                        marginBottom: Spacing.lg,
                    }}
                >
                    <View
                        style={{
                            width: 34,
                            height: 34,
                            borderRadius: Radius.md,
                            backgroundColor: colors.dangerSoft,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <LogOut size={16} color={colors.danger} />
                    </View>
                    <Text variant="body" weight="semibold" color={colors.danger} style={{ flex: 1 }}>
                        Log Out
                    </Text>
                </Card>

                <Text
                    variant="meta"
                    color={colors.textTertiary}
                    align="center"
                    style={{ marginTop: Spacing.lg }}
                >
                    MySpendTracker v1.0.0
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function Divider() {
    const { colors, Spacing } = useTheme();
    return (
        <View
            style={{
                height: 1,
                backgroundColor: colors.border,
                marginLeft: 62,
                marginRight: Spacing.lg,
            }}
        />
    );
}

interface SettingsRowProps {
    icon: React.ReactNode;
    iconBg: string;
    label: string;
    value?: string;
    right?: React.ReactNode;
    onPress?: () => void;
}

function SettingsRow({ icon, iconBg, label, value, right, onPress }: SettingsRowProps) {
    const { colors, Spacing, Radius } = useTheme();

    const Row = onPress ? require('react-native').Pressable : View;

    return (
        <Row
            onPress={onPress}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: Spacing.md,
                paddingVertical: Spacing.lg,
                paddingHorizontal: Spacing.lg,
            }}
        >
            <View
                style={{
                    width: 34,
                    height: 34,
                    borderRadius: Radius.md,
                    backgroundColor: iconBg,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {icon}
            </View>
            <Text variant="body" weight="semibold" style={{ flex: 1 }}>
                {label}
            </Text>
            {value && (
                <Text variant="caption" color={colors.textSecondary}>
                    {value}
                </Text>
            )}
            {right ?? (onPress ? <ChevronRight size={16} color={colors.textTertiary} /> : null)}
        </Row>
    );
}

export default SettingsScreen;