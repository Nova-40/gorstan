import { useEffect, useRef } from 'react';

/**
 * Safely adds event listeners with automatic cleanup.
 * Prevents memory leaks and stale closures in event handlers.
 */
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: undefined,
): void;

export function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: Document,
): void;

export function useEventListener<K extends keyof HTMLElementEventMap>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element: HTMLElement | null,
): void;

export function useEventListener(
  eventName: string,
  handler: (event: Event) => void,
  element?: HTMLElement | Document | Window | null,
): void {
  // Create a ref that stores handler
  const savedHandler = useRef<(event: Event) => void>(handler);

  // Update ref.current value if handler changes
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    // Define the listening target
    const targetElement = element ?? window;

    if (!(targetElement && targetElement.addEventListener)) {
      return;
    }

    // Create event listener that calls handler function stored in ref
    const eventListener = (event: Event) => {
      savedHandler.current?.(event);
    };

    targetElement.addEventListener(eventName, eventListener);

    // Remove event listener on cleanup
    return () => {
      targetElement.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
}

/**
 * Example usage:
 *
 * function Component() {
 *   // Window events
 *   useEventListener('resize', () => {
 *     console.log('Window resized');
 *   });
 *
 *   // Document events
 *   useEventListener('keydown', (e) => {
 *     if (e.key === 'Escape') {
 *       closeModal();
 *     }
 *   }, document);
 *
 *   // Element events
 *   const buttonRef = useRef<HTMLButtonElement>(null);
 *   useEventListener('click', handleClick, buttonRef.current);
 * }
 */
