import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSessionHistory, type SessionRecord } from '@/hooks/use-session-history';
import { Colors } from '@/constants/theme';
import { warningHaptic, tapHaptic } from '@/utils/haptics';

function formatDuration(ms: number): string {
  if (ms <= 0) return '—';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function confirmDelete(title: string, message: string, onConfirm: () => void) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: onConfirm },
  ]);
}

function SessionCard({
  session,
  onDelete,
  textColor,
  cardBg,
  borderColor,
  accent,
}: {
  session: SessionRecord;
  onDelete: () => void;
  textColor: { primary: string; secondary: string; tertiary: string };
  cardBg: string;
  borderColor: string;
  accent: string;
}) {
  const { totals } = session;
  return (
    <View
      style={{
        backgroundColor: cardBg,
        borderRadius: 12,
        borderWidth: 1,
        borderColor,
        padding: 14,
        marginBottom: 10,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: textColor.primary }}>
            {formatDate(session.startedAt)}
          </Text>
          <Text style={{ fontSize: 12, color: textColor.secondary, marginTop: 2 }}>
            Duration: {formatDuration(session.durationMs)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onDelete}
          accessibilityRole="button"
          accessibilityLabel="Delete this session"
          style={{ padding: 6 }}
        >
          <MaterialIcons name="delete" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <Stat label="Pitches" value={totals.pitches} textColor={textColor} accent={accent} />
        <Stat label="Strikes" value={totals.strikes} textColor={textColor} accent={accent} />
        <Stat label="Balls" value={totals.balls} textColor={textColor} accent={accent} />
        <Stat label="Hits" value={totals.hits} textColor={textColor} accent={accent} />
        <Stat label="Walks" value={totals.walks} textColor={textColor} accent={accent} />
        <Stat label="Outs" value={totals.outs} textColor={textColor} accent={accent} />
      </View>

      <View
        style={{
          marginTop: 6,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: borderColor,
        }}
      >
        <Text style={{ fontSize: 12, color: textColor.secondary }}>
          Strike %: <Text style={{ color: textColor.primary, fontWeight: '600' }}>{totals.strikePercentage}%</Text>
        </Text>
        <Text style={{ fontSize: 12, color: textColor.secondary }}>
          Ball %: <Text style={{ color: textColor.primary, fontWeight: '600' }}>{totals.ballPercentage}%</Text>
        </Text>
      </View>
    </View>
  );
}

function Stat({
  label,
  value,
  textColor,
  accent,
}: {
  label: string;
  value: number;
  textColor: { primary: string; secondary: string; tertiary: string };
  accent: string;
}) {
  return (
    <View style={{ width: '33.333%', paddingVertical: 4 }}>
      <Text style={{ fontSize: 11, color: textColor.tertiary }}>{label}</Text>
      <Text style={{ fontSize: 18, fontWeight: '700', color: accent }}>{value}</Text>
    </View>
  );
}

export default function HistoryScreen() {
  const colorScheme = useColorScheme();
  const mode = colorScheme ?? 'light';
  const textColor = mode === 'dark' ? Colors.dark.text : Colors.light.text;
  const backgroundColor = mode === 'dark' ? Colors.dark.background : Colors.light.background;
  const cardBg = mode === 'dark' ? Colors.dark.card : Colors.light.card;
  const borderColor = mode === 'dark' ? Colors.dark.border : Colors.light.border;
  const accent = mode === 'dark' ? Colors.dark.accent.primary : Colors.light.accent.primary;

  const { sessions } = useSessionHistory();

  const handleDelete = (session: SessionRecord) => {
    confirmDelete('Delete session?', `${formatDate(session.startedAt)} will be removed.`, () => {
      warningHaptic();
      useSessionHistory.getState().removeSession(session.id);
    });
  };

  const handleClearAll = () => {
    confirmDelete('Clear all sessions?', 'All saved sessions will be deleted.', () => {
      warningHaptic();
      useSessionHistory.getState().clearAll();
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor }}>
      {sessions.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
          <MaterialIcons name="schedule" size={48} color={textColor.tertiary} />
          <Text style={{ fontSize: 16, color: textColor.secondary, textAlign: 'center', marginTop: 12 }}>
            No sessions yet.
          </Text>
          <Text style={{ fontSize: 13, color: textColor.tertiary, textAlign: 'center', marginTop: 6 }}>
            Tap Reset in Game Mode after a practice to save it here.
          </Text>
        </View>
      ) : (
        <>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderBottomColor: borderColor,
            }}
          >
            <Text style={{ flex: 1, fontSize: 13, color: textColor.secondary }}>
              {sessions.length} session{sessions.length === 1 ? '' : 's'}
            </Text>
            <TouchableOpacity
              onPress={() => { tapHaptic(); handleClearAll(); }}
              accessibilityRole="button"
              accessibilityLabel="Clear all sessions"
            >
              <Text style={{ color: '#F44336', fontSize: 13, fontWeight: '600' }}>Clear all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 12 }}>
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onDelete={() => handleDelete(session)}
                textColor={textColor}
                cardBg={cardBg}
                borderColor={borderColor}
                accent={accent}
              />
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
}
