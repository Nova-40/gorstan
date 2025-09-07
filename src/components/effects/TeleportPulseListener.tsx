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

import React, { useEffect, useState } from 'react';
import { TeleportPulse } from '../../design/motion/TeleportPulse';

interface PulseEvent { id: number; mode: 'fractal' | 'trek'; created: number; }

export const TeleportPulseListener: React.FC = () => {
  const [events, setEvents] = useState<PulseEvent[]>([]);
  useEffect(() => {
    let idCounter = 0;
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail || {};
      setEvents(prev => [...prev, { id: ++idCounter, mode: detail.mode || 'trek', created: Date.now() }]);
    };
    document.addEventListener('ui:teleport', handler as any);
    const gc = setInterval(() => {
      const now = Date.now();
      setEvents(prev => prev.filter(p => now - p.created < 800));
    }, 400);
    return () => { document.removeEventListener('ui:teleport', handler as any); clearInterval(gc); };
  }, []);
  if (!events.length) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 520 }} aria-hidden>
      {events.map(ev => (
        <TeleportPulse key={ev.id} active size={ev.mode === 'fractal' ? 220 : 160} style={{ mixBlendMode: ev.mode === 'fractal' ? 'screen' : 'overlay' }} />
      ))}
    </div>
  );
};

export default TeleportPulseListener;