/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  You may play Gorstan for free for personal entertainment only.
  You may NOT copy, redistribute, modify, or sell the game, its code, 
  artwork, storyline, or any other part without written permission.
  
  Gorstan includes third-party libraries and assets:
    - React © Meta Platforms, Inc. – MIT Licence
    - Lucide Icons © Lucide Contributors – ISC Licence
    - Flaticon icons © Flaticon.com – Free Licence with attribution
    - Other packages under their respective licences (see package.json)

  Full licence terms: see EULA.md in the project root.
*/

import React, { useState, useEffect, useMemo } from 'react';
// Lazy-load heavy overlay components so TeleportManager stays small
const FractalTeleportOverlay = React.lazy(() => import('./FractalTeleportOverlay'));
const TrekTeleportOverlay = React.lazy(() => import('./TrekTeleportOverlay'));

type TeleportType = 'fractal' | 'trek' | null;

const TeleportManager: React.FC<{
  teleportType: TeleportType;
  onComplete: () => void;
}> = ({ teleportType, onComplete }) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Memoized media query setup
  const mediaQuery = useMemo(
    () =>
      typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null,
    [],
  );

  useEffect(() => {
    if (!mediaQuery) {
      return;
    }

    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [mediaQuery]);

  // Handle reduced motion completion effect
  useEffect(() => {
    if (prefersReducedMotion && teleportType) {
      const timeout = setTimeout(onComplete, 100);
      return () => clearTimeout(timeout);
    }
  }, [prefersReducedMotion, teleportType, onComplete]);

  if (!teleportType) {
    return null;
  }

  // If user prefers reduced motion, skip animation
  if (prefersReducedMotion) {
    console.log('[TeleportManager] Skipping animation due to prefers-reduced-motion');

    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center text-white text-xl">
        Transitioning...
      </div>
    );
  }

  console.log('[TeleportManager] Rendering teleport animation:', teleportType);

  // Optimized component selection - wrap lazy overlays with Suspense
  return (
    <React.Suspense fallback={null}>
      {teleportType === 'fractal' ? (
        <FractalTeleportOverlay onComplete={onComplete} />
      ) : (
        <TrekTeleportOverlay onComplete={onComplete} />
      )}
    </React.Suspense>
  );
};

// Prefetch helper to warm module cache for overlays
export function prefetchTeleportOverlay(type: 'fractal' | 'trek') {
  if (type === 'fractal') {
    import('./FractalTeleportOverlay');
  } else {
    import('./TrekTeleportOverlay');
  }
}

export default TeleportManager;
