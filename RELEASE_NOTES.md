# Release Notes — Perfect Pitch Counter

## React Native rewrite (unreleased)

The app is now a React Native (Expo SDK 53) application; the original Flutter implementation has been replaced. The codebase moved from `react-native/` up to the repo root. Same Play Store listing (`dev.defektive.pitchin`).

### Highlights

- **New: Session History.** Every Reset in Game Mode auto-saves the current totals as a session card on the History tab. Empty resets don't pollute the list.
- **New: System share-sheet exports.** Counter Mode export now opens the device share sheet (JSON, CSV, or both) instead of just copying to the clipboard. Clipboard is still available inside the share sheet.
- **New: Haptic feedback** on counter taps, FAB taps, and destructive actions like Reset.
- **Accessibility:** every icon-only button has a descriptive label; current counts are spoken aloud (e.g., "Add strike, currently 4"); disabled state is exposed correctly.
- **Material icons replace ad-hoc Unicode glyphs** for consistent cross-device rendering.

### Platform compliance

- **16KB page size compliant.** Upgraded to React Native 0.79.6 (matches Expo SDK 53's expected peer); Fresco GIF and AVIF native libraries now ship 16KB-aligned, resolving the Play Console warning.
- **Edge-to-edge friendly.** Stack header now sets `headerStatusBarHeight` explicitly so the title clears the Android status bar on SDK 35+.

### Engineering quality

- **123 tests across 15 files** (Vitest + `@testing-library/react-native`), 88% statement coverage on the included surface.
- **CI/CD** rewritten end-to-end for React Native:
  - PR check: tests + debug APK build.
  - Web deploy: pushes to `gh-pages` on every `main` push, with SPA 404 fallback.
  - Android deploy: signs and uploads a release AAB to Play Store Internal track on `v*` tags. `versionCode` comes from `github.run_number`; `versionName` from `github.ref_name`.

### Migration notes

- The package name stays `dev.defektive.pitchin`; the upload keystore must match what Play has on file.
- Bump `github.run_number` past your last Flutter `versionCode` before the first RN deploy (Play rejects duplicate or lower versionCodes).
- The Flutter codebase is removed from the working tree but remains in git history before the migration commit.

---

## [0.1.6+9] - Cleanup and Improvements Release *(Flutter)*

### Improvements
- **Counter Improvements**
  - Added usage tracking (`totalIncrements`, `lastUsed`)
  - Added visual indicator for used/unused counters (blue color)
  - Unique timestamp-based IDs for counters
  - Most used counter display in header

- **Counter Manager**
  - Added validation (empty names, length limits, duplicates)
  - Counter persistence with `shared_preferences`
  - Auto-save on every change
  - Load counters from storage on app start

- **UI/UX**
  - Improved error feedback with `ScaffoldMessenger`
  - Better empty state messages
  - Visual distinction between used and unused counters

- **Code Quality**
  - Removed deprecated `wear_plus` dependency
  - Fixed all lint warnings (`flutter analyze` - no issues!)
  - Updated all dependencies to latest compatible versions
  - Fixed constant naming conventions
  - Removed unused imports and code
  - Fixed class structure in settings.dart

### Technical Debt Reduced
- Removed commented dependencies (`wear_plus`)
- Fixed improper singleton usage
- Removed unused `dart:collection` imports
- Fixed `prefer_final_fields` issues
- Fixed constant naming (`AppTitle` → `appTitle`)

### CI/CD
- Added `flutter analyze` to PR workflow
- Added `flutter build apk` verification
- Added CodeQL secret scanning workflow

### Testing
- Added 13 unit tests for `ArbitraryCounter`
- Tests cover increment/decrement/reset logic
- Tests edge cases and validation

### Documentation
- Added comprehensive README
- Added CHANGELOG.md
- Added RELEASE_NOTES.md

### Build
- App now persists counter state across restarts
- Clean git repository with proper .gitignore
- No lint errors in CI/CD pipeline

## [0.1.5+8] - Dark Mode *(Flutter)*
- Added dark mode support
- CodeQL analysis workflow added
- Commit message improvements

## [0.1.5+7] - Various Bug Fixes *(Flutter)*
- Fixed counter notifications
- Various bug fixes

## [0.1.5+6] - Initial Release *(Flutter)*
- Basic pitch tracking
- Arbitrary counters with basic functionality
- Dark mode UI
