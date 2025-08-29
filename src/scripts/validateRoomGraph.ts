/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  You may play Gorstan for free for personal entertainment only.
  You may NOT copy, redistribute, modify, or sell the game, its code, 
  artwork, storyline, or any other part without written permission.
  
  Gorstan includes third-party libraries and assets:
    - React © Meta Platforms, Inc. – MIT Licence
    - Lucide Icons © Lucide Contributors – ISC Licence
    - Flaticon icons © Flaticon.com – Free Licence with attribution
    - Other packages under their respective licences (see package.json)

  Full licence terms: see EULA.md in the project root.
*/

// src/scripts/validateRoomGraph.ts
// Script to validate room graph integrity
// Gorstan Game Beta 1

import roomRegistry from '../roomRegistry';
import { RoomGraphValidator } from '../utils/roomGraphValidator';

/**
 * Run room graph validation and output results
 */
async function runValidation() {
  console.log('🔍 Starting room graph validation...\n');
  
  try {
    // Load room registry
    const roomMap = roomRegistry;
    console.log(`📊 Loaded ${Object.keys(roomMap).length} rooms\n`);
    
    // Run validation
    const validator = new RoomGraphValidator(roomMap);
    const stats = validator.validateGraph();
    
    // Generate and display report
    const report = validator.generateReport(stats);
    console.log(report);
    
    // Summary
    const issues = stats.invalidExits.length + 
                  stats.orphanRooms.length + 
                  stats.unreachableRooms.length;
    
    if (issues === 0) {
      console.log('✅ Room graph validation passed! No critical issues found.');
    } else {
      console.log(`❌ Room graph validation found ${issues} issues that need attention.`);
    }
    
    // Return stats for potential programmatic use
    return stats;
    
  } catch (error) {
    console.error('❌ Validation failed:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runValidation().catch(console.error);
}

export { runValidation };
