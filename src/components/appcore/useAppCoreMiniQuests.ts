/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  Miniquest bridge for AppCore modularisation.
*/

import { useCallback, useEffect } from 'react';

import { useMiniQuest } from '../../minigames/core/useMiniQuest';
import type { MiniQuestId, MiniQuestResult } from '../../minigames/core/MiniQuestTypes';

interface UseAppCoreMiniQuestsArgs {
  readonly dispatch: (action: any) => void;
  readonly currentRoomId: string;
}

interface UseAppCoreMiniQuestsResult {
  readonly mini: ReturnType<typeof useMiniQuest>;
  readonly launchMiniQuest: (id: string) => void;
  readonly clearMiniQuest: () => void;
  readonly handleMiniQuestResult: (result: MiniQuestResult) => void;
}

export function useAppCoreMiniQuests({
  dispatch,
  currentRoomId,
}: UseAppCoreMiniQuestsArgs): UseAppCoreMiniQuestsResult {
  const mini = useMiniQuest();

  useEffect(() => {
    if (!mini.active) {
      const element = document.getElementById('command-input-field') as HTMLInputElement | null;
      element?.focus();
    }
  }, [mini.active]);

  const launchMiniQuest = useCallback(
    (id: string): void => {
      mini.launch(id as MiniQuestId, currentRoomId, undefined);
    },
    [mini, currentRoomId],
  );

  const clearMiniQuest = useCallback((): void => {
    mini.clear();
  }, [mini]);

  const handleMiniQuestResult = useCallback(
    (result: MiniQuestResult): void => {
      import('../../services/minigames/MiniQuestProgressService').then((module) =>
        module.recordResult(result),
      );
      import('../../services/minigames/MiniQuestRewardService').then((module) =>
        module.applyRewards(result),
      );

      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: Date.now().toString(),
          text: `Mini-Quest ${result.questId} ${result.outcome.toUpperCase()} — score ${result.score}`,
          type: 'info',
          timestamp: Date.now(),
        },
      });
    },
    [dispatch],
  );

  return {
    mini,
    launchMiniQuest,
    clearMiniQuest,
    handleMiniQuestResult,
  };
}
