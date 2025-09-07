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

export interface QuipBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: 'neutral' | 'system' | 'lore' | 'danger';
  compact?: boolean;
}

export const QuipBanner: React.FC<QuipBannerProps> = ({ tone='neutral', compact, style, children, ...rest }) => {
  const toneColor = tone === 'system' ? 'var(--color-info-500)' : tone === 'lore' ? 'var(--color-ayla-400)' : tone === 'danger' ? 'var(--color-danger-500)' : 'var(--color-text-secondary)';
  return (
    <div
      style={{
        maxWidth: 420,
        textAlign: 'center',
        padding: compact ? '4px 10px' : '6px 14px',
        fontFamily: 'var(--font-family-mono)',
        fontSize: '11px',
        background: 'rgba(0,0,0,0.55)',
        border: '1px solid ' + toneColor,
        borderRadius: 'var(--radius-xl)',
        color: toneColor,
        boxShadow: 'var(--elevation-sm)',
        ...style
      }}
      {...rest}
    >{children}</div>
  );
};
