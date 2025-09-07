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

/*
  Demo Controller – Scripted walkthrough of key Gorstan route.
  Route (planned sequence):
    TeletypeIntro → Control Nexus → Library (coin puzzle) → Glitchrealm (Register)
    → Faeglade (Polly) → Reset Room (fail) → Trent Park (finale) → teleport out.

  NOTE: Previous refactor accidentally injected a code fragment for stepIntro inside
  this comment block which broke TypeScript parsing and caused module resolution
  failures. Cleaned up to restore valid source.
*/

import { getGameState } from '../state/gameState';
import type { GameMessage } from '../types/GameTypes';
import type { Dispatch } from 'react';
import type { GameAction } from '../types/GameTypes';

export interface DemoState {
  isActive: boolean;
  currentStep: number;
  canSkip: boolean;
  startTime: number;
}

// Global demo state
let demoState: DemoState = {
  isActive: false,
  currentStep: 0,
  canSkip: true,
  startTime: 0
};

// Global dispatch reference
let globalDispatch: Dispatch<GameAction> | null = null;

// Global teleport trigger function reference
let globalTeleportTrigger: ((teleportType: 'fractal' | 'trek', callback: () => void) => void) | null = null;

// Renamed conceptually to ScriptedDemoController (file kept temporarily for import compatibility during migration)
class DemoController {
  private steps = [
    'intro',
    'controlnexus',
    'library',
    'glitchrealm', 
    'faeglade',
    'resetroom',
    'trentpark',
    'endDemo'
  ];

  private originalRoom: string = '';
  private originalInventory: string[] = [];

  public setDispatch(dispatch: Dispatch<GameAction>): void {
    globalDispatch = dispatch;
  }

  public setTeleportTrigger(triggerFn: (teleportType: 'fractal' | 'trek', callback: () => void) => void): void {
    globalTeleportTrigger = triggerFn;
  }

  public isDemoMode(): boolean {
    return demoState.isActive;
  }

  private addMessage(text: string, type: 'system' | 'action' | 'dialogue' | 'error' = 'system'): void {
    if (!globalDispatch) return;
    const now = Date.now();
    // Add small random + step + counter data to avoid duplicate keys when many messages share same ms
    const unique = `${now}-${demoState.currentStep}-${Math.random().toString(36).slice(2,7)}`;
    const message: GameMessage = {
      id: unique,
      text,
      type,
      timestamp: now
    };
    globalDispatch({ type: 'ADD_MESSAGE', payload: message });
  }

  private addToInventory(item: string): void {
    if (!globalDispatch) return;
    globalDispatch({ type: 'ADD_TO_INVENTORY', payload: item });
  }

  private normalizeRoomId(id: string): string {
    return (id || '').trim().toLowerCase();
  }

  private changeRoom(roomId: string): void {
    if (!globalDispatch) return;
    const target = this.normalizeRoomId(roomId);
    globalDispatch({ type: 'CHANGE_ROOM', payload: target });
  }

  private triggerTeleport(teleportType: 'fractal' | 'trek', targetRoom: string): void {
    if (!globalTeleportTrigger) {
      this.changeRoom(targetRoom); // fallback
      return;
    }
    const normalized = this.normalizeRoomId(targetRoom);
    globalTeleportTrigger(teleportType, () => { this.changeRoom(normalized); });
  }

  public async startDemo(): Promise<void> {
    if (demoState.isActive) {
        if ((window as any).__GORSTAN_DEMO_VERBOSE) console.log('[DemoController] Demo already running');
      return;
    }

    if (!globalDispatch) {
        if ((window as any).__GORSTAN_DEMO_VERBOSE) console.error('[DemoController] No dispatch function available');
      return;
    }

      if ((window as any).__GORSTAN_DEMO_VERBOSE) console.log('[DemoController] Starting scripted demo mode');
    
    // Store original state
    const gameState = getGameState();
    if (gameState) {
      this.originalRoom = gameState.currentRoomId;
      this.originalInventory = [...gameState.inventory];
    }
    
    demoState = {
      isActive: true,
      currentStep: 0,
      canSkip: true,
      startTime: Date.now()
    };

    // Add demo mode indicator
    this.addMessage('🎭 DEMO MODE ACTIVE - Press ESC to skip at any time');

    // Start the demo sequence
    await this.executeStep(0);
  }

  public stopDemo(): void {
    if (!demoState.isActive) return;

    if ((window as any).__GORSTAN_DEMO_VERBOSE) console.log('[DemoController] Stopping demo mode');
    
    demoState.isActive = false;
    
    // Restore original state
    this.changeRoom(this.originalRoom);
    if (globalDispatch) {
      globalDispatch({ type: 'SET_INVENTORY', payload: this.originalInventory });
    }
    
    this.addMessage('🎭 Demo mode ended. Welcome back to Gorstan!');
  }

  public skipToNext(): void {
    if (!demoState.isActive || !demoState.canSkip) return;
    
    const nextStep = demoState.currentStep + 1;
    if (nextStep < this.steps.length) {
    if ((window as any).__GORSTAN_DEMO_VERBOSE) console.log(`[DemoController] Skipping to step ${nextStep}`);
      this.executeStep(nextStep);
    } else {
      this.endDemo();
    }
  }

  public skipDemo(): void {
    if (!demoState.isActive) return;
    if ((window as any).__GORSTAN_DEMO_VERBOSE) console.log('[DemoController] Skipping entire demo');
    this.endDemo();
  }

  private async executeStep(stepIndex: number): Promise<void> {
    if (!demoState.isActive) return;
    
    demoState.currentStep = stepIndex;
    const stepName = this.steps[stepIndex];
    
    const now = Date.now();
    if (now - (this as any)._lastStepLogTime > 1000) {
    if (console.debug && (window as any).__GORSTAN_DEMO_VERBOSE) console.debug(`[DemoController] Executing step ${stepIndex}: ${stepName}`);
      (this as any)._lastStepLogTime = now;
    } else {
      if (console.debug) console.debug('[DemoController] (suppressed frequent step log)');
    }
    
    switch (stepName) {
      case 'intro':
        await this.stepIntro();
        break;
      case 'controlnexus':
        await this.stepControlNexus();
        break;
      case 'library':
        await this.stepLibrary();
        break;
      case 'glitchrealm':
        await this.stepGlitchrealm();
        break;
      case 'faeglade':
        await this.stepFaeglade();
        break;
      case 'resetRoom':
        await this.stepResetRoom();
        break;
      case 'trentPark':
        await this.stepTrentPark();
        break;
      case 'endDemo':
        await this.endDemo();
        break;
    }
  }

  private async stepIntro(): Promise<void> {
    this.addMessage('🎭 Ayla: "Welcome to your guided tour of Gorstan! Watch as I demonstrate the core gameplay..."');
    
    await this.pause(2000);
    
    // Teleport to Control Nexus with Star Trek style
    this.addMessage('✨ Initiating transport sequence...', 'action');
    try { 
      const teleportManager = await import('../services/teleportManager');
      teleportManager.teleportManager.go('controlnexus', { overlay: 'trek' }); 
    } catch { 
      this.changeRoom('controlnexus'); 
    }
    await this.pause(2600); // allow animation to progress before next scripted step
    await this.nextStep();
  }

  private async stepControlNexus(): Promise<void> {
    this.addMessage('The console flickers alive. Welcome to the Control Nexus.');
    
    await this.pause(1500);
    
    // Dominic's scripted line
    this.addMessage('Dominic: "Showtime! Don\'t fluff your lines now."', 'dialogue');
    
    await this.pause(2500);
    await this.nextStep();
  }

  private async stepLibrary(): Promise<void> {
    this.addMessage('🚶 Auto-moving east into the Library...', 'action');
    
    this.changeRoom('library');
    
    await this.pause(1500);
    
    // Auto-collect Schrödinger Coin
    this.addMessage('🪙 Schrödinger Coin automatically collected!', 'action');
    
    this.addToInventory('schrodingerCoin');
    
    await this.pause(1500);
    
    // Coin puzzle solution
    this.addMessage('📝 Running coin + napkin through extrapolator...', 'action');
    
    await this.pause(2000);
    
    this.addMessage('The plans resolve into clarity. Puzzle solved.');
    
    await this.pause(2500);
    await this.nextStep();
  }

  private async stepGlitchrealm(): Promise<void> {
  this.addMessage('🪑 Using teleport chair for fractal jump...', 'action');
  // Use proper fractal teleport animation for Glitchrealm (id already lowercase)
  this.triggerTeleport('fractal', 'glitchrealm');
    
    await this.pause(3000); // Wait for fractal animation to complete
    
    this.addMessage('You fall sideways into broken code. The Glitchrealm welcomes you.');
    
    await this.pause(2000);
    
    // Auto-collect lore item
    this.addMessage('📜 Auto-collected: "The Redacted Register: Enemies of the Singularity"', 'action');
    
    this.addToInventory('redactedRegister');
    
    await this.pause(2500);
    await this.nextStep();
  }

  private async stepFaeglade(): Promise<void> {
    this.addMessage('🌸 Transitioning to the Faeglade...', 'action');
    
    this.changeRoom('faeglade');
    
    await this.pause(1500);
    
    // Polly's scripted greeting
    this.addMessage('Polly: "Oh, hello demo audience. Don\'t mind Geoff, he does this a lot."', 'dialogue');
    
    await this.pause(3000);
    
    // Show Faeglade animation indicator
    this.addMessage('🎬 [Faeglade animated GIF would display here]');
    
    await this.pause(2500);
    await this.nextStep();
  }

  private async stepResetRoom(): Promise<void> {
    this.addMessage('⚠️ Simulating trap failure...', 'action');
    
    await this.pause(1500);
    
    this.addMessage('SYSTEM FAILURE. Respawning in Reset Room.', 'error');
    
  this.changeRoom('resetroom');
    
    await this.pause(2000);
    
    this.addMessage('Dominic: "At least you died with style."', 'dialogue');
    
    await this.pause(2500);
    await this.nextStep();
  }

  private async stepTrentPark(): Promise<void> {
    this.addMessage('🌳 Auto-transitioning to Trent Park finale...', 'action');
    
  this.changeRoom('trentpark');
    
    await this.pause(1500);
    
    this.addMessage('📡 [Radar animation would display here]');
    
    await this.pause(2000);
    
    // Ayla's scripted line
    this.addMessage('Ayla: "This is only a showcase. Reality begins afterwards."', 'dialogue');
    
    await this.pause(2500);
    
    // Wendell's scripted line
    this.addMessage('Wendell: "All stories end… some with applause."', 'dialogue');
    
    await this.pause(3000);
    await this.nextStep();
  }

  private async endDemo(): Promise<void> {
    this.addMessage('🚀 Triggering Star Trek teleport out...', 'action');
    
    try { 
      const teleportManager = await import('../services/teleportManager');
      teleportManager.teleportManager.go(this.originalRoom || 'gorstanZone_gorstanhub', { 
        overlay: 'trek', 
        skipCeremony: true, 
        silent: true 
      }); 
    } catch { 
      this.changeRoom(this.originalRoom); 
    }
    
    await this.pause(2000);
    
    this.addMessage('🎭 Demo complete. Restart to play freely, or continue your adventure!');
    
    // Calculate demo duration
    const duration = Math.round((Date.now() - demoState.startTime) / 1000);
    this.addMessage(`⏱️ Demo duration: ${duration} seconds`);
    
    this.stopDemo();
  }

  private async nextStep(): Promise<void> {
    await this.pause(1000);
    const nextIndex = demoState.currentStep + 1;
    if (nextIndex < this.steps.length) {
      await this.executeStep(nextIndex);
    } else {
      await this.endDemo();
    }
  }

  private pause(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Optionally yield to React between rapid steps (can be inserted where needed)
}

// Export singleton instance
export const demoController = new DemoController();

// Export convenience functions
export function startDemo(): Promise<void> {
  return demoController.startDemo();
}

export function stopDemo(): void {
  return demoController.stopDemo();
}

export function isDemoMode(): boolean {
  return demoController.isDemoMode();
}

export function skipDemo(): void {
  return demoController.skipToNext();
}

export function setDemoDispatch(dispatch: Dispatch<GameAction>): void {
  return demoController.setDispatch(dispatch);
}
