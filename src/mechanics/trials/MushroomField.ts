/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Phase 3: Mushroom field with six-legged mutant spawns and rest rocks
*/

export interface Mushroom {
  id: number;
  x: number;
  y: number;
  triggered: boolean;
  packSpawned: boolean;
}

export interface CreaturePack {
  id: number;
  creatures: Creature[];
  originMushroomId: number;
  active: boolean;
  sleeping: boolean;
  sleepStartTime?: number;
}

export interface Creature {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  health: number;
  aggressive: boolean;
}

export interface RestRock {
  id: number;
  x: number;
  y: number;
  occupied: boolean;
  cooldownUntil: number;
}

export class MushroomField {
  private mushrooms: Mushroom[] = [];
  private creaturePacks: CreaturePack[] = [];
  private restRocks: RestRock[] = [];
  private fieldWidth = 40;
  private fieldHeight = 25;
  private playerPos = { x: 2, y: 12 };
  private streamPos = { x: 38, y: 12 };
  private running = false;
  private nextPackId = 0;

  constructor() {
    this.initializeMushrooms();
    this.initializeRestRocks();
  }

  async run(): Promise<void> {
    console.log('[MushroomField] Starting mushroom field phase');
    
    return new Promise((resolve) => {
      this.displayPhaseIntro();
      this.running = true;
      
      // Main game loop
      const gameLoop = setInterval(() => {
        this.updateCreaturePacks();
        this.simulatePlayerMovement();
        this.checkMushroomTriggers();
        
        // Check if player reached stream
        if (this.isNearStream()) {
          clearInterval(gameLoop);
          this.running = false;
          this.despawnAllCreatures();
          console.log('[MushroomField] 🌊 You reach the cleansing stream!');
          console.log('[MushroomField] ✨ The pure water causes all creatures to dissolve away!');
          console.log('[MushroomField] 🎉 The field is cleansed! You are safe!');
          resolve();
        }
      }, 300);

      // Safety timeout
      setTimeout(() => {
        if (this.running) {
          clearInterval(gameLoop);
          this.running = false;
          console.log('[MushroomField] Found a way through the dangers!');
          resolve();
        }
      }, 15000);
    });
  }

  private initializeMushrooms(): void {
    const mushroomCount = 50; // Increased from 30 to make navigation harder
    
    // Create denser mushroom placement with fewer safe paths
    for (let i = 0; i < mushroomCount; i++) {
      let x, y;
      let attempts = 0;
      
      do {
        x = 4 + Math.random() * (this.fieldWidth - 8);
        y = 2 + Math.random() * (this.fieldHeight - 4);
        attempts++;
      } while (attempts < 10 && this.isTooCloseToSafeZone(x, y));
      
      this.mushrooms.push({
        id: i,
        x: x,
        y: y,
        triggered: false,
        packSpawned: false
      });
    }
  }

  private isTooCloseToSafeZone(x: number, y: number): boolean {
    // Keep small safe zones around start, rocks, and stream
    const safeZones = [
      { x: this.playerPos.x, y: this.playerPos.y, radius: 3 }, // Starting area
      { x: this.streamPos.x, y: this.streamPos.y, radius: 4 }, // Stream area
      ...this.restRocks.map(rock => ({ x: rock.x, y: rock.y, radius: 2.5 })) // Around rocks
    ];
    
    return safeZones.some(zone => {
      const distance = Math.sqrt(Math.pow(x - zone.x, 2) + Math.pow(y - zone.y, 2));
      return distance < zone.radius;
    });
  }

  private initializeRestRocks(): void {
    // Three strategically placed safety rocks - positioned to create challenging but possible routes
    this.restRocks = [
      { id: 0, x: 10, y: 6, occupied: false, cooldownUntil: 0 },   // Early safety point
      { id: 1, x: 22, y: 18, occupied: false, cooldownUntil: 0 }, // Mid-field challenge
      { id: 2, x: 32, y: 8, occupied: false, cooldownUntil: 0 }   // Near stream approach
    ];
  }

  private displayPhaseIntro(): void {
    console.log('═══════════════════════════════════════');
    console.log('  PHASE 3: THE MUSHROOM FIELD OF WRATH');
    console.log('═══════════════════════════════════════');
    console.log('🍄 A dense carpet of toxic fungi blocks your path...');
    console.log('⚠️  Step on one, and WAVES of ravenous monsters surge forth!');
    console.log('🦂 Six-legged horrors, snarling and coordinated in their hunt.');
    console.log('🛡️  Find the 3 SAFETY ROCKS - they repel the creatures!');
    console.log('🌊 Reach the cleansing STREAM and all monsters will vanish!');
    console.log('🏃 You must be QUICK - they move fast and work together!');
    console.log('💀 Navigate carefully - triggering multiple mushrooms = certain doom!');
    console.log('');
  }

  private checkMushroomTriggers(): void {
    this.mushrooms.forEach(mushroom => {
      if (mushroom.triggered || mushroom.packSpawned) {return;}
      
      const distance = Math.sqrt(
        Math.pow(mushroom.x - this.playerPos.x, 2) + 
        Math.pow(mushroom.y - this.playerPos.y, 2)
      );
      
      // More sensitive trigger distance - harder to avoid
      if (distance < 2.0) { // Increased from 1.5
        this.triggerMushroom(mushroom);
        
        // Chain reaction chance - nearby mushrooms may also trigger!
        if (Math.random() < 0.3) {
          this.mushrooms.forEach(nearbyShroom => {
            if (nearbyShroom.id !== mushroom.id && !nearbyShroom.triggered) {
              const nearbyDistance = Math.sqrt(
                Math.pow(nearbyShroom.x - mushroom.x, 2) + 
                Math.pow(nearbyShroom.y - mushroom.y, 2)
              );
              if (nearbyDistance < 3) {
                console.log(`[MushroomField] 💥 Chain reaction! Nearby mushroom erupts!`);
                setTimeout(() => this.triggerMushroom(nearbyShroom), 500);
              }
            }
          });
        }
      }
    });
  }

  private triggerMushroom(mushroom: Mushroom): void {
    mushroom.triggered = true;
    mushroom.packSpawned = true;
    
    console.log(`[MushroomField] You step on a spongy mushroom... *CRACK*`);
    console.log(`[MushroomField] 🍄 SPORES BURST IN ALL DIRECTIONS! 🍄`);
    console.log(`[MushroomField] ⚠️  A WAVE OF RAVENOUS CREATURES EMERGES! ⚠️`);
    
    // Spawn a WAVE of creatures - much more threatening
    const pack: CreaturePack = {
      id: this.nextPackId++,
      creatures: this.spawnCreatureWave(mushroom.x, mushroom.y),
      originMushroomId: mushroom.id,
      active: true,
      sleeping: false
    };
    
    this.creaturePacks.push(pack);
    
    console.log(`[MushroomField] 🦂 ${pack.creatures.length} six-legged monsters surge toward you!`);
    console.log(`[MushroomField] 🏃 GET TO A SAFETY ROCK QUICKLY!`);
  }

  private spawnCreatureWave(originX: number, originY: number): Creature[] {
    const creatures: Creature[] = [];
    const count = 6 + Math.floor(Math.random() * 6); // 6-11 creatures per wave!
    
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
      const distance = 2 + Math.random() * 4;
      
      creatures.push({
        id: i,
        x: originX + Math.cos(angle) * distance,
        y: originY + Math.sin(angle) * distance,
        vx: 0,
        vy: 0,
        health: 1,
        aggressive: true
      });
    }
    
    return creatures;
  }

  private updateCreaturePacks(): void {
    this.creaturePacks.forEach(pack => {
      if (!pack.active) {return;}
      
      // Check if pack should sleep due to rest rock proximity
      const nearRestRock = this.isPackNearRestRock(pack);
      
      if (nearRestRock && !pack.sleeping) {
        this.startPackSleep(pack);
      } else if (pack.sleeping) {
        this.updateSleepingPack(pack);
      } else {
        this.updateActivePack(pack);
      }
      
      // Check for pack vs pack combat
      this.checkPackCombat(pack);
    });
    
    // Clean up dead packs
    this.creaturePacks = this.creaturePacks.filter(pack => 
      pack.active && pack.creatures.length > 0
    );
  }

  private isPackNearRestRock(pack: CreaturePack): boolean {
    return this.restRocks.some(rock => {
      const currentTime = Date.now();
      if (currentTime < rock.cooldownUntil) {return false;}
      
      return pack.creatures.some(creature => {
        const distance = Math.sqrt(
          Math.pow(creature.x - rock.x, 2) + 
          Math.pow(creature.y - rock.y, 2)
        );
        return distance < 4; // Rest rock influence radius
      });
    });
  }

  private startPackSleep(pack: CreaturePack): void {
    pack.sleeping = true;
    pack.sleepStartTime = Date.now();
    console.log(`[MushroomField] 🛡️  The creatures recoil from the safety rock's power!`);
    console.log(`[MushroomField] 😴 They grow drowsy and begin to slumber...`);
    
    // Set cooldown on the rock they're near
    this.restRocks.forEach(rock => {
      const nearRock = pack.creatures.some(creature => {
        const distance = Math.sqrt(
          Math.pow(creature.x - rock.x, 2) + 
          Math.pow(creature.y - rock.y, 2)
        );
        return distance < 4;
      });
      
      if (nearRock) {
        rock.cooldownUntil = Date.now() + 25000; // Reduced cooldown for more mobility
      }
    });
  }

  private updateSleepingPack(pack: CreaturePack): void {
    if (!pack.sleepStartTime) {return;}
    
    const sleepDuration = Date.now() - pack.sleepStartTime;
    
    if (sleepDuration > 20000) { // Faster despawn - 20 seconds
      console.log(`[MushroomField] ✨ The creatures dissolve into spores and vanish...`);
      pack.active = false; // Remove the pack
    }
  }

  private updateActivePack(pack: CreaturePack): void {
    // Enhanced AI: aggressive pursuit toward player with coordinated movement
    pack.creatures.forEach((creature, index) => {
      const dx = this.playerPos.x - creature.x;
      const dy = this.playerPos.y - creature.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 0) {
        // More aggressive chase mechanics
        const chaseStrength = 0.5; // Increased from 0.3
        const randomness = 0.3; // Reduced randomness for more direct pursuit
        const flankingOffset = Math.sin(index * Math.PI / 3) * 0.2; // Coordinated flanking
        
        creature.vx = (dx / distance) * chaseStrength + (Math.random() - 0.5) * randomness + flankingOffset;
        creature.vy = (dy / distance) * chaseStrength + (Math.random() - 0.5) * randomness;
        
        creature.x += creature.vx;
        creature.y += creature.vy;
        
        // Keep creatures in bounds
        creature.x = Math.max(1, Math.min(this.fieldWidth - 1, creature.x));
        creature.y = Math.max(1, Math.min(this.fieldHeight - 1, creature.y));
      }
    });
    
    // More dramatic threatening messages
    if (Math.random() < 0.15) {
      const sounds = [
        '🦂 Chittering mandibles snap hungrily behind you!',
        '👁️  Glowing eyes converge on your position!',
        '🔥 The creatures surge forward in a coordinated wave!',
        '⚡ Six legs thunder across the mushroom field!',
        '🎯 The pack is closing in - seek safety NOW!'
      ];
      console.log(`[MushroomField] ${sounds[Math.floor(Math.random() * sounds.length)]}`);
    }
  }

  private checkPackCombat(pack: CreaturePack): void {
    // Check if this pack encounters another pack
    this.creaturePacks.forEach(otherPack => {
      if (otherPack.id === pack.id || !otherPack.active || otherPack.sleeping) {return;}
      
      // Check for proximity between packs
      const packDistance = this.getPackDistance(pack, otherPack);
      
      if (packDistance < 3) {
        this.resolveCombat(pack, otherPack);
      }
    });
  }

  private getPackDistance(pack1: CreaturePack, pack2: CreaturePack): number {
    if (pack1.creatures.length === 0 || pack2.creatures.length === 0) {return Infinity;}
    
    let minDistance = Infinity;
    
    pack1.creatures.forEach(c1 => {
      pack2.creatures.forEach(c2 => {
        const distance = Math.sqrt(
          Math.pow(c1.x - c2.x, 2) + Math.pow(c1.y - c2.y, 2)
        );
        minDistance = Math.min(minDistance, distance);
      });
    });
    
    return minDistance;
  }

  private resolveCombat(pack1: CreaturePack, pack2: CreaturePack): void {
    console.log(`[MushroomField] Two packs clash! Fangs and claws flash in fury!`);
    
    // Simple combat resolution - both packs lose creatures
    const casualties1 = Math.floor(pack1.creatures.length * 0.3);
    const casualties2 = Math.floor(pack2.creatures.length * 0.3);
    
    pack1.creatures.splice(0, casualties1);
    pack2.creatures.splice(0, casualties2);
    
    if (pack1.creatures.length === 0) {pack1.active = false;}
    if (pack2.creatures.length === 0) {pack2.active = false;}
    
    console.log(`[MushroomField] The battle ends with mutual losses...`);
  }

  private simulatePlayerMovement(): void {
    // Enhanced strategic movement - seek safety when creatures are active
    const activeCreatures = this.creaturePacks.filter(pack => pack.active && !pack.sleeping);
    const isInDanger = activeCreatures.length > 0;
    
    if (Math.random() < 0.6) {
      let targetX = this.streamPos.x;
      let targetY = this.streamPos.y;
      
      // If in danger, prioritize nearest available safety rock
      if (isInDanger) {
        const availableRocks = this.restRocks.filter(rock => Date.now() >= rock.cooldownUntil);
        if (availableRocks.length > 0) {
          const nearestRock = availableRocks.reduce((closest, rock) => {
            const distanceToRock = Math.sqrt(
              Math.pow(rock.x - this.playerPos.x, 2) + 
              Math.pow(rock.y - this.playerPos.y, 2)
            );
            const distanceToClosest = Math.sqrt(
              Math.pow(closest.x - this.playerPos.x, 2) + 
              Math.pow(closest.y - this.playerPos.y, 2)
            );
            return distanceToRock < distanceToClosest ? rock : closest;
          });
          
          targetX = nearestRock.x;
          targetY = nearestRock.y;
        }
      }
      
      const dx = targetX - this.playerPos.x;
      const dy = targetY - this.playerPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 1) {
        // Move more carefully or quickly based on danger level
        const stepSize = isInDanger ? 0.8 : 0.4; // Faster when in danger
        this.playerPos.x += (dx / distance) * stepSize;
        this.playerPos.y += (dy / distance) * stepSize;
        
        // Enhanced movement logging
        if (Math.random() < 0.15) {
          const movements = isInDanger ? [
            '🏃 Sprinting toward the nearest safety rock!',
            '💨 Dodging between mushroom patches in panic!',
            '⚡ Racing to escape the creature wave!',
            '🎯 Making a desperate dash for safety!'
          ] : [
            '🚶 Carefully stepping between mushroom patches...',
            '👀 Skirting around a cluster of fungi...',
            '🗺️  Picking your way toward the distant stream...',
            '🍄 Avoiding the worst of the mushroom growths...'
          ];
          console.log(`[MushroomField] ${movements[Math.floor(Math.random() * movements.length)]}`);
        }
      }
    }
  }

  private isNearStream(): boolean {
    const distance = Math.sqrt(
      Math.pow(this.streamPos.x - this.playerPos.x, 2) + 
      Math.pow(this.streamPos.y - this.playerPos.y, 2)
    );
    return distance < 3;
  }

  private despawnAllCreatures(): void {
    console.log('[MushroomField] 💫 The stream\'s power reaches across the field...');
    this.creaturePacks.forEach(pack => {
      pack.active = false;
      pack.creatures = [];
    });
    this.creaturePacks = [];
  }

  // Public getters for external access
  getMushrooms(): Mushroom[] {
    return [...this.mushrooms];
  }

  getCreaturePacks(): CreaturePack[] {
    return [...this.creaturePacks];
  }

  getAllCreatures(): Creature[] {
    // Flatten all creatures from all active packs for UI rendering
    return this.creaturePacks
      .filter(pack => pack.active)
      .flatMap(pack => pack.creatures);
  }

  getRestRocks(): RestRock[] {
    return [...this.restRocks];
  }

  getPlayerPosition(): { x: number; y: number } {
    return { ...this.playerPos };
  }

  getStreamPosition(): { x: number; y: number } {
    return { ...this.streamPos };
  }

  isRunning(): boolean {
    return this.running;
  }
}
