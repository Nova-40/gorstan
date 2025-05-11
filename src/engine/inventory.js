// /src/engine/inventory.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

// Inventory System
// This module manages the player's inventory, providing functionality to add, remove, check, and transform items.
// It ensures smooth interactions with the game engine and other systems.

const playerInventory = new Set(); // Stores the player's inventory items as a Set for fast lookups and unique entries

/**
 * Adds an item to the player's inventory.
 * @param {string} itemName - The name of the item to add.
 * @returns {string} - A success message or an error message if the item is invalid.
 */
export function addItem(itemName) {
  try {
    if (!itemName || typeof itemName !== 'string') {
      throw new Error('Invalid item name.');
    }
    const normalizedItem = itemName.toLowerCase();
    if (playerInventory.has(normalizedItem)) {
      return `${itemName} is already in your inventory.`;
    }
    playerInventory.add(normalizedItem);
    console.log(`[Inventory] Added item: ${itemName}`);
    return `${itemName} has been added to your inventory.`;
  } catch (err) {
    console.error('❌ Error adding item to inventory:', err);
    return 'An error occurred while adding the item to your inventory.';
  }
}

/**
 * Removes an item from the player's inventory.
 * @param {string} itemName - The name of the item to remove.
 * @returns {string} - A success message or an error message if the item is not found.
 */
export function removeItem(itemName) {
  try {
    if (!itemName || typeof itemName !== 'string') {
      throw new Error('Invalid item name.');
    }
    const normalizedItem = itemName.toLowerCase();
    if (!playerInventory.has(normalizedItem)) {
      return `${itemName} is not in your inventory.`;
    }
    playerInventory.delete(normalizedItem);
    console.log(`[Inventory] Removed item: ${itemName}`);
    return `${itemName} has been removed from your inventory.`;
  } catch (err) {
    console.error('❌ Error removing item from inventory:', err);
    return 'An error occurred while removing the item from your inventory.';
  }
}

/**
 * Checks if the player's inventory contains a specific item.
 * @param {string} itemName - The name of the item to check.
 * @returns {boolean} - Whether the item exists in the inventory.
 */
export function hasItem(itemName) {
  try {
    return playerInventory.has(itemName.toLowerCase());
  } catch (err) {
    console.error('❌ Error checking item in inventory:', err);
    return false;
  }
}

/**
 * Checks if the player's inventory contains any of the specified items.
 * @param {Array<string>} items - An array of item names to check.
 * @returns {boolean} - Whether any of the items exist in the inventory.
 */
export function hasAny(items = []) {
  try {
    return items.some(item => hasItem(item));
  } catch (err) {
    console.error('❌ Error checking multiple items in inventory:', err);
    return false;
  }
}

/**
 * Checks if the player's inventory contains all of the specified items.
 * @param {Array<string>} items - An array of item names to check.
 * @returns {boolean} - Whether all of the items exist in the inventory.
 */
export function hasAll(items = []) {
  try {
    return items.every(item => hasItem(item));
  } catch (err) {
    console.error('❌ Error checking all items in inventory:', err);
    return false;
  }
}

/**
 * Lists all items currently in the player's inventory.
 * @returns {Array<string>} - An array of item names in the inventory.
 */
export function listInventory() {
  try {
    return Array.from(playerInventory).map(item => item.charAt(0).toUpperCase() + item.slice(1));
  } catch (err) {
    console.error('❌ Error listing inventory items:', err);
    return [];
  }
}

/**
 * Clears all items from the player's inventory.
 * @returns {string} - A success message confirming the inventory has been cleared.
 */
export function clearInventory() {
  try {
    playerInventory.clear();
    console.log('[Inventory] All items cleared.');
    return 'Your inventory has been cleared.';
  } catch (err) {
    console.error('❌ Error clearing inventory:', err);
    return 'An error occurred while clearing your inventory.';
  }
}

/**
 * Transforms an item in the player's inventory into another item.
 * @param {string} original - The name of the item to transform.
 * @param {string} replacement - The name of the new item to replace the original.
 * @returns {string} - A success message or an error message if the transformation fails.
 */
export function transformItem(original, replacement) {
  try {
    if (!hasItem(original)) {
      return `${original} is not in your inventory.`;
    }
    removeItem(original);
    addItem(replacement);
    console.log(`[Inventory] Transformed ${original} into ${replacement}.`);
    return `${original} has been transformed into ${replacement}.`;
  } catch (err) {
    console.error('❌ Error transforming item in inventory:', err);
    return 'An error occurred while transforming the item.';
  }
}

// Export all inventory functions as part of the inventory object
export const inventory = {
  addItem,
  removeItem,
  hasItem,
  hasAny,
  hasAll,
  listInventory,
  clearInventory,
  transformItem,
};
