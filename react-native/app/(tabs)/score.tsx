import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { useColorScheme } from 'react-native';
import { usePitchGame } from '@/hooks/use-pitch-game';
import { CounterDisplay } from '@/components/ui/counter-display';
import { Typography, Spacing, Colors } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.max(SCREEN_WIDTH - 40, 260);
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
  const cardColor = mode === 'dark' ? Colors.dark.primary : Colors.light.primary;
  const dividerColor = mode === 'dark' ? Colors.dark.divider : Colors.light.divider;
  const cardAccent = mode === 'dark' ? Colors.dark.accent : Colors.light.accent;
  const textColor = mode === 'dark' ? Colors.dark.text : Colors.light.text;

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 4 }}>
        {/* Header */}
        <View style={{ alignItems: 'center', paddingTop: 24, paddingBottom: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: textColor.primary }}>Score Sheet</Text>
          <Text style={{ fontSize: 13, color: textColor.secondary, marginTop: 4 }}>
            Track game statistics
          </Text>
        </View>

        {/* Strike Percentage - Hero Card */}
        <View
          style={{
            backgroundColor: cardAccent.primaryLight,
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            alignItems: 'center',
            width: CARD_WIDTH,
            marginLeft: CARD_MARGIN,
            minHeight: 120,
          }}>
          <Text style={{ fontSize: 12, color: cardAccent.text.secondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
            Strike Percentage
          </Text>
          <Text style={{ fontSize: 48, fontWeight: 'bold', color: cardAccent.primary }}>
            {strikePercentage}%
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={{ width: CARD_WIDTH, marginLeft: CARD_MARGIN }}>
          <View
            style={{
              backgroundColor: cardColor,
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
              alignItems: 'center',
              minHeight: 110,
            }}>
            <Text style={{ fontSize: 12, color: textColor.secondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
              Balls
            </Text>
            <CounterDisplay count={balls} subtitle="Total" />
          </View>

          <View
            style={{
              backgroundColor: cardColor,
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
              alignItems: 'center',
              minHeight: 110,
            }}>
            <Text style={{ fontSize: 12, color: textColor.secondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
              Strikes
            </Text>
            <CounterDisplay count={strikes} subtitle="Total" />
          </View>

          <View
            style={{
              backgroundColor: cardColor,
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
              alignItems: 'center',
              minHeight: 110,
            }}>
            <Text style={{ fontSize: 12, color: textColor.secondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
              Hits
            </Text>
            <CounterDisplay count={hits} />
          </View>

          <View
            style={{
              backgroundColor: cardColor,
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
              alignItems: 'center',
              minHeight: 110,
            }}>
            <Text style={{ fontSize: 12, color: textColor.secondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
              Walks
            </Text>
            <CounterDisplay count={walks} />
          </View>

          <View
            style={{
              backgroundColor: cardColor,
              borderRadius: 16,
              padding: 16,
              alignItems: 'center',
              minHeight: 110,
            }}>
            <Text style={{ fontSize: 12, color: textColor.secondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
              Outs
            </Text>
            <CounterDisplay count={outs} />
          </View>
        </View>

        {/* Footer */}
        <View style={{ alignItems: 'center', paddingBottom: 24 }}>
          <Text style={{ fontSize: 11, color: textColor.muted, textAlign: 'center' }}>
            Tap a counter to increment
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
