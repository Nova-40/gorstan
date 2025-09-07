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

export enum GameMode { ATTRACT='ATTRACT', DEMO='DEMO', FULL='FULL', LOCKED='LOCKED' }

export type UnlockSource = 'patreon' | 'beta' | 'stripe' | null;

export interface UnlockState {
  isUnlocked: boolean;
  source: UnlockSource;
  tier?: string;
  betaTag?: string;
}

export interface GateConfig {
  enableAttract: boolean;
  attractIdleMs: number;
  demoMaxMs: number;
}
