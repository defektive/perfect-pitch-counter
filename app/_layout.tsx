import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, StatusBar as RNStatusBar } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePitchGame } from '@/hooks/use-pitch-game';
import { useCounterManager } from '@/hooks/use-counter-manager';
import { useSessionHistory } from '@/hooks/use-session-history';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    usePitchGame.getState().loadGame();
    useCounterManager.getState().loadCounters();
    useSessionHistory.getState().loadSessions();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            title: 'Perfect Pitch Counter',
            headerShown: true,
            headerStatusBarHeight:
              Platform.OS === 'android' ? RNStatusBar.currentHeight ?? 24 : undefined,
          }}
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
