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

// Audio.ts - basic SFX / music scaffolding
export type SfxName = 'phase_start' | 'shadow_stun' | 'teleport_in' | 'teleport_out' | 'entropy_beep';

let audioCtx: AudioContext | null = null;
function ctx() { if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)(); return audioCtx; }

export async function playSfx(name: SfxName) {
  try {
    const c = ctx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    const now = c.currentTime;
    let freq = 440;
    switch (name) {
      case 'phase_start': freq = 620; break;
      case 'shadow_stun': freq = 300; break;
      case 'teleport_in': freq = 840; break;
      case 'teleport_out': freq = 540; break;
      case 'entropy_beep': freq = 880; break;
    }
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.2, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    osc.connect(gain).connect(c.destination);
    osc.start();
    osc.stop(now + 0.4);
  } catch {}
}

let musicGain: GainNode | null = null;
let currentTrack: string | null = null;
export function loopTrack(name: string) {
  if (currentTrack === name) return;
  const c = ctx();
  if (!musicGain) { musicGain = c.createGain(); musicGain.gain.value = 0.3; musicGain.connect(c.destination); }
  currentTrack = name;
  const osc = c.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.value = 110;
  osc.connect(musicGain!);
  osc.start();
}
