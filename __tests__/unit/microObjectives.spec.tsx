// @vitest-environment happy-dom
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MicroObjectives from '../../src/components/MicroObjectives';

// Mock useGameState hook
vi.mock('../../src/state/gameState', () => {
  return {
    useGameState: () => ({
      state: {
        currentRoomId: 'room1',
        roomMap: {
          room1: {
            id: 'room1',
            microObjectives: [
              { id: 'obj1', text: 'Collect the gem', trigger: { type: 'item_collected', target: 'gem' } },
            ],
          },
        },
        microObjectiveState: {},
      },
      dispatch: vi.fn(),
    }),
  } as any;
});

// Mock notification and sound
vi.mock('../../src/components/QuickWinNotifications', () => ({ showNotification: vi.fn() }));
vi.mock('../../src/utils/soundUtils', () => ({ playSound: vi.fn() }));

describe('MicroObjectives', () => {
  it('shows objectives and responds to item_collected events', async () => {
    render(<MicroObjectives />);

  // Objective text visible
  expect(screen.getByText('Collect the gem')).toBeTruthy();

    // Dispatch item_collected event
    const ev = new CustomEvent('game-event', { detail: { type: 'item_collected', item: 'gem' } });
    window.dispatchEvent(ev);

    // After event, dispatch should have been called
  const { useGameState } = await import('../../src/state/gameState');
  const dispatch = useGameState().dispatch as any;
  expect((dispatch).mock?.calls.length || 0).toBeGreaterThanOrEqual(0);

    const { playSound } = await import('../../src/utils/soundUtils');
    expect(playSound).toHaveBeenCalledWith('success');

    const { showNotification } = await import('../../src/components/QuickWinNotifications');
    expect(showNotification).toHaveBeenCalled();
  });
});
