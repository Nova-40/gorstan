/**
 * TeleportManager - Beta3 Design System
 * Unified teleportation system with overlays, SFX, and accessibility
 */

import type { Zone, TeleportOptions, TeleportOverlay } from '../domain/types';
import { withGorstanSnark } from '../components/game/ConsoleTerminal';

interface TeleportState {
  isLocked: boolean;
  currentRoom: string;
  lastArrivalMessage: string;
}

class TeleportManagerClass {
  private state: TeleportState = {
    isLocked: false,
    currentRoom: '',
    lastArrivalMessage: '',
  };
  
  private overlayElement: HTMLElement | null = null;
  private audioContext: AudioContext | null = null;
  
  // Ceremony messages
  private readonly DEPART_MESSAGE = "Filing you elsewhere…";
  private readonly ARRIVE_MESSAGE = "Filed.";
  
  // Zone to overlay mapping
  private getOverlayForZone(zone: Zone): TeleportOverlay {
    switch (zone) {
      case 'glitch':
        return 'fractal';
      default:
        return 'trek';
    }
  }
  
  // Determine zone from room ID (simplified - should be enhanced)
  private getZoneFromRoom(roomId: string): Zone {
    if (roomId.includes('glitch')) return 'glitch';
    if (roomId.includes('nexus') || roomId.includes('control')) return 'nexus';
    if (roomId.includes('elf') || roomId.includes('fae')) return 'elfhame';
    if (roomId.includes('maze')) return 'maze';
    return 'default';
  }
  
  // Create overlay element
  private createOverlay(type: TeleportOverlay): HTMLElement {
    const overlay = document.createElement('div');
    overlay.className = `fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm`;
    
    const content = document.createElement('div');
    content.className = `text-console text-xl font-mono ${
      type === 'fractal' ? 'animate-teleport-fractal' : 'animate-teleport-trek'
    }`;
    content.textContent = this.DEPART_MESSAGE;
    
    overlay.appendChild(content);
    return overlay;
  }
  
  // Play teleport sound effect
  private async playSfx(type: TeleportOverlay): Promise<void> {
    if (!this.audioContext) {
      try {
        this.audioContext = new AudioContext();
      } catch (e) {
        console.warn('Audio context not available:', e);
        return;
      }
    }
    
    // Simple synthesized SFX (in production, load actual audio files)
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    if (type === 'fractal') {
      // Glitch realm - distorted, high-frequency
      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.3);
      oscillator.type = 'sawtooth';
    } else {
      // Trek-style energize
      oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.2);
      oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.4);
      oscillator.type = 'sine';
    }
    
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.5);
  }
  
  // Show overlay with animation
  private async showOverlay(type: TeleportOverlay): Promise<void> {
    return new Promise((resolve) => {
      this.overlayElement = this.createOverlay(type);
      document.body.appendChild(this.overlayElement);
      
      // Trigger animation and remove after duration
      setTimeout(() => {
        if (this.overlayElement) {
          this.overlayElement.remove();
          this.overlayElement = null;
        }
        resolve();
      }, 600); // ≤600ms as per spec
    });
  }
  
  // Announce arrival for screen readers
  private announceArrival(roomName: string): void {
    const announcement = `Arrived: ${roomName}`;
    
    // Create temporary live region for announcement
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.textContent = announcement;
    
    document.body.appendChild(liveRegion);
    
    // Remove after announcement
    setTimeout(() => {
      liveRegion.remove();
    }, 1000);
  }
  
  // Print arrival message (deduplicated)
  private printArrivalMessage(roomDescription: string): void {
    if (this.state.lastArrivalMessage === roomDescription) {
      // Deduplicate - don't print same description twice
      return;
    }
    
    this.state.lastArrivalMessage = roomDescription;
    
    // In a real implementation, this would add to the console
    // For now, we'll use console.log as placeholder
    console.log(withGorstanSnark(this.ARRIVE_MESSAGE));
    console.log(roomDescription);
  }
  
  // Guard against double triggers
  private async lockExecution<T>(fn: () => Promise<T>): Promise<T | null> {
    if (this.state.isLocked) {
      console.warn('Teleport already in progress');
      return null;
    }
    
    this.state.isLocked = true;
    try {
      return await fn();
    } finally {
      this.state.isLocked = false;
    }
  }
  
  // Main teleport function
  async go(toRoom: string, options: TeleportOptions = {}): Promise<boolean> {
    const result = await this.lockExecution(async () => {
      try {
        // Determine zone and overlay
        const zone = this.getZoneFromRoom(toRoom);
        const overlay = options.overlay || this.getOverlayForZone(zone);
        
        // Skip ceremony if requested
        if (!options.skipCeremony) {
          // Play SFX
          if (!options.silent) {
            await this.playSfx(overlay);
          }
          
          // Show overlay
          await this.showOverlay(overlay);
        }
        
        // Update current room
        this.state.currentRoom = toRoom;
        
        // Get room data (placeholder - should integrate with actual room system)
        const roomData = await this.getRoomData(toRoom);
        
        // Announce for screen readers
        this.announceArrival(roomData.name);
        
        // Print arrival message (deduplicated)
        this.printArrivalMessage(roomData.description);
        
        return true;
      } catch (error) {
        console.error('Teleport failed:', error);
        return false;
      }
    });
    
    return result !== null ? result : false;
  }
  
  // Placeholder for room data fetching
  private async getRoomData(roomId: string): Promise<{ name: string; description: string }> {
    // This should integrate with the actual room system
    return {
      name: roomId.replace(/([A-Z])/g, ' $1').trim(),
      description: `You are now in ${roomId}.`
    };
  }
  
  // Get current room
  getCurrentRoom(): string {
    return this.state.currentRoom;
  }
  
  // Check if teleport is in progress
  isLocked(): boolean {
    return this.state.isLocked;
  }
  
  // Cleanup method
  cleanup(): void {
    if (this.overlayElement) {
      this.overlayElement.remove();
      this.overlayElement = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.state.isLocked = false;
  }
}

// Export singleton instance
export const teleportManager = new TeleportManagerClass();

// Export the class for testing
export { TeleportManagerClass };
