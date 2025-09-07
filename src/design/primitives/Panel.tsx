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
import { useTheme } from '../ThemeProvider';

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  level?: 0 | 1 | 2 | 3; // 0 = flat, 3 = highest
  tinted?: boolean; // apply accent outline
  interactive?: boolean; // hover / focus ring
}

export const Panel: React.FC<PanelProps> = ({ level = 1, tinted = false, interactive = false, style, children, ...rest }) => {
  const { reducedMotion } = useTheme();
  const elevation = ['var(--elevation-none)', 'var(--elevation-sm)', 'var(--elevation-md)', 'var(--elevation-lg)'][level];
  return (
    <div
      data-panel
      style={{
        background: 'var(--color-bg-secondary)',
        border: tinted ? '1px solid var(--color-border-primary)' : '1px solid var(--color-neutral-300)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-3)',
        boxShadow: elevation,
        position: 'relative',
        transition: reducedMotion ? undefined : 'box-shadow var(--duration-fast) var(--ease-out), border-color var(--duration-fast)',
        ...(interactive ? { cursor: 'pointer' } : {}),
        ...style
      }}
      {...rest}
    >
      {children}
    </div>
  );
};
