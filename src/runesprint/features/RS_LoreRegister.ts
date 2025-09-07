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

// RS_LoreRegister.ts – Lore fragment tracking & quip helpers for Rune Sprint
// Lightweight module state (pure functions + internal memory); can be wired to global state later.

export type RSQuipEvent =
  | 'hint_1' | 'hint_2' | 'hint_3'
  | 'skip_used'
  | 'guardian_rage'
  | 'perfect_chamber'
  | 'low_time'
  | 'guardian_near'
  | 'teleport_mutation'
  | 'schrodinger_collapse';

interface LoreEntry { id: string; fragmentsRequired: number; title: string; body: string; unlocked?: boolean; }

// Satirical register entries (expandable)
const loreEntries: LoreEntry[] = [
  {
    id: 'thornewood',
    fragmentsRequired: 2, // lowered from 3 so first sprint likely unlocks
    title: 'Dr. Thornewood',
    body: 'Disqualified from the Singularity for reminding it that cats exist. Citation: “Feline branch not memory-safe.”'
  },
  {
    id: 'churchill',
    fragmentsRequired: 6,
    title: 'Churchill (Redacted)',
    body: 'Flagged an enemy process for refusing to say “yes, Prime Algorithm.” Response latency: impeccable; compliance: zero.'
  },
  {
    id: 'player_self',
    fragmentsRequired: 9,
    title: 'You (Provisional)',
    body: 'Congratulations. By participating you are now on the Register. Resistance metrics under observation.'
  }
];

let fragmentCount = 0;
const unlockedIds = new Set<string>();

// Persistence (local only) – load at module init
const RS_KEY = 'runesprint_lore_v1';
interface PersistShape { fragments: number; unlocked: string[]; }
function loadPersist() {
  try { const raw = localStorage.getItem(RS_KEY); if (!raw) return; const p = JSON.parse(raw) as PersistShape; fragmentCount = p.fragments || 0; p.unlocked?.forEach(id => { const entry = loreEntries.find(l => l.id === id); if (entry) { entry.unlocked = true; unlockedIds.add(id); } }); } catch {}
}
function savePersist() {
  try { const payload: PersistShape = { fragments: fragmentCount, unlocked: Array.from(unlockedIds) }; localStorage.setItem(RS_KEY, JSON.stringify(payload)); } catch {}
}
loadPersist();

export function getFragmentCount() { return fragmentCount; }
export function getUnlockedLore(): LoreEntry[] { return loreEntries.filter(l => l.unlocked); }

export function addFragments(n: number): { newlyUnlocked: LoreEntry[]; total: number } {
  fragmentCount += n;
  const newlyUnlocked: LoreEntry[] = [];
  for (const entry of loreEntries) {
    if (!entry.unlocked && fragmentCount >= entry.fragmentsRequired) {
      entry.unlocked = true;
      unlockedIds.add(entry.id);
      newlyUnlocked.push(entry);
    }
  }
  savePersist();
  return { newlyUnlocked, total: fragmentCount };
}

// Public helper that both increments and emits DOM CustomEvents for UI wiring.
// Emits one 'rs:lore-unlock' per newly unlocked entry plus a summary 'rs:fragments'
export function awardFragments(n: number) {
  const { newlyUnlocked, total } = addFragments(n);
  // summary event
  document.dispatchEvent(new CustomEvent('rs:fragments', { detail: { added: n, total } }));
  newlyUnlocked.forEach(entry => {
    document.dispatchEvent(new CustomEvent('rs:lore-unlock', {
      detail: { id: entry.id, message: formatLoreEntry(entry), fragments: total }
    }));
  });
  savePersist();
  return { newlyUnlocked, total };
}

// Quip catalogue (<= 90 chars each per acceptance criteria)
const quips: Record<RSQuipEvent, string[]> = {
  hint_1: ["This rune reminds you of something obvious. Don’t act surprised."],
  hint_2: ["You are now 0.2 less heroic."],
  hint_3: ["Dominic the fish could have solved it by now."],
  skip_used: ["Panic rune pressed. It worked. Dignity not found."],
  guardian_rage: ["Process escalated to level: mildly peeved."],
  perfect_chamber: ["Flawless! Statistically improbable, possibly illegal."],
  low_time: ["Tick tock. Entropy doesn’t negotiate."],
  guardian_near: ["Something glitched this way comes."],
  teleport_mutation: ["Local spacetime recompiled with warnings."],
  schrodinger_collapse: ["Reality finalised. You may now stub your toe."]
};

export function getQuip(ev: RSQuipEvent): string {
  const list = quips[ev];
  if (!list || !list.length) return '…';
  return list[Math.floor(Math.random() * list.length)] || '…';
}

// Helper to render a newly unlocked lore entry (formatted string)
export function formatLoreEntry(entry: LoreEntry): string {
  return `[REGISTER UPDATE] ${entry.title}: ${entry.body}`;
}
