# Gorstan Sprite Strategy

This document defines how Gorstan should handle small item images / sprites for the hybrid parser and point-and-click interface.

It is deliberately practical. The room images provide the atmosphere. Sprites provide state: things that can be taken, moved, dropped, used, read, or shown in inventory.

## 1. Core principle

Do not bake movable objects into the room background.

Use this layering model:

```text
base room illustration
+ optional animated room overlays
+ item sprites for visible movable objects
+ clickable hotspot overlay
+ text/parser output
```

The sprite is visual only. The game state and parser remain authoritative.

For example:

```text
take schrodinger coin
```

should update item state. The renderer then hides the room sprite and shows the inventory icon. The art does not decide the game logic; it merely has the good manners to reflect it.

## 2. Sprite classes

### A. Room item sprites

Used when an item is physically visible in a room.

Examples:

- coin on table
- coffee cup on counter
- greasy napkin on floor
- flashlight on shelf
- briefcase beside chair

Recommended file type:

```text
PNG or WebP with transparency
```

Recommended base size:

```text
64 x 64 px canvas
```

Some items may need larger canvases:

```text
small item:      48 x 48
normal item:     64 x 64
wide item:       96 x 64
large item:      128 x 96
character/pet:   128 x 128
```

### B. Inventory icons

Used in inventory panels, item menus, and tooltips.

Recommended size:

```text
64 x 64 px
```

The inventory icon can initially reuse the room sprite. Later it can be replaced with a cleaner icon-style version.

### C. Scene hotspots

Not every clickable object is an item sprite.

Examples:

- coffee machine
- exit door
- control console
- noticeboard
- chair
- wall screen
- vending machine

These belong to the room scene image and should be handled through hotspot maps, not as movable inventory sprites.

## 3. Size rules

Use a transparent canvas, not a tightly cropped object, so positioning remains predictable.

| Class | Canvas | Use |
|---|---:|---|
| Tiny | 32 x 32 | small glints, tiny tokens, UI embellishments |
| Small | 48 x 48 | coins, keys, badges, pen |
| Standard | 64 x 64 | most inventory objects |
| Wide | 96 x 64 | maps, napkins, scrolls, papers |
| Large | 128 x 96 | briefcase, runbag, first aid kit |
| Pet / special | 128 x 128 | Dominic bowl, animated special objects |

In-room display can scale these using scene placement metadata, but the source art should stay consistent.

## 4. Art direction

Sprites should match the clickable room art direction:

```text
modernised retro adventure game
slightly pixel-art inspired
painterly rather than chunky
clear silhouette
readable at small size
transparent background
subtle outline or rim light where needed
```

Avoid photorealism. Avoid flat clip-art. Avoid ultra-detailed icons that turn into decorative porridge at 48 pixels.

Preferred look:

```text
small illustrated prop
soft highlights
slight perspective matching front-facing room scenes
subtle shadow baked into transparent image only when helpful
```

## 5. Naming convention

Room sprites:

```text
/public/sprites/items/<item-id>.png
```

Inventory icons:

```text
/public/sprites/inventory/<item-id>.png
```

Examples:

```text
/public/sprites/items/schrodinger-coin.png
/public/sprites/inventory/schrodinger-coin.png
/public/sprites/items/gorstan-coffee.png
/public/sprites/inventory/gorstan-coffee.png
```

Use kebab-case filenames. Item IDs in the engine currently use a mixture of kebab-case, snake_case and compact names. Filenames should be consistent even where old item IDs are not.

## 6. Fallback rules

The renderer should not break because a sprite has not been drawn yet.

Use this fallback order:

```ts
roomSprite = item.presentation?.sprite ?? null;
inventoryIcon = item.presentation?.inventoryIcon ?? item.presentation?.sprite ?? '/sprites/inventory/default-item.png';
```

If no room sprite exists, the item can still appear in parser text and inventory. If no inventory icon exists, use a default placeholder.

Recommended placeholder:

```text
default-item.png: small brass question-mark token, 64 x 64
```

## 7. Priority order

Do not draw every sprite first. Draw enough to prove the system.

### Priority 1: vertical slice / Gorstan Café

- Schrödinger coin
- Gorstan Coffee
- Greasy Napkin
- Briefcase, if present in the first slice
- Map, if needed for navigation/help
- Dominic, if he can be encountered early

### Priority 2: functional gameplay objects

- Flashlight
- Ancient Key
- Runbag
- First Aid Kit
- Medallion
- Scrolls

### Priority 3: flavour, jokes and collectibles

- Towel
- Gold Coin
- Quantum Coin
- Cheese Badge of Office
- Sock Puppet
- PermaPen
- Old Boot
- Mystery Meat

## 8. Per-object sprite briefs

The following list is based on the current canonical item registry in `src/engine/items.ts` plus the intended Schrödinger coin object.

| Item id | Name | Priority | Suggested size | Sprite brief |
|---|---|---:|---:|---|
| schrodinger_coin | Schrödinger coin | 1 | 48 x 48 | Small silver/gold coin with faint split-state shimmer, one edge slightly translucent, subtle quantum glow. Must read clearly as a coin, not a portal biscuit. |
| coffee | Gorstan Coffee | 1 | 64 x 64 | Strong dark coffee in slightly chipped café mug, rising steam, faint ominous glow in the liquid. Optional animated steam overlay later. |
| greasynapkin | Greasy Napkin | 1 | 96 x 64 | Crumpled off-white napkin with sauce stains and a faint blueprint/circuit diagram. Needs readable silhouette even when small. |
| briefcase | Briefcase | 1 | 128 x 96 | Sleek black locked briefcase, brass or steel latches, understated suspicious importance. Slight reflection. |
| map | Detailed Map | 1 | 96 x 64 | Folded parchment/map with cryptic markings, route lines and tiny red annotations. Could have a room and inventory version. |
| dominic | Dominic the Goldfish | 1 | 128 x 128 | Bright orange goldfish in portable bowl. Intelligent stare. Bowl should be readable; water highlight and tiny plant optional. |
| flashlight | Flashlight | 2 | 96 x 64 | Robust black torch/flashlight lying at slight angle, lens glint. Should imply useful exploration tool. |
| ancient_key | Ancient Key | 2 | 64 x 64 | Ornate old key, bronze/gold, faint blue-green pulse in the bow. Clear key shape above all else. |
| runbag | Runbag | 2 | 128 x 96 | Half-zipped practical go-bag with straps, slightly overfilled. Looks functional, not fantasy backpack. |
| firstaidkit | First Aid Kit | 2 | 96 x 64 | Compact red or white first aid kit with cross symbol, clean readable shape. |
| medallion | Medallion | 2 | 64 x 64 | Small mystical medallion, worn metal, central symbol or faint light. Should feel like access token/relic. |
| shard-gorcore | Gor Core Shard | 2 | 64 x 64 | Pulsing crystalline shard, blue/violet internal light, irregular broken geometry. Important quest-object silhouette. |
| scroll-constitution | Final Constitution Scroll | 2 | 96 x 64 | Shimmering formal scroll, sealed or partly unfurled, faint luminous edge. More institutional than wizardy. |
| scroll-ai | AI Ethics Scroll | 2 | 96 x 64 | Fragile scroll with faint circuit-like markings mixed with old parchment. Represents the Lattice Accord. |
| scroll-lore | Lore Scroll | 2 | 96 x 64 | Aged lore scroll, darker parchment, inked sigils or old annotations. Less luminous than the constitution scroll. |
| towel | Towel | 3 | 96 x 64 | Large folded towel, plain but comforting, slightly absurdly heroic. Should look useful rather than luxurious. |
| goldcoin | Gold Coin | 3 | 48 x 48 | Shiny old gold coin, simple strong silhouette, small highlight. Generic currency/treasure look. |
| quantumcoin | Quantum Coin | 3 | 48 x 48 | Coin with iridescent quantum edge, faint double-image shimmer, more exotic than goldcoin. |
| redacted-register-fragment | Redacted Register Fragment | 3 | 96 x 64 | Torn digital/paper scrap with black redaction bars and faint glitch pixels. Could flicker later. |
| crackedmirror | Cracked Mirror | 3 | 96 x 64 | Broken mirror shard, sharp cracked reflection, maybe a tiny distorted face-like glint but not too horror-heavy. |
| mysterymeat | Mystery Meat | 3 | 64 x 64 | Unlabelled suspicious protein lump/wrapped meat, faintly wrong. Keep comic-grotesque, not disgusting. |
| oldboot | Old Boot | 3 | 96 x 64 | Worn boot with character, sagging shape, mud/fungus hint. Strong silhouette. |
| polly_gift | Polly's Gift | 3 | 64 x 64 | Small precious token/gift, warm and personal. Could be wrapped charm or keepsake. Emotional not flashy. |
| temporal_device | Temporal Device | 3 | 96 x 96 | Small device existing in multiple timelines: brass/steel instrument with faint duplicate ghost outline. Not too sci-fi-gun. |
| cheesebadge | Cheese Badge of Office | 3 | 64 x 64 | Absurd official badge with cheese motif, brass enamel, faintly pompous. One vote and cheddar implied. |
| sockpuppet | Sock Puppet | 3 | 64 x 64 | Cheerful sock puppet, button eyes, slightly insulting expression. Funny but readable. |
| permapen | PermaPen | 3 | 96 x 32 | Slim pen with unusual glow or engraved runes. Horizontal sprite. Should look ordinary until inspected. |

## 9. Animation guidance

Do not animate every item.

Use animation only where it communicates state or adds atmosphere:

| Item | Animation idea |
|---|---|
| Schrödinger coin | subtle shimmer / two-frame uncertainty flicker |
| Gorstan Coffee | steam loop |
| Dominic | tiny fish movement or water glint |
| Gor Core Shard | slow pulse |
| Temporal Device | ghosted timeline flicker |
| Redacted Register Fragment | occasional glitch/static flash |

Animation can be handled as:

```text
animated WebP sprite
CSS shimmer/glow
small overlay layer
```

Prefer static sprites first. Animate later.

## 10. Drop behaviour and visual placement

Normal portable objects can be dropped into rooms and should reappear at a default placement.

Special objects can refuse to drop.

Examples:

```text
Schrödinger coin: drop refused; remains in inventory
Dominic: drop refused; safeguarding look deployed
```

Drop metadata belongs in item presentation / item rules, not in the room image.

## 11. Relationship to itemPresentation.ts

The visual metadata lives in:

```text
src/engine/itemPresentation.ts
```

That file should gradually gain sprite paths for more item ids. The canonical object logic remains in:

```text
src/engine/items.ts
```

This gives us a clean split:

```text
items.ts              = what the object is and does
itemPresentation.ts   = how the object appears and behaves in the visual UI
room scene files      = where the object is placed in a specific room
```

## 12. Implementation checklist

For each new sprite:

```text
1. Confirm item id exists in src/engine/items.ts
2. Add transparent PNG/WebP to /public/sprites/items/
3. Add optional inventory icon to /public/sprites/inventory/
4. Add metadata to ITEM_PRESENTATION
5. Add room placement only where the item should appear
6. Test take/examine/use/drop through both click UI and parser
```

## 13. Minimum viable asset pack

For the first playable visual slice, create these twelve assets:

```text
schrodinger-coin.png       48 x 48
placeholder/default-item.png 64 x 64
gorstan-coffee.png         64 x 64
greasy-napkin.png          96 x 64
briefcase.png              128 x 96
map.png                    96 x 64
flashlight.png             96 x 64
ancient-key.png            64 x 64
runbag.png                 128 x 96
first-aid-kit.png          96 x 64
dominic-bowl.png           128 x 128
scroll-lore.png            96 x 64
```

That is enough to prove the sprite architecture without attempting to illustrate the entire universe before anyone can click on a coin.
