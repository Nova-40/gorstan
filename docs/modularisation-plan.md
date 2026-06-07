# Gorstan Modularisation Status

This document records the completed AppCore modularisation outcome and the remaining architectural guidance for the hybrid illustrated room / point-and-click build.

## Outcome

AppCore modularisation is complete.

The canonical runtime now keeps new visual-room work out of the coordinator and inside dedicated presentation components.

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

## AppCore status

`src/components/AppCore.tsx` has been retired. The canonical runtime is `src/components/AppCore.modular.tsx`.

Current structure:

```text
main.tsx
-> App.tsx
-> GameStateProvider
-> CelebrationController
-> AppCore.modular.tsx
	├─ GameStageRouter
	├─ GameShell
	├─ AppCoreOverlays
	└─ appcore hooks/controllers
```

Runtime rule:

```text
Keep game authority in the reducer and parser.
Keep runtime orchestration in AppCore.modular and extracted hooks.
Keep visual-room presentation inside RoomRenderer and related view components.
```

Why this split stays canonical:

```text
The retired legacy AppCore concentrated too many responsibilities in one file.
The modular structure isolates stage routing, shell rendering, overlays and controller effects.
New work should extend those modular seams rather than reintroducing a god component.
```

Canonical modular structure:

```text
AppCore.modular
├─ GameStageRouter
├─ GameShell
├─ AppCoreOverlays
└─ appcore hooks/controllers
```

This migration is complete and should remain the baseline architecture.

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

## Historical note

The original plan targeted `src/components/AppCore.tsx` for staged extraction. That work is now complete, and legacy AppCore has been removed from the runtime and source tree.

Follow-up work should focus on keeping the modular surfaces small, not on reopening the retired AppCore path.

## Files that still need careful modular boundaries

### `src/state/gameState.tsx`

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
