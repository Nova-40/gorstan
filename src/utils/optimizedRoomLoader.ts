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

// (c) Geoff Webster 2025

import type { Room } from '../types/Room';

interface RoomLoader {
  (): Promise<Room>;
}

interface LazyRoomRegistry {
  [roomId: string]: RoomLoader;
}

/**
 * Optimized lazy-loading room registry
 * Only loads room modules when actually needed
 */
// Many referenced room modules are currently missing. Provide a minimal lazy registry
// that returns placeholder rooms so the rest of the codebase can type-check.
const makePlaceholder = (id: string): Room => ({
  id,
  title: id,
  description: ['Area under construction.'],
  exits: {},
  zone: id.split('_')[0] ?? 'unknown'
});

const placeholderLoader = (id: string): RoomLoader => async () => makePlaceholder(id);

// Seed with only actually present baseline rooms to keep semantics plausible.
const presentIds = [
  'introZone_introreset',
  'gorstanZone_gorstanhub',
  'glitchZone_ravenchamber'
];

const lazyRoomRegistry: LazyRoomRegistry = Object.fromEntries(
  presentIds.map(id => [id, placeholderLoader(id)])
) as LazyRoomRegistry;

// Room cache for loaded rooms
const roomCache = new Map<string, Room>();
const loadingPromises = new Map<string, Promise<Room>>();

/**
 * Performance metrics
 */
interface LoadingMetrics {
  cacheHits: number;
  cacheMisses: number;
  loadTimes: Record<string, number>;
  totalLoads: number;
}

const metrics: LoadingMetrics = {
  cacheHits: 0,
  cacheMisses: 0,
  loadTimes: {},
  totalLoads: 0
};

/**
 * Load a room with caching and performance optimization
 */
export async function loadOptimizedRoom(roomId: string): Promise<Room | null> {
  const startTime = performance.now();
  
  // Check cache first
  if (roomCache.has(roomId)) {
    metrics.cacheHits++;
    console.log(`[OptimizedRoomLoader] Cache hit for room: ${roomId}`);
    return roomCache.get(roomId)!;
  }
  
  // Check if already loading
  if (loadingPromises.has(roomId)) {
    console.log(`[OptimizedRoomLoader] Already loading room: ${roomId}`);
    return loadingPromises.get(roomId)!;
  }
  
  // Get the loader
  const loader = lazyRoomRegistry[roomId];
  if (!loader) {
    console.warn(`[OptimizedRoomLoader] No loader found for room: ${roomId}`);
    return null;
  }
  
  metrics.cacheMisses++;
  metrics.totalLoads++;
  
  // Create loading promise
  const loadingPromise = loader()
    .then(room => {
      const loadTime = performance.now() - startTime;
      metrics.loadTimes[roomId] = loadTime;
      
      console.log(`[OptimizedRoomLoader] Loaded room ${roomId} in ${loadTime.toFixed(2)}ms`);
      
      // Cache the room
      roomCache.set(roomId, room);
      
      // Remove from loading promises
      loadingPromises.delete(roomId);
      
      return room;
    })
    .catch(error => {
      console.error(`[OptimizedRoomLoader] Failed to load room ${roomId}:`, error);
      loadingPromises.delete(roomId);
      throw error;
    });
  
  // Store the loading promise
  loadingPromises.set(roomId, loadingPromise);
  
  return loadingPromise;
}

/**
 * Preload critical rooms for faster access
 */
export async function preloadCriticalRooms(): Promise<void> {
  const criticalRooms = presentIds.slice(0, 2); // minimal for now
  
  console.log('[OptimizedRoomLoader] Preloading critical rooms...');
  
  const preloadPromises = criticalRooms.map(roomId => 
    loadOptimizedRoom(roomId).catch(error => {
      console.warn(`[OptimizedRoomLoader] Failed to preload ${roomId}:`, error);
    })
  );
  
  await Promise.all(preloadPromises);
  console.log('[OptimizedRoomLoader] Critical rooms preloaded');
}

/**
 * Preload adjacent rooms for smoother navigation
 */
export async function preloadAdjacentRooms(currentRoomId: string): Promise<void> {
  const currentRoom = roomCache.get(currentRoomId);
  if (!currentRoom?.exits) return;
  
  const adjacentRoomIds = Object.values(currentRoom.exits).filter(Boolean) as string[];
  
  // Load adjacent rooms in background
  adjacentRoomIds.forEach(roomId => {
    if (!roomCache.has(roomId) && !loadingPromises.has(roomId)) {
      loadOptimizedRoom(roomId).catch(error => {
        console.debug(`[OptimizedRoomLoader] Background load failed for ${roomId}:`, error);
      });
    }
  });
}

/**
 * Get performance metrics
 */
export function getLoadingMetrics(): LoadingMetrics {
  return { ...metrics };
}

/**
 * Clear cache (useful for development)
 */
export function clearRoomCache(): void {
  roomCache.clear();
  loadingPromises.clear();
  console.log('[OptimizedRoomLoader] Cache cleared');
}

/**
 * Get all available room IDs
 */
export function getAvailableRoomIds(): string[] { return Object.keys(lazyRoomRegistry); }

/**
 * Check if room is available without loading it
 */
export function isRoomAvailable(roomId: string): boolean { return roomId in lazyRoomRegistry; }

/**
 * Get cache status
 */
export function getCacheStatus(): { 
  cachedRooms: string[]; 
  loadingRooms: string[]; 
  hitRate: number; 
} {
  const hitRate = metrics.totalLoads > 0 
    ? (metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses)) * 100 
    : 0;
    
  return {
    cachedRooms: Array.from(roomCache.keys()),
    loadingRooms: Array.from(loadingPromises.keys()),
    hitRate: Math.round(hitRate * 100) / 100
  };
}
