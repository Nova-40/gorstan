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

export interface RetroSectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  iconLeft?: React.ReactNode;
  actions?: React.ReactNode;
  compact?: boolean;
}

export const RetroSectionHeader: React.FC<RetroSectionHeaderProps> = ({
  title,
  subtitle,
  iconLeft,
  actions,
  compact = false,
  className,
  ...rest
}) => {
  return (
    <div className={cn('flex items-start justify-between gap-3', className)} {...rest}>
      <div className={cn('flex items-start gap-2', compact && 'gap-1')}> 
        {iconLeft && <span className="mt-0.5 text-console-bright">{iconLeft}</span>}
        <div>
          <h3 className={cn('panel-heading glow-text m-0', compact && 'text-[0.8rem] tracking-wide')}>{title}</h3>
          {subtitle && <p className={cn('panel-subtle mt-1 mb-0', compact && 'mt-0.5 text-[9px]')}>{subtitle}</p>}
        </div>
      </div>
      {actions && <div className={cn('flex items-center gap-2', compact && 'gap-1')}>{actions}</div>}
    </div>
  );
};

export default RetroSectionHeader;