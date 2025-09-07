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

// Shared Crockford Base32 beta code helpers
// Alphabet excludes I, L, O, U
export const CROCKFORD_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

export function isCrockfordBase32(str: string): boolean {
  return /^[0-9A-HJKMNP-TV-Z]+$/.test(str.toUpperCase());
}

export function generateRawBetaCore(length = 8): string {
  let s = '';
  for (let i=0;i<length;i++) s += CROCKFORD_ALPHABET[Math.floor(Math.random()*CROCKFORD_ALPHABET.length)];
  return s;
}

export function generateBetaCode(prefix: 'GOR-' | 'GORSTAN-' | '' = 'GOR-'): string {
  return prefix + generateRawBetaCore(8);
}

export const BETA_CODE_REGEX = /^(?:GORSTAN-|GOR-)?([0-9A-HJKMNP-TV-Z]{8})$/i;

export function normalizeBetaCode(input: string): string | null {
  const m = BETA_CODE_REGEX.exec(input.trim().toUpperCase());
  if (!m || !m[1]) return null;
  return m[1].toUpperCase();
}
