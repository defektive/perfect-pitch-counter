# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added
- Counter persistence using `shared_preferences`
- Most used counter display on arbitrary counters page
- Usage tracking (total increments, last used timestamp)
- Counter visual indication for used/unused counters

### Changed
- Counter models now track usage statistics
- Added counter name validation (max 50 characters)
- Duplicate counter detection (case-insensitive)
- Error feedback when adding counters fails

### Fixed
- Arbitrary counters page now properly renders new counters
- Counter increment/decrement/reset updates UI immediately
- Fixed singleton pattern misuse in pitch game state

## [0.1.5+8]

### Changed
- Dark mode UI improvements
- CodeQL analysis workflow added
- Commit message improvements

### Fixed
- Counter notifications for increment/decrement/reset

## [0.1.5+7]

### Changed
- Dark mode support added

### Fixed
- Various bug fixes

## [0.1.5+6]

### Changed
- Initial release
