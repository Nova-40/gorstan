/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  Room-world bootstrap hook for AppCore modularisation.

  Responsible for loading the room map and initialising world-level systems. It
  deliberately does not render anything and should remain side-effect focused.
*/

import { useEffect } from 'react';

import { initializeAchievementEngine } from '../../logic/achievementEngine';
import { initializeScoreManager } from '../../state/scoreManager';
import { initializeCodexTracker } from '../../logic/codexTracker';
import { initializeMiniquests } from '../../engine/miniquestInitializer';
import { loadCelebrationIndex } from '../../celebrate/index';
import { initializeWanderingNPCs } from '../../engine/wanderingNPCController';
import { getAllRoomsAsObject } from '../../utils/roomLoader';
import { getFallbackRooms } from '../../utils/roomLoaderFallback';
import type { Room } from '../../types/Room';

interface UseRoomWorldInitialisationArgs {
  readonly state: any;
  readonly dispatch: (action: any) => void;
}

function recordBootstrapMessage(
  dispatch: (action: any) => void,
  text: string,
  type: 'warning' | 'error' | 'system' = 'system',
): void {
  dispatch({
    type: 'ADD_MESSAGE',
    payload: {
      id: `world-init-${Date.now()}`,
      text,
      type,
      timestamp: Date.now(),
    },
  });
}

export function useRoomWorldInitialisation({ state, dispatch }: UseRoomWorldInitialisationArgs): void {
  useEffect(() => {
    if (state.roomMap && Object.keys(state.roomMap).length > 0) {
      return;
    }

    try {
      let loadedRoomMap: Record<string, Room> = getAllRoomsAsObject();

      if (!loadedRoomMap || Object.keys(loadedRoomMap).length === 0) {
        console.warn('[AppCore] No rooms loaded from main loader, using fallback rooms');
        loadedRoomMap = getFallbackRooms();
        recordBootstrapMessage(
          dispatch,
          'Note: Running in limited mode with basic rooms only. Some features may be unavailable.',
          'warning',
        );
      }

      console.log('[AppCore] Loading room map with', Object.keys(loadedRoomMap).length, 'rooms');
      dispatch({ type: 'LOAD_ROOM_MAP', payload: loadedRoomMap });

      try {
        initializeAchievementEngine(dispatch);
      } catch (error) {
        console.warn('Failed to load achievement engine:', error);
      }

      try {
        initializeScoreManager(dispatch);
      } catch (error) {
        console.warn('Failed to load score manager:', error);
        recordBootstrapMessage(dispatch, 'Failed to load score manager.', 'error');
      }

      try {
        initializeCodexTracker(dispatch);
      } catch (error) {
        console.warn('Failed to load codex tracker:', error);
        recordBootstrapMessage(dispatch, 'Failed to load codex tracker.', 'error');
      }

      try {
        initializeMiniquests();
      } catch (error) {
        console.warn('Failed to load miniquest initializer:', error);
        recordBootstrapMessage(dispatch, 'Failed to load miniquest initializer.', 'error');
      }

      try {
        loadCelebrationIndex();
      } catch (error) {
        console.warn('Could not load celebration index:', error);
      }

      initializeWanderingNPCs(state, dispatch);
    } catch (error: unknown) {
      console.error('Game initialization failed:', error);

      try {
        const fallbackRooms = getFallbackRooms();
        console.warn('[AppCore] Using fallback rooms due to initialization error');
        dispatch({ type: 'LOAD_ROOM_MAP', payload: fallbackRooms });
        recordBootstrapMessage(
          dispatch,
          'Game loaded in emergency mode with limited rooms. Some features may be unavailable.',
          'warning',
        );
      } catch (fallbackError) {
        console.error('Even fallback initialization failed:', fallbackError);
        recordBootstrapMessage(
          dispatch,
          'Critical error: Unable to load game data. Please refresh the page.',
          'error',
        );
      }
    }
  }, [state, state.roomMap, dispatch]);
}
