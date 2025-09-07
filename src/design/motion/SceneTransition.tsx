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

import React, { useEffect, useState } from 'react';
import { useTheme } from '../ThemeProvider';

interface SceneTransitionProps {
  in: boolean;
  kind?: 'fade' | 'slide-up' | 'scale' | 'teleport';
  durationMs?: number; // overrides token durations
  children: React.ReactNode;
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
}

// Basic token mapping (could be expanded)
const kindStyles = (kind: string, phase: 'enter' | 'exit'): React.CSSProperties => {
  switch (kind) {
    case 'slide-up':
      return phase === 'enter' ? { transform: 'translateY(0)', opacity: 1 } : { transform: 'translateY(18px)', opacity: 0 };
    case 'scale':
      return phase === 'enter' ? { transform: 'scale(1)', opacity: 1 } : { transform: 'scale(0.92)', opacity: 0 };
    case 'teleport':
      return phase === 'enter' ? { transform: 'scale(1)', opacity: 1, filter: 'brightness(1)' } : { transform: 'scale(0.85)', opacity: 0, filter: 'brightness(1.8) saturate(1.4)' };
    case 'fade':
    default:
      return phase === 'enter' ? { opacity: 1 } : { opacity: 0 };
  }
};

export const SceneTransition: React.FC<SceneTransitionProps> = ({ in: show, kind='fade', durationMs, children, mountOnEnter=true, unmountOnExit=true }) => {
  const { reducedMotion } = useTheme();
  const [rendered, setRendered] = useState(show);
  const [phase, setPhase] = useState<'enter' | 'exit'>(show ? 'enter' : 'exit');
  const dur = durationMs ?? (kind === 'teleport' ? 180 : kind === 'slide-up' ? 240 : 200);

  useEffect(() => {
    if (show) {
      setRendered(true);
      requestAnimationFrame(() => setPhase('enter'));
    } else {
      setPhase('exit');
      if (unmountOnExit) {
        const t = setTimeout(() => setRendered(false), dur);
        return () => clearTimeout(t);
      }
    }
  }, [show, unmountOnExit, dur]);

  if (!rendered && mountOnEnter) return null;

  const style: React.CSSProperties = {
    position: 'relative',
    transition: reducedMotion ? undefined : `all ${dur}ms var(--ease-out)`,
    willChange: 'transform, opacity, filter',
    ...kindStyles(kind, phase)
  };

  return <div style={style} data-scene-transition-kind={kind}>{children}</div>;
};

export default SceneTransition;
