// /src/engine/characters/al.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

import alLyricsData from '../../../public/alLyrics.json';

class Al {
  constructor() {
    this.lyrics = alLyricsData.lyrics || [];
  }

  getRandomLyric() {
    if (this.lyrics.length === 0) {
      return "[Al] (silence... perhaps he's tuning his instrument.)";
    }
    const index = Math.floor(Math.random() * this.lyrics.length);
    return `[Al sings] "${this.lyrics[index]}"`;
  }

  offerHelp() {
    return "[Al] You could use a little music in your soul. Join me, and your path will be smoother.";
  }
}

export const al = new Al();
