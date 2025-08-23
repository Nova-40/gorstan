# Gorstan Beta 3 — AI Refactor Master Instructions

*This file consolidates everything Copilot/Claude (or other AI assistants) need to carry out the Gorstan Beta 3 refactor. It references `docs/beta3-instructions.md` as the canonical design/flow spec and adds pointers to assets, personas, and additional requirements.*

---

## 0. Canonical Reference

* Primary spec: `docs/beta3-instructions.md` (step-by-step build instructions, directory layout, and success criteria).
* Supplementary design document: `docs/beta3-design-proposal.md` (proposal and rationale).
* UX grading: `docs/ux-scorecard.csv` (must all reach A before promotion).

---

## 1. Directory & Files to Preserve/Create

* Use the exact **directory layout** defined in `beta3-instructions.md`.
* Delete all unused legacy `.md` files and non-Beta3 code.
* Preserve only:
  * `docs/beta3-instructions.md`
  * `docs/beta3-design-proposal.md`
  * `docs/ux-scorecard.csv`
  * `tokens.json`
* Create new YAML persona files in `src/npc/personas/` and dialogue files in `src/npc/dialogue/`.

---

## 2. Design Tokens

* File: `tokens.json` (single source of truth).
* Must generate both Tailwind config and `src/domain/constants.ts`.
* Values:
  * Colors: bg `#0B0F0E`, surface `#111615`, text `#A7B0A5`, console `#39FF14`.
  * Zone accents: glitch `#8A2BE2`, nexus `#00E5FF`, elfhame `#7CFC00`, maze `#FFB300`.
  * Radii: 8px, 14px.
  * Spacing: 4, 8, 12, 16, 24.
  * Min hit target: 40px.
  * Animation: typeSpeed 35–45ms, blink 1000ms.

---

## 3. ConsoleTerminal

* File: `src/components/game/ConsoleTerminal.tsx`.
* Features:
  * Teletype reveal (35–45ms/char, punctuation pauses: `,` +50ms, `. ! ? : ;` +150ms, `…` +400ms).
  * Braille cursor `⣿` blinking (Tailwind `animate-blink`).
  * Skip-to-reveal on key/click.
  * Reduced motion = instant text, no cursor blink.
  * Console container has `aria-live="polite"`.
* Helper: `withGorstanSnark()` appends witty bureaucratic endings.

---

## 4. TeleportManager

* File: `src/services/teleportManager.ts`.
* API: `go(toRoom, opts?)`.
* Logic:
  * Lock input → choose overlay (Fractal glitchrealm, Trek elsewhere) → play SFX → ≤600ms perceived → set room → SR announce "Arrived: {Room}" → print deduped description.
  * Ceremony lines: Depart = "Filing you elsewhere…", Arrive = "Filed."
  * Deduplicate arrival console lines.
  * Guard against double triggers.

---

## 5. NPC AI

* File: `src/services/npcAiRouter.ts`.
* Must be provider-agnostic (Groq/OpenAI).
* Streaming to ConsoleTerminal.
* Per-NPC memory (10–20 lines).
* Typing indicators.
* Retry/backoff.
* Deterministic offline fallbacks (per persona).

**Personas (YAML in `src/npc/personas/`):**
* `ayla.yaml` — ethics-first, asks moral Q before advice.
* `dominic.yaml` — meta goldfish, 10s memory gag.
* `polly.yaml` — practical, bullet-point pragmatist.
* `albie.yaml` — excitable, curious.
* `mr_wendell.yaml` — velvet menace, polite threats.
* `librarian.yaml` — archivist of sentience, believes creators returned as infants, offers patterns not conclusions.

**Dialogue:**
* `src/npc/dialogue/librarian_opening.md` — Librarian's intro monologue + branches.

---

## 6. Canon Items & Lore

* **Schrödinger coin**: paradoxical inventory logic, console copy = "You don't have it. Unless you do. You don't."
* **Napkin + extrapolator**: puzzle with set-up/payoff.
* **Redacted Register**: collectible pages unlock satirical lore entries in a `lore` console viewer (new `lore` command).

---

## 7. Retention Systems

* Add task panel: always show 2–3 diegetic tasks in console; persists to save.
* Guarantee micro-win every 60–90s (item, quip, lore snippet).
* On resume: one-line recap + audacious promise.
* Collections: Register pages, glitch postcards, stingers.

---

## 8. Accessibility

* Contrast ≥4.5:1.
* Focus rings visible (2px, accent color).
* Full keyboard navigation.
* Tooltips with shortcuts.
* Dialogs trap focus; ESC closes.
* Screen reader brevity (announce arrivals once).

---

## 9. Performance

* UI <100ms, room switch <200ms median.
* Preload next-room assets (gif/audio).
* Lazy-load heavy zones.
* Prefer WebM over GIF if possible.

---

## 10. Testing & CI

* **Unit (Vitest):** teleportManager, ConsoleTerminal, soundManager, preloadService, npcAiRouter.
* **E2E (Playwright):** first-run → teleport overlays, keyboard-only flow, reduced-motion instant text, NPC dialogues with fallbacks.
* **CI:** ESLint, Prettier, TS strict, axe accessibility, clean build.

---

## 11. Success Criteria (Promotion Gate)

* All UX areas **Grade A** in `docs/ux-scorecard.csv`.
* Console teletype + ⣿ cursor everywhere.
* Unified teleport overlays + SFX.
* NPCs fully via npcAiRouter with persona fidelity + fallbacks.
* Recap + tasks functional.
* Build clean, all tests green, game fully playable end-to-end.

**Promotion sequence:**
```bash
git checkout main && git pull --rebase
git merge --no-ff Beta3 -m "Promote Beta3 (refactor + A-grade UX + AI NPCs)"
git tag -a v3.0.0 -m "Gorstan Beta 3"
git push origin main --tags
```

**Netlify publish:**
* Build: `npm ci && npm run build`
* Publish: `dist/`
* Deploy: `netlify deploy --build --prod`

---

## 12. Motto

> "Make it fast, make it kind, make it quietly hilarious. If a screen sits still for five seconds without delight or direction, it owes the player an apology — preferably a witty one."
