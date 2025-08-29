#!/usr/bin/env bash
set -euo pipefail
npm run typecheck
npm run lint
npm run test:run
npm run e2e || true
npm run coverage
npm run analyze || true
npm run deadcode || true
npm run circulars || true
npm run licenses || true
npm run audit || true
echo "All gates attempted. Gorstan: A-grade gate script completed."
