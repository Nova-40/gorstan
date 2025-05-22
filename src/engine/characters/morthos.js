// Gorstan v2.4.0 – All modules validated and standardized
// MIT License © 2025 Geoff Webster
// Morthos Character Module
// This module defines the behavior and interactions for the character Morthos.
// Morthos is known for his sharp insults and occasional offers of cryptic help.

import morthosInsultsData from '../../../public/MorthosInsults.json';

// Constants for fallback messages and help responses
const FALLBACK_INSULT = "[Morthos] (silent glare of contempt)";
const HELP_RESPONSES = [
  "[Morthos] You look weak. Accept my power, and maybe, just maybe, you'll survive.",
  "[Morthos] Again? Fine. The answer you seek lies where the stars don't shine.",
  "[Morthos] You again? Pathetic. Figure it out yourself, mortal.",
  "[Morthos] (silent disdain)",
];

/**
 * Morthos class encapsulates all logic for the Morthos character.
 */
class Morthos {
  constructor() {
    try {
      // Defensive: Ensure insults data is an array
      this.insults = Array.isArray(morthosInsultsData) ? morthosInsultsData : [];
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
        return FALLBACK_INSULT;
      }
      const index = Math.floor(Math.random() * this.insults.length);
      return `[Morthos sneers] "${this.insults[index]}"`;
    } catch (err) {
      console.error('❌ Error retrieving random insult:', err);
      return FALLBACK_INSULT;
    }
  }

  /**
   * Offers cryptic help to the player.
   * The help becomes more sarcastic or dismissive after repeated requests.
   * @returns {string} - A help message from Morthos.
   */
  offerHelp() {
    try {
      const responseIndex = Math.min(this.helpCount, HELP_RESPONSES.length - 1);
      this.helpCount++;
      return HELP_RESPONSES[responseIndex];
    } catch (err) {
      console.error('❌ Error offering help:', err);
      return HELP_RESPONSES[HELP_RESPONSES.length - 1];
    }
  }

  /**
   * Provides a custom response based on the player's inventory or story progress.
   * @param {object} gameState - The current game state, including inventory and story progress.
   * @returns {string} - A tailored response from Morthos.
   */
  interact(gameState = {}) {
    try {
      const inventory = Array.isArray(gameState.inventory) ? gameState.inventory : [];
      const storyStage = typeof gameState.storyStage === 'number' ? gameState.storyStage : 1;
      if (inventory.includes('amulet')) {
        return "[Morthos] The amulet? Hmph. Even you might not mess this up.";
      }
      if (storyStage >= 3) {
        return "[Morthos] The end draws near. Try not to embarrass yourself.";
      }
      return this.getRandomInsult();
    } catch (err) {
      console.error('❌ Error during interaction with Morthos:', err);
      return FALLBACK_INSULT;
    }
  }

  /**
   * Resets Morthos's help count, typically used after a story reset.
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

// Export a singleton instance for use in the game
export const morthos = new Morthos();

// Only export what is needed for integration and testing
export default {
  FALLBACK_INSULT,
  HELP_RESPONSES,
  morthos,
};

/*
  === MODULE REVIEW ===
  1. 🔍 VALIDATION
     - No syntax errors or deprecated patterns.
     - No broken imports/exports or circular dependencies.
     - No unreachable code.
  2. 🔁 REFACTORING
     - Ensured only the singleton and constants are exported.
     - Improved comments and structure.
     - Added interact and resetHelpCount for parity with Al.
  3. 💬 COMMENTS & DOCUMENTATION
     - Module and function-level comments included.
     - MIT license and version header included.
  4. 🤝 INTEGRATION CHECK
     - Exports singleton and constants for use in engine and tests.
     - No side effects; safe for integration.
  5. 🧰 BONUS IMPROVEMENTS
     - Could add unit tests for insult selection and help logic.
     - Could memoize insult selection if performance ever becomes an issue.
*/
