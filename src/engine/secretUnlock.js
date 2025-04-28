// /src/engine/secretUnlocks.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

export class SecretUnlocks {
  constructor() {
    this.unlockedSecrets = new Set();
  }

  unlock(secretName) {
    this.unlockedSecrets.add(secretName);
    return `Secret '${secretName}' has been unlocked!`;
  }

  isUnlocked(secretName) {
    return this.unlockedSecrets.has(secretName);
  }

  handleSpecialUse(currentRoom, itemName) {
    // Define special unlock logic here
    if (itemName === 'coffee' && (currentRoom === 'controlnexus' || currentRoom === 'controlroom')) {
      return this.unlock('secretTunnel');
    }
    if (itemName === 'briefcase' && currentRoom === 'aevirawarehouse') {
      return this.unlock('portalToCarron');
    }
    return null;
  }
}

export const secretUnlocks = new SecretUnlocks();
