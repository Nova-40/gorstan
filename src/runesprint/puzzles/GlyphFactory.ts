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

// GlyphFactory.ts – defines glyph puzzle metadata & factories

export type GlyphKind = 'runic_sum' | 'path_weave' | 'sequence_logic' | 'cipher_wheel';

export interface GlyphSpec {
  kind: GlyphKind;
  difficulty: number; // 1..5
  metadata: string;   // lore / quantum parody line
  data: any;          // puzzle-specific data payload (placeholder structures)
}

export function createGlyph(kind: GlyphKind, seed: number): GlyphSpec {
  const meta: Record<GlyphKind, string> = {
    runic_sum: 'Superposed integers awaiting collapse.',
    path_weave: 'Braiding qubits without collapsing adjacency.',
    sequence_logic: 'Predict decoherence drift of runic waveform.',
    cipher_wheel: 'Entangle twin rune rings; extract classical bits.'
  };
  // Minimal placeholder generation – real logic can expand later
  const difficulty = 1 + (seed % 5);
  const data = { seed, values: [seed % 7, (seed>>2)%9] };
  return { kind, difficulty, metadata: meta[kind], data };
}
