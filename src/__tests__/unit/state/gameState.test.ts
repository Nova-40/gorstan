import { describe, test, expect } from 'vitest';
import { initialGameState } from '../../../state/gameState';
import { processCommand } from '../../../engine/commandParser';

describe('Game State basics', () => {
	test('initial state has splash stage and controlnexus room', () => {
		expect(initialGameState.stage).toBe('splash');
		expect(initialGameState.currentRoomId).toBe('controlnexus');
	});

	test('processCommand integrates with state for movement updates', () => {
		const state: any = {
			...initialGameState,
			roomMap: {
				a: { id: 'a', title: 'A', description: 'Room A', exits: { east: 'b' } },
				b: { id: 'b', title: 'B', description: 'Room B', exits: {} }
			},
			currentRoomId: 'a',
			player: { ...initialGameState.player, currentRoom: 'a', inventory: [] }
		};
		const result = processCommand({ input: 'go east', currentRoom: state.roomMap.a, gameState: state });
		expect(result.updates?.currentRoomId).toBe('b');
	});
});
