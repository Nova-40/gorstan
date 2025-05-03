// /src/engine/resetSystem.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

// ResetSystem
// This module handles multiverse resets in the game. It provides functionality to manage reset messages,
// reset the game state, and ensure smooth interactions with the game engine and inventory.

export class ResetSystem {
  /**
   * Generates a message based on the reset count.
   * @param {number} resetCount - The number of times the multiverse has been reset.
   * @returns {string} - A message describing the reset's impact.
   */
  static handleReset(resetCount) {
    try {
      if (resetCount === 1) {
        return 'Warning: Resetting multiverse... Hold tight.';
      }
      if (resetCount === 2) {
        return 'Multiverse integrity degrading. Proceed with caution.';
      }
      if (resetCount >= 3) {
        return 'Full multiversal reset in progress. Everything changes now...';
      }
      return 'Minor reset completed.';
    } catch (err) {
      console.error('❌ Error generating reset message:', err);
      return 'An error occurred while processing the reset.';
    }
  }

  /**
   * Resets the game state to its initial configuration.
   * @param {object} gameEngine - The game engine instance managing the game state.
   * @param {object} inventory - The inventory instance managing the player's items.
   * @returns {string} - A message confirming the reset.
   */
  static resetGame(gameEngine, inventory) {
    try {
      // Reset the game engine state
      gameEngine.currentRoom = 'trentparkearth'; // Default starting room
      gameEngine.visitedRooms.clear(); // Clear all visited rooms
      gameEngine.secretUnlocks.clear(); // Clear all unlocked secrets
      gameEngine.resetCount = 0; // Reset the reset counter

      // Reset the player's inventory
      inventory.items.clear();

      console.log('[Reset] Game state and inventory have been fully reset.');
      return 'The multiverse has been fully reset. A new journey begins.';
    } catch (err) {
      console.error('❌ Error resetting the game state:', err);
      return 'An error occurred while resetting the game.';
    }
  }

  /**
   * Increments the reset count and updates the game state accordingly.
   * @param {object} gameEngine - The game engine instance managing the game state.
   * @returns {string} - A message describing the reset's impact.
   */
  static incrementReset(gameEngine) {
    try {
      gameEngine.resetCount += 1; // Increment the reset counter
      console.log(`[Reset] Reset count incremented to ${gameEngine.resetCount}.`);
      return this.handleReset(gameEngine.resetCount); // Generate a reset message
    } catch (err) {
      console.error('❌ Error incrementing reset count:', err);
      return 'An error occurred while incrementing the reset count.';
    }
  }

  /**
   * Checks if the multiverse reset is allowed based on the current game state.
   * @param {object} gameEngine - The game engine instance managing the game state.
   * @returns {boolean} - Whether the reset is allowed.
   */
  static canReset(gameEngine) {
    try {
      // Example condition: Allow reset only if the player is in a specific room
      const allowedRooms = ['resetroom', 'controlroom'];
      const canReset = allowedRooms.includes(gameEngine.currentRoom);
      if (!canReset) {
        console.warn('[Reset] Reset not allowed in the current room:', gameEngine.currentRoom);
      }
      return canReset;
    } catch (err) {
      console.error('❌ Error checking reset conditions:', err);
      return false;
    }
  }
}
