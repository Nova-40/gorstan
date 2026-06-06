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
import { IS_DEV } from './config/mode';

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

function clearStoredAppCoreMode(): void {
  try {
    window.localStorage.removeItem('gorstan.appcore');
  } catch {
    // Ignore storage failures; the next reload will still honour URL defaults.
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

function switchAppCoreMode(mode: AppCoreMode | null): void {
  if (mode) {
    storeAppCoreMode(mode);
  } else {
    clearStoredAppCoreMode();
  }

  const url = new URL(window.location.href);
  if (mode) {
    url.searchParams.set('appcore', mode);
  } else {
    url.searchParams.delete('appcore');
  }
  window.location.href = url.toString();
}

const AppCoreModeSwitcher: React.FC<{ readonly mode: AppCoreMode }> = ({ mode }) => {
  if (!IS_DEV || typeof window === 'undefined') return null;

  return (
    <div
      aria-label="AppCore mode switcher"
      style={{
        position: 'fixed',
        right: '0.75rem',
        bottom: '0.75rem',
        zIndex: 10000,
        display: 'flex',
        gap: '0.4rem',
        alignItems: 'center',
        padding: '0.45rem 0.55rem',
        border: '1px solid rgba(80, 255, 160, 0.6)',
        borderRadius: '0.5rem',
        background: 'rgba(0, 0, 0, 0.78)',
        color: '#b7ffd1',
        fontFamily: 'monospace',
        fontSize: '0.75rem',
      }}
    >
      <strong>AppCore: {mode}</strong>
      <button type="button" onClick={() => switchAppCoreMode('modular')}>modular</button>
      <button type="button" onClick={() => switchAppCoreMode('legacy')}>legacy</button>
      <button type="button" onClick={() => switchAppCoreMode(null)}>reset</button>
    </div>
  );
};

const App: React.FC = () => {
  const mode = getAppCoreMode();
  const AppCore = mode === 'legacy' ? LegacyAppCore : ModularAppCore;

  return (
    <GameStateProvider>
      <CelebrationController>
        <AppCore />
        <AppCoreModeSwitcher mode={mode} />
      </CelebrationController>
    </GameStateProvider>
  );
};

export default App;
