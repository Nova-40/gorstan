// inventory.js
// Gorstan v2.4.1 – Enhanced Inventory System
// MIT License © 2025 Geoff Webster

const playerInventory = new Set();

/**
 * Normalizes and validates item name input.
 * @param {string} itemName
 * @returns {string|null} - Normalized item name or null if invalid.
 */
function validateItem(itemName) {
  if (typeof itemName !== 'string') return null;
  const normalized = itemName.trim().toLowerCase();
  return normalized || null;
}

function log(action, item) {
  console.log(`[Inventory] ${action}: ${item}`);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Adds an item to the inventory */
export function addItem(itemName) {
  try {
    const item = validateItem(itemName);
    if (!item) throw new Error('Invalid item');
    if (playerInventory.has(item)) {
      return `${capitalize(item)} is already in your inventory.`;
    }
    playerInventory.add(item);
    log('Added', item);
    return `${capitalize(item)} has been added to your inventory.`;
  } catch (err) {
    console.error('❌ Error adding item:', err);
    return 'An error occurred while adding the item.';
  }
}

/** Removes an item from the inventory */
export function removeItem(itemName) {
  try {
    const item = validateItem(itemName);
    if (!item) throw new Error('Invalid item');
    if (!playerInventory.has(item)) {
      return `${capitalize(item)} is not in your inventory.`;
    }
    playerInventory.delete(item);
    log('Removed', item);
    return `${capitalize(item)} has been removed from your inventory.`;
  } catch (err) {
    console.error('❌ Error removing item:', err);
    return 'An error occurred while removing the item.';
  }
}

/** Checks if an item is in inventory */
export function hasItem(itemName) {
  try {
    const item = validateItem(itemName);
    return item ? playerInventory.has(item) : false;
  } catch (err) {
    console.error('❌ Error checking item:', err);
    return false;
  }
}

/** Checks if any of the provided items are in inventory */
export function hasAny(items = []) {
  try {
    return items.some((item) => hasItem(item));
  } catch (err) {
    console.error('❌ Error checking multiple items:', err);
    return false;
  }
}

/** Returns a copy of the inventory */
export function getInventory() {
  return Array.from(playerInventory);
}

/** Clears the inventory */
export function resetInventory() {
  playerInventory.clear();
  console.warn('[Inventory] Inventory has been reset.');
}
