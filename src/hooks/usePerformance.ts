import { useEffect, useState } from 'react';

/**
 * Hook to preload images on hover for faster transitions
 */
export function useImagePreload(imagePath: string | null, preload: boolean = false) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!imagePath || !preload || isLoaded) {return;}

    setIsLoading(true);
    
    const img = new Image();
    
    img.onload = () => {
      setIsLoaded(true);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setIsLoading(false);
      console.warn(`Failed to preload image: ${imagePath}`);
    };
    
    img.src = imagePath;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imagePath, preload, isLoaded]);

  return { isLoaded, isLoading };
}

/**
 * Hook for managing busy state with minimum display time
 */
export function useBusyState(initialState = false) {
  const [isBusy, setIsBusy] = useState(initialState);
  const [showBusy, setShowBusy] = useState(false);

  useEffect(() => {
    let timeoutId: number | undefined;

    if (isBusy) {
      // Show busy indicator after 100ms to avoid flicker
      timeoutId = window.setTimeout(() => {
        setShowBusy(true);
      }, 100);
    } else {
      // Hide immediately when not busy
      setShowBusy(false);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isBusy]);

  return {
    isBusy,
    showBusy,
    setBusy: setIsBusy,
    start: () => setIsBusy(true),
    stop: () => setIsBusy(false),
  };
}
