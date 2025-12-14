/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Cave maze generator with hidden artifact completion
*/

import { Artifact } from './Artifact';
import { pickRandom } from '../../utils/random';

export interface CaveTile {
  x: number;
  y: number;
  type: 'wall' | 'floor' | 'entrance' | 'artifact';
  visited: boolean;
  illuminated: boolean;
}

export interface MazeLayout {
  width: number;
  height: number;
  tiles: CaveTile[][];
  entrance: { x: number; y: number };
  artifactLocation: { x: number; y: number };
}

export class CaveMaze {
  private maze: MazeLayout;
  private playerPos: { x: number; y: number };
  private artifact: Artifact;
  private readonly seed: number;

  constructor(seed: number) {
    this.seed = seed;
    this.maze = this.generateMaze();
    this.playerPos = { ...this.maze.entrance };
    this.artifact = new Artifact(this.maze.artifactLocation);
  }

  async run(): Promise<void> {
    console.log('[CaveMaze] Entering the ancient cave system...');

    return new Promise((resolve) => {
      this.displayCaveIntro();

      // Start maze exploration
      setTimeout(() => {
        this.beginExploration(resolve);
      }, 2000);
    });
  }

  private generateMaze(): MazeLayout {
    const width = 21; // Odd number for proper maze generation
    const height = 15;

    // Initialize with all walls (build rows explicitly to avoid undefined indexing)
    const tiles: CaveTile[][] = [];
    for (let y = 0; y < height; y++) {
      const row: CaveTile[] = [];
      for (let x = 0; x < width; x++) {
        row.push({
          x,
          y,
          type: 'wall',
          visited: false,
          illuminated: false,
        });
      }
      tiles.push(row);
    }

    // Generate maze using recursive backtracking
    this.carveMaze(tiles, 1, 1, width, height);

    // Set entrance
    const entrance = { x: 1, y: 1 };
    const entranceRow = tiles[entrance.y];
    if (entranceRow) {
      const entranceTile = entranceRow[entrance.x];
      if (entranceTile) entranceTile.type = 'entrance';
    }

  // Place artifact in a dead end (fall back to entrance if none found)
  const artifactLocation = this.findGoodArtifactLocation(tiles, width, height);
    const finalArtifactLocation = artifactLocation ?? entrance;
    const artRow = tiles[finalArtifactLocation.y];
    if (artRow) {
      const artTile = artRow[finalArtifactLocation.x];
      if (artTile) artTile.type = 'artifact';
    }

    return {
      width,
      height,
      tiles,
      entrance,
      artifactLocation: finalArtifactLocation,
    };
  }

  private carveMaze(
    tiles: CaveTile[][],
    x: number,
    y: number,
    width: number,
    height: number,
  ): void {
    // Seeded random number generator
    const random = this.seededRandom();

  if (!tiles[y] || !tiles[y][x]) return;
  tiles[y][x].type = 'floor';
  tiles[y][x].visited = true;

    // Define directions (up, right, down, left)
    const directions = [
      { dx: 0, dy: -2 },
      { dx: 2, dy: 0 },
      { dx: 0, dy: 2 },
      { dx: -2, dy: 0 },
    ];

    // Shuffle directions for randomness (safe swap)
    for (let i = directions.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      const a = directions[i];
      const b = directions[j];
      if (a && b) {
        directions[i] = b;
        directions[j] = a;
      }
    }

    // Try each direction
    for (const dir of directions) {
      const newX = x + dir.dx;
      const newY = y + dir.dy;

      // Check bounds
      if (
        newX > 0 &&
        newX < width - 1 &&
        newY > 0 &&
        newY < height - 1 &&
        tiles[newY] &&
        tiles[newY][newX]
      ) {
        if (!tiles[newY][newX].visited) {
          // Carve path between current and new cell
          const midY = y + dir.dy / 2;
          const midX = x + dir.dx / 2;
          if (tiles[midY] && tiles[midY][midX]) {
            tiles[midY][midX].type = 'floor';
          }
          this.carveMaze(tiles, newX, newY, width, height);
        }
      }
    }
  }

  private seededRandom(): () => number {
    let seed = this.seed;
    return function () {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  }

  private findGoodArtifactLocation(
    tiles: CaveTile[][],
    width: number,
    height: number,
  ): { x: number; y: number } {
    const floorTiles: { x: number; y: number }[] = [];

    // Find all floor tiles
    for (let y = 1; y < height - 1; y++) {
      const row = tiles[y];
      if (!row) continue;
      for (let x = 1; x < width - 1; x++) {
        const t = row[x];
        if (!t) continue;
        if (t.type === 'floor') {
          floorTiles.push({ x, y });
        }
      }
    }

  // Find a tile that's reasonably far from entrance and preferably a dead end
  if (floorTiles.length === 0) return { x: 1, y: 1 };

  let bestLocation: { x: number; y: number } = { x: 1, y: 1 };
  let bestScore = 0;

  if (floorTiles.length > 0) bestLocation = floorTiles[0] || bestLocation;

  floorTiles.forEach((tile) => {
      // Distance from entrance
      const distance = Math.abs(tile.x - 1) + Math.abs(tile.y - 1);

      // Count adjacent floor tiles (prefer dead ends)
      let adjacentFloors = 0;
      const adjacent = [
        { x: tile.x - 1, y: tile.y },
        { x: tile.x + 1, y: tile.y },
        { x: tile.x, y: tile.y - 1 },
        { x: tile.x, y: tile.y + 1 },
      ];

      adjacent.forEach((adj) => {
        if (adj.x >= 0 && adj.x < width && adj.y >= 0 && adj.y < height) {
          const adjRow = tiles[adj.y];
          const adjTile = adjRow ? adjRow[adj.x] : undefined;
          if (adjTile && adjTile.type === 'floor') {
            adjacentFloors++;
          }
        }
      });

      // Score: prefer distant locations with fewer connections (dead ends)
      const score = distance * (4 - adjacentFloors);

      if (score > bestScore) {
        bestScore = score;
        bestLocation = tile;
      }
    });

  return bestLocation;
  }

  private displayCaveIntro(): void {
    console.log('═══════════════════════════════════════');
    console.log('        THE ANCIENT CAVE DEPTHS');
    console.log('═══════════════════════════════════════');
    console.log('Stone walls stretch into darkness...');
    console.log('The air is cool and still.');
    console.log('Something valuable lies hidden here.');
    console.log('Your footsteps echo in the silence.');
    console.log('');
  }

  private beginExploration(resolve: () => void): void {
    console.log('[CaveMaze] Beginning cave exploration...');

    let explorationSteps = 0;
    const maxSteps = 15; // Limit exploration for demo timing

    const exploreInterval = setInterval(() => {
      explorationSteps++;

      this.simulateExplorationStep();

      // Check if artifact found
      if (this.checkArtifactDiscovery()) {
        clearInterval(exploreInterval);
        this.artifact.onPickup();
        resolve();
        return;
      }

      // Safety timeout
      if (explorationSteps >= maxSteps) {
        clearInterval(exploreInterval);
        console.log('[CaveMaze] After thorough exploration, you discover...');
        this.artifact.onPickup();
        resolve();
      }
    }, 1000);
  }

  private simulateExplorationStep(): void {
    // Simulate movement through the maze
    const directions = [
      { dx: 1, dy: 0, desc: 'east' },
      { dx: -1, dy: 0, desc: 'west' },
      { dx: 0, dy: 1, desc: 'south' },
      { dx: 0, dy: -1, desc: 'north' },
    ];

    // Try to move in a valid direction
    const validMoves = directions.filter((dir) => {
      const newX = this.playerPos.x + dir.dx;
      const newY = this.playerPos.y + dir.dy;
      return this.isValidPosition(newX, newY);
    });

    if (validMoves.length > 0) {
      const move = pickRandom(validMoves);
      if (!move) return; // defensive - abort if no selection

      this.playerPos.x += move.dx;
      this.playerPos.y += move.dy;

      // Illuminate current position (guard row/index access)
      const row = this.maze.tiles[this.playerPos.y];
      const tile = row ? row[this.playerPos.x] : undefined;
      if (tile) tile.illuminated = true;

      // Generate exploration flavor text
      const explorationTexts = [
        `Moving ${move.desc} through a narrow passage...`,
        `The ${move.desc} tunnel opens into a wider chamber...`,
        `Following a ${move.desc} corridor deeper into the cave...`,
        `Stone carvings line the ${move.desc} wall...`,
        `A cool breeze flows from the ${move.desc}...`,
      ];

      const text = pickRandom(explorationTexts) ?? '';
      console.log(`[CaveMaze] ${text}`);
    } else {
      console.log('[CaveMaze] Dead end - backtracking...');
      // Simple backtrack logic
      this.playerPos.x = Math.max(1, this.playerPos.x - 1);
    }
  }

  private isValidPosition(x: number, y: number): boolean {
    if (x < 0 || x >= this.maze.width || y < 0 || y >= this.maze.height) {
      return false;
    }
    const row = this.maze.tiles[y];
    if (!row) return false;
    const tile = row[x];
    if (!tile) return false;

    return (
      tile.type === 'floor' || tile.type === 'entrance' || tile.type === 'artifact'
    );
  }

  private checkArtifactDiscovery(): boolean {
    const distance =
      Math.abs(this.playerPos.x - this.maze.artifactLocation.x) +
      Math.abs(this.playerPos.y - this.maze.artifactLocation.y);

    return distance <= 1; // Adjacent to or on artifact tile
  }

  // Public getters
  getMaze(): MazeLayout {
    return { ...this.maze };
  }

  getPlayerPosition(): { x: number; y: number } {
    return { ...this.playerPos };
  }

  getArtifact(): Artifact {
    return this.artifact;
  }
}
