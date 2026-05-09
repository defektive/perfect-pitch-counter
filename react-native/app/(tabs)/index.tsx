import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { usePitchGame } from '@/hooks/use-pitch-game';
import { CounterDisplay } from '@/components/ui/counter-display';
import { Button } from '@/components/ui/button';
import { Colors, Typography, Spacing } from '@/constants/theme';

export default function PitchCounterScreen() {
  const {
    incrementStrike,
    incrementBall,
    incrementHit,
    incrementOut,
    exportToJson,
    exportToCsv,
  } = usePitchGame();

  const handleExport = useCallback(() => {
    console.log('Export JSON:', exportToJson());
    console.log('Export CSV:', exportToCsv());
  }, [exportToJson, exportToCsv]);

  const strikePercentage =
    usePitchGame.getState().totalBalls > 0 &&
    usePitchGame.getState().totalStrikes > 0
      ? ((usePitchGame.getState().totalStrikes /
          (usePitchGame.getState().totalBalls +
            usePitchGame.getState().totalStrikes)) *
        100).toFixed(0)
      : 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pitch Session</Text>
        <Text style={styles.subHeader}>
          Balls: {usePitchGame.getState().totalBalls} | Strikes: {usePitchGame.getState().totalStrikes} | Strike %: {strikePercentage}%
        </Text>
      </View>

      {/* Strike Zone */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Strike Zone</Text>
        <View style={styles.zoneContainer}>
          <View style={styles.zoneItem}>
            <Text style={styles.zoneLabel}>Current</Text>
            <CounterDisplay
              count={usePitchGame.getState().currentStrikes}
              subtitle="Strikes"
              style={styles.zoneCounter}
            />
          </View>
          <View style={styles.zoneItem}>
            <Text style={styles.zoneLabel}>Balls</Text>
            <CounterDisplay
              count={usePitchGame.getState().currentBalls}
              subtitle="Balls"
              style={styles.zoneCounter}
            />
          </View>
        </View>
        <View style={styles.actionRow}>
          <Button
            title="STRIKE"
            onPress={incrementStrike}
            style={styles.actionButton}
            icon="checkmark"
          />
        </View>
      </View>

      {/* Non-strike zone */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Non-Strike Zone</Text>
        <View style={styles.zoneContainer}>
          <View style={styles.zoneItem}>
            <Text style={styles.zoneLabel}>Total Balls</Text>
            <CounterDisplay
              count={usePitchGame.getState().totalBalls}
              subtitle="Balls"
              style={styles.zoneCounter}
            />
          </View>
          <View style={styles.zoneItem}>
            <Text style={styles.zoneLabel}>Total Strikes</Text>
            <CounterDisplay
              count={usePitchGame.getState().totalStrikes}
              subtitle="Strikes"
              style={styles.zoneCounter}
            />
          </View>
        </View>
        <View style={styles.actionRow}>
          <Button
            title="BALL"
            onPress={incrementBall}
            style={styles.actionButton}
            icon="circle"
          />
        </View>
      </View>

      {/* Hitters / Outs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hitters / Outs</Text>
        <View style={styles.hittersContainer}>
          <View style={styles.hittersItem}>
            <Text style={styles.hittersLabel}>Outs</Text>
            <CounterDisplay
              count={usePitchGame.getState().outCount}
              title="Outs"
            />
          </View>
          <View style={styles.hittersItem}>
            <Text style={styles.hittersLabel}>Hits</Text>
            <CounterDisplay
              count={usePitchGame.getState().hitCount}
              title="Hits"
            />
          </View>
        </View>
        <View style={styles.actionRow}>
          <Button
            title="HIT"
            onPress={incrementHit}
            style={styles.actionButton}
            icon="star"
          />
          <Button
            title="OUT"
            onPress={incrementOut}
            style={styles.actionButton}
            icon="trash"
          />
        </View>
      </View>

      {/* Export */}
      <View style={styles.footer}>
        <Button
          title="Export Data"
          onPress={handleExport}
          variant="ghost"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.card,
  },
  header: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider.light,
  },
  headerTitle: {
    fontSize: Typography.h2.fontSize,
    fontWeight: Typography.h2.fontWeight,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: Typography.subtitle.fontSize,
    color: Colors.text.tertiary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  section: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.subtitle.fontSize,
    color: Colors.text.tertiary,
    textTransform: 'uppercase',
    marginBottom: Spacing.md,
    letterSpacing: 0.5,
  },
  zoneContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.md,
  },
  zoneItem: {
    flex: 1,
    alignItems: 'center',
  },
  zoneLabel: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
  },
  zoneCounter: {
    minHeight: 0,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
  hittersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.md,
  },
  hittersItem: {
    flex: 1,
    alignItems: 'center',
  },
  hittersLabel: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
  },
  footer: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.divider.light,
  },
});
