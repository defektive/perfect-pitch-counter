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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  actionLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  actionChevron: {
    fontSize: 24,
    color: '#444',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  infoTitle: {
    fontSize: 14,
    color: '#888',
  },
  infoValue: {
    fontSize: 14,
    color: '#fff',
  },
});
