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

/** Token generator: reads tokens.json and outputs tokens.ts & tokens.css */
import fs from 'fs';
import path from 'path';

const root = path.resolve(__dirname);
const srcDir = root;
const jsonPath = path.join(srcDir, 'tokens.json');
const outTs = path.join(srcDir, 'tokens.ts');
const outCss = path.join(srcDir, 'tokens.css');

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

function toVarName(parts: string[]) { return '--gds-' + parts.join('-'); }

const lines: string[] = [':root {'];
function walk(obj: any, trail: string[] = []) {
  Object.entries(obj).forEach(([k, v]) => {
    const next = [...trail, k];
    if (v && typeof v === 'object' && !Array.isArray(v)) walk(v, next); else {
      lines.push(`  ${toVarName(next)}: ${v};`);
    }
  });
}
walk(data);
lines.push('}');

// Biome accent overrides – only accent colors swap
const accents = (data.color?.accent) || {};
Object.entries(accents).forEach(([biome, value]) => {
  lines.push(`[data-biome="${biome}"] { --gds-color-accent-current: ${value}; }`);
});
lines.push(`:root { --gds-color-accent-current: ${accents.gorstan || '#7c3aed'}; }`);

fs.writeFileSync(outCss, lines.join('\n'), 'utf-8');

// TS output (readonly deep object)
const ts = `// AUTO-GENERATED FILE. Do not edit manually.\nexport const tokens = ${JSON.stringify(data, null, 2)} as const;\nexport type Tokens = typeof tokens;\n`;
fs.writeFileSync(outTs, ts, 'utf-8');

console.log('[gds] tokens generated');
