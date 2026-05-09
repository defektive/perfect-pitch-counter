import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { useColorScheme } from 'react-native';
import { useCounterManager } from '@/hooks/use-counter-manager';
import { usePitchGame } from '@/hooks/use-pitch-game';
import { Typography, Spacing, Colors } from '@/constants/theme';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const mode = colorScheme ?? 'light';

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

  const backgroundColor = mode === 'dark' ? Colors.dark.primary : Colors.light.card;
  const dividerColor = mode === 'dark' ? Colors.dark.divider : Colors.light.divider;
  const textColor = mode === 'dark' ? Colors.dark.text : Colors.light.text;

  return (
    <ScrollView style={{ flex: 1, backgroundColor }} contentContainerStyle={{ paddingBottom: Spacing.xl }}>
      <View style={{ paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md }}>
        <Text style={{ fontSize: Typography.subtitle.fontSize, color: textColor.tertiary, marginBottom: Spacing.md, textTransform: 'uppercase', letterSpacing: 0.5 }}>Data Management</Text>

        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm }} onPress={handleResetAll}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 20 }}>🔄</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: textColor.primary }}>Reset All Data</Text>
              <Text style={{ fontSize: 12, color: textColor.secondary, marginTop: 2 }}>Clear all counters and game data</Text>
            </View>
          </View>
          <Text style={{ fontSize: 24, color: textColor.muted }}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm }}
          onPress={() => Alert.alert('Settings', 'App preferences and options.')}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 20 }}>⚙️</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: textColor.primary }}>Settings</Text>
              <Text style={{ fontSize: 12, color: textColor.secondary, marginTop: 2 }}>App preferences and options</Text>
            </View>
          </View>
          <Text style={{ fontSize: 24, color: textColor.muted }}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md }}>
        <Text style={{ fontSize: Typography.subtitle.fontSize, color: textColor.tertiary, marginBottom: Spacing.md, textTransform: 'uppercase', letterSpacing: 0.5 }}>About</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: dividerColor }}>
          <Text style={{ fontSize: 14, color: textColor.secondary }}>Version</Text>
          <Text style={{ fontSize: 14, color: textColor.primary }}>0.1.5</Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: dividerColor }}>
          <Text style={{ fontSize: 14, color: textColor.secondary }}>Platform</Text>
          <Text style={{ fontSize: 14, color: textColor.primary }}>
            {Platform.OS === 'ios' ? 'iOS' : Platform.OS === 'android' ? 'Android' : 'Web'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
