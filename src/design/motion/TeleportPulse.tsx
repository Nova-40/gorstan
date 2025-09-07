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

import React, { useEffect, useRef } from 'react';
import { useTheme } from '../ThemeProvider';

interface TeleportPulseProps extends React.HTMLAttributes<HTMLDivElement> {
  active: boolean;
  size?: number;
}

export const TeleportPulse: React.FC<TeleportPulseProps> = ({ active, size=160, style, ...rest }) => {
  const { reducedMotion } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current || reducedMotion) return;
    if (active) {
      ref.current.animate([
        { transform: 'scale(0.6)', opacity: 0.4, filter: 'blur(2px)' },
        { transform: 'scale(1.05)', opacity: 0.9, filter: 'blur(0)' },
        { transform: 'scale(1.2)', opacity: 0, filter: 'blur(6px)' }
      ], { duration: 700, easing: 'var(--ease-out)' });
    }
  }, [active, reducedMotion]);
  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        pointerEvents: 'none',
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 50% 50%, rgba(57,255,20,0.55), rgba(57,255,20,0.05) 70%, transparent)',
        mixBlendMode: 'screen',
        position: 'absolute',
        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        opacity: active ? 1 : 0,
        transition: reducedMotion ? undefined : 'opacity 240ms var(--ease-out)',
        ...style
      }}
      {...rest}
    />
  );
};

export default TeleportPulse;
