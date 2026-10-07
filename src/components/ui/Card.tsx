import React from 'react';
import { View, ViewProps, ViewStyle, Pressable } from 'react-native';
import { useTheme } from '@hooks/useTheme';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'hero' | 'tinted';

export interface CardProps extends ViewProps {
    variant?: CardVariant;
    /** Tint color for `variant="tinted"` */
    tint?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    radius?: 'md' | 'lg' | 'xl' | '2xl' | '3xl';
    onPress?: () => void;
    style?: ViewStyle | ViewStyle[];
}

export function Card({
    variant = 'default',
    tint,
    padding = 'md',
    radius = '2xl',
    onPress,
    style,
    children,
    ...rest
}: CardProps) {
    const { colors, Spacing, Radius, Shadows } = useTheme();

    const paddingMap = {
        none: 0,
        sm: Spacing.md,
        md: Spacing.lg,
        lg: Spacing.xl,
    };

    const radiusMap = {
        md: Radius.lg,
        lg: Radius.xl,
        xl: Radius['2xl'],
        '2xl': Radius['2xl'],
        '3xl': Radius['3xl'],
    };

    const baseStyle: ViewStyle = {
        padding: paddingMap[padding],
        borderRadius: radiusMap[radius],
        backgroundColor: colors.card,
    };

    const variantStyle: ViewStyle =
        variant === 'elevated'
            ? { ...Shadows.md }
            : variant === 'outlined'
                ? { borderWidth: 1, borderColor: colors.border }
                : variant === 'hero'
                    ? {
                        ...Shadows.lg,
                        borderWidth: 1,
                        borderColor: colors.border,
                    }
                    : variant === 'tinted'
                        ? { backgroundColor: tint ?? colors.primarySoft }
                        : { ...Shadows.sm };

    const Component: any = onPress ? Pressable : View;

    return (
        <Component
            {...rest}
            onPress={onPress}
            style={({ pressed }: any) => [
                baseStyle,
                variantStyle,
                pressed && onPress && { opacity: 0.95 },
                style,
            ]}
        >
            {children}
        </Component>
    );
}

export default Card;