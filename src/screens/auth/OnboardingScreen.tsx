import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@hooks/useTheme';
import { useOnboardingStore } from '@stores/useOnboardingStore';
import { Text } from '@components/ui/Text';
import { Button } from '@components/ui/Button';

export function OnboardingScreen() {
    const { colors, Spacing } = useTheme();
    const navigation = useNavigation<any>();
    const complete = useOnboardingStore((s) => s.complete);

    const handleContinue = () => {
        complete();
        navigation.navigate('Login');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: Spacing.xl }}>
                <Text style={{ fontSize: 72, textAlign: 'center', marginBottom: Spacing.xl }}>💸</Text>
                <Text variant="display" align="center" weight="bold">
                    Track every rupee
                </Text>
                <Text variant="body" color={colors.textSecondary} align="center" style={{ marginTop: Spacing.md }}>
                    Log expenses in seconds and always know where your money goes.
                </Text>
            </View>
            <View style={{ padding: Spacing.xl }}>
                <Button label="Get Started" onPress={handleContinue} fullWidth size="lg" />
            </View>
        </SafeAreaView>
    );
}

export default OnboardingScreen;