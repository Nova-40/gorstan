// /src/engine/saveLoad.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

// SaveLoadSystem
// This module provides functionality to save and load the game state.
// It interacts with the game engine and inventory system to persist and restore progress.

import { inventory } from './inventory';

export class SaveLoadSystem {
  /**
   * Saves the current game state to localStorage.
   * @param {object} gameEngine - The game engine instance containing the current game state.
   * @returns {string} - A success message or an error message if saving fails.
   */
  static save(gameEngine) {
    try {
      const saveData = {
        currentRoom: gameEngine.currentRoom, // The player's current room
        inventory: Array.from(inventory.items), // The player's inventory
        visitedRooms: Array.from(gameEngine.visitedRooms), // Rooms the player has visited
        secretUnlocks: Array.from(gameEngine.secretUnlocks), // Secrets the player has unlocked
        resetCount: gameEngine.resetCount, // Number of times the game has been reset
      };

      // Save the serialized game state to localStorage
      localStorage.setItem('gorstan_save', JSON.stringify(saveData));
      console.log('[Save] Game state saved successfully.');
      return 'Game saved successfully!';
    } catch (err) {
      console.error('[Save] Failed to save game state:', err);
      return 'Error: Failed to save the game.';
    }
  }

  /**
   * Loads the saved game state from localStorage.
   * @param {object} gameEngine - The game engine instance to restore the game state into.
   * @returns {string} - A success message, or an error message if loading fails.
   */
  static load(gameEngine) {
    try {
      const data = localStorage.getItem('gorstan_save');
      if (!data) {
        console.warn('[Load] No saved game found.');
        return 'No saved game found.';
      }

      // Parse the saved game state
      const saveData = JSON.parse(data);

      // Restore the game state
      gameEngine.currentRoom = saveData.currentRoom || 'Nexus';
      gameEngine.visitedRooms = new Set(saveData.visitedRooms || []);
      gameEngine.secretUnlocks = new Set(saveData.secretUnlocks || []);
      gameEngine.resetCount = saveData.resetCount || 0;
      inventory.items = new Set(saveData.inventory || []);

      console.log('[Load] Game state loaded successfully.');
      return 'Game loaded successfully!';
    } catch (err) {
      console.error('[Load] Failed to load game state:', err);
      return 'Error: Failed to load the game.';
    }
  }

  /**
   * Deletes the saved game state from localStorage.
   * @returns {string} - A success message, or an error message if deletion fails.
   */
  static deleteSave() {
    try {
      localStorage.removeItem('gorstan_save');
      console.log('[Delete] Saved game deleted successfully.');
      return 'Saved game deleted successfully!';
    } catch (err) {
      console.error('[Delete] Failed to delete saved game:', err);
      return 'Error: Failed to delete the saved game.';
    }
  }

  /**
   * Checks if a saved game exists in localStorage.
   * @returns {boolean} - Whether a saved game exists.
   */
  static hasSave() {
    try {
      return localStorage.getItem('gorstan_save') !== null;
    } catch (err) {
      console.error('[Check Save] Failed to check for saved game:', err);
      return false;
    }
  }
}
