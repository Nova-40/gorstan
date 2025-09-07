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

import React from 'react';
import { cn } from '../../utils/cn';

export interface RetroModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string | null;
  children: React.ReactNode;
  footer?: React.ReactNode;
  widthClass?: string; // allow width override
  className?: string;
}

export const RetroModal: React.FC<RetroModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle = null,
  children,
  footer,
  widthClass = 'max-w-3xl',
  className
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1200]" role="presentation">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 flex items-start justify-center p-4 overflow-y-auto">
        <div
          className={cn('retro-panel w-full', widthClass, className)}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'retro-modal-title' : undefined}
          aria-describedby={subtitle ? 'retro-modal-subtitle' : undefined}
        >
          {(title || subtitle) && (
            <header className="mb-4">
              {title && <h2 id="retro-modal-title" className="panel-heading glow-text text-base m-0">{title}</h2>}
              {subtitle && <p id="retro-modal-subtitle" className="panel-subtle mt-1 mb-0">{subtitle}</p>}
            </header>
          )}
          <div className="space-y-4">
            {children}
          </div>
          {footer && <div className="retro-divider" />}
          {footer && <div className="mt-2 flex justify-end gap-2">{footer}</div>}
          <button aria-label="Close" onClick={onClose} className="absolute top-2 right-2 retro-btn px-2 py-1 text-xs">✕</button>
        </div>
      </div>
    </div>
  );
};

export default RetroModal;