import { GameStateManager } from './GameStateManager';
import { MagicSystem } from './MagicSystem';
import { Player } from '../state/Player';
import { Room } from '../types/Room';

export class FinalBattle {
  private gameState: GameStateManager;
  private magicSystem: MagicSystem;
  private player: Player;
  private entityHealth: number;
  private currentPhase: number;

  constructor(gameState: GameStateManager, magicSystem: MagicSystem, player: Player) {
    this.gameState = gameState;
    this.magicSystem = magicSystem;
    this.player = player;
    this.entityHealth = 1000; // Example health value
    this.currentPhase = 1;
  }

  public startBattle(room: Room): void {
    if (!this.gameState.isMagicUnlocked()) {
      throw new Error('Magic system must be unlocked to start the final battle.');
    }

    console.log('The final battle begins!');
    this.initiatePhase(room);
  }

  private initiatePhase(room: Room): void {
    console.log(`Phase ${this.currentPhase} begins!`);

    // Example phase logic
    if (this.currentPhase === 1) {
      this.entityHealth -= this.magicSystem.castSpell('fireball', this.player);
    } else if (this.currentPhase === 2) {
      this.entityHealth -= this.magicSystem.castSpell('lightning', this.player);
    }

    if (this.entityHealth <= 0) {
      this.endBattle(true);
    } else {
      this.currentPhase++;
      if (this.currentPhase > 2) {
        this.currentPhase = 1; // Loop phases for simplicity
      }
      this.initiatePhase(room);
    }
  }

  private endBattle(victory: boolean): void {
    if (victory) {
      console.log('The Entity is defeated! The world is saved!');
      this.gameState.setGameOver(true, 'victory');
    } else {
      console.log('The Entity has consumed the world. You have failed.');
      this.gameState.setGameOver(true, 'defeat');
    }
  }
}
