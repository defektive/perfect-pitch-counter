import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CounterDisplayProps {
  count: number;
  title?: string;
  subtitle?: string;
  showBorder?: boolean;
}

export function CounterDisplay({
  count,
  title,
  subtitle,
  showBorder = true,
}: CounterDisplayProps) {
  return (
    <View style={[styles.container, showBorder && styles.bordered]}>
      {title && <Text style={styles.title}>{title}</Text>}
      <Text style={styles.count}>{count}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  bordered: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#333',
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  count: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
