/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Phase 1: Rock gauntlet with jagged formations and pathfinding lanes
*/

export interface TileMap {
  width: number;
  height: number;
  tiles: number[][];
  playerPos: { x: number; y: number };
}

interface RollingRock {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  size: number;
}

export class RockField {
  public manager: any;
  private map: TileMap;
  private readonly ROCK_TILE = 1;
  private readonly PATH_TILE = 0;
  private readonly EXIT_TILE = 2;
  
  // Rolling rocks that traverse the field during the phase
  private rollingRocks: RollingRock[] = [];
  private nextRockId = 0;
  private rollingRunning = false;
  private deathCount = 0;
  private playerHasMoved = false;
  private readonly safeZone = { x: 0, y: 0, radius: 1.6 };
  // default bounce factor (multiplier applied to velocity when deflecting)
  private readonly defaultBounceFactor = 1.2;

  constructor() {
    this.map = this.generateRockField();
    this.initializeRollingRocks();
    console.log('[RockField] constructor: initialized map and rollingRocks count=', this.rollingRocks.length);
  }

  async run(): Promise<void> {
    console.log('[RockField] Starting rock gauntlet phase');

    return new Promise((resolve, reject) => {
      this.displayPhaseIntro();

      // Spawn a small scout rock immediately so the UI shows movement before player moves
      setTimeout(() => {
        try {
          this.spawnWave(1, 0.6);
        } catch (e) {}
      }, 300);

      // Ensure player starts at manager-defined start if present
      if (this.manager && this.manager.playerStart) {
        this.map.playerPos = { ...this.manager.playerStart };
      }

      // Reset death counter for the phase
      this.deathCount = 0;

  // Wave-based spawning: spawn 3 waves, each larger and faster — start only after player moves
  let currentWave = 0;
  const totalWaves = 3;
  let waveInterval: ReturnType<typeof setInterval> | undefined;

      const waitForPlayerMove = (): Promise<void> => {
        return new Promise((res) => {
          if (this.playerHasMoved) return res();
          const check = setInterval(() => {
            if (this.playerHasMoved) {
              clearInterval(check);
              res();
            }
          }, 120);
        });
      };

      // Start waves after first movement
      waitForPlayerMove().then(() => {
        waveInterval = setInterval(() => {
            if (currentWave >= totalWaves) {
            if (waveInterval) clearInterval(waveInterval);
            // Give final run time for rolling rocks to clear
            setTimeout(() => {
              this.rollingRunning = false;
                console.log('[RockField] Successfully navigated the rock gauntlet');
              resolve();
            }, 1500);
            return;
          }

          currentWave += 1;
          // spawn wave with count and speed scaling with wave index
          const count = 4 + currentWave * 3; // 7,10,13
          const speedBase = 0.3 + currentWave * 0.5; // increases per wave
          this.spawnWave(count, speedBase);
        }, 1800);
      });

      // Start rolling simulation
      this.rollingRunning = true;

      // Tick to update rocks and check lethal collisions
      const rockTick = setInterval(() => {
        this.updateRollingRocks();

        // Check for lethal collision with player
        const playerDead = this.rollingRocks.some((r) => {
          const d = Math.sqrt(Math.pow(r.x - this.map.playerPos.x, 2) + Math.pow(r.y - this.map.playerPos.y, 2));
          return d < Math.max(0.5, r.size * 0.5);
        });

        if (playerDead) {
          const over = this.manager ? this.manager.recordDeath() : false;
          console.log('[RockField] You were crushed by a rolling rock!');

          if (over || (this.manager && this.manager.isGameOver && this.manager.isGameOver())) {
            clearInterval(rockTick);
            if (waveInterval) clearInterval(waveInterval);
            this.rollingRunning = false;
            console.log('[RockField] Game Over - too many deaths');
            reject(new Error('GAME_OVER'));
            return;
          }

          // Reset some rocks and player position for retry
          this.resetAfterDeath();
        }
      }, 180);
    });
  }

  private generateRockField(): TileMap {
  // Match the primary UI grid (40x25) so movement and rendering align
  const width = 40;
  const height = 25;
    const tiles: number[][] = [];

    // Create maze-like rock formation with paths
    for (let y = 0; y < height; y++) {
      const row: number[] = [];
      for (let x = 0; x < width; x++) {
        // Fill with placeholder for now; we'll carve a guaranteed path below
        row[x] = this.ROCK_TILE;
      }
      tiles[y] = row;
    }

    // Carve a guaranteed, wiggly path from player start (0,0) to exit (width-1,height-1)
  let cx = 0;
  let cy = 0;
  // ensure first row exists and write via local row reference
  if (!tiles[0]) tiles[0] = new Array(width).fill(this.ROCK_TILE);
  let row = tiles[0]!;
  row[cx] = this.PATH_TILE;
    while (cx !== width - 1 || cy !== height - 1) {
      // bias toward the exit but allow lateral movement for variety
      const dx = (width - 1) - cx;
      const dy = (height - 1) - cy;

      const canMoveRight = dx > 0;
      const canMoveDown = dy > 0;

      // Weighted random choice: prefer moving toward exit but sometimes sideways
      const r = Math.random();
      if (canMoveRight && (r < 0.55 || !canMoveDown)) {
        cx += 1;
      } else if (canMoveDown) {
        cy += 1;
      } else if (canMoveRight) {
        cx += 1;
      }

      // Carve current step
  // ensure row exists before writing
  if (!tiles[cy]) tiles[cy] = new Array(width).fill(this.ROCK_TILE);
  row = tiles[cy]!;
  row[cx] = this.PATH_TILE;

      // Occasionally widen the path for a small clearing (increase chance)
        if (Math.random() < 0.32) {
        const left = Math.max(0, cx - 1);
        const right = Math.min(width - 1, cx + 1);
        const up = Math.max(0, cy - 1);
        const down = Math.min(height - 1, cy + 1);
        if (!tiles[cy]) tiles[cy] = new Array(width).fill(this.ROCK_TILE);
        const rowHere = tiles[cy]!;
        rowHere[left] = this.PATH_TILE;
        rowHere[right] = this.PATH_TILE;
        if (!tiles[up]) tiles[up] = new Array(width).fill(this.ROCK_TILE);
        const rowUp = tiles[up]!;
        rowUp[cx] = this.PATH_TILE;
        if (!tiles[down]) tiles[down] = new Array(width).fill(this.ROCK_TILE);
        const rowDown = tiles[down]!;
        rowDown[cx] = this.PATH_TILE;
      }
    }

    // Ensure top-left safe zone is clear
    const safeRadius = Math.ceil(this.safeZone.radius) + 1;
    for (let sy = 0; sy <= safeRadius && sy < height; sy++) {
      if (!tiles[sy]) tiles[sy] = new Array(width).fill(this.ROCK_TILE);
      const safeRow = tiles[sy]!;
      for (let sx = 0; sx <= safeRadius && sx < width; sx++) {
        safeRow[sx] = this.PATH_TILE;
      }
    }

    // Fill remaining tiles with a lower rock density and avoid overwriting carved path
    let rockCount = 0;
    for (let y = 0; y < height; y++) {
      if (!tiles[y]) tiles[y] = new Array(width).fill(this.ROCK_TILE);
      const rowY = tiles[y]!;
      for (let x = 0; x < width; x++) {
        if (rowY[x] === this.PATH_TILE) continue;
        // Keep rock density moderate (roughly 25%) to avoid solid fields
        const isRock = Math.random() < 0.25;
        rowY[x] = isRock ? this.ROCK_TILE : this.PATH_TILE;
        if (isRock) rockCount++;
      }
    }

    // Debug: log rough rock density
    const totalTiles = width * height;
    const density = ((rockCount / totalTiles) * 100).toFixed(1);
    console.log(`[RockField] generateRockField: carved path and filled field. rock density=${density}%`);

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
    console.log('  PHASE 1: THE ROCK GAUNTLET');
    console.log('═══════════════════════════════════════');
    console.log('Jagged formations loom ahead.');
    console.log('One wrong step could mean a painful scrape.');
    console.log('Find the safe paths between the stones...');
    console.log('');
  }

  private initializeRollingRocks(): void {
    // Start empty; waves will spawn rocks during run
    this.rollingRocks = [];
  }

  private spawnWave(count: number, speedBase: number): void {
  for (let i = 0; i < count; i++) {
      // Decide spawn edge and location but avoid the safe zone around top-left
      const fromLeft = Math.random() < 0.5;
      // spawn just off the horizontal bounds so rocks are visible as they enter
      const spawnX = fromLeft ? -1 : this.map.width + 1;
      // pick a Y across the playfield height
      let spawnY = Math.max(0.5, Math.min(this.map.height - 0.5, 1 + Math.random() * (this.map.height - 2)));

      // If spawn is too close to the safe zone, nudge it away
      const sdx0 = spawnX - this.safeZone.x;
      const sdy0 = spawnY - this.safeZone.y;
      const sdist0 = Math.sqrt(sdx0 * sdx0 + sdy0 * sdy0);
      if (sdist0 < this.safeZone.radius + 1) {
        spawnY = this.safeZone.radius + 1 + Math.random() * (this.map.height - this.safeZone.radius - 2);
      }

      // aim approximately toward the center of the map with some spread so rocks cross the playfield
      const centerX = this.map.width / 2;
      const centerY = this.map.height / 2;
      const aimAngle = Math.atan2(centerY - spawnY, centerX - spawnX);
      const spread = (Math.random() - 0.5) * 0.8; // +/- ~0.4 rad random spread
      const angle = aimAngle + spread;
      const speed = speedBase + Math.random() * (speedBase * 0.6);
      const id = this.nextRockId++;
      const rock = {
        id,
        x: spawnX,
        y: spawnY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        speed,
        size: 0.7 + Math.random() * 1.4,
      } as RollingRock;
      this.rollingRocks.push(rock);
      // spawn-level debug
      // eslint-disable-next-line no-console
      console.log(`[RockField] spawnWave: rock id=${rock.id} pos=(${rock.x.toFixed(2)},${rock.y.toFixed(2)}) speed=${rock.speed.toFixed(2)} size=${rock.size.toFixed(2)}`);
    }
    console.log(`[RockField] Wave spawned: count=${count}, speedBase=${speedBase.toFixed(2)}`);
  }

  private updateRollingRocks(): void {
    if (!this.rollingRunning) return;
    // Move and cull rocks that leave the play area
    for (let i = this.rollingRocks.length - 1; i >= 0; i--) {
      const rock = this.rollingRocks[i];
      if (!rock) continue;
      rock.x += rock.vx;
      rock.y += rock.vy;

      // If rock enters safe zone, deflect it away with a bounce and increase volatility
      const sdx = rock.x - this.safeZone.x;
      const sdy = rock.y - this.safeZone.y;
      const sdist = Math.sqrt(sdx * sdx + sdy * sdy);
      // allow manager override of safeZone radius and bounce strength
      const safeRadius = (this.manager && this.manager.safeZoneRadius) || this.safeZone.radius;
      const bounceFactor = (this.manager && this.manager.bounceFactor) || this.defaultBounceFactor;
      if (sdist < safeRadius + Math.max(0.5, rock.size)) {
        // push rock outwards and reverse some velocity
        const nx = sdx / (sdist || 1);
        const ny = sdy / (sdist || 1);
        rock.vx = (Math.abs(rock.vx) + 0.5) * nx * bounceFactor;
        rock.vy = (Math.abs(rock.vy) + 0.3) * ny * (bounceFactor * 0.95);
        // jitter so it doesn't get stuck
        rock.x += nx * (safeRadius + 0.6);
        rock.y += ny * (safeRadius + 0.6);
        // log for debugging
        // eslint-disable-next-line no-console
        console.log(`[RockField] Rock ${rock.id} deflected from safe zone at (${rock.x.toFixed(2)},${rock.y.toFixed(2)}) bounceFactor=${bounceFactor.toFixed(2)} safeRadius=${safeRadius}`);
      }

      // remove rocks that moved far outside bounds
      if (rock.x < -2 || rock.x > this.map.width + 2 || rock.y < -2 || rock.y > this.map.height + 2) {
        this.rollingRocks.splice(i, 1);
        continue;
      }

      // Slight random jitter
      if (Math.random() < 0.06) {
        rock.vx += (Math.random() - 0.5) * 0.3;
        rock.vy += (Math.random() - 0.5) * 0.2;
      }
    }

    // Check rock-rock collisions and either bounce or break into fragments
    for (let i = this.rollingRocks.length - 1; i >= 0; i--) {
      for (let j = i - 1; j >= 0; j--) {
        const a = this.rollingRocks[i];
        const b = this.rollingRocks[j];
        if (!a || !b) continue;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = Math.max(0.1, (a.size + b.size) * 0.5);
        if (dist <= minDist) {
          // collision occurred
          if (Math.random() < 0.5) {
            // bounce: simple velocity swap with jitter
            const nvx = a.vx;
            const nvy = a.vy;
            a.vx = b.vx + (Math.random() - 0.5) * 0.4;
            a.vy = b.vy + (Math.random() - 0.5) * 0.4;
            b.vx = nvx + (Math.random() - 0.5) * 0.4;
            b.vy = nvy + (Math.random() - 0.5) * 0.4;
          } else {
            // break into fragments: remove a and b and spawn smaller faster pieces
            const fragments: RollingRock[] = [];
            const spawnFragments = (source: RollingRock) => {
              const fragCount = 2 + Math.floor(Math.random() * 2); // 2-3
              for (let k = 0; k < fragCount; k++) {
                const ang = Math.random() * Math.PI * 2;
                const spd = (source.speed || 0.3) * (1.2 + Math.random() * 0.8);
                fragments.push({
                  id: this.nextRockId++,
                  x: source.x + (Math.random() - 0.5) * 0.2,
                  y: source.y + (Math.random() - 0.5) * 0.2,
                  vx: Math.cos(ang) * spd,
                  vy: Math.sin(ang) * spd * 0.6,
                  speed: spd,
                  size: Math.max(0.25, source.size * 0.45),
                });
              }
            };

            spawnFragments(a);
            spawnFragments(b);

            // Remove the original two rocks
            // Make sure to remove higher index first
            const removeIdxA = i;
            const removeIdxB = j;
            if (removeIdxA > removeIdxB) {
              this.rollingRocks.splice(removeIdxA, 1);
              this.rollingRocks.splice(removeIdxB, 1);
            } else {
              this.rollingRocks.splice(removeIdxB, 1);
              this.rollingRocks.splice(removeIdxA, 1);
            }

            // Add fragments
            this.rollingRocks.push(...fragments);

            // break out to avoid indexing issues
            break;
          }
        }
      }
    }
  }

  private resetAfterDeath(): void {
    // Reset player position to manager-defined start (or top-left) and remove some rocks to give another chance
    if (this.manager && this.manager.playerStart) {
      this.map.playerPos = { ...this.manager.playerStart };
    } else {
      this.map.playerPos = { x: this.safeZone.x, y: this.safeZone.y };
    }
    // Remove half of current rolling rocks randomly
    this.rollingRocks = this.rollingRocks.filter(() => Math.random() > 0.5);
    console.log('[RockField] Reset after death - rocks thinned for retry');
  }

  // Public getter for UI to render rolling rocks
  getRollingRocks(): { id: number; x: number; y: number; size: number }[] {
    return this.rollingRocks.map((r) => ({ id: r.id, x: r.x, y: r.y, size: r.size }));
  }

  // Called by external controller when the player makes their first move
  onPlayerMove(): void {
    this.playerHasMoved = true;
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
