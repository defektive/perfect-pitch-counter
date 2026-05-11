import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePitchGame } from '@/hooks/use-pitch-game';
import { useSessionHistory } from '@/hooks/use-session-history';
import { Colors } from '@/constants/theme';
import { tapHaptic, actionHaptic, warningHaptic } from '@/utils/haptics';
import { gameToSessionInput } from '@/utils/game-to-session';

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function Divider({ color }: { color: string }) {
  return <View style={{ height: 1, backgroundColor: color }} />;
}

function ListTileButton({
  onPress,
  children,
  style,
  accessibilityLabel,
}: {
  onPress: () => void;
  children: React.ReactNode;
  style?: any;
  accessibilityLabel?: string;
}) {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#111111' : '#eeeeee';
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[{
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor,
        elevation: 1,
        minWidth: 48,
        alignItems: 'center',
      }, style]}
    >
      {children}
    </TouchableOpacity>
  );
}

function CircleAvatar({
  value,
  textColor,
}: {
  value: string | number;
  textColor: string;
}) {
  const colorScheme = useColorScheme();
  const mode = colorScheme ?? 'light';
  return (
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: mode === 'dark' ? Colors.dark.accent.primary : Colors.light.accent.primary,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600' }}>
        {value}
      </Text>
    </View>
  );
}

export default function PitchGameScreen() {
  const colorScheme = useColorScheme();
  const mode = colorScheme ?? 'light';
  const textColor = mode === 'dark' ? Colors.dark.text : Colors.light.text;
  const backgroundColor = mode === 'dark' ? Colors.dark.background : Colors.light.background;
  const dividerColor = mode === 'dark' ? Colors.dark.divider : Colors.light.divider;

  const {
    incrementStrike,
    incrementBall,
    incrementHit,
    resetCounters,
    toggleTimer,
  } = usePitchGame();

  const state = usePitchGame();
  const { currentStrikes, currentBalls, hitCount: hitsCount, outCount, walkCount, totalStrikes, totalBalls, isTimerRunning, gameStarted } = state;

  const batterCount = outCount + hitsCount + walkCount;
  const onBase = walkCount + hitsCount;
  const runCount = Math.max(0, onBase - 3);
  const totalPitches = totalBalls + totalStrikes + hitsCount;

  // Timer display
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isTimerRunning && gameStarted) {
      const start = new Date(gameStarted).getTime();
      const tick = () => setElapsed(Date.now() - start);
      tick();
      intervalRef.current = setInterval(tick, 1000);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    } else {
      setElapsed(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [isTimerRunning, gameStarted]);

  const timerDisplay = isTimerRunning ? formatDuration(elapsed) : '00:00:00';

  return (
    <ScrollView style={{ flex: 1, backgroundColor }}>
      {/* Practice Timer */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, minHeight: 56 }}>
        <Text style={{ flex: 1, fontSize: 16, color: textColor.primary }}>Practice time</Text>
        <Text style={{ fontSize: 15, color: textColor.primary, marginRight: 16 }}>{timerDisplay}</Text>
        <ListTileButton
          onPress={() => { actionHaptic(); toggleTimer(); }}
          accessibilityLabel={isTimerRunning ? 'Stop practice timer' : 'Start practice timer'}
        >
          <MaterialIcons
            name={isTimerRunning ? 'stop' : 'play-arrow'}
            size={20}
            color={textColor.primary}
          />
        </ListTileButton>
      </View>
      <Divider color={dividerColor} />

      {/* Hits */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, minHeight: 64 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, color: textColor.primary }}>Hits</Text>
          <Text style={{ fontSize: 13, color: textColor.secondary }}>Number of hits</Text>
        </View>
        <ListTileButton
          onPress={() => { tapHaptic(); incrementHit(); }}
          accessibilityLabel={`Add hit, currently ${hitsCount}`}
        >
          <Text style={{ fontSize: 16, color: textColor.primary, fontWeight: '500' }}>{hitsCount}</Text>
        </ListTileButton>
      </View>
      <Divider color={dividerColor} />

      {/* Strikes */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, minHeight: 64 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, color: textColor.primary }}>Strikes</Text>
          <Text style={{ fontSize: 13, color: textColor.secondary }}>Pitches inside the strike zone</Text>
        </View>
        <ListTileButton
          onPress={() => { tapHaptic(); incrementStrike(); }}
          accessibilityLabel={`Add strike, currently ${currentStrikes}`}
        >
          <Text style={{ fontSize: 16, color: textColor.primary, fontWeight: '500' }}>{currentStrikes}</Text>
        </ListTileButton>
      </View>
      <Divider color={dividerColor} />

      {/* Balls */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, minHeight: 64 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, color: textColor.primary }}>Balls</Text>
          <Text style={{ fontSize: 13, color: textColor.secondary }}>Pitches outside the strike zone</Text>
        </View>
        <ListTileButton
          onPress={() => { tapHaptic(); incrementBall(); }}
          accessibilityLabel={`Add ball, currently ${currentBalls}`}
        >
          <Text style={{ fontSize: 16, color: textColor.primary, fontWeight: '500' }}>{currentBalls}</Text>
        </ListTileButton>
      </View>
      <Divider color={dividerColor} />

      {/* Batters (read-only) */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, minHeight: 64 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, color: textColor.primary }}>Batters</Text>
          <Text style={{ fontSize: 13, color: textColor.secondary }}>Number of batters</Text>
        </View>
        <CircleAvatar value={batterCount} textColor={textColor.primary} />
      </View>
      <Divider color={dividerColor} />

      {/* Outs */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, minHeight: 64 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, color: textColor.primary }}>Outs</Text>
          <Text style={{ fontSize: 13, color: textColor.secondary }}>Number of outs</Text>
        </View>
        <CircleAvatar value={outCount} textColor={textColor.primary} />
      </View>
      <Divider color={dividerColor} />

      {/* Walks */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, minHeight: 64 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, color: textColor.primary }}>Walks</Text>
          <Text style={{ fontSize: 13, color: textColor.secondary }}>Number of walks</Text>
        </View>
        <CircleAvatar value={walkCount} textColor={textColor.primary} />
      </View>
      <Divider color={dividerColor} />

      {/* Runs */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, minHeight: 64 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, color: textColor.primary }}>Runs</Text>
          <Text style={{ fontSize: 13, color: textColor.secondary }}>Number of runs</Text>
        </View>
        <CircleAvatar value={runCount} textColor={textColor.primary} />
      </View>
      <Divider color={dividerColor} />

      {/* Total Strikes */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, minHeight: 64 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, color: textColor.primary }}>Strikes</Text>
          <Text style={{ fontSize: 13, color: textColor.secondary }}>Number of strikes</Text>
        </View>
        <CircleAvatar value={totalStrikes} textColor={textColor.primary} />
      </View>
      <Divider color={dividerColor} />

      {/* Total Balls */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, minHeight: 64 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, color: textColor.primary }}>Balls</Text>
          <Text style={{ fontSize: 13, color: textColor.secondary }}>Number of balls</Text>
        </View>
        <CircleAvatar value={totalBalls} textColor={textColor.primary} />
      </View>
      <Divider color={dividerColor} />

      {/* Total Pitches */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, minHeight: 64 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, color: textColor.primary }}>Pitches</Text>
          <Text style={{ fontSize: 13, color: textColor.secondary }}>Number of pitches</Text>
        </View>
        <CircleAvatar value={totalPitches} textColor={textColor.primary} />
      </View>
      <Divider color={dividerColor} />

      {/* Reset */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, minHeight: 64 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, color: textColor.primary }}>Reset</Text>
          <Text style={{ fontSize: 13, color: textColor.secondary }}>Reset stats</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            warningHaptic();
            const input = gameToSessionInput(usePitchGame.getState(), new Date());
            if (input) useSessionHistory.getState().addSession(input);
            resetCounters();
          }}
          accessibilityRole="button"
          accessibilityLabel="Reset all stats and save to history"
          style={{
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
            backgroundColor: '#F44336',
          }}
        >
          <MaterialIcons name="refresh" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <Divider color={dividerColor} />
    </ScrollView>
  );
}
