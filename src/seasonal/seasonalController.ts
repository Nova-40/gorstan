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

// src/seasonal/seasonalController.ts
// Legacy Gorstan-specific seasonal controller.
//
// Calendar-backed celebrations such as Christmas, Easter, Lunar New Year,
// solstices/equinoxes, etc. are handled by src/celebrate/celebrateGate.ts and
// src/celebrate/celebrateController.tsx. This legacy controller is now kept only
// for Gorstan-specific May 13 flavour until that event has its own canonical
// calendar/flavour mapping.

import { isMay13, shouldShowOncePerYear, markShown, inLondonNow } from './seasonalGate';
import { overlayBus } from './overlayBus';
import { config } from '../config';

export function maybeShowSeasonalOverlay(dispatch?: any) {
  if (!config.enableSeasonal) {
    return;
  }

  const now = inLondonNow();
  const year = now.getFullYear();
  const forced = config.forceSeason as 'christmas' | 'easter' | 'may13' | null | undefined;

  // Christmas and Easter are intentionally no-ops here. They are now owned by
  // the canonical JSON-backed celebration controller to prevent duplicate
  // overlays and divergent date logic.
  if (forced === 'christmas' || forced === 'easter') {
    console.info(
      `[seasonalController] Ignoring forced ${forced}; calendar celebrations are handled by src/celebrate/.`,
    );
    return;
  }

  if (forced === 'may13') {
    return triggerMay13(year, dispatch);
  }

  // May 13 (author's birthday / Gorstan-specific flavour)
  if (isMay13(now) && shouldShowOncePerYear(`may13-${year}`)) {
    triggerMay13(year, dispatch);
  }
}

function triggerMay13(year: number, dispatch?: any) {
  console.log(`🎂 May 13 overlay triggered for ${year}`);
  overlayBus.showOverlay('may13');
  markShown(`may13-${year}`);

  // Set flags for post-overlay NPC banter
  if (dispatch) {
    dispatch({ type: 'SET_FLAG', payload: { flag: 'may13Celebration', value: true } });
  }
}
