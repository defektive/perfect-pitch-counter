import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: string;
  style?: ViewStyle;
  disabled?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  style,
  disabled = false,
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getBgColor = () => {
    switch (variant) {
      case 'primary':
        return '#2196f3';
      case 'secondary':
        return '#444';
      case 'ghost':
        return 'transparent';
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return '#fff';
      case 'secondary':
        return colors.primary;
      case 'ghost':
        return colors.primary;
      default:
        return '#fff';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, style, disabled && styles.disabled, getBgColor()]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, disabled && styles.disabledText, getTextColor()]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 48,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#999',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
