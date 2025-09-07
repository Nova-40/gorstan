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

import React, { useState } from 'react';
import { useAccess } from '@/stores/access';
import { track } from '@/lib/analytics';

export const DemoLauncher: React.FC = () => {
  const { access } = useAccess();
  const [difficulty, setDifficulty] = useState(()=> localStorage.getItem('gor.demo.diff') || 'Normal');
  const [hints, setHints] = useState(()=> localStorage.getItem('gor.demo.hints') || 'Guided');
  const [skips, setSkips] = useState(()=> Number(localStorage.getItem('gor.demo.skips') || 2));

  const startDemo = () => {
    track('demo_start', { difficulty, hints, skips });
    try {
      localStorage.setItem('gor.demo.diff', difficulty);
      localStorage.setItem('gor.demo.hints', hints);
      localStorage.setItem('gor.demo.skips', String(skips));
    } catch {/* ignore */}
    document.dispatchEvent(new CustomEvent('open-game-shell', { detail: { mode: access.state === 'patreon' || access.state === 'beta' ? 'full' : 'demo' } }));
  };

  return (
    <section id="demo" className="py-16 px-4 bg-black text-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Try the Demo</h2>
        <p className="text-zinc-300 mb-6">Try a guided 12‑minute slice. No account. No install.</p>
        <form onSubmit={e => { e.preventDefault(); startDemo(); }} className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <label className="flex flex-col gap-1">Difficulty
              <select value={difficulty} onChange={e=>setDifficulty(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded p-2">
                {['Story','Normal','Veteran'].map(d=> <option key={d}>{d}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1">Hints
              <select value={hints} onChange={e=>setHints(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded p-2">
                {['Guided','Timed','Off'].map(h=> <option key={h}>{h}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1">Skips
              <input type="number" value={skips} min={0} max={5} onChange={e=>setSkips(Number(e.target.value))} className="bg-zinc-800 border border-zinc-700 rounded p-2" />
            </label>
          </div>
          <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-6 py-3 rounded">Start Demo</button>
          {access.state !== 'locked' && <span className="ml-4 text-sm text-amber-300">Access: {access.state}</span>}
        </form>
        <p className="mt-4 text-xs text-zinc-500">Saves persist locally; privacy friendly.</p>
      </div>
    </section>
  );
};

export default DemoLauncher;
