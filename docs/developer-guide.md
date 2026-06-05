# Gorstan Developer Guide

This guide documents the current Gorstan codebase structure and the call tree needed to continue the hybrid parser / point-and-click rebuild.

It is not intended to describe every generated room file line-by-line. That would rot quickly. Instead, it identifies the files that define the application flow, state pipeline, room registry, command parser, clickable-room layer, item registry, sprite metadata, and visual documentation.

## 1. Current architecture summary

Gorstan is currently a React + TypeScript game with a parser-driven core and an emerging clickable-room presentation layer.

The important principle is:

```text
React renders the game.
The state reducer owns state changes.
The command parser interprets commands.
Clickable rooms dispatch parser-equivalent commands.
Room files define room data.
Item files define object data.
Visual docs define the art and animation target.
```

The clickable/visual rebuild should preserve this boundary. The click UI should not become a second game engine.

## 2. Primary runtime tree

Current high-level call tree:

```text
src/App.tsx
└─ <GameStateProvider>
   └─ <CelebrationController>
      └─ <AppCore />
         ├─ loads room map via getAllRoomsAsObject()
         │  └─ src/utils/roomLoader.ts
         │     └─ src/rooms/roomRegistry.ts
         │        └─ src/rooms/*Zone_*.ts room definition files
         ├─ renders game-stage UI
         ├─ lazy-loads RoomRenderer
         │  └─ src/components/RoomRenderer.tsx
         │     ├─ reads current room from state.roomMap[state.currentRoomId]
         │     ├─ renders room image via SmartImage / SmartVideo
         │     ├─ extracts room.clickHotspots or room.hotspots
         │     └─ renders ClickableRoomOverlay
         │        └─ src/components/ClickableRoomOverlay.tsx
         │           ├─ filters visible/enabled hotspots using menu helpers
         │           ├─ shows action menu for non-exit hotspots
         │           └─ dispatches command string to RoomRenderer
         └─ dispatches COMMAND_INPUT to gameState reducer
            └─ src/state/gameState.tsx
               └─ processCommand()
                  └─ src/engine/commandParser.ts
```

Command flow:

```text
Player types command
OR
Player clicks hotspot
    ↓
COMMAND_INPUT action
    ↓
gameStateReducer
    ↓
processCommand({ input, currentRoom, gameState })
    ↓
CommandResult { messages, updates }
    ↓
state/history/room updates
    ↓
React rerender
```

## 3. Key files and what they do

### `src/App.tsx`

Top-level app wrapper.

Responsibilities:

```text
- Imports AppCore
- Wraps the app in GameStateProvider
- Wraps AppCore in CelebrationController
```

Notes:

```text
This should remain very small. Do not put game logic here.
```

### `src/components/AppCore.tsx`

Main UI and orchestration component.

Responsibilities:

```text
- Owns a large part of the UI routing by game stage
- Lazy-loads major UI panels and transition components
- Connects to game state via useGameState()
- Loads room data via getAllRoomsAsObject()
- Integrates achievements, score, miniquests, NPC systems, demo mode, AI helpers and transitions
- Dispatches state actions through the central reducer
```

Red-team notes:

```text
- AppCore is already very large and acts as a god component.
- Further visual-room work should avoid adding more room-rendering logic here.
- Keep new visual-room layers inside RoomRenderer or dedicated visual components.
```

Recommended future split:

```text
AppCore
├─ GameStageRouter
├─ CommandController
├─ ModalController
├─ RoomShell
└─ SystemOverlayController
```

### `src/state/gameState.tsx`

Central state context, initial state, reducer, and command dispatch pipeline.

Responsibilities:

```text
- Defines initial game state
- Holds player inventory, room ID, room map, flags, history/messages, settings and metadata
- Handles inventory actions
- Handles room movement actions
- Handles COMMAND_INPUT by calling processCommand()
- Applies CommandResult messages and updates
```

Important state fields:

```text
state.currentRoomId
state.roomMap
state.player.inventory
state.player.flags
state.flags
state.history
state.messages
state.settings.debugMode
```

Red-team notes:

```text
- Inventory appears in both state.player.inventory and root state.inventory. This should be rationalised later.
- Visual item/sprite logic should read from a single canonical inventory source once cleaned up.
- COMMAND_INPUT is the right bridge for clickable rooms.
```

### `src/engine/commandParser.ts`

Parser and command interpreter.

Responsibilities:

```text
- Normalises aliases such as take/get/grab -> pick up
- Handles movement commands
- Handles look/inventory/use/help/speak/status/search/disarm
- Delegates crossing-specific commands to crossingController
- Returns messages and partial state updates
```

Important command path:

```text
processCommand({ input, currentRoom, gameState })
```

Red-team notes:

```text
- Clickable hotspots should always send commands this parser understands.
- Some hotspot defaults currently use inspect, while commandParser aliases examine/look/read to inspect but does not currently have a visible inspect case in the fetched portion. This needs verification/fix.
- Portable object menu defaults use pick up, but parser needs robust pick-up/take/drop handling for room items and inventory state.
```

### `src/utils/roomLoader.ts`

Room registry loader and normaliser.

Responsibilities:

```text
- Imports roomRegistry
- Validates room entries
- Builds an in-memory roomMap
- Exports loadRoomById()
- Exports validateRooms()
- Exports getAllRoomsAsObject()
```

Important flow:

```text
roomRegistry -> roomMap -> getAllRoomsAsObject() -> AppCore/state.roomMap
```

Red-team notes:

```text
- validateRoomSchema currently requires id/title/description/image.
- Future room scene data such as clickHotspots, item placements, sprites and effects should be tolerated by the Room type and passed through without being stripped.
```

### `src/rooms/roomRegistry.ts`

Canonical room registry.

Responsibilities:

```text
- Imports all room definition files
- Exports a single roomRegistry object
- The loader uses this as the source of room data
```

Current pattern:

```text
import controlnexus from './introZone_controlnexus';
...
const roomRegistry = { controlnexus, controlroom, ... };
export default roomRegistry;
```

Red-team notes:

```text
- There are many .bak2 room files in the repo. The registry imports the active .ts files only.
- Avoid editing .bak2 files unless intentionally cleaning repository history.
- New visual fields belong in active room files, not in the room bible alone.
```

### `src/rooms/*Zone_*.ts`

Individual room definitions.

Responsibilities:

```text
- Define room id, title, description, image, exits, items, NPCs and optional custom room properties
- Should eventually define clickHotspots, item placements and effects for each room
```

Desired future shape:

```ts
export default {
  id: 'londonZone_findlaterscornercoffeeshop',
  title: "Findlater's Corner Coffee Shop",
  description: '...',
  image: 'findlaters-corner.webp',
  exits: { north: '...', south: '...' },
  items: ['coffee', 'greasynapkin'],
  clickHotspots: [...],
  itemPlacements: [...],
  effects: [...],
};
```

### `src/components/RoomRenderer.tsx`

Current room visual renderer.

Responsibilities:

```text
- Looks up current room from state.roomMap[state.currentRoomId]
- Writes room entry descriptions to history when entering a new room
- Renders room image using SmartImage or SmartVideo
- Treats .gif room images as SmartVideo
- Renders ClickableRoomOverlay over the image
- Shows hotspot debug labels when debug mode or showClickableHotspots flag is set
```

Current visual stack:

```text
room image
+ clickable hotspot overlay
+ micro-objectives overlay
```

Needed future visual stack:

```text
room image
+ item sprite layer
+ room effects layer
+ clickable hotspot overlay
+ action menu
+ micro-objectives overlay
```

Red-team notes:

```text
- This is the correct place to add SpriteLayer and RoomEffectsLayer.
- Do not implement item behaviour in RoomRenderer. It should render state, not decide game logic.
```

### `src/components/ClickableRoomOverlay.tsx`

Clickable-room overlay component.

Responsibilities:

```text
- Receives hotspot definitions
- Filters visible hotspots
- Draws rect or polygon button overlays
- Auto-runs exit hotspots
- Shows context menu for object interactions
- Dispatches selected command string to onCommand()
```

Important behaviour:

```text
exit hotspot -> auto command
object hotspot -> action menu
right click/context menu -> inspect target
```

Red-team notes:

```text
- Good foundation for hybrid point-and-click.
- Needs touch-friendly menu polish later.
- Needs reduced-motion/hover affordance support through CSS, not parser logic.
```

### `src/ui/clickableRooms/types.ts`

Shared types for clickable hotspots.

Responsibilities:

```text
- Defines HotspotKind
- Defines HotspotShape
- Defines HotspotCommand
- Defines ClickableHotspot
- Defines RoomWithClickableHotspots
```

Important concepts:

```text
kind: exit | door | portableObject | inventoryObject | fixedObject | readable | machine | button | switch | lever | container | character | scenery
shape: rect | polygon
coords: percentage-based room coordinates
visibleFlag / hiddenFlag / requiredInventoryItem gates
```

Red-team notes:

```text
- This type system is suitable for room bible -> code conversion.
- Future effect/sprite types should live beside this or in a visualRooms folder.
```

### `src/ui/clickableRooms/menu.ts`

Menu/default-command logic for clickable hotspots.

Responsibilities:

```text
- Checks hotspot visibility
- Checks command visibility
- Checks inventory/flags gates
- Provides default commands for hotspot kinds
- Sorts commands by priority
```

Important defaults:

```text
exit -> go target
door -> open/go/examine/knock
portableObject -> take/examine/use
inventoryObject -> examine/use/use with/drop
readable -> read/examine/search
machine -> use/examine/read display/press controls
character -> talk/ask/show/give/examine
```

Red-team notes:

```text
- This is the right abstraction for click action menus.
- The command strings must stay aligned with commandParser supported verbs.
- Current defaults prefer inspect; parser support for inspect should be verified and strengthened.
```

### `src/engine/items.ts`

Canonical item/object registry.

Responsibilities:

```text
- Defines Item interface
- Defines item categories, rarity, effects, requirements and transformations
- Exports ITEMS array
- Provides the canonical definition of what an object is and does
```

Red-team notes:

```text
- This should remain the source of truth for object identity and gameplay meaning.
- It should eventually include the Schrödinger coin as a canonical item, not only as presentation metadata.
- Do not duplicate item definitions elsewhere if avoidable.
```

### `src/engine/itemPresentation.ts`

Presentation metadata for item sprites and inventory icons.

Responsibilities:

```text
- Imports canonical ITEMS
- Defines ItemPresentation
- Maps item IDs to sprite paths, inventory icons, click actions, droppable flags and default drop positions
- Exports getItemPresentation(), getPresentedItem(), getPresentedItems(), listObjectCatalogue()
```

Important current entries:

```text
goldcoin
quantumcoin
schrodinger_coin
coffee
greasynapkin
dominic
```

Red-team notes:

```text
- Good separation: items.ts says what object is; itemPresentation.ts says how it appears.
- schrodinger_coin exists here but not yet in ITEMS. That must be fixed before it can function as a normal object.
- DEFAULT_ITEM_ACTIONS currently contain {item} placeholders; renderer/menu integration must replace placeholders before sending commands.
```

### `docs/clickable-room-bible.md`

Visual and interaction bible for rooms.

Responsibilities:

```text
- Lists each registered room
- Gives image descriptions
- Defines clickable hotspot intent
- Should also list ambient effects per room
```

Use:

```text
Design/art source for room backgrounds and hotspot planning.
```

### `docs/sprite-strategy.md`

Sprite production strategy.

Responsibilities:

```text
- Defines movable item sprite rules
- Defines sprite sizes
- Gives per-object sprite briefs
- Defines fallback placeholder policy
```

Use:

```text
Art source for movable object images and inventory icons.
```

### `docs/effects-bible.md`

Reusable room-effects catalogue.

Responsibilities:

```text
- Defines reusable animated effects
- Defines recommended RoomEffect shape
- Defines reduced-motion rules
- Defines implementation patterns and performance limits
```

Use:

```text
Technical/art source for ambient animation overlays.
```

### `docs/room-effects-addendum.md`

Temporary integration addendum.

Responsibilities:

```text
- Maps priority rooms to effects
- Intended to be merged into clickable-room-bible.md
```

Red-team note:

```text
Once clickable-room-bible.md is fully merged with effects, this file can either remain as a concise checklist or be deleted to avoid duplication.
```

## 4. Visual-room implementation target

Target future runtime tree:

```text
RoomRenderer
├─ BackgroundLayer
│  ├─ SmartImage
│  └─ SmartVideo for animated/full-room test assets
├─ ItemSpriteLayer
│  ├─ reads room.items / itemPlacements
│  ├─ calls getPresentedItem(itemId)
│  ├─ draws sprite if item is in current room
│  └─ hides sprite if item has been picked up
├─ RoomEffectsLayer
│  ├─ reads room.effects
│  ├─ renders CSS/image/SVG/spriteSheet/canvas effects
│  └─ respects reduced motion
├─ ClickableRoomOverlay
│  ├─ reads room.clickHotspots
│  └─ dispatches parser commands
└─ MicroObjectives
```

The correct renderer order is:

```text
1. Background image/video
2. Item sprites
3. Ambient effects
4. Hotspots/action menu
5. UI overlays
```

## 5. State and data model target

Desired room visual fields:

```ts
interface VisualRoomFields {
  clickHotspots?: ClickableHotspot[];
  itemPlacements?: RoomItemPlacement[];
  effects?: RoomEffect[];
}
```

Desired item placement shape:

```ts
interface RoomItemPlacement {
  itemId: string;
  x: number;       // 0-1 or percent, choose one convention and document it
  y: number;
  width?: number;
  height?: number;
  visibleFlag?: string;
  hiddenFlag?: string;
}
```

Desired effect shape should follow `docs/effects-bible.md`:

```ts
interface RoomEffect {
  id: string;
  type: 'css' | 'image' | 'spriteSheet' | 'svg' | 'canvas';
  preset?: string;
  src?: string;
  className?: string;
  x: number;
  y: number;
  width: number;
  height?: number;
  visibleWhen?: string;
  reducedMotionFallback?: 'hide' | 'static' | 'steady';
  pointerEvents?: 'none' | 'auto';
}
```

## 6. Current gaps and fixes to prioritise

### High priority

```text
1. Confirm / add inspect command support in commandParser.
2. Add robust pick up / drop command support for room items and inventory.
3. Add schrodinger_coin to src/engine/items.ts.
4. Add ItemSpriteLayer to RoomRenderer.
5. Add RoomEffectsLayer to RoomRenderer.
6. Define shared types for RoomEffect and RoomItemPlacement.
7. Replace {item} placeholders in itemPresentation clickActions before dispatch.
```

### Medium priority

```text
1. Rationalise state.player.inventory and root state.inventory.
2. Convert first room, probably Findlater's Corner Coffee Shop or Control Nexus, to use clickHotspots + itemPlacements + effects.
3. Add fallback placeholder item icon.
4. Add reduced-motion CSS for effect classes.
5. Add dev/debug toggle for visible hotspot boxes and sprite bounding boxes.
```

### Lower priority

```text
1. Clean .bak2 files or move them to an archive branch/directory.
2. Split AppCore into smaller controllers.
3. Generate documentation automatically from room/item registries.
4. Add tests for hotspot command generation.
```

## 7. Red-team findings

### What is already sound

```text
- Click-to-parser concept is implemented in the right direction.
- RoomRenderer already overlays clickable hotspots over room images.
- Hotspots are data-driven and support rect/polygon shapes.
- The item presentation split is architecturally correct.
- The room, sprite and effect bibles now provide a workable production plan.
```

### What is fragile

```text
- AppCore is too large and should not absorb more responsibilities.
- Parser support and hotspot default command strings may not be fully aligned.
- Visual sprites/effects are not yet rendered at runtime.
- Item movement/drop behaviour is not yet rich enough for the planned sprite system.
- schrodinger_coin is documented/presentational but not canonical gameplay data yet.
```

### What to avoid

```text
- Do not create a second click-only logic engine.
- Do not bake movable items into room backgrounds.
- Do not make every room a full animated GIF/video.
- Do not duplicate item definitions across multiple files.
- Do not keep expanding AppCore for every new visual feature.
```

## 8. Working rules for future development

When adding a clickable visual room:

```text
1. Update the room file in src/rooms/.
2. Add clickHotspots using parser-equivalent commands.
3. Add item IDs to room.items if the item is physically present.
4. Add itemPlacements for visible movable items.
5. Add sprite metadata to itemPresentation.ts only if needed.
6. Add or reuse room effects from effects-bible.md.
7. Test commands through both typing and clicking.
```

When adding an item:

```text
1. Add canonical item to src/engine/items.ts.
2. Add presentation metadata to src/engine/itemPresentation.ts if visually displayed.
3. Add sprite/icon assets under /public/sprites/.
4. Add room placement only in the relevant room files.
5. Verify take/use/drop/parser behaviour.
```

When adding an effect:

```text
1. Define/reuse effect preset from docs/effects-bible.md.
2. Add asset/CSS if needed.
3. Add room.effects entry.
4. Ensure pointerEvents defaults to none.
5. Ensure reduced motion fallback.
```

## 9. Suggested next implementation branch

Recommended next branch/task:

```text
feature/visual-room-layers
```

Scope:

```text
- Add RoomEffect and RoomItemPlacement types
- Add ItemSpriteLayer
- Add RoomEffectsLayer
- Wire these into RoomRenderer
- Add schrodinger_coin to canonical ITEMS
- Convert one room as a vertical slice
```

Best first vertical slice:

```text
Findlater's Corner Coffee Shop
```

Rationale:

```text
- Coffee and steam prove item sprite + effect layer.
- Coffee machine proves fixed hotspot.
- Forgotten notebook/napkin proves portable object interaction.
- Door exits prove click-to-travel.
- It is visually readable and not too weird to debug.
```

Alternative vertical slice:

```text
The Control Nexus
```

Rationale:

```text
- Excellent for screen effects and console hotspots.
- Less dependent on item/drop behaviour.
- Good for proving ambient effects first.
```

## 10. Documentation maintenance rule

This guide should be updated when any of these change:

```text
- command pipeline
- room data shape
- item/inventory model
- visual room renderer layers
- hotspot command defaults
- sprite/effect metadata model
```

Do not update it for every single room text tweak. That way lies paperwork, and paperwork is how the Glitchrealm wins.
