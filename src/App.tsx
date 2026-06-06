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

// Gorstan and characters (c) Geoff Webster 2025
// Game module.

import LegacyAppCore from './components/AppCore';
import ModularAppCore from './components/AppCore.modular';
import { CelebrationController } from './celebrate';

import React from 'react';

import { GameStateProvider } from './state/gameState';

type AppCoreMode = 'legacy' | 'modular';

function readStoredAppCoreMode(): AppCoreMode | null {
  try {
    return window.localStorage.getItem('gorstan.appcore') === 'legacy' ? 'legacy' : null;
  } catch {
    return null;
  }
}

function storeAppCoreMode(mode: AppCoreMode): void {
  try {
    window.localStorage.setItem('gorstan.appcore', mode);
  } catch {
    // Keep the URL override working even if storage is blocked.
  }
}

function getAppCoreMode(): AppCoreMode {
  if (typeof window === 'undefined') {
    return 'modular';
  }

  const params = new URLSearchParams(window.location.search);
  const queryMode = params.get('appcore');
  if (queryMode === 'legacy' || queryMode === 'modular') {
    storeAppCoreMode(queryMode);
    return queryMode;
  }

  return readStoredAppCoreMode() ?? 'modular';
}

const App: React.FC = () => {
  const mode = getAppCoreMode();
  const AppCore = mode === 'legacy' ? LegacyAppCore : ModularAppCore;

  return (
    <GameStateProvider>
      <CelebrationController>
        <AppCore />
      </CelebrationController>
    </GameStateProvider>
  );
};

export default App;
