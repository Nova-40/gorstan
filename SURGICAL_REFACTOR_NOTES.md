# Gorstan V2 — Surgical Refactor (Cohesion Pass)

This pass makes the game more cohesive without changing core logic or content.

## Changes

1. **Unified teleport path**
   - `src/engine/roomRouter.ts` — `teleportToRoom(roomId)` now calls the **singleton** `teleportManager.go(roomId)` (overlay + SFX), then dispatches `MOVE_TO_ROOM` via a global dispatch bridge.
   - `navigateToRoom(...)` now delegates to `teleportToRoom(...)` to prevent bypassing the FX.
   - Adds `src/utils/dispatchAccess.ts` providing `setGameDispatch()` and `getGameDispatch()`.

2. **Canonical console**
   - `src/components/AppCore.tsx` now uses **`components/game/ConsoleTerminal`** (teletype + a11y) instead of the older `TerminalConsole` component.

3. **Objectives panel**
   - New `src/components/ObjectivePanel.tsx` shows a lightweight objectives list (derives from flags for now).
   - Wired into the right‑hand column above `PresentNPCsPanel`.

4. **Dispatch wiring**
   - `src/components/AppCore.tsx` exposes the reducer dispatch through `setGameDispatch()` so service modules (like the teleport manager) can change rooms cleanly.

5. **Rooms JSON (reference)**
   - Added `src/data/rooms.json` and `src/utils/roomsJsonLoader.ts` as a **reference** for a future fully data‑driven room registry. Not wired yet (non‑breaking).

## Why this helps cohesion

- All movement now **feels the same** (overlay + SFX + arrival message) and updates state through **one path** (`MOVE_TO_ROOM`).
- There is **one console** used in the main shell with a consistent experience.
- Objectives surface progress every few minutes, increasing stickiness without grinding.
- The dispatch bridge avoids prop‑drilling and stops ad‑hoc navigation.

## Follow‑ups (low risk)
- Convert any stray room changes to call `teleportToRoom()` instead of manual state mutations.
- Expand Objectives: drive from a small JSON or derive from existing quest/flag systems.
- Hook `roomsJsonLoader` into `roomLoader` once content parity is verified.
- Integrate Ayla streaming hook in the sidebar (keeps context tight: room, flags, inventory).

--
_This patch only edits:_
- `src/engine/roomRouter.ts`
- `src/components/AppCore.tsx`
- `src/utils/dispatchAccess.ts` (new)
- `src/components/ObjectivePanel.tsx` (new)
- `src/data/rooms.json` (new, reference)
- `src/utils/roomsJsonLoader.ts` (new, reference)



## New in this pass
- Added **/api/ayla** stub: serverless function under `api/ayla/index.ts`. Currently echoes back prompt+context, ready to be wired to OpenRouter/Groq API.
- Expanded objectives: now includes discovery and use of the Schrödinger Coin, pacing the early game with 3 micro-goals.
