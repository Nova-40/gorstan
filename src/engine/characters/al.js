// /src/engine/characters/al.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

// Al Character Module
// This module defines the behavior and interactions for the character Al.
// Al is known for his cryptic lyrics, occasional musical advice, and enigmatic charm.

import alLyricsData from '../../../public/alLyrics.json';

class Al {
  constructor() {
    try {
      this.lyrics = alLyricsData.lyrics || []; // Load lyrics from external JSON
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
        return "[Al] (silence... perhaps he's tuning his instrument.)";
      }
      const index = Math.floor(Math.random() * this.lyrics.length);
      return `[Al sings] "${this.lyrics[index]}"`;
    } catch (err) {
      console.error('❌ Error retrieving random lyric:', err);
      return "[Al] (silence... perhaps he's tuning his instrument.)";
    }
  }

  /**
   * Offers cryptic or musical help to the player.
   * The help becomes more poetic or dismissive after repeated requests.
   * @returns {string} - A help message from Al.
   */
  offerHelp() {
    try {
      this.helpCount++;
      if (this.helpCount === 1) {
        return "[Al] You could use a little music in your soul. Join me, and your path will be smoother.";
      }
      if (this.helpCount === 2) {
        return "[Al] The rhythm of the world beats in threes. Follow it, and you'll find your way.";
      }
      if (this.helpCount >= 3) {
        return "[Al] I've given you all the notes. Now play your own song.";
      }
      return "[Al] (a knowing smile, but no words this time.)";
    } catch (err) {
      console.error('❌ Error offering help:', err);
      return "[Al] (a knowing smile, but no words this time.)";
    }
  }

  /**
   * Provides a custom response based on the player's inventory or story progress.
   * @param {object} gameState - The current game state, including inventory and story progress.
   * @returns {string} - A tailored response from Al.
   */
  interact(gameState) {
    try {
      const inventory = gameState.inventory || [];
      const storyStage = gameState.storyStage || 1;

      if (inventory.includes('blueprint')) {
        return "[Al] Ah, the blueprint. A map to chaos, or perhaps to clarity. Use it wisely.";
      }
      if (storyStage >= 3) {
        return "[Al] The third act begins. The melody shifts, and so must you.";
      }
      return this.getRandomLyric();
    } catch (err) {
      console.error('❌ Error during interaction with Al:', err);
      return "[Al] (silence... perhaps he's tuning his instrument.)";
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
