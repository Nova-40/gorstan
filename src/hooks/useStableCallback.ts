import { useCallback, useRef } from 'react';
export function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef<T>(callback);

  // Update the ref whenever callback changes
  callbackRef.current = callback;

  // Return a stable callback that always calls the latest version
  return useCallback(((...args: Parameters<T>) => callbackRef.current(...args)) as T, []);
}

/**
 * Example usage:
 *
 * function MyComponent({ onItemClick }: { onItemClick: (id: string) => void }) {
 *   const stableOnItemClick = useStableCallback(onItemClick);
 *
 *   return (
 *     <ExpensiveChild onItemClick={stableOnItemClick} />
 *   );
 * }
 */
