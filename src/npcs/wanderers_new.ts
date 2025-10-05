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

import { NPC, NPCMemory } from '../types/NPCTypes';

function normalizeNPC(obj: Record<string, any>): NPC {
  const defaultMemory: NPCMemory = {
    interactions: 0,
    lastInteraction: 0,
    playerActions: [],
    relationship: 0,
    knownFacts: [],
  };
  const base: Partial<NPC> = {
    id: String(obj.id || obj.name || 'unknown'),
    name: obj.name || String(obj.id || 'Unknown'),
    description: obj.personality || obj.description || '',
    mood: (obj.mood as any) || 'neutral',
    health: typeof obj.health === 'number' ? obj.health : 100,
    maxHealth: typeof obj.maxHealth === 'number' ? obj.maxHealth : 100,
    memory: obj.memory ?? defaultMemory,
    conversation: obj.conversation,
    inventory: obj.inventory ?? [],
    flags: obj.flags ?? [],
    special: obj.special ?? {},
  };
  return { ...base, ...obj } as unknown as NPC;
}

export const al: NPC = normalizeNPC({
  id: 'al',
  name: 'Al',
  portrait: '/images/Al.png',
  mood: 'neutral',
  memory: {
    interactions: 0,
    lastInteraction: 0,
    playerActions: [],
    relationship: 0,
    knownFacts: [],
  },
  currentRoom: 'controlroom',
});

export const morthos: NPC = normalizeNPC({
  id: 'morthos',
  name: 'Morthos',
  portrait: '/images/Morthos.png',
  mood: 'neutral',
  memory: {
    interactions: 0,
    lastInteraction: 0,
    playerActions: [],
    relationship: 0,
    knownFacts: [],
  },
  currentRoom: 'glitchgate',
});

export const polly: NPC = normalizeNPC({
  id: 'polly',
  name: 'Polly',
  portrait: '/images/npcs/polly.png',
  mood: 'neutral',
  memory: {
    interactions: 0,
    lastInteraction: 0,
    playerActions: [],
    relationship: 0,
    knownFacts: [],
  },
  currentRoom: 'glitchgate',
});

export const wendell: NPC = normalizeNPC({
  id: 'mrwendell',
  name: 'Mr. Wendell',
  portrait: '/images/npcs/mrwendell.png',
  mood: 'neutral',
  memory: {
    interactions: 0,
    lastInteraction: 0,
    playerActions: [],
    relationship: 0,
    knownFacts: [],
  },
  currentRoom: 'stantonhub',
});

export const dominic: NPC = normalizeNPC({
  id: 'dominic',
  name: 'Dominic',
  portrait: '/images/npcs/dominic.png',
  mood: 'neutral',
  memory: {
    interactions: 0,
    lastInteraction: 0,
    playerActions: [],
    relationship: 0,
    knownFacts: [],
  },
  currentRoom: 'burgerjoint',
});

export const wanderers = [al, morthos, polly, wendell, dominic];

export default dominic;
