import { describe, expect, test } from 'vitest';

import { processCommand } from '../engine/commandParser';

function createState(overrides: Record<string, unknown> = {}) {
  return {
    currentRoomId: 'introreset',
    roomMap: {
      introreset: { id: 'introreset', title: 'Reset Room', description: 'Reset room.', exits: {} },
      controlroom: { id: 'controlroom', title: 'Control Room', description: 'Control room.', exits: {} },
    },
    player: {
      id: 'player',
      name: 'Player',
      health: 100,
      inventory: ['batteries', 'torch'],
      flags: {},
      visitedRooms: [],
    },
    flags: {},
    history: [],
    settings: { debugMode: true },
    ...overrides,
  } as any;
}

function applyUpdates(state: any, updates: any = {}) {
  return {
    ...state,
    ...updates,
    player: updates.player ? updates.player : state.player,
    flags: updates.flags ? updates.flags : state.flags,
    metadata: updates.metadata ? updates.metadata : state.metadata,
    roomMap: updates.roomMap ? updates.roomMap : state.roomMap,
    currentRoomId: updates.currentRoomId ? updates.currentRoomId : state.currentRoomId,
  };
}

describe('processCommand', () => {
  test('supports bare direction commands', () => {
    const result = processCommand({
      input: 'north',
      currentRoom: {
        id: 'introreset',
        title: 'Reset Room',
        description: 'Reset room.',
        exits: { north: 'controlroom' },
      } as any,
      gameState: createState(),
    });

    expect(result.updates?.currentRoomId).toBe('controlroom');
  });

  test('supports use item with target through the parser', () => {
    const result = processCommand({
      input: 'use batteries with torch',
      currentRoom: {
        id: 'introreset',
        title: 'Reset Room',
        description: 'Reset room.',
        exits: {},
      } as any,
      gameState: createState({ flags: { batteriesInserted: true } }),
    });

    expect(result.updates?.flags?.torchReady).toBe(true);
  });

  test('builds the three-step forbidden button sequence', () => {
    const room = {
      id: 'introreset',
      title: 'Reset Room',
      description: 'Reset room.',
      exits: {},
    } as any;

    const first = processCommand({ input: 'press button', currentRoom: room, gameState: createState() });
    const second = processCommand({
      input: 'press button',
      currentRoom: room,
      gameState: createState({ player: { ...createState().player, flags: { bluePressCount: 1 } } }),
    });
    const third = processCommand({
      input: 'press button',
      currentRoom: room,
      gameState: createState({ player: { ...createState().player, flags: { bluePressCount: 2 } } }),
    });

    expect(first.messages[0]?.text).toContain('Please do not press');
    expect(second.messages[0]?.text).toContain('I said do not press');
    expect(third.messages[0]?.text).toContain('Mr Wendel');
    expect(third.updates?.flags?.forceWendellSpawn).toBe(true);
  });

  test('supports parser-backed item pickup', () => {
    const result = processCommand({
      input: 'take runbag',
      currentRoom: {
        id: 'introreset',
        title: 'Reset Room',
        description: 'Reset room.',
        exits: {},
        items: ['runbag'],
      } as any,
      gameState: createState({ player: { ...createState().player, inventory: [] } }),
    });

    expect(result.updates?.player?.inventory).toContain('runbag');
    expect(result.updates?.flags?.hasRunbag).toBe(true);
    expect(result.updates?.roomMap?.introreset?.items).toEqual([]);
  });

  test('supports parser-backed teleport', () => {
    const result = processCommand({
      input: 'teleport control room',
      currentRoom: {
        id: 'introreset',
        title: 'Reset Room',
        description: 'Reset room.',
        exits: {},
      } as any,
      gameState: createState(),
    });

    expect(result.updates?.currentRoomId).toBe('controlroom');
    expect(result.updates?.metadata?.achievements).toContain('interdimensional_traveler');
  });

  test('supports debug flag commands in debug mode', () => {
    const result = processCommand({
      input: 'debug set flag sidedWith al',
      currentRoom: {
        id: 'introreset',
        title: 'Reset Room',
        description: 'Reset room.',
        exits: {},
      } as any,
      gameState: createState(),
    });

    expect(result.updates?.flags?.sidedWith).toBe('al');
  });

  test('supports procedural trap inspection and disarm via commands', () => {
    const trappedState = createState({
      currentRoomId: 'mazehub',
      roomMap: {
        mazehub: { id: 'mazehub', title: 'Maze Hub', description: 'Trap room.', exits: {} },
      },
      player: { ...createState().player, inventory: ['lockpicks'], traits: ['trap_expert'] },
    });

    const inspectResult = processCommand({
      input: 'inspect trap',
      currentRoom: trappedState.roomMap.mazehub,
      gameState: trappedState,
    });
    const disarmResult = processCommand({
      input: 'disarm trap',
      currentRoom: trappedState.roomMap.mazehub,
      gameState: trappedState,
    });

    expect(inspectResult.messages[0]?.text).toContain('concealed spike pit trap');
    expect(disarmResult.messages[0]?.text).toContain('disarm');
  });

  test('supports reboot command progression and rejects invalid order', () => {
    const baseState = createState({ currentRoomId: 'controlroom' });
    const start = processCommand({
      input: 'start reboot',
      currentRoom: { id: 'controlroom', title: 'Control Room', description: 'Control room.', exits: {} } as any,
      gameState: baseState,
    });
    const confirmedState = applyUpdates(baseState, start.updates);
    const confirm = processCommand({
      input: 'confirm reboot',
      currentRoom: { id: 'controlroom', title: 'Control Room', description: 'Control room.', exits: {} } as any,
      gameState: confirmedState,
    });
    const activeState = applyUpdates(confirmedState, confirm.updates);
    const complete = processCommand({
      input: 'complete reboot',
      currentRoom: { id: 'controlroom', title: 'Control Room', description: 'Control room.', exits: {} } as any,
      gameState: activeState,
    });
    const invalid = processCommand({
      input: 'confirm reboot',
      currentRoom: { id: 'controlroom', title: 'Control Room', description: 'Control room.', exits: {} } as any,
      gameState: baseState,
    });

    expect(start.updates?.flags?.multiverse_reboot_pending).toBe(true);
    expect(confirm.updates?.flags?.show_reset_sequence).toBe(true);
    expect(complete.updates?.currentRoomId).toBe('introstart');
    expect(complete.updates?.metadata?.achievements).toContain('multiverse_rebooter');
    expect(invalid.messages[0]?.text).toContain('no reboot');
  });

  test('routes Dominic pickup through parser-backed warning and consequence states', () => {
    const room = {
      id: 'dalesapartment',
      title: 'Dale Apartment',
      description: 'Apartment.',
      exits: {},
      items: ['dominic'],
    } as any;
    let state = createState({
      currentRoomId: 'dalesapartment',
      roomMap: { dalesapartment: room },
      player: { ...createState().player, inventory: [] },
      flags: {},
    });

    const first = processCommand({ input: 'take dominic', currentRoom: room, gameState: state });
    state = applyUpdates(state, first.updates);
    const second = processCommand({ input: 'take dominic', currentRoom: room, gameState: state });
    state = applyUpdates(state, second.updates);
    const third = processCommand({ input: 'take dominic', currentRoom: room, gameState: state });
    state = applyUpdates(state, third.updates);
    const fourth = processCommand({ input: 'take dominic', currentRoom: room, gameState: state });

    expect(first.messages[0]?.text).toContain('Dominic');
    expect(second.updates?.flags?.dominicPickupWarned).toBe(true);
    expect(third.updates?.flags?.dominicPickupInsisted).toBe(true);
    expect(fourth.updates?.player?.inventory).toContain('deadfish');
    expect(fourth.updates?.flags?.pollyVengeanceActive).toBe(true);
    expect(fourth.updates?.flags?.dominicIsDead).toBe(true);
  });
});