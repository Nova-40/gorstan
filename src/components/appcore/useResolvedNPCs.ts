/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  Resolves the mixed NPC data shape used by AppCore into concrete NPC objects.
*/

import { useMemo } from 'react';

import { npcRegistry } from '../../npcs/npcMemory';
import type { NPC, NPCMood } from '../../types/NPCTypes';

function createFallbackNPC(npcId: string, currentRoomId: string): NPC {
  return {
    id: npcId,
    name: npcId.charAt(0).toUpperCase() + npcId.slice(1).replace(/_/g, ' '),
    location: currentRoomId || 'unknown',
    description: `A character named ${npcId}`,
    portrait: `/images/${npcId}.png`,
    mood: 'neutral' as NPCMood,
    memory: {
      interactions: 0,
      lastInteraction: Date.now(),
      playerActions: [],
      relationship: 50,
      knownFacts: [],
    },
  } as NPC;
}

export function useResolvedNPCs(npcData: Array<NPC | string> | undefined, currentRoomId: string): NPC[] {
  return useMemo(() => {
    const rawNpcs = npcData || [];

    return rawNpcs
      .map((npcOrId: NPC | string) => {
        if (typeof npcOrId !== 'string') {
          return npcOrId as NPC;
        }

        const npcFromRegistry = npcRegistry.get(npcOrId);
        if (npcFromRegistry) {
          return npcFromRegistry;
        }

        return createFallbackNPC(npcOrId, currentRoomId);
      })
      .filter(Boolean);
  }, [npcData, currentRoomId]);
}

export function createAylaHelper(): NPC {
  return {
    id: 'ayla',
    name: 'Ayla',
    location: 'universal',
    description: 'Your helpful guide through the game',
    portrait: '/images/Ayla.png',
    mood: 'helpful' as NPCMood,
    memory: {
      interactions: 0,
      lastInteraction: Date.now(),
      playerActions: [],
      relationship: 50,
      knownFacts: [],
    },
  } as NPC;
}
