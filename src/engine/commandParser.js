// /src/engine/commandParser.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

// Command Parser System
// This module processes player commands and routes them to the appropriate game logic.
// It ensures smooth interaction between the player and the game engine.

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
export function parseCommand(command, gameState) {
  try {
    // Split the command into verb and arguments
    const [verb, ...args] = command.trim().split(' ');
    const argString = args.join(' ').toLowerCase();

    // Handle commands based on the verb
    switch (verb.toLowerCase()) {
      case 'go': {
        // Handle movement between rooms
        const exits = rooms[gameState.currentRoom]?.exits || {};
        if (exits[argString]) {
          const newRoom = exits[argString];
          gameState.currentRoom = newRoom;
          return onEnterRoom(newRoom, gameState.storyStage);
        }
        return 'You can’t go that way.';
      }

      case 'talk': {
        // Handle talking to NPCs
        if (!argString) return 'Who do you want to talk to?';
        return talkToNPC(argString);
      }

      case 'use': {
        // Handle using items
        if (!argString) return 'What do you want to use?';
        return gameState.handleUseCommand(command, gameState.currentRoom);
      }

      case 'look': {
        // Handle inspecting the current room
        return gameState.handleLookCommand(gameState.currentRoom, rooms);
      }

      case 'inventory':
      case '/inv': {
        // Display the player's inventory
        const items = inventory.listInventory();
        return items.length > 0 ? `Your inventory: ${items.join(', ')}` : 'Your inventory is empty.';
      }

      case '/jump': {
        // Experimental command for testing
        return 'You brace yourself... but nothing happens. Not yet.';
      }

      case '/doors': {
        // Developer mode: show all doors
        gameState.showAllDoors = true;
        return 'Developer mode: showing all doors temporarily enabled.';
      }

      case '/doorsoff': {
        // Developer mode: hide all doors
        gameState.showAllDoors = false;
        return 'Developer mode: hidden doors are hidden once more.';
      }

      case 'secrets': {
        // Handle displaying secrets
        return gameState.handleSecretsCommand();
      }

      case 'achievements': {
        // Handle displaying achievements
        return gameState.handleAchievementsCommand();
      }

      case 'help': {
        // Display a list of available commands
        const aylaSnark = dialogueMemory.getInteractionCount('Ayla') > 3
          ? " (Or just keep shouting for Ayla, she loves that.)"
          : '';
        return `Available commands:\n- go [direction]\n- talk [npcname]\n- use [itemname]\n- look\n- inventory (/inv)\n- secrets\n- achievements\n- /jump (experimental)\n- /doors /doorsoff${aylaSnark}`;
      }

      default: {
        // Handle unknown commands
        return 'Unknown command. Type "help" for a list of available actions.';
      }
    }
  } catch (err) {
    console.error('❌ Error parsing command:', err);
    return 'An error occurred while processing your command.';
  }
}
