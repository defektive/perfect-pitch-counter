import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { usePitchGame } from '@/hooks/use-pitch-game';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;
const CARD_MARGIN = (SCREEN_WIDTH - CARD_WIDTH) / 2;

export default function ScoreScreen() {
  const balls = usePitchGame.getState().totalBalls;
  const strikes = usePitchGame.getState().totalStrikes;
  const outs = usePitchGame.getState().outCount;
  const fbCount = usePitchGame.getState().fbCount;
  const cuCount = usePitchGame.getState().cuCount;
  const sfCount = usePitchGame.getState().sfCount;
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
          <Text style={styles.statValue}>{balls}</Text>
        </View>

        {/* Strike Count */}
        <View style={[styles.statCard, { width: CARD_WIDTH, marginLeft: CARD_MARGIN }]}>
          <Text style={styles.statLabel}>Strikes</Text>
          <Text style={styles.statValue}>{strikes}</Text>
        </View>

        {/* Outs */}
        <View style={[styles.statCard, { width: CARD_WIDTH, marginLeft: CARD_MARGIN }]}>
          <Text style={styles.statLabel}>Outs</Text>
          <Text style={styles.statValue}>{outs}</Text>
        </View>

        {/* Fastballs */}
        <View style={[styles.statCard, { width: CARD_WIDTH, marginLeft: CARD_MARGIN }]}>
          <Text style={styles.statLabel}>FB</Text>
          <Text style={styles.statValue}>{fbCount}</Text>
        </View>

        {/* Changeups */}
        <View style={[styles.statCard, { width: CARD_WIDTH, marginLeft: CARD_MARGIN }]}>
          <Text style={styles.statLabel}>CU</Text>
          <Text style={styles.statValue}>{cuCount}</Text>
        </View>

        {/* Full Count */}
        <View style={[styles.statCard, { width: CARD_WIDTH, marginLeft: CARD_MARGIN }]}>
          <Text style={styles.statLabel}>FC</Text>
          <Text style={styles.statValue}>{sfCount}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContainer: {
    padding: 16,
  },
  statCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 72,
    fontWeight: '200',
    color: '#fff',
  },
});
