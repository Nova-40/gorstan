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
import { roomSchema } from '../schema/roomSchema';
import { getFallbackRoom } from './roomLoaderFallback';
import {
  incrementTotalLoads,
  incrementFallbacks,
  incrementValidationFailures,
  getLoaderMetrics,
} from './loaderMetrics';

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
// Build a lazy registry using Vite's import.meta.glob so Vite can statically analyze room modules.
// Use globEager to synchronously import room modules at build time and then
// wrap them in promise-returning loaders.
type RoomModule = { default?: Room } | Room;
const eagerModules = (import.meta as unknown as { globEager: (pattern: string) => Record<string, RoomModule> }).globEager('../rooms/*.ts');

  const lazyRoomRegistry: LazyRoomRegistry = Object.keys(eagerModules).reduce((acc, path) => {
  const segments = path.replace(/\\/g, '/').split('/');
  const fileName = segments[segments.length - 1] || '';
  const baseName = fileName.replace(/\.ts$/, '');
  const normalizedRoomId = baseName.split('_').slice(-1)[0];

  if (!normalizedRoomId) return acc;

  const mod = eagerModules[path] as RoomModule | undefined;
  if (!mod) return acc;

  // Return a loader function that returns the already-imported module as a Promise
  acc[normalizedRoomId] = async () => {
    const m = mod as RoomModule;
    // If module is an ES module with default export
    if (m && typeof m === 'object' && 'default' in m && m.default && typeof m.default === 'object') {
      return m.default as Room;
    }
    // Otherwise assume module itself is a Room
    return (m as Room) as Room;
  };

  return acc;
}, {} as LazyRoomRegistry);

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
  totalLoads: 0,
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
  incrementTotalLoads();

  // Create loading promise
  const loadingPromise = loader()
    .then((room) => {
      // Validate room shape at runtime and fail fast if invalid
      try {
        roomSchema.parse(room);
      } catch (err) {
        console.warn(`[OptimizedRoomLoader] Room validation failed for ${roomId}. Falling back to emergency room.`, err);
        incrementValidationFailures();
        const fallback = getFallbackRoom(roomId);
        if (fallback) {
          incrementFallbacks();
          roomCache.set(roomId, fallback);
          loadingPromises.delete(roomId);
          return fallback;
        }

        // No fallback available: return null to allow callers to handle it
        loadingPromises.delete(roomId);
        return null as unknown as Room;
      }
      const loadTime = performance.now() - startTime;
      metrics.loadTimes[roomId] = loadTime;

      console.log(`[OptimizedRoomLoader] Loaded room ${roomId} in ${loadTime.toFixed(2)}ms`);

      // Cache the room
      roomCache.set(roomId, room);

      // Remove from loading promises
      loadingPromises.delete(roomId);

      return room;
    })
    .catch((error) => {
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
  const criticalRooms = ['controlnexus', 'controlroom', 'crossing', 'hiddenlab'];

  console.log('[OptimizedRoomLoader] Preloading critical rooms...');

  const preloadPromises = criticalRooms.map((roomId) =>
    loadOptimizedRoom(roomId).catch((error) => {
      console.warn(`[OptimizedRoomLoader] Failed to preload ${roomId}:`, error);
    }),
  );

  await Promise.all(preloadPromises);
  console.log('[OptimizedRoomLoader] Critical rooms preloaded');
}

/**
 * Preload adjacent rooms for smoother navigation
 */
export async function preloadAdjacentRooms(currentRoomId: string): Promise<void> {
  const currentRoom = roomCache.get(currentRoomId);
  if (!currentRoom?.exits) {
    return;
  }

  const adjacentRoomIds = Object.values(currentRoom.exits).filter(Boolean) as string[];

  // Load adjacent rooms in background
  adjacentRoomIds.forEach((roomId) => {
    if (!roomCache.has(roomId) && !loadingPromises.has(roomId)) {
      loadOptimizedRoom(roomId).catch((error) => {
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

// Expose loader metrics in dev for quick debugging
if (import.meta.env.DEV) {
  const win = window as unknown as { gorstan?: Record<string, any> };
  win.gorstan = {
    ...(win.gorstan || {}),
    loaderMetrics: {
      getMetrics: () => ({ ...getLoadingMetrics(), ...getLoaderMetrics() }),
    },
  };
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
export function getAvailableRoomIds(): string[] {
  return Object.keys(lazyRoomRegistry);
}

/**
 * Check if room is available without loading it
 */
export function isRoomAvailable(roomId: string): boolean {
  return roomId in lazyRoomRegistry;
}

/**
 * Get cache status
 */
export function getCacheStatus(): {
  cachedRooms: string[];
  loadingRooms: string[];
  hitRate: number;
} {
  const hitRate =
    metrics.totalLoads > 0
      ? (metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses)) * 100
      : 0;

  return {
    cachedRooms: Array.from(roomCache.keys()),
    loadingRooms: Array.from(loadingPromises.keys()),
    hitRate: Math.round(hitRate * 100) / 100,
  };
}
