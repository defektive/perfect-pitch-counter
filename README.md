# Perfect Pitch Counter

A baseball/softball pitch tracking app with custom counters. Available as both a Flutter app and a React Native (Expo) app.

## Features

- **Game Mode** — Full game tracking with practice timer, hits, strikes, balls, auto-outs (3 strikes), auto-walks (4 balls), and computed stats (batters, outs, walks, runs, total pitches)
- **Counter Mode** — Quick pitch tracking with strike/ball buttons, out count, percentage stats, and data export (JSON, CSV, clipboard)
- **Custom Counters** — Create unlimited named counters with increment/decrement/reset, usage stats, most-used highlight, and persistent storage
- **Settings** — App name, version, and build info display
- **Dark/Light mode** — Follows system theme
- **Data persistence** — Game state and counters saved locally

## Platforms

| Platform | Framework | Directory |
|----------|-----------|-----------|
| Android, iOS, Linux, Web | Flutter | `./` (root) |
| Android, iOS, Web | React Native (Expo) | `./react-native/` |

Both apps share the same layout, functionality, and data models.

## Flutter App

### Prerequisites

- [Flutter SDK](https://docs.flutter.dev/get-started/install)

### Run

```bash
flutter pub get
flutter run
```

### Build

```bash
# Android
flutter build apk --release

# Web
flutter run -d chrome

# Linux
flutter build linux --release
```

## React Native App

### Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/)
- For Android: [Java JDK 17](https://adoptium.net/)
- For iOS: [Xcode 15+](https://developer.apple.com/xcode/) (macOS only)

### Run

```bash
cd react-native
npm ci
npm start

# Press 'w' for web, 'a' for Android emulator, 'i' for iOS simulator
```

### Build

```bash
# Web
npx expo export --platform web

# Android
npx expo export --platform android
```

## Project Structure

```
├── lib/                       # Flutter source
│   ├── app/                   #   App root & navigation
│   ├── config/                #   Labels/constants
│   ├── models/                #   PitchGame, CounterManager
│   └── pages/                 #   Game, Counter Mode, Counters, Settings
├── react-native/              # React Native (Expo) source
│   ├── app/(tabs)/            #   Screens (index, counter-mode, counters, settings)
│   ├── components/ui/         #   Reusable components
│   ├── hooks/                 #   Zustand stores (use-pitch-game, use-counter-manager)
│   └── constants/             #   Theme colors, spacing, typography
```

## License

MIT License
