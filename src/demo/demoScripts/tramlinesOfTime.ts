/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Tramlines of Time - 10 minute demo route
*/

import { clearDemo } from '../demoRouter';

export async function startTramlinesOfTime(): Promise<void> {
  console.log('[TramlinesOfTime] Beginning the Tramlines of Time demo...');
  
  try {
    await runTramlinesSequence();
    
    console.log('[TramlinesOfTime] Demo completed successfully');
    
    setTimeout(() => {
      clearDemo();
      console.log('[TramlinesOfTime] Returning to Choose Your Adventure...');
    }, 3000);
    
  } catch (error) {
    console.error('[TramlinesOfTime] Demo failed:', error);
    clearDemo();
    throw error;
  }
}

async function runTramlinesSequence(): Promise<void> {
  return new Promise((resolve) => {
    console.log('═══════════════════════════════════════');
    console.log('        THE TRAMLINES OF TIME');
    console.log('═══════════════════════════════════════');
    console.log('Rusted rails stretch into temporal mists...');
    console.log('Each track leads to a different when.');
    console.log('The signals flash patterns from futures past.');
    console.log('');
    
    setTimeout(() => {
      console.log('[TramlinesOfTime] A ghostly tram approaches on Track 1...');
      console.log('[TramlinesOfTime] "All aboard for Yesterday\'s Tomorrow!"');
      
      setTimeout(() => {
        console.log('[TramlinesOfTime] You pull the signal lever...');
        console.log('[TramlinesOfTime] Track switches creak and groan...');
        console.log('[TramlinesOfTime] Timeline sidings realign...');
        
        setTimeout(() => {
          console.log('[TramlinesOfTime] The tram shifts to a parallel track...');
          console.log('[TramlinesOfTime] Through the windows, you see other selves...');
          
          setTimeout(() => {
            console.log('[TramlinesOfTime] The conductor tips his temporal hat...');
            console.log('[TramlinesOfTime] "Next stop: the Present Moment!"');
            
            setTimeout(() => {
              console.log('[TramlinesOfTime] You step off at the station of Now.');
              console.log('[TramlinesOfTime] The tracks fade, but the journey remains.');
              console.log('');
              console.log('═══════════════════════════════════════');
              console.log('     TRAMLINES OF TIME COMPLETE!');
              console.log('═══════════════════════════════════════');
              resolve();
            }, 2500);
          }, 2000);
        }, 2500);
      }, 2000);
    }, 1500);
  });
}
