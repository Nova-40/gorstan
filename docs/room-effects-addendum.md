# Gorstan Room Effects Addendum

This addendum is intended to be merged into the room bible. It records which ambient effects each priority room should use.

The reusable implementation details live in:

```text
docs/effects-bible.md
```

The rule is simple:

```text
Room bible = which effects a room needs
Effects bible = how those effects work
```

## Room effect template

Each room entry in the room bible should gain a section like this:

```md
## Ambient Effects

| Effect | Preset | Priority | Trigger / Visibility | Notes |
|---|---|---:|---|---|
| Coffee steam | steam-small | High | coffeeVisible | Render above coffee cup sprite. |
```

Recommended priority levels:

```text
High    = needed for first visual slice
Medium  = adds useful atmosphere or state feedback
Low     = polish once room is already playable
```

## Gorstan Café

Purpose:

```text
First vertical slice room. Should immediately demonstrate that Gorstan is no longer only a static text/parser game.
```

Ambient effects:

| Effect | Preset | Priority | Trigger / Visibility | Notes |
|---|---|---:|---|---|
| Coffee steam | steam-small | High | coffee cup or machine active | Use above mug/machine, low opacity, slow loop. |
| Neon café sign flicker | neon-flicker | High | always visible | Irregular but not strobe-like. Gives the room its pulse. |
| Schrödinger coin shimmer | coin-shimmer | High | coin is present in room or inventory focus | Faint rim shimmer / double-image. Should signal oddness without screaming. |
| Coffee machine status light | status-light-blink | Medium | coffee machine visible | Small blue/green light on machine. |
| Doorway rain or street shadow | rain-window / doorway-shadow | Medium | west exit visible | Adds external life beyond the room. |
| Dust motes | dust-motes | Low | always visible | Very low opacity. Do not obscure hotspots. |

Suggested first implementation:

```text
steam-small
neon-flicker
coin-shimmer
```

## The Control Nexus

Purpose:

```text
Central command chamber. Should feel dormant but powerful, with screens and console systems barely alive.
```

Ambient effects:

| Effect | Preset | Priority | Trigger / Visibility | Notes |
|---|---|---:|---|---|
| Wall screen flicker | screen-flicker | High | screens visible | Multiple screens can share same preset with different timing offsets. |
| CRT scanlines | crt-scanlines | High | screens visible | Subtle overlay, not heavy. |
| Console core pulse | object-glow-soft | High | central console visible | Slow blue/white pulse. |
| Status lights | status-light-blink | Medium | console/cables visible | Small scattered blinks. |
| Cable spark | glitch-particles or small image | Medium | fault flag active | Rare event, not constant. |
| Warning light sweep | warning-light-sweep | Low/Conditional | alarm or lockdown state | Use only when state justifies it. |

Suggested first implementation:

```text
screen-flicker
crt-scanlines
console core pulse
```

## Glitchrealm Chamber

Purpose:

```text
Unstable reality chamber. Motion should feel wrong, digital, and slightly hostile.
```

Ambient effects:

| Effect | Preset | Priority | Trigger / Visibility | Notes |
|---|---|---:|---|---|
| Portal pulse | portal-pulse | High | portal visible | Slow breathing effect, not rapid flashing. |
| Glitch particles | glitch-particles | High | always or unstable flag | Sparse pixel fragments drifting and snapping. |
| Reality tear | glitch-tear | Medium | random/unstable flag | Rare horizontal tear flashes. |
| Unstable object shimmer | object-glow-soft / coin-shimmer | Medium | unstable object present | Use for quest objects or altered items. |
| Screen flicker | screen-flicker | Low/Conditional | if chamber has monitors | Optional based on final art. |

Suggested first implementation:

```text
portal-pulse
glitch-particles
```

## Library / Archive

Purpose:

```text
Quiet knowledge space. Atmosphere should be restrained: dust, lamps, faint living paper.
```

Ambient effects:

| Effect | Preset | Priority | Trigger / Visibility | Notes |
|---|---|---:|---|---|
| Dust motes | dust-motes | High | always visible | Slow and subtle. |
| Lamp flicker | lamp-flicker | High | lamps visible | Warm irregular light. |
| Scroll glow | object-glow-soft | Medium | important scroll visible | Use for constitution/AI/lore scrolls. |
| Map route movement | map-route-moving | Medium | map examined or active | SVG route line overlay. |
| Page flutter | image/spriteSheet | Low | book/scroll visible | Very subtle, not constant. |

Suggested first implementation:

```text
dust-motes
lamp-flicker
```

## Elfhame / Forest Shrine

Purpose:

```text
Folk-supernatural threshold. Animation should be organic, old, and slightly watchful.
```

Ambient effects:

| Effect | Preset | Priority | Trigger / Visibility | Notes |
|---|---|---:|---|---|
| Fireflies | fireflies | High | always visible or twilight flag | Sparse drifting lights. |
| Mist drift | mist-drift | High | always visible | Low opacity, does not obscure exits. |
| Lantern flicker | lamp-flicker | Medium | lantern visible | Warm, old, irregular. |
| Water ripple | water-ripple | Medium | pool/water/bowl visible | Small glint loop. |
| Glyph glow | object-glow-soft | Medium | shrine active | Slow glow around carved marks. |
| Leaf movement | image/CSS | Low | always visible | Optional later polish. |

Suggested first implementation:

```text
fireflies
mist-drift
```

## Findlater's Corner

Purpose:

```text
Colossal Cave-inspired oddity space. Should feel older, stranger, and text-adventure haunted.
```

Ambient effects:

| Effect | Preset | Priority | Trigger / Visibility | Notes |
|---|---|---:|---|---|
| Cursor blink | status-light-blink / CSS | High | terminal/text relic visible | Old terminal feeling. |
| Map route movement | map-route-moving | Medium | map active | Useful nod to exploration logic. |
| Dust motes | dust-motes | Medium | old interior visible | Low opacity. |
| Glitch tear | glitch-tear | Low/Conditional | reality fault active | Use sparingly for cross-over with Glitchrealm. |
| Object glow | object-glow-soft | Low/Conditional | special relic present | Highlight only quest-important objects. |

Suggested first implementation:

```text
cursor blink
dust motes
```

## New York / Greasy Storeroom

Purpose:

```text
Messy mundane room with questionable objects. Movement should be grimy and comic rather than magical.
```

Ambient effects:

| Effect | Preset | Priority | Trigger / Visibility | Notes |
|---|---|---:|---|---|
| Fluorescent flicker | neon-flicker / lamp-flicker | High | light visible | Cold, slightly unreliable. |
| Steam/smoke vent | steam-small | Medium | vent/machinery visible | Greasy kitchen/store ambience. |
| Drip/ripple | water-ripple | Low | puddle/sink visible | Optional. |
| Rodent/shadow movement | doorway-shadow | Low | ambient only | Very subtle; avoid implying clickable NPC unless intended. |

Suggested first implementation:

```text
fluorescent flicker
```

## London Café Office

Purpose:

```text
Office/café hybrid. Should feel lived-in, with screens and coffee doing quiet institutional work.
```

Ambient effects:

| Effect | Preset | Priority | Trigger / Visibility | Notes |
|---|---|---:|---|---|
| Coffee steam | steam-small | High | coffee visible | Same as Café but less theatrical. |
| Laptop/screen flicker | screen-flicker | High | screen visible | Small display glow. |
| Status light blink | status-light-blink | Medium | router/machine visible | Subtle office tech. |
| Rain-window | rain-window | Low | window visible | British weather, the final boss. |

Suggested first implementation:

```text
coffee steam
screen flicker
```

## General room bible integration note

When adding these to a room entry, keep the room entry concise:

```text
Ambient effects: steam-small, neon-flicker, coin-shimmer
```

Only expand with detailed implementation notes when the room uses an effect unusually.

The detailed behaviour should stay in `docs/effects-bible.md` so we do not maintain seventeen slightly different descriptions of steam. That way lies madness, or project management.
