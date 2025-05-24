// Gorstan v2.4.1 – Refined for A+ Quality
// MIT License © 2025 Geoff Webster
// Dialogue Memory System

import { npcs } from './npcs';

const SPECIAL_RESPONSES = {
  polly: {
    threshold: 3,
    response: 'Polly sighs. "Fine. Maybe I do know a shortcut... or maybe I don\'t."',
  },
  ayla: {
    threshold: 5,
    response: 'Ayla grins. "You\'re really determined. I like that."',
  },
};

const UNPROMPTED_HINTS = {
  'Control Room': {
    2: 'A faint hum grows louder. Something here is waiting for you.',
  },
  'Library of the Nine': {
    3: 'The books seem to whisper secrets. Perhaps you should listen.',
  },
};

class DialogueMemory {
  constructor() {
    this.npcMemory = {};
    this.hintMemory = {};
  }

  _logError(context, err) {
    console.error(`❌ [DialogueMemory] ${context}:`, err);
  }

  recordInteraction(npcName) {
    try {
      if (typeof npcName !== 'string' || !npcName.trim()) throw new Error('Invalid NPC name');
      this.npcMemory[npcName] = (this.npcMemory[npcName] || 0) + 1;

      if (npcs?.onInteraction instanceof Function) {
        try {
          npcs.onInteraction(npcName, this.npcMemory[npcName]);
        } catch (err) {
          this._logError(`onInteraction failed for ${npcName}`, err);
        }
      }
    } catch (err) {
      this._logError('recordInteraction', err);
    }
  }

  getInteractionCount(npcName) {
    try {
      return typeof npcName === 'string' ? this.npcMemory[npcName] || 0 : 0;
    } catch (err) {
      this._logError('getInteractionCount', err);
      return 0;
    }
  }

  specialResponse(npcName) {
    try {
      const count = this.getInteractionCount(npcName);
      const npcResponse = SPECIAL_RESPONSES[npcName];
      return npcResponse && count >= npcResponse.threshold ? npcResponse.response : null;
    } catch (err) {
      this._logError('specialResponse', err);
      return null;
    }
  }

  recordUnpromptedHint(roomName, storyStage) {
    try {
      if (typeof roomName !== 'string' || typeof storyStage !== 'number') throw new Error('Invalid input');
      this.hintMemory[roomName] = this.hintMemory[roomName] || [];
      if (!this.hintMemory[roomName].includes(storyStage)) {
        this.hintMemory[roomName].push(storyStage);
      }
    } catch (err) {
      this._logError('recordUnpromptedHint', err);
    }
  }

  triggerUnpromptedHint(roomName, storyStage) {
    try {
      const hint = UNPROMPTED_HINTS[roomName]?.[storyStage] || null;
      if (hint) this.recordUnpromptedHint(roomName, storyStage);
      return hint;
    } catch (err) {
      this._logError('triggerUnpromptedHint', err);
      return null;
    }
  }

  getMemorySummary() {
    try {
      return {
        npcMemory: { ...this.npcMemory },
        hintMemory: { ...this.hintMemory },
      };
    } catch (err) {
      this._logError('getMemorySummary', err);
      return {};
    }
  }

  resetMemory() {
    try {
      this.npcMemory = {};
      this.hintMemory = {};
    } catch (err) {
      this._logError('resetMemory', err);
    }
  }
}

export const dialogueMemory = new DialogueMemory();
export { SPECIAL_RESPONSES, UNPROMPTED_HINTS };
