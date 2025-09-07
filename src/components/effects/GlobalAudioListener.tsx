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

import React, { useEffect } from 'react';
import { installGlobalAudioBridge } from '../../design/audio/AudioBus';
import { useTheme } from '../../design/ThemeProvider';

// GlobalAudioListener - mounts once to connect CustomEvents to audio outputs.
// Adapts volume for reducedMotion preference (softens intensity).
export const GlobalAudioListener: React.FC = () => {
  const { reducedMotion } = useTheme();
  useEffect(() => {
    const dispose = installGlobalAudioBridge();
    return () => { if (dispose) dispose(); };
  }, []);
  // Could expose a context for volume scaling; for now we just set a data-attr to allow CSS-driven muting if needed.
  return <div data-audio-root data-reduced-motion={reducedMotion ? 'true' : 'false'} style={{ display: 'none' }} />;
};

export default GlobalAudioListener;