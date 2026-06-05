/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  Demo-mode controller for AppCore modularisation.
*/

import { useCallback, useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

import { demoController } from '../../demo/demoController';
import { isDemoEnvironment } from '../../demo/demoGate';
import { demoService } from '../../demo/DemoModeService';
import { IS_DEV } from '../../config/mode';
import type { GameStage, TeleportType } from './AppCoreTypes';

interface UseAppCoreDemoArgs {
  readonly dispatch: (action: any) => void;
  readonly stage: GameStage;
  readonly hasFlag: (flag: string) => boolean;
  readonly setTeleportType: (type: TeleportType) => void;
  readonly setTeleportCallback: Dispatch<SetStateAction<() => void>>;
  readonly handleCommand: (command: string) => void;
}

interface UseAppCoreDemoResult {
  readonly isDemo: boolean;
  readonly isDemoActive: boolean;
  readonly setIsDemoActive: Dispatch<SetStateAction<boolean>>;
  readonly demoBanner?: string;
  readonly setDemoBanner: Dispatch<SetStateAction<string | undefined>>;
  readonly startDemoMode: () => void;
  readonly startDemoRoute: (routeId?: string) => void;
}

export function useAppCoreDemo({
  dispatch,
  stage,
  hasFlag,
  setTeleportType,
  setTeleportCallback,
  handleCommand,
}: UseAppCoreDemoArgs): UseAppCoreDemoResult {
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [isDemo] = useState<boolean>(isDemoEnvironment());
  const [demoBanner, setDemoBanner] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!isDemo || !dispatch) return;

    console.log('[AppCore] Initializing demo system');
    demoController.setDispatch(dispatch);

    const teleportTrigger = (teleportType: 'fractal' | 'trek', callback: () => void) => {
      setTeleportType(teleportType);
      setTeleportCallback(() => callback);
    };

    demoController.setTeleportTrigger(teleportTrigger);

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('demo') === 'auto' && stage === 'game') {
      console.log('[AppCore] Auto-starting demo mode');
      setIsDemoActive(true);
      demoService.start();
    }
  }, [isDemo, dispatch, stage, setTeleportType, setTeleportCallback]);

  useEffect(() => {
    if (IS_DEV && hasFlag('DEMO_MODE_ENABLED')) {
      demoService.setBannerSetter(setDemoBanner);
      return () => demoService.setBannerSetter(undefined);
    }

    return undefined;
  }, [hasFlag]);

  const startDemoMode = useCallback((): void => {
    console.log('[AppCore] startDemoMode called - beginning demo automation');
    const demoCommands = [
      { command: 'look', delay: 1000 },
      { command: 'west', delay: 2000 },
      { command: 'look', delay: 1500 },
      { command: 'examine tactical_display', delay: 2000 },
      { command: 'east', delay: 1500 },
      { command: 'sit', delay: 2000 },
      { command: 'look', delay: 1500 },
      { command: 'examine console', delay: 2000 },
      { command: 'status', delay: 1500 },
      { command: 'inventory', delay: 1500 },
      { command: 'help', delay: 2000 },
    ];

    let currentCommandIndex = 0;

    const executeDemoCommand = () => {
      if (currentCommandIndex >= demoCommands.length) {
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            id: Date.now().toString(),
            text: '🎮 Demo complete! Ayla: "You\'ve seen a glimpse of what Gorstan offers. Ready to explore on your own?"',
            type: 'system',
            timestamp: Date.now(),
          },
        });
        return;
      }

      const demoCommand = demoCommands[currentCommandIndex] ?? { command: '', delay: 0 };
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: Date.now().toString(),
          text: `🤖 Demo: ${demoCommand.command}`,
          type: 'input',
          timestamp: Date.now(),
        },
      });

      setTimeout(() => {
        handleCommand(demoCommand.command);
        currentCommandIndex += 1;
        setTimeout(executeDemoCommand, demoCommand.delay);
      }, 500);
    };

    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        id: Date.now().toString(),
        text: '🎭 Ayla: "Welcome to your guided tour of Gorstan! Watch as I demonstrate the core gameplay..."',
        type: 'system',
        timestamp: Date.now(),
      },
    });

    setTimeout(executeDemoCommand, 2000);
  }, [handleCommand, dispatch]);

  const startDemoRoute = useCallback((routeId?: string) => {
    setIsDemoActive(true);
    demoService.start(routeId);
  }, []);

  useEffect(() => {
    if (stage !== 'demo') return;

    console.log('[AppCore] Demo mode effect triggered - starting demo sequence');
    dispatch({ type: 'ADVANCE_STAGE', payload: 'game' });

    const demoTimer = setTimeout(() => {
      console.log('[AppCore] Demo timer fired - calling startDemoMode');
      startDemoMode();
    }, 2000);

    return () => {
      console.log('[AppCore] Demo effect cleanup - clearing timer');
      clearTimeout(demoTimer);
    };
  }, [stage, dispatch, startDemoMode]);

  return {
    isDemo,
    isDemoActive,
    setIsDemoActive,
    demoBanner,
    setDemoBanner,
    startDemoMode,
    startDemoRoute,
  };
}
