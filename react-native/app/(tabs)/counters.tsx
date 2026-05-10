import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, Modal, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { tapHaptic, actionHaptic, warningHaptic } from '@/utils/haptics';

function showAlert(title: string, message: string, buttons?: { text: string; style?: string; onPress?: () => void }[]) {
  if (Platform.OS === 'web') {
    const destructive = buttons?.find(b => b.style === 'destructive');
    if (destructive) {
      if (window.confirm(`${title}\n\n${message}`)) {
        destructive.onPress?.();
      }
    } else {
      window.alert(`${title}\n\n${message}`);
    }
  } else {
    Alert.alert(title, message, buttons as any);
  }
}
import { useColorScheme } from 'react-native';
import { useCounterManager } from '@/hooks/use-counter-manager';
import { Colors } from '@/constants/theme';

export default function CountersScreen() {
  const colorScheme = useColorScheme();
  const mode = colorScheme ?? 'light';

  const { counters } = useCounterManager();

  const [showAddModal, setShowAddModal] = useState(false);
  const [counterName, setCounterName] = useState('');

  const textColor = mode === 'dark' ? Colors.dark.text : Colors.light.text;
  const backgroundColor = mode === 'dark' ? Colors.dark.background : Colors.light.background;
  const dividerColor = mode === 'dark' ? Colors.dark.divider : Colors.light.divider;
  const accentColor = mode === 'dark' ? Colors.dark.accent : Colors.light.accent;

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
      showAlert('Error', error.message || 'Failed to add counter');
    }
  };

  const handleDeleteCounter = (id: string, name: string) => {
    showAlert(
      'Remove Counter',
      `${name} will be deleted permanently.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => useCounterManager.getState().removeCounter(id) },
      ]
    );
  };

  const handleResetCounter = (id: string) => {
    warningHaptic();
    useCounterManager.getState().resetCounter(id);
  };

  const handleIncrement = (id: string) => {
    tapHaptic();
    useCounterManager.getState().incrementCounter(id);
  };

  const handleDecrement = (id: string) => {
    const state = useCounterManager.getState();
    const counter = state.counters.find((c) => c.id === id);
    if ((counter?.count || 0) > 0) {
      tapHaptic();
      useCounterManager.getState().decrementCounter(id);
    }
  };

  const handleResetAll = () => {
    useCounterManager.getState().resetAll();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

      {/* Most Used Counter */}
      {topCounter && topCounter.totalIncrements > 0 && (
        <View
          style={{
            padding: 16,
            backgroundColor: mode === 'dark' ? Colors.dark.elevated : accentColor.primaryLight,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons name="trending-up" size={28} color={accentColor.primary} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: textColor.secondary }}>
                Most Used Counter
              </Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: textColor.primary, marginTop: 4 }}>
                {topCounter.name}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Empty state */}
      {counters.length === 0 && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
          <Text style={{ color: textColor.secondary, fontSize: 16, textAlign: 'center' }}>
            No counters yet. Tap + to add one.
          </Text>
        </View>
      )}

      {/* Counter List */}
      <ScrollView style={{ flex: 1, padding: 8 }}>
        {counters.map((counter) => (
          <View
            key={counter.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 8,
              paddingHorizontal: 8,
              minHeight: 56,
            }}>
            {/* Counter name (leading) */}
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: textColor.primary, marginRight: 12, flexShrink: 1 }}>
              {counter.name}
            </Text>

            {/* Count badge (title area) */}
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: counter.hasBeenUsed ? '#1976D2' : '#424242',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 8,
              }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: counter.hasBeenUsed ? '#FFFFFF' : '#9E9E9E',
                }}>
                {counter.count}
              </Text>
            </View>

            {/* Spacer */}
            <View style={{ flex: 1 }} />

            {/* Action buttons (trailing) */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => handleDecrement(counter.id)}
                disabled={(counter.count || 0) === 0}
                accessibilityRole="button"
                accessibilityLabel={`Decrement ${counter.name}`}
                accessibilityState={{ disabled: (counter.count || 0) === 0 }}
                style={{ padding: 8, opacity: (counter.count || 0) === 0 ? 0.3 : 1 }}
              >
                <MaterialIcons name="remove" size={22} color={textColor.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleIncrement(counter.id)}
                accessibilityRole="button"
                accessibilityLabel={`Increment ${counter.name}`}
                style={{ padding: 8 }}
              >
                <MaterialIcons name="add" size={22} color={textColor.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleResetCounter(counter.id)}
                accessibilityRole="button"
                accessibilityLabel={`Reset ${counter.name}`}
                style={{ padding: 8 }}
              >
                <MaterialIcons name="refresh" size={20} color={textColor.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteCounter(counter.id, counter.name)}
                accessibilityRole="button"
                accessibilityLabel={`Delete ${counter.name}`}
                style={{ padding: 8 }}
              >
                <MaterialIcons name="delete" size={20} color="#F44336" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* FAB - Add button */}
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Add a new counter"
        style={{
          position: 'absolute',
          bottom: 28,
          right: 28,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 14,
          borderRadius: 28,
          backgroundColor: accentColor.primary,
          elevation: 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        }}
        onPress={() => { actionHaptic(); setShowAddModal(true); }}
      >
        <Text style={{ fontSize: 20, color: '#FFFFFF', marginRight: 8 }}>+</Text>
        <Text style={{ fontSize: 16, color: '#FFFFFF', fontWeight: '600' }}>Add</Text>
      </TouchableOpacity>

      {/* Add Counter Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View
            style={{
              backgroundColor: mode === 'dark' ? Colors.dark.elevated : Colors.light.primary,
              borderRadius: 16,
              padding: 24,
              width: '85%',
              maxWidth: 360,
            }}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: textColor.primary, marginBottom: 16 }}>
              Add New Counter
            </Text>

            <TextInput
              style={{
                backgroundColor: mode === 'dark' ? Colors.dark.secondary : Colors.light.secondary,
                color: textColor.primary,
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                borderWidth: 1,
                borderColor: dividerColor,
              }}
              placeholder="Counter Name"
              placeholderTextColor={textColor.muted}
              value={counterName}
              onChangeText={setCounterName}
              maxLength={50}
              autoFocus
            />
            <Text style={{ fontSize: 12, color: textColor.secondary, marginTop: 4 }}>
              e.g., Jumps, Sprints
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 }}>
              <TouchableOpacity
                style={{ paddingVertical: 10, paddingHorizontal: 16, marginRight: 8 }}
                onPress={() => { setShowAddModal(false); setCounterName(''); }}
              >
                <Text style={{ color: accentColor.primary, fontSize: 14, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  backgroundColor: accentColor.primary,
                  borderRadius: 8,
                }}
                onPress={handleAddCounter}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600' }}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
