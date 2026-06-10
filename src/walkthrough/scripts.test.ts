import { describe, expect, it } from 'vitest';

import { buildBaselineStartupWalkthrough, buildWalkthroughSummary } from './scripts';
import type { WalkthroughLogEntry } from './types';

describe('buildBaselineStartupWalkthrough', () => {
  it('builds parser-safe baseline steps from the current room graph', () => {
    const script = buildBaselineStartupWalkthrough({
      currentRoomId: 'controlnexus',
      roomMap: {
        controlnexus: {
          id: 'controlnexus',
          title: 'Control Nexus',
          description: ['A flickering chamber of cables and paperwork.'],
          exits: {
            west: 'controlroom',
            sit: 'hiddenlab',
          },
        },
        controlroom: {
          id: 'controlroom',
          title: 'Control Room',
          description: ['A room full of tactical displays.'],
          exits: {
            east: 'controlnexus',
          },
        },
        hiddenlab: {
          id: 'hiddenlab',
          title: 'Hidden Lab',
          description: ['A dreadfully private laboratory.'],
          exits: {
            down: 'controlroom',
          },
        },
      },
    });

    expect(script.id).toBe('baseline-startup');
    expect(script.steps.map((step) => step.command)).toEqual([
      'status',
      'inspect',
      'help',
      'items',
      'go west',
      'status',
      'go east',
    ]);
    expect(script.steps[4].expectedRoom).toBe('controlroom');
  });
});

describe('buildWalkthroughSummary', () => {
  it('summarises pass and fail counts for a completed run', () => {
    const entries: WalkthroughLogEntry[] = [
      {
        stepNumber: 1,
        stepId: 'one',
        label: 'Inspect room',
        command: 'inspect',
        roomBefore: 'controlnexus',
        roomAfter: 'controlnexus',
        outputSummary: '--- Control Nexus ---',
        outcome: 'pass',
        warnings: [],
        timestamp: new Date().toISOString(),
      },
      {
        stepNumber: 2,
        stepId: 'two',
        label: 'Move west',
        command: 'go west',
        roomBefore: 'controlnexus',
        roomAfter: 'controlnexus',
        outputSummary: "You can't go that way.",
        outcome: 'fail',
        warnings: ['Expected room controlroom, reached controlnexus.'],
        timestamp: new Date().toISOString(),
        notePrompt: 'Did the exit affordance agree with the parser?',
      },
    ];

    const summary = buildWalkthroughSummary(entries, [
      { id: 'one', label: 'Inspect room', command: 'inspect' },
      { id: 'two', label: 'Move west', command: 'go west' },
    ]);

    expect(summary.totalSteps).toBe(2);
    expect(summary.passedSteps).toBe(1);
    expect(summary.failedSteps).toBe(1);
    expect(summary.roomsVisited).toEqual(['controlnexus']);
    expect(summary.suggestedAreasForManualReview).toContain(
      'Did the exit affordance agree with the parser?',
    );
  });
});
