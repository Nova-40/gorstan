/**
 * Mock room data for testing
 */

import type { Room, RoomItem, RoomNPC } from '../types/Room.d';

export const mockRoomItem: RoomItem = {
  id: 'test-item',
  name: 'Test Item',
  description: 'A test item for testing purposes',
  isKey: false,
  cursed: false,
  oneTimeUse: false,
};

export const mockRoomNPC: RoomNPC = {
  id: 'test-npc',
  name: 'Test NPC',
  entryMessage: 'A test NPC appears',
};

export const mockRoom: Room = {
  id: 'test-room',
  title: 'Test Room',
  description: 'A test room for testing purposes',
  exits: {
    north: 'test-room-north',
    south: 'test-room-south',
  },
  flags: {},
  items: [mockRoomItem],
  npcs: [mockRoomNPC],
  zone: 'test-zone',
};

export const createMockRoom = (overrides: Partial<Room> = {}): Room => ({
  ...mockRoom,
  ...overrides,
});
