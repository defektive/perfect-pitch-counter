import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Modal, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useCounterManager } from '@/hooks/use-counter-manager';
import { CounterDisplay } from '@/components/ui/counter-display';

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
    if (counter?.count > 0) {
      useCounterManager.getState().decrementCounter(id);
    }
  };


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding">
      {/* Most Used Counter */}
      {topCounter && (
        <View style={[styles.topCounter, { backgroundColor: '#e3f2fd' }]}>
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
      <ScrollView style={styles.list}>
        {counters.map((counter) => (
          <View key={counter.id} style={styles.counterRow}>
            <View style={styles.counterName}>
              <Text style={styles.counterNameText}>{counter.name}</Text>
            </View>

            <View style={styles.counterValue}>
              <CounterDisplay
                count={counter.count}
                title={counter.hasBeenUsed ? counter.name.toUpperCase() : ''}
                showBorder={false}
              />
            </View>

            <View style={styles.counterActions}>
              <TouchableOpacity
                style={[styles.actionBtn, counter.count === 0 && styles.disabledBtn]}
                onPress={() => handleDecrement(counter.id)}
                disabled={counter.count === 0}>
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
          </View>
        ))}
      </ScrollView>

      {/* Add Counter FAB */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => setShowAddModal(true)}
      >
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
              placeholderTextColor="#999"
              value={counterName}
              onChangeText={setCounterName}
              maxLength={50}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setShowAddModal(false)}>
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnAdd]}
                onPress={handleAddCounter}>
                <Text style={styles.modalBtnText}>Add</Text>
              </TouchableOpacity>
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
    backgroundColor: '#000',
  },
  topCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingHorizontal: 16,
  },
  topIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topIcon: {
    fontSize: 20,
  },
  topTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  topLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
  },
  topName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
    marginTop: 2,
  },
  topValue: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  counterName: {
    flex: 2,
  },
  counterNameText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  counterValue: {
    flex: 3,
    alignItems: 'center',
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
    marginRight: 4,
  },
  disabledBtn: {
    backgroundColor: '#333',
  },
  iconBtn: {
    backgroundColor: 'transparent',
    marginRight: 0,
  },
  deleteBtn: {
    marginRight: 0,
  },
  actionIcon: {
    fontSize: 20,
    color: '#fff',
  },
  addBtn: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    fontSize: 28,
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 340,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#444',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalBtnCancel: {
    backgroundColor: '#333',
  },
  modalBtnAdd: {
    backgroundColor: '#1976d2',
  },
  modalBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
