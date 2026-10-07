import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { TypographyKey } from '@theme/typography';

export interface TextProps extends RNTextProps {
    /** Typography variant key — 'body', 'h1', 'display', etc. */
    variant?: TypographyKey;
    /** Override color — defaults to theme.colors.text */
    color?: string;
    /** Text alignment */
    align?: 'left' | 'center' | 'right';
    /** Convenience weight modifier (uses fontFamily under the hood) */
    weight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
}

export function Text({
    variant = 'body',
    color,
    align,
    weight,
    style,
    children,
    ...rest
}: TextProps) {
    const { colors, Typography, FontFamily } = useTheme();

    const weightOverride = weight ? { fontFamily: FontFamily[weight] } : undefined;

    return (
        <RNText
            {...rest}
            style={[
                Typography[variant],
                { color: color ?? colors.text },
                align && { textAlign: align },
                weightOverride,
                style,
            ]}
        >
            {children}
        </RNText>
    );
}

export default Text;