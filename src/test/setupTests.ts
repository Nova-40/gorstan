import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock browser APIs that are not available in test environment
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

Object.defineProperty(window, 'requestAnimationFrame', {
  writable: true,
  value: vi.fn().mockImplementation((callback) => setTimeout(callback, 16)),
});

Object.defineProperty(window, 'cancelAnimationFrame', {
  writable: true,
  value: vi.fn().mockImplementation((id) => clearTimeout(id)),
});

Object.defineProperty(window, 'performance', {
  writable: true,
  value: {
    now: vi.fn().mockImplementation(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByType: vi.fn().mockReturnValue([]),
    getEntriesByName: vi.fn().mockReturnValue([]),
  },
});

// Mock SpeechSynthesis APIs
Object.defineProperty(window, 'speechSynthesis', {
  writable: true,
  value: {
    speak: vi.fn(),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    getVoices: vi.fn().mockReturnValue([]),
  },
});

Object.defineProperty(window, 'SpeechSynthesisUtterance', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    text: '',
    lang: 'en-US',
    voice: null,
    volume: 1,
    rate: 1,
    pitch: 1,
    onstart: null,
    onend: null,
    onerror: null,
  })),
});

// Mock IntersectionObserver
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
});

// Mock Image constructor
Object.defineProperty(window, 'Image', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    src: '',
    onload: null,
    onerror: null,
  })),
});

// Mock Blob
Object.defineProperty(window, 'Blob', {
  writable: true,
  value: vi.fn().mockImplementation((parts, options) => ({
    size: parts ? parts.join('').length : 0,
    type: options?.type || '',
    slice: vi.fn(),
  })),
});

// Mock navigator
Object.defineProperty(window, 'navigator', {
  writable: true,
  value: {
    userAgent: 'test-agent',
    language: 'en-US',
    languages: ['en-US', 'en'],
    platform: 'test-platform',
    cookieEnabled: true,
    onLine: true,
    geolocation: {
      getCurrentPosition: vi.fn(),
      watchPosition: vi.fn(),
      clearWatch: vi.fn(),
    },
  },
});

// Mock getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    getPropertyValue: vi.fn(),
    fontSize: '16px',
    margin: '0px',
    padding: '0px',
  })),
});

// Mock AbortController
Object.defineProperty(window, 'AbortController', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    signal: { aborted: false },
    abort: vi.fn(),
  })),
});
