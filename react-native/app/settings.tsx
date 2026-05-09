import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {

  const handleResetAll = async () => {
    if (confirm('Are you sure you want to reset all counters?')) {
      await AsyncStorage.multiRemove(['counters', 'pitch-game']);
    }
  };

  return (
    <ScrollView style={styles.container}>
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
          onPress={() => alert('Debug mode is not available')}>
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

const styles = StyleSheet.create({});
