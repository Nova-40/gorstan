/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Trials of Gorstan controller - orchestrates the three trial phases
*/

import { RockField } from './RockField';
import { RandomRocks } from './RandomRocks';
import { MushroomField } from './MushroomField';
import { StreamReset } from './StreamReset';
import { CaveMaze } from '../caves/CaveMaze';
import { demoProgress } from '../../engine/state/demoState';

export class TrialsController {
  private currentPhase: number = 0;
  private phases = [
    { name: 'Rock Field', controller: RockField },
    { name: 'Random Rocks', controller: RandomRocks },
    { name: 'Mushroom Field', controller: MushroomField },
  ];

  async run(): Promise<void> {
    console.log('[TrialsController] Starting Trials of Gorstan');
    
    try {
      // Phase 1-3: The trials
      for (let i = 0; i < this.phases.length; i++) {
        this.currentPhase = i;
        demoProgress.currentPhase = this.phases[i].name;
        demoProgress.phaseStartTime = Date.now();
        
        console.log(`[TrialsController] Starting Phase ${i + 1}: ${this.phases[i].name}`);
        
        const phaseController = new this.phases[i].controller();
        await phaseController.run();
        
        console.log(`[TrialsController] Completed Phase ${i + 1}: ${this.phases[i].name}`);
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
      return this.phases[this.currentPhase].name;
    }
    return 'Complete';
  }

  getProgress(): number {
    return this.currentPhase / (this.phases.length + 2); // +2 for stream reset and cave
  }
}
