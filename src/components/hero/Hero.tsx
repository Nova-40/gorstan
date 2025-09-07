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
import { track } from '@/lib/analytics';

export const Hero: React.FC = () => {
  return (
    <section id="top" className="relative min-h-[60vh] flex items-center justify-center text-center text-white bg-gradient-to-b from-black via-zinc-900 to-black overflow-hidden">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,#444,#000)]" aria-hidden />
      <div className="max-w-3xl px-6 py-20 relative z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">Enter Gorstan. <span className="text-amber-400">Leave with stories.</span></h1>
        <p className="text-lg md:text-xl text-zinc-300 mb-8">A fast, story‑rich adventure: arcade fights, cunning puzzles, and choices that actually matter.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => { track('demo_start', { from: 'hero' }); document.dispatchEvent(new CustomEvent('open-game-shell', { detail: { mode: 'demo' } })); }} className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-8 py-3 rounded text-lg">Play the Demo</button>
          <button onClick={() => { track('reel_play', { from: 'hero' }); const el = document.getElementById('reel'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="border border-amber-400 text-amber-300 hover:bg-amber-500/10 px-8 py-3 rounded text-lg">Watch Highlights</button>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-zinc-400">
          <span>★★★★★ playtesters</span>
          <span>12‑minute demo</span>
          <span>No install</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
