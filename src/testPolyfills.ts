// Early polyfills for testing environment
// This sets up AbortController before React tries to use it

// Polyfill AbortController for React 19 compatibility
if (typeof globalThis.AbortController === 'undefined') {
  class MockAbortController {
    signal = {
      aborted: false,
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {
        return true;
      },
      onabort: null,
      reason: undefined,
      throwIfAborted() {},
    };

    abort() {
      this.signal.aborted = true;
    }
  }

  (globalThis as any).AbortController = MockAbortController;
}

// Export for imports if needed
export const polyfillsLoaded = true;
