import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '@hooks/useTheme';

export interface ProgressBarProps {
  /** 0–100 */
  percent: number;
  height?: number;
  color?: string;
  trackColor?: string;
  style?: ViewStyle;
}

export function ProgressBar({
  percent,
  height = 6,
  color,
  trackColor,
  style,
}: ProgressBarProps) {
  const { colors, Radius } = useTheme();

  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <View
      style={[
        {
          height,
          backgroundColor: trackColor ?? colors.border,
          borderRadius: Radius.full,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <View
        style={{
          width: `${clamped}%`,
          height: '100%',
          backgroundColor: color ?? colors.primary,
          borderRadius: Radius.full,
        }}
      />
    </View>
  );
}

export default ProgressBar;