import React, { useEffect, useRef } from 'react';
import { View, Animated, Pressable } from 'react-native';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@hooks/useTheme';
import { Text } from '@components/ui/Text';
import { useToastStore, ToastVariant } from '@stores/useToastStore';

// ─────────────────────────────────────────────
// VARIANT CONFIG
// ─────────────────────────────────────────────

const VARIANT_ICON = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
} as const;

// ─────────────────────────────────────────────
// SINGLE TOAST
// ─────────────────────────────────────────────

interface SingleToastProps {
    id: string;
    variant: ToastVariant;
    title?: string;
    message: string;
    onDismiss: (id: string) => void;
}

function SingleToast({ id, variant, title, message, onDismiss }: SingleToastProps) {
    const { colors, Radius, Spacing, Shadows } = useTheme();
    const slideY = useRef(new Animated.Value(-80)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(slideY, {
                toValue: 0,
                duration: 260,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
    }, [slideY, opacity]);

    const Icon = VARIANT_ICON[variant];

    const variantColor = {
        success: colors.success,
        error: colors.danger,
        warning: colors.warning,
        info: colors.info,
    }[variant];

    const variantBg = {
        success: colors.successSoft,
        error: colors.dangerSoft,
        warning: colors.warningSoft,
        info: colors.infoSoft,
    }[variant];

    const handleDismiss = () => {
        Animated.parallel([
            Animated.timing(slideY, {
                toValue: -80,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 180,
                useNativeDriver: true,
            }),
        ]).start(() => onDismiss(id));
    };

    return (
        <Animated.View
            style={{
                transform: [{ translateY: slideY }],
                opacity,
                marginBottom: Spacing.sm,
            }}
        >
            <Pressable
                onPress={handleDismiss}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: Spacing.md,
                    backgroundColor: colors.card,
                    borderLeftWidth: 4,
                    borderLeftColor: variantColor,
                    borderRadius: Radius.xl,
                    paddingVertical: Spacing.md,
                    paddingHorizontal: Spacing.lg,
                    ...Shadows.lg,
                }}
            >
                <View
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: Radius.md,
                        backgroundColor: variantBg,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Icon size={18} color={variantColor} strokeWidth={2.5} />
                </View>

                <View style={{ flex: 1, minWidth: 0 }}>
                    {title && (
                        <Text variant="body" weight="bold" numberOfLines={1}>
                            {title}
                        </Text>
                    )}
                    <Text
                        variant="caption"
                        color={colors.text}
                        numberOfLines={2}
                        style={{ marginTop: title ? 2 : 0 }}
                    >
                        {message}
                    </Text>
                </View>

                <Pressable onPress={handleDismiss} hitSlop={8}>
                    <X size={16} color={colors.textTertiary} />
                </Pressable>
            </Pressable>
        </Animated.View>
    );
}

// ─────────────────────────────────────────────
// TOAST CONTAINER (mount once in App root)
// ─────────────────────────────────────────────

export function ToastContainer() {
    const insets = useSafeAreaInsets();
    const toasts = useToastStore((s) => s.toasts);
    const dismiss = useToastStore((s) => s.dismiss);

    if (toasts.length === 0) return null;

    return (
        <View
            pointerEvents="box-none"
            style={{
                position: 'absolute',
                top: insets.top + 8,
                left: 16,
                right: 16,
                zIndex: 9999,
            }}
        >
            {toasts.map((toast) => (
                <SingleToast
                    key={toast.id}
                    id={toast.id}
                    variant={toast.variant}
                    title={toast.title}
                    message={toast.message}
                    onDismiss={dismiss}
                />
            ))}
        </View>
    );
}

export default ToastContainer;