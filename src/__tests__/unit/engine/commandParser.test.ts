import { describe, test, expect } from 'vitest';
import { processCommand } from '../../../engine/commandParser';

// Helper to create a fresh minimal game state per test (avoid cross-test mutation)
function createState() {
	return {
		player: { inventory: ['key'], traits: [], currentRoom: 'room1' },
		roomMap: {
			room1: { id: 'room1', title: 'Room One', description: 'A plain room', exits: { east: 'room2' } },
			room2: { id: 'room2', title: 'Room Two', description: 'Another room', exits: {} }
		},
		currentRoomId: 'room1',
		flags: {},
		npcsInRoom: [],
		settings: { debugMode: false }
	} as any;
}

describe('Command Parser', () => {
	test('handles movement to valid exit', () => {
		const state = createState();
		const result = processCommand({ input: 'go east', currentRoom: state.roomMap.room1, gameState: state });
		expect(result.messages.some(m => m.text.includes('You go east'))).toBe(true);
		expect(result.updates?.currentRoomId).toBe('room2');
	});

	test('rejects invalid direction', () => {
		const state = createState();
		const result = processCommand({ input: 'go west', currentRoom: state.roomMap.room1, gameState: state });
		expect(result.messages[0]?.text).toMatch(/can't go/i);
	});

	test('shows inventory contents', () => {
		const state = createState();
		const result = processCommand({ input: 'inventory', currentRoom: state.roomMap.room1, gameState: state });
		expect(result.messages.some(m => m.text.includes('key'))).toBe(true);
	});

	test('look lists exits', () => {
		const state = createState();
		const result = processCommand({ input: 'look', currentRoom: state.roomMap.room1, gameState: state });
		// Look command should include an 'Exits:' header and at least one exit line
		const texts = result.messages.map(m => m.text);
		const hasHeader = texts.some(t => /exits:/i.test(t));
		const exitLines = texts.filter(t => /^- /i.test(t));
		expect(hasHeader && exitLines.some(l => /east/i.test(l))).toBe(true);
	});

	test('unknown command fallback', () => {
		const state = createState();
		const result = processCommand({ input: 'blargh', currentRoom: state.roomMap.room1, gameState: state });
		expect(result.messages[0]?.text).toMatch(/don't understand/i);
	});
});
