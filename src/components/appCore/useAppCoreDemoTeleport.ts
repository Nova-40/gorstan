import { useCallback, useEffect } from 'react';
import { demoController } from '../../demo/demoController';

type TeleportType = 'fractal' | 'trek' | null;

type Dispatch = (action: any) => void;

type HandleDemoCommandParams = {
  lowerCmd: string;
  isDemo: boolean;
  isDemoActive: boolean;
  setIsDemoActive: (isDemoActive: boolean) => void;
  dispatch: Dispatch;
};

export function handleAppCoreDemoCommand({
  lowerCmd,
  isDemo,
  isDemoActive,
  setIsDemoActive,
  dispatch,
}: HandleDemoCommandParams): boolean {
  // Demo system commands - only available in demo environment
  if (!isDemo) {
    return false;
  }

  if (lowerCmd === 'start demo' || lowerCmd === 'demo start') {
    if (!isDemoActive) {
      setIsDemoActive(true);
      demoController.startDemo();
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: Date.now().toString(),
          text: '🎬 Starting scripted demo mode...',
          type: 'system',
          timestamp: Date.now(),
        },
      });
    } else {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: Date.now().toString(),
          text: '🎬 Demo is already running. Press ESC to skip.',
          type: 'system',
          timestamp: Date.now(),
        },
      });
    }
    return true;
  }

  if (lowerCmd === 'stop demo' || lowerCmd === 'demo stop' || lowerCmd === 'skip demo') {
    if (isDemoActive) {
      demoController.skipDemo();
      setIsDemoActive(false);
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: Date.now().toString(),
          text: '🎬 Demo stopped. You now have full control.',
          type: 'system',
          timestamp: Date.now(),
        },
      });
    } else {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: Date.now().toString(),
          text: '🎬 No demo is currently running.',
          type: 'info',
          timestamp: Date.now(),
        },
      });
    }
    return true;
  }

  if (lowerCmd === 'next demo' || lowerCmd === 'demo next') {
    if (isDemoActive) {
      demoController.skipToNext();
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: Date.now().toString(),
          text: '🎬 Skipping to next demo step...',
          type: 'system',
          timestamp: Date.now(),
        },
      });
    } else {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: Date.now().toString(),
          text: '🎬 No demo is currently running.',
          type: 'info',
          timestamp: Date.now(),
        },
      });
    }
    return true;
  }

  return false;
}

type UseAppCoreDemoTeleportParams = {
  state: any;
  dispatch: Dispatch;
  stage: string;
  handleCommand: (command: string) => void;
  teleportCallback: () => void;
  setTeleportType: (teleportType: TeleportType) => void;
  setTeleportCallback: React.Dispatch<React.SetStateAction<() => void>>;
};

export function useAppCoreDemoTeleport({
  state,
  dispatch,
  stage,
  handleCommand,
  teleportCallback,
  setTeleportType,
  setTeleportCallback,
}: UseAppCoreDemoTeleportParams) {
  // Monitor for teleport test trigger
  useEffect(() => {
    if (state.flags?.triggerTeleport) {
      const teleportType = state.flags.triggerTeleport as TeleportType;
      console.log('[AppCore] Teleport test triggered:', teleportType);
      setTeleportType(teleportType);
      setTeleportCallback(() => () => {
        console.log('[AppCore] Teleport test complete');
      });
      // Clear the flag
      dispatch({ type: 'SET_FLAG', payload: { flag: 'triggerTeleport', value: null } });
    }
  }, [state.flags?.triggerTeleport, dispatch, setTeleportType, setTeleportCallback]);

  // Enhanced teleport completion handler with proper typing
  const handleTeleportComplete = useCallback((): void => {
    setTeleportType(null);
    if (teleportCallback) {
      teleportCallback();
      setTeleportCallback(() => () => {});
    }
  }, [teleportCallback, setTeleportType, setTeleportCallback]);

  // Demo mode automation - executes predefined commands to showcase gameplay
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
        // Demo completed - show completion message
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            id: Date.now().toString(),
            text: "🎮 Demo complete! Ayla: \"You\'ve seen a glimpse of what Gorstan offers. Ready to explore on your own?\"",
            type: 'system',
            timestamp: Date.now(),
          },
        });
        return;
      }

      const { command, delay } = demoCommands[currentCommandIndex];

      // Add demo command to message log
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: Date.now().toString(),
          text: `🤖 Demo: ${command}`,
          type: 'input',
          timestamp: Date.now(),
        },
      });

      // Execute the command after a brief delay
      setTimeout(() => {
        handleCommand(command);
        currentCommandIndex++;

        // Schedule next command
        setTimeout(executeDemoCommand, delay);
      }, 500);
    };

    // Start the demo sequence
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

  // Demo mode effect - must be called unconditionally to follow Rules of Hooks
  useEffect(() => {
    if (stage === 'demo') {
      console.log('[AppCore] Demo mode effect triggered - starting demo sequence');
      // Initialize demo mode - start the game with demo route
      dispatch({ type: 'ADVANCE_STAGE', payload: 'game' });

      // Keep demo in the current room (controlnexus)
      // dispatch({ type: 'SET_CURRENT_ROOM', payload: 'gorstanhub' });

      // After a brief delay, start the demo automation
      const demoTimer = setTimeout(() => {
        console.log('[AppCore] Demo timer fired - calling startDemoMode');
        // Start automated demo commands
        startDemoMode();
      }, 2000);

      return () => {
        console.log('[AppCore] Demo effect cleanup - clearing timer');
        clearTimeout(demoTimer);
      };
    }
  }, [stage, dispatch, startDemoMode]);

  return {
    handleTeleportComplete,
  };
}
