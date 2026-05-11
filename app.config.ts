import type { ExpoConfig } from 'expo/config';

/**
 * Build-time config. Read at `expo prebuild` and `expo export` time on the
 * machine doing the build, then baked into both the native project and the JS
 * bundle (visible to the app via `Constants.expoConfig`).
 *
 * Override via env vars in CI:
 *   APP_VERSION_NAME — user-visible version string (defaults to "1.0.0")
 *   APP_VERSION_CODE — monotonically increasing integer (defaults to 1)
 */
const versionName = process.env.APP_VERSION_NAME ?? '0.2.0';
const versionCode = Number.parseInt(process.env.APP_VERSION_CODE ?? '1', 10);

const config: ExpoConfig = {
  name: 'Pitch Counter',
  slug: 'pitch-counter',
  version: versionName,
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'pitchcounter',
  userInterfaceStyle: 'automatic',
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'dev.defektive.pitch',
    buildNumber: versionCode.toString(),
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
      backgroundColor: '#bef800',
    },
    // Android 15+ (targetSdkVersion 35) forces edge-to-edge at the system
    // level. Opting in here is what hooks up react-native-edge-to-edge,
    // which feeds correct top insets into useSafeAreaInsets() so the Stack
    // header in app/_layout.tsx clears the status bar in release builds.
    // Expo Go's own shell masks the misconfiguration locally.
    edgeToEdgeEnabled: true,
    package: 'dev.defektive.pitchin',
    versionCode,
    permissions: [
      'CAMERA',
      'RECORD_AUDIO',
      'READ_EXTERNAL_STORAGE',
      'WRITE_EXTERNAL_STORAGE',
    ],
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
        dark: {
          backgroundColor: '#000000',
        },
      },
    ],
    './plugins/with-gradle-jvm-args',
  ],
  experiments: {
    typedRoutes: true,
    baseUrl: '/perfect-pitch-counter',
  },
  runtimeVersion: versionName,
};

export default config;
