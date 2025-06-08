import React, { useState, useEffect, useReducer } from 'react';
import { GameContext, gameReducer, initialState } from './engine/GameContext.jsx';
import WelcomeScreen from './components/WelcomeScreen';
import PlayerNameCapture from './components/PlayerNameCapture';
import TeletypeIntro from './components/TeletypeIntro';
import PortalTransition from './components/PortalTransition';
import GameEngine from './engine/GameEngine.jsx';

/**
 * AppCore
 * Main controller for Gorstan game flow and state transitions.
 * @component
 * @returns {JSX.Element}
 */
const AppCore = () => {
  const [stage, setStage] = useState('welcome');
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Handles timed transitions for special stages
  useEffect(() => {
    let timeout;
    console.log("[AppCore] Stage changed:", stage);

    if (stage === 'portal') {
      timeout = setTimeout(() => {
        console.log("[AppCore] Transition: portal → room9");
        dispatch({ type: 'SET_ROOM', payload: 'room9' });
        setStage('game');
      }, 6000);
    } else if (stage === 'splat') {
      timeout = setTimeout(() => {
        console.log("[AppCore] Transition: splat → waitreset");
        setStage('waitreset');
      }, 3000);
    } else if (stage === 'waitreset') {
      timeout = setTimeout(() => {
        console.log("[AppCore] Transition: waitreset → introreset");
        dispatch({ type: 'SET_ROOM', payload: 'introreset' });
        setStage('game');
      }, 3000);
    } else if (stage === 'sipreset') {
      timeout = setTimeout(() => {
        console.log("[AppCore] Transition: sipreset → lattice → game");
        dispatch({ type: 'SET_ROOM', payload: 'room21' });
        setStage('game');
      }, 3000);
    } else if (stage === 'portallattice') {
      timeout = setTimeout(() => {
        console.log("[AppCore] Transition: portallattice → room21 → game");
        dispatch({ type: 'SET_ROOM', payload: 'room21' });
        setStage('game');
      }, 6000);
    }

    return () => {
      if (timeout) {
        console.log("[AppCore] Clearing timeout for stage:", stage);
        clearTimeout(timeout);
      }
    };
  }, [stage, dispatch]);

  // Handles player name submission
  const handleNameSubmit = (name) => {
    console.log("[AppCore] Player name submitted:", name);
    dispatch({ type: 'SET_PLAYER_NAME', payload: name });
    setStage('teletype');
  };

  // Handles TeletypeIntro choices
  const handleJump = () => {
    console.log("[AppCore] TeletypeIntro: Jump selected");
    dispatch({ type: 'SET_INTRO_CHOICE', payload: 'jump' });
    dispatch({ type: 'INCREMENT_SCORE', payload: 10 });
    dispatch({ type: 'ADD_ITEM', payload: 'coffee' });
    setStage('portal');
  };

  const handleWait = () => {
    console.log("[AppCore] TeletypeIntro: Wait selected");
    dispatch({ type: 'SET_INTRO_CHOICE', payload: 'wait' });
    dispatch({ type: 'INCREMENT_SCORE', payload: -10 });
    setStage('splat');
  };

  const handleSip = () => {
    console.log("[AppCore] TeletypeIntro: Sip selected");
    dispatch({ type: 'SET_INTRO_CHOICE', payload: 'sip' });
    dispatch({ type: 'INCREMENT_SCORE', payload: 40 });
    dispatch({ type: 'ADD_ITEM', payload: 'medallion' });
    dispatch({ type: 'ADD_TRAIT', payload: 'Insightful' });
    setStage('sipreset');
  };

  // Helper for transition screens
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
        <WelcomeScreen onEnterSimulation={() => {
          console.log("[AppCore] WelcomeScreen: Enter Simulation clicked");
          setStage('nameInput');
        }} />
      )}
      {stage === 'nameInput' && (
        <PlayerNameCapture onNameEntered={handleNameSubmit} />
      )}
      {stage === 'teletype' && (
        <TeletypeIntro
          onSip={handleSip}
          onWait={handleWait}
          onJump={handleJump}
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
        <GameEngine
          playerName={state.playerName}
          introChoice={state.introChoice || 'jump'}
          onError={(err) => console.error("Game error:", err)}
        />
      )}
    </GameContext.Provider>
  );
};

export default AppCore;

