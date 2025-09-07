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

// RSNPCAutoQuips – automatically emits NPC quips to guarantee exactly one per NPC each sprint.
// Mapping:
//  Ayla -> first hint (rs:hint) else ambient fallback after 20s
//  Polly -> first skip (rs:skip) else ambient fallback after 35s
//  Dominic -> first chamber solve (rs:chamber-solved) else ambient fallback after 25s
import { useEffect, useRef } from 'react';
import { emitNPCQuip, resetNPCSprint, hasNPCSpoken } from '../features/RS_NPCEvents';

export const RSNPCAutoQuips: React.FC = () => {
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const clearAll = () => { timers.current.forEach(t => clearTimeout(t)); timers.current = []; };
    const scheduleFallbacks = () => {
      // Ayla ambient fallback
      timers.current.push(window.setTimeout(() => { if (!hasNPCSpoken('ayla')) emitNPCQuip('ayla','ambient'); }, 20000));
      // Dominic ambient fallback
      timers.current.push(window.setTimeout(() => { if (!hasNPCSpoken('dominic')) emitNPCQuip('dominic','ambient'); }, 25000));
      // Polly ambient fallback
      timers.current.push(window.setTimeout(() => { if (!hasNPCSpoken('polly')) emitNPCQuip('polly','ambient'); }, 35000));
    };
    const onStart = () => { resetNPCSprint(); clearAll(); scheduleFallbacks(); };
    const onHint = () => { emitNPCQuip('ayla','offer_hint'); };
    const onSkip = () => { emitNPCQuip('polly','assist'); };
    const onSolve = () => { emitNPCQuip('dominic','ambient'); };
    const onEnd = () => { clearAll(); };
    document.addEventListener('rs:start', onStart as any);
    document.addEventListener('rs:hint', onHint as any);
    document.addEventListener('rs:skip', onSkip as any);
    document.addEventListener('rs:chamber-solved', onSolve as any);
    document.addEventListener('rs:end', onEnd as any);
    return () => {
      document.removeEventListener('rs:start', onStart as any);
      document.removeEventListener('rs:hint', onHint as any);
      document.removeEventListener('rs:skip', onSkip as any);
      document.removeEventListener('rs:chamber-solved', onSolve as any);
      document.removeEventListener('rs:end', onEnd as any);
      clearAll();
    };
  }, []);
  return null;
};

export default RSNPCAutoQuips;
