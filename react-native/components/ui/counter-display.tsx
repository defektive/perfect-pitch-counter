import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, Spacing } from '@/constants/theme';

interface CounterDisplayProps {
  count: number;
  title?: string;
  subtitle?: string;
  showBorder?: boolean;
  style?: ViewStyle;
  circular?: boolean;
}

export function CounterDisplay({
  count,
  title,
  subtitle,
  showBorder = true,
  style,
  circular = false,
}: CounterDisplayProps) {
  return (
    <View style={[styles.container, circular && styles.circular, showBorder && styles.bordered, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      <Text style={[styles.count, circular && styles.circularCount]}>{count}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  circular: {
    minWidth: 80,
    height: 80,
    padding: 0,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  bordered: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: Colors.border.light,
    backgroundColor: Colors.background.primary,
  },
  title: {
    fontSize: Typography.caption.fontSize,
    color: Colors.text.tertiary,
    marginBottom: Spacing.xs,
  },
  count: {
    fontSize: Typography.large.fontSize,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  circularCount: {
    fontSize: 36,
  },
  subtitle: {
    fontSize: Typography.caption.fontSize,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
});
