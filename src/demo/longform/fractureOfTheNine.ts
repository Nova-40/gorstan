/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Fracture of the Nine - 30 minute adventure
*/

import { clearDemo } from '../demoRouter';

export async function startFractureOfTheNine(): Promise<void> {
  console.log('[FractureOfTheNine] Beginning the Fracture of the Nine adventure...');
  
  try {
    await runFractureSaga();
    
    console.log('[FractureOfTheNine] Adventure completed successfully');
    
    setTimeout(() => {
      clearDemo();
      console.log('[FractureOfTheNine] Returning to Choose Your Adventure...');
    }, 3000);
    
  } catch (error) {
    console.error('[FractureOfTheNine] Adventure failed:', error);
    clearDemo();
    throw error;
  }
}

interface Shard {
  name: string;
  location: string;
  power: string;
  constraint: string;
  collected: boolean;
}

async function runFractureSaga(): Promise<void> {
  const shards: Shard[] = [
    { name: "Shard of Beginnings", location: "The First Garden", power: "Seeds any creation", constraint: "Must plant before harvesting", collected: false },
    { name: "Shard of Flowing", location: "The Eternal River", power: "Grants fluid movement", constraint: "Cannot stand still", collected: false },
    { name: "Shard of Burning", location: "The Phoenix Crater", power: "Ignites passion", constraint: "Consumes fuel constantly", collected: false },
    { name: "Shard of Knowing", location: "The Library Infinite", power: "Reveals all truths", constraint: "Cannot unknow painful facts", collected: false },
    { name: "Shard of Binding", location: "The Web Between", power: "Connects all things", constraint: "Shares all pain and joy", collected: false },
    { name: "Shard of Changing", location: "The Shifting Maze", power: "Transforms anything", constraint: "Nothing stays the same", collected: false },
    { name: "Shard of Voiding", location: "The Hungry Dark", power: "Unmakes obstacles", constraint: "Devours memories too", collected: false },
    { name: "Shard of Harmony", location: "The Singing Stones", power: "Balances all forces", constraint: "Requires perfect pitch", collected: false },
    { name: "Shard of Endings", location: "The Final Shore", power: "Completes any cycle", constraint: "Cannot begin anew", collected: false }
  ];

  return new Promise((resolve) => {
    console.log('═══════════════════════════════════════');
    console.log('        THE FRACTURE OF THE NINE');
    console.log('═══════════════════════════════════════');
    console.log('Reality itself lies broken...');
    console.log('Nine shards of the Primordial Truth are scattered.');
    console.log('Each grants power, but demands a price.');
    console.log('Gather them all, but choose your assembly wisely.');
    console.log('For the final configuration shapes all existence.');
    console.log('');
    
    let shardIndex = 0;
    
    function collectNextShard() {
      if (shardIndex < shards.length) {
        setTimeout(() => {
          collectShard(shards[shardIndex]).then(() => {
            shardIndex++;
            collectNextShard();
          });
        }, 1500);
      } else {
        setTimeout(() => {
          assembleShards(shards).then(resolve);
        }, 2000);
      }
    }
    
    collectNextShard();
  });
}

function collectShard(shard: Shard): Promise<void> {
  return new Promise((resolve) => {
    console.log(`[FractureOfTheNine] === ${shard.name.toUpperCase()} ===`);
    console.log(`[FractureOfTheNine] Journey to ${shard.location}...`);
    
    setTimeout(() => {
      console.log(`[FractureOfTheNine] You feel the ${shard.name} calling...`);
      console.log(`[FractureOfTheNine] Power: ${shard.power}`);
      console.log(`[FractureOfTheNine] Warning: ${shard.constraint}`);
      
      setTimeout(() => {
        shard.collected = true;
        console.log(`[FractureOfTheNine] ${shard.name} claimed!`);
        console.log(`[FractureOfTheNine] The constraint takes hold...`);
        
        // Show accumulating effects
        const collectedCount = Math.floor(Math.random() * 3) + 1;
        console.log(`[FractureOfTheNine] ${collectedCount} shards resonate together...`);
        
        resolve();
      }, 2000);
    }, 1500);
  });
}

function assembleShards(shards: Shard[]): Promise<void> {
  return new Promise((resolve) => {
    console.log('[FractureOfTheNine] === THE GREAT ASSEMBLY ===');
    console.log('[FractureOfTheNine] All nine shards orbit around you...');
    console.log('[FractureOfTheNine] Each pulses with primal power...');
    console.log('[FractureOfTheNine] But their constraints war with each other...');
    console.log('');
    
    setTimeout(() => {
      console.log('[FractureOfTheNine] You must choose the final configuration...');
      console.log('[FractureOfTheNine] Three patterns present themselves:');
      console.log('[FractureOfTheNine] 1. The Circle of Eternal Change');
      console.log('[FractureOfTheNine] 2. The Spiral of Growing Wisdom');
      console.log('[FractureOfTheNine] 3. The Star of Balanced Forces');
      
      setTimeout(() => {
        // Simulate choice
        const patterns = ['Circle', 'Spiral', 'Star'];
        const chosen = patterns[Math.floor(Math.random() * patterns.length)];
        
        console.log(`[FractureOfTheNine] You choose the ${chosen}...`);
        
        setTimeout(() => {
          console.log('[FractureOfTheNine] The shards snap into alignment!');
          console.log('[FractureOfTheNine] Reality reshapes itself around your will...');
          
          setTimeout(() => {
            console.log('[FractureOfTheNine] The fracture heals, but reality is forever changed...');
            console.log('[FractureOfTheNine] New laws of existence take hold...');
            
            setTimeout(() => {
              console.log('');
              console.log('═══════════════════════════════════════');
              console.log('     FRACTURE OF THE NINE COMPLETE!');
              console.log('═══════════════════════════════════════');
              console.log('The universe bears the mark of your choices.');
              console.log('Nine truths unified, one vision realized.');
              console.log('What was broken now serves a greater purpose.');
              resolve();
            }, 3000);
          }, 2500);
        }, 2000);
      }, 3000);
    }, 2000);
  });
}
