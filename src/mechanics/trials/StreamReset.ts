/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Stream reset system - cleaners sweep the field and reset state
*/

export class StreamReset {
  
  async run(): Promise<void> {
    console.log('[StreamReset] Entering the cleansing stream...');
    
    return new Promise((resolve) => {
      this.displayStreamSequence();
      
      // Stream cleansing sequence
      setTimeout(() => {
        this.triggerCleaners();
        
        setTimeout(() => {
          this.completeReset();
          resolve();
        }, 3000);
      }, 2000);
    });
  }

  private displayStreamSequence(): void {
    console.log('═══════════════════════════════════════');
    console.log('        THE CLEANSING STREAM');
    console.log('═══════════════════════════════════════');
    console.log('Cool water rushes over your feet...');
    console.log('The stream hums with ancient power.');
    console.log('Something stirs in the depths...');
    console.log('');
  }

  private triggerCleaners(): void {
    console.log('[StreamReset] The water begins to glow...');
    console.log('[StreamReset] Ethereal forms rise from the stream!');
    console.log('[StreamReset] The Cleaners have awakened...');
    console.log('');
    
    // Simulate cleaner activity
    const cleanerMessages = [
      'Translucent beings drift across the mushroom field...',
      'Where they pass, the corrupted fungi wither away...',
      'Creature packs scatter and dissolve into mist...',
      'The very air grows lighter and cleaner...',
      'Ancient magic restores the natural balance...'
    ];
    
    cleanerMessages.forEach((message, index) => {
      setTimeout(() => {
        console.log(`[StreamReset] ${message}`);
      }, index * 800);
    });
  }

  private completeReset(): void {
    console.log('');
    console.log('[StreamReset] The field is cleansed and peaceful once more.');
    console.log('[StreamReset] The Cleaners return to their watery realm.');
    console.log('[StreamReset] A path ahead leads deeper into the earth...');
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('        TRIALS COMPLETE');
    console.log('═══════════════════════════════════════');
    console.log('You have proven worthy to enter the depths.');
    console.log('The cave entrance beckons...');
    console.log('');
  }

  // Static utility for triggering reset from anywhere
  static async triggerFieldReset(): Promise<void> {
    console.log('[StreamReset] Emergency field reset triggered!');
    
    // Clear any existing creature packs
    // Reset mushroom states
    // Restore safe state
    
    const messages = [
      'The stream\'s power surges through the field...',
      'All creatures flee or dissolve...',
      'Mushrooms return to dormant state...',
      'The field is safe once more.'
    ];
    
    for (let i = 0; i < messages.length; i++) {
      await new Promise(resolve => {
        setTimeout(() => {
          console.log(`[StreamReset] ${messages[i]}`);
          resolve(void 0);
        }, i * 1000);
      });
    }
  }
}
