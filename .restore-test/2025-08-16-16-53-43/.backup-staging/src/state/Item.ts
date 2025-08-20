import { Player } from './Player';

export type Item = {
  id: string;
  name: string;
  description: string;
  effect: (player: Player) => void;
};

// Example items
export const healthPotion: Item = {
  id: 'health-potion',
  name: 'Health Potion',
  description: 'Restores 50 health points.',
  effect: (player: Player) => {
    player.health += 50;
    if (player.health > 100) player.health = 100; // Cap health at 100
    console.log('Health restored by 50 points.');
  },
};

export const manaPotion: Item = {
  id: 'mana-potion',
  name: 'Mana Potion',
  description: 'Restores 30 mana points.',
  effect: (player: Player) => {
    player.mana += 30;
    if (player.mana > 50) player.mana = 50; // Cap mana at 50
    console.log('Mana restored by 30 points.');
  },
};
