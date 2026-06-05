/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  Fullscreen and sound controls for AppCore modularisation.
*/

import { useCallback, useState } from 'react';

interface UseAppCoreSystemControlsArgs {
  readonly dispatch: (action: any) => void;
}

interface UseAppCoreSystemControlsResult {
  readonly isFullscreen: boolean;
  readonly soundOn: boolean;
  readonly toggleFullscreen: () => void;
  readonly toggleSound: () => void;
}

function recordError(dispatch: (action: any) => void, text: string): void {
  dispatch({
    type: 'ADD_MESSAGE',
    payload: {
      id: Date.now().toString(),
      text,
      type: 'error',
      timestamp: Date.now(),
    },
  });
}

export function useAppCoreSystemControls({ dispatch }: UseAppCoreSystemControlsArgs): UseAppCoreSystemControlsResult {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [soundOn, setSoundOn] = useState<boolean>(true);

  const toggleFullscreen = useCallback((): void => {
    const element = document.documentElement;

    try {
      if (!document.fullscreenElement) {
        element.requestFullscreen?.();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen?.();
        setIsFullscreen(false);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn('Fullscreen toggle failed:', errorMessage);
      recordError(dispatch, 'Fullscreen toggle failed.');
    }
  }, [dispatch]);

  const toggleSound = useCallback((): void => {
    setSoundOn((previousSoundState) => {
      const newSoundState = !previousSoundState;

      try {
        const audioElements: NodeListOf<HTMLAudioElement> = document.querySelectorAll('audio');
        audioElements.forEach((audio) => {
          audio.muted = !newSoundState;
        });
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.warn('Sound toggle failed:', errorMessage);
        recordError(dispatch, 'Sound toggle failed.');
      }

      return newSoundState;
    });
  }, [dispatch]);

  return {
    isFullscreen,
    soundOn,
    toggleFullscreen,
    toggleSound,
  };
}
