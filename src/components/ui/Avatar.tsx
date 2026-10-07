import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { Text } from './Text';

export interface AvatarProps {
    /** Initials shown when no image */
    initials?: string;
    /** Full name — initials auto-computed */
    name?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'primary' | 'success' | 'neutral';
    style?: ViewStyle;
}

export function Avatar({
    initials,
    name,
    size = 'md',
    variant = 'primary',
    style,
}: AvatarProps) {
    const { colors, Radius, Layout } = useTheme();

    const sizes = {
        sm: Layout.avatarSm,
        md: Layout.avatarMd,
        lg: Layout.avatarLg,
        xl: Layout.avatarXl,
    };

    const fontSize = {
        sm: 12,
        md: 14,
        lg: 18,
        xl: 24,
    };

    const displayInitials =
        initials ??
        (name
            ? name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()
            : '?');

    const bg = variant === 'success' ? colors.success : variant === 'neutral' ? colors.cardAlt : colors.primary;

    return (
        <View
            style={[
                {
                    width: sizes[size],
                    height: sizes[size],
                    borderRadius: Radius.full,
                    backgroundColor: bg,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: size === 'xl' || size === 'lg' ? 3 : 2,
                    borderColor: colors.card,
                },
                style,
            ]}
        >
            <Text
                variant="body"
                color="#FFFFFF"
                weight="bold"
                style={{ fontSize: fontSize[size] }}
            >
                {displayInitials}
            </Text>
        </View>
    );
}

export default Avatar;