# Gorstan Sprite Cookbook

Status: Draft v2 — documentation-only inventory, object and character sprite planning guide with generator-ready art briefs.

This cookbook turns the current item definitions into an art-production checklist. It does not change parser logic, reducer behaviour, inventory rules, save/load code, room graph semantics or story canon. Active TypeScript remains the implementation truth.

## Production principle

Sprites are presentation assets only.

A sprite may be clickable, hoverable or conditionally visible, but it must dispatch the same parser command a typed player would use. Do not duplicate interaction logic in React.

```ts
sprites?: Array<{
  id: string;
  image: string;
  x: number;
  y: number;
  width: number;
  height: number;
  visibleWhen?: string[];
  animation?: string;
  command?: string;
}>;
```

Use sprites for anything that can be collected, hidden, revealed, moved, changed by state, talked to, read, used, consumed, thrown, transformed, unlocked or visually varied by flags.

Do not create bespoke sprites for pure flags, parser aliases, route unlock state, validation helpers or invisible puzzle bookkeeping.

## Shared visual style

All sprites should sit comfortably over the current Gorstan room plates: modernised retro adventure-game art, slightly pixel-art inspired but painterly and polished, with readable silhouettes and atmospheric detail.

General asset requirements:

- PNG format.
- Transparent background unless the asset is explicitly an opened document panel or UI card.
- No baked-in UI chrome, command text, captions, inventory labels or hover markers.
- No white rectangular background.
- Readable at small game scale, especially inventory icons.
- Slight painterly texture, not flat emoji art.
- Consistent lighting: warm/cool rim-lighting may be used if it helps the object stand apart.
- Avoid photorealism, plastic 3D render style, clipart, corporate iconography and generic mobile-game gloss.

Recommended sizes:

| Sprite kind | Working size | Notes |
|---|---:|---|
| Inventory icon | 512 x 512 | Crop around object with transparent padding. |
| Room object overlay | 768 x 768 or object-specific | Must scale down cleanly and align to a hotspot. |
| Character/NPC sprite | 768 x 1024 or 1024 x 1024 | Full/half body depending on room use. |
| Small companion/pet sprite | 512 x 512 or 768 x 768 | Must still read clearly when scaled small. |
| Open/read document | 1024 x 768 | May have parchment/paper surface; text should be symbolic unless exact text is needed. |
| Sprite sheet | 2048 x 1024 or 2048 x 2048 | Only after individual stills are approved. |

## Naming convention

Inventory and object sprites:

```text
sprite_item_<itemId>_<state>.png
sprite_item_<itemId>_icon.png
sprite_item_<itemId>_room.png
sprite_item_<itemId>_used.png
```

Character/NPC sprites:

```text
sprite_<character>_<state>.png
sprite_<character>_sheet.png
```

Examples:

```text
sprite_item_briefcase_locked.png
sprite_item_briefcase_open.png
sprite_item_runbag_icon.png
sprite_item_greasynapkin_room.png
sprite_dominic_idle.png
sprite_dominic_glare.png
sprite_chef_tony_warning.png
sprite_albie_blocking.png
```

Prefer lowercase filenames. Preserve item IDs where practical, including hyphens and underscores, unless the asset pipeline later requires a stricter filename normalisation rule.

## Source inventory list

Canonical source: `src/engine/items.ts`.

The current `Item` model includes ID, display name, description, traits, portability, optional readable/usable/consumable/throwable flags, category, rarity, effects, requirements, spawn metadata, durability and transformation fields. The `ITEMS` array is the first source of truth for what can become inventory or room-object art.

The current inventory rules also make the runbag mechanically important because it expands carrying capacity from 8 to 12 items; without it, overfilling inventory can cause belongings to be lost. Treat the runbag as a priority sprite.

The global item validator cross-checks room item IDs against `ITEMS`, validates spawn/exclude mismatches, and explicitly calls out Dominic and the runbag as special placement concerns for Dale's Apartment.

## Sprite classification key

| Classification | Meaning | Asset expectation |
|---|---|---|
| `priority-character` | Character/pet/NPC-like presence; should not be baked into room background. | Character sprite or small sheet. |
| `priority-inventory` | Important carried or puzzle object. | Inventory icon plus room sprite if visible before pickup. |
| `inventory-icon` | Ordinary carried item. | Small inventory icon; room sprite only if clearly placed in a visual room. |
| `document-readable` | Readable document/scroll/map/register. | Icon plus optional opened/read overlay. |
| `stateful-object` | Needs multiple visual states. | Room sprite states, e.g. locked/open/used/empty. |
| `low-priority-junk` | Flavour item. | Icon only, or defer. |
| `defer/no-sprite` | Backend-only, unresolved, or not worth bespoke art yet. | Do not generate until gameplay/art need is proven. |

## Priority set for immediate art production

These are the assets most useful for the current visual-room direction.

| Priority | Asset family | Why it matters |
|---:|---|---|
| 1 | Dominic | Canon correction; recurring companion/pet/menace. |
| 2 | Chef Tony | Current New York gate chain needs visible NPC interaction. |
| 3 | Albie | Warehouse/passcode gate needs visible NPC states. |
| 4 | Briefcase | Current Alveira unlock object; needs locked/open states. |
| 5 | Runbag | Mechanically important inventory-capacity object. |
| 6 | Greasy napkin | Readable clue object for Burger Joint / Greasy Store Room. |
| 7 | Quantum coin | Distinctive inventory icon with game-wide tone. |
| 8 | Ancient key / medallion | Access/transformation chain. |
| 9 | Gor Core shard | Major quest object. |
| 10 | Chairs and switches | Visual-room state overlays, not ordinary inventory. |

## Generator prompt wrapper

Use this wrapper for most individual sprite prompts, replacing the bracketed content.

```text
Create a single transparent PNG sprite for the game Gorstan. Style: modernised retro illustrated adventure-game art, lightly pixel-inspired but painterly and polished, readable silhouette, subtle texture, atmospheric lighting, not photorealistic, not clipart, no UI label, no text, no border, no background.

Subject: [subject and state]
Composition: [pose, angle, scale, important readable silhouette]
Mood: [tone]
Details: [key visual traits]
Must avoid: [negative constraints]
```

For open/readable documents, text should normally be implied by marks, glyphs, diagrams, redactions or decorative lines. Do not invent readable prose unless the exact text is specified elsewhere in canon.

# Detailed sprite briefs

## Dominic — priority-character

Dominic is not a man.

Dominic is a cute-looking but vicious interdimensional goldfish/beast. He should read first as a small orange goldfish, then as a judgemental, intelligent, dangerous presence if the player looks twice. Half-moon glasses are optional.

Do not depict Dominic as a human, mascot man, wizard, businessman, professor, wizard-fish hybrid with legs, ordinary grumpy cartoon fish, shark, dragon, koi dragon, or generic magical familiar.

### `sprite_dominic_idle.png`

Use: default companion/pet presence, inventory/modal icon, occasional room overlay.

Visual brief:

- Small orange-gold goldfish with rounded body and flowing fins.
- Cute at first glance: neat silhouette, bright scales, large expressive eyes.
- Intelligence should be visible through eye focus and posture, not through human anatomy.
- Slightly raised brow/eye shape suggesting he is silently judging the player.
- Floating in a small implied aura or bowl-space; do not require a full glass bowl unless the room placement needs it.
- Very subtle impossible shadow beneath/behind him, like the light cannot quite decide where he is.
- Transparent background.

Prompt:

```text
Create a single transparent PNG sprite for the game Gorstan. Style: modernised retro illustrated adventure-game art, lightly pixel-inspired but painterly and polished, readable silhouette, subtle texture, atmospheric lighting, not photorealistic, not clipart, no UI label, no text, no border, no background.

Subject: Dominic, a small orange-gold goldfish companion, idle state.
Composition: compact rounded goldfish silhouette, flowing fins, three-quarter view, centered with transparent padding, readable at inventory icon size.
Mood: cute at first glance, intelligent and faintly judgemental on second look.
Details: expressive focused eyes, bright gold scales, tiny fin posture like a creature listening too carefully, very subtle impossible shadow or shimmer at the edge of the fins.
Must avoid: human body, legs, arms, clothes, wizard hat, businessman, professor, mascot character, shark, dragon, koi dragon, ordinary grumpy cartoon fish, fishbowl background, UI text.
```

### `sprite_dominic_glasses.png`

Use: scholarly/judgemental variant, reading or explaining absurdities.

Visual brief:

- Same body shape as idle Dominic.
- Tiny half-moon glasses perched impossibly but plausibly on the fish's face.
- Glasses should look delicate, old-fashioned and faintly ridiculous, not comedy novelty glasses.
- Eyes remain visible and sharper through the lenses.
- Optional tiny glint on lenses.

Prompt:

```text
Create a single transparent PNG sprite for the game Gorstan. Style: modernised retro illustrated adventure-game art, lightly pixel-inspired but painterly and polished, readable silhouette, subtle texture, atmospheric lighting, not photorealistic, not clipart, no UI label, no text, no border, no background.

Subject: Dominic, a small orange-gold goldfish wearing tiny half-moon glasses.
Composition: compact goldfish silhouette matching the idle design, three-quarter view, glasses visible but not oversized, transparent padding.
Mood: scholarly, judgemental, absurdly self-possessed.
Details: delicate half-moon glasses, focused intelligent eyes behind the lenses, bright scales, subtle interdimensional shimmer around fins.
Must avoid: human face, human body, legs, arms, professor costume, wizard costume, novelty joke glasses, moustache, pipe, text, fishbowl background.
```

### `sprite_dominic_glare.png`

Use: suspicious, displeased or warning state.

Visual brief:

- Same Dominic silhouette.
- Eyes narrow and become uncomfortably intelligent.
- Fins angle slightly backward, as if water and reality are both bracing themselves.
- Slight dark rim-light or ripple at the edges.
- Still small and cute enough that the menace is funny rather than horror-gore.

Prompt:

```text
Create a single transparent PNG sprite for the game Gorstan. Style: modernised retro illustrated adventure-game art, lightly pixel-inspired but painterly and polished, readable silhouette, subtle texture, atmospheric lighting, not photorealistic, not clipart, no UI label, no text, no border, no background.

Subject: Dominic, a small orange-gold goldfish giving a dangerous intelligent glare.
Composition: compact goldfish silhouette, three-quarter view, fins slightly swept back, centered with transparent padding.
Mood: cute creature becoming visibly judgemental and threatening if looked at twice.
Details: narrowed focused eyes, tiny mouth set in displeasure, faint dark rim-light, subtle reality ripple around fins, impossible shadow beneath him.
Must avoid: monster fish, horror gore, teeth-first piranha, human expression pasted onto a fish, arms, legs, clothes, wizard props, cartoon rage symbol, UI text.
```

### `sprite_dominic_interdimensional_threat.png`

Use: rare reveal / threat hint; not default sprite.

Visual brief:

- Still unmistakably Dominic as a small goldfish.
- Edges of fins and tail show faint impossible geometry or portal shimmer.
- Shadow/reflection hints at something vast and predatory beyond the small body.
- No gore, no full monster transformation. The joke is that the terrifying thing is still, annoyingly, a little goldfish.

Prompt:

```text
Create a single transparent PNG sprite for the game Gorstan. Style: modernised retro illustrated adventure-game art, lightly pixel-inspired but painterly and polished, readable silhouette, subtle texture, atmospheric lighting, not photorealistic, not clipart, no UI label, no text, no border, no background.

Subject: Dominic, a small cute orange-gold goldfish briefly revealing interdimensional beast energy.
Composition: same small goldfish silhouette, centered, fins and tail edged with subtle impossible geometry and portal-like shimmer, transparent padding.
Mood: adorable but deeply unsafe, cosmic menace contained in something that looks like it should live in a bowl.
Details: intelligent glaring eyes, bright scales, faint violet-blue reality tear around fins, shadow/reflection suggesting a much larger predatory shape without fully showing it.
Must avoid: full dragon transformation, huge monster, demon horns, gore, teeth-dominant piranha, humanoid body, wizard-fish, fish with legs, ordinary cartoon grumpiness, UI text.
```

## Chef Tony — priority-character

Chef Tony belongs to the Burger Joint / New York gate chain. He should be an NPC overlay, not baked into the background. He should feel grounded in a slightly grimy burger-joint setting but still in Gorstan's absurd adventure tone.

Do not make him a celebrity chef, fantasy innkeeper, mobster caricature, horror butcher or generic smiling fast-food mascot.

### `sprite_chef_tony_idle.png`

Use: default Burger Joint NPC presence.

Visual brief:

- Middle-aged burger-joint chef, practical and tired rather than theatrical.
- White chef coat or short-sleeved kitchen whites, slightly grease-marked.
- Apron with faint stains; no readable logo.
- Arms folded or one hand on counter-height spatula.
- Expression: wary but not hostile; knows too much about AEVIRA for a man surrounded by onions.
- Half-body or three-quarter-body sprite suitable for placement behind/near counter.

Prompt:

```text
Create a single transparent PNG sprite for the game Gorstan. Style: modernised retro illustrated adventure-game art, lightly pixel-inspired but painterly and polished, readable silhouette, subtle texture, atmospheric lighting, not photorealistic, not clipart, no UI label, no text, no border, no background.

Subject: Chef Tony, a tired burger-joint chef in idle state.
Composition: half-body or three-quarter-body NPC sprite, facing slightly toward the player, suitable for overlay behind a counter.
Mood: practical, wary, dryly unimpressed, grounded in a grimy New York burger joint.
Details: off-white kitchen coat, stained apron, rolled sleeves, spatula or towel as small prop, tired eyes, cautious expression.
Must avoid: celebrity chef glamour, fantasy tavern cook, horror butcher, mobster caricature, clown mascot, readable restaurant logo, exaggerated comedy moustache, UI text.
```

### `sprite_chef_tony_warning.png`

Use: warning/refusal/passcode guidance state.

Visual brief:

- Same Chef Tony design.
- One hand raised in a blocking/warning gesture, or leaning forward as if lowering his voice.
- Face more serious; not aggressive.
- Should imply: stop joking around, this is the bit where the paperwork bites.

Prompt:

```text
Create a single transparent PNG sprite for the game Gorstan. Style: modernised retro illustrated adventure-game art, lightly pixel-inspired but painterly and polished, readable silhouette, subtle texture, atmospheric lighting, not photorealistic, not clipart, no UI label, no text, no border, no background.

Subject: Chef Tony warning the player.
Composition: same tired burger-joint chef, half-body sprite, one hand raised in caution or leaning forward with a serious look.
Mood: warning, guarded, knows the AEVIRA route is dangerous or bureaucratically stupid.
Details: stained apron, kitchen whites, stern tired eyes, small grease-splatter details, subtle counter-service posture.
Must avoid: shouting rage pose, weapon threat, horror butcher, mafia intimidation, comic panic, readable text, UI label.
```

## Albie — priority-character

Albie belongs to the Aevira Warehouse gate. He should read as a contact/guard/fixer, not as a generic thug. His states matter because the passcode flow changes room access.

Do not make Albie a gangster stereotype, superhero, soldier, robot, cyberpunk cliché or warehouse stock-photo worker.

### `sprite_albie_idle.png`

Use: default warehouse presence.

Visual brief:

- Practical coat or work jacket, slightly rumpled.
- Calm, watchful posture.
- Standing near/against a warehouse threshold, but without a baked-in background.
- Expression: neutral, assessing, mildly unimpressed.
- Silhouette must be readable as a person who controls access.

Prompt:

```text
Create a single transparent PNG sprite for the game Gorstan. Style: modernised retro illustrated adventure-game art, lightly pixel-inspired but painterly and polished, readable silhouette, subtle texture, atmospheric lighting, not photorealistic, not clipart, no UI label, no text, no border, no background.

Subject: Albie, a warehouse contact and gatekeeper in idle state.
Composition: full-body or three-quarter-body NPC sprite, standing with relaxed but watchful posture, transparent background.
Mood: quiet, assessing, practical, mildly unimpressed.
Details: rumpled work jacket or dark coat, simple trousers, hands relaxed or one hand in pocket, tired eyes, warehouse-fixer energy without gangster exaggeration.
Must avoid: gangster stereotype, armed thug, superhero, soldier, robot, cyberpunk neon armour, stock-photo warehouse worker with clipboard, readable text.
```

### `sprite_albie_blocking.png`

Use: player lacks passcode / bounce-back state.

Visual brief:

- Same Albie.
- More closed posture: arm across access path, hand raised, body turned to block.
- Face says no passcode, no entry, no discussion.
- Not violent; controlled gatekeeping.

Prompt:

```text
Create a single transparent PNG sprite for the game Gorstan. Style: modernised retro illustrated adventure-game art, lightly pixel-inspired but painterly and polished, readable silhouette, subtle texture, atmospheric lighting, not photorealistic, not clipart, no UI label, no text, no border, no background.

Subject: Albie blocking access at the warehouse.
Composition: same warehouse contact, full-body or three-quarter-body sprite, one arm raised or body angled to block a doorway, transparent background.
Mood: firm, controlled, unamused, not violent.
Details: rumpled work jacket, guarded eyes, squared stance, subtle shadow under boots, practical gatekeeper silhouette.
Must avoid: weapon, attack pose, bouncer caricature, gangster stereotype, police uniform, soldier gear, robot, readable sign or text.
```

### `sprite_albie_accepting_code.png`

Use: AEVIRA accepted / briefcase activated state.

Visual brief:

- Same Albie.
- Posture opens slightly; one hand gestures inward or toward the briefcase path.
- Expression shifts from blocking to reluctant permission.
- Could include a small subtle greenish/blue reflected light from hidden tech or warehouse scanner, but do not overdo sci-fi.

Prompt:

```text
Create a single transparent PNG sprite for the game Gorstan. Style: modernised retro illustrated adventure-game art, lightly pixel-inspired but painterly and polished, readable silhouette, subtle texture, atmospheric lighting, not photorealistic, not clipart, no UI label, no text, no border, no background.

Subject: Albie accepting the AEVIRA passcode and allowing access.
Composition: same warehouse contact, posture opening slightly, one hand gesturing inward or toward the unseen briefcase route, transparent background.
Mood: reluctant permission, wary cooperation, procedural menace.
Details: rumpled coat, softened stance, serious eyes, subtle cool reflected light suggesting hidden technology, no overt sci-fi armour.
Must avoid: cheerful welcome, salute, gangster deal pose, superhero gesture, robot look, readable passcode text, UI label.
```

## Mabel cameo — priority-character

Mabel cameo sprites should be affectionate but restrained. Mabel is a cameo/companion presence, not a gameplay logic replacement and not a background fixture.

### `sprite_mabel_cameo_idle.png`

Use: cameo in Dale's Apartment or later cameo rooms.

Visual brief:

- Small cockerpoo/cockapoo-like dog, warm coat, soft curls.
- Friendly, intelligent, slightly quizzical expression.
- Sitting or standing with one paw forward.
- Should feel loved and real, not toy-like.
- No medical props or sentimental overstatement.

Prompt:

```text
Create a single transparent PNG sprite for the game Gorstan. Style: modernised retro illustrated adventure-game art, lightly pixel-inspired but painterly and polished, readable silhouette, subtle texture, atmospheric lighting, not photorealistic, not clipart, no UI label, no text, no border, no background.

Subject: Mabel cameo, a small curly-coated cockerpoo-style dog.
Composition: compact full-body pet sprite, seated or standing with one paw slightly forward, transparent background.
Mood: affectionate, alert, gently quizzical.
Details: soft curly coat, warm eyes, slightly tousled ears, natural dog posture, painterly fur texture.
Must avoid: toy dog, cartoon mascot, medical props, angelic glow, costume, collar text, UI label.
```

## Runbag — priority-inventory

The runbag is mechanically important because it increases carrying capacity. It should look useful, slightly battered and very Gorstan: an ordinary bag that has survived too much narrative responsibility.

### `sprite_item_runbag_icon.png`

Use: inventory icon.

Visual brief:

- Compact canvas shoulder/runner bag.
- Worn fabric, scuffed corners, slightly overpacked shape.
- A small tag or patch may exist but must not contain readable text.
- Should read clearly at 64px as a bag, not a suitcase.

Prompt:

```text
Create a single transparent PNG inventory sprite for the game Gorstan. Style: modernised retro illustrated adventure-game art, lightly pixel-inspired but painterly and polished, readable silhouette, subtle texture, no UI label, no text, no border, no background.

Subject: the Runbag, a battered useful canvas shoulder bag.
Composition: three-quarter view of a compact overpacked bag, centered with transparent padding, readable at small inventory size.
Mood: practical, slightly heroic in the least glamorous possible way.
Details: worn canvas, scuffed seams, strap, small blank tag or patch, buckles, soft bulging shape suggesting extra capacity.
Must avoid: school backpack, designer handbag, military tactical pack, suitcase, readable logo, magical glowing bag of holding cliché, UI text.
```

### `sprite_item_runbag_room.png`

Use: room pickup overlay, especially Dale's Apartment.

Visual brief:

- Same bag, angled as if resting on a floor/chair/sofa.
- Slight grounding shadow.
- More environmental scale than icon version.
- Transparent background so it can be placed over room art.

Prompt:

```text
Create a single transparent PNG room-object sprite for the game Gorstan. Style: modernised retro illustrated adventure-game art, lightly pixel-inspired but painterly and polished, readable silhouette, subtle texture, no UI label, no text, no border, no background.

Subject: the Runbag resting as a collectible room object.
Composition: battered canvas shoulder bag lying at a slight angle, with subtle grounding shadow, transparent background.
Mood: ordinary but important, the sort of thing a sensible player should pick up before things become administratively impossible.
Details: worn canvas, strap, scuffed edges, overpacked but not bursting, small blank tag, believable weight.
Must avoid: backpack, handbag, suitcase, glowing magical satchel, military tactical equipment, readable label, UI text.
```

## Briefcase — stateful-object

The briefcase is central to the New York / Alveira unlock chain. It should be visually important without becoming a spy-thriller cliché.

### `sprite_item_briefcase_locked.png`

Use: warehouse/Albie chain before unlock.

Visual brief:

- Old dark leather or composite briefcase.
- Slightly battered, practical, not luxury.
- Lock/clasp visible.
- Subtle strange seam or barely visible symbol may suggest it is more than paperwork.
- Closed, grounded, tense.

Prompt:

```text
Create a single transparent PNG sprite for the game Gorstan. Style: modernised retro illustrated adventure-game art, lightly pixel-inspired but painterly and polished, readable silhouette, subtle texture, atmospheric lighting, no UI label, no text, no border, no background.

Subject: a locked important briefcase.
Composition: three-quarter view of a closed dark briefcase, clasp and lock clearly visible, centered with transparent padding.
Mood: bureaucratic menace, quietly important, not flashy.
Details: worn dark leather or composite surface, scuffed corners, metal clasp, subtle impossible seam or faint concealed symbol, small grounding shadow.
Must avoid: luxury designer case, spy-movie bomb case, modern laptop bag, glowing sci-fi suitcase, readable markings, handcuffs, UI text.
```

### `sprite_item_briefcase_open.png`

Use: after unlock / activation.

Visual brief:

- Same briefcase open.
- Contents should imply documents/hidden mechanism/Aevira route, not reveal exact canon text.
- Pale light, classified papers, old map-lines or folded documents.
- Should feel like opening it changed room access.

Prompt:

```text
Create a single transparent PNG sprite for the game Gorstan. Style: modernised retro illustrated adventure-game art, lightly pixel-inspired but painterly and polished, readable silhouette, subtle texture, atmospheric lighting, no UI label, no readable text, no border, no background.

Subject: the important briefcase opened after activation.
Composition: same dark battered briefcase open at a three-quarter angle, contents visible but not text-readable, transparent padding.
Mood: revelation, bureaucratic danger, hidden route unlocked.
Details: pale internal glow, folded classified-looking papers with redaction bars but no readable words, subtle map lines, concealed mechanism or brass latch, scuffed case corners.
Must avoid: readable documents, bomb wires, cash stacks, gun, spy-film cliché, neon cyberpunk device, UI text.
```

### `sprite_item_briefcase_icon.png`

Use: compact inventory icon if the briefcase is carried.

Visual brief:

- Simplified closed briefcase, strong silhouette, tiny lock glint.
- Less detail than room-state versions.

## Greasy napkin — document-readable

The greasy napkin is a clue object. It should be funny, unglamorous and surprisingly important.

### `sprite_item_greasynapkin_room.png`

Use: room pickup overlay in Burger Joint / Greasy Store Room.

Visual brief:

- Crumpled paper napkin stained with sauce/grease.
- Faint blueprint-like lines and arrows visible but not fully legible.
- One corner folded or stuck to the surface by grease.
- Gross enough to be funny, not revolting.

Prompt:

```text
Create a single transparent PNG room-object sprite for the game Gorstan. Style: modernised retro illustrated adventure-game art, lightly pixel-inspired but painterly and polished, readable silhouette, subtle texture, no UI label, no readable text, no border, no background.

Subject: a greasy napkin containing an important clue.
Composition: crumpled off-white paper napkin lying flat at a slight angle, transparent background, readable as a collectible object.
Mood: absurdly mundane but important.
Details: sauce stains, grease translucency, faint blueprint-like lines and arrows, folded corner, small shadow, no legible words.
Must avoid: clean parchment scroll, restaurant menu, readable writing, gore, excessive filth, UI text.
```

### `sprite_item_greasynapkin_read.png`

Use: readable/open clue overlay.

Visual brief:

- Larger flattened napkin with diagrammatic marks.
- Marks can suggest route, warehouse, arrows, boxes, AEVIRA clue logic, but no exact readable words unless canon is provided.
- Brown/red sauce marks can accidentally frame the useful lines.

Prompt:

```text
Create a single readable clue overlay image for the game Gorstan. Style: modernised retro illustrated adventure-game art, painterly paper texture, no UI frame, no captions.

Subject: a flattened greasy napkin used as a blueprint-like clue.
Composition: off-white napkin viewed from above, larger than inventory icon, faint diagram lines, arrows and box shapes, sauce stains framing the clue, transparent or softly feathered paper edge.
Mood: ridiculous, useful, suspiciously specific.
Details: grease stains, sauce smears, hand-drawn schematic marks, no fully readable prose, no exact passcode text unless specified elsewhere.
Must avoid: clean map parchment, full readable instructions, restaurant menu, typed document, UI border, UI text.
```

## Quantum coin and gold coin

The gold coin can be simple. The quantum coin should be distinct, suspicious and mildly impossible.

### `sprite_item_goldcoin_icon.png`

Use: ordinary valuable item icon.

Visual brief:

- Small old gold coin, warm metallic edge, slight wear.
- No readable monarch/head/text.

### `sprite_item_quantumcoin_icon.png`

Use: inventory icon.

Visual brief:

- Gold/silver coin with double-state shimmer.
- Edge or face appears subtly in two positions at once.
- Faint glow or interference ring.
- Should not look like a generic fantasy magic coin.

Prompt:

```text
Create a single transparent PNG inventory sprite for the game Gorstan. Style: modernised retro illustrated adventure-game art, lightly pixel-inspired but painterly and polished, readable silhouette, subtle texture, no UI label, no readable text, no border, no background.

Subject: the Quantum Coin, a small coin existing in a slightly impossible state.
Composition: coin in three-quarter view, centered with transparent padding, readable at small inventory size.
Mood: valuable, absurd, faintly unstable.
Details: gold-silver surface, doubled edge or ghosted offset implying two states at once, subtle interference glow, tiny impossible shadow.
Must avoid: fantasy rune coin, casino chip, cryptocurrency logo, readable symbols, huge magical aura, UI text.
```

### `sprite_item_quantumcoin_glow.png`

Use: active/selected variant.

Visual brief:

- Same coin, slightly stronger interference glow.
- Still restrained; Gorstan should not become a fruit machine.

## Ancient key and medallion — access/transformation chain

These should feel connected: the medallion transforms or unlocks access into the ancient key logic.

### `sprite_item_medallion_icon.png`

Use: inventory icon.

Visual brief:

- Aged brass/bronze medallion.
- Worn surface, old symbol implied but not readable text.
- Slight crack or seam indicating it may change.

Prompt:

```text
Create a single transparent PNG inventory sprite for the game Gorstan. Style: modernised retro illustrated adventure-game art, lightly pixel-inspired but painterly and polished, readable silhouette, subtle texture, no UI label, no readable text, no border, no background.

Subject: an old medallion that may transform into or reveal an ancient key.
Composition: circular aged brass medallion in three-quarter view, centered with transparent padding.
Mood: old, significant, not flashy.
Details: worn bronze surface, faint engraved symbol shapes without readable text, hairline crack or seam, tarnished edge, subtle warm rim light.
Must avoid: fantasy amulet cliché, glowing jewel, readable runes, necklace on a person, religious iconography, UI text.
```

### `sprite_item_medallion_activated.png`

Use: transformation/activation state.

Visual brief:

- Medallion seam opening or symbol catching light.
- Small key-shape hinted inside or projected by shadow.

### `sprite_item_ancient_key_icon.png`

Use: priority inventory icon.

Visual brief:

- Old key, not oversized fantasy key.
- Aged metal, unusual teeth, small engraved head.
- Should feel like it opens something old and legally regrettable.

Prompt:

```text
Create a single transparent PNG inventory sprite for the game Gorstan. Style: modernised retro illustrated adventure-game art, lightly pixel-inspired but painterly and polished, readable silhouette, subtle texture, no UI label, no readable text, no border, no background.

Subject: an ancient key.
Composition: aged metal key at a slight diagonal, centered with transparent padding, strong readable silhouette.
Mood: old access, quiet consequence, institutional regret.
Details: tarnished brass or iron, unusual teeth, worn ring head, subtle patina, faint warm highlight.
Must avoid: giant fantasy key, modern house key, glowing neon key, readable text, skull ornament, UI label.
```

### `sprite_item_ancient_key_glow.png`

Use: active/use-state variant.

Visual brief:

- Same key with faint light around teeth or ring.
- Keep glow subtle and old, not magic-wand bright.

## Gor Core shard — priority-inventory

The Gor Core shard is a major quest object. It can look stranger than ordinary inventory, but it should remain readable as a shard.

### `sprite_item_shard-gorcore_icon.png`

Use: inventory icon.

Visual brief:

- Angular shard of impossible material.
- Dark glass/metal with internal blue-violet pulse.
- Edges slightly wrong, as if geometry is disagreeing politely.
- No gore, no crystal fantasy cliché.

Prompt:

```text
Create a single transparent PNG inventory sprite for the game Gorstan. Style: modernised retro illustrated adventure-game art, lightly pixel-inspired but painterly and polished, readable silhouette, subtle texture, no UI label, no text, no border, no background.

Subject: the Gor Core Shard, a major quest object.
Composition: angular shard of dark glass-metal, centered with transparent padding, strong silhouette readable at small size.
Mood: powerful, unstable, quietly bureaucratic-cosmic.
Details: dark reflective surface, internal blue-violet pulse, fractured edges, subtle impossible geometry, tiny light leak from within.
Must avoid: generic fantasy crystal, neon sci-fi battery, sword shard, gem icon, excessive glow, UI text.
```

### `sprite_item_shard-gorcore_pulse.png`

Use: active/pulsing variant.

Visual brief:

- Same shard with stronger internal light and slight edge distortion.
- Suitable for CSS pulse animation as overlay.

## Polly's Gift — priority-inventory

Polly's Gift is emotionally significant and should avoid looking like generic loot.

### `sprite_item_polly_gift_icon.png`

Use: inventory icon.

Visual brief:

- Small wrapped or keepsake-like gift.
- Should feel personal, not Christmas stock art.
- Slightly imperfect wrapping or ribbon.
- Warm but restrained.

Prompt:

```text
Create a single transparent PNG inventory sprite for the game Gorstan. Style: modernised retro illustrated adventure-game art, lightly pixel-inspired but painterly and polished, readable silhouette, subtle texture, no UI label, no readable text, no border, no background.

Subject: Polly's Gift, a small emotionally significant keepsake gift.
Composition: compact wrapped object or small keepsake parcel, centered with transparent padding, readable at inventory size.
Mood: personal, forgiving, quietly important.
Details: slightly imperfect wrapping, muted ribbon, soft worn edge, warm restrained light.
Must avoid: Christmas present cliché, treasure chest, luxury gift box, glowing loot drop, readable tag, UI text.
```

## Temporal device — stateful-object

The temporal device should look dangerous and functional, not like generic sci-fi plastic.

### `sprite_item_temporal_device_icon.png`

Use: inventory icon.

Visual brief:

- Compact brass/steel device, part pocket instrument, part bad decision.
- Dials, small glass aperture, rotating ring or worn switch.
- Time/quantum feel without cliché clock face domination.

Prompt:

```text
Create a single transparent PNG inventory sprite for the game Gorstan. Style: modernised retro illustrated adventure-game art, lightly pixel-inspired but painterly and polished, readable silhouette, subtle texture, no UI label, no readable text, no border, no background.

Subject: a compact temporal device.
Composition: small brass-and-steel handheld device in three-quarter view, centered with transparent padding, readable at inventory size.
Mood: dangerous, clever, badly approved.
Details: worn brass ring, steel casing, tiny glass aperture, small dials, switch, faint blue temporal glint, scuffed edges.
Must avoid: smartphone, ray gun, generic neon sci-fi gadget, large clock face, steampunk over-decoration, readable markings, UI text.
```

### `sprite_item_temporal_device_active.png`

Use: active state.

Visual brief:

- Same device with aperture lit and faint circular distortion.
- Keep readable as the same object.

## Scrolls, map and readable documents

Scrolls should share a family style but remain distinguishable.

### `sprite_item_scroll-constitution_icon.png`

Use: inventory icon.

Visual brief:

- Heavy official-looking scroll, sealed or tied.
- Bureaucratic grandeur, slightly absurd importance.
- Red wax/cord optional, no readable text.

### `sprite_item_scroll-constitution_open.png`

Use: readable overlay.

Visual brief:

- Open parchment/scroll with formal-looking layout.
- Use lines, seals and redaction marks, not readable prose unless provided.
- Should feel like final constitutional machinery, not fantasy spell scroll.

Prompt:

```text
Create a single readable document overlay for the game Gorstan. Style: modernised retro illustrated adventure-game art, painterly parchment and official document texture, no UI frame, no captions.

Subject: the Final Constitution Scroll opened.
Composition: formal parchment scroll viewed from above, official seals, structured lines and redaction bars, no readable prose.
Mood: grand, bureaucratic, final, faintly ridiculous.
Details: parchment texture, wax seal, formal border, ink lines, redaction marks, aged edges.
Must avoid: fantasy magic spell, glowing runes, readable paragraphs, modern certificate, UI border, UI text.
```

### `sprite_item_scroll-ai_icon.png` and `sprite_item_scroll-ai_open.png`

Visual brief:

- Scroll or folded document with AI-ethics flavour through symbolic circuit-like marginal marks.
- Should be institutional and philosophical, not Silicon Valley neon.
- No readable text unless exact canon text is provided.

### `sprite_item_scroll-lore_icon.png` and `sprite_item_scroll-lore_open.png`

Visual brief:

- Older lore scroll, warmer parchment, hand-drawn marks, map-like annotations.
- More ancient/folk-lore than official constitution.

### `sprite_item_redacted-register-fragment_icon.png`

Use: inventory icon.

Visual brief:

- Torn fragment of register paper.
- Heavy black redactions.
- Slight glitch edge or R.A.V.E.N. institutional menace.
- No readable text.

Prompt:

```text
Create a single transparent PNG inventory sprite for the game Gorstan. Style: modernised retro illustrated adventure-game art, lightly pixel-inspired but painterly and polished, readable silhouette, no UI label, no readable text, no border, no background.

Subject: a redacted register fragment.
Composition: torn paper fragment at a slight angle, centered with transparent padding, readable at inventory size.
Mood: classified, glitch-haunted, bureaucratically unsafe.
Details: heavy black redaction bars, torn edges, faint typed-line marks without readable words, subtle digital glitch along one edge.
Must avoid: readable document text, clean certificate, fantasy scroll, police evidence tag, UI text.
```

### `sprite_item_map_icon.png` and `sprite_item_map_open.png`

Visual brief:

- Folded detailed map for icon.
- Open version can show routes, landmarks and impossible corridors, but not exact gameplay spoilers unless canon requires.
- Slightly over-annotated, practical, survival-adjacent.

## Coffee and cup states — stateful-object

Coffee is consumable, usable, throwable and stackable. It may need state variants if visible in the Café or inventory.

### `sprite_item_coffee_full.png`

Use: inventory/room object.

Visual brief:

- Plain takeaway coffee cup or mug consistent with Gorstan Café tone.
- Steam curl optional.
- No readable logo.
- Slightly over-important for a beverage.

Prompt:

```text
Create a single transparent PNG sprite for the game Gorstan. Style: modernised retro illustrated adventure-game art, lightly pixel-inspired but painterly and polished, readable silhouette, subtle texture, no UI label, no readable text, no border, no background.

Subject: a full Gorstan coffee.
Composition: small cup or takeaway cup in three-quarter view, centered with transparent padding, steam curl optional.
Mood: ordinary coffee with disproportionate narrative importance.
Details: warm cup, dark liquid visible or lid seam, subtle steam, no readable logo, slight shadow.
Must avoid: branded coffee chain cup, readable text, fancy latte art, huge mug, UI label.
```

### `sprite_item_coffee_empty.png`

Use: consumed/used state if `empty_cup` becomes a real item.

Visual brief:

- Same cup but empty, cooler, slightly disappointing.
- Do not generate as final until `empty_cup` is confirmed or implemented.

## Flashlight — stateful-object

The flashlight has durability and should have off/on/dim variants if it becomes visually active.

### `sprite_item_flashlight_icon.png`

Visual brief:

- Battered black/brass torch, cracked lens, worn grip.
- Readable shape at small size.

### `sprite_item_flashlight_on.png`

Visual brief:

- Same torch with warm cone or glow at lens.
- Transparent glow must be soft and compositable.

### `sprite_item_flashlight_dim.png`

Visual brief:

- Same torch with weak flickering light.
- Use for low durability.

## First aid kit, towel and practical utility items

These can be inventory-icon quality unless they become room-critical.

### `sprite_item_firstaidkit_icon.png`

Visual brief:

- Compact practical first aid pouch or box.
- Red/white medical cross-like symbol may be used if generic and not a real organisation logo.
- Slightly worn, not hospital-clean.

### `sprite_item_towel_icon.png`

Visual brief:

- Folded towel, slightly rumpled.
- Could be a subtle Hitchhiker-style reference without infringing any specific visual property.
- Ordinary but useful.

## Junk and easter egg items

These should be charming but low effort unless gameplay makes them important.

### `sprite_item_crackedmirror_icon.png` / `sprite_item_crackedmirror_reflection.png`

Visual brief:

- Small cracked hand mirror or shard mirror.
- Reflection variant may show impossible dark/alternate glint without depicting a full character.

### `sprite_item_mysterymeat_icon.png`

Visual brief:

- Ambiguous wrapped or plated lump, comic-gross but not horror-gore.
- Defer unless used in a room/puzzle.

### `sprite_item_oldboot_icon.png`

Visual brief:

- Muddy old boot, slightly collapsed, throwable.
- Defer unless throwable feedback becomes visible.

### `sprite_item_cheesebadge_icon.png`

Visual brief:

- Official-looking badge made of or shaped like cheese.
- Bureaucratic insignia parody; no readable words.

### `sprite_item_sockpuppet_icon.png` / `sprite_item_sockpuppet_talking.png`

Visual brief:

- Slightly threadbare sock puppet, sarcastic posture.
- Talking variant with open mouth/tilted attitude.

### `sprite_item_permapen_icon.png` / `sprite_item_permapen_writing.png`

Visual brief:

- Old pen that looks ordinary until used.
- Writing variant may show a small ink trail or glowing stroke, no readable text.

## Room-object and stateful overlay guidance

Use room overlays for these even when they are not ordinary inventory items.

| Object | Suggested asset(s) | Commands |
|---|---|---|
| Café Office chair | `sprite_object_cafeoffice_chair_idle.png`, `sprite_object_cafeoffice_chair_ready.png` | `inspect chair`, `sit chair` |
| Control Nexus chair | `sprite_object_controlnexus_chair_idle.png`, `sprite_object_controlnexus_chair_active.png` | `inspect chair`, `sit chair` |
| Intro Reset switch | `sprite_object_introreset_switch_blank.png`, `sprite_object_introreset_switch_blue.png`, `sprite_object_introreset_switch_red.png`, `sprite_object_introreset_switch_flashing_red.png` | `inspect switch`, `press switch`, `use switch` |
| Briefcase | See inventory catalogue. | `inspect briefcase`, `open briefcase`, `use briefcase` |
| Greasy napkin | See inventory catalogue. | `inspect napkin`, `read napkin`, `take napkin` |
| Screens/portals/mirrors | Overlay-ready surfaces, no baked-in UI text. | `inspect screen`, `use console`, relevant parser command |

### Café Office chair

Visual brief:

- Office chair that looks ordinary enough to be suspicious.
- Slightly high-tech or anomalous detail: cable, tiny light, odd shadow, upholstery seam.
- Idle state should not imply activation.
- Ready state may have subtle glow, hum-line or sharper rim light.
- Must not automatically imply teleport on inspect; interaction remains parser-driven.

Prompt:

```text
Create a single transparent PNG room-object sprite for the game Gorstan. Style: modernised retro illustrated adventure-game art, lightly pixel-inspired but painterly and polished, readable silhouette, subtle texture, no UI label, no text, no border, no background.

Subject: a suspicious office chair in the Café Office.
Composition: modern office chair in three-quarter view, centered with transparent padding, suitable as a clickable room overlay.
Mood: ordinary office furniture with quiet narrative danger.
Details: worn fabric or leather, wheels, subtle cable or tiny indicator light, slight impossible shadow, believable scale.
Must avoid: throne, gaming chair, dentist chair, sci-fi cockpit seat, glowing portal chair, UI text.
```

### Control Nexus chair

Visual brief:

- Central command chair, more clearly high-tech than Café Office chair.
- Cables, metal base, console-adjacent fittings.
- Active version may show blue-white energy/circuit glow.
- Should fit Control Nexus visual language.

### Intro Reset switch

Visual brief:

- Physical switch on or beside pedestal/stand.
- Base switch state should be blank/unlit.
- Blue, red, flashing red variants should preserve identical geometry so state swaps are clean.
- No readable labels.

Prompt:

```text
Create a transparent PNG room-object sprite for the game Gorstan. Style: modernised retro illustrated adventure-game art, lightly pixel-inspired but painterly and polished, readable silhouette, no UI label, no text, no border, no background.

Subject: the Intro Reset switch, blank/unlit state.
Composition: chunky physical switch on a small pedestal or wall plate, centered with transparent padding, designed for state-colour variants.
Mood: important, simple, ominously under-explained.
Details: clean metal/plastic housing, large switch lever or button, unlit indicator area, subtle shadow.
Must avoid: readable warning label, modern touchscreen, cartoon red button only, fantasy lever, UI text.
```

For colour variants, keep shape identical and change only the indicator/switch light:

- `sprite_object_introreset_switch_blue.png` — calm blue indicator.
- `sprite_object_introreset_switch_red.png` — red warning indicator.
- `sprite_object_introreset_switch_flashing_red.png` — red variant suitable for CSS blink/pulse; do not bake animation frames unless using a sheet.

## Inventory item catalogue

| Item ID | Display name | Category | Key traits/flags | Classification | Recommended sprite assets | Notes |
|---|---|---:|---|---|---|---|
| `scroll-constitution` | Final Constitution Scroll | `knowledge` | portable, readable, unique | `document-readable` | `sprite_item_scroll-constitution_icon.png`, `sprite_item_scroll-constitution_open.png` | High-lore readable document. |
| `towel` | Towel | `functional` | portable, useful, reference | `inventory-icon` | `sprite_item_towel_icon.png` | Icon sufficient unless physically placed in a visual room. |
| `runbag` | Runbag | `functional` | portable, storage/capacity, special Dale placement | `priority-inventory` | `sprite_item_runbag_icon.png`, `sprite_item_runbag_room.png` | Capacity-affecting item; priority. |
| `briefcase` | Briefcase | `puzzle` | portable, usable, locked, requirement `briefcase_key` | `stateful-object` | `sprite_item_briefcase_locked.png`, `sprite_item_briefcase_open.png`, `sprite_item_briefcase_icon.png` | Current New York/Alveira gate-chain object. |
| `redacted-register-fragment` | Redacted Register Fragment | `artifact` | portable, readable, classified/glitch | `document-readable` | `sprite_item_redacted-register-fragment_icon.png`, `sprite_item_redacted-register-fragment_glitch.png` | R.A.V.E.N.-linked; no natural spawn. |
| `greasynapkin` | Greasy Napkin | `puzzle` | portable, readable, blueprint/sauce clue | `document-readable` | `sprite_item_greasynapkin_icon.png`, `sprite_item_greasynapkin_room.png`, `sprite_item_greasynapkin_read.png` | Useful for Burger Joint / Greasy Store Room visual continuity. |
| `coffee` | Gorstan Coffee | `consumable` | portable, usable, consumable, throwable, stackable | `stateful-object` | `sprite_item_coffee_full.png`, `sprite_item_coffee_empty.png`, `sprite_item_coffee_icon.png` | Transform references `empty_cup`; currently `empty_cup` is not an `ITEMS` entry. |
| `firstaidkit` | First Aid Kit | `healing` | portable, usable, consumable | `inventory-icon` | `sprite_item_firstaidkit_icon.png` | Standard utility icon. |
| `goldcoin` | Gold Coin | `valuable` | portable, stackable | `inventory-icon` | `sprite_item_goldcoin_icon.png` | Could be visually linked to Schrödinger/coin jokes if canon later requires. |
| `quantumcoin` | Quantum Coin | `valuable` | portable, stackable, quantum, legendary | `priority-inventory` | `sprite_item_quantumcoin_icon.png`, `sprite_item_quantumcoin_glow.png` | More distinctive than ordinary coin. |
| `crackedmirror` | Cracked Mirror | `junk` | portable, usable, reflective/ominous | `stateful-object` | `sprite_item_crackedmirror_icon.png`, `sprite_item_crackedmirror_reflection.png` | Useful for glitch/alternate-self effects. |
| `mysterymeat` | Mystery Meat | `junk` | portable, usable, consumable, biological | `low-priority-junk` | `sprite_item_mysterymeat_icon.png` | Defer unless used in a room/puzzle. |
| `oldboot` | Old Boot | `junk` | portable, throwable | `low-priority-junk` | `sprite_item_oldboot_icon.png` | Defer unless room dressing or throwable feedback is needed. |
| `medallion` | Medallion | `access` | portable, access, transformInto `ancient_key` | `stateful-object` | `sprite_item_medallion_icon.png`, `sprite_item_medallion_activated.png` | Transformation chain item. |
| `ancient_key` | Ancient Key | `key` | portable, unlock/access | `priority-inventory` | `sprite_item_ancient_key_icon.png`, `sprite_item_ancient_key_glow.png` | Important access object. |
| `shard-gorcore` | Gor Core Shard | `quest` | portable, legendary, core/essential | `priority-inventory` | `sprite_item_shard-gorcore_icon.png`, `sprite_item_shard-gorcore_pulse.png` | High-priority quest item. |
| `scroll-ai` | AI Ethics Scroll | `quest` | portable, readable, ethics|required | `document-readable` | `sprite_item_scroll-ai_icon.png`, `sprite_item_scroll-ai_open.png` | Core theme/lore document. |
| `scroll-lore` | Lore Scroll | `knowledge` | portable, readable | `document-readable` | `sprite_item_scroll-lore_icon.png`, `sprite_item_scroll-lore_open.png` | General lore document. |
| `dominic` | Dominic the Goldfish | `pet` | portable, living, intelligent, unique | `priority-character` | See Dominic section above. | Special case: character/pet sprite, not a normal inventory icon only. |
| `polly_gift` | Polly's Gift | `quest` | portable, unique, forgiveness | `priority-inventory` | `sprite_item_polly_gift_icon.png`, `sprite_item_polly_gift_glow.png` | Emotional/quest significance. |
| `temporal_device` | Temporal Device | `artifact` | portable, usable, temporal/quantum/dangerous | `stateful-object` | `sprite_item_temporal_device_icon.png`, `sprite_item_temporal_device_active.png` | Needs active/inactive visual state. |
| `cheesebadge` | Cheese Badge of Office | `easteregg` | portable, authority/easteregg | `inventory-icon` | `sprite_item_cheesebadge_icon.png` | Icon only unless it becomes a visible prop. |
| `sockpuppet` | Sock Puppet | `easteregg` | portable, usable, sarcastic | `inventory-icon` | `sprite_item_sockpuppet_icon.png`, `sprite_item_sockpuppet_talking.png` | Optional talking/insult state later. |
| `permapen` | PermaPen | `easteregg` | portable, usable, writing/destiny | `inventory-icon` | `sprite_item_permapen_icon.png`, `sprite_item_permapen_writing.png` | Optional writing overlay later. |
| `map` | Detailed Map | `tool` | portable, readable, usable, navigation | `document-readable` | `sprite_item_map_icon.png`, `sprite_item_map_open.png` | Useful UI/inventory bridge item. |
| `flashlight` | Flashlight | `tool` | portable, usable, durability | `stateful-object` | `sprite_item_flashlight_icon.png`, `sprite_item_flashlight_on.png`, `sprite_item_flashlight_dim.png` | Durability suggests possible visual states later. |

## Referenced but currently unresolved item IDs

These IDs are referenced by effects, requirements or transformations but are not currently listed in `ITEMS`. Do not generate final assets until code/canon confirms whether they should become real inventory items.

| Referenced ID | Source relationship | Suggested handling |
|---|---|---|
| `briefcase_key` | Requirement for `briefcase` | Decide whether this should be a real key item, a passcode flag, or legacy placeholder. |
| `classified_documents` | Inventory effect from `briefcase` | Decide whether opened briefcase grants a visible document item. |
| `empty_cup` | Transformation target from `coffee` | Add if coffee consumption should leave a persistent cup. |
| `goldfish_food` | Requirement for `dominic` | Add only if Dominic pickup/companion logic uses feeding as a real object interaction. |

## Asset readiness checklist

Before adding a generated sprite to the repo:

- Filename matches this cookbook.
- Transparent PNG unless deliberately a readable document panel.
- No readable text unless canon-specified.
- No UI labels, arrows, buttons or borders baked into the image.
- Reads clearly at intended displayed size.
- Same character/object state variants preserve recognisable design continuity.
- Click behaviour, if any, maps to parser commands.
- Visibility rules use existing flags or new flags introduced through tested engine logic.
- No save/load, parser, reducer, inventory or movement semantics are changed merely to fit art.

## Implementation guardrails for sprite layer patch

When implementing the sprite overlay model:

- Extend visual scene data non-breakingly with optional `sprites`.
- Rendering must tolerate missing/empty `sprites` arrays.
- Each sprite should be optional and presentation-only.
- `command` should dispatch through the same `COMMAND_INPUT` path as typed commands.
- Use `visibleWhen` only as presentation gating, not as hidden gameplay logic.
- Do not duplicate take/use/examine/talk logic in React.
- Do not change save/load code for this patch.
- Add tests proving clicked sprite commands and typed commands converge through the same parser path where practical.

## First generation batch recommendation

Generate these first as individual transparent PNGs, not sheets:

1. `sprite_dominic_idle.png`
2. `sprite_dominic_glasses.png`
3. `sprite_dominic_glare.png`
4. `sprite_dominic_interdimensional_threat.png`
5. `sprite_chef_tony_idle.png`
6. `sprite_chef_tony_warning.png`
7. `sprite_albie_idle.png`
8. `sprite_albie_blocking.png`
9. `sprite_albie_accepting_code.png`
10. `sprite_item_briefcase_locked.png`
11. `sprite_item_briefcase_open.png`
12. `sprite_item_runbag_icon.png`
13. `sprite_item_runbag_room.png`
14. `sprite_item_greasynapkin_room.png`
15. `sprite_item_greasynapkin_read.png`
16. `sprite_mabel_cameo_idle.png`

Do not generate sprite sheets until individual stills have been accepted. Sprite sheets are for animation consolidation, not initial concept exploration.
