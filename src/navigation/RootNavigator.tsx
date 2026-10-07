/**
 * MySpendTracker — Root Navigator
 * -------------------------------
 * Switches between Auth and Main flows based on auth state.
 * Hosts modal screens above everything.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@hooks/useTheme';
import { useAuthStore } from '@stores/useAuthStore';

import { AuthNavigator } from './AuthNavigator';
import { MainTabs } from './MainTabs';

import { AddExpenseScreen } from '@screens/modals/AddExpenseScreen';
import { SearchScreen } from '@screens/modals/SearchScreen';
import { NotificationsScreen } from '@screens/modals/NotificationsScreen';
import { SplashScreen } from '@screens/SplashScreen';


import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();



// ─────────────────────────────────────────────
// ROOT NAVIGATOR
// ─────────────────────────────────────────────

export function RootNavigator() {
    const { colors } = useTheme();

    // Auth state from Zustand (persisted)
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const isHydrated = useAuthStore((s) => s.isHydrated);

    // ─────────────────────────────────────────────
    // LOADING SCREEN (while hydrating auth)
    // ─────────────────────────────────────────────
    if (!isHydrated) {
        return <SplashScreen message="Loading your data..." />
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
                // ─── MAIN FLOW ───
                <>
                    <Stack.Screen name="Main" component={MainTabs} />

                    {/* Modals — slide up from bottom */}
                    <Stack.Group screenOptions={{ presentation: 'modal' }}>
                        <Stack.Screen
                            name="AddExpense"
                            component={AddExpenseScreen}
                            options={{
                                animation: 'slide_from_bottom',
                                presentation: 'modal',
                            }}
                        />
                        <Stack.Screen
                            name="Search"
                            component={SearchScreen}
                            options={{
                                animation: 'fade',
                                presentation: 'modal',
                            }}
                        />
                        <Stack.Screen
                            name="Notifications"
                            component={NotificationsScreen}
                            options={{
                                animation: 'slide_from_right',
                            }}
                        />
                    </Stack.Group>
                </>
            ) : (
                // ─── AUTH FLOW ───
                <Stack.Screen name="Auth" component={AuthNavigator} />
            )}
        </Stack.Navigator>
    );
}

export default RootNavigator;