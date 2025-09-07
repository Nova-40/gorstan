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

import React from 'react';
import { HUDBar } from '../design/hud/HUDBar';
import { StatChip } from '../design/hud/StatChip';
import { ProgressRing } from '../design/hud/ProgressRing';
import { QuipBanner } from '../design/hud/QuipBanner';

interface TrialsHUDProps {
  timeRemaining: number; // ms
  health: number;
  energy: number;
  stamina: number;
  phase: string;
  phaseProgress: number; // 0-100
  objective?: string;
  dangerLevel?: number; // derived threat metric 0-1
}

export const TrialsHUD: React.FC<TrialsHUDProps> = ({ timeRemaining, health, energy, stamina, phase, phaseProgress, objective, dangerLevel=0 }) => {
  const timeSec = Math.max(0, Math.floor(timeRemaining/1000));
  const timeTone = timeSec < 10 ? 'danger' : timeSec < 25 ? 'warn' : 'default';
  const hpTone = health < 25 ? 'danger' : health < 50 ? 'warn' : 'ok';
  const energyTone = energy < 20 ? 'warn' : 'default';
  const stamTone = stamina < 15 ? 'warn' : 'default';
  const dangerTone = dangerLevel > 0.7 ? 'danger' : dangerLevel > 0.4 ? 'warn' : 'default';
  return (
    <div style={{ position: 'fixed', top: 8, left: '50%', transform: 'translateX(-50%)', zIndex: 550, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <HUDBar>
        <StatChip label="T" value={timeSec+'s'} tone={timeTone as any} pulse={timeTone==='danger'} />
        <StatChip label="HP" value={health} tone={hpTone as any} />
        <StatChip label="EN" value={energy} tone={energyTone as any} />
        <StatChip label="ST" value={stamina} tone={stamTone as any} />
        <StatChip label="Phase" value={phase} />
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <ProgressRing size={36} value={phaseProgress/100} glow label={Math.floor(phaseProgress)} />
        </div>
        {dangerLevel > 0 && <StatChip label="Threat" value={Math.round(dangerLevel*100)+'%'} tone={dangerTone as any} pulse={dangerTone==='danger'} />}
      </HUDBar>
      {objective && (
        <QuipBanner tone="system" compact>{objective}</QuipBanner>
      )}
    </div>
  );
};

export default TrialsHUD;