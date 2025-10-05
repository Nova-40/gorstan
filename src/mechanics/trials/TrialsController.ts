/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Trials of Gorstan controller - orchestrates the three trial phases
*/

import { RockField } from './RockField';
import { RandomRocks } from './RandomRocks';
import { MushroomField } from './MushroomField';
import TrialsManager from './TrialsManager';
import { StreamReset } from './StreamReset';
import { CaveMaze } from '../caves/CaveMaze';
import { demoProgress } from '../../engine/state/demoState';

export class TrialsController {
  private currentPhase: number = 0;
  private activeController: any = null;
  private manager: TrialsManager;
  private phases = [
    { name: 'Rock Gauntlet', controller: RockField },
    { name: 'Random Rocks', controller: RandomRocks },
    { name: 'Mushroom Field', controller: MushroomField },
  ];

  constructor() {
    this.manager = new TrialsManager();
  }

  async run(): Promise<void> {
    console.log('[TrialsController] Starting Trials of Gorstan');

    try {
      // Phase 1-3: The trials
      for (let i = 0; i < this.phases.length; i++) {
        this.currentPhase = i;
        const phase = this.phases[i];
        if (!phase) continue;
        demoProgress.currentPhase = phase.name ?? null;
        demoProgress.phaseStartTime = Date.now();

        console.log(`[TrialsController] Starting Phase ${i + 1}: ${phase.name}`);

        const phaseController = new phase.controller();
        // Attach the manager if the controller expects it
        try {
          // @ts-ignore
          phaseController.manager = this.manager;
        } catch (e) {}
        this.activeController = phaseController;
        // If this is a RockField instance, expose it for the UI renderer to pick up
        try {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (phaseController && phaseController.getRollingRocks) {
            // @ts-ignore
            (window as any).__activeRockField = phaseController;
          }
          // Expose the active phase controller generally so the UI/hook can sync to it
          try {
            // @ts-ignore
            (window as any).__activePhase = phaseController;
            // @ts-ignore
            (window as any).__activePhaseName = phase.name;
          } catch (e) {}
          // Also expose the manager for UI/hint helpers
          try {
            // @ts-ignore
            (window as any).__trialsManager = this.manager;
          } catch (e) {}
        } catch (e) {
          // ignore - only for UI rendering convenience
        }
  await phaseController.run();
        this.activeController = null;
        try {
          // Clear UI reference
          // @ts-ignore
          if ((window as any).__activeRockField === phaseController) {
            // @ts-ignore
            (window as any).__activeRockField = null;
          }
        } catch (e) {}

        console.log(`[TrialsController] Completed Phase ${i + 1}: ${phase.name}`);
        try {
          if (this.manager && typeof this.manager.displayLore === 'function') {
            this.manager.displayLore(phase.name.toLowerCase().replace(/\s+/g, '-'));
          }
        } catch (e) {}
      }

      // Stream reset sequence
      demoProgress.currentPhase = 'Stream Reset';
      console.log('[TrialsController] Entering stream reset sequence');
      const streamReset = new StreamReset();
      await streamReset.run();

      // Cave maze finale
      demoProgress.currentPhase = 'Cave Maze';
      console.log('[TrialsController] Entering cave maze');
      const caveMaze = new CaveMaze(Date.now()); // Use timestamp as seed
      await caveMaze.run();

      // Mark completion
      demoProgress.completedRoutes.add('trials-of-gorstan');
      demoProgress.currentPhase = null;

      console.log('[TrialsController] Trials of Gorstan completed successfully');
    } catch (error) {
      console.error('[TrialsController] Trial failed:', error);
      throw error;
    }
  }

  getCurrentPhase(): string {
    if (this.currentPhase < this.phases.length) {
      const phase = this.phases[this.currentPhase];
      return phase ? phase.name : 'Unknown';
    }
    return 'Complete';
  }

  getProgress(): number {
    return this.currentPhase / (this.phases.length + 2); // +2 for stream reset and cave
  }
}
