import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';

import { useTheme } from '@hooks/useTheme';
import { Text } from '@components/ui/Text';
import { IconButton } from '@components/ui/IconButton';
import { NotificationItem } from '@components/shared/NotificationItem';

const MOCK_NOTIFICATIONS = [
    {
        id: '1',
        variant: 'payment' as const,
        title: 'Payment Successful',
        message: 'Your electricity bill of $85.40 was paid.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        amount: 85.4,
        amountType: 'expense' as const,
        unread: true,
    },
    {
        id: '2',
        variant: 'budget' as const,
        title: 'Budget Alert',
        message: "You've used 78% of your food budget this month.",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        unread: true,
    },
    {
        id: '3',
        variant: 'income' as const,
        title: 'Income Received',
        message: 'Salary deposit of $3,200 has been credited.',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        amount: 3200,
        amountType: 'income' as const,
        unread: true,
    },
    {
        id: '4',
        variant: 'goal' as const,
        title: 'Goal Progress',
        message: "You're 55% closer to your Save for a Car goal.",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: '5',
        variant: 'summary' as const,
        title: 'Weekly Summary Ready',
        message: 'You spent $580 this week. Tap to view details.',
        timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
    },
];

export function NotificationsScreen() {
    const { colors, Spacing } = useTheme();
    const navigation = useNavigation();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
            {/* Header */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: Spacing.md,
                    paddingHorizontal: Spacing.lg,
                    paddingVertical: Spacing.md,
                }}
            >
                <IconButton
                    icon={<ArrowLeft size={18} color={colors.text} />}
                    onPress={() => navigation.goBack()}
                />
                <Text variant="h2" style={{ flex: 1 }}>Notifications</Text>
                <Text variant="caption" color={colors.primary} weight="semibold">
                    Mark all read
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: Spacing.lg,
                    paddingBottom: 40,
                }}
                showsVerticalScrollIndicator={false}
            >
                <Text variant="meta" color={colors.textSecondary} style={{ marginBottom: Spacing.sm }}>
                    TODAY
                </Text>

                {MOCK_NOTIFICATIONS.slice(0, 3).map((n) => (
                    <NotificationItem key={n.id} {...n} style={{ marginBottom: Spacing.sm }} />
                ))}

                <Text
                    variant="meta"
                    color={colors.textSecondary}
                    style={{ marginTop: Spacing.lg, marginBottom: Spacing.sm }}
                >
                    EARLIER
                </Text>

                {MOCK_NOTIFICATIONS.slice(3).map((n) => (
                    <NotificationItem key={n.id} {...n} style={{ marginBottom: Spacing.sm }} />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

export default NotificationsScreen;