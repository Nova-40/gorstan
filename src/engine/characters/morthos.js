// /src/engine/characters/morthos.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

import morthosInsultsData from '../../../public/MorthosInsults.json';

class Morthos {
  constructor() {
    this.insults = morthosInsultsData.insults || [];
  }

  getRandomInsult() {
    if (this.insults.length === 0) {
      return '[Morthos] (silent glare of contempt)';
    }
    const index = Math.floor(Math.random() * this.insults.length);
    return `[Morthos sneers] "${this.insults[index]}"`;
  }

  offerHelp() {
    return "[Morthos] You look weak. Accept my power, and maybe, just maybe, you'll survive.";
  }
}

export const morthos = new Morthos();
