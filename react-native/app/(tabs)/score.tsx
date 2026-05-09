import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { useColorScheme } from 'react-native';
import { usePitchGame } from '@/hooks/use-pitch-game';
import { CounterDisplay } from '@/components/ui/counter-display';
import { Typography, Spacing, Colors } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.max(SCREEN_WIDTH - 48, 280);
const CARD_MARGIN = (SCREEN_WIDTH - CARD_WIDTH) / 2;

export default function ScoreScreen() {
  const colorScheme = useColorScheme();
  const mode = colorScheme ?? 'light';

  const balls = usePitchGame.getState().totalBalls;
  const strikes = usePitchGame.getState().totalStrikes;
  const outs = usePitchGame.getState().outCount;
  const hits = usePitchGame.getState().hitCount;
  const walks = usePitchGame.getState().walkCount;
  const strikePercentage =
    balls > 0 && strikes > 0
      ? ((strikes / (balls + strikes)) * 100).toFixed(0)
      : 0;

  const backgroundColor = mode === 'dark' ? Colors.dark.primary : Colors.light.card;
  const statBackgroundColor = mode === 'dark' ? Colors.dark.primary : Colors.light.primary;
  const textColor = mode === 'dark' ? Colors.dark.text : Colors.light.text;

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <ScrollView style={{ padding: Spacing.xl }}>
        {/* Strike Percentage */}
        <View style={{ backgroundColor: statBackgroundColor, borderRadius: 16, padding: Spacing.lg, marginBottom: Spacing.lg, alignItems: 'center', width: CARD_WIDTH, marginLeft: CARD_MARGIN }}>
          <Text style={{ fontSize: Typography.subtitle.fontSize, color: textColor.tertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Spacing.md }}>Strike %</Text>
          <Text style={{ fontSize: Typography.large.fontSize, fontWeight: 'bold', color: textColor.primary }}>{strikePercentage}%</Text>
        </View>

        {/* Ball Count */}
        <View style={{ backgroundColor: statBackgroundColor, borderRadius: 16, padding: Spacing.lg, marginBottom: Spacing.lg, alignItems: 'center', width: CARD_WIDTH, marginLeft: CARD_MARGIN }}>
          <Text style={{ fontSize: Typography.subtitle.fontSize, color: textColor.tertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Spacing.md }}>Balls</Text>
          <CounterDisplay count={balls} subtitle="Total" />
        </View>

        {/* Strike Count */}
        <View style={{ backgroundColor: statBackgroundColor, borderRadius: 16, padding: Spacing.lg, marginBottom: Spacing.lg, alignItems: 'center', width: CARD_WIDTH, marginLeft: CARD_MARGIN }}>
          <Text style={{ fontSize: Typography.subtitle.fontSize, color: textColor.tertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Spacing.md }}>Strikes</Text>
          <CounterDisplay count={strikes} subtitle="Total" />
        </View>

        {/* Hits */}
        <View style={{ backgroundColor: statBackgroundColor, borderRadius: 16, padding: Spacing.lg, marginBottom: Spacing.lg, alignItems: 'center', width: CARD_WIDTH, marginLeft: CARD_MARGIN }}>
          <Text style={{ fontSize: Typography.subtitle.fontSize, color: textColor.tertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Spacing.md }}>Hits</Text>
          <CounterDisplay count={hits} />
        </View>

        {/* Walks */}
        <View style={{ backgroundColor: statBackgroundColor, borderRadius: 16, padding: Spacing.lg, marginBottom: Spacing.lg, alignItems: 'center', width: CARD_WIDTH, marginLeft: CARD_MARGIN }}>
          <Text style={{ fontSize: Typography.subtitle.fontSize, color: textColor.tertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Spacing.md }}>Walks</Text>
          <CounterDisplay count={walks} />
        </View>

        {/* Outs */}
        <View style={{ backgroundColor: statBackgroundColor, borderRadius: 16, padding: Spacing.lg, marginBottom: Spacing.lg, alignItems: 'center', width: CARD_WIDTH, marginLeft: CARD_MARGIN }}>
          <Text style={{ fontSize: Typography.subtitle.fontSize, color: textColor.tertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Spacing.md }}>Outs</Text>
          <CounterDisplay count={outs} />
        </View>
      </ScrollView>
    </View>
  );
}
