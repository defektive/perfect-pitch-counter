import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useColorScheme } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const mode = colorScheme ?? 'light';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.tab.activeColor,
        tabBarInactiveTintColor: mode === 'dark' ? Colors.dark.text.tertiary : Colors.light.text.tertiary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: mode === 'dark' ? Colors.dark.primary : Colors.light.primary,
          borderTopColor: mode === 'dark' ? Colors.dark.divider : Colors.light.divider,
          height: Platform.OS === 'ios' ? 89 : 65,
          paddingBottom: Platform.OS === 'ios' ? 29 : 12,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Game Mode',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="baseball" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="counter-mode"
        options={{
          title: 'Counter Mode',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="dashboard" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="counters"
        options={{
          title: 'Counters',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="list.bullet" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="clock" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="gear" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
