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

// ModeSelect.tsx - mode selection (stub)
import React from 'react';
export const ModeSelect: React.FC<{ onSelect: (mode: 'endless'|'story'|'trials') => void; }> = ({ onSelect }) => (
  <div className="flex flex-col gap-3 p-6 max-w-xs mx-auto text-green-300 font-mono">
    <h1 className="text-lg mb-2 text-center">Catacombe Dash</h1>
    <button onClick={()=>onSelect('endless')} className="px-4 py-2 rounded bg-emerald-600">Endless</button>
    <button onClick={()=>onSelect('story')} className="px-4 py-2 rounded bg-cyan-600">Story</button>
    <button onClick={()=>onSelect('trials')} className="px-4 py-2 rounded bg-fuchsia-600">Trials</button>
  </div>
);
