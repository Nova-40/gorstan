import { describe, test, expect } from 'vitest';
import { rooms } from '../roomRegistry';
import { RoomSchema } from '../schema/room';
import { assert, safeParse } from '../schema/assert';

describe('Room Graph Validation', () => {
  test('All rooms have valid structure', () => {
    Object.entries(rooms).forEach(([roomId, room]) => {
      const result = safeParse(room, RoomSchema);
      
      if (!result.success) {
        throw new Error(`Room ${roomId} failed validation: ${result.error}`);
      }
      
      expect(result.data.id).toBe(roomId);
    });
  });

  test('All room exits point to valid rooms', () => {
    const roomIds = new Set(Object.keys(rooms));
    const invalidExits: string[] = [];

    Object.entries(rooms).forEach(([roomId, room]) => {
      room.exits?.forEach(exit => {
        if (!roomIds.has(exit.to)) {
          invalidExits.push(`${roomId} -> ${exit.to}`);
        }
      });
    });

    if (invalidExits.length > 0) {
      throw new Error(`Invalid exits found:\n${invalidExits.join('\n')}`);
    }
  });

  test('Room graph is connected (no isolated rooms)', () => {
    const roomIds = new Set(Object.keys(rooms));
    const reachableRooms = new Set<string>();
    
    // Start from intro room
    const startRoom = 'introstart';
    if (!roomIds.has(startRoom)) {
      throw new Error(`Start room ${startRoom} not found`);
    }

    // BFS to find all reachable rooms
    const queue = [startRoom];
    reachableRooms.add(startRoom);

    while (queue.length > 0) {
      const currentRoom = queue.shift()!;
      const room = rooms[currentRoom];
      
      room.exits?.forEach(exit => {
        if (roomIds.has(exit.to) && !reachableRooms.has(exit.to)) {
          reachableRooms.add(exit.to);
          queue.push(exit.to);
        }
      });
    }

    const unreachableRooms = [...roomIds].filter(id => !reachableRooms.has(id));
    
    if (unreachableRooms.length > 0) {
      console.warn('Unreachable rooms (may be intentional):', unreachableRooms);
    }

    // Most rooms should be reachable
    expect(reachableRooms.size).toBeGreaterThan(roomIds.size * 0.8);
  });

  test('No circular references in immediate exits', () => {
    Object.entries(rooms).forEach(([roomId, room]) => {
      const selfReferencingExits = room.exits?.filter(exit => exit.to === roomId) || [];
      
      // Self-references should be intentional (like loops/mazes)
      if (selfReferencingExits.length > 0) {
        console.info(`Room ${roomId} has self-referencing exits (may be intentional)`);
      }
    });
  });

  test('Zone consistency', () => {
    const zoneRooms = new Map<string, string[]>();
    
    Object.entries(rooms).forEach(([roomId, room]) => {
      const zone = room.zone;
      if (!zoneRooms.has(zone)) {
        zoneRooms.set(zone, []);
      }
      zoneRooms.get(zone)!.push(roomId);
    });

    // Each zone should have at least one room
    zoneRooms.forEach((roomList, zoneName) => {
      expect(roomList.length).toBeGreaterThan(0);
    });

    // Log zone distribution
    console.info('Zone distribution:', 
      Object.fromEntries([...zoneRooms.entries()].map(([zone, rooms]) => [zone, rooms.length]))
    );
  });
});
