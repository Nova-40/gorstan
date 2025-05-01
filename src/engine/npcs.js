// /src/engine/npcs.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

import { inventory } from './inventory';
import { dialogueMemory } from './dialogueMemory';
import { secretUnlocks } from './secretUnlocks';
import { achievements } from './achievements';

class NPC {
  constructor(name, dialogues, options = {}) {
    this.name = name;
    this.dialogues = dialogues;
    this.interactionCount = 0;
    this.options = options;
  }

  talk(playerState = {}) {
    const dialogueMemory = require('./dialogueMemory').dialogueMemory;
    const inventory = require('./inventory').inventory;

    dialogueMemory.recordInteraction(this.name);
    this.interactionCount = dialogueMemory.getInteractionCount(this.name);

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

    if (this.name === 'Morthos' || this.name === 'Al') {
      const mood = dialogueMemory.getMood(this.name);
      if (mood === 'grumpy') {
        return `${this.name} growls, 'Didn't I already tell you what I know?'`;
      }
      if (inventory.hasItem('blueprint')) {
        return `${this.name} raises an eyebrow. 'Where did you get that? This changes things.'`;
      }
    }

    if (this.name === 'Ayla') {
      const summons = dialogueMemory.getInteractionCount('Ayla');
      if (summons > 10) {
        return "Ayla rolls her eyes. 'You do know I'm not your PA, right?'";
      }
      if (playerState.recentRoom === 'Control Room' && !inventory.hasItem('coffee')) {
        return "Ayla says, 'This place gives me the creeps. You didn't forget the coffee, did you?'";
      }
    }

    return this.dialogues[this.interactionCount] || this.dialogues[this.dialogues.length - 1];
  }
}

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

export function talkToNPC(npcName) {
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
}

export function handleTalkCommand(command) {
  const parts = command.trim().split(' ');
  if (parts.length >= 2 && parts[0].toLowerCase() === 'talk') {
    const npcName = parts.slice(1).join(' ');
    return talkToNPC(npcName);
  }
  return "Invalid talk command. Use 'talk [npcname]'.";
}

export function handleUseCommand(command, currentRoom) {
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
}

export function handleLookCommand(currentRoom, rooms) {
  const room = rooms[currentRoom];
  if (room) {
    return `${room.description}\nExits: ${Object.keys(room.exits).join(', ')}`;
  }
  return 'You see nothing noteworthy.';
}

export function handleSecretsCommand() {
  const secrets = Array.from(secretUnlocks.unlockedSecrets);
  if (secrets.length === 0) {
    return 'No secrets unlocked yet.';
  }
  return `Unlocked secrets: ${secrets.join(', ')}`;
}

export function handleAchievementsCommand() {
  return achievements.list();
}

export function handleHelpCommand() {
  return `Available commands:\n- go [north|south|east|west]\n- talk [npcname]\n- use [itemname]\n- look\n- inventory\n- secrets\n- achievements`;
}


