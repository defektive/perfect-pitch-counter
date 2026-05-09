import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { usePitchGame } from '@/hooks/use-pitch-game';
import { CounterDisplay } from '@/components/ui/counter-display';
import { Button } from '@/components/ui/button';

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
    // Show export dialog
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

  const isStrikeCount = (count: number) => count >= 2 && count <= 3;

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
        <View style={[styles.row, styles.striped]}>
          <View style={[styles.counterCell, { backgroundColor: isStrikeCount(
            usePitchGame.getState().currentStrikes
          ) ? '#e3f2fd' : '#333' }]}>
            <CounterDisplay
              count={usePitchGame.getState().currentStrikes}
              subtitle="Current"
            />
          </View>
          <View style={[styles.counterCell, styles.borderCell]}>
            <CounterDisplay
              count={usePitchGame.getState().currentBalls}
              subtitle="Balls"
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
        <View style={[styles.row, { backgroundColor: '#1a1a1a' }]}>
          <View style={[styles.counterCell, styles.borderCell]}>
            <CounterDisplay
              count={usePitchGame.getState().totalBalls}
              subtitle="Total Balls"
            />
          </View>
          <View style={[styles.counterCell, styles.borderCell]}>
            <CounterDisplay
              count={usePitchGame.getState().totalStrikes}
              subtitle="Total Strikes"
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
        <View style={[styles.row, styles.outsRow]}>
          <View style={[styles.counterCell, styles.outCell]}>
            <CounterDisplay
              count={usePitchGame.getState().outCount}
              title="Outs"
            />
          </View>
          <View style={[styles.counterCell, styles.outCell]}>
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
    backgroundColor: '#000',
  },
  header: {
    padding: 16,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subHeader: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  section: {
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#666',
    paddingHorizontal: 16,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  striped: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#1a1a1a',
  },
  counterCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    minHeight: 60,
  },
  borderCell: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    marginHorizontal: 4,
    padding: 8,
    minHeight: 80,
  },
  outsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  outCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
});
