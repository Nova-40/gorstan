import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { useIdleGuidanceTimers } from '../useIdleGuidanceTimers';

// Mock requestAnimationFrame
beforeAll(() => {
  (global as any).requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(() => cb(performance.now()), 5) as unknown as number;
  (global as any).cancelAnimationFrame = (id: number) => clearTimeout(id as unknown as NodeJS.Timeout);
});

vi.useFakeTimers();

describe('useIdleGuidanceTimers', () => {
  it('advances guidance progress and shows modal at completion', () => {
    const onGuidanceTrigger = vi.fn();

    const { result } = renderHook(() => useIdleGuidanceTimers({
      demoTotalMs: 2000,
      guidanceTotalMs: 1000,
      onGuidanceTrigger
    }));

    expect(result.current.guidanceProgress).toBe(0);
    expect(result.current.showGuidanceModal).toBe(false);

  act(() => { vi.advanceTimersByTime(500); });
    expect(result.current.guidanceProgress).toBeGreaterThan(0);

  act(() => { vi.advanceTimersByTime(600); });
    expect(result.current.showGuidanceModal).toBe(true);
    expect(onGuidanceTrigger).toHaveBeenCalled();
  });

  it('resets on dismiss', () => {
    const { result } = renderHook(() => useIdleGuidanceTimers({ demoTotalMs: 2000, guidanceTotalMs: 1000 }));

    // Advance just to threshold minus one interval tick; modal should NOT yet show.
    act(() => { vi.advanceTimersByTime(1000); });
    expect(result.current.showGuidanceModal).toBe(false);
    expect(result.current.guidanceProgress).toBeGreaterThan(0.5);

    // Advance past next 150ms interval so modal appears (interval ticks every 150ms)
    act(() => { vi.advanceTimersByTime(100); });
    expect(result.current.showGuidanceModal).toBe(true);

    act(() => { result.current.dismissGuidance(); });
    expect(result.current.showGuidanceModal).toBe(false);
    expect(result.current.guidanceProgress).toBeLessThan(0.25);
  });
});
