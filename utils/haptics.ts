import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

function isSupported() {
  return Platform.OS === 'ios' || Platform.OS === 'android';
}

export function tapHaptic() {
  if (!isSupported()) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

export function actionHaptic() {
  if (!isSupported()) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
}

export function warningHaptic() {
  if (!isSupported()) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
}
