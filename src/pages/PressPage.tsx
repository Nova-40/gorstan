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
import { PageHeader } from '../components/shared/PageHeader';

export const PressPage: React.FC = () => (
  <div className="min-h-screen bg-zinc-900 text-white py-16 px-4">
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Press Release" />
      
      <div className="prose prose-zinc prose-invert max-w-none">
        <div className="bg-zinc-800 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold text-amber-400 mb-4">FOR IMMEDIATE RELEASE</h2>
          <p className="text-zinc-400 mb-2">Gorstan Interactive Fiction Experience</p>
          <p className="text-zinc-400">Contact: gorstan@geoffwebsterbooks.com</p>
        </div>

        <h2>Revolutionary Interactive Fiction Game "Gorstan" Launches, Blending Classic Text Adventures with Modern AI Technology</h2>
        
        <p className="text-lg text-zinc-300 italic">
          <strong>New web-based game combines the depth of traditional interactive fiction with cutting-edge AI-powered NPCs and dynamic storytelling</strong>
        </p>

        <p>
          Gorstan, an innovative interactive fiction experience, has launched as a groundbreaking fusion of classic text-based gaming and modern web technology. Created by author and developer Geoff Webster, Gorstan represents a new evolution in digital storytelling.
        </p>

        <h3>Game Features & Innovation</h3>
        <p>
          Unlike traditional text adventures, Gorstan features AI-powered non-player characters that respond dynamically to player interactions, creating unique conversations and story branches. The game includes:
        </p>
        
        <ul>
          <li>Intelligent NPCs with personality-driven dialogue systems</li>
          <li>Multiple difficulty paths catering to different player preferences</li>
          <li>Integrated puzzle mechanics and mini-games</li>
          <li>Comprehensive accessibility features</li>
          <li>Rich audio design and visual effects</li>
          <li>Cross-platform web compatibility</li>
        </ul>

        <h3>Expanding a Literary Universe</h3>
        <p>
          Gorstan builds upon the fictional universe established in Geoff Webster's novels, including "Findlater's Corner" and "Quantum Lattice." Players can explore familiar locations and encounter characters from the books while experiencing entirely new storylines.
        </p>

        <h3>Accessibility & Inclusivity</h3>
        <p>
          The game prioritizes accessibility with full screen reader support, keyboard navigation, and customizable display options. These features ensure that players of all abilities can enjoy the Gorstan experience.
        </p>

        <h3>About the Creator</h3>
        <p>
          Geoff Webster is an author and software developer whose work explores themes of reality, technology, and human consciousness. His novels and interactive experiences examine the intersection of science fiction and philosophical inquiry.
        </p>

        <h3>Availability</h3>
        <p>
          Gorstan is available to play in web browsers at the official website. The game offers both free content and premium features for enhanced gameplay experiences.
        </p>

        <h3>Media Contact</h3>
        <p>
          For interviews, review copies, or additional information, please contact:
          <br />
          Email: <a href="mailto:gorstan@geoffwebsterbooks.com" className="text-amber-400 hover:text-amber-300">gorstan@geoffwebsterbooks.com</a>
          <br />
          Website: <a href="https://geoffwebsterbooks.com" className="text-amber-400 hover:text-amber-300">geoffwebsterbooks.com</a>
        </p>

        <h3>Press Kit Assets</h3>
        <p>
          High-resolution screenshots, gameplay videos, and additional press materials are available upon request.
        </p>

        <div className="bg-zinc-800 p-4 rounded-lg mt-8">
          <p className="text-sm text-zinc-400 mb-0">
            <strong>Note to Editors:</strong> Gorstan represents a significant step forward in interactive fiction, demonstrating how classic gaming genres can be revitalized through modern technology while maintaining their core appeal to storytelling enthusiasts.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default PressPage;
