// /src/engine/inventory.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

const playerInventory = new Set();

export function addItem(itemName) {
  playerInventory.add(itemName.toLowerCase());
}

export function removeItem(itemName) {
  playerInventory.delete(itemName.toLowerCase());
}

export function hasItem(itemName) {
  return playerInventory.has(itemName.toLowerCase());
}

export function hasAny(items = []) {
  return items.some(item => hasItem(item));
}

export function hasAll(items = []) {
  return items.every(item => hasItem(item));
}

export function listInventory() {
  return Array.from(playerInventory);
}

export function clearInventory() {
  playerInventory.clear();
}

export function transformItem(original, replacement) {
  if (hasItem(original)) {
    removeItem(original);
    addItem(replacement);
    return true;
  }
  return false;
}

export const inventory = {
  addItem,
  removeItem,
  hasItem,
  hasAny,
  hasAll,
  listInventory,
  clearInventory,
  transformItem
};
