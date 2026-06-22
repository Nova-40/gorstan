import { describe, expect, it } from 'vitest';

import { processCommand } from '../commandParser';
import findlaterscornercoffeeshop from '../../rooms/londonZone_findlaterscornercoffeeshop';
import { gameStateReducer, initialGameState } from '../../state/gameState';

const buildCafeState = () => ({
  ...initialGameState,
  stage: 'game',
  currentRoomId: 'findlaterscornercoffeeshop',
  player: {
    ...initialGameState.player,
    currentRoom: 'findlaterscornercoffeeshop',
    name: 'Tester',
  },
  roomMap: {
    findlaterscornercoffeeshop,
    cafeoffice: {
      id: 'cafeoffice',
      zone: 'londonZone',
      title: 'Café Office',
      description: 'A small office behind the café.',
      exits: { south: 'findlaterscornercoffeeshop' },
    },
  },
});

const runCafeCommand = (input: string) =>
  processCommand({
    input,
    currentRoom: findlaterscornercoffeeshop,
    gameState: buildCafeState(),
  });

const messageText = (input: string) => runCafeCommand(input).messages.map((message) => message.text);

describe('Café command feedback', () => {
  it('gives useful feedback for hotspot examine commands', () => {
    expect(messageText('examine coffee_counter').join(' ')).toContain('wooden counter');
    expect(messageText('examine corner_booth').join(' ')).toContain('cozy booth');
    expect(messageText('examine wall_photos').join(' ')).toContain('photographs');
    expect(messageText('examine coffee_shop_menu').join(' ')).toContain('DIMENSIONAL BLEND');
  });

  it('resolves natural inspect aliases through the parser and room data', () => {
    expect(messageText('examine counter')).toEqual(messageText('look at counter'));
    expect(messageText('look at photos')).toEqual(messageText('examine wall_photos'));
    expect(messageText('read menu')).toEqual(messageText('examine coffee_shop_menu'));
  });

  it('gives useful data-driven feedback for talking to the barista', () => {
    const messages = messageText('talk to barista').join(' ');

    expect(messages).toContain('Usual?');
    expect(messages).toContain('barista');
  });

  it('echoes typed commands in the existing command history flow', () => {
    const nextState = gameStateReducer(buildCafeState(), {
      type: 'COMMAND_INPUT',
      payload: 'examine coffee_counter',
    } as any);

    const historyText = nextState.history.map((message) => message.text);

    expect(historyText).toContain('> examine coffee_counter');
    expect(historyText.join(' ')).toContain('wooden counter');
  });

  it('keeps hotspot and typed Café commands equivalent before game logic', () => {
    const hotspotCommand = (findlaterscornercoffeeshop as any).clickHotspots.find(
      (hotspot: any) => hotspot.id === 'coffee-counter'
    ).command;

    const typedState = gameStateReducer(buildCafeState(), {
      type: 'COMMAND_INPUT',
      payload: 'examine coffee_counter',
    } as any);

    const hotspotState = gameStateReducer(buildCafeState(), {
      type: 'COMMAND_INPUT',
      payload: hotspotCommand,
    } as any);

    const typedHistory = typedState.history.map((message) => message.text);
    const hotspotHistory = hotspotState.history.map((message) => message.text);

    expect(hotspotCommand).toBe('examine coffee_counter');
    expect(hotspotHistory).toEqual(typedHistory);
  });

  it('preserves normal parser movement behaviour', () => {
    const result = runCafeCommand('go north');

    expect(result.messages.map((message) => message.text)).toContain('You go north.');
    expect(result.updates?.currentRoomId).toBe('cafeoffice');
  });
});
