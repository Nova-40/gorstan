import { roomRegistry } from '../roomRegistry';

/**
 * Graph utilities for room connectivity analysis
 */

interface Exit {
  to: string;
  description?: string;
  requires?: string[];
}

interface RoomData {
  id: string;
  exits?: Exit[] | Record<string, string>;
  [key: string]: any;
}

/**
 * Get neighboring rooms from a given room
 */
export function neighbors(roomId: string): string[] {
  const room = roomRegistry[roomId] as RoomData;
  if (!room || !room.exits) {
    return [];
  }
  
  // Handle both array and object exit formats
  if (Array.isArray(room.exits)) {
    return room.exits.map((exit: Exit) => exit.to);
  } else {
    return Object.values(room.exits);
  }
}

/**
 * Check if two rooms are directly connected
 */
export function areConnected(fromRoom: string, toRoom: string): boolean {
  return neighbors(fromRoom).includes(toRoom);
}

/**
 * Find shortest path between two rooms using BFS
 */
export function findPath(startRoom: string, endRoom: string): string[] | null {
  if (startRoom === endRoom) {return [startRoom];}
  
  const visited = new Set<string>();
  const queue: { room: string; path: string[] }[] = [{ room: startRoom, path: [startRoom] }];
  
  while (queue.length > 0) {
    const { room, path } = queue.shift()!;
    
    if (visited.has(room)) {continue;}
    visited.add(room);
    
    const roomNeighbors = neighbors(room);
    
    for (const neighbor of roomNeighbors) {
      if (neighbor === endRoom) {
        return [...path, neighbor];
      }
      
      if (!visited.has(neighbor)) {
        queue.push({ room: neighbor, path: [...path, neighbor] });
      }
    }
  }
  
  return null; // No path found
}

/**
 * Validate that a path is traversable (each consecutive pair is connected)
 */
export function validatePath(path: string[]): { isValid: boolean; brokenAt?: number; missingRooms?: string[] } {
  const missingRooms: string[] = [];
  
  // Check if all rooms exist
  for (const roomId of path) {
    if (!roomRegistry[roomId]) {
      missingRooms.push(roomId);
    }
  }
  
  if (missingRooms.length > 0) {
    return { isValid: false, missingRooms };
  }
  
  // Check connectivity
  for (let i = 0; i < path.length - 1; i++) {
    const currentRoom = path[i];
    const nextRoom = path[i + 1];
    
    if (currentRoom && nextRoom && !areConnected(currentRoom, nextRoom)) {
      return { isValid: false, brokenAt: i };
    }
  }
  
  return { isValid: true };
}

/**
 * Get all rooms reachable from a starting room
 */
export function getReachableRooms(startRoom: string, maxDepth: number = Infinity): Set<string> {
  const reachable = new Set<string>();
  const queue: { room: string; depth: number }[] = [{ room: startRoom, depth: 0 }];
  
  while (queue.length > 0) {
    const { room, depth } = queue.shift()!;
    
    if (reachable.has(room) || depth > maxDepth) {continue;}
    reachable.add(room);
    
    const roomNeighbors = neighbors(room);
    for (const neighbor of roomNeighbors) {
      if (!reachable.has(neighbor)) {
        queue.push({ room: neighbor, depth: depth + 1 });
      }
    }
  }
  
  return reachable;
}

/**
 * Analyze room graph connectivity
 */
export function analyzeConnectivity() {
  const allRooms = Object.keys(roomRegistry);
  const startRoom = 'introZone_controlnexus'; // Standard starting point
  
  if (!roomRegistry[startRoom]) {
    throw new Error(`Start room '${startRoom}' not found in registry`);
  }
  
  const reachableFromStart = getReachableRooms(startRoom);
  const unreachableRooms = allRooms.filter(room => !reachableFromStart.has(room));
  
  return {
    totalRooms: allRooms.length,
    reachableFromStart: reachableFromStart.size,
    unreachableRooms,
    connectivityRatio: reachableFromStart.size / allRooms.length
  };
}
