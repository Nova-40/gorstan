/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Trials of Gorstan - Main Game Component
  Combines the interface with game state management for a complete experience
*/

import React, { useEffect } from 'react';
import TrialsInterface from '../ui/TrialsInterface';
import { useTrialsGameState } from '../hooks/useTrialsGameState';
import '../ui/TrialsGameScreens.css';

interface TrialsGameProps {
  onComplete: () => void;
  onQuit: () => void;
  autoStart?: boolean;
}

export const TrialsGame: React.FC<TrialsGameProps> = ({
  onComplete,
  onQuit,
  autoStart = false
}) => {
  const {
    gameState,
    isPaused,
    isActive,
    startGame,
    stopGame,
    pauseGame,
    resumeGame,
    movePlayer,
    performAction
  } = useTrialsGameState();

  // Auto-start if requested
  useEffect(() => {
    if (autoStart && !isActive) {
      startGame();
    }
  }, [autoStart, isActive, startGame]);

  // Handle game completion
  useEffect(() => {
    if (gameState.phase === 'cave-maze' && gameState.phaseProgress >= 100) {
      console.log('[TrialsGame] Trials completed successfully!');
      onComplete();
    }
  }, [gameState.phase, gameState.phaseProgress, onComplete]);

  // Handle game over
  useEffect(() => {
    if (!isActive && (gameState.timeRemaining <= 0 || gameState.playerHealth <= 0)) {
      console.log('[TrialsGame] Game over');
      // Could show game over screen here
      setTimeout(() => {
        onQuit();
      }, 3000);
    }
  }, [isActive, gameState.timeRemaining, gameState.playerHealth, onQuit]);

  const handleQuit = () => {
    stopGame();
    onQuit();
  };

  const handlePlayerMove = (direction: 'north' | 'south' | 'east' | 'west') => {
    movePlayer(direction);
  };

  const handlePlayerAction = (action: 'rest' | 'trigger-mushroom' | 'hide' | 'sprint' | 'examine') => {
    performAction(action);
  };

  // Show start screen if not active
  if (!isActive && gameState.timeRemaining > 0 && gameState.playerHealth > 0) {
    return (
      <div className="trials-start-screen">
        <div className="start-content">
          <h1>Trials of Gorstan</h1>
          <p>
            Navigate through three challenging phases to prove your worth:
          </p>
          <ul>
            <li><strong>Rock Field</strong> - Master basic navigation and energy management</li>
            <li><strong>Random Rocks</strong> - Dodge falling obstacles with precise timing</li>
            <li><strong>Mushroom Field</strong> - Strategically trigger mushrooms while evading six-legged mutants</li>
          </ul>
          <p>
            Complete all phases within the time limit to unlock the cave maze finale!
          </p>
          <div className="start-controls">
            <button onClick={startGame} className="start-btn">
              Begin Trials
            </button>
            <button onClick={onQuit} className="quit-btn">
              Return to Menu
            </button>
          </div>
          <div className="controls-info">
            <h3>Controls:</h3>
            <div className="controls-grid">
              <span>WASD / Arrow Keys</span><span>Move</span>
              <span>Space</span><span>Rest at blue rocks</span>
              <span>E</span><span>Trigger mushrooms</span>
              <span>H</span><span>Hide from creatures</span>
              <span>Shift</span><span>Sprint (costs stamina)</span>
              <span>X</span><span>Examine surroundings</span>
              <span>P</span><span>Pause game</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show game over screen
  if (!isActive && (gameState.timeRemaining <= 0 || gameState.playerHealth <= 0)) {
    return (
      <div className="trials-game-over">
        <div className="game-over-content">
          <h1>
            {gameState.timeRemaining <= 0 ? 'Time\'s Up!' : 'Trial Failed'}
          </h1>
          <div className="final-stats">
            <div className="stat">
              <span>Final Score:</span>
              <span>{gameState.score}</span>
            </div>
            <div className="stat">
              <span>Phase Reached:</span>
              <span>{gameState.phaseName}</span>
            </div>
            <div className="stat">
              <span>Progress:</span>
              <span>{Math.floor(gameState.phaseProgress)}%</span>
            </div>
          </div>
          {gameState.achievements.length > 0 && (
            <div className="achievements-earned">
              <h3>Achievements Earned:</h3>
              {gameState.achievements.map((achievement, index) => (
                <div key={index} className="achievement">
                  🏆 {achievement}
                </div>
              ))}
            </div>
          )}
          <div className="game-over-actions">
            <button onClick={startGame} className="retry-btn">
              Try Again
            </button>
            <button onClick={onQuit} className="quit-btn">
              Return to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main game interface
  return (
    <TrialsInterface
      gameState={gameState}
      onPlayerMove={handlePlayerMove}
      onPlayerAction={handlePlayerAction}
      onPause={pauseGame}
      onResume={resumeGame}
      onQuit={handleQuit}
      isPaused={isPaused}
    />
  );
};

export default TrialsGame;
