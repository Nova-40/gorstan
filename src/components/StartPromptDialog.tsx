import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  open: boolean;
  onStart: () => void;
  onCancel: () => void;
}

/**
 * StartPromptDialog - Accessible modal following WAI-ARIA patterns
 */
export default function StartPromptDialog({ open, onStart, onCancel }: Props) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const startButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    }

    if (open) {
      lastActiveElement.current = document.activeElement as HTMLElement | null;
      document.addEventListener('keydown', onKey);
      setTimeout(() => startButtonRef.current?.focus(), 100);
    } else {
      document.removeEventListener('keydown', onKey);
      setTimeout(() => lastActiveElement.current?.focus(), 100);
    }

    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="start-dialog-title"
      >
        <motion.div className="absolute inset-0 bg-black bg-opacity-70" onClick={onCancel} />
        <motion.div
          ref={dialogRef}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className="relative bg-gradient-to-br from-slate-900 to-black border-2 border-cyan-400 rounded-xl p-6 max-w-md w-full"
        >
          <h2 id="start-dialog-title" className="text-xl font-bold text-cyan-300 mb-3">
            Ready to Begin?
          </h2>
          <p className="text-gray-300 mb-6 text-sm">Start your adventure or continue the demo.</p>
          <div className="flex gap-3 justify-end">
            <button
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors focus:ring-2 focus:ring-cyan-400"
              onClick={onCancel}
            >
              Continue Demo
            </button>
            <button
              ref={startButtonRef}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors focus:ring-2 focus:ring-green-400"
              onClick={onStart}
            >
              Start Game
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
