/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  You may play Gorstan for free for personal entertainment only.
  You may NOT copy, redistribute, modify, or sell the game, its code, 
  artwork, storyline, or any other part without written permission.
  
  Gorstan includes third-party libraries and assets:
    - React © Meta Platforms, Inc. – MIT Licence
    - Lucide Icons © Lucide Contributors – ISC Licence
    - Flaticon icons © Flaticon.com – Free Licence with attribution
    - Other packages under their respective licences (see package.json)

  Full licence terms: see EULA.md in the project root.
*/

// Gorstan and characters (c) Geoff Webster 2025
// Game module.

import { FlagMap as FlagRegistryType } from '../state/flagRegistry';

import { getAllRoomsAsObject } from '../utils/roomLoader';

import { useEffect, useRef } from 'react';

import { useFlags } from './useFlags';

import { useGameState } from '../state/gameState';

import { useModuleLoader } from './useModuleLoader';

import { useTimers } from './useTimers';


export const useSystemInitialization = () => {
  const { state, dispatch } = useGameState();
  const { hasFlag, setFlag, clearFlag } = useFlags();
  const { loadModule } = useModuleLoader(); // Removed preloadModules
  const { setTimer, clearTimer } = useTimers();

  const hasMounted = useRef(false);
  const systemsInitialized = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;

      const initializeSystems = async () => {
        try {
          const roomMap = getAllRoomsAsObject();
          dispatch({ type: 'SET_ROOM_MAP', payload: roomMap });
          setFlag(FlagRegistryType.transition.roomMapReady, true);
          // Achievement engine (non-fatal if it fails)
          try {
            const achievementModule = await loadModule('../logic/achievementEngine');
            if (achievementModule?.initializeAchievementEngine) {
              try {
                achievementModule.initializeAchievementEngine(dispatch);
              } catch (e) {
                console.warn('[SYSTEM] Achievement engine init threw:', e);
              }
            }
          } catch (e) {
            console.warn('[SYSTEM] Achievement engine module load failed:', e);
          }

          // Wandering NPCs (non-fatal)
            try {
              const npcModule = await loadModule('../engine/wanderingNPCController');
              if (npcModule?.initializeWanderingNPCs) {
                try {
                  npcModule.initializeWanderingNPCs();
                } catch (e) {
                  console.warn('[SYSTEM] Wandering NPC initialization threw:', e);
                }
              }
            } catch (e) {
              console.warn('[SYSTEM] Wandering NPC module load failed:', e);
            }

          console.log('[SYSTEM] Core game systems initialization sequence complete (errors above are non-fatal).');
        } catch (error) {
          console.error('[SYSTEM] Fatal error during core initialization sequence:', error);
          dispatch({
            type: 'ADD_MESSAGE',
            payload: {
              text: 'System initialization encountered a fatal error. Attempting degraded mode...',
              type: 'error',
              timestamp: Date.now()
            }
          });
        } finally {
          // Always attempt to mark systems ready so the UI can proceed; degraded features may be disabled
          if (!systemsInitialized.current) {
            systemsInitialized.current = true;
            setFlag(FlagRegistryType.transition.systemsReady, true);
          }
        }
      };

      initializeSystems();
    }
  }, [dispatch, setFlag, loadModule]);

  // Safety net: if for any reason systemsReady flag not set within 3s, force it to avoid user being stuck
  useEffect(() => {
    if (!hasFlag(FlagRegistryType.transition.systemsReady)) {
      const t = setTimeout(() => {
        if (!hasFlag(FlagRegistryType.transition.systemsReady)) {
          console.warn('[SYSTEM] Safety fallback: forcing systemsReady flag after timeout');
          systemsInitialized.current = true;
          setFlag(FlagRegistryType.transition.systemsReady, true);
        }
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [hasFlag(FlagRegistryType.transition.systemsReady), hasFlag, setFlag]);

  useEffect(() => {
    if (hasFlag(FlagRegistryType.transition.systemsReady) && state.stage === 'game') {
      setTimer({
        id: 'auto_save',
        callback: () => {
          loadModule('../engine/save/saveController').then((module) => {
            if (module?.autoSaveGame) {
              module.autoSaveGame(state);
            }
          });
        },
        delay: 5 * 60 * 1000,
        repeat: true
      });

      return () => {
        clearTimer('auto_save');
      };
    }
  }, [hasFlag(FlagRegistryType.transition.systemsReady), state.stage, state, setTimer, clearTimer, loadModule]);

  useEffect(() => {
    const transitionType = state.transition;

    if (transitionType && hasFlag(FlagRegistryType.transition.systemsReady)) {
      setTimer({
        id: 'transition_delay',
        callback: () => {
          setFlag(SYSTEM_FLAGS.READY_FOR_TRANSITION, true);
        },
        delay: 100
      });

      setTimer({
        id: 'transition_timeout',
        callback: () => {
          dispatch({ type: 'SET_TRANSITION', payload: null });
          clearFlag(SYSTEM_FLAGS.READY_FOR_TRANSITION);
        },
        delay: 10000
      });
    }
  }, [state.transition, hasFlag(FlagRegistryType.transition.systemsReady), setTimer, setFlag, dispatch, clearFlag]);

  useEffect(() => {
    if (hasFlag(SYSTEM_FLAGS.REFRESH_ROOM_MAP)) {
      try {
        const roomMap = getAllRoomsAsObject();
        dispatch({ type: 'SET_ROOM_MAP', payload: roomMap });

        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            text: 'Room map refreshed successfully.',
            type: 'system',
            timestamp: Date.now()
          }
        });
      } catch (error) {
        console.error('[SYSTEM] Failed to refresh room map:', error);
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            text: 'Failed to refresh room map.',
            type: 'error',
            timestamp: Date.now()
          }
        });
      }

      clearFlag(SYSTEM_FLAGS.REFRESH_ROOM_MAP);
    }
  }, [hasFlag(SYSTEM_FLAGS.REFRESH_ROOM_MAP), dispatch, clearFlag]);

  useEffect(() => {
    if (hasFlag(FlagRegistryType.debug.debugSystemStatus)) {
      console.log('[DEBUG] System Status:');
      console.log('- Systems Initialized:', systemsInitialized.current);
      console.log('- Room Map Ready:', hasFlag(FlagRegistryType.transition.roomMapReady));
      console.log('- Systems Ready:', hasFlag(FlagRegistryType.transition.systemsReady));
      console.log('- Current Stage:', state.stage);
      console.log('- Room Count:', Object.keys(state.roomMap || {}).length);
      console.log('- Flag Count:', Object.keys(state.flags || {}).length);

      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          text: 'System status logged to console.',
          type: 'system',
          timestamp: Date.now()
        }
      });

      clearFlag(FlagRegistryType.debug.debugSystemStatus);
    }
  }, [hasFlag(FlagRegistryType.debug.debugSystemStatus), state, hasFlag, clearFlag, dispatch]);

  useEffect(() => {
    if (hasFlag(SYSTEM_FLAGS.RESET_SYSTEMS)) {
      console.log('[SYSTEM] Resetting game systems...');

      clearTimer('auto_save');
      clearTimer('transition_delay');
      clearTimer('transition_timeout');

      systemsInitialized.current = false;
      clearFlag(FlagRegistryType.transition.systemsReady);
      clearFlag(FlagRegistryType.transition.roomMapReady);

      setTimeout(() => {
        hasMounted.current = false;
      }, 100);

      clearFlag(SYSTEM_FLAGS.RESET_SYSTEMS);
    }
  }, [hasFlag(SYSTEM_FLAGS.RESET_SYSTEMS), clearTimer, clearFlag]);

  return {
    isInitialized: systemsInitialized.current,
    isReady: hasFlag(FlagRegistryType.transition.systemsReady),
    roomMapReady: hasFlag(FlagRegistryType.transition.roomMapReady)
  };
};


export const SYSTEM_FLAGS = {
  ROOM_MAP_READY: 'roomMapReady',
  SYSTEMS_READY: 'systemsReady',
  READY_FOR_TRANSITION: 'readyForTransition',
  REFRESH_ROOM_MAP: 'refreshRoomMap',
  DEBUG_SYSTEM_STATUS: 'debugSystemStatus',
  RESET_SYSTEMS: 'resetSystems'
} as const;
