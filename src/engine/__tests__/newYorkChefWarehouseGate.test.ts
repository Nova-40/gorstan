import burgerjoint from '../../rooms/newyorkZone_burgerjoint';
import centralpark from '../../rooms/newyorkZone_centralpark';
import aevirawarehouse from '../../rooms/newyorkZone_aevirawarehouse';
import greasystoreroom from '../../rooms/newyorkZone_greasystoreroom';
import manhattanhub from '../../rooms/newyorkZone_manhattanhub';
import { processCommand } from '../commandParser';

const roomMap = { burgerjoint, centralpark, aevirawarehouse, greasystoreroom, manhattanhub } as any;

const buildState = (currentRoomId: string, flags: Record<string, boolean> = {}) =>
  ({
    currentRoomId,
    currentRoom: currentRoomId,
    rooms: roomMap,
    flags,
    gameFlags: flags,
    history: [],
    inventory: [],
    player: { inventory: [] },
  }) as any;

const runCommand = (input: string, room: any, currentRoomId = room.id, flags: Record<string, boolean> = {}) =>
  processCommand({ input, currentRoom: room, gameState: buildState(currentRoomId, flags) } as any) as any;

const textOf = (result: any) => result.messages.map((message: any) => message.text).join('\n');

describe('New York Chef / Warehouse / Albie gate', () => {
  it('uses the canonical greasy store room id from the burger joint', () => {
    expect((burgerjoint as any).exits.storeroom).toBe('greasystoreroom');
  });

  it('hides ordinary warehouse movement from Central Park exits', () => {
    expect((centralpark as any).exits.east).toBeUndefined();
  });

  it('talking to chef gives a subtle instruction hint and unlocks warehouse route', () => {
    const result = runCommand('talk chef', burgerjoint);
    expect(textOf(result)).toContain('I might have instructions');
    expect(result.updates?.flags?.chef_instruction_hint_received).toBe(true);
    expect(result.updates?.flags?.warehouse_route_unlocked).toBe(true);
  });

  it('asking chef for instructions gives passcode if not rude', () => {
    const result = runCommand('ask chef instructions', burgerjoint);
    expect(textOf(result)).toContain('passcode is AEVIRA');
    expect(result.updates?.flags?.warehouse_passcode_known).toBe(true);
    expect(result.updates?.flags?.chef_authorization_received).toBe(true);
  });

  it('rudeness makes chef refuse instructions', () => {
    const result = runCommand('insult chef', burgerjoint);
    expect(textOf(result)).toContain('no longer on offer');
    expect(result.updates?.flags?.chef_refuses_instructions).toBe(true);
  });

  it('storeroom access depends on chef liking or authorising the player', () => {
    const denied = runCommand('go storeroom', burgerjoint);
    expect(textOf(denied)).toContain('stop being an option');

    const allowed = runCommand('go storeroom', burgerjoint, 'burgerjoint', { chef_likes_player: true });
    expect(allowed.updates?.currentRoomId).toBe('greasystoreroom');
  });

  it('warehouse route is unavailable until the chef hint flag is set', () => {
    const denied = runCommand('go warehouse', centralpark);
    expect(textOf(denied)).toContain('nothing resolves into a warehouse route');

    const allowed = runCommand('go warehouse', centralpark, 'centralpark', { warehouse_route_unlocked: true });
    expect(allowed.updates?.currentRoomId).toBe('aevirawarehouse');
  });

  it('Albie bounces the player without the passcode', () => {
    const result = runCommand('talk albie', aevirawarehouse);
    expect(textOf(result)).toContain('No passcode, no warehouse');
    expect(result.updates?.currentRoomId).toBe('centralpark');
  });

  it('Albie accepts AEVIRA and activates the briefcase puzzle', () => {
    const result = runCommand('tell albie aevira', aevirawarehouse, 'aevirawarehouse', { warehouse_passcode_known: true });
    expect(textOf(result)).toContain('Briefcase is on the table');
    expect(result.updates?.flags?.briefcase_puzzle_active).toBe(true);
  });

  it('briefcase puzzle unlocks Alveira Workshop and Manhattan Hub routes', () => {
    const result = runCommand('open briefcase', aevirawarehouse, 'aevirawarehouse', { briefcase_puzzle_active: true });
    expect(textOf(result)).toContain('two routes quietly become official');
    expect(result.updates?.flags?.alveira_workshop_unlocked).toBe(true);
    expect(result.updates?.flags?.new_york_hub_unlocked).toBe(true);
  });
});
