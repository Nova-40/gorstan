/**
 * Vitest Conversion Script
 * Converts Jest syntax to Vitest in test files
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// This is a template showing the conversion patterns:
// jest.fn() → vi.fn()
// jest.spyOn() → vi.spyOn()
// jest.mock() → vi.mock()
// jest.useFakeTimers() → vi.useFakeTimers()
// jest.useRealTimers() → vi.useRealTimers()
// jest.advanceTimersByTime() → vi.advanceTimersByTime()
// jest.clearAllMocks() → vi.clearAllMocks()
// jest.restoreAllMocks() → vi.restoreAllMocks()

describe('Vitest Conversion Template', () => {
  it('should show vitest syntax examples', () => {
    const mockFn = vi.fn();
    const spy = vi.spyOn(console, 'log');
    
    vi.useFakeTimers();
    vi.advanceTimersByTime(1000);
    vi.useRealTimers();
    
    expect(mockFn).toHaveBeenCalledTimes(0);
    spy.mockRestore();
  });
});
