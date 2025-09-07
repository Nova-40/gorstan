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

const now = ['Core loop polish', 'Accessibility depth', 'Demo funnel'];
const next = ['Chapter expansion', 'Advanced combat AI', 'Mini boss variants'];
const later = ['Co-op prototype', 'Console packaging', 'Mod hooks'];

export const Roadmap: React.FC = () => (
  <section id="roadmap" className="py-16 px-4 bg-black text-white">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-10">Roadmap</h2>
      <div className="grid md:grid-cols-3 gap-8 text-sm">
        <div><h3 className="font-semibold text-amber-300 mb-2">Now</h3><ul className="space-y-1">{now.map(i=> <li key={i}>• {i}</li>)}</ul></div>
        <div><h3 className="font-semibold text-amber-300 mb-2">Next</h3><ul className="space-y-1">{next.map(i=> <li key={i}>• {i}</li>)}</ul></div>
        <div><h3 className="font-semibold text-amber-300 mb-2">Later</h3><ul className="space-y-1">{later.map(i=> <li key={i}>• {i}</li>)}</ul></div>
      </div>
    </div>
  </section>
);

export default Roadmap;
