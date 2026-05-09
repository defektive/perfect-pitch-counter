import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: '#333',
          height: Platform.OS === 'ios' ? 89 : 65,
          paddingBottom: Platform.OS === 'ios' ? 29 : 12,
        },
        tabBarItemStyle: {},
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          color: '#fff',
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
