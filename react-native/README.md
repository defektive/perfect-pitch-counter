# Pitch Counter (React Native)

A React Native port of the Flutter Pitch Counter app.

## Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/)
- For iOS builds: [Xcode 15+](https://developer.apple.com/xcode/)
- For Android builds: [Java JDK 17](https://adoptium.net/)

## Installation

```bash
cd react-native
npm ci
```

## Running Locally

```bash
npm start

# Press 'w' to open in browser
# Press 'i' to open in iOS simulator
# Press 'a' to open in Android emulator
```

## Building for Distribution

### Local Build (iOS - requires Mac)

```bash
# Install iOS dependencies
pod install --repo-update

# Build IPA
npx expo export:ios --output app/build/
```

### Local Build (Android)

```bash
# Build APK
npx expo export:android --output app/build/apk

# Build App Bundle (for Play Store)
npx expo export:android --output app/build/appbundle
```

### GitHub Actions Build

#### Android (APK/App Bundle)
Push a tag matching `v*` (e.g., `v1.0.0`) to trigger:
```yaml
# .github/workflows/android-build.yaml
```

#### iOS (IPA)
Push a tag matching `v*` to trigger:
```yaml
# .github/workflows/ios-build.yaml
```

### Web Build

```bash
npx expo export --platform web
# Output: app/build/web/
```

## Deployment

### Play Store
1. Build App Bundle: `npx expo export:android --output app/build/appbundle`
2. Upload to Google Play Console

### GitHub Pages
1. Build web: `npx expo export --platform web`
2. Deploy `app/build/web/` to GitHub Pages

## Build Commands Reference

| Platform | Build Type | Command | Output |
|----------|-----------|---------|--------|
| iOS | IPA | `npx expo export:ios --output app/build/` | `app/build/*.ipa` |
| Android | APK | `npx expo export:android --output app/build/apk` | `app/build/apk/*.apk` |
| Android | App Bundle | `npx expo export:android --output app/build/appbundle` | `app/build/appbundle/*.aab` |
| Web | Static | `npx expo export --platform web` | `app/build/web/` |

## Notes

- All builds produce native APK/IPA files without EAS
- Use GitHub Actions for automated tagged releases
- Local builds require the appropriate platform tooling (Xcode for iOS)
- Version numbers are managed via Git tags (`v1.0.0`, `v1.0.1`, etc.)
