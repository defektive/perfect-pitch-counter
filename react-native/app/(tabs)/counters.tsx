import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Modal, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useCounterManager } from '@/hooks/use-counter-manager';
import { CounterDisplay } from '@/components/ui/counter-display';
import { Button } from '@/components/ui/button';
import { Colors, Typography, Spacing } from '@/constants/theme';

export default function CountersScreen() {
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Most Used Counter */}
      {topCounter && (
        <View style={[styles.topCounter, { backgroundColor: Colors.accent.primaryLight }]}>
          <View style={styles.topIconContainer}>
            <Text style={styles.topIcon}>📈</Text>
          </View>
          <View style={styles.topTextContainer}>
            <Text style={styles.topLabel}>Most Used Counter</Text>
            <Text style={styles.topName}>{topCounter.name}</Text>
            <Text style={styles.topValue}>{topCounter.totalIncrements} uses</Text>
          </View>
        </View>
      )}

      {/* Empty state */}
      {counters.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No counters yet. Tap + to add one.</Text>
        </View>
      )}

      {/* Counter List */}
      <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 100 }}>
        {counters.map((counter) => (
          <TouchableOpacity
            key={counter.id}
            style={[styles.counterRow, { backgroundColor: Colors.background.primary }]}>
            <View style={styles.counterName}>
              <Text style={styles.counterNameText}>{counter.name}</Text>
            </View>

            <View style={styles.counterValue}>
              <CounterDisplay
                count={(counter.count || 0)}
                title={counter.hasBeenUsed ? counter.name.toUpperCase() : ''}
                showBorder={false}
              />
            </View>

            <View style={styles.counterActions}>
              <TouchableOpacity
                style={[styles.actionBtn, (counter.count || 0) === 0 && styles.disabledBtn]}
                onPress={() => handleDecrement(counter.id)}
                disabled={(counter.count || 0) === 0}>
                <Text style={styles.actionIcon}>−</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleIncrement(counter.id)}>
                <Text style={styles.actionIcon}>+</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.iconBtn]}
                onPress={() => handleResetCounter(counter.id)}>
                <Text style={styles.actionIcon}>🔄</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.iconBtn, styles.deleteBtn]}
                onPress={() => handleDeleteCounter(counter.id)}>
                <Text style={styles.actionIcon}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add Counter FAB */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => setShowAddModal(true)}>
        <Text style={styles.addBtnText}>+</Text>
      </TouchableOpacity>

      {/* Add Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Counter</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g., Jumps, Sprints"
              placeholderTextColor={Colors.text.muted}
              value={counterName}
              onChangeText={setCounterName}
              maxLength={50}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setShowAddModal(false)}>
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <Button
                title="Add"
                onPress={handleAddCounter}
                style={styles.modalBtnAdd}
              />
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.card,
  },
  topCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  topIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topIcon: {
    fontSize: 20,
  },
  topTextContainer: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  topLabel: {
    fontSize: Typography.subtitle.fontSize,
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  topName: {
    fontSize: Typography.h3.fontSize,
    fontWeight: Typography.h3.fontWeight,
    color: Colors.accent.primary,
    marginBottom: Spacing.xs,
  },
  topValue: {
    fontSize: Typography.caption.fontSize,
    color: Colors.text.secondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  emptyText: {
    color: Colors.text.secondary,
    fontSize: 16,
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  counterName: {
    flex: 2,
  },
  counterNameText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  counterValue: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterActions: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.xs,
    backgroundColor: Colors.background.primary,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  disabledBtn: {
    backgroundColor: Colors.background.secondary,
    borderColor: Colors.border.dark,
  },
  iconBtn: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginRight: 0,
  },
  deleteBtn: {
    marginRight: 0,
  },
  actionIcon: {
    fontSize: 20,
    color: Colors.text.primary,
  },
  addBtn: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.accent.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  addBtnText: {
    fontSize: 28,
    color: Colors.text.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    padding: Spacing.lg,
    width: '90%',
    maxWidth: 360,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: Typography.h3.fontWeight,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: Colors.background.secondary,
    color: Colors.text.primary,
    borderRadius: 8,
    padding: Spacing.md,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.border.light,
    width: '100%',
    textAlign: 'center',
    minHeight: 44,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
    height: 44,
    marginHorizontal: 2,
  },
  modalBtnCancel: {
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  modalBtnAdd: {
    backgroundColor: Colors.accent.primary,
  },
  modalBtnText: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
