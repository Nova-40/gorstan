// Gorstan Game Module — v3.1.1
import React, { useState, useEffect, useReducer, useRef } from 'react';
import { GameContext, gameReducer, initialState } from './engine/GameContext.jsx';
import WelcomeScreen from './components/WelcomeScreen';
import PlayerNameCapture from './components/PlayerNameCapture';
import TeletypeIntro from './components/TeletypeIntro';
import PortalTransition from './components/PortalTransition';
import GameEngine from './engine/GameEngine.jsx';

const AppCore = () => {
  const [stage, setStage] = useState('welcome');
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const timerRef = useRef(null);
  const stageRef = useRef(stage);
  const userInteractedRef = useRef(false);

  const cancelTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      console.log("[AppCore] Timer cancelled");
    }
  };

  const setStageWithCancel = (newStage) => {
    cancelTimer();
    setStage(newStage);
    stageRef.current = newStage;
  };

  useEffect(() => {
    console.log("[AppCore] Stage changed:", stage);
    stageRef.current = stage;
    cancelTimer();

    switch (stage) {
      case 'portal':
        timerRef.current = setTimeout(() => {
          if (stageRef.current !== 'portal') return;
          console.log("[AppCore] Transition: portal → room9");
          dispatch({ type: 'SET_ROOM', payload: 'room9' });
          setStage('game');
        }, 6000);
        break;
      case 'splat':
        timerRef.current = setTimeout(() => {
          if (stageRef.current !== 'splat' || userInteractedRef.current) return;
          console.log("[AppCore] Transition: splat → waitreset");
          setStage('waitreset');
        }, 3000);
        break;
      case 'waitreset':
        timerRef.current = setTimeout(() => {
          if (stageRef.current !== 'waitreset') return;
          console.log("[AppCore] Transition: waitreset → introReset");
          dispatch({ type: 'SET_ROOM', payload: 'introReset' });
          setStage('game');
        }, 3000);
        break;
      case 'sipreset':
        timerRef.current = setTimeout(() => {
          if (stageRef.current !== 'sipreset') return;
          console.log("[AppCore] Transition: sipreset → lattice → game");
          dispatch({ type: 'SET_ROOM', payload: 'room21' });
          setStage('game');
        }, 3000);
        break;
      case 'portallattice':
        timerRef.current = setTimeout(() => {
          if (stageRef.current !== 'portallattice') return;
          console.log("[AppCore] Transition: portallattice → room21 → game");
          dispatch({ type: 'SET_ROOM', payload: 'room21' });
          setStage('game');
        }, 6000);
        break;
    }
  }, [stage, dispatch]);

  const handleNameSubmit = (name) => {
    cancelTimer();
    userInteractedRef.current = true;
    console.log("[AppCore] Player name submitted:", name);
    dispatch({ type: 'SET_PLAYER_NAME', payload: name });
    dispatch({ type: 'LOG_EVENT', payload: { event: 'nameEntered', name } });
    setStageWithCancel('teletype');
  };

  const handleJump = () => {
    cancelTimer();
    userInteractedRef.current = true;
    console.log("[AppCore] TeletypeIntro: Jump selected");
    dispatch({ type: 'SET_INTRO_CHOICE', payload: 'jump' });
    dispatch({ type: 'INCREMENT_SCORE', payload: 10 });
    dispatch({ type: 'ADD_ITEM', payload: 'coffee' });
    dispatch({ type: 'LOG_EVENT', payload: { event: 'introChoice', choice: 'jump' } });
    setStageWithCancel('portal');
  };

  const handleWait = () => {
    cancelTimer();
    userInteractedRef.current = true;
    console.log("[AppCore] TeletypeIntro: Wait selected");
    dispatch({ type: 'SET_INTRO_CHOICE', payload: 'wait' });
    dispatch({ type: 'INCREMENT_SCORE', payload: -10 });
    dispatch({ type: 'LOG_EVENT', payload: { event: 'introChoice', choice: 'wait' } });
    setStageWithCancel('splat');
  };

  const handleSip = () => {
    cancelTimer();
    userInteractedRef.current = true;
    console.log("[AppCore] TeletypeIntro: Sip selected");
    dispatch({ type: 'SET_INTRO_CHOICE', payload: 'sip' });
    dispatch({ type: 'INCREMENT_SCORE', payload: 40 });
    dispatch({ type: 'ADD_ITEM', payload: 'medallion' });
    dispatch({ type: 'ADD_TRAIT', payload: 'Insightful' });
    dispatch({ type: 'LOG_EVENT', payload: { event: 'introChoice', choice: 'sip' } });
    setStageWithCancel('sipreset');
  };

  const handleSkip = () => {
    cancelTimer();
    userInteractedRef.current = true;
    console.log("[AppCore] TeletypeIntro: Skip selected");
    dispatch({ type: 'LOG_EVENT', payload: { event: 'introChoice', choice: 'skip' } });
    setStageWithCancel('portallattice');
  };

  const renderTransitionScreen = (color, main, sub) => (
    <div className={`min-h-screen flex items-center justify-center bg-black ${color} font-mono text-2xl text-center p-6 animate-pulse`}>
      <div>
        <p aria-live="polite">{main}</p>
        <p>{sub}</p>
      </div>
    </div>
  );

  console.log("[AppCore] Rendering stage:", stage);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {stage === 'welcome' && (
        <WelcomeScreen onEnterSimulation={() => setStageWithCancel('nameInput')} />
      )}
      {stage === 'nameInput' && (
        <PlayerNameCapture onNameSubmit={handleNameSubmit} />
      )}
      {stage === 'teletype' && (
        <TeletypeIntro
          playerName={state.playerName}
          resetCount={state.resetCount || 0}
          onSip={handleSip}
          onWait={handleWait}
          onJump={handleJump}
          onSkip={handleSkip}
        />
      )}
      {stage === 'portal' && <PortalTransition />}
      {stage === 'splat' && renderTransitionScreen(
        "text-red-400", "SPLAT.", "You have been hit by a truck. (Fortunately reality is... flexible.)"
      )}
      {stage === 'waitreset' && renderTransitionScreen(
        "text-yellow-300 text-xl", "You feel time rewind...", "Another chance awaits."
      )}
      {stage === 'sipreset' && renderTransitionScreen(
        "text-blue-300 text-xl", "You sip the coffee. The world blurs and reforms.", "Something new is within you."
      )}
      {stage === 'portallattice' && <PortalTransition />}
      {stage === 'game' && (
        <ErrorBoundary>
          <GameEngine
            playerName={state.playerName}
            introChoice={state.introChoice || 'jump'}
            onError={(err) => console.error("Game error:", err)}
          />
        </ErrorBoundary>
      )}
    </GameContext.Provider>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("GameEngine Error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return <div className="p-6 text-red-400 font-mono text-lg">Game crashed. Reload or report bug.</div>;
    }
    return this.props.children;
  }
}

export default AppCore;








