/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Ayla's Hint Popup - Cosmic guidance overlay
*/

import React, { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';
import type { AylaHintResponse } from '../services/aylaHintSystem';

interface AylaHintPopupProps {
  hint: AylaHintResponse | null;
  onDismiss: () => void;
  onTalkToAyla?: () => void;
}

const AylaHintPopup: React.FC<AylaHintPopupProps> = ({ hint, onDismiss, onTalkToAyla }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (hint) {
      setIsVisible(true);
      setIsAnimating(true);

      // Auto-dismiss after 15 seconds for low urgency hints
      if (hint.urgency === 'low') {
        const timer = setTimeout(() => {
          handleDismiss();
        }, 15000);

        return () => clearTimeout(timer);
      }
    }
  }, [hint]);

  const handleDismiss = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss();
    }, 300);
  };

  const getUrgencyColors = (urgency: AylaHintResponse['urgency']) => {
    switch (urgency) {
      case 'high':
        return 'border-purple-400/70 bg-purple-950/95';
      case 'medium':
        return 'border-blue-400/70 bg-slate-950/95';
      case 'low':
        return 'border-indigo-400/70 bg-slate-950/95';
      default:
        return 'border-blue-400/70 bg-slate-950/95';
    }
  };

  const getHintIcon = (hintType: AylaHintResponse['hintType']) => {
    switch (hintType) {
      case 'navigation':
        return '🧭';
      case 'puzzle':
        return '🧩';
      case 'interaction':
        return '💬';
      case 'safety':
        return '⚠️';
      case 'story':
        return '📖';
      default:
        return '✨';
    }
  };

  if (!hint || !isVisible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-24 right-3 z-50 flex justify-end">
      <div
        className={`pointer-events-auto w-[min(22rem,calc(100vw-1.5rem))] transform transition-all duration-300 ${
          isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        }`}
      >
        <div
          className={`${getUrgencyColors(hint.urgency)} overflow-hidden rounded-2xl border shadow-2xl backdrop-blur`}
        >
          <div className="flex items-start gap-3 p-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-500/15 text-green-300">
              <Sparkles size={16} />
            </div>
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Ayla</h3>
                    <p className="text-[11px] uppercase tracking-wide text-green-300/80">
                      {getHintIcon(hint.hintType)} {hint.hintType} hint
                    </p>
                  </div>
                  <button
                    onClick={handleDismiss}
                    aria-label="Dismiss Ayla hint"
                    title="Dismiss Ayla hint"
                    className="rounded-full p-1 text-green-100/70 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-green-50">{hint.hintText}</p>
                {hint.followUp && (
                  <p className="mt-2 text-xs italic text-green-200/75">{hint.followUp}</p>
                )}
                <div className="mt-3 flex gap-2">
                  {onTalkToAyla && (
                    <button
                      onClick={() => {
                        handleDismiss();
                        onTalkToAyla();
                      }}
                      className="rounded-lg bg-green-700 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-600"
                    >
                      Talk to Ayla
                    </button>
                  )}
                  <button
                    onClick={handleDismiss}
                    className="rounded-lg border border-green-700/70 px-3 py-1.5 text-xs font-medium text-green-100 transition-colors hover:bg-green-950"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AylaHintPopup;
