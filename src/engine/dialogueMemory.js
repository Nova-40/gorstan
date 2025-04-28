// /src/engine/dialogueMemory.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

import { npcs } from './npcs';

class DialogueMemory {
  constructor() {
    this.npcMemory = {};
  }

  recordInteraction(npcName) {
    if (!this.npcMemory[npcName]) {
      this.npcMemory[npcName] = 0;
    }
    this.npcMemory[npcName]++;
  }

  getInteractionCount(npcName) {
    return this.npcMemory[npcName] || 0;
  }

  specialResponse(npcName) {
    const count = this.getInteractionCount(npcName);
    if (npcName === 'polly' && count >= 3) {
      return 'Polly sighs. "Fine. Maybe I do know a shortcut... or maybe I don\'t."';
    }
    if (npcName === 'ayla' && count >= 5) {
      return 'Ayla grins. "You\'re really determined. I like that."';
    }
    return null;
  }
}

export const dialogueMemory = new DialogueMemory();
