import React from 'react';
import { Pressable, PressableProps, ActivityIndicator, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '@hooks/useTheme';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    label: string;
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    style?: ViewStyle;
}

export function Button({
    variant = 'primary',
    size = 'md',
    label,
    loading,
    disabled,
    fullWidth,
    leftIcon,
    rightIcon,
    style,
    onPress,
    ...rest
}: ButtonProps) {
    const { colors, Radius, Spacing, Shadows } = useTheme();

    const heights: Record<ButtonSize, number> = {
        sm: 40,
        md: 52,
        lg: 56,
    };

    const paddings: Record<ButtonSize, { h: number; v: number }> = {
        sm: { h: Spacing.lg, v: Spacing.sm },
        md: { h: Spacing.xl, v: Spacing.lg },
        lg: { h: Spacing['2xl'], v: Spacing.xl },
    };

    const isDisabled = disabled || loading;

    const baseStyle: ViewStyle = {
        height: heights[size],
        paddingHorizontal: paddings[size].h,
        borderRadius: Radius.xl,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        opacity: isDisabled ? 0.5 : 1,
        ...(fullWidth && { width: '100%' }),
    };

    const textColor =
        variant === 'primary' || variant === 'danger'
            ? '#FFFFFF'
            : variant === 'secondary'
                ? colors.primary
                : colors.text;

    const content = (
        <>
            {loading ? (
                <ActivityIndicator color={textColor} size="small" />
            ) : (
                <>
                    {leftIcon}
                    <Text
                        variant={size === 'lg' ? 'buttonLg' : 'button'}
                        color={textColor}
                    >
                        {label}
                    </Text>
                    {rightIcon}
                </>
            )}
        </>
    );

    if (variant === 'primary') {
        return (
            <Pressable
                {...rest}
                onPress={onPress}
                disabled={isDisabled}
                style={[style]}
            >
                <LinearGradient
                    colors={[colors.gradientPrimaryStart, colors.gradientPrimaryEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[baseStyle, Shadows.brand]}
                >
                    {content}
                </LinearGradient>
            </Pressable>
        );
    }

    const variantStyle: ViewStyle =
        variant === 'secondary'
            ? {
                backgroundColor: colors.primarySoft,
                borderWidth: 1.5,
                borderColor: colors.primary,
            }
            : variant === 'danger'
                ? {
                    backgroundColor: colors.danger,
                    ...Shadows.danger,
                }
                : {
                    backgroundColor: 'transparent',
                };

    return (
        <Pressable
            {...rest}
            onPress={onPress}
            disabled={isDisabled}
            style={({ pressed }) => [
                baseStyle,
                variantStyle,
                pressed && { opacity: 0.85 },
                style,
            ]}
        >
            {content}
        </Pressable>
    );
}

export default Button;