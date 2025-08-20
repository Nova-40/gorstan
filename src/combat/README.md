# Combat System

A comprehensive combat and magic system for Gorstan featuring melee combat, elemental magic, status effects, and AI-driven enemies.

## Core Systems

### Combat System (`CombatSystem.ts`)
- **Action Queue**: Manages combat actions with timing windows
- **Resource Management**: Stamina, Focus, Tension tracking
- **State Management**: Combat states (Idle, Windup, Active, Recovery, Staggered)
- **Combo System**: Light/Heavy attacks with cancel windows

### Magic System (`MagicSystem.ts`)
- **Spell Casting**: Focus-based spell system with cooldowns
- **Channeling Support**: Windup/recovery timing for spells
- **Interrupt Mechanics**: Casting can be interrupted by damage

### Hit Resolution (`HitResolver.ts`)
- **Damage Calculation**: Armor, resistances, critical hits
- **Elemental Interactions**: Fire/Frost/Shock with synergies
- **Ward System**: Absorption-based magical protection

### Status Effects (`StatusSystem.ts`)
- **Stackable Effects**: Burn, Chill, Shock with stack thresholds
- **Elemental Synergies**: Wet+Shock=Overload, Chill×3=Frozen
- **Timing System**: Tick-based DoT effects with proper cleanup

### Targeting System (`TargetingSystem.ts`)
- **Smart Targeting**: Nearest enemy, cycle targets, name-based
- **Range Checking**: Distance-based target validation
- **Faction Support**: Ally/Enemy/Neutral targeting rules

### AI System (`UtilityAI.ts` + `Archetypes.ts`)
- **Utility AI**: Score-based behavior selection
- **Archetypes**: Brute (tanky melee), Skirmisher (mobile), Caster (magic)
- **Dynamic Decisions**: Health, distance, cooldown considerations

## Combat Verbs

### Melee Actions
- **Light Attack**: Fast, low damage, builds combo
- **Heavy Attack**: Slow, high damage, posture breaker
- **Perfect Dodge**: I-frames + Riposte window
- **Parry**: Timing-based defense + Riposte opportunity
- **Riposte**: Counter-attack during opportunity window

### Spells (6 Implemented)
- **FireBolt**: Single-target fire damage + Burn
- **FrostNova**: AoE frost damage + Chill stacks  
- **ChainLightning**: Arcing shock damage (enhanced when Wet)
- **Blink**: Short teleport + brief invulnerability
- **Ward**: Damage absorption shield
- **TimeDilation**: Slow-motion effect (respects PRM)

### Resources
- **Health**: Life points
- **Stamina**: Physical actions (melee, dodge, parry)
- **Focus**: Magical actions (spells)
- **Tension**: Special abilities (builds on aggression)
- **Poise**: Posture/balance (breaks → Stagger)

## Status Effects & Synergies

### Primary Effects
- **Burn**: Fire DoT (3 damage/tick, 4s duration)
- **Chill**: Movement slow (stacks to Frozen at 3)
- **Frozen**: Complete immobilization (2s, shatters on heavy hit)
- **Shock**: Arcing damage (enhanced when Wet)
- **Wet**: Doubles shock effects, enables Overload
- **Stagger**: Temporary incapacitation (1.5s)

### Synergies (Implemented)
- **Wet + Shock = Overload**: AoE shock burst
- **Chill×3 + Heavy = Shatter**: Bonus damage, removes Frozen
- **Oil + Fire = Conflagration**: Enhanced/extended burn (hook ready)

## AI Archetypes

### Brute
- **Focus**: Melee combat, high armor
- **Behaviors**: Attack, charge, guard
- **Weaknesses**: Slow, vulnerable to magic

### Skirmisher  
- **Focus**: Mobility, ranged attacks
- **Behaviors**: Kite, dodge, flank
- **Weaknesses**: Low health, weak to heavy hits

### Caster
- **Focus**: Spell casting, distance
- **Behaviors**: Maintain range, interrupt, teleport
- **Weaknesses**: Very fragile, vulnerable when casting

## Encounters

### Tutorial: Parry Training
- **Opponent**: Training Dummy (reduced damage, predictable)
- **Goal**: Learn parry timing mechanics

### Tutorial: Elemental Mastery
- **Opponents**: Water Elemental + Fire Sprite
- **Goal**: Practice elemental synergies

### Mini-Boss: Aevira Warden
- **Challenge**: Ward magic that drains faster under Shock
- **Strategy**: Either parry/riposte mastery OR shock combo focus

## Accessibility Features

### Prefers-Reduced-Motion Support
- **Visual Cues**: Static text emphasis when motion disabled
- **TimeDilation**: Text-only variant instead of visual effects
- **All Animations**: Graceful fallback to static variants

### Clear Feedback
- **Console Output**: Detailed action results
- **Audio Cues**: Distinct sounds for each action type
- **Visual Hierarchy**: Important information prominently displayed

## Extension Points

### Adding New Spells
1. Create spell in `src/magic/spells/NewSpell.ts`
2. Follow `Spell` interface pattern
3. Add to spell registry
4. Define focus cost in `balance.ts`

### Adding New Status Effects
1. Define in `StatusEffects` factory
2. Add to `StatusType` enum
3. Implement tick/apply/remove callbacks
4. Add synergy logic if needed

### Adding New AI Behaviors
1. Add behavior string to archetype
2. Implement scoring function in `UtilityAI`
3. Add execution logic
4. Tune weights in `balance.ts`

### Adding New Archetypes
1. Define in `Archetypes.ts`
2. Create factory function
3. Define stat modifiers and behaviors
4. Add to `AIArchetype` enum

## Performance Notes

- **60fps Target**: All timing based on delta time
- **Memory Management**: Status effects cleaned up automatically
- **Batch Updates**: Single update call handles all systems
- **Optimized Queries**: Cached target lists, minimal distance calculations

## Integration Points

- **Console Commands**: `cast`, `parry`, `dodge`, `focus`, `encounter`
- **UI Components**: QuickActionsPanel for spell buttons
- **Save System**: Combat state can be serialized
- **Analytics**: Telemetry hooks for combat metrics
