import React from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { useTheme } from '@hooks/useTheme';
import { Text } from '@components/ui/Text';

export interface DonutSlice {
    value: number;
    color: string;
}

export interface DonutChartProps {
    data: DonutSlice[];
    size?: number;
    strokeWidth?: number;
    centerLabel?: string;
    centerValue?: string;
    style?: ViewStyle;
}

export function DonutChart({
    data,
    size = 220,
    strokeWidth = 24,
    centerLabel,
    centerValue,
    style,
}: DonutChartProps) {
    const { colors } = useTheme();

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const total = data.reduce((sum, s) => sum + s.value, 0);

    let cumulative = 0;

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
            <Svg width={size} height={size}>
                <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                    {/* Track */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={colors.chartTrack}
                        strokeWidth={strokeWidth}
                    />

                    {/* Slices */}
                    {data.map((slice, index) => {
                        const fraction = total > 0 ? slice.value / total : 0;
                        const dash = fraction * circumference;
                        const offset = -cumulative * circumference;
                        cumulative += fraction;

                        return (
                            <Circle
                                key={index}
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                fill="none"
                                stroke={slice.color}
                                strokeWidth={strokeWidth}
                                strokeDasharray={`${dash} ${circumference - dash}`}
                                strokeDashoffset={offset}
                            />
                        );
                    })}
                </G>
            </Svg>

            {(centerLabel || centerValue) && (
                <View
                    style={{
                        position: 'absolute',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {centerLabel && (
                        <Text variant="caption" color={colors.textSecondary}>
                            {centerLabel}
                        </Text>
                    )}
                    {centerValue && (
                        <Text variant="amountLg" weight="bold" style={{ marginTop: 4 }}>
                            {centerValue}
                        </Text>
                    )}
                </View>
            )}
        </View>
    );
}

export default DonutChart;