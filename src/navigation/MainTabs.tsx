/**
 * MySpendTracker — Main Tabs
 * --------------------------
 * Bottom tab bar with Home, Transactions, Budget, Settings.
 * Includes the floating + button and search/notification headers.
 */

import React from 'react';
import { View, Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Home, BarChart3, Target, Settings as SettingsIcon, } from 'lucide-react-native';

import { useTheme } from '@hooks/useTheme';
import { FAB } from '@components/shared/FAB';

import { HomeScreen } from '@screens/main/HomeScreen';
import { TransactionsScreen } from '@screens/main/TransactionsScreen';
import { BudgetScreen } from '@screens/main/BudgetScreen';
import { SettingsScreen } from '@screens/main/SettingsScreen';

import type { MainTabParamList, RootStackParamList } from './types';
import { Text } from '@components/ui';

const Tab = createBottomTabNavigator<MainTabParamList>();

// ─────────────────────────────────────────────
// CUSTOM TAB BAR with FAB
// ─────────────────────────────────────────────

type RootNav = NativeStackNavigationProp<RootStackParamList>;

function CustomTabBar({ state, navigation }: any) {
    const { colors, Spacing, Layout } = useTheme();
    const rootNav = useNavigation<RootNav>();

    const tabs = [
        { key: 'Home', label: 'Home', Icon: Home },
        { key: 'Transactions', label: 'Report', Icon: BarChart3 },
        { key: 'Budget', label: 'Plan', Icon: Target },
        { key: 'Settings', label: 'Settings', Icon: SettingsIcon },
    ];

    return (
        <View
            style={{
                flexDirection: 'row',
                backgroundColor: colors.card,
                paddingTop: 12,
                paddingBottom: 26,
                paddingHorizontal: Spacing.md,
                borderTopWidth: 1,
                borderTopColor: colors.border,
            }}
        >
            {state.routes.map((route: any, index: number) => {
                const isFocused = state.index === index;
                const tab = tabs.find((t) => t.key === route.name);
                if (!tab) return null;

                const color = isFocused ? colors.primary : colors.textSecondary;

                const onPress = () => {
                    if (!isFocused) {
                        navigation.navigate(route.name);
                    }
                };

                // Insert FAB in the middle
                if (index === 2) {
                    return (
                        <React.Fragment key={route.key}>
                            <TabButton
                                label={tab.label}
                                color={color}
                                Icon={tab.Icon}
                                onPress={onPress}
                            />
                            <View style={{ width: Layout.fabSize, alignItems: 'center' }}>
                                <FAB
                                    onPress={() => rootNav.navigate('AddExpense')}
                                    size={Layout.fabSize}
                                    style={{ marginTop: -28 }}
                                />
                            </View>
                        </React.Fragment>
                    );
                }

                return (
                    <TabButton
                        key={route.key}
                        label={tab.label}
                        color={color}
                        Icon={tab.Icon}
                        onPress={onPress}
                    />
                );
            })}
        </View>
    );
}

interface TabButtonProps {
    label: string;
    color: string;
    Icon: React.ComponentType<{ size: number; color: string; strokeWidth: number }>;
    onPress: () => void;
}

function TabButton({ label, color, Icon, onPress }: TabButtonProps) {

    return (
        <Pressable
            onPress={onPress}
            style={{
                flex: 1,
                alignItems: 'center',
                gap: 4,
                paddingVertical: 4,
            }}
        >
            <Icon size={22} color={color} strokeWidth={1.8} />
            <View>
                <Text variant="caption" color={color}>
                    {label}
                </Text>
            </View>
        </Pressable>
    );
}

// ─────────────────────────────────────────────
// MAIN TABS
// ─────────────────────────────────────────────

export function MainTabs() {
    const { colors } = useTheme();

    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                sceneStyle: { backgroundColor: colors.background },
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Transactions" component={TransactionsScreen} />
            <Tab.Screen name="Budget" component={BudgetScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}

export default MainTabs;