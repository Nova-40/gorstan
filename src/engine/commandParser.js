// /src/engine/commandParser.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

import {
  handleTalkCommand,
  handleUseCommand,
  handleLookCommand,
  handleHelpCommand,
  handleSecretsCommand,
  handleAchievementsCommand,
} from './npcs';
import { inventory } from './inventory';
import { SaveLoadSystem } from './saveLoad';
import { ResetSystem } from './resetSystem';
import { handleAskAylaInParser } from './aylaHelp';
import { gameEngine } from './gameEngine';
import { npcSupportSystem } from './npcSupportSystem';

let resetRoomButtonPressed = false;

export function parsePlayerCommand(command, gameEngineInstance) {
  const currentRoom = gameEngineInstance.currentRoom;

  if (!command || typeof command !== 'string') {
    return 'Invalid command input.';
  }

  const lowerCommand = command.trim().toLowerCase();

  // Special glitchy intro if in crossing2 after too many resets
  if (currentRoom === 'crossing2' && gameEngineInstance.resetCount >= 3 && Math.random() < 0.3) {
    return '[System Error] Cro$$1n9 Detected... Memory Fluctuation...\nWelcome b4ck t0 the Cr0ssing...';
  }

  // Check special room-specific commands like confession
  const specialCommandResult = gameEngineInstance.checkSpecialCommands(command);
  if (specialCommandResult) {
    return specialCommandResult;
  }

  // Handle Reset Room button logic
  if (lowerCommand === 'press button') {
    if (currentRoom === 'resetroom') {
      if (!resetRoomButtonPressed) {
        resetRoomButtonPressed = true;
        const atmosphericMessages = [
          'The air around you crackles ominously...',
          'A strange hum vibrates through the walls...',
          'Static flickers at the edges of your vision...',
          'The button pulses faintly with unstable energy...',
        ];
        const randomMessage = atmosphericMessages[Math.floor(Math.random() * atmosphericMessages.length)];
        return `The button lights up: DO NOT PRESS THIS BUTTON AGAIN.\n${randomMessage}`;
      } else {
        resetRoomButtonPressed = false;
        return '\nInitiating reset in:\n5...\n4...\n3...\n2...\n1...\nMultiverse resetting...';
      }
    }
    return 'You see no button to press here.';
  }

  // Handle Sit Chair teleport logic
  if (lowerCommand === 'sit chair') {
    if (currentRoom === 'resetroom') {
      gameEngineInstance.currentRoom = 'trentparkearth';
      return 'You sit in the chair. Reality shifts... You find yourself at Trent Park.';
    }
    if (currentRoom === 'trentparkearth') {
      gameEngineInstance.currentRoom = 'resetroom';
      return 'You sit in the chair. Reality fractures... You find yourself in the Reset Room.';
    }
    return "You don't see a chair to sit in here.";
  }

  if (lowerCommand.startsWith('talk ')) {
    return handleTalkCommand(command);
  }

  if (lowerCommand.startsWith('go ')) {
    const direction = command.split(' ')[1];
    return gameEngineInstance.move(direction);
  }

  if (lowerCommand.startsWith('use ')) {
    return handleUseCommand(command, currentRoom);
  }

  if (lowerCommand === 'inventory') {
    const items = inventory.list();
    return items.length ? `You are carrying: ${items.join(', ')}` : 'Your inventory is empty.';
  }

  if (lowerCommand === 'look') {
    return handleLookCommand(currentRoom, gameEngineInstance.rooms);
  }

  if (lowerCommand === 'help') {
    return handleHelpCommand();
  }

  if (lowerCommand === 'secrets') {
    return handleSecretsCommand();
  }

  if (lowerCommand === 'achievements') {
    return handleAchievementsCommand();
  }

  if (lowerCommand === 'ask ayla') {
    return handleAskAylaInParser(currentRoom);
  }

  if (lowerCommand === 'support') {
    const support = npcSupportSystem.checkSupport();
    if (!support) {
      return '[System] You currently have no allegiance.';
    }
    return `[System] You are currently allied with ${support === 'al' ? 'Al' : 'Morthos'}.`;
  }

  if (lowerCommand === 'memory') {
    const roomsVisited = gameEngineInstance.visitedRooms.size;
    const secretsFound = gameEngineInstance.secretUnlocks.size;
    const resets = gameEngineInstance.resetCount;
    const ally = npcSupportSystem.checkSupport();
    let memory = `[Ayla AI Memory]\n- Player: ${gameEngineInstance.playerName}\n- Rooms visited: ${roomsVisited}\n- Secrets uncovered: ${secretsFound}\n- Resets performed: ${resets}\n- Current allegiance: ${
      ally ? (ally === 'al' ? 'Al' : 'Morthos') : 'None'
    }`;
    if (resets >= 3 && Math.random() < 0.4) {
      memory += '\n[Ayla AI] Warning: data integrity compromised. (static noises)';
    }
    return memory;
  }

  if (lowerCommand === 'save') {
    return SaveLoadSystem.save(gameEngineInstance);
  }

  if (lowerCommand === 'load') {
    return SaveLoadSystem.load(gameEngineInstance);
  }

  if (lowerCommand === 'reset') {
    return ResetSystem.resetGame(gameEngineInstance, inventory);
  }

  return "Unknown command. Type 'help' for available options.";
}
