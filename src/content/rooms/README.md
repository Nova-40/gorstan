# Gorstan Trials — Room Schema System

A comprehensive room-based world model for Gorstan that replaces the ASCII map system with structured room definitions, effect DSL, and runtime mechanics.

## 🏗️ Architecture Overview

### Core Components

- **Room Types** (`src/content/rooms/roomTypes.ts`) - TypeScript interfaces and Zod validation schemas
- **Effect Dispatcher** (`src/content/rooms/effects.ts`) - DSL parser and execution engine
- **Trial Rooms** (`src/content/rooms/trials/`) - Room definitions for each trial
- **Runtime Modules** (`src/runtime/trials/`) - Specialized mechanics for complex trials
- **Integration** (`src/content/rooms/integration.ts`) - RoomService and game engine integration

### Directory Structure
```
src/
├── content/rooms/
│   ├── roomTypes.ts          # Core types & validation
│   ├── effects.ts            # Effect DSL dispatcher
│   ├── integration.ts        # RoomService integration
│   ├── index.ts              # Main exports
│   └── trials/
│       ├── trial1.rooms.ts   # Switch harmony trial
│       ├── trial2_mfield.rooms.ts  # Mushroom field trial
│       └── trial3_reflection.rooms.ts  # Mirror cave trial
└── runtime/trials/
    ├── mfieldRuntime.ts      # Hexhound pursuit mechanics
    ├── reflectRuntime.ts     # Echo/clone mechanics
    └── index.ts              # Runtime exports
```

## 🎮 Room System Features

### Room Definition Schema
```typescript
interface Room {
  id: string;                    // Unique room identifier
  zone: ZoneId;                  // Trial grouping (trial1, trial2, trial3)
  name: string;                  // Display name
  description: string;           // Room description
  exits: Exit[];                 // Available movement directions
  triggers?: RoomTriggers;       // Event-based effects
  ambientAudio?: string;         // Background audio loop
  moveDelayMs?: number;          // Movement delay (pursuit mechanics)
  tags?: string[];               // Behavioral tags (safe_zone, mfield, etc.)
  miniAscii?: string[];          // ASCII minimap representation
  overlays?: Overlay[];          // Dynamic content overlays
}
```

### Effect DSL (Domain Specific Language)
String-based commands for room triggers:
- `say("message")` - Display narrative text
- `playSfx("sound")` - Play sound effect
- `setFlag("name")` - Set game flag
- `giveItem("item")` - Add item to inventory
- `timer(5000, "effect")` - Delayed execution
- `call("module.method", "arg")` - Runtime module integration

### Movement System
- **Directional Movement**: 8-direction support including diagonals (northeast, southeast, etc.)
- **Movement Delays**: Configurable delays for pursuit mechanics (mushroom field)
- **Safe Zones**: Tagged rooms with special behavior (panic freeze, no pursuit)
- **Zone Transitions**: Cross-trial movement with state preservation

## 🧪 Trial-Specific Mechanics

### Trial I: Switch Harmony
- 4 interconnected rooms with musical harmony puzzle
- Switch triggers with tone effects
- Harmony validation and completion flags
- **Rooms**: entrance, west, east, exit
- **Mechanics**: Musical tones, harmony checking

### Trial II: Mushroom Field (Complex)
- 12-room field with Hexhound pursuit system
- Movement delays and scent trail mechanics
- Safe zones and quantum diversions
- **Runtime**: `mfieldRuntime.ts` for pursuit logic
- **Mechanics**: Odor trails, pack behavior, anti-camping

### Trial III: Reflection Cave (Complex)
- 8-room mirror cave with echo/clone puzzles
- Pressure plates requiring dual activation
- Guardian distraction and sigil marking
- **Runtime**: `reflectRuntime.ts` for echo mechanics
- **Mechanics**: Echo positioning, beam splitting, guardian AI

## 🔧 Integration Guide

### Basic Setup
```typescript
import { setupRoomSystem } from '../content/rooms/integration';

// Initialize with game engine
const roomService = setupRoomSystem(gameEngine);

// Move to a room
await roomService.moveToRoom('elf_field_centre', 'north');

// Get current room data
const room = roomService.getCurrentRoomData();
```

### Effect System Registration
```typescript
import { registerEffectSystems } from '../content/rooms/effects';

registerEffectSystems({
  audio: audioSystem,
  flags: flagSystem,
  items: itemSystem,
  roomService: roomService
});
```

### Runtime Module Integration
```typescript
import { mfield, reflect } from '../runtime/trials';

// Mushroom field trip effect
await mfield.trip(context, 'fast');

// Reflection cave pressure plate
await reflect.press(context, 'harmony_plate', 10000);
```

## 📊 Room Validation

The system includes comprehensive validation:
- **Schema Validation**: Zod schemas ensure data integrity
- **Graph Validation**: Verifies room connections and zone consistency
- **Exit Validation**: Ensures bidirectional movement paths
- **Effect Validation**: Checks DSL syntax and module references

```typescript
import { validateRoomGraph } from '../content/rooms/roomTypes';

const results = validateRoomGraph(allRooms);
if (!results.isValid) {
  console.error('Validation errors:', results.errors);
}
```

## 🎯 Effect Context

Every effect receives a context object:
```typescript
interface EffectContext {
  roomId: string;              // Current room
  previousRoom?: string;       // Previous room (for transitions)
  direction?: string;          // Movement direction
  timestamp: number;           // Event timestamp
  items: string[];             // Player inventory
  flags: Record<string, boolean>; // Relevant game flags
}
```

## 🔄 Runtime State Management

### Mushroom Field State
- Pursuit tracking with odor strength
- Pack positioning and aggression levels
- Grace periods and quantum diversions
- Anti-camping safe zone mechanics

### Reflection Cave State
- Echo positioning and behavior
- Pressure plate states and timers
- Bridge activation sequences
- Guardian patrol and distraction

## 🎨 Mini ASCII Maps

Each room can include a miniature ASCII representation:
```typescript
miniAscii: [
  "┌─────────┐",
  "│ FIELD N │",
  "│    ⚡    │", 
  "│ [S] [E] │",
  "└─────────┘"
]
```

## 🚀 Extension Points

### Adding New Trials
1. Create room definition file in `src/content/rooms/trials/`
2. Define room schema with appropriate zone
3. Add runtime module if complex mechanics needed
4. Register with effect dispatcher

### Custom Effects
1. Extend effect dispatcher with new effect types
2. Add parsing logic for new DSL commands
3. Implement execution handlers
4. Register with runtime modules as needed

### Zone Extensions
1. Add new ZoneId to enum
2. Create room definitions with new zone
3. Implement zone-specific mechanics
4. Add validation rules

## 🔍 Debugging & Testing

### Room System Debug
```typescript
// Get pursuit status
const pursuitState = mfield.getPursuitStatus();

// Get reflection status  
const echoState = reflect.getEchoStatus();

// Validate specific room
const isValid = validateRoom(room);
```

### Testing Reset
```typescript
// Reset runtime states for testing
mfield.reset();
reflect.reset();
```

## 📋 Implementation Status

### ✅ Completed
- Core room type definitions with Zod validation
- Effect DSL parser and dispatcher
- All trial room definitions (Trial I, II, III)
- Mushroom field runtime with pursuit mechanics
- Reflection cave runtime with echo mechanics
- Integration framework with RoomService
- ASCII minimap support

### 🔄 Integration Needed
- RoomService connection to main game engine
- Audio system integration for ambient loops
- Flag system integration for state persistence
- Item system integration for inventory checks
- UI integration for minimap rendering

### 🎯 Future Enhancements
- Visual room editor
- Dynamic room generation
- Advanced AI behaviors
- Performance optimization
- Save/load state management

## 📚 Reference

### Zone IDs
- `trial1` - Switch harmony trial
- `trial2` - Mushroom field trial  
- `trial3` - Reflection cave trial

### Common Tags
- `safe_zone` - Safe from pursuit
- `mfield` - Mushroom field mechanics
- `reflect` - Reflection cave mechanics
- `puzzle` - Contains puzzle elements
- `ambient_audio` - Has background music

### Exit Directions
Standard: `north`, `south`, `east`, `west`, `up`, `down`
Diagonals: `northeast`, `northwest`, `southeast`, `southwest`

---

This room system provides a robust foundation for Gorstan's world model, supporting complex mechanics while maintaining clean, maintainable code architecture.
