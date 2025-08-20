/**
 * Start Prompt Dialog - Accessible confirmation dialog for demo initiation
 * Follows WAI-ARIA modal patterns with focus management
 */

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StartPromptDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
}

export const StartPromptDialog: React.FC<StartPromptDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title = "Start Enhanced Demo?",
  message = "This will guide you through Gorstan's key features with progressive tutorials. You can exit anytime by pressing ESC."
}) => {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      confirmButtonRef.current?.focus();
      
      // Focus trap
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          const focusableElements = dialogRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements?.[0] as HTMLElement;
          const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement;

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement?.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement?.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleTabKey);
      return () => document.removeEventListener('keydown', handleTabKey);
    }
  }, [isOpen]);

  // ESC key handling
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onCancel}
        role="dialog"
        aria-labelledby="demo-dialog-title"
        aria-describedby="demo-dialog-description"
        aria-modal="true"
      >
        <motion.div
          ref={dialogRef}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-600 rounded-lg shadow-2xl max-w-md w-full p-6"
          onClick={e => e.stopPropagation()}
        >
          <div className="text-center space-y-4">
            {/* Icon */}
            <div className="mx-auto w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎮</span>
            </div>

            {/* Title */}
            <h2 
              id="demo-dialog-title"
              className="text-xl font-semibold text-slate-100"
            >
              {title}
            </h2>

            {/* Message */}
            <p 
              id="demo-dialog-description"
              className="text-slate-300 text-sm leading-relaxed"
            >
              {message}
            </p>

            {/* Features list */}
            <div className="text-left space-y-2 bg-slate-700/30 rounded p-3">
              <div className="text-sm font-medium text-slate-200">Demo includes:</div>
              <ul className="text-xs text-slate-400 space-y-1 ml-4">
                <li>• Room exploration with guided tips</li>
                <li>• Inventory and item interaction</li>
                <li>• Combat system demonstration</li>
                <li>• AI NPC conversations</li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded border border-slate-600 transition-colors duration-200"
                type="button"
              >
                Cancel
              </button>
              <button
                ref={confirmButtonRef}
                onClick={onConfirm}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-blue-50 rounded font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                type="button"
              >
                Start Demo
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StartPromptDialog;
