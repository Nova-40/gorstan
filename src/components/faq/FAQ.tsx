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

const faqs = [
  { q: 'How long is the demo?', a: 'About 12 minutes with guided hints.' },
  { q: 'Controller support?', a: 'Keyboard + soon basic controller mapping.' },
  { q: 'Will my demo progress carry over?', a: 'Core unlocks yes; story choices may reset.' },
  { q: 'Which browsers?', a: 'Modern Chromium, Firefox, Safari latest.' },
  { q: 'Privacy?', a: 'Local saves only; minimal analytics events.' }
];

export const FAQ: React.FC = () => (
  <section id="faq" className="py-16 px-4 bg-zinc-900 text-white">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-8">FAQ</h2>
      <ul className="space-y-4">
        {faqs.map(f => (
          <li key={f.q} className="border-b border-zinc-700 pb-4">
            <h3 className="font-semibold text-amber-300">{f.q}</h3>
            <p className="text-sm text-zinc-300 mt-1">{f.a}</p>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default FAQ;
