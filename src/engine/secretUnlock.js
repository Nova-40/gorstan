// /src/engine/secretUnlock.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

// Centralised logic for secret tunnel access and effects

import { inventory } from './inventory';
import { playerState } from './GameEngine'; // Assumes playerState is exported or passed in

const validTunnelRooms = ['Control Room', 'Hidden Aevira Lab', 'Observation Deck'];

export function canAccessSecretTunnel(currentRoom, commandUsed = '', options = {}) {
  const hasBriefcase = inventory.has('briefcase');
  const hasMedallion = inventory.has('medallion');
  const isGod = options.godMode || playerState.godMode;
  const threwCoffee = commandUsed.toLowerCase().includes('throw coffee');

  const inValidRoom = validTunnelRooms.includes(currentRoom);

  if (isGod) return true;
  if ((hasBriefcase || hasMedallion) && inValidRoom) return true;
  if (threwCoffee && inValidRoom) return true;

  return false;
}

export function triggerTunnelEffect(currentRoom) {
  if (!validTunnelRooms.includes(currentRoom)) return null;

  return `A section of the wall trembles. A faint shimmer reveals a hidden passage...`;
}

export const secretUnlocks = {
  handleSpecialUse(currentRoom, itemName) {
    if (itemName === 'coffee' && validTunnelRooms.includes(currentRoom)) {
      return triggerTunnelEffect(currentRoom);
    }
    return null;
  },

  unlockedSecrets: new Set()
};
