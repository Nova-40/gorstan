import centralpark from '../../rooms/newyorkZone_centralpark';
import alveiraworkshop from '../../rooms/newyorkZone_alveiraworkshop';
import manhattanhub from '../../rooms/newyorkZone_manhattanhub';
import ancientsroom from '../../rooms/offgorstanZone_ancientsroom';
import { roomRegistry as dataRoomRegistry } from '../../data/roomRegistry';
import { roomRegistry as engineRoomRegistry } from '../roomRegistry';
import { processCommand } from '../commandParser';

const roomMap = { centralpark, alveiraworkshop, manhattanhub, ancientsroom } as any;

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

const runCommand = (input: string, room: any, flags: Record<string, boolean> = {}) =>
  processCommand({
    input,
    currentRoom: room,
    gameState: buildState(room.id, flags),
  } as any) as any;

const textOf = (result: any) => result.messages.map((message: any) => message.text).join('\\n');

describe('Alveira Workshop and post-briefcase routes', () => {
  it('registers the hidden Alveira Workshop room', () => {
    expect(alveiraworkshop.id).toBe('alveiraworkshop');
    expect((dataRoomRegistry as any).alveiraworkshop).toBeDefined();
    expect((engineRoomRegistry as any).alveiraworkshop).toBeDefined();
  });

  it('does not expose ordinary Central Park exits for locked post-briefcase routes', () => {
    expect((centralpark as any).exits.south).toBeUndefined();
    expect((centralpark as any).exits.east).toBeUndefined();
  });

  it('denies workshop route before briefcase unlock', () => {
    const result = runCommand('go workshop', centralpark);

    expect(textOf(result)).toContain('No concealed workshop route');
    expect(result.updates?.currentRoomId).toBeUndefined();
  });

  it('allows workshop route after briefcase unlock', () => {
    const result = runCommand('go workshop', centralpark, {
      alveira_workshop_unlocked: true,
    });

    expect(textOf(result)).toContain('hidden Alveira Workshop');
    expect(result.updates?.currentRoomId).toBe('alveiraworkshop');
  });

  it('allows Manhattan Hub route after briefcase unlock', () => {
    const result = runCommand('go south', centralpark, {
      new_york_hub_unlocked: true,
    });

    expect(textOf(result)).toContain('Manhattan Hub');
    expect(result.updates?.currentRoomId).toBe('manhattanhub');
  });

  it('transports from the workshop chair to the Off World main chamber', () => {
    const result = runCommand('sit chair', alveiraworkshop);

    expect(textOf(result)).toContain('Ancients’ Room');
    expect(result.updates?.currentRoomId).toBe('ancientsroom');
    expect(result.updates?.flags?.off_world_route_opened).toBe(true);
  });
});
