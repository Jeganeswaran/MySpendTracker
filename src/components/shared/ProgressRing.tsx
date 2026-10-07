import React from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '@hooks/useTheme';
import { Text } from '@components/ui/Text';

export interface ProgressRingProps {
    /** 0–100 */
    percent: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    trackColor?: string;
    /** Show % label in center */
    showLabel?: boolean;
    labelColor?: string;
    style?: ViewStyle;
}

export function ProgressRing({
    percent,
    size = 44,
    strokeWidth = 4,
    color,
    trackColor,
    showLabel = true,
    labelColor,
    style,
}: ProgressRingProps) {
    const { colors } = useTheme();

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const clampedPercent = Math.min(100, Math.max(0, percent));
    const offset = circumference - (clampedPercent / 100) * circumference;

    const ringColor = color ?? colors.primary;
    const track = trackColor ?? colors.border;

    return (
        <View
            style={[
                {
                    width: size,
                    height: size,
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                style,
            ]}
        >
            <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={track}
                    strokeWidth={strokeWidth}
                />
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={ringColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                />
            </Svg>

            {showLabel && (
                <View
                    style={{
                        position: 'absolute',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text variant="label" color={labelColor ?? colors.text} weight="bold">
                        {Math.round(clampedPercent)}%
                    </Text>
                </View>
            )}
        </View>
    );
}

export default ProgressRing;