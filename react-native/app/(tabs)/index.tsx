import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { usePitchGame } from '@/hooks/use-pitch-game';
import { CounterDisplay } from '@/components/ui/counter-display';
import { Button } from '@/components/ui/button';
import { Colors, Typography, Spacing } from '@/constants/theme';

export default function PitchCounterScreen() {
  const {
    incrementStrike,
    incrementBall,
    incrementHit,
    exportToJson,
    exportToCsv,
  } = usePitchGame();

  const handleExport = useCallback(() => {
    console.log('Export JSON:', exportToJson());
    console.log('Export CSV:', exportToCsv());
  }, [exportToJson, exportToCsv]);

  const getBatters = () => usePitchGame.getState().outCount + usePitchGame.getState().hitCount + usePitchGame.getState().walkCount;
  const getRuns = () => Math.max(0, (usePitchGame.getState().hitCount + usePitchGame.getState().walkCount) - 3);
  const getStrikePercentage = () => {
    const total = usePitchGame.getState().totalBalls + usePitchGame.getState().totalStrikes;
    return total > 0 ? Math.round((usePitchGame.getState().totalStrikes / total) * 100) : 0;
  };
  const getBallPercentage = () => {
    const total = usePitchGame.getState().totalBalls + usePitchGame.getState().totalStrikes;
    return total > 0 ? Math.round((usePitchGame.getState().totalBalls / total) * 100) : 0;
  };

  return (
    <View style={styles.container}>
      {/* Main Counter Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pitch Counters</Text>

        {/* Strikes Row */}
        <TouchableOpacity
          style={styles.counterRow}
          onPress={incrementStrike}
          activeOpacity={0.7}>
          <View style={styles.counterLabel}>
            <Text style={styles.counterLabelTitle}>Strikes</Text>
            <Text style={styles.counterLabelSubtitle}>Current: {usePitchGame.getState().currentStrikes} / Total: {usePitchGame.getState().totalStrikes}</Text>
          </View>
          <CounterDisplay
            count={usePitchGame.getState().currentStrikes}
            title="Strikes"
          />
        </TouchableOpacity>

        {/* Balls Row */}
        <TouchableOpacity
          style={styles.counterRow}
          onPress={incrementBall}
          activeOpacity={0.7}>
          <View style={styles.counterLabel}>
            <Text style={styles.counterLabelTitle}>Balls</Text>
            <Text style={styles.counterLabelSubtitle}>Current: {usePitchGame.getState().currentBalls} / Total: {usePitchGame.getState().totalBalls}</Text>
          </View>
          <CounterDisplay
            count={usePitchGame.getState().currentBalls}
            title="Balls"
          />
        </TouchableOpacity>

        {/* Hits Row */}
        <TouchableOpacity
          style={styles.counterRow}
          onPress={incrementHit}
          activeOpacity={0.7}>
          <View style={styles.counterLabel}>
            <Text style={styles.counterLabelTitle}>Hits</Text>
            <Text style={styles.counterLabelSubtitle}>Total hits allowed</Text>
          </View>
          <CounterDisplay
            count={usePitchGame.getState().hitCount}
            title="Hits"
          />
        </TouchableOpacity>
      </View>

      {/* Calculated Stats Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Game Stats</Text>

        {/* Batters & Outs Row */}
        <View style={styles.statRow}>
          <View style={styles.statCell}>
            <Text style={styles.statTitle}>Batters</Text>
            <Text style={styles.statValue}>{getBatters()}</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={styles.statTitle}>Outs</Text>
            <Text style={styles.statValue}>{usePitchGame.getState().outCount}</Text>
          </View>
        </View>

        {/* Walks & Runs Row */}
        <View style={styles.statRow}>
          <View style={styles.statCell}>
            <Text style={styles.statTitle}>Walks</Text>
            <Text style={styles.statValue}>{usePitchGame.getState().walkCount}</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={styles.statTitle}>Runs</Text>
            <Text style={styles.statValue}>{getRuns()}</Text>
          </View>
        </View>

        {/* Strike/Ball Totals Row */}
        <View style={styles.statRow}>
          <View style={styles.statCell}>
            <Text style={styles.statTitle}>Total Strikes</Text>
            <Text style={styles.statValue}>{usePitchGame.getState().totalStrikes}</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={styles.statTitle}>Total Balls</Text>
            <Text style={styles.statValue}>{usePitchGame.getState().totalBalls}</Text>
          </View>
        </View>

        {/* Strike % Row */}
        <View style={styles.statRow}>
          <View style={styles.statCell}>
            <Text style={styles.statTitle}>Strike %</Text>
            <Text style={styles.statValue}>{getStrikePercentage()}%</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={styles.statTitle}>Ball %</Text>
            <Text style={styles.statValue}>{getBallPercentage()}%</Text>
          </View>
        </View>

        {/* Total Pitches Row */}
        <View style={styles.statRow}>
          <View style={styles.statCell}>
            <Text style={styles.statTitle}>Total Pitches</Text>
            <Text style={styles.statValue}>
              {usePitchGame.getState().totalBalls + usePitchGame.getState().totalStrikes + usePitchGame.getState().hitCount}
            </Text>
          </View>
        </View>
      </View>

      {/* Reset Section */}
      <View style={styles.resetSection}>
        <Button
          title="Reset All Counters"
          onPress={() => usePitchGame.getState().resetCounters()}
          variant="secondary"
        />
      </View>

      {/* Export Section */}
      <View style={styles.exportSection}>
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
  section: {
    paddingVertical: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.subtitle.fontSize,
    color: Colors.text.tertiary,
    textTransform: 'uppercase',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    letterSpacing: 0.5,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider.light,
  },
  counterLabel: {
    flex: 1,
  },
  counterLabelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  counterLabelSubtitle: {
    fontSize: 11,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  statRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider.light,
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },
  statTitle: {
    fontSize: 12,
    color: Colors.text.tertiary,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  resetSection: {
    padding: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background.primary,
  },
  exportSection: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.divider.light,
  },
});
