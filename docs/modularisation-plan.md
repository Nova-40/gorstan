# Gorstan Modularisation Plan

This document records the red-team judgement on whether AppCore and related files need modularising as Gorstan moves into the hybrid illustrated room / point-and-click build.

## Verdict

Yes, modularisation makes sense, but it should be incremental.

Do not pause development for a grand architecture rewrite. The immediate win is to keep new visual-room work out of `AppCore` and inside dedicated presentation components.

## What has already been modularised

The optional visual layers now sit outside `RoomRenderer`:

```text
src/components/RoomRenderer.tsx
├─ Background image/video
├─ src/components/visual/ItemSpriteLayer.tsx
├─ src/components/visual/RoomEffectsLayer.tsx
├─ src/components/ClickableRoomOverlay.tsx
└─ MicroObjectives
```

Shared types live in:

```text
src/ui/visualRooms/types.ts
```

Shared visual-layer helpers live in:

```text
src/components/visual/visualLayerUtils.ts
```

This is the correct pattern: room rendering is extensible, but parser/game logic remains outside the visual layer.

## Defensive rendering rule

Rooms do not need to define sprites or effects.

These are safe and should not error:

```ts
itemPlacements: undefined
effects: undefined
itemPlacements: []
effects: []
```

The renderer should treat missing visual data as an empty layer.

## AppCore judgement

`src/components/AppCore.tsx` does need modularising, but not as the next urgent task.

Current issue:

```text
AppCore handles too many responsibilities:
- game stage routing
- modal state
- transitions
- room loading
- NPC wiring
- AI helpers
- demo mode
- save/load hooks
- performance dashboards
- command-adjacent behaviour
```

Risk:

```text
If we add visual-room, sprite, effects, inventory icon and action-menu logic here, AppCore becomes harder to reason about and more likely to break unrelated systems.
```

Decision:

```text
Do not add new room visual responsibilities to AppCore.
Use AppCore only to mount the room/game shell and dispatch actions.
```

Recommended future split:

```text
AppCore
├─ GameStageRouter
├─ RoomGameShell
├─ ModalController
├─ TransitionController
├─ SaveLoadController
├─ NPCControllerBridge
├─ AIOverlayController
└─ DebugOverlayController
```

But this should be done in stages after the visual-room layer is stable.

## RoomRenderer judgement

`RoomRenderer` is the right place to compose visual layers, but it should not own object logic.

Good responsibilities:

```text
- read current room
- render background
- render item sprite layer
- render ambient effects layer
- render clickable hotspot layer
- pass click commands to COMMAND_INPUT
```

Bad responsibilities:

```text
- deciding whether an item can be taken
- mutating inventory
- resolving puzzles
- handling drop logic
- inventing click-only commands
```

Those belong in parser/engine/state.

## Files that should remain data-focused

### `src/rooms/*Zone_*.ts`

Should define room data only:

```text
id
title
description
image
exits
items
npcs
clickHotspots
itemPlacements
effects
```

Room files may contain simple visibility flags, but puzzle consequences should stay in the engine.

### `src/engine/items.ts`

Should remain the canonical object registry:

```text
what the object is
what traits it has
whether it is portable/readable/usable
what gameplay effects it has
where it can spawn
```

### `src/engine/itemPresentation.ts`

Should remain presentation metadata:

```text
sprite path
inventory icon path
default sprite size
default drop position
click action labels
special visual/drop messages
```

This split is good. Keep it.

## Files that probably need modularising later

### 1. `src/components/AppCore.tsx`

Priority: High, but not before the sprite/effects layer works.

Reason:

```text
It is the main god component.
```

Suggested first extraction:

```text
src/components/core/GameStageRouter.tsx
src/components/core/ModalController.tsx
src/components/core/TransitionController.tsx
```

### 2. `src/state/gameState.tsx`

Priority: Medium.

Reason:

```text
Reducer handles many unrelated domains.
```

Suggested future extraction:

```text
src/state/reducers/inventoryReducer.ts
src/state/reducers/roomReducer.ts
src/state/reducers/commandReducer.ts
src/state/reducers/settingsReducer.ts
```

Do this only after tests or a stable manual smoke path exist.

### 3. `src/engine/commandParser.ts`

Priority: Medium/High.

Reason:

```text
Click actions depend heavily on parser command coverage.
```

Suggested split:

```text
src/engine/commands/movementCommands.ts
src/engine/commands/itemCommands.ts
src/engine/commands/lookCommands.ts
src/engine/commands/npcCommands.ts
src/engine/commands/debugCommands.ts
```

Immediate parser fixes should come before deep modularisation:

```text
- verify inspect command support
- robust pick up/take handling
- robust drop handling
- use/use-with item handling
```

### 4. `src/rooms/roomRegistry.ts`

Priority: Low/Medium.

Reason:

```text
It imports many room files manually.
```

Possible future improvement:

```text
generated room registry or zone-level registries
```

Do not touch until room data stabilises.

## New visual-layer files

### `src/ui/visualRooms/types.ts`

Defines:

```text
RoomItemPlacement
RoomEffect
VisibilityGate
CoordinateUnit
ReducedMotionFallback
```

Purpose:

```text
Shared room visual data contracts.
```

### `src/components/visual/visualLayerUtils.ts`

Defines:

```text
hasInventoryItem
hasFlag
isVisibleByGate
isItemInCurrentRoom
positionToCssValue
```

Purpose:

```text
Shared safe helpers for sprite/effects layers.
```

### `src/components/visual/ItemSpriteLayer.tsx`

Purpose:

```text
Render optional item sprites in a room.
```

Defensive behaviour:

```text
- no placements => render null
- item not in room => render null
- item in inventory => render null
- no sprite metadata => render null unless debug mode is on
```

### `src/components/visual/RoomEffectsLayer.tsx`

Purpose:

```text
Render optional ambient visual effects.
```

Defensive behaviour:

```text
- no effects => render null
- hidden effect => render null
- unknown CSS preset => harmless div/img/svg
- canvas effects are placeholders for now
```

## Recommended next steps

### Immediate next build step

Add one real room vertical slice with:

```text
clickHotspots
itemPlacements
effects
```

Best candidate:

```text
Findlater's Corner Coffee Shop
```

Why:

```text
- coffee sprite proves item layer
- coffee steam proves effects layer
- coffee machine proves fixed hotspot
- exits prove click-to-travel
- notebook/napkin proves portable object model
```

### Then fix parser alignment

Before many rooms are converted, ensure the parser supports the commands generated by hotspots:

```text
inspect [thing]
pick up [thing]
drop [thing]
use [thing]
read [thing]
open [thing]
search [thing]
talk to [character]
```

## Final recommendation

The correct order is:

```text
1. Add optional visual layers. Done.
2. Add one vertical slice room.
3. Fix parser/item command coverage.
4. Add canonical Schrödinger coin.
5. Add more sprite metadata.
6. Only then begin AppCore modularisation.
```

This avoids a risky rewrite and keeps the rebuild moving.
