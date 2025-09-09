/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Ruins of Stanton - 10 minute demo route
*/

import { clearDemo } from '../demoRouter';

export async function startRuinsOfStanton(): Promise<void> {
  console.log('[RuinsOfStanton] Beginning the Ruins of Stanton demo...');

  try {
    await runRuinsSequence();

    console.log('[RuinsOfStanton] Demo completed successfully');

    setTimeout(() => {
      clearDemo();
      console.log('[RuinsOfStanton] Returning to Choose Your Adventure...');
    }, 3000);
  } catch (error) {
    console.error('[RuinsOfStanton] Demo failed:', error);
    clearDemo();
    throw error;
  }
}

async function runRuinsSequence(): Promise<void> {
  return new Promise((resolve) => {
    console.log('═══════════════════════════════════════');
    console.log('        THE RUINS OF STANTON');
    console.log('═══════════════════════════════════════');
    console.log('Crumbling council chambers hold forgotten laws...');
    console.log('Planning documents flutter like ghosts of policy.');
    console.log('Each decision made here shaped lives and futures.');
    console.log('');

    setTimeout(() => {
      console.log('[RuinsOfStanton] A dusty filing cabinet stands ajar...');
      console.log('[RuinsOfStanton] "Minutes of the Final Meeting - CONFIDENTIAL"');

      setTimeout(() => {
        console.log('[RuinsOfStanton] You open the folder with care...');
        console.log("[RuinsOfStanton] The pages chronicle a town's last days...");

        setTimeout(() => {
          console.log('[RuinsOfStanton] "Proposal: Relocate due to subsidence..."');
          console.log('[RuinsOfStanton] "Amendment: Emergency housing fund..."');
          console.log('[RuinsOfStanton] "Motion carries. Town meeting adjourned."');

          setTimeout(() => {
            console.log('[RuinsOfStanton] A photo falls from the documents...');
            console.log('[RuinsOfStanton] Happy families at the last summer fair...');

            setTimeout(() => {
              console.log('[RuinsOfStanton] The ghost of bureaucracy whispers thanks...');
              console.log('[RuinsOfStanton] "Someone finally read our final words."');
              console.log('');
              console.log('═══════════════════════════════════════');
              console.log('     RUINS OF STANTON COMPLETE!');
              console.log('═══════════════════════════════════════');
              resolve();
            }, 2500);
          }, 2000);
        }, 2500);
      }, 2000);
    }, 1500);
  });
}
