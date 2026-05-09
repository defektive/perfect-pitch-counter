import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TabLayout() {

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
        tabBarItemStyle: {
          width: screenWidth / 4,
        },
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
              name="list"
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
