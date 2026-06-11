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

// src/seasonal/overlays/EasterOverlay.tsx
// Gorstan Game Beta 1
// Easter seasonal overlay with accessibility

import React from 'react';
import BaseDialog from '../a11y/BaseDialog';

export interface EasterOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * EasterOverlay - Spring Easter celebration overlay
 *
 * Features:
 * - Accessible dialog with focus management
 * - Motion-safe animations
 * - Easter themed content
 * - ESC key handling
 */
export const EasterOverlay: React.FC<EasterOverlayProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <BaseDialog onClose={onClose} title="🐰 Easter Celebration">
      <div className="seasonal-content">
        <div className="seasonal-icon text-3xl mb-4">🐰🥚🌷</div>
        <h2 className="text-xl font-bold mb-4">Happy Easter!</h2>
        <p className="mb-4">
          Spring has arrived in Gorstan! A time of renewal, discovery, and new beginnings. Like
          hidden Easter eggs waiting to be found, mysteries await your discovery throughout the game
          world.
        </p>
        <p className="mb-6 italic">May your journey be filled with wonder and surprise! 🌸</p>
        <button
          className="seasonal-close-btn px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold"
          onClick={onClose}
          autoFocus
        >
          Continue Adventure
        </button>
      </div>
    </BaseDialog>
  );
};
