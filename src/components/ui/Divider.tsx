import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '@hooks/useTheme';

export interface DividerProps {
    orientation?: 'horizontal' | 'vertical';
    spacing?: number;
    color?: string;
    style?: ViewStyle;
}

export function Divider({
    orientation = 'horizontal',
    spacing,
    color,
    style,
}: DividerProps) {
    const { colors, Spacing } = useTheme();

    return (
        <View
            style={[
                orientation === 'horizontal'
                    ? {
                        height: 1,
                        backgroundColor: color ?? colors.divider,
                        marginVertical: spacing ?? Spacing.md,
                    }
                    : {
                        width: 1,
                        backgroundColor: color ?? colors.divider,
                        marginHorizontal: spacing ?? Spacing.md,
                    },
                style,
            ]}
        />
    );
}

export default Divider;