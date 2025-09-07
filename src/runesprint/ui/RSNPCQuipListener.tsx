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

// RSNPCQuipListener.tsx – listens for rs:npc-quip events and renders toasts
import React, { useEffect, useState } from 'react';
import { Toast } from '../../components/ui';

interface NPCQuipToast { id: string; msg: string; npc: string; }

export const RSNPCQuipListener: React.FC = () => {
  const [toasts, setToasts] = useState<NPCQuipToast[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const d = (e as CustomEvent).detail;
      if (!d) return;
      const id = `npc-${d.id}`;
      setToasts(prev => [ { id, msg: `${d.npc.toUpperCase()}: ${d.quip}`, npc: d.npc }, ...prev ].slice(0,6));
    };
    document.addEventListener('rs:npc-quip', handler as any);
    return () => document.removeEventListener('rs:npc-quip', handler as any);
  }, []);

  const dismiss = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-4 right-4 z-[1080] flex flex-col gap-2 w-[300px]">
      {toasts.map(t => (
        <Toast
          key={t.id}
          id={t.id}
          type="info"
          message={<span className="text-[11px] leading-snug">{t.msg}</span>}
          duration={5000}
          dismissible
          onDismiss={dismiss}
        />
      ))}
    </div>
  );
};

export default RSNPCQuipListener;
