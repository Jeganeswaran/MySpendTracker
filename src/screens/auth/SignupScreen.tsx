import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@hooks/useTheme';
import { useAuthStore } from '@stores/useAuthStore';
import { Text } from '@components/ui/Text';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';

export function SignupScreen() {
    const { colors, Spacing } = useTheme();
    const navigation = useNavigation<any>();
    const login = useAuthStore((s) => s.login);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = () => {
        login({ id: 'user_1', name, email });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView contentContainerStyle={{ padding: Spacing.xl }}>
                <Text variant="h1" style={{ marginTop: Spacing['2xl'], marginBottom: Spacing.xl }}>
                    Create account
                </Text>
                <View style={{ gap: Spacing.md }}>
                    <Input label="Name" value={name} onChangeText={setName} />
                    <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
                    <Input label="Password" value={password} onChangeText={setPassword} secure />
                </View>
                <Button label="Sign Up" onPress={handleSignup} fullWidth size="lg" style={{ marginTop: Spacing.xl }} />
                <Text
                    variant="body"
                    color={colors.primary}
                    align="center"
                    weight="semibold"
                    style={{ marginTop: Spacing.lg }}
                    onPress={() => navigation.goBack()}
                >
                    Already have an account? Log in
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

export default SignupScreen;