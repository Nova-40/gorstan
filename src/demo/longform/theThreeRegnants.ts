/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  The Three Regnants - 30 minute adventure
*/

import { clearDemo } from '../demoRouter';

export async function startThreeRegnants(): Promise<void> {
  console.log('[ThreeRegnants] Beginning The Three Regnants adventure...');
  
  try {
    await runRegnantsSaga();
    
    console.log('[ThreeRegnants] Adventure completed successfully');
    
    setTimeout(() => {
      clearDemo();
      console.log('[ThreeRegnants] Returning to Choose Your Adventure...');
    }, 3000);
    
  } catch (error) {
    console.error('[ThreeRegnants] Adventure failed:', error);
    clearDemo();
    throw error;
  }
}

async function runRegnantsSaga(): Promise<void> {
  return new Promise((resolve) => {
    console.log('═══════════════════════════════════════');
    console.log('        THE THREE REGNANTS');
    console.log('═══════════════════════════════════════');
    console.log('Three realms hover on the brink of war...');
    console.log('The Copper Crown of Valdris seeks trade.');
    console.log('The Silver Throne of Nethys demands tribute.');
    console.log('The Golden Court of Seraphim offers alliance.');
    console.log('You must broker a peace none dare speak of.');
    console.log('');
    
    let phase = 0;
    const phases = [
      () => runCourtOfValdris(),
      () => runThroneOfNethys(), 
      () => runCourtOfSeraphim(),
      () => runFinalNegotiation()
    ];
    
    function nextPhase() {
      if (phase < phases.length) {
        const fn = phases[phase];
        if (typeof fn !== 'function') {
          console.warn('[ThreeRegnants] Skipping missing phase function at index', phase);
          phase++;
          nextPhase();
          return;
        }
        setTimeout(() => {
          Promise.resolve(fn()).then(() => {
            phase++;
            nextPhase();
          }).catch(err => {
            console.error('[ThreeRegnants] Phase error', err);
            phase++;
            nextPhase();
          });
        }, 1000);
      } else {
        resolve();
      }
    }
    
    nextPhase();
  });
}

function runCourtOfValdris(): Promise<void> {
  return new Promise((resolve) => {
    console.log('[ThreeRegnants] === THE COPPER CROWN OF VALDRIS ===');
    console.log('[ThreeRegnants] Merchant-nobles count coins in marble halls...');
    console.log('[ThreeRegnants] "Profit before politics," they say.');
    
    setTimeout(() => {
      console.log('[ThreeRegnants] The Copper Regent speaks of trade routes...');
      console.log('[ThreeRegnants] "Open the borders, and wealth flows both ways."');
      
      setTimeout(() => {
        console.log('[ThreeRegnants] You negotiate mining rights and tariffs...');
        console.log('[ThreeRegnants] A deal is struck - conditional on the others.');
        resolve();
      }, 4000);
    }, 2000);
  });
}

function runThroneOfNethys(): Promise<void> {
  return new Promise((resolve) => {
    console.log('[ThreeRegnants] === THE SILVER THRONE OF NETHYS ===');
    console.log('[ThreeRegnants] War-banners hang from obsidian spires...');
    console.log('[ThreeRegnants] "Strength alone preserves sovereignty."');
    
    setTimeout(() => {
      console.log('[ThreeRegnants] The Silver Regent speaks of ancient slights...');
      console.log('[ThreeRegnants] "They must acknowledge our supremacy first."');
      
      setTimeout(() => {
        console.log('[ThreeRegnants] You propose a ceremonial tribute exchange...');
        console.log('[ThreeRegnants] Honor satisfied - for now.');
        resolve();
      }, 4000);
    }, 2000);
  });
}

function runCourtOfSeraphim(): Promise<void> {
  return new Promise((resolve) => {
    console.log('[ThreeRegnants] === THE GOLDEN COURT OF SERAPHIM ===');
    console.log('[ThreeRegnants] Crystalline gardens shimmer with harmony...');
    console.log('[ThreeRegnants] "Unity through understanding," they whisper.');
    
    setTimeout(() => {
      console.log('[ThreeRegnants] The Golden Regent speaks of cosmic balance...');
      console.log('[ThreeRegnants] "All realms must find their place in the greater dance."');
      
      setTimeout(() => {
        console.log('[ThreeRegnants] You outline a cultural exchange program...');
        console.log('[ThreeRegnants] Wisdom shared, bridges built.');
        resolve();
      }, 4000);
    }, 2000);
  });
}

function runFinalNegotiation(): Promise<void> {
  return new Promise((resolve) => {
    console.log('[ThreeRegnants] === THE NEUTRAL GROUND ===');
    console.log('[ThreeRegnants] All three Regnants meet in the Void Between...');
    console.log('[ThreeRegnants] Ancient protocols govern this sacred space.');
    
    setTimeout(() => {
      console.log('[ThreeRegnants] Tensions crackle like lightning...');
      console.log('[ThreeRegnants] Each ruler eyes the others with suspicion...');
      
      setTimeout(() => {
        console.log('[ThreeRegnants] You present the Threefold Compact...');
        console.log('[ThreeRegnants] Trade for Valdris, Honor for Nethys, Unity for Seraphim...');
        
        setTimeout(() => {
          console.log('[ThreeRegnants] The silence stretches like eternity...');
          
          setTimeout(() => {
            console.log('[ThreeRegnants] Three hands reach for three seals...');
            console.log('[ThreeRegnants] The pact is signed in copper, silver, and gold.');
            console.log('');
            console.log('═══════════════════════════════════════');
            console.log('     THE THREE REGNANTS COMPLETE!');
            console.log('═══════════════════════════════════════');
            console.log('Peace, fragile as spun glass, holds for now.');
            console.log('The realms begin their cautious dance toward unity.');
            resolve();
          }, 3000);
        }, 2500);
      }, 3000);
    }, 2000);
  });
}
