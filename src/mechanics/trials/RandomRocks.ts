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
  private rocks: MovingRock[] = [];
  private fieldWidth = 30;
  private fieldHeight = 20;
  private playerPos = { x: 2, y: 10 };
  private exitPos = { x: 28, y: 10 };
  private running = false;

  constructor() {
    this.initializeRocks();
  }

  async run(): Promise<void> {
    console.log('[RandomRocks] Starting random-rocks phase');
    
    return new Promise((resolve) => {
      this.displayPhaseIntro();
      this.running = true;
      
      // Start rock movement simulation
      const moveInterval = setInterval(() => {
        this.updateRocks();
        this.checkCollisions();
        
        // Simulate player movement toward exit
        if (Math.random() < 0.3) {
          this.movePlayerTowardExit();
        }
        
        // Check if player reached exit
        if (this.isNearExit()) {
          clearInterval(moveInterval);
          this.running = false;
          console.log('[RandomRocks] Successfully dodged through the chaos!');
          resolve();
        }
      }, 200);

      // Safety timeout
      setTimeout(() => {
        if (this.running) {
          clearInterval(moveInterval);
          this.running = false;
          console.log('[RandomRocks] Found a safe moment to dash to the exit!');
          resolve();
        }
      }, 8000);
    });
  }

  private initializeRocks(): void {
    const rockCount = 12;
    
    for (let i = 0; i < rockCount; i++) {
      this.rocks.push({
        id: i,
        x: Math.random() * this.fieldWidth,
        y: Math.random() * this.fieldHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: 1 + Math.random() * 2,
        active: true
      });
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
    this.rocks.forEach(rock => {
      if (!rock.active) return;

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
      if (Math.random() < 0.05) {
        rock.vx += (Math.random() - 0.5) * 0.5;
        rock.vy += (Math.random() - 0.5) * 0.5;
        
        // Keep velocity reasonable
        const speed = Math.sqrt(rock.vx * rock.vx + rock.vy * rock.vy);
        if (speed > 3) {
          rock.vx = (rock.vx / speed) * 3;
          rock.vy = (rock.vy / speed) * 3;
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
        'The ground trembles with rolling stone...'
      ];
      console.log(`[RandomRocks] ${messages[Math.floor(Math.random() * messages.length)]}`);
    }
  }

  private checkCollisions(): void {
    // Check for near-misses (creates tension)
    this.rocks.forEach(rock => {
      const distance = Math.sqrt(
        Math.pow(rock.x - this.playerPos.x, 2) + 
        Math.pow(rock.y - this.playerPos.y, 2)
      );
      
      if (distance < rock.size + 1.5 && distance > rock.size + 0.5) {
        if (Math.random() < 0.3) {
          console.log('[RandomRocks] Close call! A rock whizzes past...');
        }
      }
    });
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
      Math.pow(this.exitPos.y - this.playerPos.y, 2)
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
