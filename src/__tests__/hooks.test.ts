import { describe, test, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useStableCallback, useEventListener } from '../hooks';

describe('Essential Hooks', () => {
  describe('useStableCallback', () => {
    test('returns stable reference across renders', () => {
      let callbackParam = 'initial';
      const callback = () => callbackParam;

      const { result, rerender } = renderHook(
        ({ cb }: { cb: () => string }) => useStableCallback(cb),
        { initialProps: { cb: callback } },
      );

      const firstReference = result.current;

      // Change the callback and rerender
      callbackParam = 'updated';
      const newCallback = () => callbackParam;
      rerender({ cb: newCallback });

      const secondReference = result.current;

      // Reference should be stable
      expect(firstReference).toBe(secondReference);

      // But should call the latest version
      expect(result.current()).toBe('updated');
    });

    test('calls latest callback version', () => {
      const callbacks = {
        v1: vi.fn(() => 'v1'),
        v2: vi.fn(() => 'v2'),
      };

      const { result, rerender } = renderHook(
        ({ cb }: { cb: () => string }) => useStableCallback(cb),
        { initialProps: { cb: callbacks.v1 } },
      );

      // Call initial version
      result.current();
      expect(callbacks.v1).toHaveBeenCalledTimes(1);

      // Update callback and call again
      rerender({ cb: callbacks.v2 });
      result.current();

      expect(callbacks.v1).toHaveBeenCalledTimes(1); // Not called again
      expect(callbacks.v2).toHaveBeenCalledTimes(1); // New callback called
    });
  });

  describe('useEventListener', () => {
    test('adds and removes event listener on window', () => {
      const handler = vi.fn();
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = renderHook(() => useEventListener('resize', handler));

      expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });

    test('calls handler when event fires', () => {
      const handler = vi.fn();

      renderHook(() => useEventListener('resize', handler));

      // Simulate resize event
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);

      expect(handler).toHaveBeenCalledWith(resizeEvent);
    });

    test('updates handler without removing listener', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { rerender } = renderHook(
        ({ handler }: { handler: (e: Event) => void }) => useEventListener('resize', handler),
        { initialProps: { handler: handler1 } },
      );

      // Should only add listener once
      expect(addEventListenerSpy).toHaveBeenCalledTimes(1);

      // Update handler
      rerender({ handler: handler2 });

      // Should not remove/re-add listener
      expect(removeEventListenerSpy).not.toHaveBeenCalled();
      expect(addEventListenerSpy).toHaveBeenCalledTimes(1);

      // Fire event - should call new handler
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).toHaveBeenCalledWith(resizeEvent);

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });

    test('handles null element gracefully', () => {
      const handler = vi.fn();

      // Should not throw when element is null
      expect(() => {
        renderHook(() => useEventListener('click', handler, null));
      }).not.toThrow();
    });
  });
});
