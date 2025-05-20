// Gorstan v2.2.2 – All modules validated and standardized
// /src/engine/saveLoad.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// SaveLoadSystem
// This module provides functionality to save and load the game state.
// It interacts with the game engine and inventory system to persist and restore progress.
// All methods are defensively coded, error-checked, and robustly integrated.
import { inventory } from './inventory';
export class SaveLoadSystem {
  /**
   * Saves the current game state to localStorage.
   * @param {object} gameEngine - The game engine instance containing the current game state.
   * @returns {string} - A success message or an error message if saving fails.
   */
  static save(gameEngine) {
    try {
      if (!gameEngine || typeof gameEngine !== "object") {
        throw new Error("Invalid game engine instance.");
      }
      // Defensive: inventory.items may not exist if inventory is not a Set-based system
      const invArr = inventory.items
        ? Array.from(inventory.items)
        : typeof inventory.listInventory === "function"
          ? inventory.listInventory()
          : [];
      const saveData = {
        currentRoom: gameEngine.currentRoom || 'Nexus',
        inventory: invArr,
        visitedRooms: Array.from(gameEngine.visitedRooms || []),
        secretUnlocks: Array.from(gameEngine.secretUnlocks || []),
        resetCount: typeof gameEngine.resetCount === "number" ? gameEngine.resetCount : 0,
      };
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
      if (!gameEngine || typeof gameEngine !== "object") {
        throw new Error("Invalid game engine instance.");
      }
      const data = localStorage.getItem('gorstan_save');
      if (!data) {
        console.warn('[Load] No saved game found.');
        return 'No saved game found.';
      }
      const saveData = JSON.parse(data);
      // Defensive: Restore game state with fallbacks
      gameEngine.currentRoom = saveData.currentRoom || 'Nexus';
      gameEngine.visitedRooms = new Set(saveData.visitedRooms || []);
      gameEngine.secretUnlocks = new Set(saveData.secretUnlocks || []);
      gameEngine.resetCount = typeof saveData.resetCount === "number" ? saveData.resetCount : 0;
      // Defensive: Restore inventory
      if (inventory.items && typeof inventory.items.clear === "function") {
        inventory.items.clear();
        (saveData.inventory || []).forEach(item => inventory.items.add(item));
      } else if (typeof inventory.clearInventory === "function" && typeof inventory.addItem === "function") {
        inventory.clearInventory();
        (saveData.inventory || []).forEach(item => inventory.addItem(item));
      }
      if (typeof gameEngine.setInventory === "function") {
        gameEngine.setInventory(saveData.inventory || []);
      }
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
