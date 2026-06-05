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
      <React.Suspense fallback={null}>
        <TeleportManager teleportType={teleportType} onComplete={handleTeleportComplete} />
      </React.Suspense>
    );
  }

  if (transitionType === 'jump') {
    return <JumpTransition onComplete={() => setReadyForTransition(true)} />;
  }

  if (transitionType === 'sip') {
    return <SipTransition onComplete={() => setReadyForTransition(true)} />;
  }

  if (transitionType === 'wait') {
    return <WaitTransition onComplete={() => setReadyForTransition(true)} />;
  }

  if (transitionType === 'dramatic_wait') {
    return <DramaticWaitTransition onComplete={() => setReadyForTransition(true)} />;
  }

  if (stage === 'splash') {
    return <SplashScreen onComplete={() => dispatch({ type: 'ADVANCE_STAGE', payload: 'welcome' })} />;
  }

  if (stage === 'welcome') {
    return (
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
    );
  }

  if (stage === 'demoList') {
    return (
      <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading demos…</div>}>
        <DemoScreen
          onClose={() => dispatch({ type: 'ADVANCE_STAGE', payload: 'welcome' })}
          onStartDemo={(routeId: string) => {
            dispatch({ type: 'SET_PLAYER_NAME', payload: 'Demo Player' });
            dispatch({ type: 'ADVANCE_STAGE', payload: 'demo' });
            startDemoRoute(routeId);
          }}
        />
      </React.Suspense>
    );
  }

  if (stage === 'demo') {
    return <LoadingDemo />;
  }

  if (stage === 'trialsGame') {
    return (
      <React.Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen bg-black text-purple-400">
            <div className="text-center space-y-4">
              <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto" />
              <h2 className="text-2xl font-bold">Loading Trials of Gorstan...</h2>
              <p className="text-lg">Preparing your interactive adventure</p>
            </div>
          </div>
        }
      >
        <TrialsGame
          onComplete={() => dispatch({ type: 'ADVANCE_STAGE', payload: 'routeSelect' })}
          onQuit={() => dispatch({ type: 'ADVANCE_STAGE', payload: 'routeSelect' })}
          autoStart={true}
        />
      </React.Suspense>
    );
  }

  if (stage === 'nameCapture') {
    return (
      <PlayerNameCapture
        onNameSubmit={(name: string) => {
          dispatch({ type: 'SET_PLAYER_NAME', payload: name });
          dispatch({ type: 'ADVANCE_STAGE', payload: 'routeSelect' });
        }}
      />
    );
  }

  if (stage === 'routeSelect') {
    return (
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
    );
  }

  if (stage === 'intro') {
    return (
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
    );
  }

  return null;
};

export default GameStageRouter;
