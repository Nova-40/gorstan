// src/setupTests.ts
// Global test setup for Vitest (happy-dom/jsdom)

import './testPolyfills';
import '@testing-library/jest-dom';
import { vi, beforeAll, afterEach } from 'vitest';

/** Small helper to define globals safely */
function defineGlobal<T extends keyof typeof globalThis>(key: T, value: (typeof globalThis)[T]) {
  Object.defineProperty(globalThis, key, { value, writable: true, configurable: true });
}

beforeAll(() => {
  // -----------------------------
  // matchMedia
  // -----------------------------
  if (typeof window.matchMedia === 'undefined') {
    defineGlobal(
      'matchMedia' as any,
      vi.fn((query: string) => {
        const mql: MediaQueryList = {
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(), // deprecated but some libs still call
          removeListener: vi.fn(), // deprecated
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn().mockReturnValue(true),
        } as unknown as MediaQueryList;
        return mql;
      }) as unknown as typeof window.matchMedia,
    );
  }

  // -----------------------------
  // requestAnimationFrame / cancelAnimationFrame
  // (use window timers so return type is number)
  // -----------------------------
  if (typeof globalThis.requestAnimationFrame === 'undefined') {
    const raf: typeof requestAnimationFrame = (cb) =>
      window.setTimeout(() => cb(performance.now()), 16);
    defineGlobal('requestAnimationFrame', vi.fn(raf));
  }

  if (typeof globalThis.cancelAnimationFrame === 'undefined') {
    const caf: typeof cancelAnimationFrame = (id) => window.clearTimeout(id);
    defineGlobal('cancelAnimationFrame', vi.fn(caf));
  }

  // -----------------------------
  // performance
  // -----------------------------
  if (typeof window.performance === 'undefined') {
    Object.defineProperty(window, 'performance', {
      writable: true,
      configurable: true,
      value: {
        now: vi.fn(() => Date.now()),
        mark: vi.fn(),
        measure: vi.fn(),
        getEntriesByName: vi.fn(() => []),
        getEntriesByType: vi.fn(() => []),
        clearMarks: vi.fn(),
        clearMeasures: vi.fn(),
      },
    });
  }

  // -----------------------------
  // ResizeObserver
  // -----------------------------
  if (typeof (globalThis as any).ResizeObserver === 'undefined') {
    class MockResizeObserver {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }
    defineGlobal('ResizeObserver' as any, MockResizeObserver as unknown as typeof ResizeObserver);
  }

  // -----------------------------
  // IntersectionObserver
  // -----------------------------
  if (typeof (globalThis as any).IntersectionObserver === 'undefined') {
    class MockIntersectionObserver {
      root: Element | Document | null = null;
      rootMargin = '';
      thresholds: ReadonlyArray<number> = [];
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
      takeRecords = vi.fn(() => []);
    }
    defineGlobal(
      'IntersectionObserver' as any,
      MockIntersectionObserver as unknown as typeof IntersectionObserver,
    );
  }

  // -----------------------------
  // Web Speech (speechSynthesis)
  // -----------------------------
  if (typeof (window as any).speechSynthesis === 'undefined') {
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      writable: true,
      value: {
        speak: vi.fn(),
        cancel: vi.fn(),
        pause: vi.fn(),
        resume: vi.fn(),
        getVoices: vi.fn(() => []),
        pending: false,
        speaking: false,
        paused: false,
      },
    });
  }

  // -----------------------------
  // Web Audio (AudioContext)
  // -----------------------------
  if (typeof (globalThis as any).AudioContext === 'undefined') {
    class MockOscillatorNode {
      connect = vi.fn();
      disconnect = vi.fn();
      start = vi.fn();
      stop = vi.fn();
      frequency = { value: 440 };
    }
    class MockGainNode {
      connect = vi.fn();
      disconnect = vi.fn();
      gain = { value: 1 };
    }
    class MockAudioContext {
      destination = {};
      createOscillator = vi.fn(() => new MockOscillatorNode());
      createGain = vi.fn(() => new MockGainNode());
      close = vi.fn();
      resume = vi.fn();
    }
    defineGlobal('AudioContext' as any, MockAudioContext as unknown as typeof AudioContext);
  }

  // -----------------------------
  // HTMLAudioElement (basic surface)
  // -----------------------------
  if (typeof (globalThis as any).HTMLAudioElement === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const MockHTMLAudioElement = function (this: any) {
      this.play = vi.fn().mockResolvedValue(undefined);
      this.pause = vi.fn();
      this.load = vi.fn();
      this.addEventListener = vi.fn();
      this.removeEventListener = vi.fn();
      this.volume = 1;
      this.currentTime = 0;
      this.duration = 0;
      this.paused = true;
      this.ended = false;
    } as unknown as typeof HTMLAudioElement;
    defineGlobal('HTMLAudioElement' as any, MockHTMLAudioElement);
  }

  // -----------------------------
  // localStorage / sessionStorage
  // -----------------------------
  const storageMock = () => {
    const store = new Map<string, string>();
    return {
      get length() {
        return store.size;
      },
      clear: vi.fn(() => store.clear()),
      getItem: vi.fn((k: string) => (store.has(k) ? (store.get(k) as string) : null)),
      key: vi.fn((i: number) => Array.from(store.keys())[i] ?? null),
      removeItem: vi.fn((k: string) => store.delete(k)),
      setItem: vi.fn((k: string, v: string) => store.set(k, String(v))),
    } as Storage;
  };

  if (typeof window.localStorage === 'undefined') {
    Object.defineProperty(window, 'localStorage', { configurable: true, value: storageMock() });
  }
  if (typeof window.sessionStorage === 'undefined') {
    Object.defineProperty(window, 'sessionStorage', { configurable: true, value: storageMock() });
  }

  // -----------------------------
  // crypto
  // -----------------------------
  if (typeof (window as any).crypto === 'undefined') {
    Object.defineProperty(window, 'crypto', {
      configurable: true,
      value: {
        randomUUID: vi.fn(() => 'mock-uuid-' + Math.random().toString(36).slice(2, 11)),
        getRandomValues: vi.fn(<T extends ArrayBufferView>(arr: T) => {
          const u8 = new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
          for (let i = 0; i < u8.length; i++) {
            u8[i] = Math.floor(Math.random() * 256);
          }
          return arr;
        }),
      },
    });
  }

  // -----------------------------
  // screen (basic shape)
  // -----------------------------
  if (typeof window.screen === 'undefined') {
    Object.defineProperty(window, 'screen', {
      configurable: true,
      value: {
        width: 1024,
        height: 768,
        availWidth: 1024,
        availHeight: 768,
        colorDepth: 24,
        pixelDepth: 24,
      },
    });
  }

  // -----------------------------
  // navigator.userAgent (stable value for UA checks)
  // -----------------------------
  try {
    Object.defineProperty(navigator, 'userAgent', {
      configurable: true,
      get: () => 'Mozilla/5.0 (compatible; Vitest)',
    });
  } catch {
    // ignore if not configurable in this env
  }
});

// Reset spies between tests (keeps mocks but clears call history)
afterEach(() => {
  vi.clearAllMocks();
});
