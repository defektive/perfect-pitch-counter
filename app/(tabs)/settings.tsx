import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useColorScheme } from 'react-native';
import Constants from 'expo-constants';
import { Colors } from '@/constants/theme';

function Divider({ color }: { color: string }) {
  return <View style={{ height: 1, backgroundColor: color }} />;
}

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const mode = colorScheme ?? 'light';
  const textColor = mode === 'dark' ? Colors.dark.text : Colors.light.text;
  const backgroundColor = mode === 'dark' ? Colors.dark.background : Colors.light.background;
  const dividerColor = mode === 'dark' ? Colors.dark.divider : Colors.light.divider;

  const appName = Constants.expoConfig?.name ?? 'Pitch Counter';
  const version = Constants.expoConfig?.version ?? '0.1.5';
  const buildNumber = Constants.expoConfig?.ios?.buildNumber ?? Constants.expoConfig?.android?.versionCode?.toString() ?? '8';

  return (
    <ScrollView style={{ flex: 1, backgroundColor }}>
      {/* Application */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, minHeight: 56 }}>
        <Text style={{ fontSize: 20, marginRight: 16 }}>🔤</Text>
        <Text style={{ flex: 1, fontSize: 16, color: textColor.primary }}>Application</Text>
        <Text style={{ fontSize: 16, color: textColor.secondary }}>{appName}</Text>
      </View>
      <Divider color={dividerColor} />

      {/* Version */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, minHeight: 56 }}>
        <Text style={{ fontSize: 20, marginRight: 16 }}>ℹ️</Text>
        <Text style={{ flex: 1, fontSize: 16, color: textColor.primary }}>Version</Text>
        <Text style={{ fontSize: 16, color: textColor.secondary }}>{version}</Text>
      </View>
      <Divider color={dividerColor} />

      {/* Build Number */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, minHeight: 56 }}>
        <Text style={{ fontSize: 20, marginRight: 16 }}>⚙️</Text>
        <Text style={{ flex: 1, fontSize: 16, color: textColor.primary }}>Build Number</Text>
        <Text style={{ fontSize: 16, color: textColor.secondary }}>{buildNumber}</Text>
      </View>
      <Divider color={dividerColor} />
    </ScrollView>
  );
}
