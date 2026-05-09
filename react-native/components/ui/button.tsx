import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: string;
  style?: ViewStyle;
  disabled?: boolean;
  textStyle?: {
    fontSize?: number;
    fontWeight?: number;
    letterSpacing?: number;
  };
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  style,
  disabled = false,
  textStyle = { fontSize: 14, fontWeight: '600', letterSpacing: 1 },
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}>
      <Text style={[styles.text, disabled && styles.disabledText, {
        fontSize: textStyle.fontSize || 14,
        fontWeight: textStyle.fontWeight || '600',
        letterSpacing: textStyle.letterSpacing || 1
      }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: Spacing.md * 2,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 48,
    borderWidth: 1,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: Colors.text.muted,
  },
  text: {
    color: Colors.text.primary,
  },
});
