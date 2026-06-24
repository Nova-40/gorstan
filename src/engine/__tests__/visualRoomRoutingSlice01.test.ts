import dalesapartment from '../../rooms/londonZone_dalesapartment';
import dalesBedroom from '../../rooms/londonZone_dales_bedroom';
import dalesKitchen from '../../rooms/londonZone_dales_kitchen';
import cafeoffice from '../../rooms/londonZone_cafeoffice';
import findlaterscornercoffeeshop from '../../rooms/londonZone_findlaterscornercoffeeshop';
import { processCommand } from '../commandParser';

const roomMap = {
  dalesapartment,
  dales_bedroom: dalesBedroom,
  dales_kitchen: dalesKitchen,
  cafeoffice,
  findlaterscornercoffeeshop,
} as any;

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

const runCommand = (
  input: string,
  room: any,
  currentRoomId = room.id,
  flags: Record<string, boolean> = {}
) =>
  processCommand({
    input,
    currentRoom: room,
    gameState: buildState(currentRoomId, flags),
  } as any) as any;

describe('visual room routing slice 01', () => {
  it('wires Dale bedroom and kitchen from the apartment exits', () => {
    expect((dalesapartment as any).exits.bedroom).toBe('dales_bedroom');
    expect((dalesapartment as any).exits.kitchen).toBe('dales_kitchen');
    expect((dalesBedroom as any).exits.south).toBe('dalesapartment');
    expect((dalesKitchen as any).exits.south).toBe('dalesapartment');
  });

  it('adds parser-first visual hotspots for Dale bedroom and kitchen', () => {
    expect((dalesBedroom as any).visualScene.id).toBe('dales-bedroom-visual-slice');
    expect((dalesKitchen as any).visualScene.id).toBe('dales-kitchen-visual-slice');
    expect((dalesBedroom as any).clickHotspots.some((h: any) => h.command === 'go south')).toBe(true);
    expect((dalesKitchen as any).clickHotspots.some((h: any) => h.command === 'go south')).toBe(true);
  });

  it('routes Café Office back to the canonical coffee shop room', () => {
    expect((cafeoffice as any).exits.south).toBe('findlaterscornercoffeeshop');
  });

  it('sets the Café Office chair first-sit flag before activation', () => {
    const result = runCommand('sit in chair', cafeoffice);
    const text = result.messages.map((m: any) => m.text).join('\\n');

    expect(text).toContain('comfortable office chair');
    expect(text).toContain('high-tech gadget');
    expect(result.updates?.flags?.cafe_office_chair_sat_once).toBe(true);
  });

  it('marks the Café Office chair ready on a later sit', () => {
    const result = runCommand('sit in chair', cafeoffice, 'cafeoffice', {
      cafe_office_chair_sat_once: true,
    });
    const text = result.messages.map((m: any) => m.text).join('\\n');

    expect(text).toContain('sit in the office chair again');
    expect(result.updates?.flags?.cafe_office_chair_ready).toBe(true);
  });
});
