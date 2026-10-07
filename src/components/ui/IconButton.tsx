import React from 'react';
import { Pressable, ViewStyle } from 'react-native';
import { useTheme } from '@hooks/useTheme';

export interface IconButtonProps {
  icon: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'filled' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export function IconButton({
  icon,
  onPress,
  variant = 'default',
  size = 'md',
  style,
  accessibilityLabel,
}: IconButtonProps) {
  const { colors, Radius, Shadows } = useTheme();

  const sizes = {
    sm: 32,
    md: 40,
    lg: 48,
  };

  const variantStyle: ViewStyle =
    variant === 'filled'
      ? {
          backgroundColor: colors.primary,
          ...Shadows.brandSm,
        }
      : variant === 'dark'
      ? { backgroundColor: colors.text }
      : {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          ...Shadows.sm,
        };

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: sizes[size],
          height: sizes[size],
          borderRadius: Radius.full,
          alignItems: 'center',
          justifyContent: 'center',
        },
        variantStyle,
        pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
        style,
      ]}
    >
      {icon}
    </Pressable>
  );
}

export default IconButton;