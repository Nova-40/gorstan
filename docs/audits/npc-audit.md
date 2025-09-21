# NPC Audit — Phase A: Discover & Inventory

Generated: 2025-09-21

Purpose: inventory NPC definitions, conversation points, AI wiring, and static dialogue in the codebase under `src/`.

---

Summary table columns: Path | Export | Type (component/class) | Has AI? (Y/N) | Inbound (player) | Outbound (NPC→NPC) | Test?

## NPCs & Conversation Points

| Path | Export | Type | Has AI? | Inbound (player) | Outbound (NPC→NPC) | Test? |
|---|---|---:|---:|---:|---:|---:|
| `src/npc/personas.ts` | `NPC_PERSONAS`, `getPersona` | data/module | Y (persona used by AI layers) | N/A | N | N |
| `src/npc/ayla/aylaResponder.ts` | (module functions) | module | Y (calls ayla/responder/edge-case logic) | Y (handles player queries) | N | Y (npc tests reference Ayla via integration tests) |
| `src/npc/personas.ts` | `AYLA_PERSONA` etc. | data | Y (persona definitions) | N/A | N | N |
| `src/components/EnhancedNPCConsole.tsx` | default `EnhancedNPCConsole` | React component | Y (uses `getEnhancedNPCResponse`, `groqAI`) | Y (onSendMessage → AI path) | Y (GroupChatManager triggers orchestrated group chat) | Y (integration tests reference group flows) |
| `src/components/NPCConsole.tsx` | `NPCConsole` | React component | Partial (uses scripted + AI fallback via `getEnhancedNPCResponse`) | Y | N | Y (integration tests) |
| `src/components/AppCore.tsx` | `AppCore` | React component | Y (wires NPC AI via `npcAI`, `unifiedAI`, `AylaHintSystem`) | Y (npcReact calls) | Y (periodicConversationCheck / Group triggers) | Y (integration tests) |
| `src/utils/enhancedNPCResponse.ts` | `getEnhancedNPCResponse` | module | Y (calls `groqAI.generateNPCResponse`) | Y (used by console components) | N | N |
| `src/utils/aylaBrain.ts` | `getAylaEdgeCaseResponse`, `getCoreAylaResponse` | module | Partial (legacy logic) | Y | N | Y (demo/integration tests reference Ayla lines) |
| `src/utils/npcKnowledgeBase.ts` | KB functions | module | Partial (scripted knowledge fallback) | Y | N | N |
| `src/utils/npcConversationHistory.ts` | conversation history APIs | module | N | Y (history used in AI calls) | N | Y (tests for memory/history) |
| `src/npc/groupChatLogic.ts` | `GroupChatManager` | module | Partial (orchestration for NPC→NPC) | N | Y | Y (group chat tests) |
| `src/npc/triggers.ts` | `periodicConversationCheck`, `onRoomEntry` | module | Y (wired to AppCore periodic checks) | N | Y (triggers NPC→NPC via groupChatLogic) | Y (npc triggers tests) |
| `src/npc/registry.ts` | `registry` | module | N | N | N | N |
| `src/npc/ayla/personality.ts` | `applyAylaPersonality` | module | N (persona data) | N | N | N |
| `src/npc/wendell/*` | `wendellView`, `wendellAI` etc. | module/component | Partial (wendell AI helpers present) | Y | N | Y (wendell tests) |
| `src/npc/*` (wanderers, wanderScheduler, etc.) | many exports | modules | N (mostly movement/behavior) | N | Y (triggers) | Y (many unit tests) |


### Notes on table entries
- "Has AI?": marked Y when codepaths call AI services (`groqAI`, `npcAI`, `unifiedAI`, `getEnhancedNPCResponse`, `groqAI.generateNPCResponse`). Many modules contain both scripted fallbacks and AI calls.
- Inbound: whether player input routes through this component/module (console, AppCore, `getEnhancedNPCResponse`, `aylaResponder`, etc.).
- Outbound: whether the module triggers NPC→NPC exchanges (GroupChatManager, orchestrated triggers in AppCore/EnhancedNPCConsole).

---

## Static Dialogue (hard-coded strings/arrays used at runtime)

These are runtime static dialogue snippets (not in tests) and could block or limit AI usage if left as primary responses.

- `src/components/EnhancedNPCConsole.tsx`
  - Many hard-coded greetings and scripted fallback responses, e.g. `getGroupGreeting`, `getSingleGreeting`, `isRudeToWendell` death message, reaction messages. These are used at runtime (greetings, group reactions, death trigger) and will be used as scripted fallbacks if AI times out.
  - Several explicit NPC catchphrases and scripted content (e.g., Wendell death line) which are used unconditionally.

- `src/utils/enhancedNPCResponse.ts`
  - `getEnhancedNPCResponse` uses scripted fallback functions: `getKnowledgeBaseReply`, `getIntelligentFallback`, and `enhanceOriginalResponse`. These functions contain static responses and knowledge-base entries in `src/utils/npcKnowledgeBase.ts`.

- `src/npc/personas.ts`
  - `NPC_PERSONAS` includes many `catchphrases`, `forbidden_topics`, and persona text used to seed AI or as fallback text.

- `src/components/AppCore.tsx`
  - Demo messages referencing Ayla explicitly (used in demo integration). Also contains logic selecting Ayla as default helper with hard-coded `aylaHelper` object.

- `src/utils/npcKnowledgeBase.ts`
  - Contains NPC-specific knowledge and static replies used at runtime by `getKnowledgeBaseReply`.

- `src/components/EnhancedNPCConsole.tsx` (again)
  - Scripted weighted selection for group response selection and scripted `getScriptedResponse` lookup and `getScriptedResponse` switch.

Static Dialogue impact notes:
- These static strings act as scripted fallbacks if AI fails or is rate-limited. Refactoring to call the new `NpcDialogueEngine` should preserve these as fallback 'static' content rather than primary unless explicitly desired.
- Some death/irreversible consequences are encoded in static strings (e.g., Wendell death). Ethics/AI layers must ensure they can't be triggered by unsafe inputs or used to leak sensitive info.

---

## Single terminal/console UI message pump (where player input becomes NPC replies)

Primary paths where player input is handled and NPC replies are injected:

- `src/components/EnhancedNPCConsole.tsx`:
  - Props: `onSendMessage: (message: string, npcId: string) => void` — this is the UI entry for player messages.
  - Internally calls `getEnhancedNPCResponse` and `groqAI.generateNPCResponse` for AI replies; it also uses `GroupChatManager` to orchestrate NPC→NPC exchanges.
  - Injects NPC replies into local `messages` state; also dispatches game state updates via `dispatch({ type: 'ADD_MESSAGE', payload: ... })` in multiple places.
  - Side routes: group chat orchestration (`GroupChatManager.orchestrateGroupChat`), death/reset triggers, and modal overlays.

- `src/components/NPCConsole.tsx` / `src/components/AppCore.tsx`:
  - AppCore wires `npcReact(npcId, message, state)` to send messages to the NPC engine.
  - AppCore also calls `npcAI.getAllNPCs()` and `unifiedAI` / `AylaHintSystem` for automated hints and AI content.
  - `npcReact` / `npcEngine` and `npcRegistry` are central — `npcReact` is invoked when player submits commands (see AppCore `handleSendMessage` paths) and results are added to state/messages.

Side routes (modals, overlays):
- `UnifiedAIPopup` (lazy-loaded) — may display AI-generated guidance outside the NPC console.
- `AylaHintPopup` — Ayla-specific hints and help overlays.
- `MiniQuestOverlay` and other modals that display narrative strings originating from AI or scripted fallbacks.

Exported functions of interest (injection points):
- `npcReact(npcId, message, state)` — central call from UI to NPC engine (AppCore). File: `src/engine/npcEngine.ts` or `src/engine` (search shows references in AppCore). This function is the primary message pump used by the UI.
- `GroupChatManager.orchestrateGroupChat` — triggers multi-NPC exchanges.
- `getEnhancedNPCResponse(npcId, playerInput, state)` — wrapper that uses AI with scripted fallback.

---

## Tests referencing NPC flows

- `src/npc/__tests__` — many tests cover movement, scheduling, triggers, and error handling.
- `src/__tests__/integration/demoValidation.test.ts` — references Ayla welcome/demo lines and `talk to ayla` command.
- `src/components/__tests__` — console/integration tests reference EnhancedNPCConsole behaviors and group conversation logic.

---

## Gaps & Risks (observations that affect Phase B onward)

- AI is already partially wired via `getEnhancedNPCResponse` and `groqAI`. We should wrap or replace those calls with the new `NpcDialogueEngine` and `withEthics(...)` provider to centralize ethics checks and preambles.
- Many components already implement scripted fallbacks — preserve them as fallback content; do not remove until engine wiring is confirmed stable.
- Several one-off static lines imply irreversible gameplay actions (e.g., Wendell death). Ethics and safety checks should ensure such content can't be triggered maliciously by player-crafted inputs.
- Multiple places pick random scripted responses and may call AI only as an optional path; standardizing the engine will simplify auditing and rate-limiting.

---

## Next (Phase B) readiness notes

- There is an obvious integration point: replace `getEnhancedNPCResponse` and direct `groqAI` calls with the new `NpcDialogueEngine.reply(...)` call. `EnhancedNPCConsole` and `AppCore` are primary consumers.
- `npc/personas.ts` already provides persona data suitable to construct `NpcPersona` objects required by Phase C.
- `GroupChatManager` and `EnhancedNPCConsole` show clear places to call `npcToNpc(...)` for NPC↔NPC orchestration.

---

Generated by automated repo audit (Phase A) — inventory complete. Save location: `docs/audits/npc-audit.md`.
