/**
 * Jest setup file for Gorstan test suite
 * Configures jsdom environment and global mocks
 */

// Import jest-dom matchers
import '@testing-library/jest-dom';

/**
 * Jest setup file for Gorstan test suite
 * Configures jsdom environment and global mocks
 */

// Mock import.meta for Vite compatibility  
Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: {
        DEV: false,
        VITE_NETLIFY_DEPLOY_ID: 'test-deploy-id'
      }
    }
  }
});

// Additional polyfill for import.meta
if (typeof globalThis.import === 'undefined') {
  globalThis.import = {
    meta: {
      env: {
        DEV: false,
        VITE_NETLIFY_DEPLOY_ID: 'test-deploy-id'
      }
    }
  };
}

// Mock window.matchMedia which is not available in jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
Object.defineProperty(global, 'sessionStorage', { value: sessionStorageMock });

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock audio elements
global.HTMLMediaElement.prototype.play = jest.fn().mockResolvedValue(undefined);
global.HTMLMediaElement.prototype.pause = jest.fn();
global.HTMLMediaElement.prototype.load = jest.fn();

// Clear mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});
