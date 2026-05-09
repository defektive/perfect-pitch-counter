# Native Build Setup Guide

## Prerequisites

### For iOS Builds
- Mac with Apple Silicon or Intel
- Xcode 15+ installed
- Apple Developer account (for distribution)

### For Android Builds
- Java JDK 17
- Android SDK
- Google Play Store credentials

## Local Build Commands

### iOS (IPA)
```bash
# Navigate to project
cd react-native

# Install iOS dependencies
pod install --repo-update

# Build IPA
npx expo export:ios --output app/build/

# Results in: app/build/*.ipa
```

### Android (APK/AAB)
```bash
cd react-native

# Build APK (for testing)
npx expo export:android --output app/build/apk

# Build App Bundle (for Play Store)
npx expo export:android --output app/build/appbundle

# Results in:
#   - APK: app/build/apk/*.apk
#   - AAB: app/build/appbundle/*.aab
```

### Web
```bash
cd react-native

# Build web app
npx expo export --platform web

# Results in: app/build/web/
```

## GitHub Actions Setup

### Automatic Release Build
Push a tag matching `v*` (e.g., `v1.0.0`) to trigger:
- iOS: `.github/workflows/ios-build.yaml`
- Android: `.github/workflows/android-build.yaml`

### Required Secrets (GitHub Repository)

Create these secrets in your repository:

```
SERVICE_ACCOUNT_JSON     # Base64 encoded Play Store service account
KEYSTORE_BASE64          # Base64 encoded keystore file
KEYSTORE_PASSWORD        # Keystore password
KEY_PASSWORD             # Keystore alias password
KEY_ALIAS                # Keystore alias name
```

### Configure Secrets

#### Play Store Service Account
1. Create service account in Google Play Console
2. Download JSON file
3. Base64 encode: `cat service-account.json | base64 | tr -d '\n'`
4. Store as `SERVICE_ACCOUNT_JSON`

#### Keystore Setup
```bash
# Create keystore file
keytool -genkeypair \
  -alias pitch-counter \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -keystore app/build/keystore.jks \
  -storepass YOUR_STORE_PASSWORD \
  -keypass YOUR_KEY_PASSWORD

# Encode to base64
cat app/build/keystore.jks | base64 > keystore-base64.txt
cat keystore-base64.txt
```

## Build Verification

### Test Build Locally
```bash
cd react-native

# Clean
npm run clean

# Build web (fastest to verify)
npx expo export --platform web

# Check output
ls -la app/build/web/
```

### Verify Android Build
```bash
cd react-native
npx expo export:android --output app/build/apk

# Check APK
ls -lh app/build/apk/

# Install on device
adb install app/build/apk/*.apk
```

### Verify iOS Build
```bash
cd react-native
pod install
npx expo export:ios --output app/build/

# Check IPA
ls -lh app/build/*.ipa

# Install on device (with provisioning profile)
adb install -r app/build/*.ipa
```

## Build Output Structure

```
app/build/
├── apk/
│   └── pitch-counter-*.apk          # Android APK
├── appbundle/
│   └── pitch-counter-*.aab          # Android App Bundle
├── ios/
│   └── pitch-counter_*.ipa          # iOS IPA
└── web/
    └── index.html                   # Web app
```

## Deployment Workflows

### Release Flow
1. Update version in `app.json`
2. Commit and push
3. Create git tag: `git tag v1.0.0`
4. Push tag: `git push origin v1.0.0`
5. GitHub Actions builds and uploads to Play Store

### Staging Flow
1. Use different tag pattern: `v1.0.0-staging`
2. Modify `app.json` bundle identifiers
3. Build without signing (for testing)
4. Install via QR code or direct download

## Troubleshooting

### CocoaPods Errors
```bash
cd react-native
pod deintegrate
pod install --repo-update
```

### Gradle Errors
```bash
# Clear Gradle cache
rm -rf ~/.gradle/caches/

# Rebuild
npx expo export:android
```

### Xcode Errors
```bash
# Clean build folder
rm -rf app/build

# Rebuild dependencies
pod install
npx expo export:ios
```

## Security Notes

- Never commit keystore files
- Use GitHub Secrets for sensitive data
- Rotate keys annually
- Store base64-encoded keystores securely
