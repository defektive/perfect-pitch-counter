import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { useCounterManager } from '@/hooks/use-counter-manager';
import { usePitchGame } from '@/hooks/use-pitch-game';
import { Colors, Typography, Spacing } from '@/constants/theme';

export default function SettingsScreen() {
  const handleResetAll = async () => {
    Alert.alert(
      'Reset All Data',
      'This will clear all counters and game data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: async () => {
          await useCounterManager.getState().resetAll();
          await usePitchGame.getState().resetGame();
        }},
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: Spacing.xl }}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>

        <TouchableOpacity style={styles.actionItem} onPress={handleResetAll}>
          <View style={styles.actionLeft}>
            <Text style={styles.actionIcon}>🔄</Text>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Reset All Data</Text>
              <Text style={styles.actionSubtitle}>Clear all counters and game data</Text>
            </View>
          </View>
          <Text style={styles.actionChevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => Alert.alert('Settings', 'App preferences and options.')}>
          <View style={styles.actionLeft}>
            <Text style={styles.actionIcon}>⚙️</Text>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Settings</Text>
              <Text style={styles.actionSubtitle}>App preferences and options</Text>
            </View>
          </View>
          <Text style={styles.actionChevron}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>

        <View style={styles.infoItem}>
          <Text style={styles.infoTitle}>Version</Text>
          <Text style={styles.infoValue}>0.1.5</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoTitle}>Platform</Text>
          <Text style={styles.infoValue}>
            {Platform.OS === 'ios' ? 'iOS' : Platform.OS === 'android' ? 'Android' : 'Web'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.card,
  },
  section: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.subtitle.fontSize,
    color: Colors.text.tertiary,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  actionLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 20,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  actionSubtitle: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  actionChevron: {
    fontSize: 24,
    color: Colors.text.muted,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider.light,
  },
  infoTitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.text.primary,
  },
});
