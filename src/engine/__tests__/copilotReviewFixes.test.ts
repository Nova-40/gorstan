import cafeoffice from '../../rooms/londonZone_cafeoffice';
import dalesBedroom from '../../rooms/londonZone_dales_bedroom';
import dalesKitchen from '../../rooms/londonZone_dales_kitchen';
import centralpark from '../../rooms/newyorkZone_centralpark';
import burgerjoint from '../../rooms/newyorkZone_burgerjoint';
import aevirawarehouse from '../../rooms/newyorkZone_aevirawarehouse';
import alveiraworkshop from '../../rooms/newyorkZone_alveiraworkshop';
import * as simpleRoomRegistryModule from '../../rooms/roomRegistry';
import { processCommand } from '../commandParser';

const roomMap = { cafeoffice, burgerjoint, centralpark, aevirawarehouse, alveiraworkshop } as any;

const buildState = (currentRoomId: string, flags: Record<string, boolean> = {}) =>
  ({
    currentRoomId,
    currentRoom: currentRoomId,
    rooms: roomMap,
    flags,
    gameFlags: flags,
    history: [],
    inventory: [],
    player: {
      currentRoom: currentRoomId,
      inventory: [],
      name: 'Geoff',
    },
  }) as any;

const runCommand = (input: string, room: any, flags: Record<string, boolean> = {}) =>
  processCommand({
    input,
    currentRoom: room,
    gameState: buildState(room.id, flags),
  } as any) as any;

const textOf = (result: any) => result.messages.map((message: any) => message.text).join('\n');

describe('Copilot PR #15 review fixes', () => {
  it('does not set Cafe Office chair sit flags when merely inspecting the chair', () => {
    const result = runCommand('inspect chair', cafeoffice, { existing_flag: true });

    expect(textOf(result)).toContain('office chair');
    expect(result.updates?.flags?.cafe_office_chair_sat_once).toBeUndefined();
  });

  it('preserves existing flags when setting Cafe Office chair progression', () => {
    const result = runCommand('sit chair', cafeoffice, { existing_flag: true });

    expect(result.updates?.flags?.existing_flag).toBe(true);
    expect(result.updates?.flags?.cafe_office_chair_sat_once).toBe(true);
  });

  it('preserves existing flags when the chef sets New York chain flags', () => {
    const result = runCommand('ask chef instructions', burgerjoint, { existing_flag: true });

    expect(result.updates?.flags?.existing_flag).toBe(true);
    expect(result.updates?.flags?.warehouse_passcode_known).toBe(true);
  });

  it('updates currentRoomId, currentRoom and player.currentRoom on parser-managed transitions', () => {
    const result = runCommand('go warehouse', centralpark, {
      warehouse_route_unlocked: true,
    });

    expect(result.updates?.currentRoomId).toBe('aevirawarehouse');
    expect(result.updates?.currentRoom).toBe('aevirawarehouse');
    expect(result.updates?.player?.currentRoom).toBe('aevirawarehouse');
  });

  it('does not teleport from Alveira Workshop when merely inspecting the chair', () => {
    const result = runCommand('inspect chair', alveiraworkshop, {
      existing_flag: true,
    });

    expect(textOf(result)).toContain('workshop chair');
    expect(result.updates?.currentRoomId).toBeUndefined();
  });

  it('preserves existing flags and full room state when using the Alveira Workshop chair', () => {
    const result = runCommand('sit chair', alveiraworkshop, {
      existing_flag: true,
    });

    expect(result.updates?.currentRoomId).toBe('ancientsroom');
    expect(result.updates?.currentRoom).toBe('ancientsroom');
    expect(result.updates?.player?.currentRoom).toBe('ancientsroom');
    expect(result.updates?.flags?.existing_flag).toBe(true);
    expect(result.updates?.flags?.off_world_route_opened).toBe(true);
  });

  it('uses the canonical London zone id for new Dale rooms', () => {
    expect((dalesBedroom as any).zone).toBe('londonZone');
    expect((dalesKitchen as any).zone).toBe('londonZone');
  });

  it('keys Dale underscore-id rooms in the simple room registry', () => {
    const registryValues = Object.values(simpleRoomRegistryModule as any);
    const registry = registryValues.find(
      (value: any) => value && typeof value === 'object' && value.dales_bedroom && value.dales_kitchen
    ) as any;

    expect(registry?.dales_bedroom).toBeDefined();
    expect(registry?.dales_kitchen).toBeDefined();
  });

  it('uses an existing placeholder image for Alveira Workshop until bespoke art exists', () => {
    expect((alveiraworkshop as any).image).toBe('newyorkZone_manhattanhub.png');
  });
});
