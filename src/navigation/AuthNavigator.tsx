/**
 * MySpendTracker — Auth Navigator
 * -------------------------------
 * Onboarding → Login → Signup stack.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@hooks/useTheme';

import { OnboardingScreen } from '@screens/auth/OnboardingScreen';
import { LoginScreen } from '@screens/auth/LoginScreen';
import { SignupScreen } from '@screens/auth/SignupScreen';

import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

// ─────────────────────────────────────────────
// STORAGE — track if user saw onboarding
// ─────────────────────────────────────────────

import { useOnboardingStore } from '@stores/useOnboardingStore';

export function AuthNavigator() {
    const { colors } = useTheme();
    const hasOnboarded = useOnboardingStore((s) => s.hasOnboarded);

    return (
        <Stack.Navigator
            initialRouteName={hasOnboarded ? 'Login' : 'Onboarding'}
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
        </Stack.Navigator>
    );
}

export default AuthNavigator;