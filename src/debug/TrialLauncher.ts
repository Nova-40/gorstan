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

import { listAllTrials } from './TrialsRegistry';
import type { TrialMeta } from './TrialsRegistry';

// Minimal launcher: for now we leverage existing stage dispatch route via ADVANCE_STAGE to 'trialsGame'.
// We do not modify Trials internal logic; we only trigger the stage.
export interface TrialLaunchOptions {
  seed?: number; // Potential future: seed trials RNG (currently forwarded via custom event)
}

export function launchTrial(id: string, dispatch: React.Dispatch<any>, opts: TrialLaunchOptions = {}) {
  const match: TrialMeta | undefined = listAllTrials().find(t => t.id === id);
  if (!match) throw new Error(`Unknown trial id: ${id}`);
  // Emit optional seed event BEFORE stage change so TrialsGame hook can read if implemented later.
  if (opts.seed !== undefined) {
    document.dispatchEvent(new CustomEvent('trials:seed', { detail: { seed: opts.seed } }));
  }
  // Re-use existing ADVANCE_STAGE semantics expected by AppCore.
  dispatch({ type: 'ADVANCE_STAGE', payload: 'trialsGame' });
}
