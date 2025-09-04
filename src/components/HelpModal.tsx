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


import React from 'react';
import { RetroModal } from './ui/RetroModal';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => (
  <RetroModal
    isOpen={isOpen}
    onClose={onClose}
    title="Help"
    subtitle="Quick reference"
    widthClass="max-w-lg"
  >
    <div className="space-y-2 text-sm font-mono">
      <p className="m-0">Explore rooms, pick up items, and talk to NPCs to uncover Gorstan's secrets.</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Movement: Use on-screen travel menu</li>
        <li>Inventory: Open inventory modal to review items</li>
        <li>Conversation: Select an NPC to begin dialogue</li>
        <li>Save: Use the save game modal to preserve progress</li>
      </ul>
      <p className="m-0 text-xs opacity-70">Press Escape to close.</p>
    </div>
  </RetroModal>
);

export default HelpModal;
