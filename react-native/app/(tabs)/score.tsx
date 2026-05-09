import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { usePitchGame } from '@/hooks/use-pitch-game';
import { CounterDisplay } from '@/components/ui/counter-display';
import { Colors, Typography, Spacing } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.max(SCREEN_WIDTH - 48, 280);
const CARD_MARGIN = (SCREEN_WIDTH - CARD_WIDTH) / 2;

export default function ScoreScreen() {
  const balls = usePitchGame.getState().totalBalls;
  const strikes = usePitchGame.getState().totalStrikes;
  const outs = usePitchGame.getState().outCount;
  const hits = usePitchGame.getState().hitCount;
  const walks = usePitchGame.getState().walkCount;
  const strikePercentage =
    balls > 0 && strikes > 0
      ? ((strikes / (balls + strikes)) * 100).toFixed(0)
      : 0;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Strike Percentage */}
        <View style={[styles.statCard, { width: CARD_WIDTH, marginLeft: CARD_MARGIN }]}>
          <Text style={styles.statLabel}>Strike %</Text>
          <Text style={styles.statValue}>{strikePercentage}%</Text>
        </View>

        {/* Ball Count */}
        <View style={[styles.statCard, { width: CARD_WIDTH, marginLeft: CARD_MARGIN }]}>
          <Text style={styles.statLabel}>Balls</Text>
          <CounterDisplay count={balls} subtitle="Total" />
        </View>

        {/* Strike Count */}
        <View style={[styles.statCard, { width: CARD_WIDTH, marginLeft: CARD_MARGIN }]}>
          <Text style={styles.statLabel}>Strikes</Text>
          <CounterDisplay count={strikes} subtitle="Total" />
        </View>

        {/* Hits */}
        <View style={[styles.statCard, { width: CARD_WIDTH, marginLeft: CARD_MARGIN }]}>
          <Text style={styles.statLabel}>Hits</Text>
          <CounterDisplay count={hits} />
        </View>

        {/* Walks */}
        <View style={[styles.statCard, { width: CARD_WIDTH, marginLeft: CARD_MARGIN }]}>
          <Text style={styles.statLabel}>Walks</Text>
          <CounterDisplay count={walks} />
        </View>

        {/* Outs */}
        <View style={[styles.statCard, { width: CARD_WIDTH, marginLeft: CARD_MARGIN }]}>
          <Text style={styles.statLabel}>Outs</Text>
          <CounterDisplay count={outs} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.card,
  },
  scrollContainer: {
    padding: Spacing.xl,
  },
  statCard: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    shadowColor: Colors.background.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
