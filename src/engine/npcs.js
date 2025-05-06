// /src/engine/npcs.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

// NPC System
// This module defines NPCs, their dialogues, and interactions with the player.
// It includes functionality for handling commands like "talk", "use", and "look".

import { inventory } from './inventory';
import { dialogueMemory } from './dialogueMemory';


class NPC {
  /**
   * Creates an NPC instance.
   * @param {string} name - The name of the NPC.
   * @param {Array<string>} dialogues - An array of dialogues for the NPC.
   * @param {object} options - Additional options for the NPC (e.g., mood, special interactions).
   */
  constructor(name, dialogues, options = {}) {
    this.name = name;
    this.dialogues = dialogues;
    this.interactionCount = 0;
    this.options = options;
  }

  /**
   * Handles interaction with the NPC.
   * @param {object} playerState - The current state of the player.
   * @returns {string} - The NPC's dialogue based on the interaction context.
   */
  talk(playerState = {}) {
    try {
      dialogueMemory.recordInteraction(this.name);
      this.interactionCount = dialogueMemory.getInteractionCount(this.name);

      // Special logic for Polly
      if (this.name === 'Polly') {
        if (playerState.godMode) {
          return "Polly smirks: 'Well well, playing deity today, are we?'";
        }
        if (inventory.hasItem('medallion')) {
          return "Polly narrows her eyes. 'I see you've solved it. You're either clever or lucky.'";
        }
        if (this.interactionCount > 3) {
          return "Polly lies again: 'This is definitely your first time speaking to me.'";
        }
      }

      // Special logic for Morthos and Al
      if (this.name === 'Morthos' || this.name === 'Al') {
        const mood = dialogueMemory.getMood(this.name);
        if (mood === 'grumpy') {
          return `${this.name} growls, 'Didn't I already tell you what I know?'`;
        }
        if (inventory.hasItem('blueprint')) {
          return `${this.name} raises an eyebrow. 'Where did you get that? This changes things.'`;
        }
      }

      // Special logic for Ayla
      if (this.name === 'Ayla') {
        const summons = dialogueMemory.getInteractionCount('Ayla');
        if (summons > 10) {
          return "Ayla rolls her eyes. 'You do know I'm not your PA, right?'";
        }
        if (playerState.recentRoom === 'Control Room' && !inventory.hasItem('coffee')) {
          return "Ayla says, 'This place gives me the creeps. You didn't forget the coffee, did you?'";
        }
      }

      // Default dialogue logic
      return this.dialogues[this.interactionCount] || this.dialogues[this.dialogues.length - 1];
    } catch (err) {
      console.error(`❌ Error interacting with NPC "${this.name}":`, err);
      return 'An error occurred while interacting with this NPC.';
    }
  }
}

// Define NPCs and their dialogues
export const npcs = {
  librarian: new NPC('Librarian', [
    'Welcome, traveler. Knowledge demands a price.',
    'Have you found the blueprint?',
    'Use what you have wisely.',
  ]),

  ayla: new NPC('Ayla', [
    'Hi there! Need a hint?',
    "Don't forget: sometimes throwing coffee isn't rude, it's progress.",
    'You’re doing better than you think — keep moving.',
  ]),

  polly: new NPC('Polly', [
    'Oh look, another clueless wanderer.',
    "Maybe if you *try harder*, you'll find the hidden door.",
    "I'm lying, of course. Or am I?",
  ]),

  archivist: new NPC('Archivist', [
    'You seek answers? The pages whisper your fate.',
    'One shard remains hidden beyond the veil.',
    'The Lattice remembers even when you forget.',
  ]),
};

/**
 * Handles the "talk" command for interacting with NPCs.
 * @param {string} npcName - The name of the NPC to talk to.
 * @returns {string} - The NPC's dialogue or an error message if the NPC is not found.
 */
export function talkToNPC(npcName) {
  try {
    const npc = npcs[npcName.toLowerCase()];
    if (npc) {
      dialogueMemory.recordInteraction(npcName.toLowerCase());
      const special = dialogueMemory.specialResponse(npcName.toLowerCase());
      if (special) {
        return special;
      }
      return npc.talk();
    }
    return "There's no one by that name here.";
  } catch (err) {
    console.error('❌ Error handling "talk" command:', err);
    return 'An error occurred while trying to talk to the NPC.';
  }
}

/**
 * Handles the "use" command for using items in the game.
 * @param {string} command - The full command string.
 * @param {string} currentRoom - The player's current room.
 * @returns {string} - The result of using the item.
 */
export function handleUseCommand(command, currentRoom) {
  try {
    const parts = command.trim().split(' ');
    if (parts.length >= 2 && parts[0].toLowerCase() === 'use') {
      const itemName = parts.slice(1).join(' ');
      if (inventory.has(itemName)) {
        if (itemName === 'coffee') {
          const secretResult = secretUnlocks.handleSpecialUse(currentRoom, 'coffee');
          const achievementResult = achievements.unlock('Reality Shaker');
          if (secretResult) {
            return `You boldly throw your coffee. ${secretResult} ${achievementResult}`;
          }
          return 'You boldly throw your coffee. Reality shudders slightly.';
        }
        if (itemName === 'greasy napkin') {
          return "You study the greasy napkin. It's a crude map of the Lattice.";
        }
        if (itemName === 'briefcase') {
          return 'The briefcase clicks open, revealing strange symbols inside.';
        }
        return `You use the ${itemName}, but nothing dramatic happens.`;
      } else {
        return "You don't have that item.";
      }
    }
    return "Invalid use command. Use 'use [itemname]'.";
  } catch (err) {
    console.error('❌ Error handling "use" command:', err);
    return 'An error occurred while trying to use the item.';
  }
}

/**
 * Handles the "look" command for inspecting the current room.
 * @param {string} currentRoom - The player's current room.
 * @param {object} rooms - The rooms object containing room data.
 * @returns {string} - The room description and exits.
 */
export function handleLookCommand(currentRoom, rooms) {
  try {
    const room = rooms[currentRoom];
    if (room) {
      return `${room.description}\nExits: ${Object.keys(room.exits).join(', ')}`;
    }
    return 'You see nothing noteworthy.';
  } catch (err) {
    console.error('❌ Error handling "look" command:', err);
    return 'An error occurred while trying to look around.';
  }
}

/**
 * Handles the "help" command to display available commands.
 * @returns {string} - A list of available commands.
 */
export function handleHelpCommand() {
  return `Available commands:\n- go [north|south|east|west]\n- talk [npcname]\n- use [itemname]\n- look\n- inventory\n- secrets\n- achievements`;
}


