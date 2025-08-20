import { wanderingShadows } from '../npc/index';

/*
  Gorstan – Magic System
  This module manages the structured magic system, including spells, mana, and effects.
*/

export type Spell = {
  id: string;
  name: string;
  description: string;
  manaCost: number;
  effect: (target: any) => void;
};

export class MagicSystem {
  private mana: number;
  private spells: Spell[];

  constructor(initialMana: number) {
    this.mana = initialMana;
    this.spells = [];
  }

  addSpell(spell: Spell): void {
    this.spells.push(spell);
  }

  castSpell(spellId: string, target: any): number {
    const spell = this.spells.find(s => s.id === spellId);
    if (!spell) {
      console.error('Spell not found');
      return 0;
    }

    if (this.mana < spell.manaCost) {
      console.error('Not enough mana');
      return 0;
    }

    this.mana -= spell.manaCost;
    spell.effect(target);
    return spell.manaCost; // Return the mana cost as a numeric value
  }

  getMana(): number {
    return this.mana;
  }

  getSpells(): Spell[] {
    return this.spells;
  }

  regenerateMana(amount: number): void {
    this.mana += amount;
  }

  activateShadows(): void {
    if (this.spells.length > 0) {
      const randomShadow = wanderingShadows[Math.floor(Math.random() * wanderingShadows.length)];
      console.log(`A ${randomShadow.name} has appeared in the room!`);
      // Logic to integrate the shadow into the current room can be added here
    }
  }
}
