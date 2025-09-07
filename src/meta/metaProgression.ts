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

// metaProgression.ts – unified meta-progression persistence for 30-minute modes
// Stores cross-run unlocks: artifacts, intel dossiers, prestige ranks, glitch loot, fae clauses.

export interface TrialsMeta {
  artifactRuns: number;
  artifactsUnlocked: string[]; // ids of artifact powers
  failures: number; // failed runs (for adaptive difficulty / pity timers)
}
export interface TrentMeta {
  runs: number;
  intelDossiers: string[]; // unique dossier ids
}
export interface NexusMeta {
  clears: number;
  prestigeRank: number; // computed from clears / challenge modifiers
  failureBadges: number; // count of recorded failures
}
export interface GlitchMeta {
  runs: number;
  glitchArtifacts: string[]; // inventory of quirky items
  persistentCorruptions: string[]; // modifiers that carry to next run
}
export interface FaeMeta {
  bargainsCompleted: number;
  faeClauses: string[]; // persistent contract clause ids
}

export interface MetaProgressionState {
  version: number;
  trials: TrialsMeta;
  trent: TrentMeta;
  nexus: NexusMeta;
  glitch: GlitchMeta;
  fae: FaeMeta;
  updated: number;
}

const KEY = 'gor_meta_progression_v1';
const VERSION = 1;

const defaultState: MetaProgressionState = {
  version: VERSION,
  updated: Date.now(),
  trials: { artifactRuns: 0, artifactsUnlocked: [], failures: 0 },
  trent: { runs: 0, intelDossiers: [] },
  nexus: { clears: 0, prestigeRank: 0, failureBadges: 0 },
  glitch: { runs: 0, glitchArtifacts: [], persistentCorruptions: [] },
  fae: { bargainsCompleted: 0, faeClauses: [] }
};

export function loadMeta(): MetaProgressionState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw) as Partial<MetaProgressionState>;
    if (!parsed || parsed.version !== VERSION) return structuredClone(defaultState);
    const merged: MetaProgressionState = {
      ...defaultState,
      ...parsed,
      trials: { ...defaultState.trials, ...(parsed as any).trials },
      trent: { ...defaultState.trent, ...(parsed as any).trent },
      nexus: { ...defaultState.nexus, ...(parsed as any).nexus },
      glitch: { ...defaultState.glitch, ...(parsed as any).glitch },
      fae: { ...defaultState.fae, ...(parsed as any).fae }
    };
    return merged;
  } catch {
    return structuredClone(defaultState);
  }
}

export function saveMeta(state: MetaProgressionState) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

let cache: MetaProgressionState | null = null;
function state(): MetaProgressionState { if (!cache) cache = loadMeta(); return cache; }

// Generic update helper
function update(mutator: (s: MetaProgressionState) => void): MetaProgressionState {
  const s = state();
  mutator(s); s.updated = Date.now(); saveMeta(s); return s;
}

// Public API for each mode progression
export function recordTrialsCompletion(unlockedArtifactIds: string[]) {
  return update(s => {
    s.trials.artifactRuns += 1;
    unlockedArtifactIds.forEach(id => { if (!s.trials.artifactsUnlocked.includes(id)) s.trials.artifactsUnlocked.push(id); });
  });
}
export function addTrialsArtifact(id: string) { return update(s => { if (!s.trials.artifactsUnlocked.includes(id)) s.trials.artifactsUnlocked.push(id); }); }
export function recordTrialsFailure() { return update(s => { s.trials.failures += 1; }); }

export function recordTrentIntel(dossierId: string) { return update(s => { if (!s.trent.intelDossiers.includes(dossierId)) s.trent.intelDossiers.push(dossierId); }); }
export function recordTrentRun() { return update(s => { s.trent.runs += 1; }); }

export function recordNexusClear() { return update(s => { s.nexus.clears += 1; s.nexus.prestigeRank = computePrestige(s.nexus.clears, s.nexus.failureBadges); }); }
export function recordNexusFailure() { return update(s => { s.nexus.failureBadges += 1; s.nexus.prestigeRank = computePrestige(s.nexus.clears, s.nexus.failureBadges); }); }

export function recordGlitchRun(artifacts: string[], corruptions: string[]) { return update(s => { s.glitch.runs += 1; artifacts.forEach(a => { if (!s.glitch.glitchArtifacts.includes(a)) s.glitch.glitchArtifacts.push(a); }); corruptions.forEach(c => { if (!s.glitch.persistentCorruptions.includes(c)) s.glitch.persistentCorruptions.push(c); }); }); }
export function addGlitchArtifact(id: string) { return update(s => { if (!s.glitch.glitchArtifacts.includes(id)) s.glitch.glitchArtifacts.push(id); }); }

export function recordFaeBargain(clauses: string[]) { return update(s => { s.fae.bargainsCompleted += 1; clauses.forEach(c => { if (!s.fae.faeClauses.includes(c)) s.fae.faeClauses.push(c); }); }); }
export function addFaeClause(id: string) { return update(s => { if (!s.fae.faeClauses.includes(id)) s.fae.faeClauses.push(id); }); }

function computePrestige(clears: number, failures: number): number {
  // Simple formula: clears *2 minus floor(failures/3), clamped >=0
  return Math.max(0, clears * 2 - Math.floor(failures / 3));
}

// Event bridge: listen to DOM events (emitted by future refactored 30-min modes) and persist.
export function installMetaProgressionEventBridge() {
  const handlers: [string, any][] = [
    ['trials:artifact-run', (e: CustomEvent) => recordTrialsCompletion(e.detail?.artifacts || [])],
    ['trials:artifact-unlock', (e: CustomEvent) => addTrialsArtifact(e.detail?.id)],
  ['trent:intel', (e: CustomEvent) => recordTrentIntel(e.detail?.id)],
  ['trials:fail', () => recordTrialsFailure()],
    ['trent:run-complete', () => recordTrentRun()],
    ['nexus:clear', () => recordNexusClear()],
    ['nexus:fail', () => recordNexusFailure()],
    ['glitch:run-complete', (e: CustomEvent) => recordGlitchRun(e.detail?.artifacts || [], e.detail?.corruptions || [])],
    ['glitch:artifact', (e: CustomEvent) => addGlitchArtifact(e.detail?.id)],
    ['fae:bargain-complete', (e: CustomEvent) => recordFaeBargain(e.detail?.clauses || [])],
    ['fae:clause', (e: CustomEvent) => addFaeClause(e.detail?.id)]
  ];
  handlers.forEach(([evt, fn]) => document.addEventListener(evt, fn as any));
  return () => handlers.forEach(([evt, fn]) => document.removeEventListener(evt, fn as any));
}

export function getMetaSnapshot(): MetaProgressionState { return state(); }
