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

interface Book { slug: string; title: string; hook: string; url: string; cover?: string; }
const books: Book[] = [
  { slug: 'findlaters-corner', title: "Findlater's Corner", hook: 'Origins of the Gorstan anomaly.', url: 'https://example.com/findlaters-corner', cover: '/images/Books/findlaters.cover.png' },
  { slug: 'quantum-lattice', title: 'Quantum Lattice', hook: 'Physics fractures & ethical AI.', url: 'https://example.com/quantum-lattice', cover: '/images/Books/quantum.lattice.cover.png' },
  { slug: 'author-site', title: 'GeoffWebsterBooks', hook: 'Explore the full catalogue.', url: 'https://example.com/geoffwebsterbooks', cover: '/images/geoff_webster_headshot.jpg' }
];

export const BooksPromo: React.FC = () => (
  <section id="books" className="py-16 px-4 bg-zinc-900 text-white">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-8">Books of Gorstan</h2>
  <p className="text-zinc-300 mb-8 max-w-3xl">Love the world? Dive deeper in the books — explore <em>Findlater's Corner</em>, <em>Quantum Lattice</em>, and more on GeoffWebsterBooks.</p>
      <div className="grid md:grid-cols-4 gap-6">
        {books.map(b => (
          <a key={b.slug} href={b.url} target="_blank" rel="noopener noreferrer" aria-label={`Read ${b.title} on external site`} onClick={()=>track('books_click', { slug: b.slug, source: 'books_section' })} className="group p-4 rounded-lg bg-zinc-800/60 border border-zinc-700 hover:border-amber-500 focus:outline-none focus-visible:ring ring-amber-400 flex flex-col gap-2">
            <div className="aspect-[3/4] w-full rounded overflow-hidden bg-gradient-to-br from-zinc-700 to-zinc-900">
              {b.cover ? (
                <img 
                  src={b.cover} 
                  alt={`${b.title} book cover`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400">Cover</div>
              )}
            </div>
            <h3 className="font-semibold text-amber-300 group-hover:text-amber-200">{b.title}</h3>
            <p className="text-xs text-zinc-400 flex-1">{b.hook}</p>
            <span className="text-amber-400 text-xs font-medium">Read more →</span>
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default BooksPromo;
