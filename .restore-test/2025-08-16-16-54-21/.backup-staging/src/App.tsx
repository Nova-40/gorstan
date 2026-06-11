/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  You may play Gorstan for free for personal entertainment only.
  You may NOT copy, redistribute, modify, or sell the game, its code, 
  artwork, storyline, or any other part without written permission.
  
  Gorstan includes third-party libraries and assets:
    - React © Meta Platforms, Inc. – MIT Licence
    - Lucide Icons © Lucide Contributors – ISC Licence
    - Flaticon icons © Flaticon.com – Free Licence with attribution
    - Other packages under their respective licences (see package.json)

  Full licence terms: see EULA.md in the project root.
*/

// Gorstan and characters (c) Geoff Webster 2025
// Game module.

import AppCore from './components/AppCore';
import { MagicSystem } from './engine/MagicSystem';
import unlockMagicQuest from './quests/unlockMagicQuest';
import { lazyFeature, LazyWrapper, LazyErrorBoundary } from './utils/lazyLoading';

import React, { useState } from 'react';

import { GameStateProvider } from './state/gameState';

// Lazy load the MagicModal since it's only shown conditionally
const MagicModal = lazyFeature(() => import('./ui/MagicModal.js'));

const App: React.FC = () => {
  const [isMagicModalOpen, setMagicModalOpen] = useState(false);
  const magicSystem = new MagicSystem(100); // Initialize with 100 mana

  magicSystem.addSpell({
    id: 'fireball',
    name: 'Fireball',
    description: 'A powerful ball of fire that burns enemies.',
    manaCost: 20,
    effect: (target) => console.log('Fireball hits', target),
  });

  magicSystem.addSpell({
    id: 'heal',
    name: 'Heal',
    description: 'Restores health to the target.',
    manaCost: 15,
    effect: (target) => console.log('Heal applied to', target),
  });

  magicSystem.addSpell({
    id: 'dispelBarrier',
    name: 'Dispel Barrier',
    description: 'Removes magical barriers blocking your path.',
    manaCost: 30,
    effect: (target) => {
      if (target.id === 'magicBarrier') {
        console.log('The magical barrier dissipates!');
      } else {
        console.log('Nothing happens.');
      }
    },
  });

  // Example: Add the unlockMagicQuest to the game state or quest system
  console.log('Quest Loaded:', unlockMagicQuest);

  // JSX return block or main return
  return (
    <GameStateProvider>
      <AppCore />
      <button onClick={() => setMagicModalOpen(true)}>Open Magic System</button>
      {isMagicModalOpen && (
        <LazyErrorBoundary>
          <LazyWrapper fallback={<div className="p-4">Loading Magic System...</div>}>
            <MagicModal magicSystem={magicSystem} onClose={() => setMagicModalOpen(false)} />
          </LazyWrapper>
        </LazyErrorBoundary>
      )}
    </GameStateProvider>
  );
};

export default App;
