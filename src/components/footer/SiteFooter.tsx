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

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: 'Docs', href: '#docs' },
  { label: 'Press', href: '#press' },
  { label: 'Contact', href: '#contact' },
  { label: 'Legal', href: '#legal' },
  { label: 'Credits', href: '#credits' }
];

export const SiteFooter: React.FC = () => (
  <footer className="py-12 px-4 bg-black text-zinc-500 text-sm mt-auto">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 md:items-center">
      <div className="flex-1">© {new Date().getFullYear()} Gorstan. All Rights Reserved.</div>
      <nav className="flex flex-wrap gap-4">
        {navLinks.map(link => (
          <a 
            key={link.label} 
            href={link.href} 
            className="hover:text-amber-400 transition-colors"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  </footer>
);

export default SiteFooter;
