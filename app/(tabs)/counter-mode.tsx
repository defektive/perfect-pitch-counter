import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Platform, Share } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePitchGame } from '@/hooks/use-pitch-game';
import { Colors } from '@/constants/theme';
import { tapHaptic, actionHaptic } from '@/utils/haptics';

function Divider({ color }: { color: string }) {
  return <View style={{ height: 1, backgroundColor: color }} />;
}

function ListTileButton({
  onPress,
  children,
  accessibilityLabel,
}: {
  onPress: () => void;
  children: React.ReactNode;
  accessibilityLabel?: string;
}) {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#111111' : '#eeeeee';
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={{
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor,
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

  const shareData = async (text: string, title: string) => {
    if (Platform.OS === 'web') {
      try {
        await navigator.clipboard.writeText(text);
        window.alert(`${title} copied to clipboard!`);
      } catch {
        window.alert(text);
      }
      return;
    }
    await Share.share({ message: text, title });
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
          <ListTileButton
            onPress={() => { tapHaptic(); incrementStrike(); }}
            accessibilityLabel={`Add strike, currently ${totalStrikes}`}
          >
            <Text style={{ fontSize: 16, color: textColor.primary, fontWeight: '500' }}>{totalStrikes}</Text>
          </ListTileButton>
        </View>

        {/* Balls */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, minHeight: 64 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, color: textColor.primary }}>Balls</Text>
            <Text style={{ fontSize: 13, color: textColor.secondary }}>Pitches outside the strike zone</Text>
          </View>
          <ListTileButton
            onPress={() => { tapHaptic(); incrementBall(); }}
            accessibilityLabel={`Add ball, currently ${totalBalls}`}
          >
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
        onPress={() => { actionHaptic(); setShowExportModal(true); }}
        accessibilityRole="button"
        accessibilityLabel="Export game data"
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
        <MaterialIcons name="file-download" size={24} color="#FFFFFF" />
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
                tapHaptic();
                shareData(exportToJson(), 'Game data (JSON)');
                setShowExportModal(false);
              }}
              accessibilityRole="button"
              accessibilityLabel="Share game data as JSON"
              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8 }}
            >
              <MaterialIcons name="description" size={20} color={textColor.primary} style={{ marginRight: 16 }} />
              <Text style={{ fontSize: 16, color: textColor.primary }}>JSON</Text>
            </TouchableOpacity>

            {/* CSV option */}
            <TouchableOpacity
              onPress={() => {
                tapHaptic();
                shareData(exportToCsv(), 'Game data (CSV)');
                setShowExportModal(false);
              }}
              accessibilityRole="button"
              accessibilityLabel="Share game data as CSV"
              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8 }}
            >
              <MaterialIcons name="table-chart" size={20} color={textColor.primary} style={{ marginRight: 16 }} />
              <Text style={{ fontSize: 16, color: textColor.primary }}>CSV</Text>
            </TouchableOpacity>

            <View style={{ height: 8 }} />

            {/* Share both */}
            <TouchableOpacity
              onPress={() => {
                actionHaptic();
                const json = exportToJson();
                const csv = exportToCsv();
                const text = `\n\n--- JSON ---\n${json}\n\n--- CSV ---\n${csv}`;
                shareData(text, 'Game data');
                setShowExportModal(false);
              }}
              accessibilityRole="button"
              accessibilityLabel="Share game data in both formats"
              style={{
                backgroundColor: mode === 'dark' ? Colors.dark.accent.primary : Colors.light.accent.primary,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 16, color: '#FFFFFF', fontWeight: '600' }}>Share Both</Text>
            </TouchableOpacity>

            <View style={{ height: 20 }} />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
