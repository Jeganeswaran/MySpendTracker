import React, { useEffect, useRef } from 'react';
import { Pressable, Animated, ViewStyle } from 'react-native';
import { useTheme } from '@hooks/useTheme';

export interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Switch({ value, onValueChange, disabled, style }: SwitchProps) {
  const { colors } = useTheme();
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, anim]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 20],
  });

  const trackColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.borderStrong, colors.primary],
  });

  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      style={[{ opacity: disabled ? 0.5 : 1 }, style]}
    >
      <Animated.View
        style={{
          width: 44,
          height: 26,
          borderRadius: 13,
          backgroundColor: trackColor,
          justifyContent: 'center',
        }}
      >
        <Animated.View
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: '#FFFFFF',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 2,
            transform: [{ translateX }],
          }}
        />
      </Animated.View>
    </Pressable>
  );
}

export default Switch;