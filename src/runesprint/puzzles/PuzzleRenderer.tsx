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

// PuzzleRenderer.tsx – renders a glyph puzzle & shows its metadata flavour
import React from 'react';
import type { GlyphSpec } from './GlyphFactory';

interface PuzzleRendererProps { glyph: GlyphSpec; onSolve?: () => void; onHint?: () => void; }

export const PuzzleRenderer: React.FC<PuzzleRendererProps> = ({ glyph, onSolve, onHint }) => {
  return (
    <div className="rs-puzzle font-mono text-sm text-cyan-200 space-y-3">
      <div className="text-xs uppercase tracking-wide text-cyan-400">Glyph: {glyph.kind}</div>
      <div className="text-[11px] opacity-80">{glyph.metadata}</div>
      <div className="p-3 rounded bg-slate-800/60 border border-slate-600">
        <pre className="text-[11px] leading-snug whitespace-pre-wrap">{JSON.stringify(glyph.data, null, 2)}</pre>
      </div>
      <div className="flex gap-2">
        <button onClick={onHint} className="px-3 py-1 rounded bg-indigo-700 hover:bg-indigo-600 text-xs">Hint</button>
        <button onClick={onSolve} className="px-3 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-xs">Solve</button>
      </div>
    </div>
  );
};

export default PuzzleRenderer;
