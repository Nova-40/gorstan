# Gorstan Room Image Bible — Active 74-Room Status

Status: Documentation-only status note for the room image bible after local registry reconciliation and validation.

## Validation source

Geoff ran the local integration and validation on EAGLE after registering the previously canon-pending rooms.

Result summary:

```text
npm run typecheck: passed
npm run build: passed
Registered imports: 74
Unregistered files:
Room
RoomObjectives
glitchZone_ravenchamber_room
Unregistered files needing review after known helpers/duplicates:
None
```

Interpretation:

- The active registered room count is now 74.
- `Room.ts` and `RoomObjectives.ts` are helper/model files, not missing room files.
- `glitchZone_ravenchamber_room.ts` is a deliberate duplicate/salvage source for R.A.V.E.N. only.
- There are no unregistered room files currently needing review after the known helper/duplicate exclusions.

## Main bible update required

Where `ROOM_IMAGE_BIBLE.md` or related addenda refer to 68 or 71 active registered rooms, update the working interpretation to:

```text
The active room registry contains 74 registered room files according to the latest local reconciliation.
```

Any historical references to 68 should be treated as a partial/search-derived count. Any references to 71 should be treated as the pre-integration registered count before `artifactChamber`, `spireCourtyard`, and canonical `glitchZone_ravenchamber` integration.

## Active late-game route

The late-game route is now documented as:

```text
glitchinguniverse -> ravenchamber -> artifactChamber -> spireCourtyard -> Stanton Harcourt final zone
```

Route roles:

- `glitchinguniverse` — Glitch zone hub / corrupted platform.
- `ravenchamber` — R.A.V.E.N. archive station and late-game access gate.
- `artifactChamber` — artifact puzzle room and restricted reward chamber.
- `spireCourtyard` — final-route courtyard and confrontation terminus.
- `stantonharcourt` / Stanton variants — final zone and resolution state-space.

## Naming policy

Future-facing room/image naming should follow:

```text
zone_room-name
```

Examples:

```text
glitch_raven-chamber
glitch_artifact-chamber
final_spire-courtyard
stanton_harcourt
```

However, current active room ids should not be mass-renamed casually. Any full id migration must be a separate graph migration covering exits, saves, teleport destinations, puzzles, tests and walkthroughs.

## Image generation implication

The bible is now ready to treat 74 registered room files as the active population for planning.

Do not generate all 74 images in a single pass. Generate in controlled batches after source-checking exact exits, items, NPCs, sprites, puzzle locks, traps/hazards and remote teleport status for that batch.

Recommended next image batch remains:

```text
dalesapartment
controlroom
controlnexus
findlaterscornercoffeeshop
```

Recommended late-game source-check batch:

```text
glitchinguniverse
ravenchamber
artifactChamber
spireCourtyard
stantonharcourt
```

No images generated. No gameplay code changed by this documentation file.