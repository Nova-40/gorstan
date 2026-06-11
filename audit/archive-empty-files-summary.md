# Empty orphan archive summary

Branch: `audit/active-files-and-orphans`

This pass moved empty orphan-candidate files into:

`_archive/orphan-review-2026-06-11/`

No gameplay, parser, SaveManager, room, UI behaviour, or image pipeline code was changed.

Validation after move:

- `npm test -- --run` passed
- `npm run typecheck` passed
- `npm run build` passed

Notes:

- The archive move included empty test/config/type placeholder files because they were empty, unreferenced by static audit, and validation remained green.
- This is an archive move, not permanent deletion.
- Further orphan candidates remain for manual review only.

## CI follow-up

GitHub Actions exposed a nondeterministic NPC movement policy test:

`src/npc/__tests__/movePolicy.test.ts`

The test expected the home-bias branch every time, but random movement could also choose the home room with reason `Random adjacent`. The test was made deterministic by forcing `Math.random()` for that assertion.

No runtime movement policy code was changed.
