
# 🧠 Gorstan Developer Cheat Sheet (v2.8.4 Enhanced)

## 🔹 STARTUP FLOW
1. WelcomeScreen → "Enter Simulation"
2. TeletypeIntro (press Jump, Wait, or Sip Coffee)
3. Game begins at:
   - Jump: controlnexus (coffee in inventory, +10 score)
   - Wait: introreset (coffee dropped, -10 score)
   - Sip: quantumlattice (+40 score, lore revealed)

## 🔹 BASIC COMMANDS
- `look`: Examine surroundings (shows extra detail with Curious trait)
- `inventory` or `inv`: View inventory
- `ask Ayla about [topic]`: Ask Ayla about lore, hints, etc.
- `use [item]`: Try to use item in context
- `throw coffee`: May trigger secret tunnel access (in controlroom)

## 🔹 TRAITS
| Trait     | Effect |
|-----------|--------|
| Curious   | Reveals hints, unlocks lore-based puzzles |
| Ambitious | Extra points for actions, enables Seeker |
| Seeker    | Grants access to metaphysical layers |
| Defiant   | Secret trait after 3 resets and rule-breaking |
| Awakened  | Endgame unlock after lattice puzzle |

## 🔹 PUZZLES (Examples)
- **controlroom**: Use `scan note`, `insert shard` → unlocks east exit if player has foldedNote, faeCrownShard, and Curious trait.
- **quantumlattice**: Use `align sigils`, `whisper passphrase` if Seeker → gain Awakened trait.

## 🔹 TRAPS
- Rooms may contain traps (checkForTrap)
- Disarm by leaving in <3 seconds
- Debug mode: `/traps` to list them

## 🔹 ENDINGS
| Ending ID | Conditions |
|-----------|------------|
| ascend    | Score ≥ 300 + Awakened |
| rebel     | Defiant trait + trapEvasionComplete flag |
| lost      | 7+ resets + score < 0 |

## 🔹 ACHIEVEMENTS
- **no_ayla**: Complete without asking Ayla
- **puzzle_master**: Solve 5 puzzles
- **trait_collector**: Unlock 5 traits

## 🛠️ DEBUG COMMANDS
- `/debug`: Enables developer panel
- `/doors`: Show all exits in room (god mode only)
- `/traps`: List traps (if debug)
- `/reset`: Force game reset
