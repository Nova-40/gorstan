/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Trials of Gorstan - 10 minute demo route (replaces Clockwork Crypt)
*/

import React from 'react';
import { createRoot } from 'react-dom/client';
// Load TrialsGame dynamically to match AppCore's lazy loading and avoid mixed imports
const TrialsGameLoader = () => import('../../components/TrialsGame');
import { clearDemo } from '../demoRouter';

export async function startTrialsOfGorstan(): Promise<void> {
  console.log('[TrialsOfGorstan] Beginning the Trials of Gorstan demo...');

  try {
    // Create a container for the Trials game
    const gameContainer = document.createElement('div');
    gameContainer.id = 'trials-game-container';
    gameContainer.style.position = 'fixed';
    gameContainer.style.top = '0';
    gameContainer.style.left = '0';
    gameContainer.style.width = '100vw';
    gameContainer.style.height = '100vh';
    gameContainer.style.zIndex = '10000';
    gameContainer.style.background = '#000';

    document.body.appendChild(gameContainer);

    // Create React root and render the game
    const root = createRoot(gameContainer);

    const handleComplete = () => {
      console.log('[TrialsOfGorstan] Demo completed successfully');

      // Clean up and return to Choose Your Adventure
      root.unmount();
      document.body.removeChild(gameContainer);
      clearDemo();

      // In a real implementation, this would navigate back to CYA screen
      console.log('[TrialsOfGorstan] Returning to Choose Your Adventure...');
    };

    const handleQuit = () => {
      console.log('[TrialsOfGorstan] Player quit the demo');

      // Clean up and return to Choose Your Adventure
      root.unmount();
      document.body.removeChild(gameContainer);
      clearDemo();

      console.log('[TrialsOfGorstan] Returning to Choose Your Adventure...');
    };

    // Dynamically load the TrialsGame component and render it
    const TrialsGameComponent = React.lazy(TrialsGameLoader);
    root.render(
      React.createElement(
        React.Suspense,
        { fallback: React.createElement('div', null, 'Loading Trials...') },
        React.createElement(TrialsGameComponent, {
          onComplete: handleComplete,
          onQuit: handleQuit,
          autoStart: true,
        }),
      ),
    );
  } catch (error) {
    console.error('[TrialsOfGorstan] Demo failed:', error);
    clearDemo();
    throw error;
  }
}
