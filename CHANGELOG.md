# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased] — React Native rewrite

The app was rewritten from Flutter to React Native (Expo) and the codebase moved to the repo root. The Flutter source has been removed; it is preserved in git history before the migration commit.

### Added
- **History tab** with auto-saved game sessions on each Reset, persisted to AsyncStorage. Each session records date, duration, totals, and percentages. Per-session delete and Clear all.
- **Haptic feedback** on every tap (light), action buttons (medium), and destructive actions (warning).
- **Accessibility labels** on every icon-only button across all screens. Decrement buttons expose `accessibilityState.disabled` when count is zero.
- **System Share sheet export** in Counter Mode for JSON, CSV, and combined formats (previously clipboard-only).
- **123 tests across 15 files** — Vitest + `@testing-library/react-native`. Coverage at 88% statements on the included surface.
- **GitHub Actions:**
  - `publish-apk.yaml` — signs and uploads a release AAB to the Play Store Internal track on `v*` tags, using `github.run_number` as `versionCode` and `github.ref_name` as `versionName`.
  - `publish-web.yaml` — deploys the web export to GitHub Pages on every push to `main`, including a `404.html` SPA deep-link fallback.
  - `check-pr.yaml` — runs the full test suite and builds a debug APK on every PR to `main`.
- `experiments.baseUrl: "/perfect-pitch-counter"` in `app.json` so the web build serves correctly from the GitHub Pages subpath.
- Custom Expo config plugin (`plugins/with-gradle-jvm-args.js`) that persists Gradle JVM args (heap and metaspace) across `expo prebuild --clean`.

### Changed
- React Native pinned to **0.79.6** (matches what Expo SDK 53.0.27 expects). Aligned all peers via `npx expo install --fix`. Resolves Play Console **16KB page size** warnings — Fresco's GIF and AVIF companion artifacts ship 16KB-aligned in the bundled versions.
- Reset in Game Mode is now non-destructive — it archives the current game state to History first, then clears the counters. Resets on an empty game do nothing.
- Export modal in Counter Mode renamed "Copy All" to "Share Both" and routes through `Share.share`. Web falls back to `navigator.clipboard.writeText`.
- Counter Mode and Game Mode chip buttons (`ListTileButton`) now use opaque backgrounds (`#eeeeee` light, `#111111` dark) — the previous translucent background caused an Android shadow rendering artifact at `elevation: 1`.
- All ad-hoc unicode glyphs (`−`, `↻`, `🗑`, `⬇`, `⏹`, `▶`, `📈`, `📄`, `📊`) replaced with `MaterialIcons` from `@expo/vector-icons` for consistent cross-device rendering.

### Fixed
- Stack header title no longer overlaps the Android status bar (set `headerStatusBarHeight` explicitly to `StatusBar.currentHeight`).
- `runtimeVersion` config was malformed (`{ policy: "include", version: "1.0.0" }`); now a literal `"1.0.0"`.
- Gradle release-build `lintVitalAnalyzeRelease` task was OOMing on metaspace; bumped to `-Xmx4096m -XX:MaxMetaspaceSize=1536m` via the config plugin.

### Removed
- Entire Flutter codebase (`lib/`, `test/`, `pubspec.yaml`, etc.).
- `react-native/.github/workflows/android-build.yaml` and `ios-build.yaml` — broken (used `expo export:android`/`export:ios` which produce JS bundles, not native artifacts) and in a directory GitHub Actions doesn't scan.
- The `react-native/` subdirectory — its contents now live at the repo root.

### Migration notes
- `package` (Android) and `bundleIdentifier` (iOS) are `dev.defektive.pitchin` to match the existing Play Store listing.
- `versionCode` is now derived from `github.run_number` at CI build time. Bump the workflow run count past your last Flutter `versionCode` before the first RN deploy.
- The upload keystore must match what Play has on file for `dev.defektive.pitchin`; reuse the same secrets the Flutter pipeline used (`KEYSTORE_BASE64`, `KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD`, `SERVICE_ACCOUNT_JSON`).

---

## [0.1.5+8] — Flutter

### Changed
- Dark mode UI improvements
- CodeQL analysis workflow added
- Commit message improvements

### Fixed
- Counter notifications for increment/decrement/reset

## [0.1.5+7] — Flutter

### Changed
- Dark mode support added

### Fixed
- Various bug fixes

## [0.1.5+6] — Flutter

### Changed
- Initial release
