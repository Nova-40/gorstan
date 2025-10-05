Playwright smoke failure notes

Symptom
- Running Playwright-based smoke tests failed locally with two classes of errors:
  1. Module resolution errors (Node couldn't import TypeScript source files like `src/types/Room`).
  2. Global expect/matcher collisions: "Cannot redefine property: Symbol($$jest-matchers-object)" when test runners or matchers try to attach globals.

Likely causes
- Playwright test process attempted to import TypeScript source without runtime path mapping (ts-node or tsconfig-paths).
- The repository's test setup includes Vitest/Jest-like globals and Playwright imported matchers cause redefinition in the same process.

Mitigations
- Quick smoke (recommended): run Playwright against a served build (pnpm preview) so Playwright only drives the compiled site (no TS imports). This avoids path resolution and matcher conflicts.
- Full fix (invasive): add ts-node and tsconfig-paths to Playwright runner and isolate test globals so Playwright uses a separate expect/matcher instance. This requires careful test runner isolation and may affect CI.

Next steps
- If you want the quick smoke, run preview and re-run Playwright tests against http://localhost:5173.
- If you want Playwright to import source and run in Node, I can add runtime wiring (ts-node/register + tsconfig-paths/register) and adjust Playwright config to not load conflicting matchers. This is a larger change; acknowledge before proceeding.
