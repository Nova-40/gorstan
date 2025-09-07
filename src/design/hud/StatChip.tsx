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

export interface StatChipProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  tone?: 'default' | 'warn' | 'danger' | 'ok';
  pulse?: boolean;
}

export const StatChip: React.FC<StatChipProps> = ({ label, value, tone='default', pulse, style, ...rest }) => {
  const color = tone === 'warn' ? 'var(--color-warning-500)' : tone === 'danger' ? 'var(--color-danger-500)' : tone === 'ok' ? 'var(--color-success-500)' : 'var(--color-text-primary)';
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 8px',
        background: 'rgba(0,0,0,0.5)',
        border: '1px solid ' + color,
        borderRadius: '999px',
        fontFamily: 'var(--font-family-mono)',
        fontSize: '10px',
        lineHeight: 1.2,
        color,
        boxShadow: pulse ? '0 0 8px ' + color : undefined,
        ...style
      }}
      {...rest}
    >
      <span style={{ opacity: 0.75 }}>{label}</span>
      <strong style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>{value}</strong>
    </div>
  );
};
