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

// src/roomRegistry.ts
// Auto-generated room registry mapping

import type { Room } from './types/Room';
// Transitional registry: many room modules referenced previously are missing or empty.
// To reduce build noise and allow focused type cleanup, we replace static imports with
// a lazy placeholder-producing proxy. Real room modules can later overwrite entries.

interface MinimalRoom extends Room { id: string; title: string; description: string | string[]; zone?: string }
const placeholder = (id: string): MinimalRoom => ({
  id,
  title: id.replace(/_/g, ' '),
  description: [
    'An unmapped space hums faintly – content forthcoming.',
    'For now, this room exists as a stabiliser so the world remains traversable.'
  ]
} as MinimalRoom);

const base: Record<string, Room> = {
  // Seed with a few known IDs that existed before; others materialize on demand.
  introZone_introreset: { ...placeholder('introZone_introreset'), exits: { south: 'gorstanZone_gorstanhub' } } as any,
  gorstanZone_gorstanhub: { ...placeholder('gorstanZone_gorstanhub'), title: 'Gorstan Hub', exits: { north: 'introZone_introreset', east: 'glitchZone_ravenchamber' } } as any,
  glitchZone_ravenchamber: { ...placeholder('glitchZone_ravenchamber'), title: 'Raven Chamber', exits: { west: 'gorstanZone_gorstanhub' } } as any,
};

export const roomRegistry: Record<string, Room> = new Proxy(base, {
  get(target, prop: string) {
    if (!(prop in target)) {
      target[prop] = placeholder(prop);
    }
    return target[prop];
  }
});

export function listRoomIds(): string[] { return Object.keys(base); }

export default roomRegistry;
