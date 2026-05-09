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
        tabBarActiveTintColor: Colors.accent.primary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: mode === 'dark' ? Colors.dark.primary : Colors.light.primary,
          borderTopColor: mode === 'dark' ? Colors.dark.divider : Colors.light.divider,
          height: Platform.OS === 'ios' ? 89 : 65,
          paddingBottom: Platform.OS === 'ios' ? 29 : 12,
          borderBottomWidth: 1,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4,
        },
        tabBarItemStyle: {},
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          color: mode === 'dark' ? Colors.dark.text.primary : Colors.light.text.primary,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Game Mode',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 30 : 24}
              name="baseball"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="counters"
        options={{
          title: 'Counters',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 30 : 24}
              name="list.bullet"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="score"
        options={{
          title: 'Score',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 30 : 24}
              name="star"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 30 : 24}
              name="gear"
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
