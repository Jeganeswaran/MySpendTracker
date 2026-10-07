import React from 'react';
import { View, TextInput, Pressable, ViewStyle } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useTheme } from '@hooks/useTheme';

export interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    onFocus?: () => void;
    style?: ViewStyle;
}

export function SearchBar({
    value,
    onChangeText,
    placeholder = 'Search...',
    onFocus,
    style,
}: SearchBarProps) {
    const { colors, Radius, Spacing, Typography, FontFamily } = useTheme();

    return (
        <View
            style={[
                {
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: Spacing.sm,
                    paddingHorizontal: Spacing.lg,
                    paddingVertical: Spacing.md,
                    backgroundColor: colors.cardAlt,
                    borderRadius: Radius['2xl'],
                },
                style,
            ]}
        >
            <Search size={18} color={colors.textSecondary} />
            <TextInput
                value={value}
                onChangeText={onChangeText}
                onFocus={onFocus}
                placeholder={placeholder}
                placeholderTextColor={colors.textTertiary}
                style={[
                    Typography.input,
                    {
                        flex: 1,
                        color: colors.text,
                        padding: 0,
                        fontFamily: FontFamily.medium,
                    },
                ]}
            />
            {value.length > 0 && (
                <Pressable onPress={() => onChangeText('')} hitSlop={8}>
                    <View
                        style={{
                            width: 18,
                            height: 18,
                            borderRadius: 9,
                            backgroundColor: colors.textTertiary,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <X size={10} color="#FFFFFF" strokeWidth={3} />
                    </View>
                </Pressable>
            )}
        </View>
    );
}

export default SearchBar;