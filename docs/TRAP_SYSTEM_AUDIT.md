# Trap System Audit

## Purpose

This note records the current trap-system control position after the canonical authored trap adapter was introduced and parser trap commands were routed through it.

The goal is to avoid blind deletion while legacy trap paths still have live runtime references.

## Current active path

### `src/engine/canonicalTrapEngine.ts`

Status: active canonical authored trap path.

Used for:

- authored/static room trap metadata
- room-entry trap warnings
- trap detection/search
- canonical disarm results
- trap debug flags
- parser-level `search traps`
- parser-level `disarm trap`

This is the preferred path for authored room traps.

## Compatibility / legacy paths still live

### `src/engine/trapEngine.ts`

Status: live legacy/procedural event path.

Reason retained:

- `roomEventHandler.ts` still imports `maybeTriggerInquisitionTrap`.
- The Spanish Inquisition random event is story/runtime behaviour rather than authored room-trap metadata.

Retirement condition:

- Move the Inquisition event into a clearly named event/encounter module, or intentionally retain `trapEngine.ts` for non-authored random events.
- Do not delete until that event path is replaced or explicitly retired.

### `src/engine/trapController.tsx`

Status: live legacy trap-management/modal path.

Reason retained:

- `AppCore.tsx` still imports `getTrapByRoom`.
- `TrapManagementModal.tsx` still uses the legacy controller path.

Retirement condition:

- Either rewire the modal/debug trap UI to the canonical adapter, or remove the modal path if it is no longer part of the active UX.
- `TrapManagementModal` still has local legacy disarm-analysis behaviour, but no longer depends on `trapDetection.ts`.
- Do not delete `trapController.tsx` while `AppCore` and `TrapManagementModal` still import it.

## Removed as orphaned

### `src/engine/trapDetection.ts`

Status: removed.

Reason:

- Retired compatibility adapter.
- Room-entry authored trap warnings now call `canonicalTrapEngine.detectTrap()` directly from `roomEventHandler.ts`.
- No longer required as an intermediate trap-detection wrapper.

### `src/engine/trapSystem.ts`

Status: removed.

Reason:

- Standalone map/hook-based trap system.
- No live imports found in active source.
- Duplicates concepts now handled elsewhere.
- Not part of canonical authored trap path, parser path, room-entry path, or trap-management modal path.

## Guardrails for future trap work

- React must not own trap consequences.
- Parser/reducer/game state remain authoritative.
- Canonical authored trap behaviour should live in `canonicalTrapEngine`.
- Save/load must not be touched by trap retirement unless a dedicated save compatibility task proves the need.
- Delete legacy trap files only after import search plus local test/build evidence.
