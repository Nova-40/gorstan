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

// Demo beats (renamed from beats.ts to avoid tooling resolution quirk on Windows).
import { getGameDispatch } from '@/utils/dispatchAccess';

const sleep = (ms:number)=> new Promise(r=> setTimeout(r, ms));
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;

function dispatch(type: string, payload?: any){ const d = getGameDispatch(); if (d) d({ type, payload } as any); }
function systemMessage(text: string){ dispatch('ADD_MESSAGE', { id: uid(), text, type: 'system', timestamp: Date.now() }); }
function mark(beat: string){ try { window.dispatchEvent(new CustomEvent('gorstan-beat', { detail: beat })); } catch {} }
function go(roomId: string){ dispatch('MOVE_TO_ROOM', roomId); }

export async function runIntroBeat(){ systemMessage('Welcome to Gorstan – a 12‑minute glimpse.'); go('introZone_introreset'); mark('intro'); await sleep(2500); systemMessage('Move, explore, and experiment.'); await sleep(1800); }
export async function runArcadeFight1(){ systemMessage('Initiating shadow encounter...'); dispatch('ADD_SCORE', 25); mark('arcade1'); await sleep(3000); systemMessage('Shadows dispersed.'); }
export async function runGlitchExplore(){ go('glitchZone_ravenchamber'); systemMessage('Entering Glitchrealm fragment. Reality unstable.'); mark('glitch'); await sleep(3500); }
export async function runArcadeFight2(){ systemMessage('Second encounter – adaptive pattern shift.'); dispatch('ADD_SCORE', 40); mark('arcade2'); await sleep(3200); systemMessage('Stability restored.'); }
export async function runGatePuzzle(){ systemMessage('Gate puzzle preview. Interlocks calibrating...'); mark('gate'); await sleep(4000); systemMessage('Puzzle auto‑solved for demo pacing.'); }
export async function showCliffhanger(){ systemMessage('Cliffhanger: Deeper layers await. Unlock full game to continue.'); mark('cliffhanger'); }
