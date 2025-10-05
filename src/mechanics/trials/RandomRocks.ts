/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Phase 2: Random-movement rocks to dodge
*/

export interface MovingRock {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  active: boolean;
}

export class RandomRocks {
  public manager: any;
  private rocks: MovingRock[] = [];
  private fieldWidth = 30;
  private fieldHeight = 20;
  private playerPos = { x: 2, y: 10 };
  private exitPos = { x: 28, y: 10 };
  private running = false;
  private deathCount = 0;

  constructor() {
    this.initializeRocks();
    console.log('[RandomRocks] constructor: initialized rocks count=', this.rocks.length);
  }

  async run(): Promise<void> {
    console.log('[RandomRocks] Starting random-rocks phase');
    return new Promise((resolve, reject) => {
      this.displayPhaseIntro();
      this.running = true;

      // Start rock movement simulation
      const moveInterval = setInterval(() => {
        // Occasionally telegraph a large fall or burst
        if (Math.random() < 0.06) {
          // brief UI flash hint
          try {
            // @ts-ignore
            (window as any).__flashWarning = { type: 'rocks', time: Date.now() };
          } catch (e) {}
          console.log('[RandomRocks] ⚠️  Rocks rumble above — a barrage is coming!');
        }

        this.updateRocks();
        this.checkCollisions();

        // Simulate player movement toward exit (less likely to escape quickly)
        if (Math.random() < 0.15) {
          this.movePlayerTowardExit();
        }

        // Check if player reached exit
        if (this.isNearExit()) {
          clearInterval(moveInterval);
          this.running = false;
          console.log('[RandomRocks] Successfully dodged through the chaos!');
          resolve();
          return;
        }

        // Check for player death (collision too close)
        const playerDead = this.rocks.some((r) => {
          const d = Math.sqrt(Math.pow(r.x - this.playerPos.x, 2) + Math.pow(r.y - this.playerPos.y, 2));
          return d < 0.6; // death threshold
        });

          if (playerDead) {
            const over = this.manager ? this.manager.recordDeath() : false;
            console.log('[RandomRocks] You were hit!');

            if (over || (this.manager && this.manager.isGameOver && this.manager.isGameOver())) {
              clearInterval(moveInterval);
              this.running = false;
              console.log('[RandomRocks] Game Over - too many deaths');
              reject(new Error('GAME_OVER'));
              return;
            }

            // Reset phase state to let player try again
            this.resetPhaseAfterDeath();
          }
      }, 150);

      // Safety timeout shortened but less reliable due to increased difficulty
      setTimeout(() => {
        if (this.running) {
          clearInterval(moveInterval);
          this.running = false;
          console.log('[RandomRocks] Found a risky moment to dash to the exit!');
          resolve();
        }
      }, 6000);
    });
  }

  private resetPhaseAfterDeath(): void {
    // Respawn player near start and nudge rocks to new positions for another attempt
    this.playerPos = { x: 2, y: 10 };
    // Reduce fragment activity and re-seed some rocks
    this.rocks = this.rocks
      .filter((r) => r.size > 0.9)
      .map((r, idx) => ({
        ...r,
        x: Math.random() * this.fieldWidth,
        y: Math.random() * this.fieldHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        active: true,
        id: idx,
      }));

    console.log('[RandomRocks] Phase reset after death - try again');
  }

  private initializeRocks(): void {
    // Increase rock density and baseline speed for higher challenge
    const rockCount = 18;

    for (let i = 0; i < rockCount; i++) {
      // Rocks now 'float' across the field with a bias so they cross player's path more often
      const angle = Math.random() * Math.PI * 2;
      const speedBase = 0.6 + Math.random() * 1.8; // faster baseline

      const newRock = {
        id: i,
        x: Math.random() * this.fieldWidth,
        y: Math.random() * this.fieldHeight,
        vx: Math.cos(angle) * speedBase,
        vy: Math.sin(angle) * speedBase,
        size: 1 + Math.random() * 2,
        active: true,
      };
      this.rocks.push(newRock);
      // spawn-level debug
      // eslint-disable-next-line no-console
      console.log(`[RandomRocks] initializeRocks: rock id=${newRock.id} pos=(${newRock.x.toFixed(2)},${newRock.y.toFixed(2)}) speed=${speedBase.toFixed(2)} size=${newRock.size.toFixed(2)}`);
    }
  }

  private displayPhaseIntro(): void {
    console.log('═══════════════════════════════════════');
    console.log('  PHASE 2: THE CHAOS OF MOVING STONES');
    console.log('═══════════════════════════════════════');
    console.log('The rocks here follow no pattern...');
    console.log('They roll and tumble with chaotic timing.');
    console.log('Watch for safe pockets and sprint when clear!');
    console.log('');
  }

  private updateRocks(): void {
    this.rocks.forEach((rock) => {
      if (!rock.active) {
        return;
      }

      // Update position
      rock.x += rock.vx;
      rock.y += rock.vy;

      // Bounce off boundaries
      if (rock.x <= 0 || rock.x >= this.fieldWidth) {
        rock.vx *= -1;
        rock.x = Math.max(0, Math.min(this.fieldWidth, rock.x));
      }
      if (rock.y <= 0 || rock.y >= this.fieldHeight) {
        rock.vy *= -1;
        rock.y = Math.max(0, Math.min(this.fieldHeight, rock.y));
      }

      // Occasional direction change
      if (Math.random() < 0.1) {
        // Rocks can suddenly speed up or jitter, increasing unpredictability
        rock.vx += (Math.random() - 0.5) * 1.2;
        rock.vy += (Math.random() - 0.5) * 1.2;

        // Keep velocity capped at a higher limit
        const speed = Math.sqrt(rock.vx * rock.vx + rock.vy * rock.vy);
        if (speed > 5) {
          rock.vx = (rock.vx / speed) * 5;
          rock.vy = (rock.vy / speed) * 5;
        }
      }
    });

    // Occasional log of movement
    if (Math.random() < 0.1) {
      const messages = [
        'A boulder crashes past, just missing you...',
        'Stones tumble in chaotic patterns...',
        'You spot a brief opening ahead...',
        'Rocks ricochet off each other nearby...',
        'The ground trembles with rolling stone...',
      ];
      console.log(`[RandomRocks] ${messages[Math.floor(Math.random() * messages.length)]}`);
    }
  }

  private checkCollisions(): void {
    // Check for near-misses and rock-on-rock collisions. Rocks can break into faster fragments on collision.
    const newFragments: MovingRock[] = [];

    this.rocks.forEach((rock, idx) => {
      // Player proximity checks
      const distance = Math.sqrt(
        Math.pow(rock.x - this.playerPos.x, 2) + Math.pow(rock.y - this.playerPos.y, 2),
      );

      if (distance < rock.size + 1.2 && distance > rock.size + 0.4) {
        if (Math.random() < 0.5) {
          console.log('[RandomRocks] Close scrape! A rock tears past your shoulder...');
        }
      }

      // Rock-on-rock collisions produce fragments
      for (let j = idx + 1; j < this.rocks.length; j++) {
        const other = this.rocks[j];
        if (!other) continue;
        if (!other.active) continue;

        const d = Math.sqrt(Math.pow(rock.x - other.x, 2) + Math.pow(rock.y - other.y, 2));
        if (d < (rock.size + other.size) * 0.8) {
          // Collision: both rocks break into fragments with higher velocity
          rock.active = false;
          other.active = false;

          const fragmentCount = 3 + Math.floor(Math.random() * 3);
          for (let f = 0; f < fragmentCount; f++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1.5 + Math.random() * 3.5; // fragments are faster
            newFragments.push({
              id: Date.now() + Math.floor(Math.random() * 10000) + f,
              x: (rock.x + other.x) / 2,
              y: (rock.y + other.y) / 2,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              size: 0.5 + Math.random() * 1.2,
              active: true,
            });
          }

          console.log('[RandomRocks] Collision! Rocks shatter into dangerous fragments!');
        }
      }
    });

    // Add fragments to rock list
    if (newFragments.length > 0) {
      this.rocks = this.rocks.concat(newFragments);
    }

    // Remove inactive rocks occasionally to avoid uncontrolled growth
    this.rocks = this.rocks.filter((r) => r.active && !Number.isNaN(r.x) && !Number.isNaN(r.y));
  }

  private movePlayerTowardExit(): void {
    const dx = this.exitPos.x - this.playerPos.x;
    const dy = this.exitPos.y - this.playerPos.y;

    // Move cautiously toward exit, avoiding rocks
    const stepSize = 0.5;
    if (Math.abs(dx) > Math.abs(dy)) {
      this.playerPos.x += dx > 0 ? stepSize : -stepSize;
    } else {
      this.playerPos.y += dy > 0 ? stepSize : -stepSize;
    }
  }

  private isNearExit(): boolean {
    const distance = Math.sqrt(
      Math.pow(this.exitPos.x - this.playerPos.x, 2) +
        Math.pow(this.exitPos.y - this.playerPos.y, 2),
    );
    return distance < 2;
  }

  getRocks(): MovingRock[] {
    return [...this.rocks];
  }

  getPlayerPosition(): { x: number; y: number } {
    return { ...this.playerPos };
  }
}
