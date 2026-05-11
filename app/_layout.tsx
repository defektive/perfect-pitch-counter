import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();

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
            // Android 15+ forces edge-to-edge; without an explicit inset the
            // Stack header sits at y=0 underneath the status bar. iOS already
            // handles this via its own safe-area logic, so only override there.
            headerStatusBarHeight: Platform.OS === 'android' ? insets.top : undefined,
          }}
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
