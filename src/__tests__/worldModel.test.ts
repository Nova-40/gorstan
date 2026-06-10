import { describe, expect, test } from 'vitest';

import {
  deriveCompassOptions,
  deriveWorldMap,
  getCanonicalHotspots,
  getRoomMapMetadata,
  serializeSaveState,
  toWorldRoom,
} from '../engine/worldModel';
import { CanonicalRoomSchema } from '../schema/room';
import controlnexus from '../rooms/introZone_controlnexus';
import findlaterscornercoffeeshop from '../rooms/londonZone_findlaterscornercoffeeshop';

describe('worldModel', () => {
  test('derives compass movement and room actions from room data', () => {
    const room = {
      id: 'controlnexus',
      title: 'Control Nexus',
      description: 'A nexus.',
      exits: {
        north: 'controlroom',
        up: 'catwalk',
        sit: 'chair',
      },
    } as any;

    const options = deriveCompassOptions(room);
    expect(options.movement.map((entry) => entry.direction)).toEqual(['north', 'up']);
    expect(options.actions.map((entry) => entry.command)).toContain('sit');
  });

  test('handles rooms without hotspots or effects', () => {
    const room = toWorldRoom({
      id: 'empty',
      title: 'Empty',
      description: 'Nothing here.',
    } as any);

    expect(room?.hotspots).toEqual([]);
    expect(room?.effects).toEqual([]);
  });

  test('normalises click hotspots into parser commands', () => {
    const hotspots = getCanonicalHotspots({
      id: 'controlnexus',
      title: 'Control Nexus',
      description: 'A nexus.',
      clickHotspots: [
        {
          id: 'door',
          label: 'North Door',
          x: 5,
          y: 5,
          width: 10,
          height: 10,
          command: 'go north',
        },
      ],
    } as any);

    expect(hotspots[0]?.command).toBe('go north');
  });

  test('serializes save state with room, inventory, flags, and achievements', () => {
    const saveState = serializeSaveState({
      currentRoomId: 'controlnexus',
      flags: { torchReady: true },
      player: { inventory: ['torch'] },
      metadata: { achievements: ['explorer'] },
    });

    expect(saveState.currentRoomId).toBe('controlnexus');
    expect(saveState.inventory).toEqual(['torch']);
    expect(saveState.flags.torchReady).toBe(true);
    expect(saveState.achievements[0]?.id).toBe('explorer');
  });

  test('prefers authored map metadata when deriving room world data', () => {
    const metadata = getRoomMapMetadata({
      id: 'controlnexus',
      title: 'Control Nexus',
      description: 'A nexus.',
      zone: 'introZone',
      map: { zone: 'Intro', coordinates: { x: 0, y: 1 } },
    } as any);

    expect(metadata).toEqual({ zone: 'Intro', coordinates: { x: 0, y: 1 }, discovered: undefined });
  });

  test('derives a zone-grouped world map from authored rooms', () => {
    const zones = deriveWorldMap(
      {
        controlnexus: {
          id: 'controlnexus',
          title: 'Control Nexus',
          description: 'A nexus.',
          zone: 'introZone',
          exits: { west: 'controlroom' },
          actions: [{ id: 'inspect-console', label: 'Inspect Console', command: 'inspect console' }],
          hotspots: [{ id: 'console', label: 'Console', x: 0, y: 0, width: 10, height: 10, command: 'inspect console' }],
          map: { zone: 'Intro', coordinates: { x: 0, y: 0 } },
        },
        controlroom: {
          id: 'controlroom',
          title: 'Control Room',
          description: 'A room.',
          zone: 'introZone',
          exits: { east: 'controlnexus' },
          map: { zone: 'Intro', coordinates: { x: 1, y: 0 } },
        },
      } as any,
      'controlnexus',
      ['controlnexus'],
    );

    expect(zones).toHaveLength(1);
    expect(zones[0]?.label).toBe('Intro');
    expect(zones[0]?.visitedCount).toBe(1);
    expect(zones[0]?.rooms[0]?.zone).toBe('Intro');
  });

  test('normalizes migrated room modules into canonical room schema', () => {
    const authoredRooms = [controlnexus, findlaterscornercoffeeshop]
      .map((room) => toWorldRoom(room))
      .filter((room): room is NonNullable<typeof room> => room !== null);

    expect(authoredRooms).toHaveLength(2);
    authoredRooms.forEach((room) => {
      expect(() => CanonicalRoomSchema.parse(room)).not.toThrow();
      expect(room.actions.length).toBeGreaterThan(0);
      expect(room.hotspots.length).toBeGreaterThan(0);
      expect(room.map?.zone).toBeTruthy();
    });
  });
});