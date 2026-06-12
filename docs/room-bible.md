# Gorstan Room Bible

This document captures room canon, visual direction, and production constraints for illustrated parser-first room backgrounds and associated hotspot/sprite planning.

## Global visual rules

- Modernised retro adventure-game artwork: lightly pixel-art inspired, painterly, polished, and readable.
- Front-facing room compositions suitable for parser-first point-and-click exploration.
- Atmospheric lighting and rich environmental detail without obscuring hotspots.
- Dry British, faintly surreal tone.
- Do not include people or NPCs in background plates; NPCs belong in separate sprite layers.
- Do not bake in takeable, movable, conditional, or stateful objects unless explicitly marked as fixed canonical background decor.
- Do not include readable UI text, dialogue, labels, subtitles, or signage.
- Screens, panels, indicators, and displays may be blank, abstract, glowing, or reserved for later animated overlays.
- Leave clear readable space for future hotspots, effects, and sprite placement.

---

# Zone: `introZone`

## Zone overview

The `introZone` functions as the player's early liminal entry sequence into Gorstan. It begins in an apparently mundane British setting, then quickly reveals the game's underlying logic of displacement, administrative wrongness, hidden infrastructure, and puzzle-gated transition.

This zone is not a normal geography. Rooms are connected as much by consequence, reset logic, and controlled transitions as by ordinary architecture.

## Core progression logic

```text
introstart
  -> crossing
    -> crossing the road triggers teleport to controlnexus
      -> sit in chair to access hiddenlab
      -> broader control infrastructure includes controlroom
        -> upstairs from controlroom is introreset
          -> chair + switch puzzle links onward to London Zone
```

## Zone tone

Dry British, bureaucratically surreal, quietly important, faintly ominous, occasionally absurd.

## Zone production rules

- No NPCs or people baked into background images.
- No readable UI text or signage.
- No takeable, movable, conditional, or stateful objects baked into the art unless explicitly listed as fixed canonical background elements.
- Keep room compositions front-facing and suitable for parser-first point-and-click exploration.
- Leave visual space for later hotspots, overlays, and sprite placement.

---

## Room: `introstart`

**Zone:** `introZone`

### Purpose

`introstart` is the opening landing zone and recovery point for moments when things go wrong. It is not merely a start room; it represents Gorstan's tendency to place the player somewhere administratively convenient rather than narratively sensible.

### Narrative function

This room introduces the player to the apparent mundanity of the introZone before the deeper wrongness emerges. It should feel like a place one is deposited into, rather than a place one chooses.

### Visual identity

A liminal British roadside or pavement setting with a municipal, slightly overcast feel. It should read as ordinary at first glance, but subtly off on second glance: too still, too arranged, too tidy, or too emotionally indifferent.

### Key fixed background elements

- Pavement or roadside verge.
- Road visible ahead or nearby.
- Visual route toward `crossing`.
- Generic municipal street furniture if useful, such as a lamp post, railings, bollard, or signpost shape without readable text.

### Exits and connections

- Primary route onward leads to `crossing`.

### Interaction notes

- The room should visually encourage movement onward rather than prolonged interaction.
- It should support the feeling that this is a holding place or start point in a system that resets people without apology.

### Tone notes

Mildly bleak, bureaucratic, faintly surreal, quietly funny in a deadpan way.

---

## Room: `crossing`

**Zone:** `introZone`

### Purpose

`crossing` is the apparent mundane transition point that triggers the player's displacement into the deeper logic of the introZone.

### Narrative function

This room is the first strong indication that Gorstan does not treat literal actions literally. Crossing the road does not simply move the player across a road; it triggers teleportation to `controlnexus`.

### Visual identity

A British road crossing that looks plausible, familiar, and slightly suspect. It should feel like a normal crossing until the player's attention lingers, at which point it begins to feel spatially untrustworthy.

### Key fixed background elements

- Road.
- Kerb and pavement.
- Crossing markings or crossing infrastructure.
- Signal pole, guard rail, or crossing furniture as fixed decor.
- A visible other side that somehow feels unconvincing or narratively unreliable.

### Exits and connections

- Attempting to cross the road triggers teleportation to `controlnexus`.

### Interaction notes

- This room is less about navigation and more about consequence.
- The visual route should clearly suggest "cross here", while the underlying logic remains concealed.

### Tone notes

Ordinary, dry, slightly uncanny; the sort of place where the paperwork says everything is perfectly straightforward.

---

## Room: `controlnexus`

**Zone:** `introZone`

### Purpose

`controlnexus` is a wrong-space destination room: a controlled, surreal chamber reached by displacement rather than normal travel.

### Narrative function

This room acts as a conceptual and mechanical pivot. It reveals that the player has entered an administered structure rather than a natural geography.

### Critical canon

`controlnexus` is not a normal hub room. It must not appear to offer ordinary travel routes to other rooms.

### Visual identity

A strange, controlled, high-significance chamber with a strong sense of purpose and containment. It should feel like a decision point, but not a public one. The room may appear technological, ceremonial, or infrastructural, but it should always feel deliberate.

### Key fixed background elements

- A central or significant chair.
- Architectural or technical design suggesting a controlled environment.
- Decorative or false doors/recesses may exist, but they must not read as real exits to other rooms.

### Exits and connections

- No ordinary door exits leading elsewhere.
- Sitting in the chair links to `hiddenlab`.

### Interaction notes

- The chair is the key functional object in the room.
- If doors or recesses are shown, they should appear sealed, recursive, symbolic, or otherwise non-traversable.
- This room should feel self-contained and slightly impossible.

### Tone notes

Controlled, strange, important, administrative, faintly threatening in a tidy sort of way.

---

## Room: `controlroom`

**Zone:** `introZone`

### Purpose

`controlroom` is part of the underlying system architecture behind the introZone. It gives physical form to the idea that Gorstan is managed, observed, or regulated.

### Narrative function

This room grounds the abstract wrongness of `controlnexus` in a more concrete technical environment. It suggests infrastructure, process, and hidden operational logic.

### Visual identity

A technical control environment with institutional character. It should feel like a place built to run or monitor systems rather than a glamorous sci-fi command bridge. Analogue, practical, slightly bureaucratic, possibly improvised over time.

### Key fixed background elements

- Control consoles, panels, or monitoring stations.
- Technical furniture or built-in systems.
- Architectural or visual cues suggesting vertical movement.
- Space for later interactive overlays on screens and panels.

### Exits and connections

- Upstairs leads to `introreset`.
- Downward spatial relationship exists with `hiddenlab`.
- `hiddenlab` is canonically below `controlroom`, though meaningful access is tied to sitting in the chair in `controlnexus`.

### Interaction notes

- The room should imply system operation and hidden depth.
- Screens should be blank, abstract, or suitable for later overlays rather than containing readable text.

### Tone notes

Institutional, technical, slightly neglected, practical rather than sleek.

---

## Room: `hiddenlab`

**Zone:** `introZone`

### Purpose

`hiddenlab` is the secret lower layer of the control infrastructure: a concealed research or systems chamber beneath the more visible control environment.

### Narrative function

This room reveals that the introZone is not merely strange, but actively built, managed, and possibly experimented upon.

### Visual identity

A hidden underground lab or technical chamber beneath `controlroom`. It should feel colder, more secretive, and more operational than the control room itself. The atmosphere should suggest restricted work, partial neglect, and enduring function.

### Key fixed background elements

- Analogue machinery and service hardware.
- Old terminals or technical workstations.
- Cable trays, pipes, conduits, or structural services.
- Reinforced doors, cabinets, storage, or warning-style infrastructure.
- Potential observation or containment features if useful.

### Exits and connections

- Accessed by sitting in the chair in `controlnexus`.
- Spatially positioned below `controlroom`.

### Interaction notes

- No loose takeable lab props should be baked into the background image.
- Displays should remain unreadable or abstract for future overlay work.
- The room should feel like somewhere important has been going on for some time, whether or not anyone is proud of it.

### Tone notes

Secret, cold, procedural, faintly sinister, but still grounded in British institutional practicality.

---

## Room: `introreset`

**Zone:** `introZone`

### Purpose

`introreset` is a major ceremonial reset/rest chamber and a pivotal puzzle room within the introZone. It anchors the route toward the London Zone.

### Narrative function

This room should immediately communicate significance. It is not merely another control-space room, but a chamber of consequence: calm, monumental, deliberate, and quietly absurd. It frames the chair-and-switch puzzle as something ritualistic, infrastructural, and important.

### Critical canon

- `introreset` is upstairs from `controlroom`.
- It is a huge room, clearly important.
- It is based visually on the interior of the Pantheon in Rome.
- A small high-tech office chair sits dead centre.
- A single switch sits close to the chair, slightly to one side.
- The switch must remain blank/neutral in the base art because its state will later change in-game:
  - unlit / neutral;
  - blue;
  - red;
  - flashing red.
- The chair and switch puzzle form the link to the London Zone.

### Visual identity

A vast monumental rotunda inspired by the Pantheon interior: circular, grand, architecturally imposing, and lit from above. It should feel ceremonial, ancient, and structurally important, while the tiny modern chair at the centre introduces the faintly comic and unsettling Gorstan contrast.

### Key fixed background elements

- Huge circular rotunda.
- Coffered dome / oculus-inspired overhead structure.
- Monumental architectural treatment.
- Small high-tech office chair dead centre.
- Single nearby switch pedestal or console, close to the chair.
- Open clear floor area around both for hotspot visibility.

### Exits and connections

- Upstairs location relative to `controlroom`.
- Puzzle progression links onward to the London Zone.

### Interaction notes

- The chair and switch are fixed canonical puzzle elements and should be visually prominent.
- The switch should not be pre-coloured in the base background.
- The room should remain uncluttered enough that the chair feels intentionally isolated at the centre of a massive space.

### Tone notes

Monumental, solemn, important, surreal, dryly absurd; as though empire, ritual, and office furniture have reached an uneasy compromise.
