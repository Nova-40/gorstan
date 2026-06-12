# Gorstan Room Image Bible — Route and Station-Hub Expansion

Status: Draft v3 addendum for `ROOM_IMAGE_BIBLE.md`.

This is documentation-only. It must not change parser logic, room graph logic, SaveManager, startup flow, teleport behaviour, or gameplay state. Active room modules remain implementation truth.

## Purpose

This addendum expands the room image bible so every zone has a route shape, a station-like hub, and an onward puzzle gate. It is intended to guide room art, hotspot planning, sprite placement, screen overlays, and later source cross-checking.

The visual model remains:

```text
background plate + object sprites + NPC sprites + hotspot map + optional effects layers
```

No background plate should contain people, named NPCs, Dominic, baristas, librarians, keepers, player characters, or other character-like figures. Characters remain sprites. Takeable, movable, conditional, clue, or stateful objects remain sprites.

## Source checks

- Canonical room list: `src/rooms/roomRegistry.ts`.
- Current fetched registry shows 68 registered rooms. If runtime reports 71, reconcile before claiming full all-room completion.
- Current registered zones: Intro, London, New York, Gorstan, Elfhame, Lattice, Maze, Glitch, Multi, Off-Gorstan, Off-Multiverse, Stanton.
- Current remote navigation appears curated, not universal. Universal remote access to all rooms should be treated as a target design until implementation is reviewed.

## Route architecture principle

Each zone should work like a small journey ending in a hub. Hubs are station-like transfer spaces. They do not all need to be literal railway stations; they should match their zone.

Every zone should support three route styles:

1. Canonical route — readable, fair, parser-first.
2. Surreal route — remote, mirror, portal, screen, chair, ritual, Fae, Glitchrealm, bureaucratic, or other Gorstan bypass.
3. Hard route — puzzle-heavy, conditional, misleading, or higher-risk.

Every hub should include:

- A clear onward transfer surface.
- At least five hotspots.
- Exit hotspots for visible paths.
- A puzzle-gate surface to the next zone.
- A return-anchor hotspot.
- Overlay-ready signage, route boards, maps, mirrors, screens, glyphs, timetable panels, platform indicators, or equivalent zone-native surfaces.
- No baked-in readable UI text.

## Proposed zone sequence

```text
Intro / Control complex
  -> London / Canary Wharf station
  -> New York / subway station
  -> Gorstan / Highland halt
  -> Elfhame / Fae waystation
  -> Lattice / crystalline interchange
  -> Maze / labyrinth turntable station
  -> Glitch / corrupted platform
  -> Off-Gorstan / archive terminus
  -> Off-Multiverse / liminal interchange
  -> Stanton / village halt
  -> final return / liminal master hub
```

The order is a design route for the visual bible, not gameplay truth until source-checked.

## Zone station hubs

### Intro Zone — Control Nexus Interchange

Rooms: `introstart`, `introreset`, `controlroom`, `controlnexus`, `hiddenlab`, `crossing`.

Hub: `controlnexus`.

Station concept: A circular command chamber behaving like the first interchange. Curved screens become departure boards, the command chair becomes a transfer seat, cables become route lines, and the console becomes the ticket gate nobody signed off properly.

Routes:

- Canonical: `introstart -> introreset -> controlroom -> controlnexus`.
- Surreal: `controlroom -> hiddenlab -> controlnexus` by unusual chair, screen, or console logic.
- Hard: `controlroom -> hiddenlab -> crossing -> controlnexus`.

Puzzle gate onward: Control activation lock to London.

Visual notes: keep the chair, console, curved screens, and west exit visually prominent. Screens must be overlay-ready.

### London Zone — Canary Wharf Station

Rooms: `londonhub`, `dalesapartment`, `findlaters`, `findlaterscornercoffeeshop`, `cafeoffice`, `stkatherinesdock`, `trentpark`.

Hub: `londonhub`.

Station concept: A Canary Wharf-style station concourse: glass, steel, polished surfaces, blank departure boards, escalators and gates leading to improbable places. No commuters in the background.

Routes:

- Canonical: `dalesapartment -> findlaterscornercoffeeshop -> cafeoffice/findlaters -> londonhub`.
- Surreal: `dalesapartment television/remote -> trentpark or stkatherinesdock -> londonhub`.
- Hard: `cafeoffice clue route -> findlaters -> trentpark -> londonhub`.

Puzzle gate onward: London route token / café clue / transport clue unlocks New York.

Visual notes: Dale’s Apartment remains the model room. Dominic is a sprite. Remote and keys are sprites on the side table near the TV. Mabel’s picture stays fixed and important behind the sofa. TV is overlay-ready.

### New York Zone — Manhattan Subway Interchange

Rooms: `manhattanhub`, `centralpark`, `burgerjoint`, `greasystoreroom`, `aevirawarehouse`.

Hub: `manhattanhub`.

Station concept: A New York subway station with tiled walls, platform edge, route map board, turnstiles, maintenance door, echoing track space, and overlay-ready signs. No passengers in the background.

Routes:

- Canonical: `londonhub -> manhattanhub -> centralpark -> burgerjoint -> aevirawarehouse -> manhattanhub`.
- Surreal: `remote -> manhattanhub -> greasystoreroom -> aevirawarehouse`.
- Hard: `burgerjoint clue -> greasystoreroom back route -> aevirawarehouse -> subway return`.

Puzzle gate onward: subway token / maintenance panel / warehouse clue unlocks Gorstan.

### Gorstan Zone — Highland Halt

Rooms: `gorstanhub`, `gorstanvillage`, `carronspire`, `torridon`, `torridoninn`, `torridoninthepast`.

Hub: `gorstanhub`.

Station concept: A Highland rural halt that is also a village green, stone platform, sheep pen, bus stop and dimensional route point. Slate, moss, mountain light, small shelter, stone route map, no people.

Routes:

- Canonical: `manhattanhub -> gorstanhub -> gorstanvillage -> torridon -> torridoninn -> gorstanhub`.
- Surreal: `remote -> torridoninthepast -> carronspire -> gorstanhub`.
- Hard: `torridon -> torridoninthepast -> carronspire -> route-lock return`.

Puzzle gate onward: Highland time/platform lock unlocks Elfhame.

### Elfhame Zone — Fae Waystation

Rooms: `elfhame`, `faeglade`, `faelake`, `faelakenorthshore`, `faepalacedungeons`, `faepalacemainhall`, `faepalacerhianonsroom`.

Hub: `faeglade` or `elfhame`.

Station concept: A station made from standing stones, roots, moonlit paths and Fae etiquette. Platforms are circles, thresholds, reflections and branches. No Fae figures in the background.

Routes:

- Canonical: `gorstanhub -> elfhame -> faeglade -> faelake -> faepalacemainhall -> faeglade/elfhame`.
- Surreal: `remote -> faeglade -> faelakenorthshore -> faepalacerhianonsroom -> faepalacemainhall`.
- Hard: `faepalacedungeons -> palace lock -> faepalacemainhall`.

Puzzle gate onward: court etiquette / moonlit standing-stone lock unlocks Lattice.

### Lattice Zone — Crystalline Interchange

Rooms: `latticehub`, `lattice`, `latticelibrary`, `hiddenlibrary`, `libraryofnine`, `latticeobservationentrance`, `latticeobservatory`, `latticespire`.

Hub: `latticehub`.

Station concept: A crystal signalling exchange. Facets are platforms, light paths are rails, and the route map is a crystal lattice.

Routes:

- Canonical: `faeglade/elfhame -> latticehub -> lattice -> latticelibrary -> hiddenlibrary -> libraryofnine -> latticehub`.
- Surreal: `remote -> latticeobservatory -> latticeobservationentrance -> latticespire -> latticehub`.
- Hard: `hiddenlibrary -> libraryofnine -> nine-shelf puzzle -> latticespire -> latticehub`.

Puzzle gate onward: nine-library / crystal alignment lock unlocks Maze.

### Maze Zone — Labyrinth Turntable Station

Rooms: `mazehub`, `mazeroom`, `anothermazeroom`, `stillamazeroom`, `labyrinthbend`, `windingpath`, `misleadchamber`, `mirrorhall`, `mazeecho`, `secretmazeentry`, `secrettunnel`, `forgottenchamber`, `storagechamber`, `pollysbay`.

Hub: `mazehub`.

Station concept: A rotating railway turntable inside a maze. Corridors act as platforms. Signs are unhelpful. Map boards are overlay-ready and faintly vindictive.

Routes:

- Canonical: `latticehub -> secretmazeentry -> mazeroom -> labyrinthbend -> mazehub`.
- Surreal: `remote -> mirrorhall -> mazeecho -> mazehub`.
- Hard: `misleadchamber -> windingpath -> forgottenchamber -> storagechamber -> mazehub -> pollysbay`.

Puzzle gate onward: echo/mirror/turntable lock unlocks Glitch.

Visual notes: Maze rooms must be visually distinct enough to avoid frustration. Mirror surfaces and echo cues must be overlay-ready.

### Glitch Zone — Corrupted Platform

Rooms: `glitchinguniverse`, `datavoid`, `failure`, `issuesdetected`, `moreissues`.

Hub: `glitchinguniverse`.

Station concept: A broken runtime pretending to be a station. Platform fragments, corrupted route boards, failed screens and static rails. No humanoid figures in the background.

Routes:

- Canonical: `mazehub -> glitchinguniverse -> issuesdetected -> moreissues -> failure -> glitchinguniverse`.
- Surreal: `remote -> datavoid -> glitchinguniverse`.
- Hard: `datavoid -> failure -> recovery path`.

Puzzle gate onward: runtime recovery lock unlocks Off-Gorstan.

Visual notes: error text and route boards must be overlay-ready, not baked into images.

### Off-Gorstan Zone — Archive Terminus

Rooms: `ancientslibrary`, `ancientsroom`, `ancientvault`, `arbitercore`, `echochamber`.

Hub: `arbitercore`.

Station concept: A terminal concourse inside an archive and judgement machine. Shelves are platforms; vault doors are gates; the judgement dais is the transfer barrier.

Routes:

- Canonical: `glitchinguniverse -> ancientslibrary -> ancientsroom -> ancientvault -> arbitercore`.
- Surreal: `remote -> echochamber -> arbitercore`.
- Hard: `ancientvault -> archive lock -> arbitercore -> echochamber return`.

Puzzle gate onward: archive judgement lock unlocks Off-Multiverse.

### Off-Multiverse Zone — Liminal Interchange

Rooms: `shatteredrealm`, `liminalhub`.

Hub: `liminalhub`.

Station concept: A station between realities: detached platforms, waiting-room geometry, numbered doors without readable numbers, route boards that cannot decide what they are.

Routes:

- Canonical: `arbitercore -> shatteredrealm -> liminalhub`.
- Surreal: `remote -> liminalhub -> any unlocked hub`.
- Hard: `shatteredrealm -> fractured path -> liminalhub`.

Puzzle gate onward: reality selection lock unlocks Stanton or final return.

### Stanton Zone — Village Halt

Rooms: `stantonharcourt`, `villagegreen`, `peacefulStanton`, `glitchStanton`, `silentStanton`, `ascendantStanton`.

Hub: `stantonharcourt` or `villagegreen`.

Station concept: An English village green behaving as a rural halt: bus stop, notice board, signpost, low platform edge, church path, and layered versions of the same place.

Routes:

- Canonical: `liminalhub -> stantonharcourt -> villagegreen -> peacefulStanton`.
- Surreal: `remote -> glitchStanton -> silentStanton -> stantonharcourt`.
- Hard: `silentStanton -> ascendantStanton -> glitchStanton -> villagegreen`.

Puzzle gate onward: version-state lock resolves the Stanton variants and final return.

Visual notes: Stanton variants must preserve recognisable layout continuity while changing mood, sky, lighting, damage/state, signage and effects.

## Puzzle-gate register

| Gate | Hub | Unlocks | Visual surface |
|---|---|---|---|
| First activation lock | `controlnexus` | London | console, chair, curved screens |
| Canary Wharf gate | `londonhub` | New York | ticket barriers, route board |
| Subway token lock | `manhattanhub` | Gorstan | turnstile, maintenance panel |
| Highland time lock | `gorstanhub` | Elfhame | timetable, standing stone, platform sign |
| Fae court lock | `faeglade` / `elfhame` | Lattice | standing stones, moonlit paths |
| Nine-library lock | `libraryofnine` / `latticehub` | Maze | pedestal, floor sigil, nine shelves |
| Maze turntable lock | `mazehub` | Glitch | turntable, mirror route, echo map |
| Runtime recovery lock | `glitchinguniverse` | Off-Gorstan | corrupted platform, route board |
| Archive judgement lock | `arbitercore` | Off-Multiverse | archive dais, vault gate |
| Liminal selection lock | `liminalhub` | Stanton / final return | impossible route board, doors |
| Stanton version lock | `stantonharcourt` / `villagegreen` | final return | noticeboard, signpost, state layers |

## Remote readiness requirement

Every room entry should gain this field:

```text
Remote teleport status: always / after zone unlock / after puzzle gate / restricted / developer-only / not yet reviewed.
```

Target design: once the remote is obtained and sufficiently unlocked, it should allow controlled travel to every registered room, or explicitly document why a room is excluded.

Current implementation follow-up: review `TeleportationMenu.tsx`. If universal access is intended, generate its destinations from the registered room list or a deliberate unlock table instead of the current curated list.

## Required next edits to `ROOM_IMAGE_BIBLE.md`

1. Merge this addendum after the `Canonical registered rooms` section.
2. Add route-readiness fields to every room entry:

```text
Route role:
Station-hub concept:
Canonical route:
Surreal route:
Hard route:
Zone transition / puzzle gate:
Remote teleport status:
Return-anchor:
Route signage / overlay surfaces:
```

3. Upgrade hub entries first: `controlnexus`, `londonhub`, `manhattanhub`, `gorstanhub`, `faeglade`/`elfhame`, `latticehub`, `mazehub`, `glitchinguniverse`, `arbitercore`, `liminalhub`, `stantonharcourt`/`villagegreen`.
4. Then upgrade remaining rooms zone-by-zone.
5. Do not generate all room images until exact active exits, items, NPCs and interactables have been source-checked for the relevant batch.
