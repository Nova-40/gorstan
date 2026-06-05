# Gorstan Effects Bible

This document defines reusable animation and atmosphere effects for Gorstan's hybrid parser / point-and-click room interface.

The effects system exists to make illustrated rooms feel alive without turning each room into a video file or duplicating game logic in artwork.

## 1. Core principle

Rooms should be built from layers:

```text
base room illustration
+ static object/item sprites
+ ambient animated effects
+ clickable hotspot overlay
+ parser/text UI
```

Effects are visual atmosphere. They should not own game state. The parser and engine remain authoritative.

Examples:

```text
coffee steam       = visual effect
coin shimmer       = visual effect reflecting item presence
exit glow          = visual affordance
screen blinking    = ambient animation
portal pulse       = room state presentation
```

## 2. Supported effect types

The visual renderer should support these effect types:

```ts
type RoomEffectType =
  | 'css'
  | 'image'
  | 'spriteSheet'
  | 'svg'
  | 'canvas';
```

### CSS effects

Best for:

```text
screen flicker
neon flicker
glow pulses
hover rings
warning lights
selection outlines
simple steam drift
```

Pros:

```text
small
fast
easy to tune
works well for reusable UI-like effects
```

### Image / animated WebP effects

Best for:

```text
steam
smoke
rain against windows
fireflies
portal surface
fish movement
small glitch bursts
```

Use transparent WebP where possible. APNG is also acceptable. GIF is acceptable for quick tests but should not be the final default because of size and colour limitations.

### Sprite-sheet effects

Best for:

```text
Dominic swimming
coin shimmer
cursor blinking
small machinery loops
map pin pulse
```

Good when the animation needs precise frames.

### SVG effects

Best for:

```text
moving map route lines
radar sweeps
terminal trace paths
magic glyph rings
schematic overlays
```

### Canvas effects

Reserve for later and only where needed:

```text
particle fields
snow/rain/fog systems
glitchrealm distortion
starfields
procedural static
```

Canvas is powerful but adds more engineering weight. Use sparingly.

## 3. Effect definition shape

Room scenes should declare effects as data, not custom one-off React code.

Recommended model:

```ts
export interface RoomEffect {
  id: string;
  type: 'css' | 'image' | 'spriteSheet' | 'svg' | 'canvas';
  label?: string;
  src?: string;
  className?: string;
  preset?: string;
  x: number;
  y: number;
  width: number;
  height?: number;
  zIndex?: number;
  opacity?: number;
  visibleWhen?: string;
  reducedMotionFallback?: 'hide' | 'static' | 'steady';
  pointerEvents?: 'none' | 'auto';
}
```

Coordinate convention:

```text
x/y are percentages from 0 to 1 within the room scene
width/height are CSS pixels unless otherwise specified
```

Default:

```ts
pointerEvents: 'none'
```

Effects should not block object clicks unless deliberately designed as interactive overlays.

## 4. Accessibility rule

All animations must respect reduced motion.

CSS baseline:

```css
@media (prefers-reduced-motion: reduce) {
  .gorstan-animated-effect {
    animation: none !important;
  }
}
```

Reduced-motion behaviour should be defined per effect:

```text
steam-small: show static faint steam
screen-flicker: show steady dim glow
coin-shimmer: show static rim highlight
portal-pulse: show steady low glow
particles: hide
```

No effect should be essential to understanding a puzzle unless there is also a text/parser clue.

## 5. Reusable effect catalogue

### steam-small

Use:

```text
coffee cups
coffee machine
vents
small machinery
```

Type:

```text
image or CSS
```

Default size:

```text
96 x 128 px
```

Behaviour:

```text
slow upward drift
soft opacity pulse
low contrast
non-distracting
```

Reduced motion:

```text
static translucent steam image
```

Asset path suggestion:

```text
/public/rooms/effects/steam-small.webp
```

### steam-large

Use:

```text
industrial vents
magical machinery
broken pipes
```

Type:

```text
animated WebP
```

Default size:

```text
160 x 220 px
```

Behaviour:

```text
wide soft plume
slow looping movement
opacity below 70%
```

Reduced motion:

```text
static faint plume
```

### neon-flicker

Use:

```text
Gorstan Café sign
street signs
warning signs
shop signs
```

Type:

```text
CSS
```

Behaviour:

```text
irregular flicker every 2 to 5 seconds
occasional brief dimming
never full strobe
```

Reduced motion:

```text
steady low glow
```

CSS preset idea:

```css
.effect-neon-flicker {
  animation: neonFlicker 4s infinite steps(7);
}
```

### screen-flicker

Use:

```text
Control Nexus screens
terminals
CRT displays
security monitors
```

Type:

```text
CSS overlay
```

Behaviour:

```text
soft blue/green glow
minor brightness changes
occasional scanline flicker
```

Reduced motion:

```text
steady dim glow
```

### crt-scanlines

Use:

```text
old monitors
terminal panels
surveillance screens
```

Type:

```text
CSS pseudo-element or transparent overlay PNG
```

Behaviour:

```text
subtle horizontal lines
very slow vertical drift optional
```

Reduced motion:

```text
static scanline overlay
```

### status-light-blink

Use:

```text
coffee machine
control panels
server racks
airlock buttons
```

Type:

```text
CSS
```

Behaviour:

```text
small light alternates between dim and bright
period 1.2 to 3 seconds
```

Reduced motion:

```text
steady light
```

### warning-light-sweep

Use:

```text
danger rooms
locked doors
Control Nexus failure states
```

Type:

```text
CSS or image overlay
```

Behaviour:

```text
slow rotating or sweeping glow
avoid rapid alarm strobe
```

Reduced motion:

```text
static warning glow
```

### coin-shimmer

Use:

```text
Schrödinger coin
quantum coin
other reality-unstable small objects
```

Type:

```text
CSS glow or sprite sheet
```

Default size:

```text
48 x 48 px over item sprite
```

Behaviour:

```text
faint rim shimmer
brief double-image offset
small opacity pulse
```

Reduced motion:

```text
static rim highlight
```

### object-glow-soft

Use:

```text
quest objects
important pickups
magical artefacts
```

Type:

```text
CSS radial glow
```

Behaviour:

```text
subtle ambient halo
not a mobile-game loot explosion
```

Reduced motion:

```text
steady halo
```

### portal-pulse

Use:

```text
Glitchrealm entrances
teleport points
Elfhame thresholds
```

Type:

```text
animated WebP, CSS radial glow, or SVG ring
```

Behaviour:

```text
slow breathing pulse
inner shimmer
occasional edge distortion
```

Reduced motion:

```text
steady low glow
```

### glitch-particles

Use:

```text
Glitchrealm rooms
redacted data fragments
unstable devices
```

Type:

```text
Canvas or animated transparent WebP
```

Behaviour:

```text
small square fragments
brief digital noise
short-lived and sparse
```

Reduced motion:

```text
hide or static sparse particles
```

### glitch-tear

Use:

```text
Glitchrealm chamber
broken screens
reality faults
```

Type:

```text
CSS clipped strips or WebP overlay
```

Behaviour:

```text
horizontal tear flashes
rare, not constant
```

Reduced motion:

```text
hide
```

### map-route-moving

Use:

```text
wall maps
planning boards
navigation diagrams
mission maps
```

Type:

```text
SVG
```

Behaviour:

```text
animated dashed route line
slow directional movement
optional pulsing destination marker
```

Reduced motion:

```text
static route line
```

### map-pin-pulse

Use:

```text
important location markers
active objective points
```

Type:

```text
CSS or SVG
```

Behaviour:

```text
soft ring pulse every 2 to 4 seconds
```

Reduced motion:

```text
steady marker
```

### dust-motes

Use:

```text
library
archive
old rooms
sunlit interiors
```

Type:

```text
animated WebP or Canvas
```

Behaviour:

```text
very slow drifting particles
low opacity
background-only
```

Reduced motion:

```text
hide
```

### lamp-flicker

Use:

```text
library lamps
shrine lanterns
old corridors
```

Type:

```text
CSS glow overlay
```

Behaviour:

```text
warm irregular light variation
subtle not horror-strobe
```

Reduced motion:

```text
steady warm glow
```

### fireflies

Use:

```text
Elfhame
forest shrine
garden threshold
```

Type:

```text
animated WebP or Canvas
```

Behaviour:

```text
small drifting points
slow movement
warm magical tone
```

Reduced motion:

```text
static scattered lights or hide
```

### mist-drift

Use:

```text
Elfhame
thresholds
Glitchrealm edges
forest shrine
```

Type:

```text
animated WebP
```

Behaviour:

```text
slow lateral movement
low opacity
should not obscure hotspots
```

Reduced motion:

```text
static faint mist
```

### water-ripple

Use:

```text
bowls
pools
fountains
Dominic's bowl
```

Type:

```text
CSS/SVG or sprite sheet
```

Behaviour:

```text
small looped glint/ripple
```

Reduced motion:

```text
static highlight
```

### rain-window

Use:

```text
windows
doorways
exterior views
```

Type:

```text
animated WebP overlay
```

Behaviour:

```text
slow diagonal streaks
subtle parallax optional
```

Reduced motion:

```text
static wet-window texture
```

### doorway-shadow

Use:

```text
street exits
mysterious passages
thresholds
```

Type:

```text
CSS opacity overlay
```

Behaviour:

```text
very slow passing shadow movement
adds life without suggesting an NPC unless intended
```

Reduced motion:

```text
static shadow
```

### hover-outline

Use:

```text
all clickable hotspots
```

Type:

```text
CSS
```

Behaviour:

```text
appears on hover/focus
clear enough for accessibility
not always visible unless debug/hotspot mode enabled
```

Reduced motion:

```text
same outline, no pulse
```

### click-ripple

Use:

```text
hotspot activation feedback
```

Type:

```text
CSS
```

Behaviour:

```text
brief ring or pulse at click/focus point
```

Reduced motion:

```text
brief non-animated highlight or none
```

## 6. Room effect implementation pattern

A room scene should list effects like this:

```ts
export const gorstanCafeScene = {
  id: 'gorstan_cafe',
  background: '/rooms/gorstan-cafe-base.webp',
  effects: [
    {
      id: 'coffee-steam',
      type: 'image',
      preset: 'steam-small',
      src: '/rooms/effects/steam-small.webp',
      x: 0.36,
      y: 0.31,
      width: 96,
      height: 128,
      visibleWhen: 'coffeeVisible',
      pointerEvents: 'none',
      reducedMotionFallback: 'static',
    },
    {
      id: 'cafe-neon-flicker',
      type: 'css',
      preset: 'neon-flicker',
      className: 'effect-neon-flicker',
      x: 0.06,
      y: 0.08,
      width: 180,
      height: 80,
      pointerEvents: 'none',
      reducedMotionFallback: 'steady',
    },
  ],
};
```

Renderer structure:

```text
RoomSceneRenderer
 ├─ BackgroundLayer
 ├─ SpriteLayer
 ├─ EffectsLayer
 ├─ HotspotLayer
 └─ ActionMenuLayer
```

Effects should normally sit above the background and sprites but below the clickable hotspot layer.

## 7. First-room effect priorities

### Gorstan Café

Priority effects:

```text
steam-small
neon-flicker
coin-shimmer
status-light-blink
rain-window or doorway-shadow
```

### Control Nexus

Priority effects:

```text
screen-flicker
crt-scanlines
status-light-blink
warning-light-sweep
object-glow-soft for central console
```

### Glitchrealm Chamber

Priority effects:

```text
portal-pulse
glitch-particles
glitch-tear
screen-flicker
coin-shimmer or object-glow-soft for unstable objects
```

### Library / Archive

Priority effects:

```text
dust-motes
lamp-flicker
page-flutter, later if useful
map-route-moving
object-glow-soft for scrolls
```

### Elfhame / Forest Shrine

Priority effects:

```text
fireflies
mist-drift
lamp-flicker
water-ripple
glyph glow / object-glow-soft
```

## 8. Performance rules

Limit each room to a sensible effect budget.

Recommended first pass:

```text
2 to 6 effects per room
no more than 2 animated image overlays per room initially
prefer CSS/SVG over video
avoid full-screen animated backgrounds
```

Target:

```text
room feels alive
battery does not weep
browser does not combust
```

## 9. Gen Z polish without turning Gorstan into fruit-machine UI

Good polish:

```text
clear hover/focus states
small ambient motion
responsive action menu
click feedback
subtle particle effects
smooth object state changes
```

Avoid:

```text
constant flashing
reward explosions
over-animated menus
movement that obscures text
animations that imply false interactivity
```

Gorstan should feel alive, not like it has eaten six cans of discount energy drink.

## 10. Build checklist

For each new effect:

```text
1. Define effect in this bible
2. Add asset if needed under /public/rooms/effects/
3. Add CSS preset or renderer support
4. Add effect entry to room scene data
5. Confirm pointer-events does not block hotspots
6. Confirm reduced-motion fallback
7. Test in desktop and mobile layouts
```
