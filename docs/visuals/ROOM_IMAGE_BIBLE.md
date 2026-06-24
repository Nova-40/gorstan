# Gorstan Room Image Bible

Status: Draft v2 — red-team production bible for room image generation, hotspot planning, object sprites, NPC sprites and optional effects layers.

This document is documentation-only. It must not change parser logic, room graph logic, SaveManager, startup flow or gameplay state. Active room modules remain the implementation truth. This bible describes how to generate visual room backgrounds and how to plan separate sprites, hotspots and effects without duplicating gameplay logic in React.

## Production rules

### Core principle

Gorstan room art is built as:

```text
background plate + object sprites + NPC sprites + hotspot map + optional effects layers
```

The background plate should depict the static room: architecture, furniture, lighting, permanent decor, fixed screens or portals prepared for overlays, and environmental atmosphere. It should not contain people or stateful objects that may need to appear, disappear, move, be collected, be animated or change with flags.

### Hard visual constraints

- No room background image should contain people, named NPCs, player characters or character-like figures.
- All named characters, NPCs, assistants, baristas, keepers, librarians, animal presences, Dominic-like figures and similar entities must be listed as separate sprites.
- Any object that can be taken, moved, used, revealed, hidden, inspected as a key clue, conditionally displayed or changed by state must be listed as a separate object sprite.
- Backgrounds may contain fixed architecture, furniture, non-stateful decor, static signs without readable UI text, environmental lighting and surfaces prepared for overlays.
- Screens, televisions, mirrors, monitors, tactical displays, portals, windows, magical surfaces and Glitchrealm tears should be drawn as overlay-ready surfaces with no baked-in meaningful interface text.
- Hotspots must call parser commands such as `inspect`, `examine`, `take`, `use`, `read`, `talk`, `sit` or `go`.
- Do not bake UI labels, inventory icons, dialogue, captions or route buttons into generated images.
- Where this bible conflicts with active room data, active room data wins and this bible must be corrected.

### Hotspot standard

- Ordinary rooms: minimum 3 hotspot candidates.
- Important/story/puzzle rooms: minimum 5 hotspot candidates.
- Every visible exit should have an exit hotspot.
- Every room should include at least one environmental/examine hotspot.
- Rooms with NPCs must include NPC sprite and `talk <npc>` style hotspot candidates.
- Rooms with stateful/takeable objects must list those objects as sprites and include relevant `inspect`, `take`, `use` or `read` commands.

### Red-team checklist for every room

- Does the background avoid people and named NPCs?
- Are all NPCs listed as sprites?
- Are all takeable/stateful objects listed as object sprites?
- Are there enough hotspots for exploration?
- Are exits represented as hotspots?
- Are screens/portals/display surfaces overlay-ready?
- Does the prompt avoid baked-in readable UI text?
- Does the room still match active room data?
- Does the plan preserve parser-first behaviour?

## Standard image prompt template

```text
Create a front-facing illustrated room scene for Gorstan, a dryly absurd British parser-first adventure game.

Style: modernised retro GIF-style adventure artwork, lightly pixel-art inspired but painterly and polished; atmospheric lighting; readable silhouettes; clear implied hotspots; visually rich but uncluttered.

Composition: front-facing room layout suitable for point-and-click exploration. Leave visual space for transparent hotspot overlays and small animated effects. Do not include UI panels, captions, labels, speech bubbles, inventory icons, buttons or readable interface text.

Room: [room title]

Background image description: [static architecture, lighting, furniture and fixed decor only]

Do not include in background: people, named NPCs, movable/takeable/stateful objects, readable UI text, final screen content.

Sprite objects: [separate object sprites]
NPC/character sprites: [separate NPC sprites]
Screen/overlay surfaces: [blank/dim screens, portals, mirrors, magical surfaces]
Hotspot affordances: [features/exits/objects/NPCs for parser commands]
Optional effects: [steam, flicker, pulse, dust, static, glow]
Mood: [atmospheric notes]
```

## Canonical registered rooms

The active registered room list is sourced from `src/rooms/roomRegistry.ts`. The registry imports and registers rooms for Elfhame, Glitchrealm, Gorstan, Intro, Lattice, London, Maze, Multi, New York, Off-Gorstan, Off-Multiverse and Stanton zones. Treat that registry as the canonical room population for this bible.

## Priority detailed entries

### controlroom — Primary Control Room

- Source room file: `src/rooms/introZone_controlroom.ts`
- Current/proposed image: `introZone_controlroom.png`
- Background image description: Sophisticated tactical operations chamber with a semicircle of workstations, fixed monitoring banks, red emergency lighting, wall-mounted tactical display surface, polished but scuffed institutional floor, cable channels and permanent warning panels. The space should feel dormant, pressured and over-engineered.
- Background must not include: people, Dominic, operators, takeable keys/cards/scanners/badges, readable UI text.
- Fixed background features: central workstation arc, tactical wall display surface, emergency panel housing, communication array, fixed ceiling lights, heavy sealed doors, hidden floor/hatch outline.
- Sprite objects: tactical display data card, emergency override key, dimensional scanner, operator badge.
- NPC/character sprites: none.
- Screen/overlay surfaces: tactical wall display, workstation monitors, warning indicators.
- Hotspot candidates: `inspect tactical display`, `inspect workstations`, `inspect emergency panel`, `inspect communication array`, `use console`, `go east`, `go north`, `go down`.
- Exit hotspots: east to Control Nexus, north to reset/introduction route, down/hidden hatch to Hidden Lab when appropriate.
- Optional effects layer: red alert pulse, CRT/display flicker, low emergency glow, fan shimmer, ozone/static shimmer.
- Prompt notes: Strong front-facing composition with clear east door and subtle hatch; screens blank/dim enough for overlays.
- Red-team notes: Keep hidden hatch visually subtle because access may be conditional.
- Status: Ready for image prompt.

### controlnexus — The Control Nexus

- Source room file: `src/rooms/introZone_controlnexus.ts`
- Current/proposed image: `introZone_controlnexus.gif` or revised still `introZone_controlnexus.png` plus effects.
- Background image description: Circular command chamber with curved wall screens, central console plinth, command chair, thick cables crossing a polished floor and sleeping blue systems light. It should feel important, dormant and faintly offended at being disturbed.
- Background must not include: people, operators, final screen text, takeable objects.
- Fixed background features: circular chamber walls, command chair, central console body, curved screen banks, cable trenches, west doorway.
- Sprite objects: none initially unless later active data adds removable console components.
- NPC/character sprites: none.
- Screen/overlay surfaces: curved wall screens, console display, cable glow channels.
- Hotspot candidates: `inspect console`, `use console`, `inspect chair`, `sit chair`, `inspect screens`, `inspect cables`, `go west`.
- Exit hotspots: west to Primary Control Room; sit/chair route to Hidden Lab if active.
- Optional effects layer: blue screen flicker, dormant pulse, cable glow, data chirp shimmer.
- Prompt notes: Chair must be obvious as a meaningful affordance; do not draw it as mere furniture.
- Red-team notes: The `sit` route is unusual and should be visually cued without adding a literal doorway.
- Status: Ready for image prompt.

### dalesapartment — Dale’s Apartment / living room

- Source room file: `src/rooms/londonZone_dalesapartment.ts`
- Current/proposed image: `londonZone_dalesapartment.png`
- Background image description: Lived-in British apartment living room with sofa, television area, side table near the television, shelving, warm domestic clutter, soft daylight or lamplight, and the important framed picture of Mabel clearly visible on the wall behind the sofa. The image should feel personal and slightly vulnerable, not generic show-home clean.
- Background must not include: Dominic, any person, the remote control, keys, takeable/stateful clues, readable TV programme text.
- Fixed background features: sofa, wall behind sofa, Mabel picture, television stand, side table, shelving, doorways/exits, ordinary domestic lighting.
- Sprite objects: remote control on side table near television, set of keys on side table near television, any active documents/clues/items from room data.
- NPC/character sprites: Dominic must be a separate NPC sprite if present in this room or scene flow.
- Screen/overlay surfaces: television screen prepared for future display overlay; no baked-in readable content.
- Hotspot candidates: `inspect sofa`, `inspect Mabel picture`, `inspect television`, `use television`, `inspect side table`, `take remote`, `take keys`, `talk Dominic`, `go <exit>`.
- Exit hotspots: all active exits from room data must be visually represented.
- Optional effects layer: television glow/static overlay, lamplight flicker, subtle dust/sunbeam, ambient screen reflection.
- Prompt notes: Mabel picture is emotionally important and must stay prominent behind the sofa. Remote and keys are sprites placed on the side table by the television.
- Red-team notes: Dominic must never be baked into the background. The TV must be overlay-ready. This room is a model for how all domestic rooms should separate background, sprites and hotspots.
- Status: Requires active room data cross-check for exact exits and item list before final prompt.

### findlaterscornercoffeeshop — Findlater’s Corner Coffee Shop / Gorstan Café candidate

- Source room file: `src/rooms/londonZone_findlaterscornercoffeeshop.ts`
- Current/proposed image: `londonZone_findlaters.png`
- Background image description: Warm corner coffee shop with polished wooden counter, mismatched vintage furniture, exposed brick, local artwork, neighbourhood photos, soft golden light and a sense that the establishment knows slightly too much. No customers or barista baked into background.
- Background must not include: barista, customers, named NPCs, takeable menu/newspaper/notebook/card sprites, readable menu text.
- Fixed background features: counter, coffee machine body, tables, chairs, brick wall, framed local photographs, window, office/back door, street-facing exit.
- Sprite objects: menu, newspaper, dated receipt, loyalty card, business cards, forgotten notebook, Schrödinger coin if active/placed here.
- NPC/character sprites: friendly barista as separate sprite if present.
- Screen/overlay surfaces: none unless coffee machine display/signage later needs overlay.
- Hotspot candidates: `inspect counter`, `inspect coffee machine`, `talk barista`, `read menu`, `inspect newspaper`, `take receipt`, `inspect notebook`, `go north`, `go south`, `go east`.
- Exit hotspots: office/back exit, apartment/south exit, Trent Park/east exit as active data indicates.
- Optional effects layer: steam loops, cup clinks, sunbeam dust, soft sign/window glow.
- Prompt notes: Important vertical-slice room. Must support obvious object/exits/interactions and coin logic without baking stateful coin into background.
- Red-team notes: If this is the canonical Gorstan Café, title/alias should be noted but active room id remains `findlaterscornercoffeeshop`.
- Status: Ready for detailed prompt after coin placement confirmation.

### cafeoffice — Cafe Office

- Source room file: `src/rooms/londonZone_cafeoffice.ts`
- Current/proposed image: `londonZone_cafeoffice.png`
- Background image description: Small cluttered office behind the café with fixed desk, filing cabinets, supply shelves, bulletin board, old computer setup and a safe location. It should feel cramped, practical and full of paper that has not forgiven anyone.
- Background must not include: people, takeable documents, keyring, cash, combination notes, readable computer UI.
- Fixed background features: desk, filing cabinets, shelving, wall board, safe housing, door back to café.
- Sprite objects: important documents, staff key ring, business records, supplier contacts, safe combination, emergency cash, inventory clipboard.
- NPC/character sprites: none.
- Screen/overlay surfaces: old computer monitor, safe panel if needed.
- Hotspot candidates: `inspect desk`, `inspect computer`, `inspect filing cabinets`, `inspect safe`, `open safe`, `read bulletin board`, `go south`.
- Exit hotspots: south/back to café as active data indicates.
- Optional effects layer: fluorescent buzz, monitor glow, paper rustle, faint café noise.
- Prompt notes: Keep documents as sprites where they can be inspected/taken.
- Red-team notes: Confirm `south -> cafe` target resolves to active registered room or alias.
- Status: Needs exit cross-check.

### hiddenlibrary — Hidden Library

- Source room file: `src/rooms/latticeZone_hiddenlibrary.ts`
- Current/proposed image: `latticeZone_hiddenlibrary.png`
- Background image description: Dim ancient library with shelves disappearing into shadow, central desk, fixed lantern positions, old paper and ink atmosphere, and subtle impossible geometry. No librarian baked into background.
- Background must not include: librarian, readable book text, takeable tome/scroll sprites.
- Fixed background features: shelves, desk, reading stand, lantern brackets, exits north/south.
- Sprite objects: ancient tome, scroll of wisdom, any active clue books.
- NPC/character sprites: librarian as separate sprite if present.
- Screen/overlay surfaces: glowing book/page surface if later animated.
- Hotspot candidates: `inspect shelves`, `inspect desk`, `read tome`, `take ancient tome`, `read scroll`, `talk librarian`, `go north`, `go south`.
- Exit hotspots: north and south exits.
- Optional effects layer: lantern flicker, dust motes, page shimmer, whispering book aura.
- Prompt notes: Keep legibility high; shelves should not become visual noise.
- Red-team notes: NPC must be separate sprite.
- Status: Ready after active object/NPC confirmation.

### libraryofnine — Library of Nine

- Source room file: `src/rooms/latticeZone_libraryofnine.ts`
- Current/proposed image: `latticeZone_libraryofnine.png`
- Background image description: Circular hidden annex with nine monumental shelves, crystal-bound books, glowing floor pattern and central pedestal. It should feel ritualised, ordered and uncomfortably sentient.
- Background must not include: Ninekeeper, readable glyph text, removable books/tomes if stateful.
- Fixed background features: circular chamber, nine shelf bays, central pedestal, floor geometry, south/east exit routes.
- Sprite objects: nine key tomes or any active removable/inspectable books.
- NPC/character sprites: Ninekeeper as separate apparition/NPC sprite if present.
- Screen/overlay surfaces: glowing pedestal, floor sigil, animated shelf glints.
- Hotspot candidates: `inspect pedestal`, `inspect shelves`, `inspect shelf of origins`, `inspect shelf of endings`, `read tome`, `talk ninekeeper`, `go south`, `go east`.
- Exit hotspots: south and east exits as active data indicates.
- Optional effects layer: rune glow, page shimmer, spectral motes, soft chime pulse.
- Prompt notes: Nine shelves should be visually countable without overcrowding.
- Red-team notes: Check zone-prefixed exit ids before final clickable mapping.
- Status: Ready after exit cross-check.

### faeglade — The Faerie Glade / Elfhame forest shrine candidate

- Source room file: `src/rooms/elfhameZone_faeglade.ts`
- Current/proposed image: `elfhame_woods.png`
- Background image description: Circular moonlit clearing beneath ancient oaks forming a natural cathedral. Standing stones create a shrine-like ring, with impossible flowers and soft Fae light. No Fae figures baked into the image.
- Background must not include: Fae characters, removable magical items, readable script.
- Fixed background features: ancient oaks, standing stones, clearing floor, directional paths, moonlit canopy.
- Sprite objects: Moonlight Orb, Fae Flower, Ancient Scroll, Silver Branch.
- NPC/character sprites: none unless active data adds Fae presence.
- Screen/overlay surfaces: shifting Fae script on standing stones, moonbeam surfaces.
- Hotspot candidates: `inspect standing stones`, `inspect flowers`, `take moonlight orb`, `take fae flower`, `read ancient scroll`, `take silver branch`, `go north`, `go south`, `go east`, `go west`.
- Exit hotspots: north, south, east, west paths.
- Optional effects layer: moonbeam shimmer, glyph drift, flower glow, magical air distortion.
- Prompt notes: This is the visual forest shrine even if active title is glade.
- Red-team notes: Keep items as sprites; background should not lock in collected/uncollected state.
- Status: Ready after item availability confirmation.

### ravenchamber — R.A.V.E.N. Chamber / Glitchrealm chamber candidate

- Source room file: `src/rooms/glitchZone_ravenchamber.ts` if currently registered; if not, treat as discovered special room requiring registry confirmation.
- Current/proposed image: `glitchrealm-zoneravenroom.png`
- Background image description: Narrow static-humming chamber with cracked screens, frozen boot surfaces, blue sunken pedestal and an ancient AI console. The room should feel classified, corrupted and older than its own hardware.
- Background must not include: AI avatar/person, readable terminal text, active archive content, redaction text.
- Fixed background features: console body, cracked screen array, pedestal structure, corrupted wall panels, back/out rift.
- Sprite objects: archive token/key items if active later.
- NPC/character sprites: none unless R.A.V.E.N. gains a visual avatar, which must be separate.
- Screen/overlay surfaces: console screen, cracked screens, pedestal glow, rift/static areas.
- Hotspot candidates: `inspect console`, `use console`, `access archive`, `inspect pedestal`, `inspect screens`, `go back`, `go out`.
- Exit hotspots: back/out to Glitching Universe as active data indicates.
- Optional effects layer: glitch static, blue pulse, boot flicker, corrupted scanlines.
- Prompt notes: No readable UI text; leave all archive content to overlay or parser output.
- Red-team notes: This room has custom command behaviour; hotspots must invoke parser/custom command path only.
- Status: Requires registry confirmation because current registry excerpt did not show `ravenchamber`.

## Registered room entries requiring full source expansion

The following entries are populated as production-ready starter rows based on room id, zone, title inference and visual pipeline standards. They require a final pass against each active room module before image generation.

### aevirawarehouse

- Source room file: `src/rooms/newyorkZone_aevirawarehouse.ts`
- Background image description: Industrial New York warehouse interior with high rafters, loading bay doors, stacked crates, concrete floor, fixed overhead lamps and corporate/tech storage mood.
- Background must not include: people, guards, takeable documents/devices.
- Sprite objects: warehouse keys, crates with stateful contents, manifests, devices, clue objects from active data.
- NPC/character sprites: any warehouse staff/guard/NPC as separate sprites.
- Fixed background features: loading bay, shelves, pallets, gantry, office door, exit routes.
- Screen/overlay surfaces: security monitor or scanner panels if present.
- Hotspot candidates: `inspect crates`, `inspect loading bay`, `inspect office door`, `inspect shelves`, `use scanner`, `go <exit>`.
- Exit hotspots: all active exits from room data.
- Optional effects layer: flickering strip lights, dust, distant city glow.
- Prompt notes: Keep object-bearing crates generic unless contents are sprites.
- Red-team notes: No warehouse workers in background.
- Status: Needs source cross-check.

### ancientslibrary

- Source room file: `src/rooms/offgorstanZone_ancientslibrary.ts`
- Background image description: Vast ancient library outside ordinary Gorstan logic, with stone shelves, monumental reading tables, aged banners and faint impossible perspective.
- Background must not include: librarians/ghosts, readable text, takeable books.
- Sprite objects: ancient books, scrolls, keys, tablets from active data.
- NPC/character sprites: any ancient librarian/guardian as sprite.
- Fixed background features: shelves, arches, reading desks, lamps, exit archways.
- Screen/overlay surfaces: glowing manuscripts or portal-like reading surfaces.
- Hotspot candidates: `inspect shelves`, `inspect reading table`, `read book`, `take scroll`, `inspect archway`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: dust motes, candle/lantern flicker, page shimmer.
- Prompt notes: Grand but readable.
- Red-team notes: Do not render spirits as background decor.
- Status: Needs source cross-check.

### ancientsroom

- Source room file: `src/rooms/offgorstanZone_ancientsroom.ts`
- Background image description: Old sealed chamber with carved stone, ritual furniture, alcoves and the sense of a committee meeting that ended badly several centuries ago.
- Background must not include: ancient figures, active relics, readable inscriptions.
- Sprite objects: relics, tablets, keys, scrolls from active data.
- NPC/character sprites: any guardian/ancient presence as sprite.
- Fixed background features: stone walls, alcoves, central plinth, doors/exits.
- Screen/overlay surfaces: glowing carvings if animated.
- Hotspot candidates: `inspect plinth`, `inspect carvings`, `inspect alcove`, `take relic`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: rune glow, dust, low torchlight.
- Prompt notes: Avoid generic fantasy; keep British absurd institutional undertone.
- Red-team notes: Relics as sprites.
- Status: Needs source cross-check.

### ancientvault

- Source room file: `src/rooms/offgorstanZone_ancientvault.ts`
- Background image description: Heavy ancient vault with sealed doors, storage recesses, lock mechanisms and a cold preservation atmosphere.
- Background must not include: people, removable treasure/relics.
- Sprite objects: vault key, relics, documents, containers from active data.
- NPC/character sprites: any guardian as sprite.
- Fixed background features: vault door, stone shelves, lock face, exit passage.
- Screen/overlay surfaces: lock glow/rune plate if present.
- Hotspot candidates: `inspect vault door`, `inspect lock`, `open vault`, `inspect shelves`, `take relic`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: cold mist, rune flicker, door vibration.
- Prompt notes: Strong focal vault door.
- Red-team notes: Do not bake collectible contents.
- Status: Needs source cross-check.

### anothermazeroom

- Source room file: `src/rooms/mazeZone_anothermazeroom.ts`
- Background image description: Repeating maze chamber with slight variations from other maze rooms, angled corridors, misleading symmetry and dry bureaucratic menace.
- Background must not include: people, movable clues.
- Sprite objects: maze clue markers, notes, keys if active.
- NPC/character sprites: none unless active.
- Fixed background features: corridor openings, wall marks, floor pattern, exits.
- Screen/overlay surfaces: none unless glyphs/portals active.
- Hotspot candidates: `inspect walls`, `inspect floor`, `inspect markings`, `go <exit>`, `listen`.
- Exit hotspots: all active maze exits.
- Optional effects layer: subtle wall shimmer, echo pulse, dust.
- Prompt notes: Must look distinct from `mazeroom` while still maze-like.
- Red-team notes: Ensure exits match parser truth.
- Status: Needs source cross-check.

### arbitercore

- Source room file: `src/rooms/offgorstanZone_arbitercore.ts`
- Background image description: Core adjudication chamber with fixed machinery, central judgement apparatus, institutional cosmic architecture and cold formal lighting.
- Background must not include: arbiter figure/person, readable verdict text.
- Sprite objects: tokens, evidence objects, keys from active data.
- NPC/character sprites: Arbiter/voice/avatar as sprite or overlay, never background.
- Fixed background features: central core, control dais, walls, exits.
- Screen/overlay surfaces: judgement display, core glow.
- Hotspot candidates: `inspect core`, `use console`, `inspect dais`, `inspect display`, `talk arbiter`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: core pulse, judgement light, low hum.
- Prompt notes: Formal, severe, absurdly administrative.
- Red-team notes: Keep arbiter entity separate.
- Status: Needs source cross-check.

### ascendantStanton

- Source room file: `src/rooms/stantonZone_ascendantStanton.ts`
- Background image description: Stanton Harcourt variant elevated into strange radiance, village architecture distorted upward, paths and landmarks familiar but unnervingly improved.
- Background must not include: villagers/NPCs.
- Sprite objects: local clues, keys, signs as sprites if stateful.
- NPC/character sprites: any Stanton figures as sprites.
- Fixed background features: village street/green/buildings, transformed sky/light, exits.
- Screen/overlay surfaces: ascendant glow, portals if present.
- Hotspot candidates: `inspect village`, `inspect sky`, `inspect path`, `inspect sign`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: radiance, drifting motes, architectural shimmer.
- Prompt notes: Keep location recognisable as Stanton variant.
- Red-team notes: No people in background.
- Status: Needs source cross-check.

### burgerjoint

- Source room file: `src/rooms/newyorkZone_burgerjoint.ts`
- Background image description: New York burger joint interior with counter, booths, menu boards as non-readable shapes, greasy lighting and urban street window.
- Background must not include: staff/customers, readable menu text, takeable food/clues.
- Sprite objects: burger items, receipt, key, note, tray objects from active data.
- NPC/character sprites: staff/customer NPCs as sprites.
- Fixed background features: counter, grill area, booths, window, exits.
- Screen/overlay surfaces: menu board/display if needed, left blank/unreadable.
- Hotspot candidates: `inspect counter`, `inspect booths`, `read menu`, `inspect window`, `take receipt`, `talk <npc>`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: grill steam, neon flicker, street light shimmer.
- Prompt notes: Grimy but readable, not too busy.
- Red-team notes: No customers in background.
- Status: Needs source cross-check.

### carronspire

- Source room file: `src/rooms/gorstanZone_carronspire.ts`
- Background image description: Highland/Gorstan spire location with stone, wind, height and mythic geography; dramatic but navigable.
- Background must not include: people, active relics.
- Sprite objects: relics, notes, keys, local objects from active data.
- NPC/character sprites: any locals/guardians as sprites.
- Fixed background features: spire, path, stonework, exits.
- Screen/overlay surfaces: magical sky/portal if present.
- Hotspot candidates: `inspect spire`, `inspect path`, `inspect stones`, `look down`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: wind, mist, cloud shadow, distant glow.
- Prompt notes: Strong vertical composition without losing hotspot clarity.
- Red-team notes: Keep traversable paths clear.
- Status: Needs source cross-check.

### centralpark

- Source room file: `src/rooms/newyorkZone_centralpark.ts`
- Background image description: Central Park scene with path, trees, benches, city skyline glimpse and natural/urban contrast.
- Background must not include: pedestrians, named NPCs, takeable objects.
- Sprite objects: map, note, dropped item, clue objects from active data.
- NPC/character sprites: park NPCs as sprites.
- Fixed background features: paths, benches, trees, skyline, exits.
- Screen/overlay surfaces: none unless signage/display active.
- Hotspot candidates: `inspect bench`, `inspect trees`, `inspect path`, `inspect skyline`, `take note`, `talk <npc>`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: leaves, dappled light, city ambience.
- Prompt notes: Avoid generic postcard; preserve Gorstan oddness.
- Red-team notes: No crowds in background.
- Status: Needs source cross-check.

### crossing

- Source room file: `src/rooms/introZone_crossing.ts`
- Background image description: Transitional crossing space with clear route geometry, threshold atmosphere and visual ambiguity about where one system ends and another begins.
- Background must not include: people, stateful objects.
- Sprite objects: signs, tokens, clues if active.
- NPC/character sprites: none unless active.
- Fixed background features: crossing paths, boundary markers, exits.
- Screen/overlay surfaces: portal/boundary shimmer if present.
- Hotspot candidates: `inspect crossing`, `inspect boundary`, `inspect sign`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: threshold shimmer, ambient pulse.
- Prompt notes: Make exits obvious.
- Red-team notes: Avoid misleading inaccessible routes.
- Status: Needs source cross-check.

### datavoid

- Source room file: `src/rooms/glitchZone_datavoid.ts`
- Background image description: Abstract corrupted data void with fractured geometry, dark negative space and suspended interface-like surfaces without readable text.
- Background must not include: humanoid AI figures, readable code, stateful data objects.
- Sprite objects: data shard, token, corrupted item from active data.
- NPC/character sprites: glitch entities as sprites.
- Fixed background features: void plane, broken platforms, exits/rifts.
- Screen/overlay surfaces: glitch panels, data rifts.
- Hotspot candidates: `inspect void`, `inspect data shard`, `inspect rift`, `take shard`, `go <exit>`.
- Exit hotspots: all active exits/rifts.
- Optional effects layer: static, pixel tear, data rain, chromatic jitter.
- Prompt notes: Readable silhouettes despite abstraction.
- Red-team notes: No readable code snippets.
- Status: Needs source cross-check.

### echochamber

- Source room file: `src/rooms/offgorstanZone_echochamber.ts`
- Background image description: Resonant chamber with curved walls, acoustic geometry, repeating arch forms and a sense that every decision has minutes.
- Background must not include: echo figures/people.
- Sprite objects: resonant objects, notes, keys from active data.
- NPC/character sprites: echo entities as sprites.
- Fixed background features: curved chamber, central floor mark, exits.
- Screen/overlay surfaces: sound-wave glow or reflective wall surfaces.
- Hotspot candidates: `inspect walls`, `listen`, `inspect centre`, `inspect echo`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: ripple rings, subtle vibration, echo shimmer.
- Prompt notes: Sound visualisation as effect layer, not text.
- Red-team notes: Echo entities separate.
- Status: Needs source cross-check.

### elfhame

- Source room file: `src/rooms/elfhameZone_elfhame.ts`
- Background image description: Gateway or settlement heart of Elfhame with ancient woodland, Fae architecture, luminous paths and a courtly-but-dangerous atmosphere.
- Background must not include: Fae people/NPCs, takeable magical objects.
- Sprite objects: magical items, flowers, scrolls, keys from active data.
- NPC/character sprites: all Fae entities as sprites.
- Fixed background features: woodland architecture, paths, arches, exits.
- Screen/overlay surfaces: magical thresholds, glowing sigils.
- Hotspot candidates: `inspect trees`, `inspect archway`, `inspect path`, `inspect sigils`, `talk <npc>`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: fae light, leaf movement, glyph shimmer.
- Prompt notes: Enchanted but slightly bureaucratic in atmosphere.
- Red-team notes: No Fae figures baked in.
- Status: Needs source cross-check.

### faelake

- Source room file: `src/rooms/elfhameZone_faelake.ts`
- Background image description: Still Fae lake with reflective surface, luminous shoreline, ancient trees and paths around or away from the water.
- Background must not include: people, water spirits, removable objects.
- Sprite objects: lake items, flowers, stones, clues from active data.
- NPC/character sprites: spirits/fae as sprites.
- Fixed background features: lake, shore, trees, paths/exits.
- Screen/overlay surfaces: reflective lake surface.
- Hotspot candidates: `inspect lake`, `inspect shore`, `inspect reflection`, `inspect trees`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: water ripple, moonlight shimmer, fireflies.
- Prompt notes: Reflection can support overlays.
- Red-team notes: No figures in reflection unless dynamic overlay.
- Status: Needs source cross-check.

### faelakenorthshore

- Source room file: `src/rooms/elfhameZone_faelakenorthshore.ts`
- Background image description: Northern shore of the Fae lake, colder and quieter than the main lake, with stones, reeds, trees and a path continuing through old magic.
- Background must not include: people, spirits, stateful objects.
- Sprite objects: shore clues, stones, flowers/items from active data.
- NPC/character sprites: any entity as sprite.
- Fixed background features: north shore, lake edge, path, trees, exits.
- Screen/overlay surfaces: lake reflection.
- Hotspot candidates: `inspect shore`, `inspect lake`, `inspect reeds`, `inspect path`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: ripples, cold mist, soft glow.
- Prompt notes: Distinguish visually from main lake.
- Red-team notes: Avoid generic forest repetition.
- Status: Needs source cross-check.

### faepalacedungeons

- Source room file: `src/rooms/elfhameZone_faepalacedungeons.ts`
- Background image description: Fae palace dungeon with elegant cruelty: stone cells, silvered bars, magical restraints and faint courtly ornamentation.
- Background must not include: prisoners/guards, removable keys/items.
- Sprite objects: keys, restraints, notes, magical tools from active data.
- NPC/character sprites: prisoners/guards/Fae as sprites.
- Fixed background features: cells, bars, corridor, doors/exits.
- Screen/overlay surfaces: magical lock glyphs.
- Hotspot candidates: `inspect cell`, `inspect bars`, `inspect lock`, `take key`, `talk <npc>`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: torch/fae glow, lock pulse, shadow movement.
- Prompt notes: Dark but readable.
- Red-team notes: No prisoners baked in.
- Status: Needs source cross-check.

### faepalacemainhall

- Source room file: `src/rooms/elfhameZone_faepalacemainhall.ts`
- Background image description: Grand Fae palace hall with organic architecture, polished floors, courtly symmetry and several clear exits.
- Background must not include: courtiers, guards, named NPCs, movable magical items.
- Sprite objects: court objects, keys, artefacts from active data.
- NPC/character sprites: all court figures as sprites.
- Fixed background features: hall, pillars, throne/dais if fixed, doors, stairs.
- Screen/overlay surfaces: magical banners/sigils.
- Hotspot candidates: `inspect hall`, `inspect dais`, `inspect pillars`, `inspect doors`, `talk <npc>`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: fae glow, banner shimmer, light shafts.
- Prompt notes: Multiple exits must be clear.
- Red-team notes: No court crowd in background.
- Status: Needs source cross-check.

### faepalacerhianonsroom

- Source room file: `src/rooms/elfhameZone_faepalacerhianonsroom.ts`
- Background image description: Private Fae palace room, elegant and intimate, with fixed furniture, mirror/scrying surface, textiles and courtly menace.
- Background must not include: Rhianon/person, takeable personal items, readable notes.
- Sprite objects: personal artefacts, notes, keys, magical objects from active data.
- NPC/character sprites: Rhianon or any figure as sprite.
- Fixed background features: bed/seat, mirror, desk, windows, exits.
- Screen/overlay surfaces: mirror/scrying surface, window glow.
- Hotspot candidates: `inspect mirror`, `inspect desk`, `inspect bed`, `read note`, `talk rhianon`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: mirror shimmer, candle/fae light, curtain movement.
- Prompt notes: Personal but not cluttered.
- Red-team notes: Named character must be sprite.
- Status: Needs source cross-check.

### failure

- Source room file: `src/rooms/glitchZone_failure.ts`
- Background image description: Glitchrealm failure state room with broken geometry, error-coloured lighting, cracked surfaces and a sense of runtime collapse.
- Background must not include: humanoid failure avatars, readable error text.
- Sprite objects: corrupted tokens, broken components from active data.
- NPC/character sprites: any glitch entity as sprite.
- Fixed background features: fractured room boundaries, exits/rifts, collapsed panels.
- Screen/overlay surfaces: error panels, corrupted display areas.
- Hotspot candidates: `inspect failure`, `inspect rift`, `inspect broken panel`, `use console`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: static, red/blue glitch pulse, scanline tearing.
- Prompt notes: No actual readable error code.
- Red-team notes: Preserve readability despite chaos.
- Status: Needs source cross-check.

### findlaters

- Source room file: `src/rooms/londonZone_findlaters.ts`
- Background image description: Findlater’s area/interior or exterior depending on active data, with British locality, coffee-shop adjacency and clear links to London scenes.
- Background must not include: people, barista, stateful objects.
- Sprite objects: signs, notes, objects from active data.
- NPC/character sprites: any staff/local as sprite.
- Fixed background features: street/café frontage/interior fixtures, exits.
- Screen/overlay surfaces: sign/window if dynamic.
- Hotspot candidates: `inspect sign`, `inspect frontage`, `inspect window`, `inspect door`, `talk <npc>`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: street light, steam, window glow.
- Prompt notes: Clarify distinction from `findlaterscornercoffeeshop` in final pass.
- Red-team notes: Avoid duplicate café imagery unless intentional.
- Status: Needs source cross-check.

### forgottenchamber

- Source room file: `src/rooms/mazeZone_forgottenchamber.ts`
- Background image description: Sealed-off maze chamber with old dust, abandoned mechanism, forgotten markings and one or more uneasy exits.
- Background must not include: people, active relics.
- Sprite objects: forgotten key, notes, relics from active data.
- NPC/character sprites: none unless active.
- Fixed background features: chamber walls, old mechanism, alcoves, exits.
- Screen/overlay surfaces: glyph/portal if present.
- Hotspot candidates: `inspect mechanism`, `inspect markings`, `inspect alcove`, `take relic`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: dust, faint glow, echo shimmer.
- Prompt notes: Must feel different from generic maze corridors.
- Red-team notes: Keep active clues as sprites.
- Status: Needs source cross-check.

### glitchinguniverse

- Source room file: `src/rooms/glitchZone_glitchinguniverse.ts`
- Background image description: Vast unstable Glitchrealm space with broken universe fragments, pixel tears, impossible horizon and routes through corruption.
- Background must not include: AI figures/NPCs, readable code.
- Sprite objects: data shards, tokens, corrupted objects from active data.
- NPC/character sprites: glitch entities as sprites.
- Fixed background features: fractured pathways, rifts, void geometry, exits.
- Screen/overlay surfaces: rifts, broken display fragments, portal edges.
- Hotspot candidates: `inspect rift`, `inspect horizon`, `inspect fragments`, `take shard`, `go <exit>`.
- Exit hotspots: all active exits/rifts.
- Optional effects layer: glitch static, parallax fragments, colour separation.
- Prompt notes: Create strong readable routes in chaotic space.
- Red-team notes: No readable strings.
- Status: Needs source cross-check.

### glitchStanton

- Source room file: `src/rooms/stantonZone_glitchStanton.ts`
- Background image description: Stanton village variant corrupted by digital/glitch artefacts, familiar rural setting fractured by impossible rendering errors.
- Background must not include: villagers/NPCs.
- Sprite objects: corrupted clues, local items from active data.
- NPC/character sprites: any village/glitch entities as sprites.
- Fixed background features: village green/buildings/path, glitch fissures, exits.
- Screen/overlay surfaces: glitch tears, corrupted sign surfaces.
- Hotspot candidates: `inspect glitch`, `inspect village`, `inspect sign`, `inspect path`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: screen tear, pixel drift, rural light flicker.
- Prompt notes: Must read as Stanton, not generic cyberspace.
- Red-team notes: No people baked in.
- Status: Needs source cross-check.

### gorstanhub

- Source room file: `src/rooms/gorstanZone_gorstanhub.ts`
- Background image description: Hub space for Gorstan proper with village/portal/navigation affordances, atmospheric but legible.
- Background must not include: people/NPCs, stateful objects.
- Sprite objects: hub tokens, signs, objects from active data.
- NPC/character sprites: any local figures as sprites.
- Fixed background features: hub paths, signs, landmarks, exits.
- Screen/overlay surfaces: portal/map/sign surfaces if active.
- Hotspot candidates: `inspect hub`, `inspect sign`, `inspect path`, `inspect landmark`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: portal glow, ambient village light.
- Prompt notes: Navigation clarity is more important than detail.
- Red-team notes: Ensure every exit is visually represented.
- Status: Needs source cross-check.

### gorstanvillage

- Source room file: `src/rooms/gorstanZone_gorstanvillage.ts`
- Background image description: Village scene in Gorstan with stone buildings, paths, local signage and dryly odd atmosphere.
- Background must not include: villagers, takeable objects.
- Sprite objects: local clue items, signs if readable/stateful.
- NPC/character sprites: villagers/local characters as sprites.
- Fixed background features: buildings, green/path, doors, exits.
- Screen/overlay surfaces: sign/window if dynamic.
- Hotspot candidates: `inspect buildings`, `inspect sign`, `inspect path`, `inspect door`, `talk <npc>`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: chimney smoke, light flicker, weather.
- Prompt notes: Retain British village oddness.
- Red-team notes: No background villagers.
- Status: Needs source cross-check.

### greasystoreroom

- Source room file: `src/rooms/newyorkZone_greasystoreroom.ts`
- Background image description: Cramped greasy storeroom with shelves, boxes, cleaning supplies, old tiles and fluorescent light.
- Background must not include: staff, takeable stock/clue items.
- Sprite objects: keys, receipts, boxes with stateful contents, tools from active data.
- NPC/character sprites: any staff as sprite.
- Fixed background features: shelving, mop sink, door, boxes as non-specific background stacks.
- Screen/overlay surfaces: none unless device active.
- Hotspot candidates: `inspect shelves`, `inspect boxes`, `inspect mop sink`, `take key`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: flickering light, steam/grease haze.
- Prompt notes: Small but hotspot-rich.
- Red-team notes: Collectibles as sprites.
- Status: Needs source cross-check.

### hiddenlab

- Source room file: `src/rooms/introZone_hiddenlab.ts`
- Background image description: Secret lab beneath/behind the control area with fixed benches, containment equipment, cabling, glass panels and dormant experiment surfaces.
- Background must not include: scientists/NPCs, takeable lab items.
- Sprite objects: lab key, samples, notes, devices from active data.
- NPC/character sprites: any AI/scientist/entity as sprite.
- Fixed background features: benches, containment pods, machinery, exits/ladder/hatch.
- Screen/overlay surfaces: monitors, containment glass, warning panel.
- Hotspot candidates: `inspect bench`, `inspect containment`, `inspect monitor`, `use device`, `take note`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: monitor glow, containment pulse, steam, static.
- Prompt notes: Make route back clear.
- Red-team notes: Do not bake lab notes/devices if collectable.
- Status: Needs source cross-check.

### introreset

- Source room file: `src/rooms/introZone_introreset.ts`
- Background image description: Reset/liminal intro room with controlled restart atmosphere, stark surfaces and clear reset/return affordance.
- Background must not include: people, readable instruction text.
- Sprite objects: reset token/device if active.
- NPC/character sprites: none unless active.
- Fixed background features: reset apparatus, walls, exit/return path.
- Screen/overlay surfaces: reset display surface left unreadable.
- Hotspot candidates: `inspect reset`, `use reset`, `inspect panel`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: reset pulse, static fade.
- Prompt notes: Do not render UI instructions.
- Red-team notes: Parser output carries instructions, not image text.
- Status: Needs source cross-check.

### introstart

- Source room file: `src/rooms/introZone_introstart.ts`
- Background image description: Initial entry/start room with threshold composition, simple readable exits and Gorstan’s absurd institutional tone beginning to leak in.
- Background must not include: player character/NPCs, UI text.
- Sprite objects: starter objects from active data.
- NPC/character sprites: none unless active.
- Fixed background features: starting chamber/threshold, visible exits, fixed furnishings.
- Screen/overlay surfaces: intro display if active, blank/unreadable.
- Hotspot candidates: `inspect room`, `inspect display`, `inspect exit`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: subtle glow, startup flicker.
- Prompt notes: Clear first playable visual.
- Red-team notes: No route-selection UI.
- Status: Needs source cross-check.

### issuesdetected

- Source room file: `src/rooms/glitchZone_issuesdetected.ts`
- Background image description: Glitchrealm diagnostic chamber where problems are visibly accumulating, with panels, cracks and warning surfaces but no readable text.
- Background must not include: people, literal issue list text.
- Sprite objects: diagnostic tokens, corrupt fragments from active data.
- NPC/character sprites: any glitch entity as sprite.
- Fixed background features: diagnostic panels, fractured walls, exits.
- Screen/overlay surfaces: warning panels, issue monitors.
- Hotspot candidates: `inspect panel`, `inspect crack`, `inspect warning`, `use console`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: warning pulse, static, error flicker.
- Prompt notes: Avoid readable UI.
- Red-team notes: Parser conveys issue content.
- Status: Needs source cross-check.

### labyrinthbend

- Source room file: `src/rooms/mazeZone_labyrinthbend.ts`
- Background image description: Maze corridor turning sharply, with curved/angled walls, disorienting perspective and clear route branches.
- Background must not include: people, movable clues.
- Sprite objects: markers/clues from active data.
- NPC/character sprites: none unless active.
- Fixed background features: bend, wall texture, exits.
- Screen/overlay surfaces: glyphs if active.
- Hotspot candidates: `inspect bend`, `inspect wall`, `inspect floor`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: echo shimmer, dust.
- Prompt notes: Distinct bend geometry.
- Red-team notes: Avoid ambiguous exits.
- Status: Needs source cross-check.

### lattice

- Source room file: `src/rooms/latticeZone_lattice.ts`
- Background image description: Abstract lattice space with structured paths, glowing nodes and mathematical/architectural order.
- Background must not include: people, stateful nodes/items.
- Sprite objects: lattice keys, nodes, tokens from active data.
- NPC/character sprites: any lattice entity as sprite.
- Fixed background features: lattice pathways, nodes as fixed architecture, exits.
- Screen/overlay surfaces: glowing lattice nodes.
- Hotspot candidates: `inspect lattice`, `inspect node`, `use node`, `inspect path`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: node pulses, geometric shimmer.
- Prompt notes: Make navigation legible.
- Red-team notes: State-changing nodes may need overlay/sprite treatment.
- Status: Needs source cross-check.

### latticehub

- Source room file: `src/rooms/latticeZone_latticehub.ts`
- Background image description: Central lattice navigation hub with multiple branches, stable geometry and luminous network architecture.
- Background must not include: people/NPCs, stateful items.
- Sprite objects: hub tokens, keys, active nodes from room data.
- NPC/character sprites: any entity as sprite.
- Fixed background features: central hub platform, branch routes, exits.
- Screen/overlay surfaces: node displays, route surfaces.
- Hotspot candidates: `inspect hub`, `inspect node`, `inspect branch`, `use node`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: pulsing branches, ambient network glow.
- Prompt notes: Branch clarity is critical.
- Red-team notes: Every parser exit needs visual affordance.
- Status: Needs source cross-check.

### latticelibrary

- Source room file: `src/rooms/latticeZone_latticelibrary.ts`
- Background image description: Library-like lattice room with ordered shelves/nodes, data-books and geometric reading architecture.
- Background must not include: librarians/NPCs, takeable books.
- Sprite objects: books, nodes, keys, scrolls from active data.
- NPC/character sprites: any librarian/entity as sprite.
- Fixed background features: shelves, lattice frames, reading surface, exits.
- Screen/overlay surfaces: glowing book/node surfaces.
- Hotspot candidates: `inspect shelves`, `inspect node`, `read book`, `take item`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: page/data shimmer, node pulse.
- Prompt notes: Could visually bridge Hidden Library and Lattice.
- Red-team notes: Separate stateful books.
- Status: Needs source cross-check.

### latticeobservationentrance

- Source room file: `src/rooms/latticeZone_latticeobservationentrance.ts`
- Background image description: Entrance to a lattice observatory with threshold architecture, viewing apparatus glimpsed beyond and clear route onward.
- Background must not include: observers/NPCs.
- Sprite objects: passes, devices, notes from active data.
- NPC/character sprites: any observer/entity as sprite.
- Fixed background features: entrance, door/arch, observation machinery silhouette, exits.
- Screen/overlay surfaces: viewing window, instrument display.
- Hotspot candidates: `inspect entrance`, `inspect door`, `inspect apparatus`, `use panel`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: starlight, instrument glow.
- Prompt notes: Strong threshold composition.
- Red-team notes: No figures at entrance.
- Status: Needs source cross-check.

### latticeobservatory

- Source room file: `src/rooms/latticeZone_latticeobservatory.ts`
- Background image description: Lattice observatory with viewing dome/window, instruments, star/geometric field and multiple surfaces for overlays.
- Background must not include: astronomers/NPCs, readable data.
- Sprite objects: instruments if movable, notes, keys from active data.
- NPC/character sprites: any observer/entity as sprite.
- Fixed background features: observatory platform, instruments, dome/window, exits.
- Screen/overlay surfaces: viewing dome, instrument displays, starfield.
- Hotspot candidates: `inspect dome`, `inspect instruments`, `use telescope`, `inspect display`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: starfield shimmer, instrument glow, slow rotation.
- Prompt notes: Leave display data for overlays.
- Red-team notes: No readable charts in image.
- Status: Needs source cross-check.

### latticespire

- Source room file: `src/rooms/latticeZone_latticespire.ts`
- Background image description: Tall spire within the lattice, vertical geometry, elevated platform, paths/stairs and a sense of structured ascent.
- Background must not include: people, stateful objects.
- Sprite objects: spire tokens, keys, notes from active data.
- NPC/character sprites: any entity as sprite.
- Fixed background features: spire walls, stairs/platform, exits.
- Screen/overlay surfaces: glowing nodes/vertical light.
- Hotspot candidates: `inspect spire`, `inspect stairs`, `inspect platform`, `use node`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: vertical light pulse, wind/geometric shimmer.
- Prompt notes: Ensure climb/navigation affordance.
- Red-team notes: Avoid inaccessible-looking paths.
- Status: Needs source cross-check.

### liminalhub

- Source room file: `src/rooms/multiZone_liminalhub.ts`
- Background image description: Multiverse liminal hub with several threshold routes, neutral impossible architecture and transitional lighting.
- Background must not include: people/NPCs, stateful portal contents.
- Sprite objects: portal keys, tokens, signs from active data.
- NPC/character sprites: any guide/entity as sprite.
- Fixed background features: hub floor, arches/portals, route markers without readable text.
- Screen/overlay surfaces: portal interiors.
- Hotspot candidates: `inspect portal`, `inspect arch`, `inspect hub`, `use portal`, `go <exit>`.
- Exit hotspots: all active exits/portals.
- Optional effects layer: portal pulses, threshold shimmer, ambient particles.
- Prompt notes: Every destination should be visually separated.
- Red-team notes: No baked destination scenes inside portals if stateful.
- Status: Needs source cross-check.

### londonhub

- Source room file: `src/rooms/londonZone_londonhub.ts`
- Background image description: London hub location with urban routes, clear exits to related London rooms and grounded contemporary detail.
- Background must not include: crowds, named NPCs, stateful clues.
- Sprite objects: phone, tickets, notes, keys from active data.
- NPC/character sprites: any London NPCs as sprites.
- Fixed background features: street/platform/urban landmark depending on active data, exits.
- Screen/overlay surfaces: station/display/sign surfaces with no readable UI.
- Hotspot candidates: `inspect street`, `inspect sign`, `inspect route`, `talk <npc>`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: traffic light, rain sheen, window glow.
- Prompt notes: Avoid generic London postcard; preserve Gorstan tone.
- Red-team notes: No crowds.
- Status: Needs source cross-check.

### manhattanhub

- Source room file: `src/rooms/newyorkZone_manhattanhub.ts`
- Background image description: Manhattan hub with urban canyon, clear route exits, signage surfaces and city energy.
- Background must not include: pedestrians, readable signs, NPCs.
- Sprite objects: tickets, notes, devices from active data.
- NPC/character sprites: any Manhattan NPCs as sprites.
- Fixed background features: street, buildings, subway/door/path exits.
- Screen/overlay surfaces: billboards/signs left non-readable.
- Hotspot candidates: `inspect street`, `inspect subway`, `inspect building`, `inspect sign`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: neon flicker, traffic light, rain/city shimmer.
- Prompt notes: Keep hotspots readable despite dense city.
- Red-team notes: No background people.
- Status: Needs source cross-check.

### mazeecho

- Source room file: `src/rooms/mazeZone_mazeecho.ts`
- Background image description: Maze room with echo motif: repeated wall forms, acoustic depth, long corridor perspective and subtle déjà vu.
- Background must not include: people/echo figures.
- Sprite objects: echo clue objects from active data.
- NPC/character sprites: echo entities as sprites if active.
- Fixed background features: repeated corridor, exits, acoustic wall forms.
- Screen/overlay surfaces: echo ripple surfaces if needed.
- Hotspot candidates: `inspect walls`, `listen`, `inspect corridor`, `inspect marking`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: sound ripple, shadow repetition.
- Prompt notes: Distinguish from other maze rooms via echo/rhythm.
- Red-team notes: Echo figures separate.
- Status: Needs source cross-check.

### mazehub

- Source room file: `src/rooms/mazeZone_mazehub.ts`
- Background image description: Maze junction hub with several exits, central orientation feature and misleading symmetry.
- Background must not include: people, stateful objects.
- Sprite objects: map fragments, markers, keys from active data.
- NPC/character sprites: none unless active.
- Fixed background features: junction, central marker, corridors, exits.
- Screen/overlay surfaces: wall glyphs if active.
- Hotspot candidates: `inspect junction`, `inspect marker`, `inspect corridor`, `read markings`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: dust, wall shimmer.
- Prompt notes: Exit clarity is vital.
- Red-team notes: Do not draw false exits unless intentionally marked inactive.
- Status: Needs source cross-check.

### mazeroom

- Source room file: `src/rooms/mazeZone_mazeroom.ts`
- Background image description: Baseline maze chamber with stone/plaster walls, corridor exits and subtle wrongness.
- Background must not include: people, active clues.
- Sprite objects: clue items/markers from active data.
- NPC/character sprites: none unless active.
- Fixed background features: walls, floor, exits.
- Screen/overlay surfaces: none unless active.
- Hotspot candidates: `inspect walls`, `inspect floor`, `inspect exit`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: faint echo, dust.
- Prompt notes: Use as visual baseline for maze variants.
- Red-team notes: Needs differentiation from other maze rooms.
- Status: Needs source cross-check.

### mirrorhall

- Source room file: `src/rooms/mazeZone_mirrorhall.ts`
- Background image description: Hall of mirrors with reflective panels, repeated corridor geometry and unsettling self-reference, but no visible person/reflection.
- Background must not include: player reflection, people, readable text.
- Sprite objects: mirror-key/clue objects from active data.
- NPC/character sprites: any reflected entity as overlay/sprite, not background.
- Fixed background features: mirrors, hall, exits.
- Screen/overlay surfaces: mirror surfaces prepared for dynamic overlays.
- Hotspot candidates: `inspect mirror`, `use mirror`, `inspect reflection`, `inspect hall`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: reflection shimmer, distortion, glint.
- Prompt notes: Mirrors must be blank/ambiguous enough for overlays.
- Red-team notes: No baked player reflection.
- Status: Needs source cross-check.

### misleadchamber

- Source room file: `src/rooms/mazeZone_misleadchamber.ts`
- Background image description: Chamber designed to misdirect with false symmetry, misleading architectural cues and suspiciously helpful route shapes.
- Background must not include: people, stateful clue text.
- Sprite objects: misleading notes/markers if active.
- NPC/character sprites: none unless active.
- Fixed background features: false door shapes, real exits, floor markings.
- Screen/overlay surfaces: wall symbols if active.
- Hotspot candidates: `inspect false door`, `inspect markings`, `inspect real exit`, `go <exit>`.
- Exit hotspots: active exits only; false exits as inspect hotspots, not travel commands.
- Optional effects layer: subtle shimmer on false route.
- Prompt notes: Make false affordances inspectable but not confusing enough to break UI.
- Red-team notes: Clearly separate visual false door from parser exits.
- Status: Needs source cross-check.

### moreissues

- Source room file: `src/rooms/glitchZone_moreissues.ts`
- Background image description: Escalated Glitchrealm issue chamber with denser corruption, fractured panels and warning surfaces.
- Background must not include: people, literal readable issue text.
- Sprite objects: corrupted tokens/fragments from active data.
- NPC/character sprites: glitch entities as sprites.
- Fixed background features: panels, cracks, exits/rifts.
- Screen/overlay surfaces: diagnostic surfaces.
- Hotspot candidates: `inspect issues`, `inspect panel`, `inspect rift`, `use console`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: heavier static, warning pulse, data tear.
- Prompt notes: More intense than `issuesdetected`.
- Red-team notes: No readable UI text.
- Status: Needs source cross-check.

### peacefulStanton

- Source room file: `src/rooms/stantonZone_peacefulStanton.ts`
- Background image description: Peaceful Stanton variant with calm village green/paths/buildings and gentle rural light.
- Background must not include: villagers/NPCs.
- Sprite objects: local clue items from active data.
- NPC/character sprites: village characters as sprites.
- Fixed background features: green, path, buildings, exits.
- Screen/overlay surfaces: signs/windows if dynamic.
- Hotspot candidates: `inspect green`, `inspect buildings`, `inspect path`, `inspect sign`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: soft wind, sunlight, birds/leaves.
- Prompt notes: Calm contrast to glitch/ascendant variants.
- Red-team notes: No people.
- Status: Needs source cross-check.

### pollysbay

- Source room file: `src/rooms/mazeZone_pollysbay.ts`
- Background image description: Bay-like or named maze pocket with water/shore or distinctive recess, depending on active room prose; should feel like a found place inside a wrong system.
- Background must not include: people/NPCs, stateful items.
- Sprite objects: bay clues, objects from active data.
- NPC/character sprites: Polly/any entity as sprite if active.
- Fixed background features: bay/recess, paths, exits.
- Screen/overlay surfaces: water/reflective surface if present.
- Hotspot candidates: `inspect bay`, `inspect water`, `inspect path`, `take item`, `talk <npc>`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: water ripple, echo, soft glow.
- Prompt notes: Needs source check for whether this is literal bay or named chamber.
- Red-team notes: Do not assume Polly is visible in background.
- Status: Needs source cross-check.

### secretmazeentry

- Source room file: `src/rooms/mazeZone_secretmazeentry.ts`
- Background image description: Hidden entrance to the maze with concealed doorway, threshold shadows and a clear before/after transition.
- Background must not include: people, active keys/clues.
- Sprite objects: key, note, markers from active data.
- NPC/character sprites: none unless active.
- Fixed background features: hidden door, wall/hedge/structure, entry path, exits.
- Screen/overlay surfaces: hidden glyph/lock if active.
- Hotspot candidates: `inspect hidden door`, `open door`, `inspect wall`, `inspect path`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: reveal shimmer, dust, shadow pulse.
- Prompt notes: Secret should be visible enough as hotspot.
- Red-team notes: Hidden but not impossible to find.
- Status: Needs source cross-check.

### secrettunnel

- Source room file: `src/rooms/mazeZone_secrettunnel.ts`
- Background image description: Narrow secret tunnel with rough walls, low ceiling, side recesses and clear route direction.
- Background must not include: people, takeable objects.
- Sprite objects: tunnel clues, keys, tools from active data.
- NPC/character sprites: none unless active.
- Fixed background features: tunnel, wall recesses, exits.
- Screen/overlay surfaces: none unless glyphs active.
- Hotspot candidates: `inspect tunnel`, `inspect recess`, `inspect wall`, `take item`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: lantern flicker, dust, dripping water.
- Prompt notes: Keep navigation clear despite narrowness.
- Red-team notes: No hidden figure silhouettes.
- Status: Needs source cross-check.

### shatteredrealm

- Source room file: `src/rooms/offmultiverseZone_shatteredrealm.ts`
- Background image description: Broken multiverse realm with floating fragments, fractured terrain and visible route anchors.
- Background must not include: people/entities, stateful relics.
- Sprite objects: shards, relics, keys from active data.
- NPC/character sprites: any entity as sprite.
- Fixed background features: fractured platforms, void, exits/rifts.
- Screen/overlay surfaces: portal/rift surfaces.
- Hotspot candidates: `inspect shard`, `inspect realm`, `inspect rift`, `take shard`, `go <exit>`.
- Exit hotspots: all active exits/rifts.
- Optional effects layer: floating debris, rift pulse, void shimmer.
- Prompt notes: Make walkable/usable surfaces clear.
- Red-team notes: No figures in void.
- Status: Needs source cross-check.

### silentStanton

- Source room file: `src/rooms/stantonZone_silentStanton.ts`
- Background image description: Silent Stanton variant, empty village space with muted light, stillness and absence as a visible pressure.
- Background must not include: people/villagers.
- Sprite objects: local clue objects from active data.
- NPC/character sprites: any entity as sprite if active.
- Fixed background features: buildings, empty green/street, paths, exits.
- Screen/overlay surfaces: windows/signs if dynamic.
- Hotspot candidates: `inspect silence`, `inspect buildings`, `inspect path`, `inspect window`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: barely moving leaves, dim light, distant hush.
- Prompt notes: Absence is the point; do not fill with people.
- Red-team notes: Keep visual interest through light/composition.
- Status: Needs source cross-check.

### stantonharcourt

- Source room file: `src/rooms/stantonZone_stantonharcourt.ts`
- Background image description: Base Stanton Harcourt village scene, grounded British village architecture and paths, subtly connected to its variants.
- Background must not include: villagers/NPCs, stateful items.
- Sprite objects: local objects/clues from active data.
- NPC/character sprites: locals as sprites.
- Fixed background features: village street/green/buildings, exits.
- Screen/overlay surfaces: sign/window surfaces.
- Hotspot candidates: `inspect village`, `inspect buildings`, `inspect sign`, `inspect path`, `talk <npc>`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: weather, light, leaves.
- Prompt notes: Establish recognisable baseline for variants.
- Red-team notes: No background villagers.
- Status: Needs source cross-check.

### stillamazeroom

- Source room file: `src/rooms/mazeZone_stillamazeroom.ts`
- Background image description: Another maze room whose joke is persistence: similar enough to be irritating, different enough to support navigation.
- Background must not include: people.
- Sprite objects: markers/clues from active data.
- NPC/character sprites: none unless active.
- Fixed background features: corridor exits, wall/floor variations.
- Screen/overlay surfaces: none unless active.
- Hotspot candidates: `inspect walls`, `inspect floor`, `inspect marking`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: mild echo, dust.
- Prompt notes: Distinguish through colour/marking/layout.
- Red-team notes: Avoid visual duplication with `mazeroom` and `anothermazeroom`.
- Status: Needs source cross-check.

### stkatherinesdock

- Source room file: `src/rooms/londonZone_stkatherinesdock.ts`
- Background image description: St Katharine Docks waterfront with moored boats, water, brick/warehouse architecture and London light.
- Background must not include: crowds/people/NPCs.
- Sprite objects: tickets, notes, keys, dockside clues from active data.
- NPC/character sprites: dock NPCs as sprites.
- Fixed background features: dock edge, boats, buildings, paths/exits.
- Screen/overlay surfaces: water reflections, sign surfaces.
- Hotspot candidates: `inspect water`, `inspect boats`, `inspect warehouse`, `inspect path`, `talk <npc>`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: water ripple, boat movement, city light shimmer.
- Prompt notes: Make exits obvious despite scenic detail.
- Red-team notes: No pedestrians baked in.
- Status: Needs source cross-check.

### storagechamber

- Source room file: `src/rooms/mazeZone_storagechamber.ts`
- Background image description: Maze storage chamber with shelves, crates, old supplies and route exits.
- Background must not include: people, takeable stateful contents.
- Sprite objects: keys, tools, notes, crate contents from active data.
- NPC/character sprites: none unless active.
- Fixed background features: shelving, crates as generic background stacks, exits.
- Screen/overlay surfaces: none unless active.
- Hotspot candidates: `inspect shelves`, `inspect crates`, `open crate`, `take item`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: dust, lantern flicker.
- Prompt notes: Keep important crates as sprite/overlay if contents change.
- Red-team notes: Do not bake open/closed state.
- Status: Needs source cross-check.

### torridon

- Source room file: `src/rooms/gorstanZone_torridon.ts`
- Background image description: Torridon landscape with rugged Scottish terrain, water/mountains/road or path depending on active data, atmospheric weather.
- Background must not include: people, vehicles if stateful.
- Sprite objects: local objects/clues from active data.
- NPC/character sprites: locals as sprites.
- Fixed background features: landscape, path/road, buildings or shoreline, exits.
- Screen/overlay surfaces: water/sky if effects.
- Hotspot candidates: `inspect mountains`, `inspect water`, `inspect path`, `inspect building`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: mist, rain, wind, water movement.
- Prompt notes: Atmospheric but navigable.
- Red-team notes: No people on path.
- Status: Needs source cross-check.

### torridoninn

- Source room file: `src/rooms/gorstanZone_torridoninn.ts`
- Background image description: Highland inn interior/exterior as active data dictates, with fixed bar/furniture/hearth/signage and warm refuge atmosphere.
- Background must not include: patrons/staff/NPCs, readable menu/sign text, takeable items.
- Sprite objects: drinks, notes, keys, local clues from active data.
- NPC/character sprites: innkeeper/patrons as sprites.
- Fixed background features: bar, tables, fireplace, doors/exits.
- Screen/overlay surfaces: sign/menu surfaces unreadable.
- Hotspot candidates: `inspect bar`, `inspect fireplace`, `inspect table`, `talk innkeeper`, `take item`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: fire flicker, warm light, rain on window.
- Prompt notes: Cosy but slightly off.
- Red-team notes: No patrons baked in.
- Status: Needs source cross-check.

### torridoninthepast

- Source room file: `src/rooms/gorstanZone_torridoninthepast.ts`
- Background image description: Past version of Torridon with period landscape/buildings, altered light and historically displaced atmosphere.
- Background must not include: period people/NPCs, stateful objects.
- Sprite objects: period clues, relics, notes from active data.
- NPC/character sprites: period figures as sprites.
- Fixed background features: historical landscape/buildings, paths, exits.
- Screen/overlay surfaces: time shimmer/portal if active.
- Hotspot candidates: `inspect landscape`, `inspect building`, `inspect path`, `inspect anomaly`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: time shimmer, mist, old light.
- Prompt notes: Clearly different from present Torridon.
- Red-team notes: No historical crowd.
- Status: Needs source cross-check.

### trentpark

- Source room file: `src/rooms/londonZone_trentpark.ts`
- Background image description: Trent Park scene with trees, paths, institutional/parkland history and London edge atmosphere.
- Background must not include: park users/NPCs.
- Sprite objects: notes, keys, clues from active data.
- NPC/character sprites: any park NPCs as sprites.
- Fixed background features: paths, trees, buildings/memorial features if active, exits.
- Screen/overlay surfaces: signs/windows if dynamic.
- Hotspot candidates: `inspect path`, `inspect trees`, `inspect building`, `inspect sign`, `talk <npc>`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: leaves, light, distant traffic/wind.
- Prompt notes: Avoid generic park; include distinctive landmark if active data supports it.
- Red-team notes: No people.
- Status: Needs source cross-check.

### villagegreen

- Source room file: `src/rooms/stantonZone_villagegreen.ts`
- Background image description: Village green with grass, path, buildings and fixed central feature such as tree/sign/bench if active.
- Background must not include: villagers/NPCs.
- Sprite objects: local clues/items from active data.
- NPC/character sprites: locals as sprites.
- Fixed background features: green, bench/tree/sign, surrounding buildings, exits.
- Screen/overlay surfaces: sign/window surfaces.
- Hotspot candidates: `inspect green`, `inspect bench`, `inspect sign`, `inspect buildings`, `talk <npc>`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: leaves, soft light, weather.
- Prompt notes: Useful baseline British outdoor room.
- Red-team notes: No villagers in background.
- Status: Needs source cross-check.

### windingpath

- Source room file: `src/rooms/mazeZone_windingpath.ts`
- Background image description: Winding path through maze/landscape with curving route, boundary walls/hedges and multiple visible route choices.
- Background must not include: people, stateful items.
- Sprite objects: markers, notes, clue objects from active data.
- NPC/character sprites: none unless active.
- Fixed background features: path, bends, walls/hedges, exits.
- Screen/overlay surfaces: glyphs/portals if active.
- Hotspot candidates: `inspect path`, `inspect bend`, `inspect wall`, `inspect marker`, `go <exit>`.
- Exit hotspots: all active exits.
- Optional effects layer: wind, dust/leaves, subtle shimmer.
- Prompt notes: Directionality must be visually obvious.
- Red-team notes: Avoid ambiguous inaccessible paths.
- Status: Needs source cross-check.

## Manual Geoff review list

- `dalesapartment`: confirm exact apartment layout, all exits, remote/keys object names, Dominic state rules and Mabel picture placement. Current instruction: Mabel picture remains fixed and visually important behind sofa; Dominic is sprite; remote and keys are sprites on side table near television; TV overlay-ready.
- `findlaterscornercoffeeshop`: confirm whether this is canonical Gorstan Café and whether Schrödinger coin belongs here visually.
- `findlaters`: clarify distinction from café room.
- `cafeoffice`: confirm exit target `cafe`/registered alias.
- `ravenchamber`: confirm active registration/source status before final image pass.
- All maze variants: final pass needed to make each visually distinct while preserving exits.
- Stanton variants: final pass needed to keep same-place continuity without baking in people.

## Conflict/uncertainty register

- Some rooms are populated from canonical registry id/title inference rather than full source extraction in this draft. Before generation, fetch each source module and replace generic entries with exact active description, exits, items and NPCs.
- The active registry excerpt includes many rooms but not `ravenchamber`; it may be special, orphaned, dynamically referenced or renamed. Do not generate it as canonical until confirmed.
- `findlaterscornercoffeeshop` is the likely Gorstan Café vertical-slice room, but naming should be confirmed.
- Any existing image that includes people should be treated as unsuitable for the new pipeline and replaced or reworked into background-only art.

## Validation statement

This is a documentation-only visual bible. No images were generated. No gameplay code, parser logic, SaveManager, room graph, startup flow or build configuration was changed.
