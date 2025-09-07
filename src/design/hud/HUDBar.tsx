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

export interface HUDBarProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'center' | 'left' | 'right';
  compact?: boolean;
}

export const HUDBar: React.FC<HUDBarProps> = ({ align='center', compact, style, children, ...rest }) => {
  return (
    <div
      role="group"
      style={{
        display: 'flex',
        gap: 'var(--space-2)',
        alignItems: 'center',
        justifyContent: align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end',
        fontFamily: 'var(--font-family-mono)',
        fontSize: 'var(--font-size-xs)',
        padding: compact ? 'var(--space-1) var(--space-2)' : 'var(--space-2) var(--space-3)',
        background: 'var(--color-bg-overlay)',
        border: '1px solid var(--color-border-secondary)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--elevation-sm)',
        ...style
      }}
      {...rest}
    >{children}</div>
  );
};
