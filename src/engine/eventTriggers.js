// /src/engine/eventTriggers.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

import { puzzles } from './puzzles';
import { rooms } from './rooms';

export const eventTriggers = {
  onEnterRoom(roomName) {
    // Trigger events based on the room
    switch (roomName) {
      case 'carron':
        return puzzles.carronLogicTest();
      case 'hiddenlibrary':
        return puzzles.librarianChallenge();
      case 'glitchroom':
        return puzzles.glitchroomPuzzle();
      default:
        return { success: true, message: '' };
    }
  },
};
