// /src/engine/characters/morthos.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

// Morthos Character Module
// This module defines the behavior and interactions for the character Morthos.
// Morthos is known for his sharp insults and occasional offers of cryptic help.

import morthosInsultsData from '../../../public/MorthosInsults.json';

class Morthos {
  constructor() {
    try {
      this.insults = morthosInsultsData.insults || []; // Load insults from external JSON
      this.helpCount = 0; // Tracks how many times Morthos has offered help
    } catch (err) {
      console.error('❌ Error initializing Morthos:', err);
      this.insults = []; // Fallback to an empty insults array
    }
  }

  /**
   * Retrieves a random insult from Morthos.
   * @returns {string} - A random insult or a default silent glare if no insults are available.
   */
  getRandomInsult() {
    try {
      if (this.insults.length === 0) {
        return '[Morthos] (silent glare of contempt)';
      }
      const index = Math.floor(Math.random() * this.insults.length);
      return `[Morthos sneers] "${this.insults[index]}"`;
    } catch (err) {
      console.error('❌ Error retrieving random insult:', err);
      return '[Morthos] (silent glare of contempt)';
    }
  }

  /**
   * Offers cryptic help to the player.
   * The help becomes more sarcastic or dismissive after repeated requests.
   * @returns {string} - A help message from Morthos.
   */
  offerHelp() {
    try {
      this.helpCount++;
      if (this.helpCount === 1) {
        return "[Morthos] You look weak. Accept my power, and maybe, just maybe, you'll survive.";
      }
      if (this.helpCount === 2) {
        return "[Morthos] Again? Fine. The answer you seek lies where the stars don't shine.";
      }
      if (this.helpCount >= 3) {
        return "[Morthos] You again? Pathetic. Figure it out yourself, mortal.";
      }
      return "[Morthos] (silent disdain)";
    } catch (err) {
      console.error('❌ Error offering help:', err);
      return "[Morthos] (silent disdain)";
    }
  }

  /**
   * Provides a custom response based on the player's inventory or story progress.
   * @param {object} gameState - The current game state, including inventory and story progress.
   * @returns {string} - A tailored response from Morthos.
   */
  interact(gameState) {
    try {
      const inventory = gameState.inventory || [];
      const storyStage = gameState.storyStage || 1;

      if (inventory.includes('medallion')) {
        return "[Morthos] Ah, the medallion. You think it will save you? Foolish.";
      }
      if (storyStage >= 3) {
        return "[Morthos] You've come far, but the hardest trials are yet to come.";
      }
      return this.getRandomInsult();
    } catch (err) {
      console.error('❌ Error during interaction with Morthos:', err);
      return "[Morthos] (silent glare of contempt)";
    }
  }

  /**
   * Resets Morthos' help count, typically used after a story reset.
   */
  resetHelpCount() {
    try {
      this.helpCount = 0;
      console.log('[Morthos] Help count reset.');
    } catch (err) {
      console.error('❌ Error resetting Morthos help count:', err);
    }
  }
}

export const morthos = new Morthos();
