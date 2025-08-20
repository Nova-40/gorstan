export type Room = {
  name: string;
  description: string;
  enter: () => void;
};

export class RoomImpl implements Room {
  // Placeholder properties for the Room class
  name: string;
  description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  enter(): void {
    console.log(`You have entered the ${this.name}.`);
  }
}
