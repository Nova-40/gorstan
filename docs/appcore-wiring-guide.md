# AppCore Modular Architecture Guide

This guide records the completed AppCore modular runtime and preserves the migration order as historical reference.

## Canonical runtime

```text
main.tsx
-> App.tsx
-> GameStateProvider
-> CelebrationController
-> AppCore.modular.tsx
```

## Principle

AppCore.modular should coordinate only. Hooks own controller state and effects. Components own rendering. The reducer and parser remain canonical.

## Modular target

The modular layer now lives in:

```text
src/components/appcore/
```

Main exports:

- `GameStageRouter`
- `GameShell`
- `AppCoreOverlays`
- `useResolvedNPCs`
- `useRoomDirections`
- `useAppCoreNavigationHistory`
- `useAppCoreMiniQuests`
- `useAppCoreModalState`
- `useAppCoreNPCConsole`
- `useAppCoreLookAround`
- `useAppCoreSystemControls`
- `useAppCoreTransitions`
- `useAppCoreSaveLoad`
- `useAppCoreInventoryActions`
- `useAppCoreAI`
- `useAppCoreDemo`
- `useAppCoreKeyboard`
- `useRoomWorldInitialisation`
- `useAppCoreRoomLifecycle`
- `useAppCoreCommandHandler`

This barrel remains the canonical import surface for the modular controller layer.

## Current modular structure

```text
src/components/AppCore.modular.tsx
├─ GameStageRouter
├─ GameShell
├─ AppCoreOverlays
└─ appcore hooks/controllers
```

## Historical migration order

The staged extraction completed in small commits using this order:

1. Replace inline AppCore type declarations with imports from `./appcore`.
2. Replace the local lazy component declarations with the lazy component registry.
3. Replace NPC resolution with `useResolvedNPCs`.
4. Replace direction memo blocks with `useRoomDirections`.
5. Replace room history/backout state with `useAppCoreNavigationHistory`.
6. Replace miniquest bridge logic with `useAppCoreMiniQuests`.
7. Replace fullscreen and sound state with `useAppCoreSystemControls`.
8. Replace look modal state and handler with `useAppCoreLookAround`.
9. Replace pickup handling with `useAppCoreInventoryActions`.
10. Replace save-slot state and handlers with `useAppCoreSaveLoad`.
11. Replace teleport and transition state with `useAppCoreTransitions`.
12. Replace NPC console state and handlers with `useAppCoreNPCConsole`.
13. Replace hint, guidance and AI monitor state with `useAppCoreAI`.
14. Replace demo state and effects with `useAppCoreDemo`.
15. Replace keyboard shortcut effect with `useAppCoreKeyboard`.
16. Replace room bootstrap with `useRoomWorldInitialisation`.
17. Replace room lifecycle effects with `useAppCoreRoomLifecycle`.
18. Replace stage rendering with `GameStageRouter`.
19. Replace the four-quadrant game JSX with `GameShell`.
20. Replace overlay JSX with `AppCoreOverlays`.

## Behaviour checks after migration

The migration was validated against these user journeys and they remain the architecture-sensitive checks to rerun after future AppCore changes:

- splash to welcome to name capture to route select
- normal game start
- demo start and demo skip
- same-zone movement
- cross-zone teleport movement
- Control Nexus sit transition
- backout button behaviour and messages
- `look`, `inventory`, `pick up`, `use item`, `talk to ayla`
- `miniquests` and `play <id>`
- miniquest close returns focus to command input
- Run Bag pickup capacity increase
- Dominic pickup special handling
- save, load and delete save
- forced group chat in Stanton zones
- Ayla hint and unified guidance popup behaviour
- debug, pause, performance dashboard and AI monitor shortcuts

## Important caution

The retired legacy AppCore mixed `ADD_MESSAGE` and `RECORD_MESSAGE`. The extracted hooks preserved the existing pattern where copied. Do not rationalise those action names during unrelated AppCore maintenance; do it later at reducer level.

## Hybrid game rule

Do not move game authority into the visual layer. Room clicks must continue to call parser-equivalent commands or existing canonical reducer actions.
