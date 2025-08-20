import { startGame } from '@/engine/GameEngine.js';
import { movePlayer } from '@/engine/roomRouter.js';
import { interactWithNPC } from '@/engine/npcEngine.js';
import { triggerTeleport } from '@/engine/teleportSystem.js';
import { interactWithSchrodingerCoin } from '@/engine/items.js';

(async () => {
  try {
    console.log('Starting smoke test...');

    // Start a new game
    await startGame('Test Player');
    console.log('Game started successfully.');

    // Move to two different rooms
    await movePlayer('room1');
    console.log('Moved to room1.');
    await movePlayer('room2');
    console.log('Moved to room2.');

    // Interact with an NPC
    await interactWithNPC('npc1');
    console.log('Interacted with NPC.');

    // Trigger a teleport
    await triggerTeleport('teleport1');
    console.log('Teleport triggered successfully.');

    // Interact with the Schrödinger coin
    await interactWithSchrodingerCoin();
    console.log('Interacted with Schrödinger coin.');

    console.log('Smoke test completed successfully.');
  } catch (error) {
    console.error('Smoke test failed:', error);
  }
})();
