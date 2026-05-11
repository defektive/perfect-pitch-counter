# Perfect Pitch Counter

React Native (Expo) app for tracking baseball/softball pitching sessions and managing custom counters.

> **Migrated from Flutter in 2026.** The original Flutter app lives in git history before the
> migration commit and is no longer present in the working tree.
> See [`RELEASE_NOTES.md`](./RELEASE_NOTES.md) for the migration summary.

## Screens

- **Game Mode** — Practice timer; track hits, strikes, balls; auto-outs after 3 strikes and auto-walks after 4 balls; computed stats (batters, outs, walks, runs, totals); reset auto-archives a session to History.
- **Counter Mode** — Quick strike/ball counters with running outs and percentage stats; export game data via the system Share sheet as JSON, CSV, or both.
- **Counters** — Create and manage custom counters (increment, decrement, reset, delete). The most-used counter is highlighted on the page header.
- **History** — Saved sessions from each Game Mode reset. Each card shows date, duration, totals, and percentages. Delete one or clear all.
- **Settings** — App name, version, build number.

## Tech Stack

- React Native 0.79 + Expo SDK 53
- Expo Router (file-based navigation)
- Zustand (state management)
- AsyncStorage (persistence)
- Vitest + `@testing-library/react-native` (tests)

## Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/) (`npx expo` works without a global install)
- For Android builds: [Java JDK 17](https://adoptium.net/), [Android SDK](https://developer.android.com/studio)
- For iOS builds: [Xcode 15+](https://developer.apple.com/xcode/) (macOS only)

## Getting Started

```bash
npm ci
npm start
```

Then press `w` (web), `a` (Android emulator), or `i` (iOS simulator). For a physical device, install Expo Go and scan the QR code from `npm start`.

## Testing

```bash
npm test            # watch mode
npm test -- --run   # single run (CI mode)
npm run test:coverage
```

Currently **123 tests across 15 files**, with `app/`, `components/`, `hooks/`, `utils/`, and `constants/` in coverage scope. See `vitest.config.ts` and `test-utils/setup.ts` for the test harness — it stubs `react-native`, `expo-haptics`, `@expo/vector-icons`, and `expo-constants` so screens can render under vitest without a real RN runtime.

## Building

### Web (used for GitHub Pages deploy)

```bash
npx expo export --platform web
```

Output: `dist/`. The web build assumes a base URL of `/perfect-pitch-counter` (matches the GitHub Pages subpath); change `expo.experiments.baseUrl` in `app.json` if you serve from a different path.

### Android — debug APK

1. Generate the native Android project (only needed once, or after `app.json` changes):

   ```bash
   npx expo prebuild --platform android
   ```

2. Strip a known-incompatible line from the generated build file (Expo prebuild emits `enableBundleCompression` which RN 0.79 rejects):

   ```bash
   sed -i '/enableBundleCompression/d' android/app/build.gradle
   ```

3. Build:

   ```bash
   JAVA_HOME=/usr/lib/jvm/java-17-openjdk ANDROID_HOME=~/Android/Sdk \
     ./android/gradlew -p ./android assembleDebug
   ```

   Output: `android/app/build/outputs/apk/debug/app-debug.apk`.

> Debug APKs do **not** embed the JS bundle — they fetch it from Metro at runtime. To use a debug APK, run `npm start` on the same network and the device will pull JS from your Metro server. To sideload without Metro, build a release APK (`assembleRelease`) which embeds the bundle.

### Android — release AAB (Google Play)

Production Android builds for Play go through `bundleRelease`, which produces a signed `.aab`.

1. Create an upload keystore once and store it somewhere safe. **Back this file up** — losing it means you can't push updates to the same Play listing.

   ```bash
   keytool -genkey -v -keystore upload.keystore -alias upload \
     -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Build the release bundle, passing signing config via Gradle properties so nothing gets committed:

   ```bash
   JAVA_HOME=/usr/lib/jvm/java-17-openjdk ANDROID_HOME=~/Android/Sdk \
     ./android/gradlew -p ./android bundleRelease \
     -Pandroid.injected.signing.store.file=/absolute/path/to/upload.keystore \
     -Pandroid.injected.signing.store.password=STORE_PASS \
     -Pandroid.injected.signing.key.alias=upload \
     -Pandroid.injected.signing.key.password=KEY_PASS
   ```

   Output: `android/app/build/outputs/bundle/release/app-release.aab`.

3. Bump `expo.android.versionCode` in `app.json` before each Play upload — Play rejects bundles whose versionCode it has already seen. (CI does this automatically via `github.run_number`; see below.)

4. Upload the `.aab` in Play Console → your app → Internal testing → Create new release → upload bundle.

> If you've enabled Play App Signing, the keystore above is your **upload** key — Google re-signs the bundle with the app key on their side.

## CI / CD

Workflows live in `.github/workflows/`:

| File | Trigger | Does |
|---|---|---|
| `check-pr.yaml` | PR to `main` | Installs deps, runs all 123 tests, prebuilds Android, builds a debug APK. |
| `publish-web.yaml` | Push to `main` | Builds the web bundle (`expo export --platform web`), copies `index.html` → `404.html` for SPA deep-link fallback, deploys to the `gh-pages` branch. GitHub Pages serves from there. |
| `publish-apk.yaml` | Push of a `v*` tag | Runs tests, builds a signed release AAB (with `versionCode = github.run_number`, `versionName = github.ref_name`), uploads to Play Store **Internal testing** track for `dev.defektive.pitchin`. |

### Required GitHub secrets (Play Store deploy)

- `KEYSTORE_BASE64` — base64-encoded upload keystore (`base64 < upload.keystore`)
- `KEYSTORE_PASSWORD`
- `KEY_ALIAS`
- `KEY_PASSWORD`
- `SERVICE_ACCOUNT_JSON` — Google Play API service account JSON

### Required repo configuration (Pages deploy)

- Settings → Pages → Source: **Deploy from a branch** → Branch: `gh-pages` → Folder: `/ (root)`.

## Project Structure

```
app/
├── _layout.tsx              # Root layout, loads persisted state on mount
├── modal.tsx                # Generic modal screen
└── (tabs)/
    ├── _layout.tsx          # Tab nav (5 tabs)
    ├── index.tsx            # Game Mode
    ├── counter-mode.tsx     # Counter Mode
    ├── counters.tsx         # Custom Counters
    ├── history.tsx          # Session History
    └── settings.tsx         # Settings

components/ui/               # Button, Collapsible, CounterDisplay, IconSymbol

hooks/
├── use-pitch-game.ts        # Game state (Zustand + AsyncStorage)
├── use-counter-manager.ts   # Custom counter state
├── use-session-history.ts   # Saved session list
├── use-color-scheme.ts      # Re-exports RN's hook
├── use-color-scheme.web.ts  # Web variant with hydration guard
└── use-theme-color.ts       # Theme-aware color lookup

constants/
└── theme.ts                 # Colors (light/dark), spacing, typography

utils/
├── haptics.ts               # Platform-guarded haptic helpers
└── game-to-session.ts       # Pure helper: game state → session record

plugins/
└── with-gradle-jvm-args.js  # Expo config plugin — sets gradle.properties JVM args

test-utils/
├── setup.ts                 # Vitest setup: mocks react-native, expo-*, vector-icons
├── react-native-mock.ts     # ESM stub for react-native (used by ESM imports)
└── react-native-mock.cjs    # CJS stub (used by @testing-library/react-native internals)
```

## Notable design decisions

- **`react-native` is stubbed in tests, not loaded for real.** RN ships Flow-typed source that esbuild can't parse, so the test harness aliases `react-native` to lightweight host-string components. See `test-utils/react-native-mock.ts` for the surface.
- **`expo prebuild --clean` regenerates `android/` from scratch every CI run.** Local edits to `android/app/build.gradle` will not persist. To make a config change survive, use the `expo-build-properties` plugin or a custom config plugin (see `plugins/with-gradle-jvm-args.js`).
- **Sessions auto-save on Reset in Game Mode** but only if `totalPitches > 0` or `hitCount > 0`. Empty resets do not pollute the History tab.
- **Coverage uses Istanbul, not v8.** The Node module-resolver patch in `test-utils/setup.ts` (used to redirect CJS `require('react-native')` to the stub) interferes with v8's `Profiler.takePreciseCoverage`. Istanbul instruments at transform time and doesn't depend on the Node inspector.
