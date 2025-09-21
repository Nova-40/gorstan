import React, { useEffect, useRef } from 'react';
import MenuCard from '../ui/MenuCard';
import UIButton from '../ui/Button';

interface PauseMenuProps {
  isOpen: boolean;
  onResume: () => void;
  onSave: () => void;
  onLoad: () => void;
  onOptions: () => void;
  onQuitToMain: () => void;
}

const PauseMenu: React.FC<PauseMenuProps> = ({ isOpen, onResume, onSave, onLoad, onOptions, onQuitToMain }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const prev = document.activeElement as HTMLElement | null;
    // Focus the container so keyboard users land inside the dialog
    containerRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const container = containerRef.current;
      if (!container) return;
      const focusable = container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) {
        e.preventDefault();
        container.focus();
        return;
      }
      const first = focusable[0] as HTMLElement | undefined;
      const last = focusable[focusable.length - 1] as HTMLElement | undefined;
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first || active === container) {
          e.preventDefault();
          if (last) last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          if (first) first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (prev) prev.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-60">
      <div ref={containerRef} tabIndex={-1} className="w-full max-w-md p-4">
        <MenuCard title="Paused">
          <div className="space-y-3 p-3">
            <UIButton onClick={onResume} variant="primary">Resume</UIButton>
            <UIButton onClick={onSave} variant="secondary">Save Game</UIButton>
            <UIButton onClick={onLoad} variant="ghost">Load Game</UIButton>
            <UIButton onClick={onOptions} variant="ghost">Options</UIButton>
            <UIButton onClick={onQuitToMain} variant="secondary">Quit to Main Menu</UIButton>
          </div>
        </MenuCard>
      </div>
    </div>
  );
};

export default PauseMenu;
