/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  You may play Gorstan for free for personal entertainment only.
  You may NOT copy, redistribute, modify, or sell the game, its code, 
  artwork, storyline, or any other part without written permission.
  
  Gorstan includes third-party libraries and assets:
    - React © Meta Platforms, Inc. – MIT Licence
    - Lucide Icons © Lucide Contributors – ISC Licence
    - Flaticon icons © Flaticon.com – Free Licence with attribution
    - Other packages under their respective licences (see package.json)

  Full licence terms: see EULA.md in the project root.
*/

// Minimal RoomObjectivesManager for tutorial system
export interface RoomObjective {
  id: string;
  description: string;
  completed?: boolean;
  points?: number;
}

export class RoomObjectivesManager {
  private objectives: Record<string, RoomObjective[]> = {};

  addObjective(roomId: string, objective: RoomObjective) {
    if (!this.objectives[roomId]) this.objectives[roomId] = [];
    if (!this.objectives[roomId].some(o => o.id === objective.id)) {
      this.objectives[roomId].push({ ...objective });
    }
  }

  list(roomId: string): RoomObjective[] { return this.objectives[roomId] ? [...this.objectives[roomId]] : []; }
  complete(roomId: string, id: string) {
    const list = this.objectives[roomId];
    if (!list) return;
    const obj = list.find(o => o.id === id);
    if (obj) obj.completed = true;
  }
}
