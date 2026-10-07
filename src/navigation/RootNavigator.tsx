import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@hooks/useTheme';
import { useAuthStore } from '@stores/useAuthStore';

import { AuthNavigator } from './AuthNavigator';
import { MainTabs } from './MainTabs';

import { AddExpenseScreen } from '@screens/modals/AddExpenseScreen';
import { AddIncomeScreen } from '@screens/modals/AddIncomeScreen';
import { SearchScreen } from '@screens/modals/SearchScreen';
import { NotificationsScreen } from '@screens/modals/NotificationsScreen';
import { SplashScreen } from '@screens/SplashScreen';
import { CalendarScreen } from '@screens/main/CalendarScreen';
import { TransactionSettingsScreen } from '@screens/settings/TransactionSettingsScreen';
import { RepeatSettingsScreen } from '@screens/settings/RepeatSettingsScreen';
import { IncomeCategoriesScreen } from '@screens/settings/IncomeCategoriesScreen';
import { ExpenseCategoriesScreen } from '@screens/settings/ExpenseCategoriesScreen';
import { AccountsScreen } from '@screens/settings/AccountsScreen';
import { LanguageScreen } from '@screens/settings/LanguageScreen';

import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
    const { colors } = useTheme();

    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const isHydrated = useAuthStore((s) => s.isHydrated);

    if (!isHydrated) {
        return <SplashScreen message="Loading your data..." />;
    }

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
                animation: 'fade',
            }}
        >
            {isAuthenticated ? (
                <>
                    <Stack.Screen name="Main" component={MainTabs} />

                    {/* Modals — slide up from bottom */}
                    <Stack.Group screenOptions={{ presentation: 'modal' }}>
                        <Stack.Screen
                            name="AddExpense"
                            component={AddExpenseScreen}
                            options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
                        />
                        <Stack.Screen
                            name="AddIncome"
                            component={AddIncomeScreen}
                            options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
                        />
                        <Stack.Screen
                            name="Search"
                            component={SearchScreen}
                            options={{ animation: 'fade', presentation: 'modal' }}
                        />
                    </Stack.Group>

                    {/* Stack screens — slide from right */}
                    <Stack.Group screenOptions={{ animation: 'slide_from_right' }}>
                        <Stack.Screen name="Notifications" component={NotificationsScreen} />
                        <Stack.Screen name="Calendar" component={CalendarScreen} />
                        <Stack.Screen name="TransactionSettings" component={TransactionSettingsScreen} />
                        <Stack.Screen name="RepeatSettings" component={RepeatSettingsScreen} />
                        <Stack.Screen name="IncomeCategories" component={IncomeCategoriesScreen} />
                        <Stack.Screen name="ExpenseCategories" component={ExpenseCategoriesScreen} />
                        <Stack.Screen name="Accounts" component={AccountsScreen} />
                        <Stack.Screen name="Language" component={LanguageScreen} />
                    </Stack.Group>
                </>
            ) : (
                <Stack.Screen name="Auth" component={AuthNavigator} />
            )}
        </Stack.Navigator>
    );
}

export default RootNavigator;
