import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '@hooks/useTheme';
import { useAuthStore } from '@stores/useAuthStore';
import { useToastStore } from '@stores/useToastStore';

import { Text } from '@components/ui/Text';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';

import { Mail, Lock } from 'lucide-react-native';
import { validateEmail, validatePassword } from '@utils/validation';

export function LoginScreen() {
    const { colors, Spacing, Radius } = useTheme();
    const navigation = useNavigation<any>();
    const login = useAuthStore((s) => s.login);
    const toast = useToastStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const handleLogin = async () => {
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        if (emailError || passwordError) {
            setErrors({ email: emailError ?? undefined, password: passwordError ?? undefined });
            return;
        }

        setLoading(true);
        try {
            // Simulate API call
            await new Promise((r) => setTimeout(r, 800));

            login({
                id: 'user_1',
                name: 'Hitesh',
                email: email,
            });

            toast.success('Welcome back!');
        } catch {
            toast.error('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingHorizontal: Spacing.xl,
                    paddingVertical: Spacing['2xl'],
                }}
                keyboardShouldPersistTaps="handled"
            >
                {/* Logo */}
                <View style={{ alignItems: 'center', marginTop: Spacing['3xl'], marginBottom: Spacing['3xl'] }}>
                    <View
                        style={{
                            width: 72,
                            height: 72,
                            borderRadius: Radius['3xl'],
                            backgroundColor: colors.primary,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: Spacing.lg,
                        }}
                    >
                        <Text style={{ fontSize: 32 }}>💸</Text>
                    </View>
                    <Text variant="h1" align="center">Welcome to</Text>
                    <Text variant="h1" align="center" color={colors.primary}>MySpendTracker</Text>
                    <Text variant="body" color={colors.textSecondary} align="center" style={{ marginTop: Spacing.sm }}>
                        Track expenses, grow savings, take control.
                    </Text>
                </View>

                {/* Form */}
                <View style={{ gap: Spacing.md }}>
                    <Input
                        label="Email"
                        placeholder="you@example.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        value={email}
                        onChangeText={setEmail}
                        error={errors.email}
                        leftIcon={<Mail size={18} color={colors.textSecondary} />}
                    />

                    <Input
                        label="Password"
                        placeholder="••••••••"
                        secure
                        value={password}
                        onChangeText={setPassword}
                        error={errors.password}
                        leftIcon={<Lock size={18} color={colors.textSecondary} />}
                    />

                    <Text
                        variant="caption"
                        color={colors.primary}
                        weight="semibold"
                        align="right"
                        onPress={() => { }}
                    >
                        Forgot password?
                    </Text>
                </View>

                {/* Login Button */}
                <Button
                    label="Log In"
                    onPress={handleLogin}
                    loading={loading}
                    fullWidth
                    size="lg"
                    style={{ marginTop: Spacing.xl }}
                />

                {/* Sign Up Link */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: 4,
                        marginTop: Spacing.lg,
                    }}
                >
                    <Text variant="body" color={colors.textSecondary}>
                        Don't have an account?
                    </Text>
                    <Text
                        variant="body"
                        color={colors.primary}
                        weight="bold"
                        onPress={() => navigation.navigate('Signup')}
                    >
                        Sign up
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default LoginScreen;