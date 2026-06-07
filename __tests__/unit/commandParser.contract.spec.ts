import { describe, expect, it } from 'vitest';

import { processCommand } from '../../src/engine/commandParser';
import { initialGameState } from '../../src/state/gameState';

describe('commandParser quick-action contract', () => {
  const currentRoom = {
    id: 'controlnexus',
    title: 'Control Nexus',
    description: ['A quiet test room.'],
    exits: {
      north: 'northroom',
      jump: 'jumproom',
      sit: 'sitroom',
    },
    items: [],
    npcs: [],
  } as any;

  const gameState = {
    ...initialGameState,
    currentRoomId: currentRoom.id,
    roomMap: {
      [currentRoom.id]: currentRoom,
      northroom: {
        id: 'northroom',
        title: 'North Room',
        description: ['Another room.'],
        exits: {},
        items: [],
        npcs: [],
      },
      jumproom: {
        id: 'jumproom',
        title: 'Jump Room',
        description: ['Reached via jump.'],
        exits: {},
        items: [],
        npcs: [],
      },
      sitroom: {
        id: 'sitroom',
        title: 'Sit Room',
        description: ['Reached via sit.'],
        exits: {},
        items: [],
        npcs: [],
      },
    },
  };

  it.each(['jump', 'sit', 'press', 'coffee'])(
    'treats %s as a non-native parser command',
    (input) => {
      const result = processCommand({
        input,
        currentRoom,
        gameState,
      });

      expect(result.updates).toBeUndefined();
      expect(result.messages).toEqual([
        {
          text: "I don't understand that command.",
          type: 'error',
        },
      ]);
    },
  );

  it('still handles explicit native movement commands through room exits', () => {
    const result = processCommand({
      input: 'go north',
      currentRoom,
      gameState,
    });

    expect(result.messages[0]).toEqual({ text: 'You go north.', type: 'info' });
    expect(result.updates).toMatchObject({
      currentRoomId: 'northroom',
      player: {
        currentRoom: 'northroom',
      },
    });
  });
});