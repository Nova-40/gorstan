
# Rooms — JSON-first Registry

The game now loads rooms from `src/data/rooms.json` (canonical), with a safe fallback to the legacy TS loaders.
This gives us one editable source of truth for pacing, exits, and text.

## Schema (excerpt)
{
  "controlnexus": {
    "id": "controlnexus",
    "title": "Control Nexus",
    "zone": "nexus",
    "enterText": ["You are in the Control Nexus. The button looks suspiciously blue."],
    "exits": [{ "to": "glitchrealm", "label": "Teleport to Glitchrealm" }]
  }
}

## Tips
- Keep `id` kebab/flat-case, unique.
- Keep `enterText[0]` punchy; we display it on arrival.
- Each room should have at least one exit or one actionable button in the UI.


## Extended fields
- `teleportStyle`: override zone default ('fractal'|'trek')
- `unlocksLore`: string[] of lore IDs granted on arrival/action
- `objectiveHints`: string[] used by the nudger instead of hard-coded checks
- `ambient`: path to ambient audio (e.g. '/audio/amb/control_loop.ogg')
- `actions`: [{ id, label, effects[] }] where effects are mini op-codes like:
  - `flag:set:blue_button_pushed`
  - `item:add:schrodinger-coin:1`
  - `teleport:to:glitchrealm`
  - `lore:unlock:redacted-register`
  - `say:A soft hum fills the room.`
