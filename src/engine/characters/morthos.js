// /src/engine/characters/morthos.js
// MIT License Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

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

class Morthos {
  constructor() {
    try {
      this.insults = Array.isArray(morthosInsultsData.insults) ? morthosInsultsData.insults : []; // Load insults from external JSON
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
      return HELP_RESPONSES[response// /src/engine/characters/morthos.js
// MIT License Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

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

class Morthos {
  constructor() {
    try {
      this.insults = Array.isArray(morthosInsultsData.insults) ? morthosInsultsData.insults : []; // Load insults from external JSON
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
      return HELP_RESPONSES[response