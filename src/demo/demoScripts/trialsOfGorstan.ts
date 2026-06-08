/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Trials of Gorstan - 10 minute demo route (replaces Clockwork Crypt)
*/

import React from 'react';
import { createRoot } from 'react-dom/client';
import TrialsGame from '../../components/TrialsGame';
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

      // Clean up and return to the main menu
      root.unmount();
      document.body.removeChild(gameContainer);
      clearDemo();

      // In a real implementation, this would navigate back to main menu
      console.log('[TrialsOfGorstan] Returning to main menu...');
    };

    const handleQuit = () => {
      console.log('[TrialsOfGorstan] Player quit the demo');

      // Clean up and return to the main menu
      root.unmount();
      document.body.removeChild(gameContainer);
      clearDemo();

      console.log('[TrialsOfGorstan] Returning to main menu...');
    };

    root.render(
      React.createElement(TrialsGame, {
        onComplete: handleComplete,
        onQuit: handleQuit,
        autoStart: true,
      }),
    );
  } catch (error) {
    console.error('[TrialsOfGorstan] Demo failed:', error);
    clearDemo();
    throw error;
  }
}
