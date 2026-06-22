import { describe, expect, it } from 'vitest';

import { processCommand } from '../commandParser';
import dalesapartment from '../../rooms/londonZone_dalesapartment';
import { gameStateReducer, initialGameState } from '../../state/gameState';

const buildDaleState = () => ({
  ...initialGameState,
  stage: 'game',
  currentRoomId: 'dalesapartment',
  player: {
    ...initialGameState.player,
    currentRoom: 'dalesapartment',
    name: 'Tester',
  },
  roomMap: {
    dalesapartment,
    findlaterscornercoffeeshop: {
      id: 'findlaterscornercoffeeshop',
      zone: 'londonZone',
      title: "Findlater's Corner Coffee Shop",
      description: 'The café is north.',
      exits: { south: 'dalesapartment' },
    },
  },
});

const runDaleCommand = (input: string) =>
  processCommand({
    input,
    currentRoom: dalesapartment,
    gameState: buildDaleState(),
  });

const messageText = (input: string) => runDaleCommand(input).messages.map((message) => message.text);

describe("Dale's Apartment visual scene command feedback", () => {
  it('has reusable visual scene metadata and hotspots', () => {
    const room = dalesapartment as any;

    expect(room.visualScene.id).toBe('dales-apartment-visual-slice');
    expect(room.clickHotspots.map((hotspot: any) => hotspot.id)).toContain('fish-tank');
    expect(room.clickHotspots.map((hotspot: any) => hotspot.id)).toContain('living-room-sofa');
  });

  it('gives useful feedback for obvious Dale Apartment interactions', () => {
    expect(messageText('examine fish_tank').join(' ')).toContain('aquarium');
    expect(messageText('examine dominic').join(' ')).toContain('goldfish');
    expect(messageText('examine sofa').join(' ')).toContain('modern sofa');
    expect(messageText('look at photos').join(' ')).toContain('photographs');
  });

  it('keeps typed and clicked Dale hotspot commands equivalent before game logic', () => {
    const hotspotCommand = (dalesapartment as any).clickHotspots.find(
      (hotspot: any) => hotspot.id === 'fish-tank'
    ).command;

    const typedState = gameStateReducer(buildDaleState(), {
      type: 'COMMAND_INPUT',
      payload: 'examine fish_tank',
    } as any);

    const hotspotState = gameStateReducer(buildDaleState(), {
      type: 'COMMAND_INPUT',
      payload: hotspotCommand,
    } as any);

    expect(hotspotCommand).toBe('examine fish_tank');
    expect(hotspotState.history.map((message) => message.text)).toEqual(
      typedState.history.map((message) => message.text)
    );
  });

  it('preserves normal movement back toward the Café', () => {
    const result = runDaleCommand('go north');

    expect(result.messages.map((message) => message.text)).toContain('You go north.');
    expect(result.updates?.currentRoomId).toBe('findlaterscornercoffeeshop');
  });
});
