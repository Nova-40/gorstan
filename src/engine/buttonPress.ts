import type { LocalGameState } from '../state/gameState';

export interface ButtonPressOutcome {
  nextState: LocalGameState;
  achievementId?: string;
}

export function resolveBlueButtonPress(state: LocalGameState): ButtonPressOutcome {
  const currentCount =
    typeof state.player.flags?.bluePressCount === 'number' ? state.player.flags.bluePressCount : 0;
  const nextCount = currentCount + 1;

  if (nextCount === 1) {
    return {
      nextState: {
        ...state,
        player: {
          ...state.player,
          flags: {
            ...state.player.flags,
            bluePressCount: nextCount,
            showBlueButtonWarning: true,
          },
        },
        history: [
          ...state.history,
          {
            id: `blue-button-first-${Date.now()}`,
            text: 'Please do not press this button again.',
            type: 'system',
            timestamp: Date.now(),
          },
        ],
      },
    };
  }

  if (nextCount === 2) {
    return {
      nextState: {
        ...state,
        player: {
          ...state.player,
          flags: {
            ...state.player.flags,
            bluePressCount: nextCount,
            showBlueButtonWarning: true,
          },
        },
        history: [
          ...state.history,
          {
            id: `blue-button-second-${Date.now()}`,
            text: 'I said do not press that button.',
            type: 'warning',
            timestamp: Date.now(),
          },
        ],
      },
    };
  }

  return {
    achievementId: 'forbidden_button_botherer',
    nextState: {
      ...state,
      player: {
        ...state.player,
        flags: {
          ...state.player.flags,
          bluePressCount: 0,
          showBlueButtonWarning: false,
        },
      },
      flags: {
        ...state.flags,
        forceWendellSpawn: true,
      },
      history: [
        ...state.history,
        {
          id: `blue-button-third-${Date.now()}`,
          text: 'Oh dear. You pressed it again. It has summoned Mr Wendel.',
          type: 'achievement',
          timestamp: Date.now(),
        },
      ],
    },
  };
}