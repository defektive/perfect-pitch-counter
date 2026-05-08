# Pitch Counter

A simple Flutter app to track baseball pitching sessions and manage arbitrary counters.

## Features

- **Pitch Tracking**
  - Track balls, strikes, walks, and hitters
  - Ball, strike, walk, and hitter counters
  - Pitch count and game innings

- **Arbitrary Counters**
  - Add custom counters for any need
  - Usage statistics (total increments, last used)
  - Most used counter highlight
  - Counter names with unique IDs
  - Duplicate name protection (case-insensitive)
  - Name validation (max 50 characters)

- **Counter Actions**
  - Increment, decrement, reset counters
  - Visual indication for used/unused counters
  - Delete and remove counters

- **Session Management**
  - Ball, strike, walk, hitter tracking
  - Walk, hitter, pitch limit tracking
  - Full out/innings tracking

## Setup

### Prerequisites

- [Flutter SDK](https://docs.flutter.dev/get-started/install)
- Android Studio (for Android builds)

### Installation

```bash
flutter pub get
flutter run
```

### Build

#### Android

```bash
flutter build apk --release
```

#### Web

```bash
flutter run -d chrome
```

#### Linux

```bash
flutter build linux --release
```

## Usage

### Adding a Counter

1. Navigate to the Counters tab
2. Tap the `+` button
3. Enter a name for your counter
4. Use the buttons to:
   - `+` Increment the counter
   - `-` Decrement (only if > 0)
   - Rotate reset the counter
   - Delete remove the counter

### Pitching Session

1. Tap the **PITCH** button for each pitch
2. Use **BALL**, **STRIKE**, **WALK**, **HITTER** as needed
3. View live stats at the top

## Project Structure

```
lib/
├── app/           # App entry point
├── config/        # Config/labels
├── models/        # PitchGame, PitchSession, CounterManager
├── pages/         # PitchCounter, ArbitraryCounters
└── services/      # Persistence service
```

## Improvements in Progress

- ✅ Counter validation & duplicate detection
- ✅ State persistence with shared_preferences
- ✅ Usage statistics tracking
- ✅ CodeQL security scanning
- ✅ CI linting with flutter analyze
- ✅ Widget tests for counter model
- ⏳ Game state persistence (optional)

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Related Projects

- [Flutter](https://flutter.dev)
- [Provider](https://pub.dev/packages/provider)
- [Shared Preferences](https://pub.dev/packages/shared_preferences)
