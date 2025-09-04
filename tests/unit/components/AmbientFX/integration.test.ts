/*
	Ambient audio fallback tests
	Verifies /sounds/ -> /audio/ legacy path fallback triggers on load error
*/

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Import modules under test (relative to this test file)
import { playAmbientAudio } from '../../../../src/utils/soundUtils';
import { playAmbientForZone, stopAmbient } from '../../../../src/engine/ambientAudioPlayer';

// Keep reference to original Audio implementation
const OriginalAudio = globalThis.Audio;

interface MockAudioInstance {
	src: string;
	loop: boolean;
	volume: number;
	onerror: (() => void) | null;
	play: ReturnType<typeof vi.fn>;
	load: ReturnType<typeof vi.fn>;
	pause: ReturnType<typeof vi.fn>;
}

const instances: MockAudioInstance[] = [];

class MockAudio {
	src: string;
	loop = false;
	volume = 1;
	onerror: (() => void) | null = null;
	play = vi.fn().mockResolvedValue(undefined);
	load = vi.fn();
	pause = vi.fn();
	addEventListener() {}
	removeEventListener() {}
	constructor(src?: string) {
		this.src = src || '';
		instances.push(this as any);
	}
}

describe('Ambient Audio Fallback', () => {
	beforeEach(() => {
		// Reset mocks & override global Audio
		instances.length = 0;
		(globalThis as any).Audio = MockAudio as any;
	});

	afterEach(() => {
		// Restore original implementation
		(globalThis as any).Audio = OriginalAudio;
		stopAmbient();
	});

	it('falls back for generic ambient loop in soundUtils', () => {
		playAmbientAudio(true);
		expect(instances.length).toBe(1);
		const inst = instances[0];
		expect(inst.src).toContain('/sounds/ambient.mp3');
		// Simulate load failure
		inst.onerror && inst.onerror();
		expect(inst.src).toContain('/audio/ambient.mp3');
		expect(inst.load).toHaveBeenCalledTimes(1);
		expect(inst.play).toHaveBeenCalledTimes(2); // initial + retry
	});

	it('falls back for zone ambient in ambientAudioPlayer', () => {
		playAmbientForZone('mystic');
		expect(instances.length).toBe(1);
		const inst = instances[0];
		expect(inst.src).toContain('/sounds/ambient/mystic.mp3');
		inst.onerror && inst.onerror();
		expect(inst.src).toContain('/audio/ambient/mystic.mp3');
		// load & play should have been called again
		expect(inst.load).toHaveBeenCalledTimes(1);
		// First play call + retry after fallback
		expect(inst.play).toHaveBeenCalledTimes(2);
	});

	it('does not re-trigger fallback once already on legacy path', () => {
		playAmbientForZone('echo');
		const inst = instances[0];
		inst.onerror && inst.onerror();
		const afterFirst = { load: inst.load.mock.calls.length, play: inst.play.mock.calls.length, src: inst.src };
		// Trigger again
		inst.onerror && inst.onerror();
		expect(inst.src).toBe(afterFirst.src); // unchanged
		expect(inst.load.mock.calls.length).toBe(afterFirst.load);
		expect(inst.play.mock.calls.length).toBe(afterFirst.play);
	});
});

