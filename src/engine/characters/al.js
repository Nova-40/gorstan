// /src/engine/characters/al.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

// Al Character Module
// This module defines the behavior and interactions for the character Al.
// Al is known for his cryptic lyrics, occasional musical advice, and enigmatic charm.

import alLyricsData from '../../../public/alLyrics.json';

// Constants for fallback messages and help responses
const FALLBACK_MESSAGE = "[Al] (silence... perhaps he's tuning his instrument.)";
const HELP_RESPONSES = [
  "[Al] You could use a little music in your soul. Join me, and your path will be smoother.",
  "[Al] The rhythm of the world beats in threes. Follow it, and you'll find your way.",
  "[Al] I've given you all the notes. Now play your own song.",
  "[Al] (a knowing smile, but no words this time.)",
];

class Al {
  constructor() {
    try {
      this.lyrics = Array.isArray(alLyricsData.lyrics) ? alLyricsData.lyrics : []; // Load lyrics from external JSON
      this.helpCount = 0; // Tracks how many times Al has offered help
    } catch (err) {
      console.error('❌ Error initializing Al:', err);
      this.lyrics = []; // Fallback to an empty lyrics array
    }
  }

  /**
   * Retrieves a random lyric from Al.
   * @returns {string} - A random lyric or a default silent response if no lyrics are available.
   */
  getRandomLyric() {
    try {
      if (this.lyrics.length === 0) {
        return FALLBACK_MESSAGE;
      }
      const index = Math.floor(Math.random() * this.lyrics.length);
      return `[Al sings] "${this.lyrics[index]}"`;
    } catch (err) {
      console.error('❌ Error retrieving random lyric:', err);
      return FALLBACK_MESSAGE;
    }
  }

  /**
   * Offers cryptic or musical help to the player.
   * The help becomes more poetic or dismissive after repeated requests.
   * @returns {string} - A help message from Al.
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
   * @returns {string} - A tailored response from Al.
   */
  interact(gameState = {}) {
    try {
      const inventory = Array.isArray(gameState.inventory) ? gameState.inventory : [];
      const storyStage = typeof gameState.storyStage === 'number' ? gameState.storyStage : 1;

      if (inventory.includes('blueprint')) {
        return "[Al] Ah, the blueprint. A map to chaos, or perhaps to clarity. Use it wisely.";
      }
      if (storyStage >= 3) {
        return "[Al] The third act begins. The melody shifts, and so must you.";
      }
      return this.getRandomLyric();
    } catch (err) {
      console.error('❌ Error during interaction with Al:', err);
      return FALLBACK_MESSAGE;
    }
  }

  /**
   * Resets Al's help count, typically used after a story reset.
   */
  resetHelpCount() {
    try {
      this.helpCount = 0;
      console.log('[Al] Help count reset.');
    } catch (err) {
      console.error('❌ Error resetting Al help count:', err);
    }
  }
}

export const al = new Al();