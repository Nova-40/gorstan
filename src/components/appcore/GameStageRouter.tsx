/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  Stage router extracted from AppCore as part of the incremental modularisation.
  It contains stage/transition rendering only; it should not own game state.
*/

import React from 'react';

import type { GameStage, IntroCompletionData, TeleportType } from './AppCoreTypes';
import {
  DramaticWaitTransition,
  JumpTransition,
  SipTransition,
  WaitTransition,
  SplashScreen,
  MainMenu,
  PlayerNameCapture,
  RouteSelectScreen,
  TeletypeIntro,
  TeleportManager,
  DemoScreen,
  TrialsGame,
} from './AppCoreLazyComponents';

interface GameStageRouterProps {
  readonly stage: GameStage;
  readonly transitionType: string | null;
  readonly teleportType: TeleportType;
  readonly playerName: string;
  readonly dispatch: (action: any) => void;
  readonly setReadyForTransition: (ready: boolean) => void;
  readonly setTransitionTargetRoom: (roomId: string) => void;
  readonly setTransitionInventory: (items: string[]) => void;
  readonly handleTeleportComplete: () => void;
  readonly startDemoRoute: (routeId?: string) => void;
}

const LoadingDemo: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-black text-green-400">
    <div className="text-center space-y-4">
      <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto" />
      <h2 className="text-2xl font-bold">Starting Demo Experience...</h2>
      <p className="text-lg">Ayla is preparing your guided tour</p>
    </div>
  </div>
);

const LoadingStage: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-black text-green-400">
    <div className="text-center space-y-4">
      <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto" />
      <p className="text-lg">Loading Gorstan…</p>
    </div>
  </div>
);

const StageSuspense: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => (
  <React.Suspense fallback={<LoadingStage />}>{children}</React.Suspense>
);

const GameStageRouter: React.FC<GameStageRouterProps> = ({
  stage,
  transitionType,
  teleportType,
  playerName,
  dispatch,
  setReadyForTransition,
  setTransitionTargetRoom,
  setTransitionInventory,
  handleTeleportComplete,
  startDemoRoute,
}) => {
  if (teleportType === 'fractal' || teleportType === 'trek') {
    return (
      <StageSuspense>
        <TeleportManager teleportType={teleportType} onComplete={handleTeleportComplete} />
      </StageSuspense>
    );
  }

  if (transitionType === 'jump') {
    return (
      <StageSuspense>
        <JumpTransition onComplete={() => setReadyForTransition(true)} />
      </StageSuspense>
    );
  }

  if (transitionType === 'sip') {
    return (
      <StageSuspense>
        <SipTransition onComplete={() => setReadyForTransition(true)} />
      </StageSuspense>
    );
  }

  if (transitionType === 'wait') {
    return (
      <StageSuspense>
        <WaitTransition onComplete={() => setReadyForTransition(true)} />
      </StageSuspense>
    );
  }

  if (transitionType === 'dramatic_wait') {
    return (
      <StageSuspense>
        <DramaticWaitTransition onComplete={() => setReadyForTransition(true)} />
      </StageSuspense>
    );
  }

  if (stage === 'splash') {
    return (
      <StageSuspense>
        <SplashScreen onComplete={() => dispatch({ type: 'ADVANCE_STAGE', payload: 'welcome' })} />
      </StageSuspense>
    );
  }

  if (stage === 'welcome') {
    return (
      <StageSuspense>
        <MainMenu
          onBegin={() => dispatch({ type: 'ADVANCE_STAGE', payload: 'nameCapture' })}
          onLoadGame={() => dispatch({ type: 'LOAD_SAVED_GAME' })}
          onStartDemo={() => {
            dispatch({ type: 'SET_PLAYER_NAME', payload: 'Demo Player' });
            dispatch({ type: 'ADVANCE_STAGE', payload: 'demo' });
          }}
          onUnlock={() => {
            dispatch({
              type: 'RECORD_MESSAGE',
              payload: {
                id: `unlock-${Date.now()}`,
                text: 'Unlock requested - redirecting to store...',
                type: 'system',
                timestamp: Date.now(),
              },
            });
          }}
          onOpenCredits={() => {
            dispatch({ type: 'SET_FLAG', payload: { flag: 'openCredits', value: true } });
          }}
          onOpenDemo={() => dispatch({ type: 'ADVANCE_STAGE', payload: 'demoList' })}
        />
      </StageSuspense>
    );
  }

  if (stage === 'demoList') {
    return (
      <StageSuspense>
        <DemoScreen
          onClose={() => dispatch({ type: 'ADVANCE_STAGE', payload: 'welcome' })}
          onStartDemo={(routeId: string) => {
            dispatch({ type: 'SET_PLAYER_NAME', payload: 'Demo Player' });
            dispatch({ type: 'ADVANCE_STAGE', payload: 'demo' });
            startDemoRoute(routeId);
          }}
        />
      </StageSuspense>
    );
  }

  if (stage === 'demo') {
    return <LoadingDemo />;
  }

  if (stage === 'trialsGame') {
    return (
      <StageSuspense>
        <TrialsGame
          onComplete={() => dispatch({ type: 'ADVANCE_STAGE', payload: 'routeSelect' })}
          onQuit={() => dispatch({ type: 'ADVANCE_STAGE', payload: 'routeSelect' })}
          autoStart={true}
        />
      </StageSuspense>
    );
  }

  if (stage === 'nameCapture') {
    return (
      <StageSuspense>
        <PlayerNameCapture
          onNameSubmit={(name: string) => {
            dispatch({ type: 'SET_PLAYER_NAME', payload: name });
            dispatch({ type: 'ADVANCE_STAGE', payload: 'routeSelect' });
          }}
        />
      </StageSuspense>
    );
  }

  if (stage === 'routeSelect') {
    return (
      <StageSuspense>
        <RouteSelectScreen
          onRouteSelect={(routeId: string) => {
            dispatch({ type: 'SET_ROUTE', payload: routeId });
            if (routeId === 'demo') {
              dispatch({ type: 'ADVANCE_STAGE', payload: 'demo' });
            } else if (routeId === 'short10_trialsofgorstan') {
              dispatch({ type: 'ADVANCE_STAGE', payload: 'trialsGame' });
            } else {
              dispatch({ type: 'ADVANCE_STAGE', payload: 'intro' });
            }
          }}
          onCancel={() => dispatch({ type: 'ADVANCE_STAGE', payload: 'welcome' })}
          onLoadGame={() => dispatch({ type: 'LOAD_SAVED_GAME' })}
        />
      </StageSuspense>
    );
  }

  if (stage === 'intro') {
    return (
      <StageSuspense>
        <TeletypeIntro
          playerName={playerName}
          onComplete={(data: IntroCompletionData) => {
            if (data.targetRoom) {
              setTransitionTargetRoom(data.targetRoom);
            }
            if (data.inventoryBonus) {
              setTransitionInventory(data.inventoryBonus);
            }
            const targetStage = `transition_${data.route}` as GameStage;
            setTimeout(() => {
              dispatch({ type: 'ADVANCE_STAGE', payload: targetStage });
            }, 750);
          }}
        />
      </StageSuspense>
    );
  }

  return null;
};

export default GameStageRouter;
