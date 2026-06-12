# Gorstan Room Image Bible — Canon Pending Rooms

Status: Documentation-only addendum for rooms that are valid and important but are not currently imported by `src/rooms/roomRegistry.ts`.

This addendum does not change gameplay logic, parser logic, room graph logic, SaveManager, startup flow, TypeScript config or image assets. It records production-ready visual and route intent for rooms that Geoff has confirmed as canon-important.

## Purpose

The reconciliation pass found 71 registered room imports and four valid room candidates not currently imported by `src/rooms/roomRegistry.ts`:

- `src/rooms/artifactChamber.ts`
- `src/rooms/spireCourtyard.ts`
- `src/rooms/glitchZone_ravenchamber.ts`
- `src/rooms/glitchZone_ravenchamber_room.ts`

These are not to be treated as disposable orphans. They should be treated as canon-pending rooms requiring registry and duplicate-resolution review before all-room image generation is declared complete.

## Integration rules

- Do not generate final production images for these rooms until their active registry status is resolved.
- Do not delete these files during orphan cleanup.
- Fold their visual entries into `ROOM_IMAGE_BIBLE.md` when the main bible is next consolidated.
- If a room is intentionally restored to active play, ensure it is imported/registered through the canonical room registry used by the runtime.
- If two files define the same room id, choose one canonical implementation and archive or remove the duplicate only after content salvage.
- Hotspots must remain parser-first and call existing commands such as `inspect`, `use`, `take`, `dispel`, `summon`, `access archive`, `interact console`, `go north`, `go south`, `go back` or `go out`.

## Canon-pending room entries

### artifactChamber — Artifact Chamber

- Source room file: `src/rooms/artifactChamber.ts`
- Current registration status: Valid canon-pending room; not imported by `src/rooms/roomRegistry.ts` in the latest reconciliation output.
- Active room id: `artifactChamber`
- Zone: `glitchZone`
- Current/proposed image: `artifactChamber.png`
- Route role: Late-game artifact chamber; major puzzle/reward room; likely key hard-route or final-route dependency.
- Canonical route role: Reached from the R.A.V.E.N. route / Glitchrealm route after the relevant lock or clearance condition.
- Surreal route role: Can be teased as a forbidden chamber reached via redacted archive logic, corrupted station platform, or remote teleport once unlocked.
- Harder route role: Requires solving/dispelling the magical barrier before the artifact can be safely claimed.
- Zone transition / station role: Should sit beyond the Glitchrealm station-hub path as a restricted platform or sealed archive siding.
- Puzzle lock: `artifactPuzzle`; magical barrier requires `dispelBarrierSpell`.
- Background image description: Hidden chamber filled with ancient rune architecture, a central glowing pedestal, fixed stone or corrupted-archive walls, and a barrier field surface that can be animated separately. It should feel like the room has waited too long and is mildly judging the player.
- Background must not include: people, NPCs, the quantum artifact as a baked static object if it can be collected/changed, fireball scroll as background decor, readable UI text.
- Fixed background features: chamber walls, floor runes, central pedestal base, barrier anchors, north exit threshold back toward the R.A.V.E.N. route.
- Sprite objects: `quantumArtifact`, `fireballScroll`.
- NPC/character sprites: none currently.
- Screen/overlay surfaces: magical barrier shimmer, pedestal glow, rune pulse.
- Hotspot candidates: `inspect runes`, `inspect pedestal`, `inspect barrier`, `dispel barrier`, `take quantum artifact`, `take fireball scroll`, `use artifact`, `go north`.
- Exit hotspots: north to `glitchZone_ravenchamber` once graph/registry integration is resolved.
- Optional effects layer: rune glow, barrier shimmer, pedestal pulse, low magical distortion.
- Prompt notes: Keep the artifact visually central but sprite-controlled. The background should imply power without hardcoding whether the artifact has already been taken.
- Red-team notes: Exit target currently references `glitchZone_ravenchamber`, while the strong Raven implementation uses room id `ravenchamber`; resolve id naming before clickable route generation.
- Status: Canon-pending; must be integrated or explicitly routed before full image pass.

### spireCourtyard — Spire Courtyard

- Source room file: `src/rooms/spireCourtyard.ts`
- Current registration status: Valid canon-pending room; not imported by `src/rooms/roomRegistry.ts` in the latest reconciliation output.
- Active room id: `spireCourtyard`
- Zone: `finalZone`
- Current/proposed image: `spireCourtyard.png`
- Route role: Final-zone courtyard and final confrontation arena; terminal route room.
- Canonical route role: End of the main route after the R.A.V.E.N./artifact/final-key chain has been resolved.
- Surreal route role: Can be reached as the last station beyond all station hubs, where every route sign becomes suspiciously personal.
- Harder route role: Final challenge route requiring the correct artifact/pendant/key state before the summoning circle interaction resolves.
- Zone transition / station role: Final terminus beyond the Glitchrealm/Archive route; visually a ruined station forecourt at the base of the Spire rather than a conventional rail or subway station.
- Puzzle lock: `summoningCircle` requires `finalKey` and checks artifact/pendant readiness through existing effect logic.
- Background image description: Vast open courtyard at the base of an impossible Spire, surrounded by ancient ruins and broken ceremonial architecture. The composition should give the player a clear central summoning-circle area, distant spire verticality, and a south exit back to the Raven route.
- Background must not include: people, The Entity as a baked figure, final summoned forms, readable endgame text, removable final objects.
- Fixed background features: ruined courtyard walls, Spire base, stone flagging, fixed summoning-circle markings, south threshold back toward the archive route.
- Sprite objects: none currently, but final-key/artifact/pendant visual echoes may be overlay effects rather than background objects.
- NPC/character sprites: final entity/manifestation must be a separate sprite/effect if used; never baked into background.
- Screen/overlay surfaces: summoning circle, Spire light, reality distortion field.
- Hotspot candidates: `inspect spire`, `inspect ruins`, `inspect summoning circle`, `use final key`, `summon`, `inspect south exit`, `go south`.
- Exit hotspots: south to `glitchZone_ravenchamber` once graph/registry integration is resolved.
- Optional effects layer: circle pulse, wind shimmer, spire glow, reality-pressure distortion.
- Prompt notes: Treat as a final room but avoid over-cluttering; the circle and spire must be readable at play size.
- Red-team notes: This room defines a `finalZone`; ensure route architecture recognises this as the final terminus/hub end, not a normal side room.
- Status: Canon-pending; must be imported/routed before final-route image set.

### ravenchamber — R.A.V.E.N. Chamber canonical consolidation entry

- Source room files: `src/rooms/glitchZone_ravenchamber.ts` and `src/rooms/glitchZone_ravenchamber_room.ts`
- Current registration status: Valid canon-important room, but duplicate/alternate source files exist. The bible should treat this as one canonical room concept pending source consolidation.
- Active room id in both files: `ravenchamber`
- Zone: `glitchZone`
- Current/proposed image options: `glitchrealm-zoneravenroom.png` in `glitchZone_ravenchamber.ts`; `glitchZone_ravenchamber.png` in `glitchZone_ravenchamber_room.ts`.
- Route role: Glitchrealm archive station, redacted archive node, gateway toward artifact/final route.
- Canonical route role: reached from `glitchinguniverse`, used to access archive/register logic, then route onward to artifact/final content once integrated.
- Surreal route role: corrupted platform/archive terminal where the station signage appears to know the player before the player has been formally introduced.
- Harder route role: security/clearance/passphrase route via redacted-player logic and archive access.
- Zone transition / station role: Glitchrealm Corrupted Platform / R.A.V.E.N. archive station. This is a station-hub-like room, but in the form of a classified AI archive chamber rather than a public transport platform.
- Puzzle lock: Archive access, redacted-player recognition, passphrase/confirmation flow, console activation and declassification logic depending on which source is made canonical.
- Background image description: Narrow chamber humming with quiet static, cracked screens lining the walls, nonsense glyphs and frozen boot surfaces, a sunken blue pedestal at the far end, and an ancient AI console that can flare to life as an overlay. The room should feel classified, corrupted and administratively annoyed.
- Background must not include: people, Dominic, register entries as readable baked text, the player, final archive output, UI text, permanent redacted-list content.
- Fixed background features: chamber walls, cracked screen housings, blue pedestal body, console casing, wall rift/back route to `glitchinguniverse`, cable runs, archive architecture.
- Sprite objects: optional redacted register token/card if later implemented; otherwise none currently.
- NPC/character sprites: R.A.V.E.N. should be represented as console/screen/effect voice, not a baked humanoid. Dominic appears only in register content, not as a room background character.
- Screen/overlay surfaces: wall screens, R.A.V.E.N. console, blue pedestal glow, archive output surface, warning lights.
- Hotspot candidates: `inspect console`, `interact console`, `access archive`, `activate console`, `touch console`, `inspect screens`, `watch screens`, `inspect pedestal`, `touch pedestal`, `declassify`, `i know too much`, `go back`, `go out`.
- Exit hotspots: back/out to `glitchinguniverse`; future onward path to `artifactChamber` only after route graph integration is confirmed.
- Optional effects layer: glitch static, screen flicker, console boot flare, blue pedestal pulse, redacted warning light, archive text overlay.
- Prompt notes: Do not bake in long register text. Leave screens blank/corrupted enough to support dynamic archive overlays. Keep the console and pedestal visually dominant.
- Red-team notes: The two Raven files differ in image filename, interactables shape and custom command coverage. The fuller `glitchZone_ravenchamber.ts` includes archive display sequence and extensive register output; `glitchZone_ravenchamber_room.ts` includes declassify/passphrase logic. Consolidate deliberately; do not delete either before salvage.
- Status: Canon-critical; duplicate implementation must be resolved before all-room image generation and before artifact/final route claims.

## Registry and route follow-up

Before the bible is declared complete for all-room generation:

1. Decide whether `artifactChamber` and `spireCourtyard` should be imported into `src/rooms/roomRegistry.ts`.
2. Decide the canonical Raven source file and salvage unique logic from the other file.
3. Resolve id naming between `glitchZone_ravenchamber` and `ravenchamber`.
4. Confirm whether `artifactChamber -> ravenchamber -> spireCourtyard` is the intended late-game route.
5. Update the station-hub route expansion so R.A.V.E.N. is the Glitchrealm archive station and Spire Courtyard is the final terminus.
6. Only then generate production images for these four canon-pending rooms.

## Image-generation readiness verdict

- `artifactChamber`: visually ready as a canon-pending artifact/puzzle room, but route id integration is required.
- `spireCourtyard`: visually ready as a final terminus room, but route id integration is required.
- `ravenchamber`: visually essential, but source duplication must be consolidated.
- `glitchZone_ravenchamber_room`: do not image separately as a different room unless deliberately split; treat as alternate implementation of `ravenchamber`.

No images generated. No code changed.
