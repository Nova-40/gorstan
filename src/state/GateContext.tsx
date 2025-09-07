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

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { GameMode, GateConfig, UnlockState } from '@/types/game';

const defaultUnlock: UnlockState = { isUnlocked:false, source:null };
const defaultConfig: GateConfig = { enableAttract:true, attractIdleMs:12000, demoMaxMs:12*60*1000 };

type GateCtx = { mode:GameMode; setMode:(m:GameMode)=>void; unlock:UnlockState; setUnlock:(u:UnlockState)=>void; config:GateConfig; };
const GateContext = createContext<GateCtx | null>(null);

export const GateProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [mode, setMode] = useState<GameMode>(GameMode.LOCKED);
  const [unlock, setUnlock] = useState<UnlockState>(() => {
    try { return JSON.parse(localStorage.getItem('gorstan.unlock') || 'null') || defaultUnlock; } catch { return defaultUnlock; }
  });
  useEffect(() => { try { localStorage.setItem('gorstan.unlock', JSON.stringify(unlock)); } catch {} }, [unlock]);
  const value = useMemo(() => ({ mode, setMode, unlock, setUnlock, config: defaultConfig }), [mode, unlock]);
  return <GateContext.Provider value={value}>{children}</GateContext.Provider>;
};
export const useGate = () => { const c = useContext(GateContext); if(!c) throw new Error('useGate outside provider'); return c; };
