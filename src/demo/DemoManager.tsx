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
import { useGate } from '@/state/GateContext';
import { runIntroBeat, runArcadeFight1, runGlitchExplore, runArcadeFight2, runGatePuzzle, showCliffhanger } from './demoBeats';

export const DemoManager: React.FC<{ onEnd: () => void }> = ({ onEnd }) => {
  const { config } = useGate();

  useEffect(() => {
    let cancelled = false;
    const timeout = setTimeout(() => { if (!cancelled) onEnd(); }, config.demoMaxMs);
    (async () => {
      await runIntroBeat();
      await runArcadeFight1();
      await runGlitchExplore();
      await runArcadeFight2();
      await runGatePuzzle();
      await showCliffhanger();
      onEnd();
    })();
    return () => { cancelled = true; clearTimeout(timeout); };
  }, [config.demoMaxMs, onEnd]);

  return <div className="w-full h-full" />;
};

export default DemoManager;
