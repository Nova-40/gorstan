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

/*
  LevelUpModal – displays level progression and rewards when player gains a quantum level
*/

import React, { useRef, useEffect } from 'react';
import { RetroModal } from './ui/RetroModal';
import { formatQuantumLevel } from '../utils/quantumMagicHelpers';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: number;
  totalXP: number;
  newFeatures?: string[];
  autoCloseMs?: number;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  onClose,
  level,
  totalXP,
  newFeatures = [],
  autoCloseMs
}) => {
  const continueButtonRef = useRef<HTMLButtonElement>(null);

  // Auto-focus and auto-close behavior
  useEffect(() => {
    if (isOpen) {
      continueButtonRef.current?.focus();
      if (autoCloseMs && autoCloseMs > 0) {
        const timer = setTimeout(onClose, autoCloseMs);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, onClose, autoCloseMs]);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const levelTitle = formatQuantumLevel(level);
  const hasFeatures = newFeatures.length > 0;

  return (
    <RetroModal
      isOpen={isOpen}
      onClose={onClose}
      title="Level Up!"
      widthClass="max-w-md"
    >
      <div className="space-y-4">
        {/* Level announcement */}
        <div className="text-center">
          <div className="mb-2">
            <span className="text-3xl" aria-hidden="true">✨</span>
          </div>
          <h3 className="text-xl font-bold text-green-300 mb-1">
            {levelTitle}
          </h3>
          <p className="text-green-200 text-sm">
            Level {level} • {totalXP.toLocaleString()} Total XP
          </p>
        </div>

        {/* New features unlocked */}
        {hasFeatures && (
          <div className="bg-gray-900/60 border border-green-700/40 rounded p-3">
            <h4 className="text-green-300 font-semibold mb-2 text-sm">New Abilities Unlocked:</h4>
            <ul className="space-y-1">
              {newFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-xs text-green-200">
                  <span className="text-green-400 mt-0.5" aria-hidden="true">•</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Progression encouragement */}
        <div className="text-center text-xs text-green-300/80">
          {level < 5 && "Keep exploring to unlock more quantum abilities."}
          {level >= 5 && level < 10 && "Your quantum mastery grows stronger."}
          {level >= 10 && level < 15 && "Few reach this level of quantum control."}
          {level >= 15 && "You have achieved legendary quantum mastery."}
        </div>

        {/* Action button */}
        <div className="text-center pt-2">
          <button
            ref={continueButtonRef}
            onClick={onClose}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded transition-colors font-medium text-sm"
          >
            Continue
          </button>
        </div>
      </div>
    </RetroModal>
  );
};

export default LevelUpModal;
