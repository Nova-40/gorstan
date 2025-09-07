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

export interface RetroPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  dense?: boolean;
}

export const RetroPanel: React.FC<RetroPanelProps> = ({
  title,
  subtitle,
  actions,
  footer,
  dense = false,
  className,
  children,
  ...rest
}) => {
  return (
    <div className={cn('retro-panel', dense && 'p-2', className)} {...rest}>
      {(title || actions || subtitle) && (
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            {title && <h3 className="panel-heading glow-text m-0 text-sm">{title}</h3>}
            {subtitle && <p className="panel-subtle mt-1 mb-0">{subtitle}</p>}
          </div>
          {actions && <div className="flex gap-2 items-center shrink-0">{actions}</div>}
        </div>
      )}
      <div className="space-y-3">
        {children}
      </div>
      {footer && (
        <div className="retro-divider" />
      )}
      {footer && (
        <div className="mt-2 text-right">
          {footer}
        </div>
      )}
    </div>
  );
};

export default RetroPanel;