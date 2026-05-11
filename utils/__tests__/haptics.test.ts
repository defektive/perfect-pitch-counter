import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { tapHaptic, actionHaptic, warningHaptic } from '../haptics';

const setPlatform = (os: 'ios' | 'android' | 'web') => {
  (Platform as { OS: string }).OS = os;
};

describe('haptics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setPlatform('ios');
  });

  it('tapHaptic fires a Light impact on iOS', () => {
    tapHaptic();
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
  });

  it('actionHaptic fires a Medium impact on Android', () => {
    setPlatform('android');
    actionHaptic();
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Medium);
  });

  it('warningHaptic fires a Warning notification', () => {
    warningHaptic();
    expect(Haptics.notificationAsync).toHaveBeenCalledWith(
      Haptics.NotificationFeedbackType.Warning
    );
  });

  it('is a no-op on web', () => {
    setPlatform('web');
    tapHaptic();
    actionHaptic();
    warningHaptic();
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
    expect(Haptics.notificationAsync).not.toHaveBeenCalled();
  });

  it('swallows rejections from the native call', async () => {
    vi.mocked(Haptics.impactAsync).mockRejectedValueOnce(new Error('not available'));
    expect(() => tapHaptic()).not.toThrow();
    // give the swallowed promise a tick to settle so unhandled-rejection logging
    // would have fired by now if the catch wasn't wired up
    await new Promise((r) => setTimeout(r, 0));
  });
});
