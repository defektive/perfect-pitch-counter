import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, Modal, KeyboardAvoidingView, ScrollView, Platform, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';
import { useCounterManager } from '@/hooks/use-counter-manager';
import { CounterDisplay } from '@/components/ui/counter-display';
import { Button } from '@/components/ui/button';
import { Typography, Spacing, Colors } from '@/constants/theme';

export default function CountersScreen() {
  const colorScheme = useColorScheme();
  const mode = colorScheme ?? 'light';

  const { counters } = useCounterManager();

  const [showAddModal, setShowAddModal] = useState(false);
  const [counterName, setCounterName] = useState('');

  const topCounter = counters.length
    ? counters.reduce((a, b) => (a.totalIncrements > b.totalIncrements ? a : b), counters[0])
    : null;

  const handleAddCounter = async () => {
    if (!counterName.trim()) return;

    try {
      await useCounterManager.getState().addCounter(counterName.trim());
      setCounterName('');
      setShowAddModal(false);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add counter');
    }
  };

  const handleDeleteCounter = (id: string) => {
    Alert.alert(
      'Delete Counter',
      'This action cannot be undone. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => useCounterManager.getState().removeCounter(id) },
      ]
    );
  };

  const handleResetCounter = (id: string) => {
    useCounterManager.getState().resetCounter(id);
  };

  const handleIncrement = (id: string) => {
    useCounterManager.getState().incrementCounter(id);
  };

  const handleDecrement = (id: string) => {
    const state = useCounterManager.getState();
    const counter = state.counters.find((c) => c.id === id);
    if ((counter?.count || 0) > 0) {
      useCounterManager.getState().decrementCounter(id);
    }
  };

  const backgroundColor = mode === 'dark' ? Colors.dark.primary : Colors.light.card;
  const cardColor = mode === 'dark' ? Colors.dark.primary : Colors.light.primary;
  const darkAccent = mode === 'dark' ? Colors.dark : Colors.light;
  const textColor = mode === 'dark' ? Colors.dark.text : Colors.light.text;
  const accentColor = mode === 'dark' ? Colors.dark.accent : Colors.light.accent;

  const actionButtonStyle = StyleSheet.flatten({
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: cardColor,
    borderWidth: 2,
    borderColor: dividerColor,
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={{ alignItems: 'center', paddingTop: 24, paddingBottom: 16, paddingHorizontal: 4 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: textColor.primary }}>My Counters</Text>
        <Text style={{ fontSize: 13, color: textColor.secondary, marginTop: 4 }}>
          Create and track custom counters
        </Text>
      </View>

      {/* Most Used Counter */}
      {topCounter && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: accentColor.primaryLight,
            padding: 16,
            paddingHorizontal: 20,
            borderRadius: 16,
            marginBottom: 12,
          }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: accentColor.primary,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 16,
            }}>
            <Text style={{ fontSize: 24 }}>📈</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, color: darkAccent.text.secondary, textTransform: 'uppercase', marginBottom: 6 }}>
              Most Used
            </Text>
            <Text style={{ fontSize: 18, fontWeight: '700', color: accentColor.primary, marginBottom: 4 }}>
              {topCounter.name}
            </Text>
            <Text style={{ fontSize: 11, color: darkAccent.text.secondary }}>
              {topCounter.totalIncrements} uses
            </Text>
          </View>
        </View>
      )}

      {/* Empty state */}
      {counters.length === 0 && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 48, marginBottom: 8 }}>📊</Text>
            <Text style={{ color: textColor.secondary, fontSize: 16, textAlign: 'center' }}>
              No counters yet. Tap + to add one.
            </Text>
          </View>
        </View>
      )}

      {/* Counter List */}
      <ScrollView style={{ flex: 1 }}>
        {counters.map((counter) => (
          <View
            key={counter.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: cardColor,
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderRadius: 14,
              marginBottom: 10,
            }}>
            <View style={{ flex: 3 }}>
              <Text style={{ fontSize: 17, fontWeight: '600', color: textColor.primary }}>{counter.name}</Text>
            </View>

            <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
              <CounterDisplay
                count={counter.count || 0}
                title={counter.hasBeenUsed ? counter.name.toUpperCase() : ''}
              />
            </View>

            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                style={{ ...actionButtonStyle, opacity: (counter.count || 0) === 0 ? 0.4 : 1 }}
                onPress={() => handleDecrement(counter.id)}
                disabled={(counter.count || 0) === 0}
                accessibilityLabel={`Decrease ${counter.name} counter`}
              >
                <Text style={{ fontSize: 20, color: textColor.primary }}>−</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ ...actionButtonStyle, backgroundColor: accentColor.primaryLight, borderColor: dividerColor }}
                onPress={() => handleIncrement(counter.id)}
                accessibilityLabel={`Increase ${counter.name} counter`}
              >
                <Text style={{ fontSize: 22, color: textColor.primary }}>+</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ ...actionButtonStyle, width: 40, height: 40, backgroundColor: 'transparent', borderWidth: 0 }}
                onPress={() => handleResetCounter(counter.id)}
                accessibilityLabel={`Reset ${counter.name} counter`}
              >
                <Text style={{ fontSize: 20, color: textColor.primary }}>↻</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ ...actionButtonStyle, width: 40, height: 40, backgroundColor: 'transparent', borderWidth: 0, marginRight: 0 }}
                onPress={() => handleDeleteCounter(counter.id)}
                accessibilityLabel={`Delete ${counter.name} counter`}
              >
                <Text style={{ fontSize: 20, color: textColor.error }}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Counter FAB */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 28,
          right: 28,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: accentColor.primary,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 8,
        }}
        onPress={() => setShowAddModal(true)}
        accessibilityLabel="Add new counter"
        accessibilityRole="button"
      >
        <Text style={{ fontSize: 32, color: textColor.primary }}>+</Text>
      </TouchableOpacity>

      {/* Add Counter Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}>
        <View style={{ flex: 1, backgroundColor }}>
          <View
            style={{
              backgroundColor,
              borderRadius: 20,
              padding: 20,
              width: '90%',
              maxWidth: 360,
              alignItems: 'center',
            }}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: textColor.primary, marginBottom: 12, textAlign: 'center' }}>
              Add New Counter
            </Text>

            <TextInput
              style={{
                backgroundColor: darkAccent.secondary,
                color: textColor.primary,
                borderRadius: 12,
                padding: 12,
                fontSize: 16,
                borderWidth: 2,
                borderColor: dividerColor,
                width: '100%',
                textAlign: 'center',
                minHeight: 48,
              }}
              placeholder="e.g., Jumps, Sprints"
              placeholderTextColor={textColor.muted}
              value={counterName}
              onChangeText={setCounterName}
              maxLength={50}
              autoFocus
              accessibilityLabel="Enter counter name"
              autoCapitalize="words"
              autoComplete="name"
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, width: '100%' }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 12,
                  alignItems: 'center',
                  height: 48,
                  marginHorizontal: 4,
                  backgroundColor: darkAccent.secondary,
                  borderWidth: 2,
                  borderColor: dividerColor,
                }}
                onPress={() => setShowAddModal(false)}
                accessibilityLabel="Cancel adding counter"
              >
                <Text style={{ color: textColor.primary, fontSize: 16, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <Button
                title="Add"
                onPress={handleAddCounter}
                style={{ flex: 1, height: 48 }}
                accessibilityLabel="Add counter"
              />
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
