import React from 'react';
import { View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Check } from 'lucide-react-native';

import { useTheme } from '@hooks/useTheme';
import { useSettingsStore } from '@stores/useSettingsStore';
import { Text } from '@components/ui/Text';
import { Card } from '@components/ui/Card';
import { IconButton } from '@components/ui/IconButton';

const LANGUAGES = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'es', label: 'Spanish', native: 'Español' },
    { code: 'fr', label: 'French', native: 'Français' },
    { code: 'de', label: 'German', native: 'Deutsch' },
    { code: 'ja', label: 'Japanese', native: '日本語' },
    { code: 'ar', label: 'Arabic', native: 'العربية' },
    { code: 'pt', label: 'Portuguese', native: 'Português' },
    { code: 'zh', label: 'Chinese', native: '中文' },
];

export function LanguageScreen() {
    const { colors, Spacing } = useTheme();
    const navigation = useNavigation();

    const language = useSettingsStore((s) => s.language);
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
                <Text variant="h2">Language</Text>
            </View>

            <Text
                variant="caption"
                color={colors.textSecondary}
                style={{ paddingHorizontal: Spacing.lg, marginBottom: Spacing.md }}
            >
                Select your preferred language
            </Text>

            <Card style={{ marginHorizontal: Spacing.lg, padding: 0 }}>
                {LANGUAGES.map((lang, index) => {
                    const isActive = language === lang.code;
                    const isLast = index === LANGUAGES.length - 1;
                    return (
                        <React.Fragment key={lang.code}>
                            <Pressable
                                onPress={() => updateSettings({ language: lang.code })}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingHorizontal: Spacing.lg,
                                    paddingVertical: Spacing.md,
                                }}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text variant="body" weight={isActive ? 'semibold' : 'regular'}>
                                        {lang.native}
                                    </Text>
                                    <Text variant="caption" color={colors.textSecondary}>
                                        {lang.label}
                                    </Text>
                                </View>
                                {isActive && (
                                    <Check size={18} color={colors.primary} />
                                )}
                            </Pressable>
                            {!isLast && (
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: colors.border,
                                        marginLeft: Spacing.lg,
                                    }}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </Card>
        </SafeAreaView>
    );
}

export default LanguageScreen;
