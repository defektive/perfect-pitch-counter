import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

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
  const getBgColor = () => {
    switch (variant) {
      case 'primary':
        return '#1976d2';
      case 'secondary':
        return '#444';
      case 'ghost':
        return 'transparent';
      default:
        return '#1976d2';
    }
  };

  const getTextColor = () => '#fff';

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, disabled && styles.disabledText]}>{title}</Text>
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
