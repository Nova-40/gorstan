/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Glade of Echoes - 10 minute demo route
*/

import { clearDemo } from '../demoRouter';

export async function startGladeOfEchoes(): Promise<void> {
  console.log('[GladeOfEchoes] Beginning the Glade of Echoes demo...');

  try {
    await runGladeSequence();

    console.log('[GladeOfEchoes] Demo completed successfully');

    setTimeout(() => {
      clearDemo();
      console.log('[GladeOfEchoes] Returning to main menu...');
    }, 3000);
  } catch (error) {
    console.error('[GladeOfEchoes] Demo failed:', error);
    clearDemo();
    throw error;
  }
}

async function runGladeSequence(): Promise<void> {
  return new Promise((resolve) => {
    console.log('═══════════════════════════════════════');
    console.log('        THE GLADE OF ECHOES');
    console.log('═══════════════════════════════════════');
    console.log('Twisted trees whisper in languages long forgotten...');
    console.log('Each choice you make echoes through the branches.');
    console.log('The glade tests not your strength, but your soul.');
    console.log('');

    setTimeout(() => {
      console.log('[GladeOfEchoes] A shimmering path splits before you...');

      setTimeout(() => {
        console.log('[GladeOfEchoes] The left path gleams with golden light...');
        console.log('[GladeOfEchoes] The right path whispers with silver shadows...');

        setTimeout(() => {
          // Simulate moral choice sequence
          console.log('[GladeOfEchoes] You choose the path of balance...');
          console.log('[GladeOfEchoes] The trees nod in ancient approval...');

          setTimeout(() => {
            console.log('[GladeOfEchoes] Your reflection appears in a still pond...');
            console.log('[GladeOfEchoes] But it shows who you could become...');

            setTimeout(() => {
              console.log('[GladeOfEchoes] The glade releases you, wiser than before.');
              console.log('');
              console.log('═══════════════════════════════════════');
              console.log('     GLADE OF ECHOES COMPLETE!');
              console.log('═══════════════════════════════════════');
              resolve();
            }, 2000);
          }, 3000);
        }, 2500);
      }, 2000);
    }, 1500);
  });
}
