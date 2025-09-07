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

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingTone = 'primary' | 'muted' | 'danger' | 'success';

interface BaseProps { level?: HeadingLevel; tone?: HeadingTone; mono?: boolean; glow?: boolean; }
type NativeHeading = React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
export type HeadingProps = BaseProps & NativeHeading;

const tagFor = (level: HeadingLevel): keyof HTMLElementTagNameMap => ('h' + level) as any;

export const Heading: React.FC<HeadingProps> = ({ level = 2, tone='primary', mono, glow, style, children, ...rest }) => {
  const Tag: any = tagFor(level);
  const color = tone === 'primary' ? 'var(--color-text-primary)' :
    tone === 'muted' ? 'var(--color-text-secondary)' :
    tone === 'danger' ? 'var(--color-danger-500)' : 'var(--color-success-500)';
  return (
    <Tag
      style={{
        margin: 0,
        fontFamily: mono ? 'var(--font-family-mono)' : 'var(--font-family-sans)',
        fontWeight: 600,
        lineHeight: 'var(--line-height-tight)',
        letterSpacing: mono ? '0.5px' : undefined,
        color,
        textShadow: glow ? '0 0 8px rgba(57,255,20,0.6)' : undefined,
        ...style
      }}
      {...rest}
    >{children}</Tag>
  );
};
