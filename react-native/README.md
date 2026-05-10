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
- For Android builds: [Java JDK 17](https://adoptium.net/)
- For iOS builds: [Xcode 15+](https://developer.apple.com/xcode/) (macOS only)

## Getting Started

```bash
npm ci
npm start
```

Press `w` for web, `a` for Android emulator, `i` for iOS simulator.

## Building

```bash
# Web
npx expo export --platform web

# Android
npx expo export --platform android
```

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
