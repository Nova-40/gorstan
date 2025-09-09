export type Item = {
  id: string;
  name: string;
  description: string;
  effect: (player: Player) => void;
};

export class Player {
  health: number;
  mana: number;
  inventory: Item[];
  level: number;
  experience: number;

  constructor() {
    this.health = 100;
    this.mana = 50;
    this.inventory = [];
    this.level = 1;
    this.experience = 0;
  }

  takeDamage(amount: number): void {
    this.health -= amount;
    if (this.health < 0) {
      this.health = 0;
    }
  }

  useMana(amount: number): boolean {
    if (this.mana >= amount) {
      this.mana -= amount;
      return true;
    }
    return false;
  }

  addItem(item: Item): void {
    this.inventory.push(item);
    console.log(`${item.name} added to inventory.`);
  }

  removeItem(itemId: string): void {
    this.inventory = this.inventory.filter((item) => item.id !== itemId);
    console.log(`Item with ID ${itemId} removed from inventory.`);
  }

  listInventory(): void {
    console.log('Inventory:', this.inventory.map((item) => item.name).join(', '));
  }

  gainExperience(amount: number): void {
    this.experience += amount;
    console.log(`Gained ${amount} experience points.`);

    if (this.experience >= this.level * 100) {
      this.levelUp();
    }
  }

  private levelUp(): void {
    this.level++;
    this.experience = 0;
    this.health += 20; // Example: Increase health on level up
    this.mana += 10; // Example: Increase mana on level up
    console.log(`Level up! You are now level ${this.level}.`);
  }
}
