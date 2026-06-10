import React from 'react';
import { describe, expect, test, vi, afterEach } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';

import TrapManagementModal from '../components/TrapManagementModal';
import MultiverseRebootSequence from '../components/MultiverseRebootSequence';
import { GameStateContext, initialGameState } from '../state/gameState';

function renderWithGameState(ui: React.ReactElement, stateOverrides: Record<string, unknown> = {}) {
  const state = {
    ...initialGameState,
    ...stateOverrides,
    player: {
      ...initialGameState.player,
      ...(stateOverrides.player as Record<string, unknown> | undefined),
    },
    flags: {
      ...initialGameState.flags,
      ...(stateOverrides.flags as Record<string, unknown> | undefined),
    },
    roomMap: {
      ...initialGameState.roomMap,
      ...(stateOverrides.roomMap as Record<string, unknown> | undefined),
    },
  } as typeof initialGameState;

  return render(
    <GameStateContext.Provider value={{ state, dispatch: vi.fn() }}>
      {ui}
    </GameStateContext.Provider>,
  );
}

afterEach(() => {
  vi.useRealTimers();
});

describe('parser command wiring', () => {
  test('TrapManagementModal emits inspect trap after analysis', async () => {
    vi.useFakeTimers();
    const onIssueCommand = vi.fn();

    renderWithGameState(
      <TrapManagementModal
        isOpen={true}
        onClose={vi.fn()}
        currentRoomId="mazehub"
        onIssueCommand={onIssueCommand}
      />,
      {
        player: {
          ...initialGameState.player,
          inventory: ['trapkit'],
          traits: ['trap_expert'],
        },
      },
    );

    fireEvent.click(screen.getByRole('button', { name: /analyze trap/i }));

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(onIssueCommand).toHaveBeenCalledWith('inspect trap');
  });

  test('MultiverseRebootSequence emits confirm reboot when pending reboot begins', async () => {
    vi.useFakeTimers();
    const onIssueCommand = vi.fn();

    renderWithGameState(
      <MultiverseRebootSequence onIssueCommand={onIssueCommand} />,
      {
        flags: {
          multiverse_reboot_pending: true,
          multiverse_reboot_active: false,
          show_reset_sequence: false,
        },
      },
    );

    await act(async () => {
      vi.advanceTimersByTime(3050);
    });

    expect(onIssueCommand).toHaveBeenCalledWith('confirm reboot');
  });
});