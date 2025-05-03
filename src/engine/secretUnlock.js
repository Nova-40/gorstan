// /src/engine/secretUnlock.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

// Centralized logic for secret tunnel access and effects
// This module handles the logic for determining access to secret tunnels, triggering special effects, and managing secret unlocks.

import { inventory } from './inventory';
import { playerState } from './GameEngine'; // Assumes playerState is exported or passed in

// List of rooms where the secret tunnel can be accessed
const validTunnelRooms = ['Control Room', 'Hidden Aevira Lab', 'Observation Deck'];

/**
 * Determines if the player can access the secret tunnel.
 * @param {string} currentRoom - The player's current room.
 * @param {string} commandUsed - The command issued by the player.
 * @param {object} options - Additional options (e.g., godMode).
 * @returns {boolean} - Whether the player can access the secret tunnel.
 */
export function canAccessSecretTunnel(currentRoom, commandUsed = '', options = {}) {
  try {
    const hasBriefcase = inventory.has('briefcase');
    const hasMedallion = inventory.has('medallion');
    const isGod = options.godMode || playerState.godMode;
    const threwCoffee = commandUsed.toLowerCase().includes('throw coffee');
    const inValidRoom = validTunnelRooms.includes(currentRoom);

    // God mode bypasses all checks
    if (isGod) return true;

    // Access granted if the player has the required items or threw coffee in a valid room
    if ((hasBriefcase || hasMedallion) && inValidRoom) return true;
    if (threwCoffee && inValidRoom) return true;

    return false;
  } catch (err) {
    console.error('❌ Error in canAccessSecretTunnel:', err);
    return false; // Default to denying access in case of an error
  }
}

/**
 * Triggers the visual and narrative effect for discovering the secret tunnel.
 * @param {string} currentRoom - The player's current room.
 * @returns {string|null} - The effect description or null if the room is invalid.
 */
export function triggerTunnelEffect(currentRoom) {
  try {
    if (!validTunnelRooms.includes(currentRoom)) return null;

    return `A section of the wall trembles. A faint shimmer reveals a hidden passage...`;
  } catch (err) {
    console.error('❌ Error in triggerTunnelEffect:', err);
    return null;
  }
}

/**
 * Handles special item interactions in the game.
 * @param {string} currentRoom - The player's current room.
 * @param {string} itemName - The name of the item being used.
 * @returns {string|null} - The effect description or null if no effect is triggered.
 */
export function handleSpecialUse(currentRoom, itemName) {
  try {
    if (itemName === 'coffee' && validTunnelRooms.includes(currentRoom)) {
      return triggerTunnelEffect(currentRoom);
    }
    return null;
  } catch (err) {
    console.error('❌ Error in handleSpecialUse:', err);
    return null;
  }
}

// Set to track unlocked secrets
const unlockedSecrets = new Set();

/**
 * Marks a secret as unlocked.
 * @param {string} secretName - The name of the secret to unlock.
 */
export function unlockSecret(secretName) {
  try {
    if (!unlockedSecrets.has(secretName)) {
      unlockedSecrets.add(secretName);
      console.log(`[Secret Unlocked] ${secretName}`);
    }
  } catch (err) {
    console.error('❌ Error in unlockSecret:', err);
  }
}

/**
 * Checks if a secret has been unlocked.
 * @param {string} secretName - The name of the secret to check.
 * @returns {boolean} - Whether the secret has been unlocked.
 */
export function isSecretUnlocked(secretName) {
  try {
    return unlockedSecrets.has(secretName);
  } catch (err) {
    console.error('❌ Error in isSecretUnlocked:', err);
    return false;
  }
}

// Export all functions and constants as part of the secretUnlocks object
export const secretUnlocks = {
  canAccessSecretTunnel,
  triggerTunnelEffect,
  handleSpecialUse,
  unlockSecret,
  isSecretUnlocked,
  unlockedSecrets,
};
