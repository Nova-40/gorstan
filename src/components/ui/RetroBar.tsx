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

export interface RetroBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0..1
  label?: string;
  intent?: 'default' | 'success' | 'danger' | 'warning' | 'info';
  showValue?: boolean;
  height?: number;
  animated?: boolean;
}

const intentColors: Record<string, string> = {
  default: 'from-emerald-400/60 via-emerald-300/40 to-emerald-500/70',
  success: 'from-green-400/70 via-green-300/40 to-green-500/80',
  danger: 'from-red-500/70 via-red-400/40 to-red-600/80',
  warning: 'from-amber-400/70 via-amber-300/40 to-amber-500/80',
  info: 'from-blue-400/70 via-blue-300/40 to-blue-500/80'
};

export const RetroBar: React.FC<RetroBarProps> = ({
  value,
  label,
  intent = 'default',
  showValue = true,
  height = 10,
  animated = true,
  className,
  ...rest
}) => {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <div className={cn('w-full flex flex-col gap-1', className)} {...rest}>
      {(label || showValue) && (
        <div className="flex justify-between text-[10px] font-mono text-console-dim tracking-wider">
          <span>{label}</span>
          {showValue && <span className="text-console-bright">{Math.round(pct * 100)}%</span>}
        </div>
      )}
      <div className="retro-bar" style={{ height }}>
        <div
          className={cn(
            'retro-bar-fill h-full bg-gradient-to-r',
            intentColors[intent],
            animated && 'transition-all duration-500'
          )}
          style={{ width: `${pct * 100}%` }}
        />
      </div>
    </div>
  );
};

export default RetroBar;