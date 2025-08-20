import { IS_DEMO } from '../config/mode';
import { Storage } from '../utils/storage';

/**
 * Demo save data structure - minimal and spoiler-free
 */
interface DemoSaveData {
  version: number;
  player: {
    name?: string;
    currentRoom: string;
    inventory: string[];
    health: number;
  };
  flags: Record<string, boolean>;
  visitedRooms: string[];
  timestamp: string;
  isDemo: true;
}

/**
 * Create a minimal starter save for demo mode
 */
export function seedDemoSave(): DemoSaveData {
  return {
    version: 1,
    player: {
      currentRoom: 'controlnexus', // Start at control nexus
      inventory: ['teleport_token'], // One teleport token for exploration
      health: 100
    },
    flags: {
      // Demo-safe flags only
      demoMode: true,
      tutorialCompleted: false,
      aylaIntroduced: false
    },
    visitedRooms: ['controlnexus'],
    timestamp: new Date().toISOString(),
    isDemo: true
  };
}

/**
 * Initialize demo save if none exists
 */
export function initializeDemoSave(): void {
  if (!IS_DEMO) return;

  const existingSave = Storage.getItem('demo_save');
  if (!existingSave) {
    const demoSave = seedDemoSave();
    Storage.setItem('demo_save', JSON.stringify(demoSave));
    console.log('Demo save initialized');
  }
}

/**
 * Get demo-specific settings
 */
export function getDemoSettings() {
  return {
    sfxEnabled: false, // Default SFX off in demo
    musicEnabled: true,
    reducedMotion: true, // Respect accessibility 
    hintCadence: 6000, // Faster hints in demo
    showTutorialPrompts: true
  };
}

/**
 * Apply demo-specific balance adjustments
 */
export function applyDemoBalance() {
  if (!IS_DEMO) return;

  // Ensure settings are demo-appropriate
  const settings = getDemoSettings();
  
  // Store demo settings
  Storage.setItem('demo_settings', JSON.stringify(settings));
  
  // Initialize demo save if needed
  initializeDemoSave();
}
