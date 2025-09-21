/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Phase 1: Knife-like jagged rocks with pathfinding lanes
*/

export interface TileMap {
  width: number;
  height: number;
  tiles: number[][];
  playerPos: { x: number; y: number };
}

export class RockField {
  private map: TileMap;
  private readonly ROCK_TILE = 1;
  private readonly PATH_TILE = 0;
  private readonly EXIT_TILE = 2;

  constructor() {
    this.map = this.generateRockField();
  }

  async run(): Promise<void> {
    console.log('[RockField] Starting knife-rocks phase');

    return new Promise((resolve) => {
      this.displayPhaseIntro();

      // Simulate rock field navigation
      setTimeout(() => {
        console.log('[RockField] Navigating through jagged rock formations...');
        this.simulatePathfinding();

        setTimeout(() => {
          console.log('[RockField] Successfully navigated through the knife-rocks');
          resolve();
        }, 3000);
      }, 2000);
    });
  }

  private generateRockField(): TileMap {
    const width = 20;
    const height = 15;
    const tiles: number[][] = [];

    // Create maze-like rock formation with paths
    for (let y = 0; y < height; y++) {
      const row: number[] = [];
      for (let x = 0; x < width; x++) {
        // Create jagged rock patterns with pathways
        if (x % 3 === 0 || y % 2 === 1) {
          row[x] = this.PATH_TILE;
        } else {
          row[x] = Math.random() < 0.7 ? this.ROCK_TILE : this.PATH_TILE;
        }
      }
      tiles[y] = row;
    }

  // Ensure path to exit (guard existing row)
  const lastRow = tiles[height - 1];
  if (lastRow) lastRow[width - 1] = this.EXIT_TILE;

    return {
      width,
      height,
      tiles,
      playerPos: { x: 0, y: 0 },
    };
  }

  private displayPhaseIntro(): void {
    console.log('═══════════════════════════════════════');
    console.log('  PHASE 1: THE KNIFE-ROCK GAUNTLET');
    console.log('═══════════════════════════════════════');
    console.log('Jagged formations loom ahead.');
    console.log('One wrong step could mean a painful scrape.');
    console.log('Find the safe paths between the stones...');
    console.log('');
  }

  private simulatePathfinding(): void {
    const moves = [
      'Moving cautiously around a sharp outcrop...',
      'Squeezing through a narrow gap...',
      'Stepping carefully over loose shale...',
      'Following a deer path between the rocks...',
      'Avoiding a particularly vicious-looking spire...',
    ];

    moves.forEach((move, index) => {
      setTimeout(() => {
        console.log(`[RockField] ${move}`);
      }, index * 500);
    });
  }

  getMap(): TileMap {
    return { ...this.map };
  }

  isValidMove(x: number, y: number): boolean {
    if (x < 0 || x >= this.map.width || y < 0 || y >= this.map.height) {
      return false;
    }
  const row = this.map.tiles[y];
  if (!row) return false;
  const tile = row[x];
  return tile !== undefined && tile !== this.ROCK_TILE;
  }
}
