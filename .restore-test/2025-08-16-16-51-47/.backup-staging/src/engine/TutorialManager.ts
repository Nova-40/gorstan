import { GameStateManager } from './GameStateManager';
import { MagicSystem } from './MagicSystem';
import { Player } from '../state/Player';
import { RoomObjectivesManager } from '../rooms/RoomObjectives';
import { healthPotion } from '../state/Item';

export class TutorialManager {
  private player: Player;

  constructor(
    _gameState: GameStateManager,
    _magicSystem: MagicSystem,
    player: Player,
    _objectivesManager: RoomObjectivesManager
  ) {
    this.player = player;
  }

  public startTutorial(): void {
    console.log('Welcome to the tutorial!');
    this.introduceMovement();
  }

  private introduceMovement(): void {
    console.log('Use the arrow keys or WASD to move between rooms.');
    // Logic to track player movement and confirm completion
    this.introduceCombat();
  }

  private introduceCombat(): void {
    console.log('Engage in combat with a wandering shadow.');
    // Logic to spawn a simple enemy and track combat completion
    this.introduceMagic();
  }

  private introduceMagic(): void {
    console.log('Learn to use the magic system. Cast a fireball spell.');
    // Logic to guide the player through casting a spell
    this.introduceObjectives();
  }

  private introduceObjectives(): void {
    console.log('Complete your first room objective.');
    // Logic to guide the player through completing an objective
    this.introduceInventory();
  }

  private introduceInventory(): void {
    console.log('Learn to manage your inventory.');

    // Add a health potion to the player's inventory
    this.player.addItem(healthPotion);
    this.player.listInventory();

    // Use the health potion
    console.log('Using a health potion...');
    healthPotion.effect(this.player);

    this.introduceProgression();
  }

  private introduceProgression(): void {
    console.log('Learn about progression and leveling up.');

    // Gain experience points
    this.player.gainExperience(120); // Example: Enough to level up

    console.log('Progression tutorial complete.');
    this.concludeTutorial();
  }

  private concludeTutorial(): void {
    console.log('Tutorial complete! You are ready to begin your adventure.');
    // Logic to mark the tutorial as completed in the game state
  }
}
