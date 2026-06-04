# Gorstan Clickable Room Bible
_Generated for the hybrid parser / point-and-click visual adaptation of Gorstan._

This document defines a first-pass visual and interaction brief for every registered room in the current Gorstan room registry. It is intended as production documentation for creating illustrated room backgrounds, hotspot maps, ambient overlays, and click-to-parser command bindings.

## Global visual standard

All room images should use a modernised retro point-and-click adventure style: slightly pixel-art inspired, painterly and polished, front-facing or three-quarter readable compositions, clear object silhouettes, atmospheric lighting, no UI labels baked into the artwork, and enough visual hierarchy that hotspots are obvious without glowing like a Christmas complaint form.

## Hotspot interaction standard

Clickable hotspots should dispatch parser-equivalent commands. Do not create a separate game logic path for clicking. Doors and paths default to travel. Removable objects default to take/examine. Fixed objects default to examine/use/read/talk as appropriate. Conditional exits must call the same command or action already used by the parser/state engine.

## Room catalogue

## introZone

### The Control Nexus
- **Room ID:** `introZone_controlnexus`
- **Image description:** Circular high-tech command chamber lit by dim blue system light. Curved walls carry dark diagnostic screens; a central console and command chair dominate the room while thick cables snake across the polished floor. The room feels dormant, important, and quietly impatient.
- **Clickable hotspots:** console: use/examine/activate; chair: sit/examine; screens: examine/activate; cables: examine/trace; west exit: go west to Control Room; hidden lab route: sit in chair.

### Control Room
- **Room ID:** `introZone_controlroom`
- **Image description:** Secondary operations room connected to the Nexus. More practical than ceremonial, with terminals, status boards, emergency panels, failed lighting and abandoned technical clutter. It feels like somewhere someone tried to keep the impossible running using procedures, labels and perhaps tea.
- **Clickable hotspots:** terminals: use/examine; status boards: read/examine; emergency panel: use/examine; logs/paperwork: read; exit to Nexus: travel.

### Crossing
- **Room ID:** `introZone_crossing`
- **Image description:** A transitional junction where corridors, paths or platforms meet. The architecture should feel slightly unreliable: a crossing between ordinary movement and multiverse navigation, with flickering signage and lighting that cannot quite decide what direction it supports.
- **Clickable hotspots:** directional signs: read/examine; unstable path: travel/examine; floor markings: examine; wall panel: use/examine; visible exits: travel.

### Hidden Lab
- **Room ID:** `introZone_hiddenlab`
- **Image description:** Concealed research chamber behind or beneath the Nexus. Benches, prototype devices, sealed cases, monitors, specimen jars or impossible instruments imply serious work interrupted suddenly. Secret, clever and worryingly under-documented.
- **Clickable hotspots:** lab bench: examine/use; prototype device: examine/use; sealed cabinet: open/examine; research notes: read; monitor: use/read; exit back: travel.

### Intro Reset
- **Room ID:** `introZone_introreset`
- **Image description:** Deliberately artificial reset space. Sterile walls, warning panels, clean floor, inactive machinery and a sense that the game is quietly asking whether you meant to do that. Functional rather than welcoming.
- **Clickable hotspots:** reset device: use/examine; warning screen: read; exit route: travel; status panel: examine; floor marker: examine.

### Intro Start
- **Room ID:** `introZone_introstart`
- **Image description:** Opening space: simple, readable and slightly wrong. Ordinary details are present, but the edges suggest the world is waiting to load, align or confess something.
- **Clickable hotspots:** opening object: examine/take if removable; first sign/prompt: read; first exit: travel; anomaly: examine; environment: look.

## londonZone

### London Hub
- **Room ID:** `londonZone_londonhub`
- **Image description:** Stylised London navigation hub: wet pavements, street furniture, transport signage and urban noise. Normal city life is present, but dimensional oddness leaks through corners and reflections.
- **Clickable hotspots:** street map: read/use; signs: read; pavement anomaly: examine; street exits: travel; noticeboard: read; transport entrance: travel.

### Findlater's
- **Room ID:** `londonZone_findlaters`
- **Image description:** Exterior or threshold of Findlater's: old London frontage with warm windows, aged brickwork, an inviting door and a sign that feels as though it has existed longer than the lease permits.
- **Clickable hotspots:** front door: enter/travel; sign: read/examine; windows: examine; street exit: travel; poster/menu: read.

### Findlater's Corner Coffee Shop
- **Room ID:** `londonZone_findlaterscornercoffeeshop`
- **Image description:** Warm corner coffee shop with exposed brick walls, mismatched vintage furniture, polished wooden counter, espresso machine, pastries, neighbourhood photographs and golden morning light. Cosy, familiar and slightly uncanny.
- **Clickable hotspots:** barista: talk/order; coffee counter: examine/order; menu: read; wall photos: examine/read captions; corner booth: sit/examine; coffee machine: examine/listen; forgotten notebook: examine/take if allowed; north/south/east exits: travel.

### Cafe Office
- **Room ID:** `londonZone_cafeoffice`
- **Image description:** Cramped back office behind the coffee shop: desk, filing trays, staff rota, old computer, invoices, shelves and the uncomfortable sense that mundane administration has become plot-critical.
- **Clickable hotspots:** desk: examine/search; computer: use; files: read/search; staff rota: read; shelves: examine; back door/exit: travel.

### Dale's Apartment
- **Room ID:** `londonZone_dalesapartment`
- **Image description:** Lived-in London flat full of personal history: books, papers, worn furniture, window light and domestic clutter. It suggests identity, memory and private life without melodrama.
- **Clickable hotspots:** desk: examine/search; personal papers: read; window: examine; sofa/bed: sit/examine; bookshelf: browse; door exit: travel.

### St Katharine's Dock
- **Room ID:** `londonZone_stkatherinesdock`
- **Image description:** Waterside London scene with marina, moored boats, stone walkways, glass reflections and gulls. The water is visually important, with reflections that may be slightly too meaningful.
- **Clickable hotspots:** dockside path: travel; boats: examine; water/reflection: examine; sign/map: read; bench/railings: examine; exits: travel.

### Trent Park
- **Room ID:** `londonZone_trentpark`
- **Image description:** Green parkland with mature trees, paths, benches and an old estate or institutional atmosphere beneath the calm. Open, British, and faintly watched by history.
- **Clickable hotspots:** park paths: travel; bench: sit/examine; old marker/building: examine/read; trees: examine; hidden clue: search/examine.

## gorstanZone

### Gorstan Hub
- **Room ID:** `gorstanZone_gorstanhub`
- **Image description:** Central navigation point for Gorstan. Old stone, rural paths, weathered signs and an uncanny village logic. It must feel like a hub without becoming a menu screen.
- **Clickable hotspots:** signpost: read/use; central marker: examine; village path: travel; mountain/loch route: travel; unusual object: examine.

### Gorstan Village
- **Room ID:** `gorstanZone_gorstanvillage`
- **Image description:** Remote atmospheric village with stone cottages, rough paths, a noticeboard or sign, moody sky and the feeling that old secrets are treated locally as an inconvenience rather than a revelation.
- **Clickable hotspots:** village sign: read; noticeboard: read; cottage door: knock/enter/examine; road exits: travel; central landmark/well: examine/use.

### Torridon
- **Room ID:** `gorstanZone_torridon`
- **Image description:** Dramatic Highland landscape with loch, mountains, cold air and sweeping weather. Beautiful, exposed and mythic without losing physical reality.
- **Clickable hotspots:** loch edge: examine; mountain path: travel; distant inn route: travel; strange landmark: examine; shoreline object: examine/take if allowed.

### Torridon Inn
- **Room ID:** `gorstanZone_torridoninn`
- **Image description:** Warm inn interior with firelight, wooden beams, a bar, local maps, old photographs and storm or cold weather pressing outside. A place for gossip, refuge and inconvenient truths.
- **Clickable hotspots:** bar: talk/order/examine; fireplace: examine/warm hands; maps: read/examine; photographs: examine; door exit: travel; locals/NPC area: talk.

### Torridon in the Past
- **Room ID:** `gorstanZone_torridoninthepast`
- **Image description:** Historical version of Torridon or the inn: familiar geography stripped of modern traces. Older furnishings, lower light and period objects make the temporal displacement readable.
- **Clickable hotspots:** period objects: examine; old hearth: examine; historic door/path: travel; inscription/document: read; temporal anomaly: examine/use.

### Carron Spire
- **Room ID:** `gorstanZone_carronspire`
- **Image description:** Tall exposed spire or tower set in rugged terrain. Wind, lichen, old stone, height and sky dominate. Ancient, dangerous and purposeful.
- **Clickable hotspots:** spire entrance: enter/travel; inscription: read; summit path/stairs: travel; exposed edge: examine; view: examine; relic/marker: examine/use.

## elfhameZone

### Elfhame
- **Room ID:** `elfhameZone_elfhame`
- **Image description:** Enchanted woodland realm of ancient trees, luminous mist and impossible greens and blues. Beautiful, courtly and not safe; a real place operating under different rules.
- **Clickable hotspots:** forest paths: travel; glowing plants: examine; arch/root gate: enter/examine; hidden symbol: read/examine; fae light: examine.

### Fae Glade
- **Room ID:** `elfhameZone_faeglade`
- **Image description:** Circular woodland clearing with soft magical light, flowers, mushrooms, roots and possibly standing stones. Inviting but consequential.
- **Clickable hotspots:** standing stones: examine/touch; flowers: examine/smell/take if allowed; mushroom ring: examine/enter; tree roots: examine; glade paths: travel; glowing marker: use/examine.

### Fae Lake
- **Room ID:** `elfhameZone_faelake`
- **Image description:** Still luminous lake with mirrored surface, reeds, drifting lights and a reflection that feels more informed than it should be.
- **Clickable hotspots:** lake surface/reflection: examine; reeds: examine/search; shoreline path: travel; floating lights: examine; water edge: use/examine.

### Fae Lake North Shore
- **Room ID:** `elfhameZone_faelakenorthshore`
- **Image description:** Colder, quieter edge of the lake with darker trees, stones and mist. The palace or deeper fae territory may be glimpsed beyond the waterline.
- **Clickable hotspots:** shore stones: examine; mist path: travel; distant palace route: travel; lake water: examine; hidden marker: search/examine.

### Fae Palace Main Hall
- **Room ID:** `elfhameZone_faepalacemainhall`
- **Image description:** Grand organic palace hall with impossible height, carved wood or stone, living branches, banners and courtly power. Beautiful, formal and institutionally dangerous.
- **Clickable hotspots:** throne/dais: examine/approach; banners: examine/read; side doors: travel; guards/NPC space: talk; carved symbols: examine.

### Fae Palace Dungeons
- **Room ID:** `elfhameZone_faepalacedungeons`
- **Image description:** Elegant captivity: damp stone, roots through walls, pale magical light, iron restraints and cell doors. Cruelty with excellent interior design, because apparently that helps.
- **Clickable hotspots:** cell doors: open/examine; chains/iron: examine; barred window: examine; loose stone/root: search; hidden passage: travel if revealed.

### Rhiannon's Room
- **Room ID:** `elfhameZone_faepalacerhianonsroom`
- **Image description:** Private fae chamber with silks, mirror, strange flowers, delicate furniture and personal objects. Intimate, beautiful and dangerous to misread.
- **Clickable hotspots:** mirror: examine/use; dressing table: search/examine; flowers: examine; window/balcony: examine; personal artefact: examine/take if allowed; door exit: travel.

## glitchZone

### Data Void
- **Room ID:** `glitchZone_datavoid`
- **Image description:** Black digital emptiness filled with floating fragments, broken interface panels, corrupted geometry and stars made of code. Minimal but visually striking.
- **Clickable hotspots:** data fragments: examine/take if allowed; error panel: read/use; exit portal: travel; floating platform: travel; void anomaly: examine.

### Failure
- **Room ID:** `glitchZone_failure`
- **Image description:** System-failure chamber with red warnings, broken architecture, collapsed interface logic and frozen alarms. A machine having an existential admin incident.
- **Clickable hotspots:** warning console: read/use; broken door: examine/travel if possible; error log: read; reset point: use; alarm light: examine.

### Glitching Universe
- **Room ID:** `glitchZone_glitchinguniverse`
- **Image description:** Surreal cosmic environment where stars, nebulae and fragments of reality are visibly glitching and tearing apart. Wonder and instability in the same frame.
- **Clickable hotspots:** rift: examine/enter if valid; floating path/platform: travel; corrupted fragment: examine/take if allowed; broken starfield: examine; portal/exit: travel.

### Issues Detected
- **Room ID:** `glitchZone_issuesdetected`
- **Image description:** Diagnostic error room with screens listing problems, bureaucratic severity ratings, amber warning lights and the phrase 'action required' implied everywhere. Absurdly procedural.
- **Clickable hotspots:** issue board: read; diagnostic console: use/read; warning lights: examine; printout/log: read; exit: travel.

### More Issues
- **Room ID:** `glitchZone_moreissues`
- **Image description:** Escalated diagnostic room drowning in overlapping alerts, recursive tickets and panicked system bureaucracy. Too many warnings to be useful, naturally.
- **Clickable hotspots:** ticket stack: read/examine; overloaded display: read/use; panic button: press/examine; error cascade: examine; exit: travel.

### Raven Chamber
- **Room ID:** `glitchZone_ravenchamber`
- **Image description:** Dark chamber with raven motif: black stone, feathers, watchful eyes, glitch particles and a ceremonial-meets-digital atmosphere.
- **Clickable hotspots:** raven statue/NPC: examine/talk; altar: examine/use; feathers: examine/take if allowed; dark portal: travel/examine; wall symbols: read.

## latticeZone

### Lattice Hub
- **Room ID:** `latticeZone_latticehub`
- **Image description:** Geometric hub of glowing lines and suspended routes. It should feel like an observatory, network diagram and transit interchange combined with more confidence than is justified.
- **Clickable hotspots:** central node: examine/use; glowing map: read/use; lattice paths: travel; route pylons: examine; exits: travel.

### Lattice
- **Room ID:** `latticeZone_lattice`
- **Image description:** Abstract connective space of luminous gridlines, floating platforms and transparent geometry. Routes between realities are visible as structure rather than metaphor.
- **Clickable hotspots:** grid lines: examine/trace; floating platforms: travel; unstable link: examine/use; node: use; exits: travel.

### Lattice Library
- **Room ID:** `latticeZone_latticelibrary`
- **Image description:** Library merged with impossible geometry: suspended shelves, glowing paths, books arranged with unnerving intelligence and knowledge built into the structure.
- **Clickable hotspots:** main shelves: browse/examine; catalogue desk: use/read; reading stand: read/examine; glowing lattice lines: trace/examine; restricted section: examine/unlock if possible; exit paths: travel.

### Hidden Library
- **Room ID:** `latticeZone_hiddenlibrary`
- **Image description:** Secret archive darker and older than the main library. Dust, locked shelves, forbidden catalogues and the particular silence of information that has learned not to volunteer.
- **Clickable hotspots:** locked shelves: examine/unlock; hidden book: examine/read/take if allowed; desk: search; concealed door: travel if revealed; catalogue: read/use.

### Library of Nine
- **Room ID:** `latticeZone_libraryofnine`
- **Image description:** Formal mystical library with nine alcoves, nine symbols and nine implied bodies of knowledge. Strong symmetry, quiet pressure and an institutional refusal to explain itself plainly.
- **Clickable hotspots:** nine alcoves: examine; central lectern: read/use; symbols: read/examine; restricted shelf: examine; exit: travel.

### Lattice Observation Entrance
- **Room ID:** `latticeZone_latticeobservationentrance`
- **Image description:** Antechamber to the observatory: warning panels, lenses, stairs or gantry and a view of impossible geometry beyond. A threshold into measured impossibility.
- **Clickable hotspots:** warning panel: read; gate/door: open/travel; stairs/gantry: travel; observation window: examine; instrument case: examine.

### Lattice Observatory
- **Room ID:** `latticeZone_latticeobservatory`
- **Image description:** Celestial-mechanical observatory inside the Lattice. Giant lens, star maps, dimensional instruments and a sense that observation itself changes the thing observed.
- **Clickable hotspots:** giant lens/telescope: use/examine; star map: read/examine; control wheel/panel: use; dimensional instruments: examine; exit: travel.

### Lattice Spire
- **Room ID:** `latticeZone_latticespire`
- **Image description:** Tall luminous tower of latticework open to an impossible sky. Energy flows upward through precarious walkways and balcony-like views.
- **Clickable hotspots:** spire stairs: travel; energy column: examine/use; balcony/view: examine; control node: use; exit path: travel.

## mazeZone

### Maze Hub
- **Room ID:** `mazeZone_mazehub`
- **Image description:** Central junction of the maze: confusing but organised enough to pretend it is helping. Multiple exits, suspicious signposting and one or two orientation clues.
- **Clickable hotspots:** north/east/south/west exits: travel; signpost: read/examine; wall markings: examine; central floor marker: examine; misleading feature: examine.

### Maze Room
- **Room ID:** `mazeZone_mazeroom`
- **Image description:** Generic but suspicious maze chamber. Similar to other rooms, but with one distinct clue to orientation so the player can blame themselves only partly.
- **Clickable hotspots:** exits: travel; clue mark: examine; loose stone: examine/use; wall inscription: read.

### Another Maze Room
- **Room ID:** `mazeZone_anothermazeroom`
- **Image description:** Variant maze room that looks almost the same as the last one, but not quite. Repetition with one altered object or mark to reward attention.
- **Clickable hotspots:** exits: travel; repeated clue: examine; altered feature: examine; suspicious stone: use/examine.

### Still a Maze Room
- **Room ID:** `mazeZone_stillamazeroom`
- **Image description:** The gag escalates: another similar stone maze room with a new absurd detail proving that it is not literally identical, merely committed to the bit.
- **Clickable hotspots:** exits: travel; absurd object: examine/take if allowed; wall mark: examine; floor scuff: examine.

### Maze Echo
- **Room ID:** `mazeZone_mazeecho`
- **Image description:** Echoing chamber with curved walls, repeated sound motifs and possibly visual repetition of silhouettes or text fragments. Sound should feel like a clue.
- **Clickable hotspots:** echo point: listen/use; curved wall: examine; exits: travel; acoustic clue: examine/listen.

### Labyrinth Bend
- **Room ID:** `mazeZone_labyrinthbend`
- **Image description:** Curving corridor section with no clear horizon. Torchlight, stone or hedge walls and a sense of being gently herded by the maze.
- **Clickable hotspots:** bend exits: travel; torch/light source: examine; wall scratch: examine; floor track: examine.

### Winding Path
- **Room ID:** `mazeZone_windingpath`
- **Image description:** Twisting path, either outdoor or semi-outdoor, with hedges or stone boundaries. Perspective should mislead the eye without making navigation unreadable.
- **Clickable hotspots:** path exits: travel; hedge gap: examine/travel if valid; marker stone: read/examine; distant turn: examine.

### Mislead Chamber
- **Room ID:** `mazeZone_misleadchamber`
- **Image description:** Room designed to deceive: wrong arrows, false doors, painted exits, over-helpful signage and a floor that may be lying by omission.
- **Clickable hotspots:** false door: examine; real exit: travel; signs/arrows: read; suspicious floor: examine; hidden mechanism: use if found.

### Mirror Hall
- **Room ID:** `mazeZone_mirrorhall`
- **Image description:** Hall of mirrors with distorted exits and reflections that do not quite match. The room should make players doubt direction, identity and basic interior design choices.
- **Clickable hotspots:** mirrors: examine; cracked mirror: examine/use; reflected door: examine; real door/exits: travel; distorted reflection: examine.

### Forgotten Chamber
- **Room ID:** `mazeZone_forgottenchamber`
- **Image description:** Dusty neglected room hidden within the maze. Old storage, lost notes, a forgotten mechanism and a sense that even the maze mislaid this place.
- **Clickable hotspots:** old chest: open/examine; note: read; mechanism: use/examine; dusty shelves: search; hidden exit: travel if revealed.

### Storage Chamber
- **Room ID:** `mazeZone_storagechamber`
- **Image description:** Practical storage chamber with crates, barrels, tools and spare nonsense. One useful object may hide among the deeply unglamorous clutter.
- **Clickable hotspots:** crates: search/examine; barrel: open/examine; tool rack: examine/take if allowed; shelves: search; exit: travel.

### Secret Maze Entry
- **Room ID:** `mazeZone_secretmazeentry`
- **Image description:** Concealed entrance into the maze hidden behind ordinary architecture, landscape or an apparently decorative feature. The scene should reward suspicion.
- **Clickable hotspots:** concealed door: open/examine; trigger object: use/examine; path inward: travel; surrounding wall/hedge: search; sign/mark: read.

### Secret Tunnel
- **Room ID:** `mazeZone_secrettunnel`
- **Image description:** Narrow underground passage with damp walls, low ceiling, lantern light, roots or pipes. Claustrophobic but navigable.
- **Clickable hotspots:** tunnel exits: travel; loose brick: examine/use; lantern: examine/take if allowed; hidden niche: search; roots/pipes: examine.

### Polly's Bay
- **Room ID:** `mazeZone_pollysbay`
- **Image description:** Sudden coastal or harbour break from the maze: bay water, rocks, shoreline and strange peace after enclosed corridors. It should feel like a relief that may not be trustworthy.
- **Clickable hotspots:** shoreline: travel/examine; rocks: examine/search; water: examine; boat/object: examine/use; path back: travel.

## multiZone

### Liminal Hub
- **Room ID:** `multiZone_liminalhub`
- **Image description:** Between-worlds waiting room: calm, uncanny, multiple doors or portals, neutral lighting and signage that almost helps. A transit lounge for impossible geography.
- **Clickable hotspots:** portals/doors: travel/examine; noticeboard: read; central bench: sit/examine; route selector: use; anomaly: examine.

## newyorkZone

### Manhattan Hub
- **Room ID:** `newyorkZone_manhattanhub`
- **Image description:** Busy stylised Manhattan junction with tall buildings, steam vents, signage, traffic energy and dimensional overlay. Urban movement with a fault line underneath.
- **Clickable hotspots:** street exits: travel; subway sign/entrance: read/travel; city map: read/use; steam vent: examine; anomaly: examine.

### Central Park
- **Room ID:** `newyorkZone_centralpark`
- **Image description:** Green park scene with paths, benches, trees and skyline beyond. Calm and recognisable, with story weirdness intruding from the edges.
- **Clickable hotspots:** bench: sit/examine; park paths: travel; trees: examine; skyline/viewpoint: examine; hidden object/clue: search.

### Burger Joint
- **Room ID:** `newyorkZone_burgerjoint`
- **Image description:** Neon-lit diner or burger place with counter, booths, grill, menu boards and grease. Charming, bright and suspiciously meaningful around the condiments.
- **Clickable hotspots:** counter: order/talk/examine; menu board: read; booths: sit/examine; kitchen door: travel/examine; condiments/tray: examine/use.

### Greasy Storeroom
- **Room ID:** `newyorkZone_greasystoreroom`
- **Image description:** Back room of the burger joint: boxes, oil containers, mop bucket, fuse box and cramped practical ugliness. The glamour has gone out for a cigarette.
- **Clickable hotspots:** boxes: search/examine; fuse box: use/examine; mop bucket: examine; shelves: search; back door/exit: travel.

### Aevira Warehouse
- **Room ID:** `newyorkZone_aevirawarehouse`
- **Image description:** Industrial warehouse with corporate science-fiction hints: crates, forklifts, sealed containers, surveillance and cold blue-white lighting. Practical, guarded and faintly corporate-villainous.
- **Clickable hotspots:** crates: search/examine; sealed container: examine/open if allowed; security panel: use; office door: travel/examine; camera/surveillance: examine.

## offgorstanZone

### Ancients' Room
- **Room ID:** `offgorstanZone_ancientsroom`
- **Image description:** Ancient chamber outside normal Gorstan: carved stone, old symbols, ceremonial layout and quiet authority. It should feel less abandoned than waiting.
- **Clickable hotspots:** altar/table: examine/use; carved symbols: read/examine; doorway: travel; relic: examine/take if allowed; central floor design: examine.

### Ancients' Library
- **Room ID:** `offgorstanZone_ancientslibrary`
- **Image description:** Archive of the Ancients with tall shelves, stone tablets, scrolls or books, cold light and knowledge that carries consequences.
- **Clickable hotspots:** shelves: browse/examine; stone tablets: read; reading stand: read/use; locked section: examine/unlock if possible; exit: travel.

### Ancient Vault
- **Room ID:** `offgorstanZone_ancientvault`
- **Image description:** Secure vault chamber with heavy doors, seals, an artefact plinth and guarded silence. The room should feel protective rather than merely locked.
- **Clickable hotspots:** vault door: open/examine; seals: read/examine/use; artefact plinth: examine; hidden mechanism: search/use; exit: travel.

### Arbiter Core
- **Room ID:** `offgorstanZone_arbitercore`
- **Image description:** Central judgement machine or entity: huge core, balanced geometry, severe light and legalistic cosmic dread. Order made architecture.
- **Clickable hotspots:** core: examine/use; judgement panel: read/use; access nodes: activate/examine; inscriptions: read; exit: travel.

### Echo Chamber
- **Room ID:** `offgorstanZone_echochamber`
- **Image description:** Resonant chamber where voices, choices or memories repeat. Circular walls, sound/light ripples and inscriptions make consequence visible.
- **Clickable hotspots:** central circle: stand/use/examine; inscriptions: read; echo point: listen; wall ripples: examine; exit: travel.

## offmultiverseZone

### Shattered Realm
- **Room ID:** `offmultiverseZone_shatteredrealm`
- **Image description:** Broken reality landscape with floating islands, torn sky, fractured architecture and pieces of multiple worlds suspended together. Awe, loss and danger.
- **Clickable hotspots:** floating path: travel; rift: examine/enter if valid; broken monument: examine/read; unstable exit: travel; world fragment: examine.

## stantonZone

### Stanton Harcourt
- **Room ID:** `stantonZone_stantonharcourt`
- **Image description:** Grounded Oxfordshire village scene: stone houses, lane, old buildings, church or village architecture and rural light. Real-world anchor for the absurdity.
- **Clickable hotspots:** village road/path: travel; house/frontage: examine; sign: read; old building/church view: examine; notice/object: read/examine.

### Village Green
- **Room ID:** `stantonZone_villagegreen`
- **Image description:** Open English village green with paths, bench, noticeboard or sign, mature trees and old stone buildings beyond. Calm, readable and recognisable.
- **Clickable hotspots:** bench: sit/examine; noticeboard: read; tree: examine; village sign: read; path exits: travel; background building entrance: travel/examine.

### Peaceful Stanton
- **Room ID:** `stantonZone_peacefulStanton`
- **Image description:** Idealised calm version of Stanton: warm light, stillness, tidy green, soft sky and a sense of restored order. Ordinary England as a safe state.
- **Clickable hotspots:** paths: travel; green: examine; house/church view: examine; calm focal point: examine; bench/tree: sit/examine.

### Silent Stanton
- **Room ID:** `stantonZone_silentStanton`
- **Image description:** Empty, muted version of Stanton: deserted lanes, desaturated light, no birdsong, closed doors and blank windows. The absence should be the main feature.
- **Clickable hotspots:** empty road: travel; closed doors: knock/examine; silent noticeboard: read; blank windows: examine; exit paths: travel.

### Glitch Stanton
- **Room ID:** `stantonZone_glitchStanton`
- **Image description:** Stanton corrupted by digital and visual errors: pixel tears through cottages, duplicated signs, broken sky and normal village features misrendered.
- **Clickable hotspots:** glitch rift: examine/use; corrupted sign: read; village path: travel; unstable object: examine/take if allowed; broken sky/reflection: examine.

### Ascendant Stanton
- **Room ID:** `stantonZone_ascendantStanton`
- **Image description:** Transformed Stanton elevated into mythic or cosmic form: glowing paths, charged old stone, impossible sky and village features carrying symbolic power.
- **Clickable hotspots:** ascendant monument: examine/use; glowing path: travel; sky portal: examine/travel if valid; charged stone: examine; village core: use/examine.
