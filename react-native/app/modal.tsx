import React from 'react';
import { View, Text, StyleSheet, Linking, ScrollView } from 'react-native';
import { CounterDisplay } from '@/components/ui/counter-display';

export default function ModalScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>This is a modal</Text>
      <CounterDisplay count={42} title="Example Count" />

      <Text style={styles.linkContainer}>
        <Text style={styles.link} onPress={() => Linking.openURL('https://github.com/defektive/pitch-counter')}>
          Visit GitHub Repo
        </Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  linkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  link: {
    color: '#4DA6FF',
    textDecorationLine: 'underline',
  },
});
