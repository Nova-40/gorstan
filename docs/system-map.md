# Gorstan System Map

This document maps the major modules, routes, assets, NPCs, puzzles, transitions, and save/reset flows.

## Core entry points
- `index.html` — Vite entry point
- `src/main.tsx` — React bootstrap
- `src/App.tsx` — top-level app wrapper and provider composition
- `src/components/AppCore.modular.tsx` — canonical runtime coordinator
- `src/components/appcore/` — modular stage router, game shell, overlays, and controller hooks

## Core managers
- `src/state` — React context and reducers (game state, persistence)
- `src/engine` — core game logic (room engine, puzzle engine, miniquest engine, NPC controllers)
- `src/services` — external integrations (AI adaptors, performance, device profiling)
- `src/components` — UI components (console, HUD, teleport overlays)

## NPCs
- NPC archetypes and controllers in `src/npc/` and `src/npcs/`.
- Dialogue adapters in `src/utils/aiAdapter.ts` and will be consolidated into `src/core/npcs/DialogueEngine.ts`.

## NPC Dialogue System & Lore Validation

- `src/core/npcs/DialogueEngine.ts` — central engine coordinating providers and the `LoreGate` validator.
- `src/core/npcs/providers/LLMProvider.ts` — thin adapter that respects `GORSTAN_AI_*` env vars and falls back when offline.
- `src/core/npcs/providers/OfflineTreeProvider.ts` — deterministic, offline responses suitable for tests and low-privilege runs.
- `src/core/npcs/LoreGate.ts` — validates candidate replies against `lore/index.json` fragments and vetoes contradictions.
- `src/core/hooks/useNPCDialogue.ts` — React hook to prompt NPC dialogue from components (used by `AylaPanel.tsx` demo).

Notes:
- The LoreGate uses a conservative heuristic to avoid introducing non-canonical statements. Providers must be mocked in tests.
- Telemetry and network access are disabled by default unless `GORSTAN_AI_PROVIDER=openai` and `GORSTAN_AI_API_KEY` are present.

## Zones
- Zones live under `src/rooms` or `src/zones` (controlnexus, glitchrealm, elfhame, mazezone, stantonharcourt)
- Each zone contains: room definitions, assets (images/audio), puzzles and miniquests.

## Teleport & Save
- Teleport overlays and managers will live under `src/core/teleport` (Fractal/Trek overlays)
- Save flow: `SaveManager` in `src/state` (persist -> compress -> localStorage)

## Puzzles & Miniquests
- `src/engine/puzzleEngine.ts` — validation and rewards
- `src/engine/miniquestEngine.ts` — miniquest registry and logic

## Asset locations
- `public/images`, `public/audio`, `src/assets` for code-imported resources.

## Tests
- Unit tests: `__tests__` and `tests/unit`
- E2E tests: `tests/e2e` (Playwright)

## Notes & Immediate Action Items
- There are many `as any` usages across `src/engine` and `src/services`. Prioritized cleanup started in `miniquestController`, `puzzleController`, and `puzzleEngine`.
- AI: `src/services/groqAI.ts` exists and will be consolidated into a provider pattern with an Offline fallback.
- Teleport overlays and some core managers referenced in the rehab brief may need to be scaffolded.

