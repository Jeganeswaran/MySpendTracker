// Floating Action Button
import React from 'react';
import { Pressable, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Plus } from 'lucide-react-native';
import { useTheme } from '@hooks/useTheme';

export interface FABProps {
    onPress: () => void;
    icon?: React.ReactNode;
    size?: number;
    style?: ViewStyle;
}

export function FAB({ onPress, icon, size = 56, style }: FABProps) {
    const { colors, Radius, Shadows } = useTheme();

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                {
                    width: size,
                    height: size,
                    borderRadius: Radius.full,
                    ...(pressed && { transform: [{ scale: 0.94 }] }),
                },
                style,
            ]}
        >
            <LinearGradient
                colors={[colors.gradientPrimaryStart, colors.gradientPrimaryEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                    {
                        width: size,
                        height: size,
                        borderRadius: Radius.full,
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                    Shadows.brandLg,
                ]}
            >
                {icon ?? <Plus size={26} color="#FFFFFF" strokeWidth={2.5} />}
            </LinearGradient>
        </Pressable>
    );
}

export default FAB;