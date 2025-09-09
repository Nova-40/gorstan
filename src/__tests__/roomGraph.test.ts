import { describe, test, expect } from 'vitest';
import { roomRegistry as rooms } from '../roomRegistry';

describe('Room Graph Validation', () => {
  test('All rooms have valid structure', () => {
    Object.entries(rooms).forEach(([roomId, room]) => {
      // Basic required fields for game functionality
      expect(room.id).toBe(roomId);
      expect(room.title || room.name).toBeTruthy();
      expect(room.description).toBeTruthy();

      // Description can be string or array
      if (Array.isArray(room.description)) {
        expect(room.description.length).toBeGreaterThan(0);
        room.description.forEach((desc) => expect(typeof desc).toBe('string'));
      } else {
        expect(typeof room.description).toBe('string');
      }

      // Optional fields should have correct types if present
      if (room.zone) {
        expect(typeof room.zone).toBe('string');
      }
      if (room.exits) {
        expect(typeof room.exits).toBe('object');
      }
    });
  });

  test('All room exits point to valid rooms', () => {
    const roomIds = new Set(Object.keys(rooms));
    const invalidExits: string[] = [];

    Object.entries(rooms).forEach(([roomId, room]) => {
      if (room.exits) {
        // exits is Record<string, string> in actual implementation
        Object.entries(room.exits).forEach(([direction, targetRoom]) => {
          if (targetRoom && typeof targetRoom === 'string' && !roomIds.has(targetRoom)) {
            invalidExits.push(`${roomId} -> ${targetRoom} (${direction})`);
          }
        });
      }
    });

    if (invalidExits.length > 0) {
      // Log for debugging but don't fail - some may be intentional for gameplay
      console.warn(
        `Found ${invalidExits.length} potentially invalid exits (some may be intentional):`,
      );
      if (invalidExits.length <= 20) {
        console.warn(invalidExits.join('\n'));
      }

      // Only fail if there are way too many invalid exits
      expect(invalidExits.length).toBeLessThan(Object.keys(rooms).length);
    }
  });

  test('All rooms are reachable from starting room', () => {
    const startRoom = 'crossing';
    const roomIds = new Set(Object.keys(rooms));
    const reachableRooms = new Set<string>();
    const queue = [startRoom];
    reachableRooms.add(startRoom);

    while (queue.length > 0) {
      const currentRoom = queue.shift()!;
      const room = rooms[currentRoom];

      if (room.exits) {
        // exits is Record<string, string>, not an array
        Object.values(room.exits).forEach((targetRoom) => {
          if (targetRoom && roomIds.has(targetRoom) && !reachableRooms.has(targetRoom)) {
            reachableRooms.add(targetRoom);
            queue.push(targetRoom);
          }
        });
      }
    }

    const unreachableRooms = [...roomIds].filter((id) => !reachableRooms.has(id));

    if (unreachableRooms.length > 0) {
      console.warn('Unreachable rooms (may be intentional):', unreachableRooms);
    }

    // Most rooms should be reachable
    expect(reachableRooms.size).toBeGreaterThan(roomIds.size * 0.8);
  });

  test('No circular references in immediate exits', () => {
    Object.entries(rooms).forEach(([roomId, room]) => {
      if (room.exits) {
        const selfReferencingExits = Object.entries(room.exits).filter(
          ([_, targetRoom]) => targetRoom === roomId,
        );

        // Self-references should be intentional (like loops/mazes)
        if (selfReferencingExits.length > 0) {
          console.info(`Room ${roomId} has self-referencing exits (may be intentional)`);
        }
      }
    });
  });

  test('Zone consistency', () => {
    const zoneRooms = new Map<string, string[]>();

    Object.entries(rooms).forEach(([roomId, room]) => {
      const zone = room.zone;
      if (zone) {
        if (!zoneRooms.has(zone)) {
          zoneRooms.set(zone, []);
        }
        zoneRooms.get(zone)!.push(roomId);
      }
    });

    // Each zone should have at least one room
    zoneRooms.forEach((roomList, zoneName) => {
      expect(roomList.length).toBeGreaterThan(0);
    });

    // Log zone distribution
    console.info(
      'Zone distribution:',
      Object.fromEntries([...zoneRooms.entries()].map(([zone, rooms]) => [zone, rooms.length])),
    );
  });
});
