/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  You may play Gorstan for free for personal entertainment only.
  You may NOT copy, redistribute, modify, or sell the game, its code, 
  artwork, storyline, or any other part without written permission.
  
  Gorstan includes third-party libraries and assets:
    - React © Meta Platforms, Inc. – MIT Licence
    - Lucide Icons © Lucide Contributors – ISC Licence
    - Flaticon icons © Flaticon.com – Free Licence with attribution
    - Other packages under their respective licences (see package.json)

  Full licence terms: see EULA.md in the project root.
*/

// Gorstan and characters (c) Geoff Webster 2025
// Game module.


// --- Function: randomInt ---
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}



// --- Function: randomFloat ---
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}



// --- Function: pickRandom<T> ---
export function pickRandom<T>(arr: T[]): T {
  if (arr.length === 0) throw new Error('Cannot pick random element from empty array');
  const idx = randomInt(0, arr.length);
  const val = arr[idx];
  if (val === undefined) throw new Error('Random selection returned undefined');
  return val;
}



// --- Function: chance ---
export function chance(probability: number): boolean {
  return Math.random() < probability;
}



// --- Function: shuffle<T> ---
export function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1);
    if (j === i) continue;
    const a = arr[i];
    const b = arr[j];
    arr[i] = b as T;
    arr[j] = a as T;
  }
  return arr;
}



// --- Function: randomUUID ---
export function randomUUID(): string {
// JSX return block or main return
  return (
    Date.now().toString(36) +
    Math.random().toString(36).substr(2, 9)
  );
}
