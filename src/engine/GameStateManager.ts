import { MagicSystem } from './MagicSystem';
import { wanderingShadows } from '../npc/index';
import { Player } from '../state/Player';

export type RoomId = string;
export type PlayerState = {
  currentRoom: RoomId;
  objectivesCompleted: Set<string>;
  trapsTriggered: Set<string>;
};

export class GameStateManager {
  private static instance: GameStateManager;
  private playerState: PlayerState;
  private magicSystem: MagicSystem | null = null;
  private countdown: number = 600; // Example: 10 minutes in seconds
  private countdownInterval: NodeJS.Timeout | null = null;
  private player: Player | null = null;

  private constructor() {
    this.playerState = {
      currentRoom: 'room:hub',
      objectivesCompleted: new Set(),
      trapsTriggered: new Set(),
    };
  }

  static getInstance(): GameStateManager {
    if (!GameStateManager.instance) {
      GameStateManager.instance = new GameStateManager();
    }
    return GameStateManager.instance;
  }

  getPlayerState(): PlayerState {
    return this.playerState;
  }

  updateCurrentRoom(roomId: RoomId): void {
    this.playerState.currentRoom = roomId;
  }

  completeObjective(objectiveId: string): void {
    this.playerState.objectivesCompleted.add(objectiveId);
  }

  triggerTrap(trapId: string): void {
    this.playerState.trapsTriggered.add(trapId);
  }

  activateMagicSystem(initialMana: number): void {
    this.magicSystem = new MagicSystem(initialMana);
    console.log('Magic system activated');
  }

  getMagicSystem(): MagicSystem | null {
    return this.magicSystem;
  }

  checkForWanderingShadows(): void {
    if (this.magicSystem && this.magicSystem.getSpells().length > 0) {
      const randomShadow = wanderingShadows.length ? wanderingShadows[Math.floor(Math.random() * wanderingShadows.length)] : undefined;
      if (randomShadow?.name) {
        console.log(`A ${randomShadow.name} has appeared in the room!`);
      }
    }
  }

  isMagicUnlocked(): boolean {
    return this.magicSystem !== null;
  }

  setGameOver(_isOver: boolean, outcome: 'victory' | 'defeat'): void {
    console.log(`Game Over: ${outcome}`);
    // Additional logic for handling game over state can be added here
  }

  applyFailurePenalty(): void {
    const player = this.getPlayer();
    if (player) {
      player.takeDamage(20); // Example penalty: reduce health by 20
      console.log('Failure penalty applied: -20 health');

      if (player.health <= 0) {
        this.setGameOver(true, 'defeat');
      }
    }
  }

  resetProgress(areaId: string): void {
    console.log(`Progress in area ${areaId} has been reset.`);
    // Logic to reset objectives or respawn enemies in the specified area
  }

  startCountdown(): void {
    console.log('Countdown to the Entity awakening has begun!');
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown % 60 === 0) {
        console.log(`Time remaining: ${Math.floor(this.countdown / 60)} minutes.`);
      }

      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval!);
        this.triggerCatastrophe();
      }
    }, 1000);
  }

  private triggerCatastrophe(): void {
    console.log('The Entity has fully awakened! The world is consumed.');
    this.setGameOver(true, 'defeat');
  }

  setPlayer(player: Player): void {
    this.player = player;
  }

  getPlayer(): Player | null {
    return this.player;
  }
}
