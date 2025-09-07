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

// RS_HUD.tsx – Heads-up display with dynamic quips for Rune Sprint
import React, { useEffect, useState } from 'react';
import { getQuip } from '../features/RS_LoreRegister';
import { HUDBar } from '../../design/hud/HUDBar';
import { StatChip } from '../../design/hud/StatChip';
import { QuipBanner } from '../../design/hud/QuipBanner';
import { ProgressRing } from '../../design/hud/ProgressRing';
import { RUNE_SPRINT_BASE_DURATION_MS } from '../../design/constants/timing';

interface RSHUDProps {
  timeRemaining: number;          // ms
  guardianDistance: number;       // arbitrary units (z diff)
  fragments: number;
  hintCount: number;
  skipsUsed: number;
  perfectThisChamber: boolean;
  guardianRage: boolean;
}

export const RSHUD: React.FC<RSHUDProps> = ({ timeRemaining, guardianDistance, fragments, hintCount, skipsUsed, perfectThisChamber, guardianRage }) => {
  const [quip, setQuip] = useState<string>('');

  // Event-driven quip selection (brief & non-intrusive)
  useEffect(() => {
    if (hintCount === 1) setQuip(getQuip('hint_1'));
    else if (hintCount === 2) setQuip(getQuip('hint_2'));
    else if (hintCount === 3) setQuip(getQuip('hint_3'));
  }, [hintCount]);
  useEffect(() => { if (skipsUsed > 0) setQuip(getQuip('skip_used')); }, [skipsUsed]);
  useEffect(() => { if (guardianRage) setQuip(getQuip('guardian_rage')); }, [guardianRage]);
  useEffect(() => { if (perfectThisChamber) setQuip(getQuip('perfect_chamber')); }, [perfectThisChamber]);
  useEffect(() => { if (timeRemaining < 8000) setQuip(getQuip('low_time')); }, [timeRemaining]);
  useEffect(() => { if (guardianDistance < 10) setQuip(getQuip('guardian_near')); }, [guardianDistance]);

  const timeRatio = timeRemaining / RUNE_SPRINT_BASE_DURATION_MS;
  return (
    <div data-rs-active="true" data-rs-time={timeRemaining} style={{ position: 'fixed', top: '8px', left: '50%', transform: 'translateX(-50%)', zIndex: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <HUDBar>
        <StatChip label="T" value={(timeRemaining/1000).toFixed(1)+'s'} tone={timeRemaining < 8000 ? 'danger' : timeRemaining < 15000 ? 'warn' : 'default'} pulse={timeRemaining < 8000} />
        <StatChip label="Frags" value={fragments} />
        <StatChip label="Guard" value={guardianDistance.toFixed(1)} tone={guardianDistance < 10 ? 'danger' : guardianDistance < 20 ? 'warn' : 'default'} />
        <div style={{ marginLeft: 4 }}>
          <ProgressRing size={34} value={timeRatio} glow label={Math.max(0, Math.floor(timeRemaining/1000))} />
        </div>
      </HUDBar>
      {quip && (
        <QuipBanner tone={guardianRage ? 'danger' : 'lore'}>{quip}</QuipBanner>
      )}
    </div>
  );
};

export default RSHUD;
