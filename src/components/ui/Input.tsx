import React, { useState } from 'react';
import { View, TextInput, TextInputProps, Pressable } from 'react-native';
import { Eye, EyeOff, Search, X } from 'lucide-react-native';
import { useTheme } from '@hooks/useTheme';
import { Text } from './Text';

export interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    /** Password mode — shows eye toggle */
    secure?: boolean;
    /** Search mode — shows search icon + clear button */
    search?: boolean;
    /** Show clear button when there's text */
    clearable?: boolean;
    containerStyle?: any;
}

export function Input({
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    secure,
    search,
    clearable,
    containerStyle,
    style,
    value,
    onChangeText,
    ...rest
}: InputProps) {
    const { colors, Radius, Spacing, Typography, FontFamily } = useTheme();
    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState(false);

    const hasError = Boolean(error);

    const borderColor = hasError
        ? colors.danger
        : focused
            ? colors.primary
            : colors.border;

    return (
        <View style={containerStyle}>
            {label && (
                <Text variant="inputLabel" color={colors.textSecondary} style={{ marginBottom: Spacing.xs }}>
                    {label}
                </Text>
            )}

            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: Spacing.sm,
                    paddingHorizontal: Spacing.lg,
                    paddingVertical: Spacing.md,
                    backgroundColor: colors.card,
                    borderRadius: Radius['2xl'],
                    borderWidth: 1.5,
                    borderColor,
                    ...(focused && {
                        shadowColor: colors.primary,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.12,
                        shadowRadius: 8,
                    }),
                }}
            >
                {search && !leftIcon && (
                    <Search size={18} color={colors.textSecondary} />
                )}
                {leftIcon}

                <TextInput
                    {...rest}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={(e) => {
                        setFocused(true);
                        rest.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setFocused(false);
                        rest.onBlur?.(e);
                    }}
                    secureTextEntry={secure && !showPassword}
                    placeholderTextColor={colors.textTertiary}
                    style={[
                        Typography.input,
                        {
                            flex: 1,
                            color: colors.text,
                            padding: 0,
                            fontFamily: FontFamily.medium,
                        },
                        style,
                    ]}
                />

                {clearable && value ? (
                    <Pressable onPress={() => onChangeText?.('')} hitSlop={8}>
                        <X size={16} color={colors.textSecondary} />
                    </Pressable>
                ) : null}

                {secure && (
                    <Pressable onPress={() => setShowPassword((p) => !p)} hitSlop={8}>
                        {showPassword ? (
                            <EyeOff size={18} color={colors.textSecondary} />
                        ) : (
                            <Eye size={18} color={colors.textSecondary} />
                        )}
                    </Pressable>
                )}

                {rightIcon}
            </View>

            {(error || hint) && (
                <Text
                    variant="caption"
                    color={hasError ? colors.danger : colors.textSecondary}
                    style={{ marginTop: Spacing.xs, marginLeft: Spacing.xs }}
                >
                    {error ?? hint}
                </Text>
            )}
        </View>
    );
}

export default Input;