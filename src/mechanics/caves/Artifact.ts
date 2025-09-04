/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Hidden artifact system for cave maze completion
*/

export class Artifact {
  private location: { x: number; y: number };
  private discovered: boolean = false;
  private pickupTime: number | null = null;

  constructor(location: { x: number; y: number }) {
    this.location = { ...location };
  }

  onPickup(): void {
    if (this.discovered) return;
    
    this.discovered = true;
    this.pickupTime = Date.now();
    
    this.displayDiscoverySequence();
  }

  private displayDiscoverySequence(): void {
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('        ARTIFACT DISCOVERED!');
    console.log('═══════════════════════════════════════');
    console.log('A glint catches your eye in the shadows...');
    console.log('');
    
    setTimeout(() => {
      console.log('You carefully reach into a hidden alcove...');
      
      setTimeout(() => {
        console.log('Your fingers close around something smooth and warm...');
        
        setTimeout(() => {
          this.revealArtifact();
        }, 1500);
      }, 1500);
    }, 1000);
  }

  private revealArtifact(): void {
    const artifacts = [
      {
        name: "The Echo Stone",
        description: "A crystalline orb that hums with ancient melodies",
        power: "Memories of forgotten songs flow through your mind..."
      },
      {
        name: "Thornweaver's Compass",
        description: "A brass compass with thorny vines etched around its edge",
        power: "The needle spins and points to hidden truths..."
      },
      {
        name: "Vial of Starwater",
        description: "A small glass vial filled with liquid that sparkles like the night sky",
        power: "The cosmos swirls within, whispering of distant worlds..."
      },
      {
        name: "The Weathered Journal",
        description: "A leather-bound book with pages that shift and change as you watch",
        power: "Stories of this place unfold before your eyes..."
      }
    ];
    
  const chosen = artifacts[Math.floor(Math.random() * artifacts.length)];
  if (!chosen) return; // safety guard
  console.log(`✨ ${chosen.name} ✨`);
    console.log('');
    console.log(chosen.description);
    console.log('');
    console.log(chosen.power);
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('        TRIALS OF GORSTAN COMPLETE!');
    console.log('═══════════════════════════════════════');
    console.log('You have faced the trials and emerged victorious.');
    console.log('The ancient powers recognize your worth.');
    console.log('Your journey into the depths has just begun...');
    console.log('');
    
    // Gorstan-style quip
    setTimeout(() => {
      const quips = [
        "Well, that was adequately perilous.",
        "Gorstan would approve. Probably.",
        "Not bad for a surface dweller.",
        "The depths have more secrets yet...",
        "One trial ends, countless mysteries remain."
      ];
      
      const quip = quips[Math.floor(Math.random() * quips.length)];
      console.log(`[System] ${quip}`);
      console.log('');
      console.log('[Demo Complete - Returning to Choose Your Adventure]');
    }, 2000);
  }

  // Getters
  isDiscovered(): boolean {
    return this.discovered;
  }

  getLocation(): { x: number; y: number } {
    return { ...this.location };
  }

  getPickupTime(): number | null {
    return this.pickupTime;
  }

  // Static methods for different artifact types
  static createRandomArtifact(location: { x: number; y: number }): Artifact {
    return new Artifact(location);
  }

  static createSpecificArtifact(location: { x: number; y: number }, _type: string): Artifact {
    const artifact = new Artifact(location);
    // Could customize based on type if needed
    return artifact;
  }
}
