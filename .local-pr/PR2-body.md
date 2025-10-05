Title: PR #2 — NPC DialogueEngine + LoreGate (offline-first, canon-safe)

Summary
Implements an extensible NPC dialogue system with an offline deterministic fallback and a LoreGate that vetoes replies contradicting canon. Adds a simple React hook and Ayla demo panel, unit tests, and docs updates.

Key changes
- src/core/npcs/DialogueEngine.ts — orchestrates providers + LoreGate, offline-first.
- src/core/npcs/types.ts — DialogueContext/Result contracts.
- src/core/npcs/providers/LLMProvider.ts — env-driven adapter; no network without API key.
- src/core/npcs/providers/OfflineTreeProvider.ts — deterministic, quest-aware responses.
- src/core/npcs/LoreGate.ts — conservative token check; neutral fallback on veto.
- src/core/hooks/useNPCDialogue.ts — hook for components.
- src/components/AylaPanel.tsx — dev/demo, shows dialogue flow.
- tests/unit/npcs/* — unit tests for providers, LoreGate, engine.
- docs/system-map.md & README.md — AI provider setup & fallback documented.

Env & privacy
- .env keys: GORSTAN_AI_PROVIDER, GORSTAN_AI_API_KEY, GORSTAN_AI_MODEL, GORSTAN_TELEMETRY.
- Offline by default; telemetry off by default.

Acceptance checklist
- Build, lint, and typecheck pass.
- Unit tests green; coverage ≥80% for src/core/npcs/**.
- LoreGate veto works and returns neutral fallback text.
- LLMProvider does not call network without a key/provider.
- Demo AylaPanel shows useNPCDialogue flow.
- Docs updated (system map & README).

Notes / follow-ups
- PR 2.1: integrate a real LLM client behind a service adapter.
- PR 3: enhance LoreGate with semantic checks or per-NPC allowlists.
