import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { Text } from './Text';

export type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'primary';

export interface BadgeProps {
    label: string;
    variant?: BadgeVariant;
    style?: ViewStyle;
}

export function Badge({ label, variant = 'neutral', style }: BadgeProps) {
    const { colors, Radius, Spacing } = useTheme();

    const backgrounds: Record<BadgeVariant, string> = {
        success: colors.successSoft,
        danger: colors.dangerSoft,
        warning: colors.warningSoft,
        info: colors.infoSoft,
        primary: colors.primarySoft,
        neutral: colors.cardAlt,
    };

    const textColors: Record<BadgeVariant, string> = {
        success: colors.success,
        danger: colors.danger,
        warning: colors.warning,
        info: colors.info,
        primary: colors.primary,
        neutral: colors.textSecondary,
    };

    return (
        <View
            style={[
                {
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: 4,
                    borderRadius: Radius.md,
                    backgroundColor: backgrounds[variant],
                    alignSelf: 'flex-start',
                },
                style,
            ]}
        >
            <Text variant="meta" color={textColors[variant]} weight="semibold">
                {label}
            </Text>
        </View>
    );
}

export default Badge;