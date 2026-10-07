import React from 'react';
import { View, Pressable, ViewStyle } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { Text } from './Text';

export interface SegmentOption<T extends string = string> {
  label: string;
  value: T;
}

export interface SegmentControlProps<T extends string = string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  style?: ViewStyle;
}

export function SegmentControl<T extends string = string>({
  options,
  value,
  onChange,
  style,
}: SegmentControlProps<T>) {
  const { colors, Radius, Spacing } = useTheme();

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          backgroundColor: colors.cardAlt,
          borderRadius: Radius.lg,
          padding: 3,
        },
        style,
      ]}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={{
              flex: 1,
              paddingVertical: Spacing.sm,
              borderRadius: Radius.md,
              alignItems: 'center',
              justifyContent: 'center',
              ...(active && {
                backgroundColor: colors.card,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 6,
                elevation: 2,
              }),
            }}
          >
            <Text
              variant="caption"
              color={active ? colors.text : colors.textSecondary}
              weight={active ? 'semibold' : 'medium'}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default SegmentControl;