/*
  Gorstan – Interactive Game Framework
  Copyright © 2025 Geoff Webster. All Rights Reserved.

  This source code is proprietary and confidential.
  Unauthorised copying, distribution, modification, resale,
  reverse engineering, or use of this file, via any medium,
  is strictly prohibited without prior written consent
  from the copyright holder.

  Licensed access is granted only to authorised users who have
  purchased access to Gorstan through official channels.
  Such licence is strictly limited to running and playing the
  Gorstan game. No part of this source code may be used to
  create derivative works, other games, or redistributed in
  any form.

  Third-party libraries and assets are included under their
  respective licences as detailed in package.json and assets/.
*/

import React, { createContext, useContext, useEffect, useState } from 'react';
// Import design tokens; adjust path to actual location under src/theme
import '../theme/tokens.css';

type Biome = 'gorstan' | 'fae' | 'glitch' | 'nexus' | 'trent';
interface ThemeContextValue { biome: Biome; setBiome: (b: Biome) => void; reducedMotion: boolean; }

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ initialBiome?: Biome; children: React.ReactNode }> = ({ initialBiome='gorstan', children }) => {
  const [biome, setBiome] = useState<Biome>(initialBiome);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-biome', biome);
  }, [biome]);

  return (
    <ThemeContext.Provider value={{ biome, setBiome, reducedMotion }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export default ThemeProvider;
