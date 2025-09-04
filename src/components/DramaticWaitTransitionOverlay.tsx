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

interface DramaticWaitTransitionOverlayProps {
  isOpen: boolean;
  onClose?: () => void; // optional: may auto-close via parent logic
  message?: string;
}

const DramaticWaitTransitionOverlay: React.FC<DramaticWaitTransitionOverlayProps> = ({
  isOpen,
  onClose = () => {},
  message = 'Loading... Please wait.'
}) => (
  <RetroModal
    isOpen={isOpen}
    onClose={onClose}
    title="Transition"
    subtitle="Temporal recalibration in progress"
    widthClass="max-w-md"
  >
    <div className="font-mono text-sm flex flex-col items-center gap-4 py-4">
      <div className="w-full h-2 bg-black/40 rounded overflow-hidden">
        <div className="h-full w-1/2 bg-emerald-400/60 animate-pulse" />
      </div>
      <p className="m-0 opacity-80">{message}</p>
    </div>
  </RetroModal>
);

export default DramaticWaitTransitionOverlay;
