// /src/engine/saveLoad.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

import { inventory } from './inventory';

export class SaveLoadSystem {
  static save(gameEngine) {
    const saveData = {
      currentRoom: gameEngine.currentRoom,
      inventory: Array.from(inventory.items),
      visitedRooms: Array.from(gameEngine.visitedRooms),
      secretUnlocks: Array.from(gameEngine.secretUnlocks),
      resetCount: gameEngine.resetCount,
    };
    localStorage.setItem('gorstan_save', JSON.stringify(saveData));
    return 'Game saved successfully!';
  }

  static load(gameEngine) {
    const data = localStorage.getItem('gorstan_save');
    if (!data) {
      return 'No saved game found.';
    }

    const saveData = JSON.parse(data);
    gameEngine.currentRoom = saveData.currentRoom;
    gameEngine.visitedRooms = new Set(saveData.visitedRooms);
    gameEngine.secretUnlocks = new Set(saveData.secretUnlocks);
    gameEngine.resetCount = saveData.resetCount;
    inventory.items = new Set(saveData.inventory);
    return 'Game loaded successfully!';
  }
}
