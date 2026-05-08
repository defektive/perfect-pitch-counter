# Release Notes - Perfect Pitch Counter

## [0.1.6+9] - Cleanup and Improvements Release

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

## [0.1.5+8] - Dark Mode
- Added dark mode support
- CodeQL analysis workflow added
- Commit message improvements

## [0.1.5+7] - Various Bug Fixes
- Fixed counter notifications
- Various bug fixes

## [0.1.5+6] - Initial Release
- Basic pitch tracking
- Arbitrary counters with basic functionality
- Dark mode UI
