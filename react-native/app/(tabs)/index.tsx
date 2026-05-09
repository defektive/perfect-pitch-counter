import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useColorScheme } from 'react-native';
import { usePitchGame } from '@/hooks/use-pitch-game';
import { CounterDisplay } from '@/components/ui/counter-display';
import { Button } from '@/components/ui/button';
import { Typography, Spacing, Colors } from '@/constants/theme';

type StatsRowProps = {
  title: string;
  value: string | number;
  subtitle?: string;
};

const StatsRow: React.FC<StatsRowProps> = ({ title, value, subtitle }) => {
  const colorScheme = useColorScheme();
  const mode = colorScheme ?? 'light';
  const textColor = mode === 'dark' ? Colors.dark.text : Colors.light.text;
  const cardColor = mode === 'dark' ? Colors.dark.primary : Colors.light.primary;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: cardColor,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 8,
        minHeight: 56,
      }}>
      <View style={{ flex: 1, paddingRight: 16 }}>
        <Text style={{ fontSize: 12, color: textColor.secondary, textTransform: 'uppercase', marginBottom: 4, letterSpacing: 0.5 }}>
          {title}
        </Text>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: textColor.primary }}>
          {value}
        </Text>
      </View>
      {subtitle && (
        <View style={{ width: 64, alignItems: 'flex-end' }}>
          <CounterDisplay count={Number(subtitle)} subtitle="" />
        </View>
      )}
    </View>
  );
};

const CounterRow: React.FC<{
  title: string;
  current: number;
  total: number;
  onPress: () => void;
  hasTotal?: boolean;
}> = ({ title, current, total, onPress, hasTotal }) => {
  const colorScheme = useColorScheme();
  const mode = colorScheme ?? 'light';
  const textColor = mode === 'dark' ? Colors.dark.text : Colors.light.text;
  const cardColor = mode === 'dark' ? Colors.dark.primary : Colors.light.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityState={{ selected: current > 0 }}
      accessibilityLabel={`Increment ${title}, currently at ${current}`}
      accessibilityRole="button"
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: cardColor,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 16,
        marginBottom: 10,
        minHeight: 64,
      }}>
      <View style={{ flex: 1, paddingRight: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: textColor.primary, marginBottom: 4 }}>
          {title}
        </Text>
        {hasTotal && (
          <Text style={{ fontSize: 11, color: textColor.secondary, textAlign: 'right' }}>
            {current} / {total}
          </Text>
        )}
      </View>
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: mode === 'dark' ? Colors.dark.elevated : Colors.light.elevated,
          borderWidth: 2,
          borderColor: mode === 'dark' ? Colors.dark.divider : Colors.light.divider,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <CounterDisplay count={current} title={title} />
      </View>
    </TouchableOpacity>
  );
};

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
  const cardColor = mode === 'dark' ? Colors.dark.primary : Colors.light.primary;
  const dividerColor = mode === 'dark' ? Colors.dark.divider : Colors.light.divider;
  const textColor = mode === 'dark' ? Colors.dark.text : Colors.light.text;
  const accentColor = mode === 'dark' ? Colors.dark.accent : Colors.light.accent;

  const handleExport = useCallback(() => {
    console.log('Export JSON:', exportToJson());
    console.log('Export CSV:', exportToCsv());
  }, [exportToJson, exportToCsv]);

  return (
    <View style={{ flex: 1, backgroundColor, paddingHorizontal: 4 }}>
      {/* Header */}
      <View style={{ alignItems: 'center', paddingTop: 20, paddingBottom: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: textColor.primary }}>
          Pitch Counter
        </Text>
        <Text style={{ fontSize: 13, color: textColor.secondary, marginTop: 4 }}>
          Track your game statistics
        </Text>
      </View>

      {/* Main Counter Section */}
      <View style={{ paddingVertical: 8 }}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: '600',
            color: textColor.secondary,
            textTransform: 'uppercase',
            paddingHorizontal: 4,
            marginBottom: 12,
            letterSpacing: 0.5,
          }}>
          Live Counters
        </Text>

        <CounterRow
          title="Strikes"
          current={usePitchGame.getState().currentStrikes}
          total={usePitchGame.getState().totalStrikes}
          onPress={incrementStrike}
          hasTotal
        />
        <CounterRow
          title="Balls"
          current={usePitchGame.getState().currentBalls}
          total={usePitchGame.getState().totalBalls}
          onPress={incrementBall}
          hasTotal
        />
        <CounterRow
          title="Hits"
          current={usePitchGame.getState().hitCount}
          total={usePitchGame.getState().hitCount}
          onPress={incrementHit}
          hasTotal
        />
      </View>

      {/* Divider */}
      <View style={{ height: 8, backgroundColor: dividerColor, borderRadius: 4, marginTop: 12 }} />

      {/* Game Stats Section */}
      <View style={{ paddingVertical: 8 }}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: '600',
            color: textColor.secondary,
            textTransform: 'uppercase',
            paddingHorizontal: 4,
            marginBottom: 12,
            letterSpacing: 0.5,
          }}>
          Game Stats
        </Text>

        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <StatsRow title="Batters" value={getBatters()} />
          </View>
          <View style={{ flex: 1 }}>
            <StatsRow title="Outs" value={usePitchGame.getState().outCount} />
          </View>
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <StatsRow title="Walks" value={usePitchGame.getState().walkCount} />
          </View>
          <View style={{ flex: 1 }}>
            <StatsRow title="Runs" value={getRuns()} />
          </View>
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <StatsRow title="Total Strikes" value={usePitchGame.getState().totalStrikes} />
          </View>
          <View style={{ flex: 1 }}>
            <StatsRow title="Total Balls" value={usePitchGame.getState().totalBalls} />
          </View>
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <StatsRow title="Strike %" value={`${getStrikePercentage()}%`} />
          </View>
          <View style={{ flex: 1 }}>
            <StatsRow title="Ball %" value={`${getBallPercentage()}%`} />
          </View>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <StatsRow title="Total Pitches" value={usePitchGame.getState().totalBalls + usePitchGame.getState().totalStrikes + usePitchGame.getState().hitCount} />
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={{ height: 8, backgroundColor: dividerColor, borderRadius: 4, marginTop: 8 }} />

      {/* Action Buttons */}
      <View style={{ paddingVertical: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button
            title="Reset All"
            onPress={() => usePitchGame.getState().resetCounters()}
            variant="secondary"
            style={{ flex: 1, marginRight: 8, height: 44 }}
            accessibilityLabel="Reset all counters"
          />
          <Button
            title="Export"
            onPress={handleExport}
            variant="ghost"
            style={{ flex: 1, height: 44 }}
            accessibilityLabel="Export game data"
          />
        </View>
      </View>
    </View>
  );
}
