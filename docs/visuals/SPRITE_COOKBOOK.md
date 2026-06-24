# Gorstan Sprite Cookbook

Status: Draft v1 — documentation-only inventory, object and character sprite planning guide.

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

### Dominic

Dominic is not a man.

Dominic is a cute-looking but vicious interdimensional goldfish/beast. He should read first as a small orange goldfish, then as a judgemental, intelligent, dangerous presence if the player looks twice. Half-moon glasses are optional.

Required candidates:

| Asset | Use |
|---|---|
| `sprite_dominic_idle.png` | Default portable bowl / companion presence. |
| `sprite_dominic_glasses.png` | Optional scholarly/judgemental state. |
| `sprite_dominic_glare.png` | Suspicious, intelligent, displeased state. |
| `sprite_dominic_interdimensional_threat.png` | Subtle beast-energy reveal; still recognisably small goldfish silhouette. |
| `sprite_dominic_sheet.png` | Later animation sheet if needed. |

Visual constraints:

- Small goldfish silhouette.
- Cute at first glance.
- Expressive, intelligent, judgemental eyes.
- Dangerous on second look.
- Interdimensional shimmer, impossible shadow, faint portal-ripple or reality-tear edge may be used sparingly.
- Do not depict as a human, mascot man, wizard, businessman, professor, wizard-fish hybrid with legs, or ordinary grumpy cartoon fish.

### Current New York / Alveira slice

| Asset | Classification | Notes |
|---|---|---|
| `sprite_chef_tony_idle.png` | `priority-character` | Burger Joint chef; separate from background. |
| `sprite_chef_tony_warning.png` | `priority-character` | Use when warning/refusing/explaining AEVIRA path. |
| `sprite_albie_idle.png` | `priority-character` | Warehouse contact/guard presence. |
| `sprite_albie_blocking.png` | `priority-character` | Blocks access or bounces player without passcode. |
| `sprite_albie_accepting_code.png` | `priority-character` | AEVIRA accepted / briefcase activated state. |
| `sprite_item_briefcase_locked.png` | `stateful-object` | Before unlock. |
| `sprite_item_briefcase_open.png` | `stateful-object` | After unlocking; should feel important, not just luggage having a moment. |
| `sprite_item_greasynapkin_room.png` | `document-readable` | Blueprint/sauce clue; can also have inventory icon. |

### Dale / intro / companion set

| Asset | Classification | Notes |
|---|---|---|
| `sprite_item_runbag_icon.png` | `priority-inventory` | Mechanically important capacity item. |
| `sprite_item_runbag_room.png` | `priority-inventory` | Dale's Apartment pickup candidate. |
| `sprite_mabel_cameo_idle.png` | `priority-character` | Cameo sprite only; do not bake into room background. |
| `sprite_item_goldfish_food_icon.png` | `defer/no-sprite` | Referenced requirement for Dominic but not currently defined in `ITEMS`; add only when item exists or room logic requires it. |

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

## Room-object and stateful overlay guidance

Use room overlays for these even when they are not ordinary inventory items:

| Object | Suggested asset(s) | Commands |
|---|---|---|
| Café Office chair | `sprite_object_cafeoffice_chair_idle.png`, `sprite_object_cafeoffice_chair_ready.png` | `inspect chair`, `sit chair` |
| Control Nexus chair | `sprite_object_controlnexus_chair_idle.png`, `sprite_object_controlnexus_chair_active.png` | `inspect chair`, `sit chair` |
| Intro Reset switch | `sprite_object_introreset_switch_blank.png`, `sprite_object_introreset_switch_blue.png`, `sprite_object_introreset_switch_red.png`, `sprite_object_introreset_switch_flashing_red.png` | `inspect switch`, `press switch`, `use switch` |
| Briefcase | See inventory catalogue. | `inspect briefcase`, `open briefcase`, `use briefcase` |
| Greasy napkin | See inventory catalogue. | `inspect napkin`, `read napkin`, `take napkin` |
| Screens/portals/mirrors | Overlay-ready surfaces, no baked-in UI text. | `inspect screen`, `use console`, `inspect portal` as applicable |

## Implementation guardrails

1. Add sprite metadata to visual scene definitions only.
2. Do not change save/load while adding sprites.
3. Do not change parser, reducer, inventory, movement or story state semantics unless a failing test proves the current behaviour is wrong.
4. Clicks must dispatch parser commands through the same path as typed commands.
5. Missing sprite arrays must be safe: scenes with no sprites should render without error.
6. `visibleWhen` should consume existing flags; it must not create gameplay state in React.
7. Art generation should not bake NPCs, items, UI labels, route buttons or readable puzzle text into background plates.
8. Keep asset generation separate from code wiring: first define the catalogue, then generate art, then wire sprite metadata, then test typed/clicked command convergence.

## Suggested next patch

Small safe patch after validation/manual playtest:

1. Add optional `sprites` field to the visual scene type.
2. Render sprite overlays above the room image and below UI/modal layers.
3. Use the existing command dispatch path for sprite clicks.
4. Add one non-gameplay fixture/test scene with no sprites and one with a clickable sprite.
5. Wire only one real room first, preferably Dale's Apartment or Burger Joint.

Do not implement all sprites in one patch. That way lies the sort of boldness normally seen in procurement strategy slides.
