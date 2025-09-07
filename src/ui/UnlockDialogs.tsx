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
import { useGate } from '@/state/GateContext';
import { verifyBetaCode, connectPatreon } from '@/services/unlock';
import { GameMode } from '@/types/game';

export const BetaCodeDialog: React.FC = () => {
  const { setUnlock, setMode } = useGate() as any; // Gate context includes setMode
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string|null>(null);

  useEffect(() => {
    const openH = () => setOpen(true);
    const closeH = () => setOpen(false);
    addEventListener('open-beta-dialog', openH as any);
    addEventListener('close-dialogs', closeH as any);
    return () => { removeEventListener('open-beta-dialog', openH as any); removeEventListener('close-dialogs', closeH as any); };
  }, []);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center bg-black/70">
      <div className="bg-slate-900 border border-emerald-600/40 rounded-lg p-6 w-full max-w-sm font-mono shadow-xl">
        <h3 className="text-lg mb-3 text-emerald-300 tracking-wide">Enter Beta Code</h3>
  <input className="w-full mb-3 px-3 py-2 rounded bg-slate-800 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-400" value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="GOR-ABCDEFGH" maxLength={20} />
        <div className="flex gap-2">
          <button disabled={busy || !code} onClick={async ()=>{
            setBusy(true); setErr(null);
            const res = await verifyBetaCode(code);
            setBusy(false);
            if (res.isUnlocked) {
              setUnlock(res);
              // Enter full game immediately after unlock.
              setMode && setMode(GameMode.FULL);
              setOpen(false);
              dispatchEvent(new CustomEvent('close-dialogs'));
            }
            else setErr('Invalid or exhausted code.');
          }} className="flex-1 px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40">Unlock</button>
          <button onClick={()=>setOpen(false)} className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600">Cancel</button>
        </div>
        {err && <div className="mt-3 text-sm text-red-400">{err}</div>}
        {busy && <div className="mt-3 text-xs text-emerald-300 animate-pulse">Verifying…</div>}
      </div>
    </div>
  );
};

export const PatreonDialog: React.FC = () => {
  const { setUnlock } = useGate();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const openH = () => setOpen(true);
    const closeH = () => setOpen(false);
    addEventListener('open-patreon-dialog', openH as any);
    addEventListener('close-dialogs', closeH as any);
    return () => { removeEventListener('open-patreon-dialog', openH as any); removeEventListener('close-dialogs', closeH as any); };
  }, []);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center bg-black/70">
      <div className="bg-slate-900 border border-pink-500/40 rounded-lg p-6 w-full max-w-sm font-mono shadow-xl">
        <p className="text-pink-300 mb-4">Link Patreon to unlock the full lattice.</p>
        <div className="flex gap-2">
          <button disabled={busy} onClick={async ()=>{ setBusy(true); const res = await connectPatreon(); setBusy(false); if (res.isUnlocked) { setUnlock(res); setOpen(false); dispatchEvent(new CustomEvent('close-dialogs')); } }} className="flex-1 px-4 py-2 rounded bg-pink-600 hover:bg-pink-500 disabled:opacity-40">Link Patreon</button>
          <button onClick={()=>setOpen(false)} className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600">Cancel</button>
        </div>
        {busy && <div className="mt-3 text-xs text-pink-300 animate-pulse">Connecting…</div>}
      </div>
    </div>
  );
};
