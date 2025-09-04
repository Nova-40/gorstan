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
// Blue button warning modal component.

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { RetroModal } from './ui/RetroModal';
import { Button } from './ui/Button';

interface BlueButtonWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BlueButtonWarningModal: React.FC<BlueButtonWarningModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <RetroModal
      isOpen
      onClose={onClose}
      title="⚠️ CRITICAL WARNING"
      subtitle="Reality Integrity Breach Imminent"
      widthClass="max-w-xl"
      footer={(
        <Button variant="danger" onClick={onClose} size="sm">I Understand The Consequences</Button>
      )}
    >
      <div className="relative border border-red-500/40 rounded-sm p-4 bg-black/40 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{background:"repeating-linear-gradient(0deg, rgba(255,0,0,0.05) 0 2px, transparent 2px 4px)"}} />
        <div className="flex items-center gap-2 mb-3 text-red-400">
          <AlertTriangle className="animate-pulse" size={20} />
          <span className="font-mono text-sm tracking-wide">DO NOT PRESS THIS BUTTON AGAIN</span>
        </div>
        <ul className="list-none m-0 p-0 space-y-2 font-mono text-xs">
          <li className="text-red-300">⚠️ MULTIVERSE STABILITY WARNING ⚠️</li>
          <li className="text-console">Pressing this button again will trigger a complete reality reset.</li>
          <li className="text-console">All progress will be lost. All timelines will be affected.</li>
          <li className="text-red-400 font-semibold pt-2">You have been warned.</li>
        </ul>
        <div className="mt-4 h-1 bg-red-600/40 overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 w-1/3 bg-red-500 animate-[scan_1.2s_linear_infinite]" />
        </div>
      </div>
      <style>{`@keyframes scan {0%{transform:translateX(-100%)}100%{transform:translateX(400%)}}`}</style>
    </RetroModal>
  );
};

export default BlueButtonWarningModal;
