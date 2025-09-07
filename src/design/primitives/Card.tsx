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
import { Panel } from './Panel';
import type { PanelProps } from './Panel';

type DivProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>; // avoid clash with our title prop

export interface CardProps extends DivProps {
  header?: React.ReactNode; // renamed from title to avoid HTMLAttribute title conflict
  footer?: React.ReactNode;
  compact?: boolean;
  tinted?: PanelProps['tinted'];
  interactive?: PanelProps['interactive'];
  title?: never; // disallow native title usage here to prevent confusion
}

export const Card: React.FC<CardProps> = ({ header, footer, compact, children, tinted = false, interactive = false, style, ...rest }) => {
  return (
  <Panel level={2} tinted={tinted} interactive={interactive} style={{ padding: compact ? 'var(--space-2) var(--space-3)' : undefined, ...style }} {...rest}>
      {header ? (
        <div style={{
          fontFamily: 'var(--font-family-sans)', fontWeight: 600, marginBottom: 'var(--space-2)',
          fontSize: 'var(--font-size-lg)', color: 'var(--color-text-primary)'
        }}>{header}</div>
      ) : null}
      <div>{children}</div>
      {footer ? (
        <div style={{ marginTop: 'var(--space-3)', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--color-neutral-300)' }}>{footer}</div>
      ) : null}
    </Panel>
  );
};
