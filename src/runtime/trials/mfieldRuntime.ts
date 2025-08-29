/**
 * Mushroom Field Runtime (Trial II)
 * Hexhound pursuit mechanics with odor trails and safe zones
 */

import type { EffectContext } from '../../content/rooms/roomTypes';

interface PursuitState {
  isActive: boolean;
  huntingRoom: string;
  odorStrength: number;
  lastTripTime: number;
  graceTimeRemaining: number;
  diversionsUsed: number;
}

interface HexhoundPack {
  size: number;
  position: string;
  lastMove: number;
  aggressionLevel: number;
}

class MushroomFieldRuntime {
  private pursuitState: PursuitState = {
    isActive: false,
    huntingRoom: '',
    odorStrength: 0,
    lastTripTime: 0,
    graceTimeRemaining: 0,
    diversionsUsed: 0
  };

  private pack: HexhoundPack = {
    size: 6,
    position: 'elf_cave_mouth',
    lastMove: 0,
    aggressionLevel: 1
  };

  private flagSystem: any = null;
  private roomService: any = null;

  // Register systems
  setFlagSystem(flagSystem: any) {
    this.flagSystem = flagSystem;
  }

  setRoomService(roomService: any) {
    this.roomService = roomService;
  }

  // Main trip effect - player steps on mushrooms
  async trip(context: EffectContext, speed: string = 'normal'): Promise<void> {
    const currentTime = Date.now();
    const roomId = context.roomId;

    // Set odor trail
    this.pursuitState.odorStrength = speed === 'fast' ? 100 : 75;
    this.pursuitState.huntingRoom = roomId;
    this.pursuitState.lastTripTime = currentTime;

    // Check for panic freeze (Trial II specific mechanic)
    const timeSinceLastTrip = currentTime - this.pursuitState.lastTripTime;
    const isInField = this.isMushroomField(roomId);
    
    if (isInField && this.pack.size <= 2 && timeSinceLastTrip < 5000) {
      // Panic freeze: extra delay if pack is close and recent activity
      const extraDelay = 1800;
      this.addMessage(context, `The mushrooms pulse frantically. Your movement slows as the field itself resists!`);
      
      // Apply extra delay to room service if available
      if (this.roomService?.addMovementDelay) {
        this.roomService.addMovementDelay(extraDelay);
      }
    }

    // Start pursuit if not already active
    if (!this.pursuitState.isActive) {
      this.startPursuit(context);
    }

    // Apply quantum diversion if available
    if (this.flagSystem?.getFlag('elf.quantumDiversion')) {
      this.pursuitState.diversionsUsed++;
      this.flagSystem.setFlag('elf.quantumDiversion', false);
      this.addMessage(context, `Probability fractures. The Hexhounds pause, confused by your quantum echo.`);
      
      // Reduce pursuit intensity
      this.pack.aggressionLevel = Math.max(0.5, this.pack.aggressionLevel - 0.3);
    }

    console.log(`[MField] Trip triggered in ${roomId}, odor: ${this.pursuitState.odorStrength}, speed: ${speed}`);
  }

  // Remote trip - player creates false scent trail
  async remoteTrip(context: EffectContext, targetRoom: string): Promise<void> {
    if (!targetRoom) return;

    // Check if player has scent totem
    const hasTotem = context.items.includes('scent_totem') || 
                    this.flagSystem?.getFlag('elf.totemHere') ||
                    this.flagSystem?.getFlag('elf.totemHereRock');

    if (hasTotem) {
      // Successful decoy
      this.pursuitState.huntingRoom = targetRoom;
      this.pursuitState.odorStrength = 90; // Strong false trail
      this.pack.position = targetRoom;
      
      this.addMessage(context, `Your decoy scent draws the pack away. Clever.`);
      console.log(`[MField] Remote trip successful: pack diverted to ${targetRoom}`);
    } else {
      // Failed attempt
      this.addMessage(context, `Without a proper scent lure, your distraction fails.`);
      console.log(`[MField] Remote trip failed: no scent totem`);
    }
  }

  // Called whenever player enters any room
  async onEnterAnyRoom(context: EffectContext, roomId: string): Promise<void> {
    const isInField = this.isMushroomField(roomId);
    const isSafeZone = this.isSafeZone(roomId);

    if (isInField && !isSafeZone) {
      // Refresh odor in mushroom field
      this.refreshOdorTrail(context, roomId);
    } else if (!isInField) {
      // Clear pursuit when leaving field area
      if (this.pursuitState.isActive) {
        this.endPursuit(context);
      }
    }

    // Anti-camping logic for safe zones
    if (isSafeZone && this.pursuitState.isActive) {
      this.handleSafeZoneCamping(context, roomId);
    }

    // Update pack movement
    this.updatePackMovement(context, roomId);
  }

  // Helper methods
  private isMushroomField(roomId: string): boolean {
    const fieldRooms = [
      'elf_field_north', 'elf_field_centre', 'elf_field_south',
      'elf_log_lure', 'elf_wind_vane'
    ];
    return fieldRooms.includes(roomId);
  }

  private isSafeZone(roomId: string): boolean {
    const safeRooms = [
      'elf_mfield_edge', 'elf_rock_west', 'elf_rock_centre', 
      'elf_rock_east', 'elf_safe_ledge'
    ];
    return safeRooms.includes(roomId);
  }

  private startPursuit(context: EffectContext): void {
    this.pursuitState.isActive = true;
    this.pack.aggressionLevel = 1.0;
    this.addMessage(context, `Deep howls echo from the cave. The hunt begins.`);
    
    // Set pursuit flag
    if (this.flagSystem) {
      this.flagSystem.setFlag('elf.hexhound_pursuit', true);
    }
  }

  private endPursuit(context: EffectContext): void {
    this.pursuitState.isActive = false;
    this.pursuitState.odorStrength = 0;
    this.addMessage(context, `The Hexhounds' calls fade. You have escaped their domain.`);
    
    if (this.flagSystem) {
      this.flagSystem.setFlag('elf.hexhound_pursuit', false);
    }
  }

  private refreshOdorTrail(context: EffectContext, roomId: string): void {
    if (this.pursuitState.odorStrength > 0) {
      this.pursuitState.odorStrength = Math.max(50, this.pursuitState.odorStrength - 5);
      this.pursuitState.huntingRoom = roomId;
    }
  }

  private handleSafeZoneCamping(context: EffectContext, roomId: string): void {
    const currentTime = Date.now();
    const timeInSafeZone = currentTime - (this.pack.lastMove || 0);
    
    // Increase aggression if player camps too long
    if (timeInSafeZone > 30000) { // 30 seconds
      this.pack.aggressionLevel += 0.2;
      this.addMessage(context, `The Hexhounds grow impatient. Their howls grow closer.`);
    }
  }

  private updatePackMovement(context: EffectContext, playerRoom: string): void {
    const currentTime = Date.now();
    const timeSinceLastMove = currentTime - this.pack.lastMove;
    
    // Move pack based on pursuit state and aggression
    if (this.pursuitState.isActive && timeSinceLastMove > 3000) {
      const huntingRoom = this.pursuitState.huntingRoom;
      
      if (huntingRoom !== this.pack.position) {
        this.pack.position = huntingRoom;
        this.pack.lastMove = currentTime;
        
        // Reduce pack size if they're getting close
        if (huntingRoom === playerRoom && !this.isSafeZone(playerRoom)) {
          this.pack.size = Math.max(1, this.pack.size - 1);
          this.addMessage(context, `Chittering echoes. The pack draws closer!`);
        }
      }
    }
  }

  private addMessage(context: EffectContext, message: string): void {
    console.log(`[MField] ${message}`);
    
    if (this.roomService?.addMessage) {
      this.roomService.addMessage({
        id: `mfield_${Date.now()}`,
        type: 'system',
        content: message,
        timestamp: Date.now(),
      });
    }
  }

  // Public status methods
  getPursuitStatus(): PursuitState {
    return { ...this.pursuitState };
  }

  getPackStatus(): HexhoundPack {
    return { ...this.pack };
  }

  // Reset for testing
  reset(): void {
    this.pursuitState = {
      isActive: false,
      huntingRoom: '',
      odorStrength: 0,
      lastTripTime: 0,
      graceTimeRemaining: 0,
      diversionsUsed: 0
    };
    
    this.pack = {
      size: 6,
      position: 'elf_cave_mouth',
      lastMove: 0,
      aggressionLevel: 1
    };
  }
}

// Singleton instance
const mfieldRuntime = new MushroomFieldRuntime();

export default mfieldRuntime;

// Export individual methods for effect system
export const mfield = {
  trip: (context: EffectContext, speed?: string) => mfieldRuntime.trip(context, speed),
  remoteTrip: (context: EffectContext, targetRoom: string) => mfieldRuntime.remoteTrip(context, targetRoom),
  onEnterAnyRoom: (context: EffectContext, roomId: string) => mfieldRuntime.onEnterAnyRoom(context, roomId),
  setFlagSystem: (flagSystem: any) => mfieldRuntime.setFlagSystem(flagSystem),
  setRoomService: (roomService: any) => mfieldRuntime.setRoomService(roomService),
  getPursuitStatus: () => mfieldRuntime.getPursuitStatus(),
  getPackStatus: () => mfieldRuntime.getPackStatus(),
  reset: () => mfieldRuntime.reset(),
};
