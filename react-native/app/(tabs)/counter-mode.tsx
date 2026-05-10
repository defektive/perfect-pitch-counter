import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { useColorScheme } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { usePitchGame } from '@/hooks/use-pitch-game';
import { Colors } from '@/constants/theme';

function Divider({ color }: { color: string }) {
  return <View style={{ height: 1, backgroundColor: color }} />;
}

function ListTileButton({
  onPress,
  children,
}: {
  onPress: () => void;
  children: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(128,128,128,0.15)',
        elevation: 1,
        minWidth: 48,
        alignItems: 'center',
      }}
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

export default function CounterModeScreen() {
  const colorScheme = useColorScheme();
  const mode = colorScheme ?? 'light';
  const textColor = mode === 'dark' ? Colors.dark.text : Colors.light.text;
  const backgroundColor = mode === 'dark' ? Colors.dark.background : Colors.light.background;
  const dividerColor = mode === 'dark' ? Colors.dark.divider : Colors.light.divider;

  const [showExportModal, setShowExportModal] = useState(false);

  const {
    incrementStrike,
    incrementBall,
    exportToJson,
    exportToCsv,
  } = usePitchGame();

  const state = usePitchGame();
  const { totalStrikes, totalBalls, outCount, strikePercentage, ballPercentage } = state;

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied', 'Data copied to clipboard!');
  };

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <ScrollView style={{ flex: 1 }}>
        {/* Strikes */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, minHeight: 64 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, color: textColor.primary }}>Strikes</Text>
            <Text style={{ fontSize: 13, color: textColor.secondary }}>Pitches in the strike zone</Text>
          </View>
          <ListTileButton onPress={incrementStrike}>
            <Text style={{ fontSize: 16, color: textColor.primary, fontWeight: '500' }}>{totalStrikes}</Text>
          </ListTileButton>
        </View>

        {/* Balls */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, minHeight: 64 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, color: textColor.primary }}>Balls</Text>
            <Text style={{ fontSize: 13, color: textColor.secondary }}>Pitches outside the strike zone</Text>
          </View>
          <ListTileButton onPress={incrementBall}>
            <Text style={{ fontSize: 16, color: textColor.primary, fontWeight: '500' }}>{totalBalls}</Text>
          </ListTileButton>
        </View>

        {/* Outs (read-only) */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, minHeight: 64 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, color: textColor.primary }}>Outs</Text>
            <Text style={{ fontSize: 13, color: textColor.secondary }}>Number of outs</Text>
          </View>
          <CircleAvatar value={outCount} textColor={textColor.primary} />
        </View>

        <Divider color={dividerColor} />

        {/* Pitch Stats */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 12, minHeight: 56 }}>
          <Text style={{ fontSize: 16, color: textColor.primary }}>Pitch Stats</Text>
          <Text style={{ fontSize: 13, color: textColor.secondary, marginTop: 4 }}>
            Strikes: {strikePercentage}% Balls: {ballPercentage}%
          </Text>
        </View>

        <Divider color={dividerColor} />
      </ScrollView>

      {/* FAB - Export button */}
      <TouchableOpacity
        onPress={() => setShowExportModal(true)}
        style={{
          position: 'absolute',
          bottom: 28,
          right: 28,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: mode === 'dark' ? Colors.dark.accent.primary : Colors.light.accent.primary,
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        }}
      >
        <Text style={{ fontSize: 24, color: '#FFFFFF' }}>⬇</Text>
      </TouchableOpacity>

      {/* Export Bottom Sheet Modal */}
      <Modal
        visible={showExportModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowExportModal(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
          activeOpacity={1}
          onPress={() => setShowExportModal(false)}
        >
          <View style={{ flex: 1 }} />
          <View
            style={{
              backgroundColor: mode === 'dark' ? Colors.dark.elevated : Colors.light.primary,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 16,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '600', color: textColor.primary, textAlign: 'center', marginBottom: 8 }}>
              Export Data
            </Text>

            {/* JSON option */}
            <TouchableOpacity
              onPress={() => {
                copyToClipboard(exportToJson());
                setShowExportModal(false);
              }}
              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8 }}
            >
              <Text style={{ fontSize: 20, marginRight: 16 }}>📄</Text>
              <Text style={{ fontSize: 16, color: textColor.primary }}>JSON</Text>
            </TouchableOpacity>

            {/* CSV option */}
            <TouchableOpacity
              onPress={() => {
                copyToClipboard(exportToCsv());
                setShowExportModal(false);
              }}
              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8 }}
            >
              <Text style={{ fontSize: 20, marginRight: 16 }}>📊</Text>
              <Text style={{ fontSize: 16, color: textColor.primary }}>CSV</Text>
            </TouchableOpacity>

            <View style={{ height: 8 }} />

            {/* Copy All */}
            <TouchableOpacity
              onPress={() => {
                const json = exportToJson();
                const csv = exportToCsv();
                const text = `\n\n--- JSON ---\n${json}\n\n--- CSV ---\n${csv}`;
                copyToClipboard(text);
                setShowExportModal(false);
              }}
              style={{
                backgroundColor: mode === 'dark' ? Colors.dark.accent.primary : Colors.light.accent.primary,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 16, color: '#FFFFFF', fontWeight: '600' }}>Copy All</Text>
            </TouchableOpacity>

            <View style={{ height: 20 }} />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
