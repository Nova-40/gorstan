// /src/engine/resetSystem.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

export class ResetSystem {
  static handleReset(resetCount) {
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
  }

  static resetGame(gameEngine, inventory) {
    gameEngine.currentRoom = 'trentparkearth';
    gameEngine.visitedRooms.clear();
    gameEngine.secretUnlocks.clear();
    gameEngine.resetCount = 0;
    inventory.items.clear();
    return 'The multiverse has been fully reset. A new journey begins.';
  }
}
