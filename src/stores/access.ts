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

import { create } from 'zustand';
import type { UserAccess } from '@/types/access';
import { refreshAccess } from '@/lib/api';
import { track } from '@/lib/analytics';

interface AccessStore {
  access: UserAccess;
  setAccess: (u: Partial<UserAccess>, trackEvent?: boolean) => void;
  refresh: () => Promise<void>;
  clear: () => void;
}

export const useAccess = create<AccessStore>((set, get) => ({
  access: { state: 'locked' },
  setAccess: (u, trackEvent = true) => set(s => {
    const merged = { ...s.access, ...u };
    try { localStorage.setItem('gorstan.accessState', JSON.stringify(merged)); } catch {}
    if (trackEvent && u.state) track('game_mode_set', { mode: u.state });
    return { access: merged };
  }),
  refresh: async () => {
    const next = await refreshAccess();
    get().setAccess(next, false);
  },
  clear: () => set(() => ({ access: { state: 'locked' } }))
}));
