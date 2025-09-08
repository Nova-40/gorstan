/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  You may play Gorstan for free for personal entertainment only.
  You may NOT copy, redistribute, modify, or sell the game, its code, 
  artwork, storyline, or any other part without written permission.
  
  Gorstan includes third-party libraries and assets:
    - React © Meta Platforms, Inc. – MIT Licence
    - Lucide Icons © Lucide Contributors – ISC Licence
    - Flaticon icons © Flaticon.com – Free Licence with attribution
    - Other packages under their respective licences (see package.json)

  Full licence terms: see EULA.md in the project root.
*/

// Goimport { Room } from '../types/RoomTypes';stan and characters (c) Geoff Webster 2025
// Renders room descriptions and image logic.

import type { Room } from '../types/Room';

interface MinimalRoom extends Room { id: string; title: string; description: string | string[] }
const placeholder = (id: string): MinimalRoom => ({ id, title: id, description: 'Unmapped room – narrative pending.', exits: {} } as MinimalRoom);

const base: Record<string, Room> = {
  introZone_introreset: { ...placeholder('introZone_introreset'), exits: { south: 'gorstanZone_gorstanhub' } },
  gorstanZone_gorstanhub: { ...placeholder('gorstanZone_gorstanhub'), exits: { north: 'introZone_introreset', east: 'glitchZone_ravenchamber' } },
  glitchZone_ravenchamber: { ...placeholder('glitchZone_ravenchamber'), exits: { west: 'gorstanZone_gorstanhub' } }
};

export const roomRegistry: Record<string, Room> = new Proxy(base, {
  get(target, prop: string) {
    if (!(prop in target)) {target[prop] = placeholder(prop);}
    return target[prop];
  }
});

export default roomRegistry;
