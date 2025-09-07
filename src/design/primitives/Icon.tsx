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

export interface IconProps extends React.SVGAttributes<SVGElement> {
  size?: number;
  path?: string; // custom path data
  name?: 'close' | 'check' | 'warning' | 'info' | 'chevron-right' | 'chevron-left' | 'alert';
}

const paths: Record<string, string> = {
  close: 'M6 6 L18 18 M6 18 L18 6',
  check: 'M4 12 L10 18 L20 6',
  warning: 'M12 2 L22 20 H2 Z M12 14 V10 M12 18 V16',
  info: 'M12 2 A10 10 0 1 0 12 22 A10 10 0 1 0 12 2 M12 10 V17 M12 7 V8',
  'chevron-right': 'M8 4 L16 12 L8 20',
  'chevron-left': 'M16 4 L8 12 L16 20',
  alert: 'M12 2 L22 20 H2 Z'
};

export const Icon: React.FC<IconProps> = ({ size=20, name, path, stroke='currentColor', strokeWidth=2, ...rest }) => {
  const d = path || (name ? paths[name] : undefined);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {d && <path d={d} />}
    </svg>
  );
};
