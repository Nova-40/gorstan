// /src/engine/commandParser.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

import { inventory } from './inventory';
import { talkToNPC } from './npcs';
import { rooms } from './rooms';
import { onEnterRoom } from './eventTriggers';
import { dialogueMemory } from './dialogueMemory';

export function parseCommand(command, gameState) {
  const [verb, ...args] = command.trim().split(' ');
  const argString = args.join(' ').toLowerCase();

  switch (verb.toLowerCase()) {
    case 'go':
      if (rooms[gameState.currentRoom].exits[argString]) {
        const newRoom = rooms[gameState.currentRoom].exits[argString];
        gameState.currentRoom = newRoom;
        return onEnterRoom(newRoom, gameState.storyStage);
      }
      return 'You can’t go that way.';

    case 'talk':
      return talkToNPC(argString);

    case 'use':
      return gameState.handleUseCommand(command, gameState.currentRoom);

    case 'look':
      return gameState.handleLookCommand(gameState.currentRoom, rooms);

    case 'inventory':
    case '/inv':
      return inventory.listInventory().join(', ') || 'Your inventory is empty.';

    case '/jump':
      return 'You brace yourself... but nothing happens. Not yet.';

    case '/doors':
      return 'Developer mode: showing all doors temporarily enabled.';

    case '/doorsoff':
      return 'Developer mode: hidden doors are hidden once more.';

    case 'secrets':
      return gameState.handleSecretsCommand();

    case 'achievements':
      return gameState.handleAchievementsCommand();

    case 'help':
      const aylaSnark = dialogueMemory.getInteractionCount('Ayla') > 3
        ? " (Or just keep shouting for Ayla, she loves that.)"
        : '';
      return `Available commands:\n- go [direction]\n- talk [npcname]\n- use [itemname]\n- look\n- inventory (/inv)\n- secrets\n- achievements\n- /jump (experimental)\n- /doors /doorsoff${aylaSnark}`;

    default:
      return 'Unknown command. Type "help" for a list of available actions.';
  }
}
