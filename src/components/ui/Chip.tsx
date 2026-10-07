import React from 'react';
import { Pressable, ViewStyle } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { Text } from './Text';

export interface ChipProps {
    label: string;
    active?: boolean;
    icon?: React.ReactNode;
    onPress?: () => void;
    variant?: 'default' | 'filled' | 'outlined';
    color?: string;
    size?: 'sm' | 'md';
    style?: ViewStyle;
}

export function Chip({
    label,
    active,
    icon,
    onPress,
    variant = 'default',
    color,
    size = 'md',
    style,
}: ChipProps) {
    const { colors, Radius, Spacing } = useTheme();

    const bg = active
        ? color ?? colors.primary
        : variant === 'filled'
            ? colors.cardAlt
            : colors.card;

    const textColor = active
        ? '#FFFFFF'
        : variant === 'outlined'
            ? colors.primary
            : colors.text;

    const isSm = size === 'sm';

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                {
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: Spacing.xs,
                    paddingHorizontal: isSm ? Spacing.md : Spacing.lg,
                    paddingVertical: isSm ? Spacing.xs : Spacing.sm,
                    backgroundColor: bg,
                    borderRadius: Radius.full,
                    borderWidth: variant === 'outlined' && !active ? 1.5 : 0,
                    borderColor: colors.primary,
                    ...(active && {
                        shadowColor: color ?? colors.primary,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 6,
                        elevation: 3,
                    }),
                },
                pressed && { opacity: 0.85 },
                style,
            ]}
        >
            {icon}
            <Text
                variant={isSm ? 'meta' : 'chip'}
                color={textColor}
                style={{ textTransform: 'capitalize' }}
            >
                {label}
            </Text>
        </Pressable>
    );
}

export default Chip;