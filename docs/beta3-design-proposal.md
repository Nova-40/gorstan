# Gorstan Beta 3 Design & Flow Proposal

*Date: August 23, 2025*  
*Branch: Beta3*  
*Status: Analysis & Planning Phase*

## 1.1 Inventory & Diagnostics

### Module Responsibility Map

**Core Game Engine**
- `src/components/AppCore.tsx` - Main game state coordinator (🔄 needs refactor)
- `src/state/gameState.tsx` - Complex state management (🔄 needs simplification) 
- `src/engine/` - Game logic components (📁 scattered, needs consolidation)

**UI & Presentation Layer**
- `src/components/ui/` - Basic UI primitives (⚠️ inconsistent styling)
- `src/components/` - Game-specific components (⚠️ mixed responsibilities)
- `src/styles/` - CSS styles (⚠️ no design tokens, style drift)

**Content & Data**
- `src/rooms/` - Room definitions (✅ working well)
- `src/data/` - Game content (✅ structured)
- `src/services/` - Business logic (⚠️ overlapping concerns)

**AI & NPCs**
- `src/services/npcAI.ts` - Basic NPC logic (🔄 needs "conscious" upgrade)
- `src/services/groqAI.ts` - AI integration (⚠️ not unified)
- `src/npc/` - NPC system components (⚠️ accessibility issues found)

**Known Pain Points**
1. **State Management**: Multiple state sources, no single source of truth
2. **Style Inconsistency**: Ad-hoc CSS, no design tokens
3. **Console Experience**: No teletype effect, inconsistent braille cursor
4. **Teleport System**: Multiple transition methods, no unified overlay system
5. **NPC AI**: Feels robotic, no conversational memory or typing indicators
6. **Accessibility**: Missing focus rings, incomplete keyboard navigation
7. **Performance**: No asset preloading, some unnecessary re-renders

### UX Scorecard (A-D Grading)

| Area | Current Grade | Issues |
|------|---------------|---------|
| **Navigation** | C | Multiple transition methods, no unified teleport system |
| **Feedback** | C | Inconsistent console output, missing typing indicators |
| **Onboarding** | D | No guided flow, overwhelming for new players |
| **Narrative Flow** | B | Good room descriptions, but pacing issues |
| **Accessibility** | D | Missing focus rings, incomplete keyboard paths, no screen reader support |
| **Performance** | C | No preloading, some stutters on room changes |
| **Visual Consistency** | D | No design tokens, mixed UI patterns |
| **Audio/FX** | C | Basic sounds, no zone-specific teleport effects |
| **Error Handling** | C | Basic error boundaries, needs user-friendly messages |
| **Save/Progress** | B | Functional save system, could be more seamless |
| **Dev Ergonomics** | C | Improved with QA fixes, still has linting issues |

**Target: All A grades before promotion to main**

### Duplicate/Overlapping Functions

**State Management**
- `gameState.tsx` + `PlayerState.ts` + individual component state (🔄 consolidate)
- Multiple reducers doing similar operations (🔄 unify)

**Styling Patterns**
- Inline styles + CSS modules + utility classes (🔄 standardize with tokens)
- Ad-hoc button variants (🔄 create Button primitive)

**AI Service Calls**
- `groqAI.ts` + `npcAI.ts` + `unifiedAI.ts` (🔄 single NPC router)

**Console Output**
- Multiple console writing methods (🔄 unified teletype system)

## 1.2 Proposed Changes (Diff-style)

### Architecture Refactor

```diff
src/
  components/
+   ui/           # Design system primitives
+     Button.tsx  # Unified button with variants
+     IconButton.tsx
+     Tooltip.tsx
+     Dialog.tsx
+     Card.tsx
+     Toast.tsx
+     Spinner.tsx
+   game/         # Game-specific components
+     ConsoleTerminal.tsx    # Teletype + braille cursor
+     QuickActionsPanel.tsx  # Redesigned with new buttons
+     DirectionIconsPanel.tsx
+     DebugMenu.tsx
+     AylaHintPopover.tsx
+     TeleportOverlays.tsx   # Zone-specific overlays
  services/
+   teleportManager.ts      # Unified transition system
+   soundManager.ts         # Centralized audio with zones
+   npcAiRouter.ts         # Single NPC AI coordinator
+   preloadService.ts      # Asset preloading
+   aylaHintSystem.ts      # Escalating hint system
  state/
+   useGameStore.ts        # Single source of truth (Zustand)
- Fragmented state files
  domain/
+   types.ts               # Centralized type definitions
+   constants.ts           # Design tokens and game constants
+ scenes/                  # Room-specific components
    controlNexus/
    glitchrealm/
    ...
```

### Design Standard Implementation

**Color Tokens** (`src/domain/constants.ts`)
```typescript
export const DESIGN_TOKENS = {
  colors: {
    background: '#0a0a0a',      // Deep black
    console: '#39FF14',         // Neon green
    zoneAccents: {
      intro: '#00BFFF',         // Electric blue
      glitchrealm: '#FF1493',   // Deep pink
      fantasy: '#9370DB',       // Purple
      scifi: '#00FFFF',         // Cyan
    },
    focus: '#FFD700',           // Gold focus rings
    error: '#FF4444',
    success: '#00FF88',
    warning: '#FFAA00',
  },
  spacing: {
    unit: 8,                    // Base unit
    targetSize: 40,             // Minimum touch target
  },
  borderRadius: 8,
  animation: {
    typewriterSpeed: 40,        // 35-45ms per character
    blinkInterval: 1000,        // Braille cursor blink
  }
}
```

**Console Teletype System** (`src/components/game/ConsoleTerminal.tsx`)
```typescript
interface TeletypeConfig {
  speed: number;                // 35-45ms per character
  punctuationPause: number;     // Extra pause after . ! ?
  skipToReveal: boolean;        // Click/key to complete
  brailleCursor: string;        // ⣿ character
  respectReducedMotion: boolean; // Instant text if prefers-reduced-motion
}
```

**Teleport Overlay System** (`src/services/teleportManager.ts`)
```typescript
interface TeleportConfig {
  overlayType: 'fractal' | 'trek-style';
  sfx: string;
  inputLock: boolean;
  maxDuration: 600; // milliseconds
  announce: string; // For screen readers
}

const ZONE_TELEPORTS = {
  glitchrealm: { 
    overlayType: 'fractal', 
    sfx: 'distortion.mp3',
    announce: 'Reality fracturing...'
  },
  default: { 
    overlayType: 'trek-style', 
    sfx: 'energise.mp3',
    announce: 'Teleporting...'
  }
}
```

### NPC AI "Consciousness" Upgrade

**Central Router** (`src/services/npcAiRouter.ts`)
```typescript
interface NPCConversationState {
  npcId: string;
  shortTermMemory: Message[];  // Last 10 exchanges
  currentMood: NPCMood;
  typingIndicator: boolean;
  lastInteraction: Date;
}

class NPCAiRouter {
  async sendMessage(npcId: string, message: string): Promise<NPCResponse> {
    // 1. Show typing indicator
    // 2. Apply safety filters
    // 3. Add conversation context
    // 4. Route to AI service (Groq/OpenAI)
    // 5. Apply fallback if timeout
    // 6. Update conversation state
    // 7. Return with appropriate delay
  }
  
  private getDeterministicFallback(npcId: string): string {
    // Offline/error responses that feel appropriate
  }
}
```

**Typing Indicators & Memory**
- Visual typing dots: `⚫⚫⚫` animated
- Short-term memory: Last 10 exchanges per NPC
- Ayla-style escalation: Gentle nudge → Specific hint → Direct instruction
- Safety filters: Content moderation + timeout handling

## 1.3 Future Game Flow (Player-Centric)

### Typical Session Wire-flow

**Opening (0-60 seconds)**
1. **Welcome Screen** - Clean design with "Start Game" / "Continue" / "Settings"
2. **Guided Onboarding** (skippable) - 60-second intro to basic commands
3. **Console Teletype Introduction** - Shows typing effect, introduces braille cursor
4. **First Room** - Control Nexus with clear directional hints

**First Hint & Discovery (1-3 minutes)**
1. **Ayla Introduction** - Gentle hint system explanation
2. **First Command** - "look around" or "examine console"
3. **Discovery Reward** - Small victory toast, console praise
4. **Clear Next Goal** - "Try going west to the control room"

**First Teleport (3-5 minutes)**
1. **Room Discovery** - Player finds teleport pad or command
2. **Zone-Specific Overlay** - Fractal distortion in glitchrealm, Trek-style elsewhere  
3. **Audio Feedback** - Zone-appropriate SFX
4. **Arrival Announcement** - Screen reader: "Arrived: [Room Name]"
5. **Continuation** - Clear next objectives visible

**Inventory & Interaction (5-10 minutes)**
1. **Item Discovery** - Clear pickup feedback with toast notifications
2. **Inventory Panel** - Accessible keyboard navigation
3. **Usage Examples** - Ayla provides contextual hints about item use
4. **Combination/Puzzle** - Items have clear interaction patterns

**Puzzle Resolution (10-15 minutes)**
1. **Problem Presentation** - Clear description of what needs solving
2. **Hint Escalation** - Ayla: nudge → hint → explicit guidance
3. **Progress Feedback** - Partial success indicators
4. **Victory Moment** - Celebration SFX, progress save, lore reveal

**Save/Quit/Return Flow**
1. **Auto-save Points** - Transparent background saving
2. **Manual Save** - Clear "Progress saved" confirmation
3. **Resume State** - Exact position + one-line recap in console
4. **Settings Persistence** - Audio levels, reduced motion, accessibility preferences

### Pacing & Friction Removal Changes

**Reduced Friction**
- No dead-ends: Every room has clear progression paths
- Fast travel unlocks: Teleport destinations become available after discovery
- Skip animations: All teletype/transitions can be instantly completed
- Clear objectives: Console shows 2-3 current tasks at all times

**Improved Pacing**
- Teletype punctuation pauses: Natural reading rhythm
- Reward loop timing: Small victories every 1-2 minutes
- Hint escalation: Never blocks progress, always offers next step
- Progress visualization: Clear advancement indicators

**Satisfaction Loops**
- **Immediate**: Button hover/click feedback, typing sounds
- **Short-term**: Room discoveries, item pickups, puzzle pieces
- **Medium-term**: Zone completion, NPC relationships, lore reveals  
- **Long-term**: Story progression, character development, world understanding

### Accessibility & Comfort Standards

**Keyboard Navigation**
- Tab order follows visual layout
- All interactive elements reachable
- Shortcuts for frequent actions (Space = skip teletype, / = help)
- Focus rings visible and high-contrast

**Screen Reader Support**
- Live regions for console output
- Descriptive link text and labels
- Navigation landmarks
- Zone/room announcements

**Motor/Cognitive**
- Large touch targets (40x40px minimum)
- Generous timing (no time pressure)
- Clear mental models (consistent interaction patterns)
- Reduced motion respect (instant text, no blink)

**Visual/Audio**
- High contrast (≥4.5:1 ratio)
- Volume controls with persistence
- Font size scaling support
- Color is not the only indicator

### Risk Mitigation

**Technical Risks**
- *Risk*: AI service downtime → *Mitigation*: Deterministic fallbacks for all NPCs
- *Risk*: Asset loading delays → *Mitigation*: Preload next-room assets + loading indicators
- *Risk*: Performance on lower-end devices → *Mitigation*: Lazy loading + performance monitoring

**UX Risks** 
- *Risk*: Teletype too slow/fast → *Mitigation*: Configurable speed + skip option
- *Risk*: Accessibility gaps → *Mitigation*: Comprehensive testing with actual assistive tech
- *Risk*: Overwhelming new players → *Mitigation*: 60-second guided intro + optional tutorial mode

**Content Risks**
- *Risk*: AI generates inappropriate content → *Mitigation*: Content filters + human-written fallbacks
- *Risk*: Puzzle difficulty spikes → *Mitigation*: Ayla hint escalation + multiple solution paths

## Implementation Priority Queue

### Phase 1: Foundation (Days 1-2)
1. ✅ Create design tokens (`src/domain/constants.ts`)
2. ✅ Implement UI primitives (`src/components/ui/`)
3. ✅ Create unified state store (`src/state/useGameStore.ts`)

### Phase 2: Core Experience (Days 3-4)
1. ✅ ConsoleTerminal with teletype + braille cursor
2. ✅ TeleportManager with zone-specific overlays
3. ✅ SoundManager with zone audio support
4. ✅ PreloadService for asset optimization

### Phase 3: AI & Interaction (Days 5-6)
1. ✅ NPCAiRouter with conversation memory
2. ✅ AylaHintSystem with escalation
3. ✅ Enhanced QuickActionsPanel
4. ✅ Accessibility audit and fixes

### Phase 4: Polish & Testing (Days 7-8)
1. ✅ Onboarding flow (60-second guided intro)
2. ✅ Performance optimizations
3. ✅ Comprehensive testing (unit + E2E)
4. ✅ UX scorecard validation (all A grades)

## Success Criteria for Beta 3 Promotion

**Must Have (All Required)**
- [ ] All UX scorecard areas grade A
- [ ] Console teletype working with braille cursor and reduced-motion support
- [ ] Unified teleport system with zone-specific overlays and SFX
- [ ] NPCs feel "conscious" with typing indicators and conversation memory
- [ ] Full keyboard navigation with visible focus rings
- [ ] Asset preloading with <200ms room transitions
- [ ] Unit tests pass for all new systems
- [ ] E2E tests cover critical user journeys
- [ ] Clean build with no console warnings

**Quality Gates**
- Performance: UI <100ms, room transitions <200ms
- Accessibility: ≥4.5:1 contrast, full keyboard paths, screen reader support
- Reliability: AI fallbacks work offline, no dead-ends in gameplay
- Consistency: Design tokens used throughout, unified interaction patterns

This proposal serves as the roadmap for transforming Gorstan from a functional game into a polished, accessible, and delightful player experience that meets modern web app standards.

*Next Step: Begin Phase 1 implementation with design tokens and UI primitives.*
