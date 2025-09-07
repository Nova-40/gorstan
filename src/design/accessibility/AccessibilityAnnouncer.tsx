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

import React, { useEffect, useRef } from 'react';
import { ScreenReaderSupport } from '../../utils/accessibility';

interface Props { enabled: boolean; }

// Listens to key game CustomEvents and announces concise updates when enabled.
export const AccessibilityAnnouncer: React.FC<Props> = ({ enabled }) => {
  const srRef = useRef<ScreenReaderSupport | null>(null);
  const lastLowTimeRef = useRef<number | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => { if (!srRef.current) srRef.current = new ScreenReaderSupport(); }, []);

  useEffect(() => {
    if (!enabled || !srRef.current) return;
    if (mountedRef.current) {
      (srRef.current as any)?.announceStatus?.('Accessibility announcements active');
    }
    mountedRef.current = true;

    const announce = (msg: string, assertive = false) => {
      if (!srRef.current) return; assertive ? srRef.current.announceError(msg) : srRef.current.announceSuccess(msg);
    };

    const onRSTick = (e: Event) => {
      const d = (e as CustomEvent).detail || {}; if (typeof d.timeRemaining !== 'number') return;
      const sec = Math.floor(d.timeRemaining / 1000);
      if (sec <= 10 && sec >= 0 && lastLowTimeRef.current !== sec) {
        lastLowTimeRef.current = sec;
        announce(`Rune Sprint ${sec} seconds remaining`, sec <= 3);
      }
    };
    const onRSStart = (e: Event) => {
      const d = (e as CustomEvent).detail || {}; lastLowTimeRef.current = null; announce('Rune Sprint started'); if (d.time) announce(`${Math.floor(d.time/1000)} seconds`); };
    const onRSEnd = (e: Event) => { const d = (e as CustomEvent).detail || {}; announce(`Rune Sprint ended: ${d.outcome || 'unknown'}`, true); };
    const onTeleport = (e: Event) => { const d = (e as CustomEvent).detail || {}; announce(`Teleport ${d.mode || 'move'}`); };
    const onTrialsFail = (e: Event) => { const d = (e as CustomEvent).detail || {}; announce(`Trial failed: ${d.reason || 'unknown'}`, true); };
    const onArtifactUnlock = (e: Event) => { const d = (e as CustomEvent).detail || {}; if (d.id) announce(`Artifact unlocked: ${d.id}`); };
  const onHealth = (e: Event) => { const d = (e as CustomEvent).detail || {}; if (typeof d.current === 'number' && typeof d.delta === 'number') { announce(`Health ${d.delta>0?'+'+d.delta:d.delta} now ${d.current}`); } };
  const onInventory = (e: Event) => { const d = (e as CustomEvent).detail || {}; if (typeof d.size === 'number') { announce(`Inventory ${d.action==='added'?'+' : ''}${d.diff} (${d.size})`); } };

    document.addEventListener('rs:tick', onRSTick as any);
    document.addEventListener('rs:start', onRSStart as any);
    document.addEventListener('rs:end', onRSEnd as any);
    document.addEventListener('ui:teleport', onTeleport as any);
    document.addEventListener('trials:fail', onTrialsFail as any);
    document.addEventListener('trials:artifact-unlock', onArtifactUnlock as any);
    document.addEventListener('a11y:health-change', onHealth as any);
    document.addEventListener('a11y:inventory-change', onInventory as any);
    return () => {
      document.removeEventListener('rs:tick', onRSTick as any);
      document.removeEventListener('rs:start', onRSStart as any);
      document.removeEventListener('rs:end', onRSEnd as any);
      document.removeEventListener('ui:teleport', onTeleport as any);
      document.removeEventListener('trials:fail', onTrialsFail as any);
      document.removeEventListener('trials:artifact-unlock', onArtifactUnlock as any);
      document.removeEventListener('a11y:health-change', onHealth as any);
      document.removeEventListener('a11y:inventory-change', onInventory as any);
    };
  }, [enabled]);

  return null;
};

export default AccessibilityAnnouncer;
