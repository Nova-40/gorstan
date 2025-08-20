/*
  Gorstan – Spire Courtyard
  This is the final battleground where the Entity can be summoned and defeated.
*/

import { Room } from '../types/Room';

const spireCourtyard: Room = {
  id: 'spireCourtyard',
  title: 'Spire Courtyard',
  description: 'A vast open courtyard at the base of the Spire, surrounded by ancient ruins. The air is thick with tension, as if the world itself is holding its breath.',
  image: 'spireCourtyard.png',
  zone: 'finalZone',
  flags: {},
  exits: {
    south: 'glitchZone_ravenchamber',
  },
  items: [],
  npcs: [],
  rooms: [],
  interactables: {
    summoningCircle: {
      description: 'A glowing circle etched into the ground, pulsing with otherworldly energy.',
      actions: ['summon'],
      requires: ['finalKey'],
      effects: ['checkArtifactAndPendant'], // Added logic to check for artifact and pendant
    },
  },
};

export default spireCourtyard;
