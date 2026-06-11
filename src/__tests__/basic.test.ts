/**
 * Basic Test - Simple smoke test to verify vitest is working
 */
import { describe, it, expect } from 'vitest';

describe('Basic Test Suite', () => {
  it('should pass a simple test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle basic string operations', () => {
    expect('hello'.toUpperCase()).toBe('HELLO');
  });
});
