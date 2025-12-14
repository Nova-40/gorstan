Summary: Restrict Schrödinger coin drops to café (one PR)

What this change does
- Adds behavioral tests for the Schrödinger coin (pickup, rejected drop outside café, allowed drop inside café).
- Centralizes the café room id in `src/constants/roomIds.ts` as `CAFE_ROOM_ID`.
- Replaces the hard-coded `'cafe_main'` check in the Schrödinger coin drop logic with `CAFE_ROOM_ID` in `src/lib/inventoryHelpers.ts`.

Invariant enforced (to be protected by tests):
- The Schrödinger coin may only be dropped when `currentRoomId === CAFE_ROOM_ID`.
- On rejection: provider inventory and room state are unchanged; exactly one player-visible message is appended.
- On allowed drop: the coin is removed from inventory; helper returns messages that will be appended once by the provider; room placement is handled by the caller if needed.

Notes
- Internal room id remains stable: `CAFE_ROOM_ID === 'cafe_main'` (no broad rename).
- Tests assert behaviour with substring matches to avoid locking the joke text.

Files touched in this change
- src/__tests__/schrodinger.coin.test.tsx (new tests)
- src/constants/roomIds.ts (new constant)
- src/lib/inventoryHelpers.ts (use CAFE_ROOM_ID for coin drop rule)
