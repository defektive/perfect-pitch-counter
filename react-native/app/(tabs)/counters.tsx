import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, Modal, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
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
  const dividerColor = mode === 'dark' ? Colors.dark.divider : Colors.light.divider;
  const darkAccent = mode === 'dark' ? Colors.dark : Colors.light;
  const textColor = mode === 'dark' ? Colors.dark.text : Colors.light.text;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Most Used Counter */}
      {topCounter && (
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: Spacing.md, paddingHorizontal: Spacing.xl, backgroundColor: darkAccent.accent.primaryLight }}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: darkAccent.accent.primary, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20 }}>📈</Text>
          </View>
          <View style={{ flex: 1, marginLeft: Spacing.md }}>
            <Text style={{ fontSize: Typography.subtitle.fontSize, color: darkAccent.text.secondary, textTransform: 'uppercase', marginBottom: Spacing.xs }}>Most Used Counter</Text>
            <Text style={{ fontSize: Typography.h3.fontSize, fontWeight: Typography.h3.fontWeight, color: darkAccent.accent.primary, marginBottom: Spacing.xs }}>{topCounter.name}</Text>
            <Text style={{ fontSize: Typography.caption.fontSize, color: darkAccent.text.secondary }}>{topCounter.totalIncrements} uses</Text>
          </View>
        </View>
      )}

      {/* Empty state */}
      {counters.length === 0 && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.lg }}>
          <Text style={{ color: textColor.secondary, fontSize: 16, textAlign: 'center' }}>No counters yet. Tap + to add one.</Text>
        </View>
      )}

      {/* Counter List */}
      <ScrollView style={{ flex: 1 }}>
        {counters.map((counter) => (
          <TouchableOpacity
            key={counter.id}
            style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, backgroundColor }}>
            <View style={{ flex: 2 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: textColor.primary }}>{counter.name}</Text>
            </View>

            <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}>
              <CounterDisplay
                count={counter.count || 0}
                title={counter.hasBeenUsed ? counter.name.toUpperCase() : ''}
              />
            </View>

            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
              <TouchableOpacity
                style={{ width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.xs, backgroundColor: mode === 'dark' ? Colors.dark.primary : Colors.light.primary, borderWidth: 1, borderColor: dividerColor }}
                onPress={() => handleDecrement(counter.id)}
                disabled={(counter.count || 0) === 0}>
                <Text style={{ fontSize: 20, color: textColor.primary }}>−</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.xs, backgroundColor: mode === 'dark' ? Colors.dark.primary : Colors.light.primary, borderWidth: 1, borderColor: dividerColor }}>
                <Text style={{ fontSize: 20, color: textColor.primary }}>+</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 0, backgroundColor: 'transparent', borderWidth: 0 }}>
                <Text style={{ fontSize: 20, color: textColor.primary }}>🔄</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 0 }}>
                <Text style={{ fontSize: 20, color: textColor.primary }}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add Counter FAB */}
      <TouchableOpacity
        style={{ position: 'absolute', bottom: 32, right: 32, width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.accent.primary, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 8 }}>
        <Text style={{ fontSize: 28, color: textColor.primary }}>+</Text>
      </TouchableOpacity>

      {/* Add Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="fade">
        <View style={{ flex: 1, backgroundColor }}>
          <View style={{ backgroundColor, borderRadius: 16, padding: Spacing.lg, width: '90%', maxWidth: 360, alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: Typography.h3.fontWeight, color: textColor.primary, marginBottom: Spacing.md, textAlign: 'center' }}>Add New Counter</Text>
            <TextInput
              style={{ backgroundColor: mode === 'dark' ? Colors.dark.secondary : Colors.light.secondary, color: textColor.primary, borderRadius: 8, padding: Spacing.md, fontSize: 16, borderWidth: 1, borderColor: dividerColor, width: '100%', textAlign: 'center', minHeight: 44, flex: 1 }}
              placeholder="e.g., Jumps, Sprints"
              placeholderTextColor={textColor.muted}
              value={counterName}
              onChangeText={setCounterName}
              maxLength={50}
              autoFocus
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.md, width: '100%' }}>
              <TouchableOpacity
                style={{ flex: 1, paddingVertical: Spacing.sm, borderRadius: 8, alignItems: 'center', height: 44, marginHorizontal: 2, backgroundColor: mode === 'dark' ? Colors.dark.secondary : Colors.light.secondary, borderWidth: 1, borderColor: dividerColor }}>
                <Text style={{ color: textColor.primary, fontSize: 16, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <Button
                title="Add"
                onPress={handleAddCounter}
                style={{ flex: 1, height: 44 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
