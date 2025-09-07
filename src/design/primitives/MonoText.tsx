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

export interface MonoTextProps extends React.HTMLAttributes<HTMLElement> {
  as?: keyof HTMLElementTagNameMap;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  dim?: boolean;
  wrap?: boolean;
}

const sizeMap = {
  xs: 'var(--font-size-xs)',
  sm: 'var(--font-size-sm)',
  md: 'var(--font-size-base)',
  lg: 'var(--font-size-lg)'
};

export const MonoText: React.FC<MonoTextProps> = ({ as='span', size='md', dim, wrap, style, children, ...rest }) => {
  const Tag: any = as;
  return (
    <Tag
      style={{
        fontFamily: 'var(--font-family-mono)',
        fontSize: sizeMap[size],
        color: dim ? 'var(--color-text-tertiary)' : 'var(--color-text-secondary)',
        whiteSpace: wrap ? 'normal' : 'pre',
        ...style
      }}
      {...rest}
    >{children}</Tag>
  );
};
