# Gorstan Room Image Bible — Former Canon-Pending Rooms Now Active

Status: Documentation-only resolved addendum for rooms Geoff confirmed as valid and important, and which have now been integrated or resolved in the active room set.

This addendum does not change gameplay logic, parser logic, room graph logic, SaveManager, startup flow, TypeScript config or image assets. It records the current visual and route intent after the local registry update and validation.

## Current reconciliation status

Latest local validation reported:

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

- The active room registry now contains 74 registered room imports.
- `artifactChamber.ts` is now treated as an active registered room.
- `spireCourtyard.ts` is now treated as an active registered room.
- `glitchZone_ravenchamber.ts` is now treated as the canonical active R.A.V.E.N. implementation.
- `glitchZone_ravenchamber_room.ts` remains deliberately unregistered as a duplicate/salvage source only.
- `Room.ts` and `RoomObjectives.ts` are helper/model files, not missing rooms.

## Locked design decisions

Geoff confirmed the following decisions:

1. `artifactChamber.ts` should be imported into `src/rooms/roomRegistry.ts`.
2. `spireCourtyard.ts` should be imported into `src/rooms/roomRegistry.ts`.
3. The two R.A.V.E.N. files should be consolidated into one canonical implementation.
4. `glitchZone_ravenchamber.ts` is the canonical implementation for the active R.A.V.E.N. room.
5. `glitchZone_ravenchamber_room.ts` should be retained only as a salvage source until any unique passphrase/declassification behaviour has been reviewed and deliberately migrated or discarded.
6. Future-facing room/file/image naming should use the `zone_room-name` pattern.
7. Do not mass-rename existing room ids in this documentation patch; that is a separate graph migration.
8. The late-game route is:

```text
glitchinguniverse -> ravenchamber -> artifactChamber -> spireCourtyard -> Stanton Harcourt final zone
```

9. Stanton Harcourt is the final zone. Spire Courtyard is a late-game/final-route terminus immediately before or feeding into the Stanton final-state sequence, not the final zone itself.

## Naming policy

Target naming convention for future room/image work:

```text
zone_room-name
```

Examples:

```text
intro_control-room
london_dales-apartment
glitch_raven-chamber
final_spire-courtyard
stanton_village-halt
```

Current implementation reality:

- Many active room ids remain non-zone-prefixed, such as `controlroom`, `dalesapartment`, `ravenchamber`, `artifactChamber` and `spireCourtyard`.
- Do not rename ids casually. Room id migration affects exits, saves, teleport destinations, puzzle logic, tests and walkthroughs.
- For image assets and visual documentation, prefer zone-style filenames and prompt labels while preserving active room ids until a controlled migration is planned.

## Active room entries

### artifactChamber — Artifact Chamber

- Source room file: `src/rooms/artifactChamber.ts`
- Current registration status: Active registered room after local registry update.
- Active room id: `artifactChamber`
- Zone: Late Glitch / artifact route. Future naming target: `glitch_artifact-chamber` or `final_artifact-chamber`, depending on final zone ownership.
- Current/proposed image: `glitch_artifact-chamber.png` or `final_artifact-chamber.png` once naming is resolved.
- Route role: Late-game artifact chamber; major puzzle/reward room; hard-route and final-route dependency.
- Canonical route role: Reached from the R.A.V.E.N. route / Glitchrealm route after the relevant archive or clearance condition.
- Surreal route role: Forbidden chamber reached through redacted archive logic, corrupted station-platform routing, or remote teleport once unlocked.
- Harder route role: Requires solving or dispelling the barrier before the artifact can be safely claimed.
- Zone transition / station role: Restricted platform or sealed archive siding beyond the Glitchrealm station-hub path.
- Puzzle lock: `artifactPuzzle`; magical barrier requires `dispelBarrierSpell` if active in source.
- Background image description: Hidden chamber filled with ancient rune architecture, a central glowing pedestal, fixed stone or corrupted-archive walls, and a barrier field surface that can be animated separately. It should feel like the room has waited too long and is mildly judging the player.
- Background must not include: people, NPCs, the quantum artifact as a baked static object if it can be collected/changed, fireball scroll as background decor, readable UI text.
- Fixed background features: chamber walls, floor runes, central pedestal base, barrier anchors, route threshold back toward the R.A.V.E.N. path.
- Sprite objects: `quantumArtifact`, `fireballScroll`.
- NPC/character sprites: none currently.
- Screen/overlay surfaces: magical barrier shimmer, pedestal glow, rune pulse.
- Hotspot candidates: `inspect runes`, `inspect pedestal`, `inspect barrier`, `dispel barrier`, `take quantum artifact`, `take fireball scroll`, `use artifact`, `go north`.
- Exit hotspots: route back toward `ravenchamber`/Glitch archive path, plus any active source exits.
- Optional effects layer: rune glow, barrier shimmer, pedestal pulse, low magical distortion.
- Prompt notes: Keep the artifact visually central but sprite-controlled. The background should imply power without hardcoding whether the artifact has already been taken.
- Red-team notes: Confirm exact exit id once the route graph is audited after registration.
- Status: Active registered room; ready for source cross-check before image generation.

### ravenchamber — R.A.V.E.N. Chamber canonical room

- Source room file: `src/rooms/glitchZone_ravenchamber.ts`
- Duplicate/salvage file: `src/rooms/glitchZone_ravenchamber_room.ts`
- Current registration status: Active registered room via canonical `glitchZone_ravenchamber.ts` implementation.
- Active room id: `ravenchamber`
- Zone: Glitch. Future naming target: `glitch_raven-chamber`.
- Current/proposed image: `glitch_raven-chamber.png` or existing canonical image reference until asset migration.
- Route role: Glitchrealm archive station, redacted archive node, gateway toward artifact/final route.
- Canonical route role: reached from `glitchinguniverse`, used to access archive/register logic, then route onward to `artifactChamber` and `spireCourtyard` when the route graph supports it.
- Surreal route role: corrupted platform/archive terminal where the station signage appears to know the player before the player has been formally introduced.
- Harder route role: security/clearance/passphrase route via redacted-player logic and archive access.
- Zone transition / station role: Glitchrealm Corrupted Platform / R.A.V.E.N. archive station. This is a station-hub-like room, but in the form of a classified AI archive chamber rather than a public transport platform.
- Puzzle lock: Archive access, redacted-player recognition, passphrase/confirmation flow, console activation and declassification logic depending on final source consolidation.
- Background image description: Narrow chamber humming with quiet static, cracked screens lining the walls, nonsense glyphs and frozen boot surfaces, a sunken blue pedestal at the far end, and an ancient AI console that can flare to life as an overlay. The room should feel classified, corrupted and administratively annoyed.
- Background must not include: people, Dominic, register entries as readable baked text, the player, final archive output, UI text, permanent redacted-list content.
- Fixed background features: chamber walls, cracked screen housings, blue pedestal body, console casing, wall rift/back route to `glitchinguniverse`, cable runs, archive architecture.
- Sprite objects: optional redacted register token/card if later implemented; otherwise none currently.
- NPC/character sprites: R.A.V.E.N. should be represented as console/screen/effect voice, not a baked humanoid. Dominic appears only in register content, not as a room background character.
- Screen/overlay surfaces: wall screens, R.A.V.E.N. console, blue pedestal glow, archive output surface, warning lights.
- Hotspot candidates: `inspect console`, `interact console`, `access archive`, `activate console`, `touch console`, `inspect screens`, `watch screens`, `inspect pedestal`, `touch pedestal`, `declassify`, `i know too much`, `go back`, `go out`.
- Exit hotspots: back/out to `glitchinguniverse`; future onward path to `artifactChamber` after route graph confirmation.
- Optional effects layer: glitch static, screen flicker, console boot flare, blue pedestal pulse, redacted warning light, archive text overlay.
- Prompt notes: Do not bake in long register text. Leave screens blank/corrupted enough to support dynamic archive overlays. Keep the console and pedestal visually dominant.
- Red-team notes: Salvage any unique passphrase/declassify logic from `glitchZone_ravenchamber_room.ts` before deletion or archival.
- Status: Active registered canonical room; duplicate file retained as salvage only.

### spireCourtyard — Spire Courtyard

- Source room file: `src/rooms/spireCourtyard.ts`
- Current registration status: Active registered room after local registry update.
- Active room id: `spireCourtyard`
- Zone: Final route / pre-Stanton terminus. Future naming target: `final_spire-courtyard`.
- Current/proposed image: `final_spire-courtyard.png`.
- Route role: Final-route courtyard and major confrontation arena before the Stanton Harcourt final-zone sequence.
- Canonical route role: Follows `artifactChamber` once the R.A.V.E.N./artifact/final-key chain has been resolved.
- Surreal route role: Last station beyond the archive path, where every route sign becomes suspiciously personal.
- Harder route role: Final challenge route requiring correct artifact/pendant/key state before the summoning-circle interaction resolves.
- Zone transition / station role: Final terminus beyond the Glitchrealm/Archive route; visually a ruined station forecourt at the base of the Spire rather than a conventional rail or subway station.
- Puzzle lock: `summoningCircle` requires `finalKey` and checks artifact/pendant readiness if active in source.
- Background image description: Vast open courtyard at the base of an impossible Spire, surrounded by ancient ruins and broken ceremonial architecture. The composition should give the player a clear central summoning-circle area, distant spire verticality, and a return threshold toward the archive route.
- Background must not include: people, The Entity as a baked figure, final summoned forms, readable endgame text, removable final objects.
- Fixed background features: ruined courtyard walls, Spire base, stone flagging, fixed summoning-circle markings, threshold back toward the archive route.
- Sprite objects: none currently, but final-key/artifact/pendant visual echoes may be overlay effects rather than background objects.
- NPC/character sprites: final entity/manifestation must be a separate sprite/effect if used; never baked into background.
- Screen/overlay surfaces: summoning circle, Spire light, reality distortion field.
- Hotspot candidates: `inspect spire`, `inspect ruins`, `inspect summoning circle`, `use final key`, `summon`, `inspect exit`, `go south`.
- Exit hotspots: route back toward `ravenchamber`/artifact route and onward toward Stanton Harcourt final-zone sequence once graph confirms.
- Optional effects layer: circle pulse, wind shimmer, spire glow, reality-pressure distortion.
- Prompt notes: Treat as a final-route room but avoid over-cluttering; the circle and spire must be readable at play size.
- Red-team notes: Stanton Harcourt remains the final zone. Spire Courtyard is a final-route terminus feeding into that final zone, not the final zone itself.
- Status: Active registered room; ready for source cross-check before image generation.

## Late-game route now recorded

The late-game route is now:

```text
glitchinguniverse -> ravenchamber -> artifactChamber -> spireCourtyard -> Stanton Harcourt final zone
```

The visual bible should therefore treat these rooms as a connected late-game chain:

1. `glitchinguniverse` — Glitch zone hub / corrupted platform.
2. `ravenchamber` — archive station and access gate.
3. `artifactChamber` — restricted artifact chamber / puzzle reward room.
4. `spireCourtyard` — final-route courtyard / confrontation terminus.
5. `stantonharcourt` and Stanton variants — final zone and resolution state-space.

## Image-generation readiness verdict

- `artifactChamber`: active and visually important; generate after exact exits/items are source-checked.
- `ravenchamber`: active and visually essential; use canonical `glitchZone_ravenchamber.ts`; salvage duplicate logic before deleting duplicate source file.
- `spireCourtyard`: active and visually important; generate after final-route/state dependencies are source-checked.
- `glitchZone_ravenchamber_room`: do not image separately as a different room unless deliberately split; treat as alternate implementation of `ravenchamber`.

No images generated. No gameplay code changed by this documentation file.