/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Trials of Gorstan - Interactive UI Interface for Human Players
  Provides visual feedback, controls, and engaging gameplay elements
*/

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './TrialsInterface.css';
import { TrialsHUD } from './TrialsHUD';
import { SceneTransition } from '../design/motion/SceneTransition';
import { RetroBar } from '../components/ui/RetroBar';

interface Position {
  x: number;
  y: number;
}

interface Creature {
  id: number;
  x: number;
  y: number;
  health: number;
  aggressive: boolean;
  type: 'six-legged-mutant';
}

interface Mushroom {
  id: number;
  x: number;
  y: number;
  triggered: boolean;
  glowing: boolean;
}

interface RestRock {
  id: number;
  x: number;
  y: number;
  occupied: boolean;
  available: boolean;
  cooldownRemaining: number;
}

interface MovingRock {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  angle: number;
  rotationSpeed: number;
}

interface TrialsGameState {
  // Combined union of all current / planned phases (keep in sync with useTrialsGameState)
  phase: 'rock-field' | 'random-rocks' | 'mushroom-field' | 'climb-ascent' | 'cave-horrors' | 'stream-reset' | 'cave-maze';
  phaseName: string;
  phaseProgress: number;
  playerPos: Position;
  playerHealth: number;
  playerEnergy: number;
  playerStamina: number;
  creatures: Creature[];
  mushrooms: Mushroom[];
  restRocks: RestRock[];
  movingRocks: MovingRock[];
  streamActive: boolean;
  timeRemaining: number;
  score: number;
  achievements: string[];
  currentObjective: string;
  hints: string[];
}

interface TrialsInterfaceProps {
  gameState: TrialsGameState;
  onPlayerMove: (direction: 'north' | 'south' | 'east' | 'west') => void;
  onPlayerAction: (action: 'rest' | 'trigger-mushroom' | 'hide' | 'sprint' | 'examine') => void;
  onPause: () => void;
  onResume: () => void;
  onQuit: () => void;
  isPaused: boolean;
}

export const TrialsInterface: React.FC<TrialsInterfaceProps> = ({
  gameState,
  onPlayerMove,
  onPlayerAction,
  onPause,
  onResume,
  onQuit,
  isPaused
}) => {
  const [showHints, setShowHints] = useState(false);
  const [selectedTile, setSelectedTile] = useState<Position | null>(null);
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });
  const [showMiniMap] = useState(true); // minimap toggle not yet implemented; keep state for layout
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isPaused) return;
      
      switch(e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          onPlayerMove('north');
          break;
        case 's':
        case 'arrowdown':
          onPlayerMove('south');
          break;
        case 'a':
        case 'arrowleft':
          onPlayerMove('west');
          break;
        case 'd':
        case 'arrowright':
          onPlayerMove('east');
          break;
        case ' ':
          e.preventDefault();
          onPlayerAction('rest');
          break;
        case 'e':
          onPlayerAction('trigger-mushroom');
          break;
        case 'h':
          onPlayerAction('hide');
          break;
        case 'shift':
          onPlayerAction('sprint');
          break;
        case 'x':
          onPlayerAction('examine');
          break;
        case 'p':
          isPaused ? onResume() : onPause();
          break;
        case 'escape':
          onQuit();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPaused, onPlayerMove, onPlayerAction, onPause, onResume, onQuit]);

  // Update camera to follow player
  useEffect(() => {
    const tileSize = 24;
    const viewportWidth = 800;
    const viewportHeight = 600;
    
    setCameraOffset({
      x: Math.max(0, Math.min(gameState.playerPos.x * tileSize - viewportWidth / 2, 40 * tileSize - viewportWidth)),
      y: Math.max(0, Math.min(gameState.playerPos.y * tileSize - viewportHeight / 2, 25 * tileSize - viewportHeight))
    });
  }, [gameState.playerPos]);

  // Render game field
  const renderGameField = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tileSize = 24;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid background
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= 40; x++) {
      ctx.beginPath();
      ctx.moveTo(x * tileSize - cameraOffset.x, 0);
      ctx.lineTo(x * tileSize - cameraOffset.x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= 25; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * tileSize - cameraOffset.y);
      ctx.lineTo(canvas.width, y * tileSize - cameraOffset.y);
      ctx.stroke();
    }

    // Render mushrooms with enhanced visual threat indicators
    gameState.mushrooms.forEach(mushroom => {
      const x = mushroom.x * tileSize - cameraOffset.x;
      const y = mushroom.y * tileSize - cameraOffset.y;
      
      if (x >= -tileSize && x <= canvas.width && y >= -tileSize && y <= canvas.height) {
        // Enhanced mushroom base with danger indication
        ctx.fillStyle = mushroom.triggered ? '#4A4A4A' : (mushroom.glowing ? '#FF4444' : '#8B4513');
        ctx.beginPath();
        ctx.arc(x + tileSize/2, y + tileSize/2, mushroom.triggered ? 6 : 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Enhanced mushroom cap with danger colors
        ctx.fillStyle = mushroom.triggered ? '#654321' : (mushroom.glowing ? '#FF6B6B' : '#CD853F');
        ctx.beginPath();
        ctx.arc(x + tileSize/2, y + tileSize/2 - 4, mushroom.triggered ? 4 : 8, 0, Math.PI);
        ctx.fill();
        
        // Add danger spores effect for untriggered mushrooms
        if (!mushroom.triggered) {
          ctx.fillStyle = 'rgba(255, 100, 100, 0.3)';
          ctx.beginPath();
          ctx.arc(x + tileSize/2, y + tileSize/2, 15, 0, Math.PI * 2);
          ctx.fill();
          
          // Pulsing danger aura
          const pulseEffect = Math.sin(Date.now() * 0.005) * 0.2 + 0.8;
          ctx.fillStyle = `rgba(255, 50, 50, ${pulseEffect * 0.2})`;
          ctx.beginPath();
          ctx.arc(x + tileSize/2, y + tileSize/2, 20, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });

    // Render rest rocks with gentle movement animation
    const animationTime = Date.now() / 1000; // Current time in seconds
    gameState.restRocks.forEach((rock, index) => {
      // Add unique phase offset for each rock so they don't all move in sync
      const phaseOffset = index * 0.3;
      const bobAmount = Math.sin(animationTime * 0.5 + phaseOffset) * 2; // 2 pixel max movement
      const sideMovement = Math.cos(animationTime * 0.3 + phaseOffset) * 1; // 1 pixel side movement
      
      const x = rock.x * tileSize - cameraOffset.x + sideMovement;
      const y = rock.y * tileSize - cameraOffset.y + bobAmount;
      
      if (x >= -tileSize && x <= canvas.width && y >= -tileSize && y <= canvas.height) {
        ctx.fillStyle = rock.available ? '#87CEEB' : '#696969';
        if (rock.occupied) ctx.fillStyle = '#4169E1';
        
        // Add slight size variation for breathing effect
        const breathingEffect = Math.sin(animationTime * 0.8 + phaseOffset) * 0.5;
        const rockSize = tileSize - 4 + breathingEffect;
        const offsetAdjust = (tileSize - 4 - rockSize) / 2;
        
        ctx.fillRect(x + 2 + offsetAdjust, y + 2 + offsetAdjust, rockSize, rockSize);
        
        // Cooldown indicator
        if (rock.cooldownRemaining > 0) {
          ctx.fillStyle = '#FF4500';
          ctx.fillRect(x, y - 4, (rock.cooldownRemaining / 30) * tileSize, 2);
        }
      }
    });

    // Render moving rocks (Asteroids-style) during rock-field phase
    if (gameState.phase === 'rock-field' && gameState.movingRocks) {
      gameState.movingRocks.forEach(rock => {
        const x = rock.x * tileSize - cameraOffset.x;
        const y = rock.y * tileSize - cameraOffset.y;
        if (x >= -tileSize && x <= canvas.width && y >= -tileSize && y <= canvas.height) {
          ctx.save();
          ctx.translate(x + tileSize/2, y + tileSize/2);
          ctx.rotate(rock.angle);
          const radius = rock.size * (tileSize/2);
          // Rock body
          const gradient = ctx.createRadialGradient(0,0, radius*0.2,0,0,radius);
          gradient.addColorStop(0,'#777');
          gradient.addColorStop(0.6,'#555');
          gradient.addColorStop(1,'#333');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          // Irregular polygon to feel organic
          const points = 6 + Math.floor(rock.size * 2);
          for (let i=0;i<points;i++) {
            const ang = (i/points) * Math.PI*2;
            const wobble = 0.7 + Math.sin(rock.id*13 + ang*3 + Date.now()*0.0007)*0.15;
            const px = Math.cos(ang) * radius * wobble;
            const py = Math.sin(ang) * radius * wobble;
            if (i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
          }
          ctx.closePath();
          ctx.fill();
          // Edge highlight
          ctx.strokeStyle = 'rgba(255,255,255,0.15)';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.restore();
        }
      });
    }

    // Render creatures with enhanced aggression visual effects
    gameState.creatures.forEach((creature, index) => {
      const x = creature.x * tileSize - cameraOffset.x;
      const y = creature.y * tileSize - cameraOffset.y;
      
      if (x >= -tileSize && x <= canvas.width && y >= -tileSize && y <= canvas.height) {
        // Aggressive aura around creature
        const auraIntensity = Math.sin(Date.now() * 0.01 + index) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(220, 20, 60, ${auraIntensity * 0.3})`;
        ctx.beginPath();
        ctx.arc(x + tileSize/2, y + tileSize/2, 18, 0, Math.PI * 2);
        ctx.fill();
        
        // Enhanced body with threat coloring
        ctx.fillStyle = creature.aggressive ? '#DC143C' : '#8B0000';
        ctx.fillRect(x + 4, y + 8, 16, 8);
        
        // Glowing eyes for more menacing appearance
        ctx.fillStyle = '#FF4500';
        ctx.beginPath();
        ctx.arc(x + 8, y + 6, 2, 0, Math.PI * 2);
        ctx.arc(x + 16, y + 6, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Six legs (3 on each side) with more dynamic appearance
        ctx.strokeStyle = creature.aggressive ? '#8B0000' : '#654321';
        ctx.lineWidth = 3;
        const legAnimation = Math.sin(Date.now() * 0.02 + index) * 2;
        
        for (let i = 0; i < 3; i++) {
          const legX = x + 6 + i * 4;
          // Left legs with movement
          ctx.beginPath();
          ctx.moveTo(legX, y + 8);
          ctx.lineTo(legX - 3 + legAnimation, y + 18);
          ctx.stroke();
          // Right legs with opposite movement
          ctx.beginPath();
          ctx.moveTo(legX, y + 16);
          ctx.lineTo(legX + 3 - legAnimation, y + 22);
          ctx.stroke();
        }
        
        // Enhanced health bar with danger coloring
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(x, y - 6, tileSize, 3);
        ctx.fillStyle = creature.health > 70 ? '#FF4500' : '#FF0000';
        ctx.fillRect(x, y - 6, (creature.health / 100) * tileSize, 3);
      }
    });

    // Render player
    const playerX = gameState.playerPos.x * tileSize - cameraOffset.x;
    const playerY = gameState.playerPos.y * tileSize - cameraOffset.y;
    
    ctx.fillStyle = '#4169E1';
    ctx.beginPath();
    ctx.arc(playerX + tileSize/2, playerY + tileSize/2, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Player direction indicator
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(playerX + tileSize/2 - 2, playerY + 2, 4, 6);

    // Selected tile highlight
    if (selectedTile) {
      const x = selectedTile.x * tileSize - cameraOffset.x;
      const y = selectedTile.y * tileSize - cameraOffset.y;
      ctx.strokeStyle = '#FFFF00';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, tileSize, tileSize);
    }
  }, [gameState, cameraOffset, selectedTile]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      renderGameField();
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [renderGameField]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left + cameraOffset.x) / 24);
    const y = Math.floor((e.clientY - rect.top + cameraOffset.y) / 24);
    
    setSelectedTile({ x, y });
  };

  return (
    <div className="trials-interface">
      <TrialsHUD
        timeRemaining={gameState.timeRemaining}
        health={gameState.playerHealth}
        energy={gameState.playerEnergy}
        stamina={gameState.playerStamina}
        phase={gameState.phaseName}
        phaseProgress={gameState.phaseProgress}
        objective={gameState.currentObjective}
        dangerLevel={gameState.creatures.length > 0 ? Math.min(1, gameState.creatures.filter(c=>c.aggressive).length / 5) : 0}
      />
      {/* Controls (compact) */}
      <div style={{ position: 'fixed', top: 8, right: 12, zIndex: 555, display: 'flex', gap: 8 }}>
        <button onClick={isPaused ? onResume : onPause} style={{ fontSize: 12, padding: '4px 8px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--color-border-secondary)', borderRadius: 6 }}>{isPaused ? 'Resume' : 'Pause'}</button>
        <button onClick={onQuit} style={{ fontSize: 12, padding: '4px 8px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--color-border-secondary)', borderRadius: 6 }}>Quit</button>
      </div>

      {/* Main Game Area */}
      <div className="game-container">
        <div className="game-field">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            onClick={handleCanvasClick}
            className="game-canvas"
          />
          
          {isPaused && (
            <SceneTransition in={isPaused} kind="scale">
              <div className="pause-overlay">
                <div className="pause-menu">
                  <h3>Game Paused</h3>
                  <button onClick={onResume} className="menu-btn">Resume</button>
                  <button onClick={() => setShowHints(!showHints)} className="menu-btn">{showHints ? 'Hide' : 'Show'} Hints</button>
                  <button onClick={onQuit} className="menu-btn">Quit to Menu</button>
                </div>
              </div>
            </SceneTransition>
          )}
        </div>

        <div className="side-panel">
          {/* Player Status */}
          <div className="status-panel">
            <h3>Player Status</h3>
            {(() => {
              const healthIntent = gameState.playerHealth <= 25 ? 'danger' : gameState.playerHealth <= 50 ? 'warning' : 'success';
              const energyIntent = gameState.playerEnergy <= 20 ? 'danger' : gameState.playerEnergy <= 50 ? 'warning' : 'info';
              const staminaIntent = gameState.playerStamina <= 20 ? 'danger' : gameState.playerStamina <= 50 ? 'warning' : 'success';
              return (
                <div className="status-bars condensed">
                  <RetroBar
                    value={gameState.playerHealth/100}
                    label="HEALTH"
                    intent={healthIntent as any}
                    height={6}
                    showValue
                    aria-label={`Health ${gameState.playerHealth} percent`}
                  />
                  <RetroBar
                    value={gameState.playerEnergy/100}
                    label="ENERGY"
                    intent={energyIntent as any}
                    height={6}
                    showValue
                    aria-label={`Energy ${gameState.playerEnergy} percent`}
                  />
                  <RetroBar
                    value={gameState.playerStamina/100}
                    label="STAMINA"
                    intent={staminaIntent as any}
                    height={6}
                    showValue
                    aria-label={`Stamina ${gameState.playerStamina} percent`}
                  />
                </div>
              );
            })()}
          
          </div>

          {/* Current Objective */}
          <div className="objective-panel">
            <h3>Current Objective</h3>
            <p className="objective-text">{gameState.currentObjective}</p>
          </div>

          {/* Actions */}
          <div className="actions-panel">
            <h3>Actions</h3>
            <div className="action-buttons">
              <button 
                onClick={() => onPlayerAction('rest')} 
                className="action-btn"
                disabled={gameState.playerEnergy > 80}
              >
                Rest (Space)
              </button>
              <button 
                onClick={() => onPlayerAction('trigger-mushroom')} 
                className="action-btn"
              >
                Trigger (E)
              </button>
              <button 
                onClick={() => onPlayerAction('hide')} 
                className="action-btn"
              >
                Hide (H)
              </button>
              <button 
                onClick={() => onPlayerAction('sprint')} 
                className="action-btn"
                disabled={gameState.playerStamina < 20}
              >
                Sprint (Shift)
              </button>
              <button 
                onClick={() => onPlayerAction('examine')} 
                className="action-btn"
              >
                Examine (X)
              </button>
            </div>
          </div>

          {/* Mini Map */}
          {showMiniMap && (
            <div className="minimap-panel">
              <h3>Mini Map</h3>
              <div className="minimap">
                <div 
                  className="minimap-player" 
                  style={{ 
                    left: `${(gameState.playerPos.x / 40) * 100}%`,
                    top: `${(gameState.playerPos.y / 25) * 100}%`
                  }}
                />
                {gameState.creatures.map(creature => (
                  <div
                    key={creature.id}
                    className="minimap-creature"
                    style={{
                      left: `${(creature.x / 40) * 100}%`,
                      top: `${(creature.y / 25) * 100}%`
                    }}
                  />
                ))}
                {gameState.restRocks.map(rock => (
                  <div
                    key={rock.id}
                    className={`minimap-rock ${rock.available ? 'available' : 'unavailable'}`}
                    style={{
                      left: `${(rock.x / 40) * 100}%`,
                      top: `${(rock.y / 25) * 100}%`
                    }}
                  />
                ))}
                {gameState.movingRocks && gameState.phase === 'rock-field' && gameState.movingRocks.map(r => (
                  <div
                    key={`mr-${r.id}`}
                    className="minimap-moving-rock"
                    style={{
                      left: `${(r.x / 40) * 100}%`,
                      top: `${(r.y / 25) * 100}%`
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {gameState.achievements.length > 0 && (
            <div className="achievements-panel">
              <h3>Achievements</h3>
              <div className="achievements-list">
                {gameState.achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="achievement-item"
                  >
                    🏆 {achievement}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hints Panel */}
      <AnimatePresence>
        {showHints && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="hints-panel"
          >
            <h3>Hints & Tips</h3>
            <div className="hints-list">
              {gameState.hints.map((hint, index) => (
                <div key={index} className="hint-item">
                  💡 {hint}
                </div>
              ))}
            </div>
            <button 
              onClick={() => setShowHints(false)} 
              className="close-hints"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Help */}
      <div className="controls-help">
        <div className="control-group">
          <span className="key">WASD / Arrows</span>
          <span className="description">Move</span>
        </div>
        <div className="control-group">
          <span className="key">Space</span>
          <span className="description">Rest</span>
        </div>
        <div className="control-group">
          <span className="key">E</span>
          <span className="description">Trigger</span>
        </div>
        <div className="control-group">
          <span className="key">H</span>
          <span className="description">Hide</span>
        </div>
        <div className="control-group">
          <span className="key">Shift</span>
          <span className="description">Sprint</span>
        </div>
        <div className="control-group">
          <span className="key">P</span>
          <span className="description">Pause</span>
        </div>
      </div>
    </div>
  );
};

export default TrialsInterface;
