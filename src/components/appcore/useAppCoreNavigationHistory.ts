/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  Navigation history and backout controller for AppCore modularisation.
*/

import { useCallback, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

interface UseAppCoreNavigationHistoryArgs {
  readonly dispatch: (action: any) => void;
  readonly currentRoomId: string;
}

interface UseAppCoreNavigationHistoryResult {
  readonly roomHistory: string[];
  readonly setRoomHistory: Dispatch<SetStateAction<string[]>>;
  readonly canBackout: boolean;
  readonly pushCurrentRoomToHistory: () => void;
  readonly handleBackout: () => void;
}

function addMessage(dispatch: (action: any) => void, text: string, type: string = 'system'): void {
  dispatch({
    type: 'ADD_MESSAGE',
    payload: {
      id: Date.now().toString(),
      text,
      type,
      timestamp: Date.now(),
    },
  });
}

export function useAppCoreNavigationHistory({
  dispatch,
  currentRoomId,
}: UseAppCoreNavigationHistoryArgs): UseAppCoreNavigationHistoryResult {
  const [roomHistory, setRoomHistory] = useState<string[]>([]);

  const pushCurrentRoomToHistory = useCallback((): void => {
    if (!currentRoomId) return;
    setRoomHistory((previous) => [...previous, currentRoomId]);
  }, [currentRoomId]);

  const handleBackout = useCallback((): void => {
    const count = roomHistory.length;

    if (count === 0) {
      addMessage(dispatch, "You can't go back.");
      return;
    }

    const previousRoomId = roomHistory[count - 1];
    if (!previousRoomId) {
      addMessage(dispatch, "You can't go back.");
      return;
    }

    setRoomHistory((previous) => previous.slice(0, -1));
    dispatch({ type: 'MOVE_TO_ROOM', payload: previousRoomId });

    const sarcasm =
      count >= 6
        ? 'Again? Maybe just stay put.'
        : count >= 4
          ? "You're really milking this back button, huh?"
          : count >= 2
            ? 'Back we go... again.'
            : 'You return to the previous room.';

    addMessage(dispatch, sarcasm);
  }, [roomHistory, dispatch]);

  return {
    roomHistory,
    setRoomHistory,
    canBackout: roomHistory.length > 0,
    pushCurrentRoomToHistory,
    handleBackout,
  };
}
