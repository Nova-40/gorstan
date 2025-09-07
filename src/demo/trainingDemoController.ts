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

import { getGameState } from '../state/gameState';
import type { Dispatch } from 'react';
import type { GameAction, GameMessage } from '../types/GameTypes';

interface TrainingState { active: boolean; step: number; start: number; }
let trainingState: TrainingState = { active:false, step:0, start:0 };
let dispatchRef: Dispatch<GameAction> | null = null;

const steps = [ 'welcome', 'movement', 'look', 'inventory', 'interaction', 'miniReward', 'subscribePrompt', 'end' ];

function addMessage(text: string, type: GameMessage['type']='system'){ if(!dispatchRef) return; dispatchRef({ type:'ADD_MESSAGE', payload:{ id:`td-${Date.now()}-${Math.random().toString(36).slice(2,6)}`, text, type, timestamp:Date.now() } as any }); }

function changeRoom(roomId: string){ if(!dispatchRef) return; dispatchRef({ type:'MOVE_TO_ROOM', payload: roomId }); }

async function pause(ms:number){ await new Promise(r=>setTimeout(r, ms)); }

async function runStep(){ if(!trainingState.active) return; const name = steps[trainingState.step]; switch(name){
  case 'welcome':
    addMessage('Ayla: "Welcome! This quick interactive demo teaches the basics."');
    addMessage('You can exit anytime with ESC. Let\'s begin.');
    await pause(1800); trainingState.step++; return runStep();
  case 'movement':
    addMessage('Ayla: "Try moving to the east (type: go east) or any valid exit."');
    await waitForRoomChange(5000, 'controlnexus');
    addMessage('Great! Movement unlocks exploration.');
    await pause(1200); trainingState.step++; return runStep();
  case 'look':
    addMessage('Ayla: "Use the LOOK command to examine your surroundings."');
    await pause(4000); addMessage('Environment described. Curiosity is rewarded.');
    trainingState.step++; return runStep();
  case 'inventory':
    addMessage('Ayla: "Open your inventory (type: inventory). Items fuel progress."');
    await pause(4200); addMessage('Inventory system supports puzzles & upgrades.');
    trainingState.step++; return runStep();
  case 'interaction':
    addMessage('Ayla: "Many rooms hide interactable lore. Collecting one now..."');
    await pause(900); addMessage('📜 Acquired: Faded Data Fragment');
    if(dispatchRef) dispatchRef({ type:'ADD_TO_INVENTORY', payload:'dataFragment' });
    await pause(1600); trainingState.step++; return runStep();
  case 'miniReward':
    addMessage('Ayla: "Actions award score & narrative momentum."');
    if(dispatchRef) dispatchRef({ type:'ADD_SCORE', payload:50 } as any);
    await pause(1500); addMessage('Score +50');
    trainingState.step++; return runStep();
  case 'subscribePrompt':
    addMessage('Ayla: "You\'ve seen a glimpse. Unlock the full evolving world next."');
    await pause(1600); addMessage('🔥 Tip: Early supporters gain cosmetic legacy tokens.');
    await pause(1800); addMessage('Click SUBSCRIBE or enter a beta code to continue the saga.');
    // Fire event for external UI to surface Patreon dialog CTA
    try{ window.dispatchEvent(new CustomEvent('open-patreon-dialog')); }catch{}
    trainingState.step++; return runStep();
  case 'end':
    addMessage('Training complete. Explore more by subscribing.');
    stopTrainingDemo();
    return;
 }
}

async function waitForRoomChange(timeoutMs:number, target?:string){ const start=Date.now(); const initial = getGameState()?.currentRoomId; while(Date.now()-start<timeoutMs){ await pause(300); const curr = getGameState()?.currentRoomId; if(curr && curr!==initial) return; } if(target) changeRoom(target); }

export function startTrainingDemo(dispatch: Dispatch<GameAction>){ if(trainingState.active) return; dispatchRef = dispatch; trainingState = { active:true, step:0, start:Date.now() }; // place player in a safe hub if missing
 const gs = getGameState(); if(gs && !gs.currentRoomId) changeRoom('controlnexus'); runStep(); }
export function stopTrainingDemo(){ if(!trainingState.active) return; trainingState.active=false; addMessage('Exited training demo.'); }
export function isTrainingDemoActive(){ return trainingState.active; }
