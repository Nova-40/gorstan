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

export const DocsPage: React.FC = () => (
  <div className="min-h-screen bg-zinc-900 text-white py-16 px-4">
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Gorstan Documentation" />
      <div className="prose prose-zinc prose-invert max-w-none">
        <h2>Getting Started</h2>
        <p>Welcome to Gorstan, an interactive fiction experience that blends text-based storytelling with modern gameplay mechanics.</p>
        
        <h2>Game Features</h2>
        <ul>
          <li><strong>Interactive Fiction:</strong> Navigate through richly detailed rooms and scenarios</li>
          <li><strong>NPC Interactions:</strong> Engage with AI-powered characters</li>
          <li><strong>Inventory System:</strong> Collect and use items throughout your journey</li>
          <li><strong>Puzzle Solving:</strong> Challenge yourself with integrated mini-games</li>
          <li><strong>Multiple Routes:</strong> Different difficulty paths and storylines</li>
        </ul>

        <h2>Controls</h2>
        <ul>
          <li><strong>Movement:</strong> Use the directional buttons or click room exits</li>
          <li><strong>Actions:</strong> Click action buttons or use keyboard shortcuts</li>
          <li><strong>Inventory:</strong> Press 'I' or click the inventory button</li>
          <li><strong>Help:</strong> Press 'H' for in-game help</li>
          <li><strong>Save/Load:</strong> Use the menu options to save your progress</li>
        </ul>

        <h2>Game World</h2>
        <p>Gorstan takes place in a unique universe where reality itself can be altered. Explore various zones:</p>
        <ul>
          <li><strong>Trent Park:</strong> The mysterious starting location</li>
          <li><strong>Teleportation Network:</strong> Fast travel between discovered locations</li>
          <li><strong>Glitch Realm:</strong> A digital dimension with unique properties</li>
          <li><strong>Shadow Fight Arena:</strong> Combat training and challenges</li>
        </ul>

        <h2>Accessibility</h2>
        <p>Gorstan includes comprehensive accessibility features:</p>
        <ul>
          <li>Screen reader support</li>
          <li>Keyboard navigation</li>
          <li>Adjustable font sizes</li>
          <li>Color contrast options</li>
          <li>Motion reduction settings</li>
        </ul>

        <h2>Technical Requirements</h2>
        <ul>
          <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
          <li>JavaScript enabled</li>
          <li>Local storage for save games</li>
          <li>Audio support for sound effects and music</li>
        </ul>

        <h2>Support</h2>
        <p>For technical support or questions about gameplay, please contact us at <a href="mailto:gorstan@geoffwebsterbooks.com" className="text-amber-400 hover:text-amber-300">gorstan@geoffwebsterbooks.com</a></p>
      </div>
    </div>
  </div>
);

export default DocsPage;
