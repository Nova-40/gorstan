import React from 'react';

/**
 * Performance optimization utilities for React components
 * Provides memoization helpers and performance best practices
 */

/**
 * Creates a memoized event handler that only changes when dependencies change
 * Prevents unnecessary re-renders of child components
 */
export function useStableCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  deps: React.DependencyList,
): T {
  return React.useCallback(callback, deps) as T;
}

/**
 * Memoizes expensive computations
 */
export function useStableMemo<T>(factory: () => T, deps: React.DependencyList): T {
  return React.useMemo(factory, deps);
}

/**
 * Memoizes component props to prevent unnecessary re-renders
 */
export function useStableProps<T extends Record<string, any>>(
  props: T,
  deps: React.DependencyList,
): T {
  return React.useMemo(() => props, deps);
}

/**
 * HOC for memoizing components with custom comparison
 */
export function withMemo<P extends object>(
  Component: React.ComponentType<P>,
  propsAreEqual?: (prevProps: P, nextProps: P) => boolean,
) {
  return React.memo(Component, propsAreEqual);
}

/**
 * Utility for creating stable object references
 */
export function useStableObject<T extends Record<string, any>>(
  obj: T,
  deps: React.DependencyList,
): T {
  return React.useMemo(() => obj, deps);
}

/**
 * Hook for debouncing values to reduce re-renders
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for throttling function calls
 */
export function useThrottledCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number,
  deps: React.DependencyList,
): T {
  const lastCall = React.useRef<number>(0);

  return React.useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        return callback(...args);
      }
    }) as T,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callback, delay, ...deps],
  ) as T;
}
