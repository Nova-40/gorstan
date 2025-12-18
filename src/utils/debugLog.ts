// Central debug logging gate.
// Goal: keep test output quiet by default while preserving opt-in verbosity.

type AnyArgs = unknown[];

function getProcessEnv(): Record<string, string | undefined> {
  // In Vite/browser builds, `process` may be undefined.
  // In Vitest/node, it exists.
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (typeof process !== 'undefined' ? (process as any).env : {}) ?? {};
  } catch {
    return {};
  }
}

function getViteEnv(): Record<string, unknown> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((import.meta as any)?.env as Record<string, unknown>) ?? {};
  } catch {
    return {};
  }
}

export function isTestEnv(): boolean {
  const env = getProcessEnv();
  const viteEnv = getViteEnv();

  if (env.VITEST) {
    return true;
  }
  if (env.NODE_ENV === 'test') {
    return true;
  }
  if (viteEnv.MODE === 'test') {
    return true;
  }

  return false;
}

export function isDebugLogsEnabled(): boolean {
  const env = getProcessEnv();
  const viteEnv = getViteEnv();

  // Allow either Node-style env or Vite-exposed env.
  if (env.DEBUG_LOGS === '1') {
    return true;
  }
  if (env.VITE_DEBUG_LOGS === '1') {
    return true;
  }
  if (viteEnv.VITE_DEBUG_LOGS === '1') {
    return true;
  }

  return false;
}

export function shouldLogDebug(): boolean {
  // Default: quiet in tests unless explicitly enabled.
  if (isTestEnv()) {
    return isDebugLogsEnabled();
  }
  return true;
}

export function debugLog(...args: AnyArgs): void {
  if (!shouldLogDebug()) {
    return;
  }
  // eslint-disable-next-line no-console
  console.log(...args);
}

export function debugWarn(...args: AnyArgs): void {
  if (!shouldLogDebug()) {
    return;
  }
  // eslint-disable-next-line no-console
  console.warn(...args);
}

export function debugError(...args: AnyArgs): void {
  // Errors are typically actionable even in tests; still allow gating
  // so test output can be kept clean unless explicitly enabled.
  if (!shouldLogDebug()) {
    return;
  }
  // eslint-disable-next-line no-console
  console.error(...args);
}
