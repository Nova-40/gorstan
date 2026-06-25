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

// src/celebrate.tsx
// Stable app-facing celebration facade.
//
// The JSON-backed calendar in src/celebrate/ is the canonical celebration system.
// The legacy seasonal controller is retained only for Gorstan-specific May 13
// flavour until that event is moved into the calendar data/flavour layer.

import React from 'react';
import { CelebrationController as CalendarCelebrationController } from './celebrate/celebrateController';
import { useSeasonalController } from './seasonal/useSeasonalController';
import { OverlayPortal as SeasonalOverlayPortal } from './seasonal/OverlayPortal';

interface CelebrationControllerProps {
  children: React.ReactNode;
}

export const CelebrationController: React.FC<CelebrationControllerProps> = ({ children }) => {
  // Legacy seasonal support is intentionally restricted in seasonalController.ts
  // to May 13 only, so Christmas/Easter are not double-shown alongside the
  // canonical calendar-backed celebration overlay.
  useSeasonalController();

  return (
    <CalendarCelebrationController>
      {children}
      <SeasonalOverlayPortal />
    </CalendarCelebrationController>
  );
};

export default CelebrationController;
