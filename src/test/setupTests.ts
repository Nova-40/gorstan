import "@testing-library/jest-dom"; // adds jest-dom matchers to Vitest
import { beforeAll, afterAll } from "vitest";
// If Gorstan needs fetch in jsdom:
import "whatwg-fetch";

// Example: globally silence console noise in tests (tweak as needed)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    // allow React act() warnings to surface if you prefer:
    // if (/not wrapped in act/.test(String(args[0]))) return originalError(...args);
    // otherwise, suppress noisy logs during tests:
    // noop
  };
});
afterAll(() => {
  console.error = originalError;
});
