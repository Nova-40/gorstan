// src/engine/commandParser.js
// MIT License Copyright (c) 2025 Geoff Webster
// Gorstan v2.1.0

import { addScore, setMilestone } from './storyProgress';
import { inventory } from './inventory';
import { talkToNPC } from './npcs';
import { rooms } from './rooms';
import { onEnterRoom } from './eventTriggers';
import { dialogueMemory } from './dialogueMemory';

/**
 * Parses and executes a player command.
 * @param {string} command - The player's input command.
 * @param {object} gameState - The current game state object.
 * @returns {string} - The result of the command execution.
 */
export function parseCommand(command, gameState = {}) {
  if (typeof command !== 'string' || !command.trim()) {
    return 'Invalid command. Please enter a valid action.';
  }

  try {
    const trimmed = command.trim().toLowerCase();
    const [verb, ...args] = trimmed.split(' ');
    const argString = args.join(' ').toLowerCase();

    // Support simple direction or jump commands directly
    const directions = ['north', 'south', 'east', 'west', 'up', 'down', 'jump'];
    if (directions.includes(trimmed)) {
      const room = rooms[gameState.currentRoom];
      const exits = typeof room?.exits === 'function' ? room.exits(gameState) : room?.exits || {};
      if (exits[trimmed]) {
        const newRoom = exits[trimmed];
        gameState.currentRoom = newRoom;
        return onEnterRoom(newRoom, gameState.storyStage);
      }
      return "You can't go that way.";
    }

    // Handle specific commands
    switch (verb) {
      case 'ask': {
        if (argString.startsWith('ayla')) {
          if (!gameState.aylaActive) return "There’s no one by that name here.";
          const question = argString.slice(4).trim();
          return `Ayla: "${question}" — I’ll think about it and get back to you."`;
        }
        return talkToNPC(argString);
      }

      case 'go': {
        const room = rooms[gameState.currentRoom];
        const exits = typeof room?.exits === 'function' ? room.exits(gameState) : room?.exits || {};
        if (exits[argString]) {
          const newRoom = exits[argString];
          gameState.currentRoom = newRoom;
          return onEnterRoom(newRoom, gameState.storyStage);
        }
        return 'You can’t go that way.';
      }

      case 'talk': {
        if (!argString) return 'Who do you want to talk to?';
        return talkToNPC(argString);
      }

      case 'use': {
        if (!argString) return 'What do you want to use?';
        return gameState.handleUseCommand?.(command, gameState.currentRoom) || 'Unable to use that.';
      }

      case 'fullscreen': {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
          return 'Entering fullscreen mode...';
        }
        return 'Fullscreen mode is not supported in your browser.';
      }

      case 'windowed': {
        if (document.exitFullscreen) {
          document.exitFullscreen();
          return 'Returning to windowed mode...';
        }
        return 'Windowed mode is not supported in your browser.';
      }

      case 'quit': {
        gameState.quitGame?.(gameState);
        return "You step away from the simulation. Reality (or a far more elaborate simulation) is waiting.";
      }

      case 'look': {
        return gameState.handleLookCommand?.(gameState.currentRoom, rooms) || 'There’s nothing to look at here.';
      }

      case 'inventory':
      case '/inv': {
        const items = inventory.listInventory();
        return items.length > 0 ? `Your inventory: ${items.join(', ')}` : 'Your inventory is empty.';
      }

      case '/doors': {
        gameState.showAllDoors = true;
        return 'Developer mode: showing all doors temporarily enabled.';
      }

      case '/doorsoff': {
        gameState.showAllDoors = false;
        return 'Developer mode: hidden doors are hidden once more.';
      }

      case 'secrets': {
        return gameState.handleSecretsCommand?.() || 'No secrets to reveal.';
      }

      case 'achievements': {
        return gameState.handleAchievementsCommand?.() || 'No achievements to display.';
      }

      case 'help': {
        const aylaSnark = dialogueMemory.getInteractionCount('Ayla') > 3
          ? " (Or just keep shouting for Ayla, she loves that.)"
          : '';
        return `Available commands:\n- north/south/east/west/jump\n- go [direction]\n- talk [npcname] or ask [npc] \n- use [itemname]\n- look\n- inventory (/inv)\n- secrets\n- achievements\n- /jump (experimental)\n- quit\n- /doors /doorsoff${aylaSnark}`;
      }

      default: {
        return 'Unknown command. Type "help" for a list of available actions.';
      }
    }
  } catch (err) {
    console.error('❌ Error parsing command:', err);
    return 'An error occurred while processing your command. Please try again.';
  }
}