// /src/engine/inventory.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0
//

// src/engine/inventory.js

const _inventory = new Map();

export function addItem(itemId, itemData = {}) {
  if (!_inventory.has(itemId)) {
    _inventory.set(itemId, { ...itemData, acquiredAt: Date.now() });
  }
}

export function removeItem(itemId) {
  _inventory.delete(itemId);
}

export function hasItem(itemId) {
  return _inventory.has(itemId);
}

export function listInventory() {
  return Array.from(_inventory.entries()).map(([id, data]) => ({ id, ...data }));
}

export function clearInventory() {
  _inventory.clear();
}

export const inventory = {
  addItem,
  removeItem,
  hasItem,
  listInventory,
  clearInventory,
};