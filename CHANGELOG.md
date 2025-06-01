# 🧾 Gorstan Game – CHANGELOG v2.8.0-audit
**Date:** 2025-06-01

## ✅ Modules Audited & Upgraded

### Major Enhancements:
- ✅ Introduced `GameContext` for global state (score, inventory, room)
- ✅ Rewired `GameEngine.jsx`, `AppCore.jsx`, `introLogic.js` to use context
- ✅ Upgraded status logic in `StatusPanel.jsx`, `RoomRenderer.jsx`
- ✅ Movement fully rewired with tooltips in `MovementPanel.jsx`
- ✅ Trap logic added and integrated across `trapSystem.js`, Ayla, and RoomRenderer
- ✅ `InstructionsScreen.jsx` now includes ARIA labels, test hooks, and a debug version banner

### New Features:
- ⚠ Trap shimmer alerts with logic for disarmament and contextual Ayla help
- 📦 Room helper functions (`getRoomById`, `isTrap`, `getExits`)
- 🧠 NameCapture refactored to `PlayerNameCapture.jsx` with Enter key support

## 🧪 Known Issues
- None identified during final audit

