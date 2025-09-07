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

const features = [
  { title: 'Arcade combat', desc: 'Fast tactical fights against adaptive Shadows.' },
  { title: 'Puzzle depth', desc: 'Reset loops, extrapolators, layered logic.' },
  { title: 'Story intrigue', desc: 'Ethical choices & evolving AI companion.' },
  { title: 'Replay hooks', desc: 'Timed hints & smart skips keep pace.' },
  { title: 'Accessibility', desc: 'Text size, high contrast, reduced motion.' },
  { title: 'No grind', desc: 'Focused progression & smart checkpoints.' }
];

export const FeatureGrid: React.FC = () => (
  <section id="features" className="py-16 px-4 bg-gradient-to-b from-black to-zinc-900 text-white">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-10">Features</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map(f => (
          <div key={f.title} className="p-5 rounded-lg bg-zinc-800/60 border border-zinc-700 hover:border-amber-500 transition">
            <h3 className="font-semibold mb-2 text-amber-300">{f.title}</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeatureGrid;
