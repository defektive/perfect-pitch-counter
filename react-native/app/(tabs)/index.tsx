import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { usePitchGame } from '@/hooks/use-pitch-game';
import { CounterDisplay } from '@/components/ui/counter-display';
import { Button } from '@/components/ui/button';
import { Typography, Spacing, Colors } from '@/constants/theme';

export default function PitchCounterScreen() {
  const colorScheme = useColorScheme();
  const mode = colorScheme ?? 'light';

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

  const backgroundColor = mode === 'dark' ? Colors.dark.primary : Colors.light.card;
  const dividerColor = mode === 'dark' ? Colors.dark.divider : Colors.light.divider;
  const textColor = mode === 'dark' ? Colors.dark.text : Colors.light.text;

  return (
    <View style={{ flex: 1, backgroundColor }}>
      {/* Main Counter Section */}
      <View style={{ paddingVertical: Spacing.md }}>
        <Text style={{ fontSize: Typography.subtitle.fontSize, color: textColor.tertiary, textTransform: 'uppercase', paddingHorizontal: Spacing.xl, marginBottom: Spacing.md, letterSpacing: 0.5 }}>Pitch Counters</Text>

        {/* Strikes Row */}
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: dividerColor }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: textColor.primary }}>Strikes</Text>
            <Text style={{ fontSize: 11, color: textColor.secondary, marginTop: 2 }}>Current: {usePitchGame.getState().currentStrikes} / Total: {usePitchGame.getState().totalStrikes}</Text>
          </View>
          <CounterDisplay
            count={usePitchGame.getState().currentStrikes}
            title="Strikes"
          />
        </TouchableOpacity>

        {/* Balls Row */}
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: dividerColor }}
          onPress={incrementBall}
          activeOpacity={0.7}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: textColor.primary }}>Balls</Text>
            <Text style={{ fontSize: 11, color: textColor.secondary, marginTop: 2 }}>Current: {usePitchGame.getState().currentBalls} / Total: {usePitchGame.getState().totalBalls}</Text>
          </View>
          <CounterDisplay
            count={usePitchGame.getState().currentBalls}
            title="Balls"
          />
        </TouchableOpacity>

        {/* Hits Row */}
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: dividerColor }}
          onPress={incrementHit}
          activeOpacity={0.7}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: textColor.primary }}>Hits</Text>
            <Text style={{ fontSize: 11, color: textColor.secondary, marginTop: 2 }}>Total hits allowed</Text>
          </View>
          <CounterDisplay
            count={usePitchGame.getState().hitCount}
            title="Hits"
          />
        </TouchableOpacity>
      </View>

      {/* Calculated Stats Section */}
      <View style={{ paddingVertical: Spacing.md }}>
        <Text style={{ fontSize: Typography.subtitle.fontSize, color: textColor.tertiary, textTransform: 'uppercase', paddingHorizontal: Spacing.xl, marginBottom: Spacing.md, letterSpacing: 0.5 }}>Game Stats</Text>

        {/* Batters & Outs Row */}
        <View style={{ flexDirection: 'row', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: dividerColor }}>
          <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: Spacing.sm }}>
            <Text style={{ fontSize: 12, color: textColor.tertiary, textTransform: 'uppercase', marginBottom: Spacing.xs }}>Batters</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: textColor.primary }}>{getBatters()}</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: Spacing.sm }}>
            <Text style={{ fontSize: 12, color: textColor.tertiary, textTransform: 'uppercase', marginBottom: Spacing.xs }}>Outs</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: textColor.primary }}>{usePitchGame.getState().outCount}</Text>
          </View>
        </View>

        {/* Walks & Runs Row */}
        <View style={{ flexDirection: 'row', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: dividerColor }}>
          <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: Spacing.sm }}>
            <Text style={{ fontSize: 12, color: textColor.tertiary, textTransform: 'uppercase', marginBottom: Spacing.xs }}>Walks</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: textColor.primary }}>{usePitchGame.getState().walkCount}</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: Spacing.sm }}>
            <Text style={{ fontSize: 12, color: textColor.tertiary, textTransform: 'uppercase', marginBottom: Spacing.xs }}>Runs</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: textColor.primary }}>{getRuns()}</Text>
          </View>
        </View>

        {/* Strike/Ball Totals Row */}
        <View style={{ flexDirection: 'row', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: dividerColor }}>
          <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: Spacing.sm }}>
            <Text style={{ fontSize: 12, color: textColor.tertiary, textTransform: 'uppercase', marginBottom: Spacing.xs }}>Total Strikes</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: textColor.primary }}>{usePitchGame.getState().totalStrikes}</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: Spacing.sm }}>
            <Text style={{ fontSize: 12, color: textColor.tertiary, textTransform: 'uppercase', marginBottom: Spacing.xs }}>Total Balls</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: textColor.primary }}>{usePitchGame.getState().totalBalls}</Text>
          </View>
        </View>

        {/* Strike % Row */}
        <View style={{ flexDirection: 'row', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: dividerColor }}>
          <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: Spacing.sm }}>
            <Text style={{ fontSize: 12, color: textColor.tertiary, textTransform: 'uppercase', marginBottom: Spacing.xs }}>Strike %</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: textColor.primary }}>{getStrikePercentage()}%</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: Spacing.sm }}>
            <Text style={{ fontSize: 12, color: textColor.tertiary, textTransform: 'uppercase', marginBottom: Spacing.xs }}>Ball %</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: textColor.primary }}>{getBallPercentage()}%</Text>
          </View>
        </View>

        {/* Total Pitches Row */}
        <View style={{ flexDirection: 'row', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: dividerColor }}>
          <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: Spacing.sm }}>
            <Text style={{ fontSize: 12, color: textColor.tertiary, textTransform: 'uppercase', marginBottom: Spacing.xs }}>Total Pitches</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: textColor.primary }}>
              {usePitchGame.getState().totalBalls + usePitchGame.getState().totalStrikes + usePitchGame.getState().hitCount}
            </Text>
          </View>
        </View>
      </View>

      {/* Reset Section */}
      <View style={{ padding: Spacing.md, paddingBottom: Spacing.md, backgroundColor }}>
        <Button
          title="Reset All Counters"
          onPress={() => usePitchGame.getState().resetCounters()}
          variant="secondary"
        />
      </View>

      {/* Export Section */}
      <View style={{ padding: Spacing.md, paddingBottom: Spacing.xl, backgroundColor, borderTopWidth: 1, borderTopColor: dividerColor }}>
        <Button
          title="Export Data"
          onPress={handleExport}
          variant="ghost"
        />
      </View>
    </View>
  );
}
