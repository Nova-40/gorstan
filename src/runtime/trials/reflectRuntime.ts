/**
 * Reflection Cave Runtime (Trial III)
 * Echo/clone mechanics with pressure plates and beam splitting
 */

import type { EffectContext } from '../../content/rooms/roomTypes';

interface EchoState {
  isActive: boolean;
  position: string;
  strength: number;
  fadeTime: number;
  mirrorLocks: Set<string>;
}

interface PressurePlate {
  id: string;
  isPressed: boolean;
  pressedBy: 'player' | 'echo' | 'both' | null;
  duration: number;
  lastPressed: number;
}

interface ReflectionState {
  bridges: Map<string, boolean>;
  plates: Map<string, PressurePlate>;
  beamSplit: boolean;
  guardianActive: boolean;
  sigilCount: number;
}

class ReflectionCaveRuntime {
  private echo: EchoState = {
    isActive: false,
    position: '',
    strength: 100,
    fadeTime: 0,
    mirrorLocks: new Set()
  };

  private reflection: ReflectionState = {
    bridges: new Map(),
    plates: new Map(),
    beamSplit: false,
    guardianActive: false,
    sigilCount: 0
  };

  private flagSystem: any = null;
  private roomService: any = null;
  private itemSystem: any = null;

  // Register systems
  setFlagSystem(flagSystem: any) {
    this.flagSystem = flagSystem;
  }

  setRoomService(roomService: any) {
    this.roomService = roomService;
  }

  setItemSystem(itemSystem: any) {
    this.itemSystem = itemSystem;
  }

  // Pressure plate activation
  async press(context: EffectContext, plateId: string, duration: number = 10000): Promise<void> {
    const currentTime = Date.now();
    const roomId = context.roomId;

    // Create or update plate
    const plate: PressurePlate = this.reflection.plates.get(plateId) || {
      id: plateId,
      isPressed: false,
      pressedBy: null,
      duration,
      lastPressed: 0
    };

    // Determine who pressed it
    const hasEcho = this.echo.isActive && this.echo.position === roomId;
    let pressedBy: 'player' | 'echo' | 'both' = 'player';
    
    if (hasEcho) {
      pressedBy = plate.isPressed ? 'both' : 'echo';
    }

    plate.isPressed = true;
    plate.pressedBy = pressedBy;
    plate.lastPressed = currentTime;
    
    this.reflection.plates.set(plateId, plate);

    // Apply effects based on who pressed
    if (pressedBy === 'both') {
      this.addMessage(context, `The plate resonates deeply as both you and your echo stand upon it.`);
      this.handleHarmonyEffect(context, plateId);
    } else if (pressedBy === 'echo') {
      this.addMessage(context, `Your echo's weight triggers the pressure plate.`);
    } else {
      this.addMessage(context, `The pressure plate clicks under your weight.`);
    }

    // Set timer for plate release
    setTimeout(() => {
      this.releasePlate(plateId);
    }, duration);

    console.log(`[Reflect] Plate ${plateId} pressed by ${pressedBy}, duration: ${duration}ms`);
  }

  // Bridge creation/management
  async bridge(context: EffectContext, bridgeId: string, state: 'raise' | 'lower' = 'raise'): Promise<void> {
    const isRaised = state === 'raise';
    this.reflection.bridges.set(bridgeId, isRaised);

    if (isRaised) {
      this.addMessage(context, `Ancient mechanisms grind to life. A bridge of crystalline light forms.`);
      
      // Check if this completes a path
      if (this.checkBridgeCompletion(bridgeId)) {
        this.addMessage(context, `The path of mirrors aligns. The way forward opens.`);
        this.triggerPathCompletion(context);
      }
    } else {
      this.addMessage(context, `The light bridge flickers and fades away.`);
    }

    console.log(`[Reflect] Bridge ${bridgeId} ${state}`);
  }

  // Mark sigil with echo
  async mark(context: EffectContext, sigilId: string): Promise<void> {
    const roomId = context.roomId;
    const hasEcho = this.echo.isActive && this.echo.position === roomId;
    const hasMirrorDust = context.items.includes('mirror_dust') || 
                         this.flagSystem?.getFlag('elf.mirrorDustHere');

    if (!hasEcho) {
      this.addMessage(context, `You need your echo's presence to mark this sigil.`);
      return;
    }

    if (!hasMirrorDust) {
      this.addMessage(context, `You need mirror dust to make the marking permanent.`);
      return;
    }

    // Mark the sigil
    this.reflection.sigilCount++;
    this.flagSystem?.setFlag(`elf.sigil_${sigilId}`, true);
    
    this.addMessage(context, `Your echo traces the sigil as you sprinkle mirror dust. It glows with permanent light.`);
    
    // Check completion
    if (this.reflection.sigilCount >= 3) {
      this.addMessage(context, `All sigils resonate in harmony. The guardian stirs...`);
      this.activateGuardian(context);
    }

    console.log(`[Reflect] Sigil ${sigilId} marked, total: ${this.reflection.sigilCount}`);
  }

  // Configure echo behavior
  async configure(context: EffectContext, behavior: 'follow' | 'stay' | 'mirror' | 'split'): Promise<void> {
    if (!this.echo.isActive) {
      this.createEcho(context);
    }

    switch (behavior) {
      case 'follow':
        this.addMessage(context, `Your echo moves to follow your path.`);
        this.echo.position = context.roomId;
        break;
        
      case 'stay':
        this.addMessage(context, `Your echo remains where it stands.`);
        // Echo stays in current position
        break;
        
      case 'mirror':
        this.addMessage(context, `Your echo moves to mirror your position across the chamber.`);
        this.echo.position = this.getMirrorPosition(context.roomId);
        break;
        
      case 'split':
        if (!this.reflection.beamSplit) {
          this.addMessage(context, `You split your reflection using the crystal beams.`);
          this.reflection.beamSplit = true;
          this.echo.strength = 150; // Stronger when split
        } else {
          this.addMessage(context, `Your reflection is already split.`);
        }
        break;
    }

    console.log(`[Reflect] Echo configured to: ${behavior}`);
  }

  // Bait guardian with echo
  async bait(context: EffectContext, targetRoom: string): Promise<void> {
    if (!this.reflection.guardianActive) {
      this.addMessage(context, `The guardian has not yet awakened.`);
      return;
    }

    if (!this.echo.isActive) {
      this.addMessage(context, `You need your echo to distract the guardian.`);
      return;
    }

    // Move echo to bait position
    this.echo.position = targetRoom;
    this.addMessage(context, `Your echo moves to draw the guardian's attention.`);
    
    // Guardian follows echo
    setTimeout(() => {
      this.addMessage(context, `The guardian turns toward your echo, leaving its post unguarded.`);
      this.flagSystem?.setFlag('elf.guardian_distracted', true);
      
      // Create window of opportunity
      setTimeout(() => {
        this.addMessage(context, `The guardian realizes the deception and returns.`);
        this.flagSystem?.setFlag('elf.guardian_distracted', false);
      }, 8000);
    }, 2000);

    console.log(`[Reflect] Guardian baited to ${targetRoom}`);
  }

  // Helper methods
  private createEcho(context: EffectContext): void {
    this.echo.isActive = true;
    this.echo.position = context.roomId;
    this.echo.strength = 100;
    this.echo.fadeTime = Date.now() + 60000; // 1 minute default
    
    this.addMessage(context, `The mirrors shimmer. Your reflection steps free, becoming your echo.`);
    console.log(`[Reflect] Echo created in ${context.roomId}`);
  }

  private getMirrorPosition(roomId: string): string {
    // Simple mirroring logic - in real implementation this would use room geometry
    const mirrorMap: Record<string, string> = {
      'elf_mirror_entry': 'elf_mirror_depth',
      'elf_pressure_west': 'elf_pressure_east',
      'elf_pressure_east': 'elf_pressure_west',
      'elf_beam_split': 'elf_beam_focus',
      'elf_beam_focus': 'elf_beam_split',
      'elf_sigil_chamber': 'elf_guardian_hall',
      'elf_guardian_hall': 'elf_sigil_chamber',
      'elf_mirror_depth': 'elf_mirror_entry'
    };
    
    return mirrorMap[roomId] || roomId;
  }

  private releasePlate(plateId: string): void {
    const plate = this.reflection.plates.get(plateId);
    if (plate) {
      plate.isPressed = false;
      plate.pressedBy = null;
      this.reflection.plates.set(plateId, plate);
      console.log(`[Reflect] Plate ${plateId} released`);
    }
  }

  private handleHarmonyEffect(context: EffectContext, plateId: string): void {
    // Special effects when both player and echo press together
    switch (plateId) {
      case 'harmony_plate':
        this.bridge(context, 'harmony_bridge', 'raise');
        break;
      case 'split_plate':
        this.reflection.beamSplit = true;
        this.addMessage(context, `The crystal beams split, doubling their power.`);
        break;
    }
  }

  private checkBridgeCompletion(bridgeId: string): boolean {
    // Check if critical bridges are raised
    const criticalBridges = ['harmony_bridge', 'sigil_bridge', 'guardian_bridge'];
    return criticalBridges.every(id => this.reflection.bridges.get(id) === true);
  }

  private triggerPathCompletion(context: EffectContext): void {
    this.flagSystem?.setFlag('elf.mirror_path_complete', true);
  }

  private activateGuardian(context: EffectContext): void {
    this.reflection.guardianActive = true;
    this.flagSystem?.setFlag('elf.guardian_awakened', true);
    this.addMessage(context, `The Mirror Guardian's eyes open. It begins its eternal patrol.`);
  }

  private addMessage(context: EffectContext, message: string): void {
    console.log(`[Reflect] ${message}`);
    
    if (this.roomService?.addMessage) {
      this.roomService.addMessage({
        id: `reflect_${Date.now()}`,
        type: 'system',
        content: message,
        timestamp: Date.now(),
      });
    }
  }

  // Public status methods
  getEchoStatus(): EchoState {
    return { ...this.echo };
  }

  getReflectionStatus(): ReflectionState {
    return {
      bridges: new Map(this.reflection.bridges),
      plates: new Map(this.reflection.plates),
      beamSplit: this.reflection.beamSplit,
      guardianActive: this.reflection.guardianActive,
      sigilCount: this.reflection.sigilCount
    };
  }

  // Reset for testing
  reset(): void {
    this.echo = {
      isActive: false,
      position: '',
      strength: 100,
      fadeTime: 0,
      mirrorLocks: new Set()
    };
    
    this.reflection = {
      bridges: new Map(),
      plates: new Map(),
      beamSplit: false,
      guardianActive: false,
      sigilCount: 0
    };
  }
}

// Singleton instance
const reflectRuntime = new ReflectionCaveRuntime();

export default reflectRuntime;

// Export individual methods for effect system
export const reflect = {
  press: (context: EffectContext, plateId: string, duration?: number) => 
    reflectRuntime.press(context, plateId, duration),
  bridge: (context: EffectContext, bridgeId: string, state?: 'raise' | 'lower') => 
    reflectRuntime.bridge(context, bridgeId, state),
  mark: (context: EffectContext, sigilId: string) => 
    reflectRuntime.mark(context, sigilId),
  configure: (context: EffectContext, behavior: 'follow' | 'stay' | 'mirror' | 'split') => 
    reflectRuntime.configure(context, behavior),
  bait: (context: EffectContext, targetRoom: string) => 
    reflectRuntime.bait(context, targetRoom),
  setFlagSystem: (flagSystem: any) => reflectRuntime.setFlagSystem(flagSystem),
  setRoomService: (roomService: any) => reflectRuntime.setRoomService(roomService),
  setItemSystem: (itemSystem: any) => reflectRuntime.setItemSystem(itemSystem),
  getEchoStatus: () => reflectRuntime.getEchoStatus(),
  getReflectionStatus: () => reflectRuntime.getReflectionStatus(),
  reset: () => reflectRuntime.reset(),
};
