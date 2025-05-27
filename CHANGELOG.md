# Changelog

## [2.4.1] – May 27, 2025
### Added
- License and version headers added to all modules
- Default export logic safely introduced where missing
- Fallback sound (`keystroke.mp3`) used for Teletype intro

### Fixed
- `rooms.js` now exports full room object cleanly
- Syntax errors and missing exports in commandParser, dialogueEngine, introLogic, resetSystem
- TeletypeIntro properly plays audio and supports animated storytelling

### Improved
- Code modularity and readability across core logic files
- Game startup and intro flow logic
- Verified all assets and image references

MIT License © Geoff Webster, 2025
