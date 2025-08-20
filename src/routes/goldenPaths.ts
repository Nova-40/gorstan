/**
 * Golden paths for 2-4 minute tours per zone
 * These provide curated journeys showcasing each zone's highlights
 */
export const GOLDEN_PATHS: Record<string, string[]> = {
  // Control/Intro zone - technological mystery
  control: [
    'controlnexus',
    'crossing', 
    'controlroom',
    'hiddenlab'
  ],

  // Elfhame/Faeglade - magical nature realm
  faeglade: [
    'elfhame',
    'faeglade',
    'faelake',
    'faelakenorthshore',
    'faepalacemainhall'
  ],

  // Glitch realm - digital corruption zone
  glitchrealm: [
    'datavoid',
    'glitchinguniverse',
    'issuesdetected',
    'ravenchamber'
  ],

  // Gorstan proper - Scottish highlands
  gorstan: [
    'gorstanhub',
    'gorstanvillage', 
    'torridon',
    'torridoninn',
    'carronspire'
  ],

  // Lattice zone - cosmic library
  lattice: [
    'latticehub',
    'lattice',
    'latticelibrary',
    'latticeobservatory',
    'hiddenlibrary'
  ],

  // London zone - urban adventure
  london: [
    'londonhub',
    'stkatherinesdock',
    'findlaters',
    'findlaterscornercoffeeshop',
    'dalesapartment'
  ],

  // Maze zone - puzzle and exploration
  maze: [
    'mazehub',
    'secretmazeentry',
    'mazeroom',
    'mirrorhall',
    'pollysbay'
  ],

  // New York zone - modern city
  newyork: [
    'manhattanhub',
    'centralpark',
    'aevirawarehouse',
    'burgerjoint'
  ],

  // Stanton zone - village variations
  stanton: [
    'stantonharcourt',
    'villagegreen',
    'peacefulStanton',
    'ascendantStanton'
  ]
};

/**
 * Get golden path for a zone
 */
export function getGoldenPath(zone: string): string[] {
  return GOLDEN_PATHS[zone] || [];
}

/**
 * Get all available golden paths
 */
export function getAllGoldenPaths(): Record<string, string[]> {
  return { ...GOLDEN_PATHS };
}

/**
 * Check if a room is part of any golden path
 */
export function isOnGoldenPath(roomId: string): boolean {
  return Object.values(GOLDEN_PATHS).some(path => path.includes(roomId));
}

/**
 * Get the zone for a golden path
 */
export function getZoneForPath(pathName: string): string | null {
  return Object.keys(GOLDEN_PATHS).includes(pathName) ? pathName : null;
}

/**
 * Estimate duration for a golden path (rough estimate in minutes)
 */
export function estimatePathDuration(pathName: string): number {
  const path = GOLDEN_PATHS[pathName];
  if (!path) return 0;
  
  // Rough estimate: 30-45 seconds per room
  return Math.ceil((path.length * 0.6)); // 0.6 minutes = 36 seconds average
}
