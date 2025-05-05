// GameEngineWrapper.jsx
import { useEffect, useImperativeHandle, forwardRef } from 'react';
import { GameEngine } from '../engine/GameEngine';

const GameEngineWrapper = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    getInstance: () => engine
  }));

  useEffect(() => {
    const engine = new GameEngine();
    window.gameState = engine;
    engine.setOutputHandler(console.log); // temporary placeholder
    engine.setSceneHandler((scene) => console.log("Scene update:", scene));
  }, []);

  return (
    <div className="p-4 text-white">
      <p>Game is running…</p>
      {/* Add more rendering logic here */}
    </div>
  );
});

export default GameEngineWrapper;