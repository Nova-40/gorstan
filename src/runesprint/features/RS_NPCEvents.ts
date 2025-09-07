/*
  Gorstan – Interactive Game Framework
  Copyright © 2025 Geoff Webster. All Rights Reserved.

  This source code is proprietary and confidential.
  Unauthorised copying, distribution, modification, resale,
  reverse engineering, or use of this file, via any medium,
  is strictly prohibited without prior written consent
  from the copyright holder.

  Licensed access is granted only to authorised users who have
  purchased access to Gorstan through official channels.
  Such licence is strictly limited to running and playing the
  Gorstan game. No part of this source code may be used to
  create derivative works, other games, or redistributed in
  any form.

  Third-party libraries and assets are included under their
  respective licences as detailed in package.json and assets/.
*/

// RS_NPCEvents.ts – NPC quips (Ayla, Polly, Dominic) for Rune Sprint
// (getQuip import removed; NPC quips are defined directly here)

export type RSNPC = 'ayla' | 'polly' | 'dominic';
export type RSNPCEventKind = 'offer_hint' | 'assist' | 'ambient';

interface NPCEvent { npc: RSNPC; kind: RSNPCEventKind; quip: string; id: string; }

const usedThisSprint = new Set<string>(); // per npc:kind
const spokenNPCs = new Set<RSNPC>();      // enforce exactly once per sprint

const npcQuips: Record<RSNPC, Record<RSNPCEventKind, string>> = {
  ayla: {
    offer_hint: 'AI ethics compliance check passed. Here is your totally earned hint.',
    assist: 'Logging: intervention executed with minimal judgment.',
    ambient: 'Audit noted. You still failed.'
  },
  polly: {
    offer_hint: 'Want a hint? I’ll invoice you later.',
    assist: 'Guardian retargeted. Don’t thank me. Actually do.',
    ambient: 'Sarcasm module warming up.'
  },
  dominic: {
    offer_hint: 'Glub. That rune is upside‑down. Unlike you, I noticed.',
    assist: 'Glub (translation: I distracted it).',
    ambient: 'Glub glub (existential dread).'
  }
};

export function getNPCEvent(npc: RSNPC, kind: RSNPCEventKind): NPCEvent | null {
  if (spokenNPCs.has(npc)) return null; // already spoke this sprint
  const key = `${npc}:${kind}`;
  if (usedThisSprint.has(key)) return null;
  usedThisSprint.add(key);
  spokenNPCs.add(npc);
  return { npc, kind, quip: npcQuips[npc][kind], id: key };
}

export function resetNPCSprint() { usedThisSprint.clear(); spokenNPCs.clear(); }
export function hasNPCSpoken(npc: RSNPC) { return spokenNPCs.has(npc); }

// Convenience: request a quip and emit DOM event if available
export function emitNPCQuip(npc: RSNPC, kind: RSNPCEventKind) {
  const evt = getNPCEvent(npc, kind);
  if (!evt) return null;
  document.dispatchEvent(new CustomEvent('rs:npc-quip', { detail: evt }));
  return evt;
}
