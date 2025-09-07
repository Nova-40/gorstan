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

import React, { useEffect, useState, Suspense } from 'react';
import { useAccess } from '@/stores/access';
import { track } from '@/lib/analytics';

interface GameShellProps { mode: 'demo' | 'full'; onClose?: () => void; }

const LazyApp = React.lazy(() => import('@/App'));

// Placeholder modal containing where actual game canvas / AppCore embedding would mount (lazy split later)
export const GameShell: React.FC<GameShellProps> = ({ mode, onClose }) => {
  const { setAccess } = useAccess();
  const [elapsed, setElapsed] = useState(0);
  const limitMs = 12 * 60 * 1000; // 12 minutes
  const [showCountdownWarn, setShowCountdownWarn] = useState(false);
  // Silent periodic access refresh (every 4 minutes) for long sessions / full mode
  useEffect(() => {
    let active = true;
    const tick = async () => {
      if (!active) return;
      try { const evt = new CustomEvent('gorstan:access:refresh'); document.dispatchEvent(evt); } catch {}
      setTimeout(tick, 240000); // 4 min
    };
    tick();
    return () => { active = false; };
  }, []);
  useEffect(() => {
    const started = Date.now();
    const id = setInterval(() => {
      const e = Date.now() - started;
      setElapsed(e);
      if (mode === 'demo') {
        if (!showCountdownWarn && e > limitMs - 2*60*1000) setShowCountdownWarn(true);
      }
      if (mode === 'demo' && e >= limitMs) {
        track('demo_timeout', { elapsed: e });
        clearInterval(id);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [mode]);
  return (
    <div role="dialog" aria-label="Game" className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100]">
      <div className="w-[90vw] h-[80vh] border border-amber-500 rounded-lg p-4 flex flex-col text-white relative bg-zinc-950/90">
        <div className="flex items-center justify-between mb-2 text-sm gap-3">
          <span>Mode: {mode}</span>
          <div className="flex items-center gap-2 ml-auto">
            {mode==='full' && (
              (() => {
                const isSuperUser = (()=>{ try { return localStorage.getItem('gorstan.superuser')==='1'; } catch { return false; } })();
                if (!isSuperUser) return null;
                return (
                  <button
                    onClick={() => { try { document.dispatchEvent(new CustomEvent('debug:open')); } catch {} }}
                    className="px-2 py-1 rounded bg-fuchsia-700/30 hover:bg-fuchsia-600/40 text-fuchsia-200 border border-fuchsia-500/40 text-[11px] tracking-wide"
                    title="Open Debug Menu"
                    aria-label="Open Debug Menu"
                  >DEBUG</button>
                );
              })()
            )}
            <span className="text-xs opacity-90">{mode==='demo' ? `Time: ${(elapsed/1000)|0}s / ${limitMs/60000}m` : 'Full access'}</span>
            <button onClick={onClose} className="text-amber-400 hover:text-amber-200">Close</button>
          </div>
        </div>
        <div className="flex-1 relative overflow-hidden rounded bg-black/40">
          <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-zinc-500 text-sm">Loading game…</div>}>
            <LazyApp />
          </Suspense>
        </div>
        {mode==='demo' && showCountdownWarn && elapsed < limitMs && (
          <div className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">Remaining: {Math.max(0, Math.ceil((limitMs - elapsed)/1000))}s</div>
        )}
        {mode==='demo' && elapsed >= limitMs && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="p-6 rounded bg-zinc-800 text-center space-y-4">
              <p className="font-semibold text-amber-300">Demo time expired.</p>
              <button onClick={()=> setAccess({ state: 'locked' })} className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2 rounded">Unlock Options</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameShell;
