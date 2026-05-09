import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useColorScheme } from 'react-native';
import { usePitchGame } from '@/hooks/use-pitch-game';
import { CounterDisplay } from '@/components/ui/counter-display';
import { Typography, Spacing, Colors } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.max(SCREEN_WIDTH - 48, 280);
const CARD_MARGIN = (SCREEN_WIDTH - CARD_WIDTH) / 2;

export default function ScoreScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Strike Percentage */}
        <View style={[styles.statCard, { width: CARD_WIDTH, marginLeft: CARD_MARGIN }]}>
          <Text style={styles.statLabel}>Strike %</Text>
          <Text style={styles.statValue}>--</Text>
        </View>

        {/* Ball Count */}
        <View style={[styles.statCard, { width: CARD_WIDTH, marginLeft: CARD_MARGIN }]}>
          <Text style={styles.statLabel}>Balls</Text>
          <CounterDisplay count={usePitchGame.getState().totalBalls} subtitle="Total" />
        </View>

        {/* Strike Count */}
        <View style={[styles.statCard, { width: CARD_WIDTH, marginLeft: CARD_MARGIN }]}>
          <Text style={styles.statLabel}>Strikes</Text>
          <CounterDisplay count={usePitchGame.getState().totalStrikes} subtitle="Total" />
        </View>

        {/* Hits */}
        <View style={[styles.statCard, { width: CARD_WIDTH, marginLeft: CARD_MARGIN }]}>
          <Text style={styles.statLabel}>Hits</Text>
          <CounterDisplay count={usePitchGame.getState().hitCount} />
        </View>

        {/* Walks */}
        <View style={[styles.statCard, { width: CARD_WIDTH, marginLeft: CARD_MARGIN }]}>
          <Text style={styles.statLabel}>Walks</Text>
          <CounterDisplay count={usePitchGame.getState().walkCount} />
        </View>

        {/* Outs */}
        <View style={[styles.statCard, { width: CARD_WIDTH, marginLeft: CARD_MARGIN }]}>
          <Text style={styles.statLabel}>Outs</Text>
          <CounterDisplay count={usePitchGame.getState().outCount} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.card,
  },
  scrollContainer: {
    padding: Spacing.xl,
  },
  statCard: {
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: Typography.subtitle.fontSize,
    color: Colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },
  statValue: {
    fontSize: Typography.large.fontSize,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
});
