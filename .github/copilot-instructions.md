<!-- Generated guidance for AI coding agents. Keep concise and concrete. -->
# Gorstan — Copilot / AI agent instructions

Use this file to get quickly productive working in the Gorstan codebase. Focus on actionable, discoverable patterns only.

1) Big picture
- This is a client-side React + TypeScript single-page game built with Vite. Main entry: `src/main.tsx` / `index.html`. The runtime path is `src/main.tsx` -> `src/App.tsx` -> `GameStateProvider` -> `CelebrationController` -> `src/components/AppCore.modular.tsx`.
- Core domains: engine (game logic), rooms (content), state (game state/context), NPCs (controllers), UI components. Look under `src/engine`, `src/rooms` (or `src/rooms/*`), `src/state`, `src/npcs`, and `src/components`.

2) Developer workflows (most important commands)
- Local dev (fast): `npm run dev` — starts Vite dev server.
- Full build: `npm run build` (runs TypeScript build and Vite build). Production pipeline uses `npm run build:prod`.
- Typecheck: `npm run typecheck` or `npm run verify`.
- Tests: `npm run test` (Vitest), E2E with Playwright: `npm run e2e`.
- Lint: `npm run lint` and auto-fix with `npm run lint:fix` / `npm run format`.
- Smoke/preview: `npm run preview` or `npm run smoke` scripts in package.json.

3) Project-specific conventions
- Room files are dynamically imported via `src/roomRegistry.ts` and follow a naming convention like `zoneType_locationName.ts` (see `public/images` and `src/rooms` for examples). Treat them as content modules rather than plain components.
- State: uses React Context + useReducer; avoid introducing global singletons. Look for `src/state/*` for GameContext and reducers.
- Performance: prefer lazy-loading rooms/assets. Many modules expect resources to be loaded asynchronously and provide fallbacks (see `roomLoaderFallback` mentioned across README).
- NPCs: single-tick controller pattern. Controllers live under `src/hooks` or `src/npcs` and use timed intervals; don't replace with immediate synchronous logic.
- Flags and save system: state is compressed before saving. If you add new transient flags, ensure they are excluded from persistent snapshots unless intentionally persisted.

4) Integration points & external services
- Vercel is the intended hosting target; deployment scripts call `vercel`. Assets live under `public/`.
- The repo lists optional server-side integrations (e.g., Postgres dependency exists in package.json) but the playable client is client-only. If adding server code, keep it clearly separated from the client code under a new top-level folder.

5) Files to read first (quick ramp-up)
- `README.md` (root) — high-level architecture and game notes.
- `package.json` — scripts and important dependencies.
- `src/roomRegistry.ts` — how rooms are located and loaded.
- `src/state/GameContext.tsx` or `src/state` — game lifecycle and persistence.
- `src/hooks/useNPCController.ts` — NPC tick pattern and movement rules.
- `src/engine/*` and `src/logic/*` — core mechanics and command parser.

6) Editing and PR guidance for AI edits
- Keep changes small and focused: edit one domain per PR (engine, rooms, UI). Avoid mixing content edits (rooms) with engine changes.
- Run `npm run typecheck` and `npm run lint` locally; CI enforces typecheck + lint with zero warnings.
- When adding new rooms, ensure image/audio asset references are present in `public/images` / `public/audio` and follow filename patterns.

7) Examples (explicit patterns)
- Dynamic room import (pattern to follow):
  - room modules export a plain object: { id, title, description: string[], exits: {...}, items: [...], npcs: [...] }
  - Registered via `roomRegistry` and loaded with `await import('./rooms/zone_room.ts')`.
- NPC controller pattern: single interval timer that mutates state via dispatched actions (see `useNPCController.ts`). Use same action shapes and avoid direct state replacements.

8) Edge-cases AI should watch for
- Room load failures: fallback to the tiny fallback set; don't crash the app.
- Large state snapshots: the save system compresses history — avoid persisting long chat histories.
- Time-based logic: many systems assume monotonic real-time ticks; simulating or changing tick sizes can affect NPC behavior and traps.

9) What not to change without human review
- Anything under `src/state` persistence and save/load logic.
- Performance heuristics (memoization, manual chunks in `vite.config.*`, compression steps).
- License/EULA text in `EULA.md` and any asset license attributions.

10) If you're unsure — quick checks
- Is change touching save/load, persistence, or player flags? Ask a human.
- Does a new asset file exist in `public/`? If not, add it or update references.

-- End of guidance. Ask for more detail or to expand any section.
