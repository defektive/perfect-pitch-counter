# Pitch Counter
A simple app to track pitches during a pitching session.

## Learning

This was created as a learning process. I used the following resources.

- https://docs.flutter.dev/get-started/install
- https://medium.com/lodgify-technology-blog/deploy-your-flutter-app-to-google-play-with-github-actions-f13a11c4492e

## Building

I have been using `fvm`.

### Android

You need to have adb installed and the android sdk installed and configured.

```bash
fvm flutter build apk --release
```

### Web

```bash
fvm flutter run -d chrome
```

### Linux

coming soon