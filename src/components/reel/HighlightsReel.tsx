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
import { track } from '@/lib/analytics';

interface Clip { id: string; title: string; caption: string; poster?: string; src?: string; }
const clips: Clip[] = [
  { id: 'shadows', title: 'Shadow Fight', caption: 'Intense combat encounters against formless shadow creatures.', poster: '/images/rooms/shadow fight.png' },
  { id: 'teleport', title: 'Teleportation', caption: 'Traverse dimensions with mysterious teleportation powers.', poster: '/images/rooms/teleportation_mystery.gif' },
  { id: 'glitchrealm', title: 'Glitch Realm', caption: 'Where reality breaks down and digital corruption reigns.', poster: '/images/rooms/glitchrealm_glitchrealmhub.png' },
  { id: 'trentpark', title: 'Trent Park', caption: 'A mysterious London location harboring dimensional secrets.', poster: '/images/rooms/mystery_trent_park.png' },
  { id: 'crossing', title: 'Quantum Lattice', caption: 'Dimensional intersections where realities converge.', poster: '/images/rooms/introzone_crossing.gif' }
];

export const HighlightsReel: React.FC = () => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex(i => (i + 1) % clips.length), 4000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => { if (clips[index]) track('reel_play', { clipId: clips[index].id }); }, [index]);
  const current = clips[index] ?? clips[0];
  return (
    <section id="reel" className="bg-black text-white py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Highlights</h2>
        <div className="relative aspect-video bg-zinc-800 rounded-lg overflow-hidden">
          <div className="absolute inset-0">
            <img
              key={current?.id || 'fallback'}
              src={current?.poster || '/images/fallback.png'}
              alt={current?.title || 'Game highlight'}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/fallback.png";
              }}
            />
          </div>
          <div className="absolute bottom-2 left-2 bg-black/70 px-3 py-1 rounded text-xs text-amber-300">{current?.title || 'Loading...'}</div>
          <div className="absolute bottom-2 right-2 bg-black/70 px-3 py-1 rounded text-xs text-white max-w-md">{current?.caption || ''}</div>
          <div className="sr-only" aria-live="polite">{current?.caption}</div>
        </div>
        <div className="flex gap-2 justify-center mt-4">
          {clips.map((c,i)=>(
            <button key={c.id} aria-label={`Show clip ${c.title}`} onClick={()=>setIndex(i)} className={`w-3 h-3 rounded-full ${i===index?'bg-amber-400':'bg-zinc-600 hover:bg-zinc-500'}`} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HighlightsReel;
