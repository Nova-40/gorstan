/*
  Gorstan – Magic Scrolls
  These scrolls unlock spells when collected by the player.
*/

import { Item } from '../state/Item';

export const fireballScroll: Item = {
  id: 'fireballScroll',
  name: 'Scroll of Fireball',
  description: 'A scroll containing the secrets to casting a powerful fireball.',
  effect: (_player) => {
    console.log('Player uses fireball scroll!');
    // Add magical effects here
  },
};

export const healScroll: Item = {
  id: 'healScroll',
  name: 'Scroll of Heal',
  description: 'A scroll containing the secrets to casting a healing spell.',
  effect: (player) => {
    player.health += 25;
    if (player.health > 100) {
      player.health = 100;
    }
    console.log('Heal applied to player');
  },
};
