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

// Read-only Trials registry interface. In absence of a richer data source we expose a static list.
// Non-invasive: does not alter existing Trials gameplay implementation.
export interface TrialMeta {
  id: string;           // internal identifier
  title: string;        // display title
  description: string;  // short description
  difficulty: 'easy' | 'normal' | 'hard';
  notes?: string;       // optional dev notes
}

// Placeholder list – expand if more phases / variants become individually launchable.
const trials: TrialMeta[] = [
  {
    id: 'trialsofGorstan-core',
    title: 'Trials of Gorstan (Full Run)',
    description: 'Start a full Trials sequence run (rock field → falling rocks → mushroom field → maze).',
    difficulty: 'normal'
  }
];

export function listAllTrials(): readonly TrialMeta[] { return trials; }
