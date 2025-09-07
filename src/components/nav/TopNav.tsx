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

const sections = [
  { id: 'features', label: 'Features' },
  { id: 'reel', label: 'Trailer' },
  { id: 'demo', label: 'Demo' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'books', label: 'Books' },
  { id: 'faq', label: 'FAQ' },
  { id: 'roadmap', label: 'Roadmap' }
];

export const TopNav: React.FC = () => {
  const handleNav = (id: string) => {
    track('nav_click', { link: id });
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <nav className="sticky top-0 z-40 backdrop-blur bg-black/60 text-white flex items-center gap-6 px-4 h-14">
      <button onClick={() => handleNav('top')} className="font-bold tracking-wide text-lg">Gorstan</button>
      <div className="hidden md:flex gap-4 text-sm">
        {sections.map(s => (
          <button key={s.id} onClick={() => handleNav(s.id)} className="hover:text-amber-300 focus:outline-none focus-visible:ring ring-amber-400 rounded px-1">
            {s.label}
          </button>
        ))}
      </div>
      <div className="ml-auto flex gap-3">
        <button onClick={() => handleNav('demo')} className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-1 rounded">Play Demo</button>
        <button onClick={() => handleNav('unlock')} className="border border-amber-500 text-amber-300 hover:bg-amber-500/10 px-4 py-1 rounded">Unlock</button>
      </div>
    </nav>
  );
};

export default TopNav;
