# Perfect Pitch Counter — React Native

React Native (Expo) port of the Flutter Perfect Pitch Counter app. Tracks baseball/softball pitching sessions and manages custom counters.

## Screens

- **Game Mode** — Practice timer, hits/strikes/balls with auto-outs and auto-walks, computed stats (batters, outs, walks, runs, totals), reset
- **Counter Mode** — Quick strike/ball counters, out display, percentage stats, export to clipboard (JSON/CSV)
- **Counters** — Create/manage custom counters with increment, decrement, reset, delete, most-used highlight
- **Settings** — App name, version, build number

## Tech Stack

- React Native 0.78 + Expo SDK 53
- Expo Router (file-based navigation)
- Zustand (state management)
- AsyncStorage (persistence)
- expo-clipboard (export/copy)

## Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/)
- For Android builds: [Java JDK 17](https://adoptium.net/), [Android SDK](https://developer.android.com/studio) with build-tools and a platform installed
- For iOS builds: [Xcode 15+](https://developer.apple.com/xcode/) (macOS only)

## Getting Started

```bash
npm ci
npm start
```

Press `w` for web, `a` for Android emulator, `i` for iOS simulator.

## Building

### Web

```bash
npx expo export --platform web
```

### Android APK

1. Generate the native Android project (only needed once, or after changing `app.json`):

```bash
npx expo prebuild --platform android
```

2. Build the debug APK:

```bash
JAVA_HOME=/usr/lib/jvm/java-17-openjdk ANDROID_HOME=~/Android/Sdk \
  ./android/gradlew -p ./android assembleDebug
```

The APK will be at `android/app/build/outputs/apk/debug/app-debug.apk`.

For a release build, use `assembleRelease` instead (requires signing config).

> **Note:** If the prebuild generates an `enableBundleCompression` line in
> `android/app/build.gradle` that causes a build error, remove it — this is a
> known version mismatch between Expo prebuild and React Native 0.78.

### Android App Bundle (AAB) — for Google Play

Google Play requires an AAB (App Bundle), not an APK. The native Android
project produced by `expo prebuild` builds AABs via Gradle's `bundle*` tasks.

#### Debug AAB (sanity check, unsigned)

```bash
JAVA_HOME=/usr/lib/jvm/java-17-openjdk ANDROID_HOME=~/Android/Sdk \
  ./android/gradlew -p ./android bundleDebug
```

Output: `android/app/build/outputs/bundle/debug/app-debug.aab`

A debug AAB is **not** uploadable to Play — it's signed with the debug
keystore. Use it only to verify the bundle build works.

#### Release AAB (signed, for Play Store upload)

1. Create an upload keystore once and store it somewhere safe (back it up — if
   you lose it, you cannot publish updates to the same Play listing):

   ```bash
   keytool -genkey -v -keystore upload.keystore -alias upload \
     -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Build the release bundle, passing the keystore as Gradle properties so
   nothing gets committed:

   ```bash
   JAVA_HOME=/usr/lib/jvm/java-17-openjdk ANDROID_HOME=~/Android/Sdk \
     ./android/gradlew -p ./android bundleRelease \
     -Pandroid.injected.signing.store.file=/absolute/path/to/upload.keystore \
     -Pandroid.injected.signing.store.password=STORE_PASS \
     -Pandroid.injected.signing.key.alias=upload \
     -Pandroid.injected.signing.key.password=KEY_PASS
   ```

   Output: `android/app/build/outputs/bundle/release/app-release.aab`

3. Bump `expo.android.versionCode` in `app.json` before each Play upload —
   Play rejects bundles with a versionCode it has already seen.

4. Upload the `.aab` in Play Console → your app → Internal testing (or your
   chosen track) → Create new release → upload bundle.

> If you already have Play App Signing enabled on the listing, the keystore
> above is your **upload** key — Google re-signs the bundle with the app key
> on their side.
>
> If the `-P` flags don't take effect (you'll see the AAB signed with
> `debug.keystore` instead), open `android/app/build.gradle` and confirm the
> `release` build type's `signingConfig` is not pinned to the debug
> `signingConfigs.debug`. Replace it with `signingConfigs.release` and set the
> release config from environment variables or a gitignored
> `gradle.properties` file.

## Project Structure

```
app/
├── _layout.tsx              # Root layout, loads persisted state
└── (tabs)/
    ├── _layout.tsx          # Tab navigation (4 tabs, amber active color)
    ├── index.tsx            # Game Mode screen
    ├── counter-mode.tsx     # Counter Mode screen
    ├── counters.tsx         # Custom Counters screen
    └── settings.tsx         # Settings screen
components/ui/               # Button, CounterDisplay, IconSymbol
hooks/
├── use-pitch-game.ts        # Game state (Zustand + AsyncStorage)
└── use-counter-manager.ts   # Counter state (Zustand + AsyncStorage)
constants/
└── theme.ts                 # Colors (light/dark), spacing, typography
```
