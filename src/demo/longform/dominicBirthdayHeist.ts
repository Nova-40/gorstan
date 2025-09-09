/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Dominic's Birthday Heist - 30 minute adventure
*/

import { clearDemo } from '../demoRouter';

export async function startDominicBirthdayHeist(): Promise<void> {
  console.log("[DominicBirthdayHeist] Beginning Dominic's Birthday Heist adventure...");

  try {
    await runHeistSaga();

    console.log('[DominicBirthdayHeist] Adventure completed successfully');

    setTimeout(() => {
      clearDemo();
      console.log('[DominicBirthdayHeist] Returning to Choose Your Adventure...');
    }, 3000);
  } catch (error) {
    console.error('[DominicBirthdayHeist] Adventure failed:', error);
    clearDemo();
    throw error;
  }
}

async function runHeistSaga(): Promise<void> {
  return new Promise((resolve) => {
    console.log('═══════════════════════════════════════');
    console.log("       DOMINIC'S BIRTHDAY HEIST");
    console.log('═══════════════════════════════════════');
    console.log('The goldfish demands satisfaction...');
    console.log("Today is Dominic's birthday, and he wants CAKE.");
    console.log('Not just any cake - the Legendary Layer Cake of Lemuria.');
    console.log('Currently residing in the High Security Bakery Vault.');
    console.log('Assemble your crew and plan the perfect heist!');
    console.log('');

    let phase = 0;
    const phases = [
      () => recruitAlbie(),
      () => consultAyla(),
      () => gatherIntel(),
      () => executeHeist(),
      () => celebrateBirthday(),
    ];

    function nextPhase() {
      if (phase < phases.length) {
        setTimeout(() => {
          phases[phase]().then(() => {
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

function recruitAlbie(): Promise<void> {
  return new Promise((resolve) => {
    console.log('[DominicBirthdayHeist] === RECRUITING ALBIE ===');
    console.log('[DominicBirthdayHeist] "Albie, we need your distractions skills!"');
    console.log('[DominicBirthdayHeist] Albie: "For Dominic? I\'m in! I\'ve got new material."');

    setTimeout(() => {
      console.log('[DominicBirthdayHeist] Albie demonstrates the "Rubber Duck Routine"...');
      console.log('[DominicBirthdayHeist] Even the security cameras seem mesmerized...');

      setTimeout(() => {
        console.log('[DominicBirthdayHeist] "This will keep them busy for at least 10 minutes!"');
        console.log('[DominicBirthdayHeist] Albie added to heist crew!');
        resolve();
      }, 2500);
    }, 2000);
  });
}

function consultAyla(): Promise<void> {
  return new Promise((resolve) => {
    console.log('[DominicBirthdayHeist] === CONSULTING AYLA ===');
    console.log('[DominicBirthdayHeist] "Ayla, we need ethical guidance on cake liberation."');
    console.log('[DominicBirthdayHeist] Ayla: "Hmm, stealing is wrong, but birthday cakes..."');

    setTimeout(() => {
      console.log('[DominicBirthdayHeist] Ayla considers the moral implications...');
      console.log('[DominicBirthdayHeist] "What if we leave payment? Plus tip for excellence?"');

      setTimeout(() => {
        console.log('[DominicBirthdayHeist] "That transforms theft into surprise procurement!"');
        console.log('[DominicBirthdayHeist] Ayla provides ethical framework for heist!');
        resolve();
      }, 2500);
    }, 2000);
  });
}

function gatherIntel(): Promise<void> {
  return new Promise((resolve) => {
    console.log('[DominicBirthdayHeist] === INTELLIGENCE GATHERING ===');
    console.log('[DominicBirthdayHeist] Scouting the High Security Bakery...');
    console.log('[DominicBirthdayHeist] Guard rotation: Every 15 minutes.');

    setTimeout(() => {
      console.log('[DominicBirthdayHeist] Vault combination: Hidden in the sourdough starter...');
      console.log('[DominicBirthdayHeist] Security weakness: Everyone loves fresh cookies...');

      setTimeout(() => {
        console.log(
          '[DominicBirthdayHeist] Legendary Layer Cake location: Center vault, pedestal 3.',
        );
        console.log('[DominicBirthdayHeist] Intel gathered! Time to execute the plan!');
        resolve();
      }, 3000);
    }, 2000);
  });
}

function executeHeist(): Promise<void> {
  return new Promise((resolve) => {
    console.log('[DominicBirthdayHeist] === HEIST EXECUTION ===');
    console.log('[DominicBirthdayHeist] 11:30 PM - Operation Birthday Cake commences...');
    console.log('[DominicBirthdayHeist] Albie begins the distraction...');

    setTimeout(() => {
      console.log('[DominicBirthdayHeist] Albie: "Ladies and gentlemen, the amazing rubber duck!"');
      console.log('[DominicBirthdayHeist] Security guards: "Ooh, how does he do that?"');

      setTimeout(() => {
        console.log('[DominicBirthdayHeist] You slip past the mesmerized guards...');
        console.log('[DominicBirthdayHeist] Vault combination retrieved from sourdough!');

        setTimeout(() => {
          console.log('[DominicBirthdayHeist] Vault opens with a satisfying *click*...');
          console.log('[DominicBirthdayHeist] There it is - the Legendary Layer Cake!');

          setTimeout(() => {
            console.log('[DominicBirthdayHeist] Payment left on counter with thank-you note...');
            console.log(
              '[DominicBirthdayHeist] Cake secured! Exiting via cookie ventilation shaft...',
            );

            setTimeout(() => {
              console.log(
                '[DominicBirthdayHeist] Clean getaway! Nobody was harmed, all debts paid!',
              );
              resolve();
            }, 2000);
          }, 2500);
        }, 2000);
      }, 2500);
    }, 2000);
  });
}

function celebrateBirthday(): Promise<void> {
  return new Promise((resolve) => {
    console.log('[DominicBirthdayHeist] === BIRTHDAY CELEBRATION ===');
    console.log('[DominicBirthdayHeist] Back at the bowl with the legendary cake...');
    console.log("[DominicBirthdayHeist] Dominic's eyes widen with fishy delight...");

    setTimeout(() => {
      console.log('[DominicBirthdayHeist] Dominic: "Glub glub glub!" (Translation: "Perfect!")');
      console.log('[DominicBirthdayHeist] Candles lit, wishes made, cake shared...');

      setTimeout(() => {
        console.log('[DominicBirthdayHeist] Albie: "Best birthday heist ever!"');
        console.log('[DominicBirthdayHeist] Ayla: "Ethically sound and delicious!"');

        setTimeout(() => {
          console.log('[DominicBirthdayHeist] Dominic blows out candles with tiny fish lungs...');
          console.log(
            '[DominicBirthdayHeist] His wish: "More adventures with friends like these."',
          );

          setTimeout(() => {
            console.log('');
            console.log('═══════════════════════════════════════');
            console.log("    DOMINIC'S BIRTHDAY HEIST COMPLETE!");
            console.log('═══════════════════════════════════════');
            console.log('One satisfied goldfish, one legendary cake,');
            console.log('And a crew that proves crime can be wholesome');
            console.log('When approached with creativity and ethics.');
            console.log('');
            console.log('Happy Birthday, Dominic! 🎂🐠');
            resolve();
          }, 3000);
        }, 2500);
      }, 2500);
    }, 2000);
  });
}
