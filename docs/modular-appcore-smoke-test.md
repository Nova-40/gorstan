# Modular AppCore Runtime Smoke Test

The modular AppCore is now the default coordinator. The legacy AppCore remains available as a runtime fallback.

This checklist is deliberately manual because Vercel success proves the build, not the play loop.

## Current green checkpoint

Latest confirmed green runtime hardening commit before this checklist update:

```text
d47c3aab42b9e047dbd44681272660bacaa1d42c
```

Vercel status: success.

Confirmed green repairs in this pass:

```text
017194b5504e75acc300856a1540d51202d50242  Guard global shortcuts while typing
1340baf419cf00cec474ed8e379c7bd5a719f88f  Use extracted parser-backed item chooser
c664b5d4a2d9280581995fe827a7175afa56c696  Support object-specific inspect commands
39d83f6bff04ad5893268656ca1d7e58014e599b  Add dev AppCore mode switcher
d47c3aab42b9e047dbd44681272660bacaa1d42c  Harden modular save load restore path
```

## Runtime mode switch

Default mode:

```text
?appcore=modular
```

Fallback mode:

```text
?appcore=legacy
```

The selected mode is stored in local storage as:

```text
gorstan.appcore
```

In dev mode there is also a bottom-right AppCore mode switcher:

```text
AppCore: modular | modular | legacy | reset
```

Use `reset` to clear the stored preference and remove the query parameter.

## Full modular smoke test sequence

Run these checks in modular mode first.

### 1. Start-up and route flow

1. Open the deployed app with no `appcore` query parameter.
2. Confirm the dev badge says `AppCore: modular` in dev builds.
3. Confirm splash/welcome flow loads.
4. Start a new adventure.
5. Enter a player name.
6. Choose a normal route.
7. Confirm the intro transition completes into the game stage.
8. Confirm the room view renders and the command input is usable.

### 2. Parser baseline

Run these typed commands in the game input.

```text
look
inspect
```

Expected result:

- Both produce a room description.
- No `I don't understand that command` response.

### 3. Object inspection/read path

Use objects visible in the current room. Examples:

```text
inspect console
examine chair
read sign
```

Expected result:

- If the object is known in room items/environment/NPCs, output starts with an object heading.
- If no object matches, the parser says it cannot see anything obvious by that name.
- The game must not crash or silently do nothing.

### 4. Movement and room transition

1. Use a visible direction button or type a movement command.
2. Confirm the room changes.
3. Confirm history records the move/room description.
4. Confirm Backout works after at least two room moves.

### 5. Modal layer checks

Open and close each modular modal:

```text
Inventory
Use
Look Around
Pick Up
Save/Load
NPC console, where NPCs exist
Trap management, where traps exist
Pause menu via Escape
```

Expected result:

- No double dark overlay.
- Escape closes the expected layer only.
- Clicking buttons inside a modal does not trigger global shortcuts.
- Typing in command input or NPC chat does not trigger `t`, `Ctrl+S`, or `Ctrl+A` game shortcuts.

### 6. Parser-backed use item chooser

1. Put at least one item in inventory, or use an existing save with inventory.
2. Open `Use`.
3. Select an item.
4. Optionally select a target.
5. Submit.

Expected parser commands emitted:

```text
use <item>
use <item> with <target>
```

Expected result:

- The modal closes.
- Parser output appears in history.
- For `use <item> with <target>`, the parser must validate ownership of `<item>`, not the whole phrase.

### 7. Save/load runtime check

1. Move to a non-starting room.
2. Pick up or otherwise gain an item.
3. Set at least one visible flag through normal play if possible.
4. Save to a named slot.
5. Move elsewhere or change inventory/state.
6. Load the saved slot.

Expected result:

- Stage returns to `game`.
- Player name is restored.
- Saved room is restored.
- Saved room map is loaded before room movement.
- Saved flags are restored as far as current reducer support allows.
- Saved inventory items are present.
- A load confirmation message appears.

Known limitation:

- The reducer currently declares but does not implement an atomic `LOAD_GAME` case. Current modular loading is a safer partial restore, not a perfect whole-state restore.

### 8. NPC flow

Where NPCs are present:

1. Press `T` while not typing in an input.
2. Confirm either the single NPC console opens or the available NPC list is shown.
3. Type in NPC chat.
4. Confirm global keyboard shortcuts do not fire while typing.
5. Close the console cleanly.

### 9. Miniquest flow

Where a miniquest can be triggered:

1. Launch a miniquest through the expected command or guidance route.
2. Confirm `MiniQuestOverlay` appears.
3. Complete or close it.
4. Confirm result handling records progress/reward messaging.
5. Confirm returning to the game does not leave an input-blocking overlay behind.

### 10. Trap flow

Where a room has traps:

```text
search trap
disarm trap
```

Expected result:

- Search warns about traps where present.
- Disarm either succeeds/fails with clear output.
- Trap modal/quick action does not break the parser state.

### 11. Legacy fallback check

1. Click the dev switcher `legacy` button, or open:

```text
?appcore=legacy
```

2. Confirm the legacy coordinator loads.
3. Click `modular` or open:

```text
?appcore=modular
```

4. Confirm modular mode returns.
5. Click `reset` and reload.
6. Confirm modular remains the default.

## Required manual sign-off

Before more feature work, record pass/fail for:

```text
start-up route flow
basic parser
object inspect/read
movement/backout
modal layering
keyboard guard while typing
use item/use item with target
save/load
NPC console
miniquest overlay
trap flow
legacy fallback
```

## Known remaining repairs

1. Add reducer-level atomic `LOAD_GAME` support.
2. Switch modular save/load to dispatch one atomic restore once the reducer supports it.
3. Add item+target interaction routing beyond generic parser output.
4. Create a canonical visual room scene catalogue.
5. Build one clickable room vertical slice before scaling to all rooms.

## Rollback rule

If modular mode loads but a core interaction is broken, use `?appcore=legacy` immediately for player testing, then patch modular mode separately.

If modular mode fails before rendering, switch `src/App.tsx` back to the legacy AppCore import while fixing the modular branch.
