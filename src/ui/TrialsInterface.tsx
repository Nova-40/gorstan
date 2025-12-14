/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Trials of Gorstan - Interactive UI Interface for Human Players
  Provides visual feedback, controls, and engaging gameplay elements
*/

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './TrialsInterface.css';

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

interface TrialsGameState {
  phase: 'rock-field' | 'random-rocks' | 'mushroom-field' | 'stream-reset' | 'cave-maze';
  phaseName: string;
  phaseProgress: number;
  playerPos: Position;
  playerHealth: number;
  playerEnergy: number;
  playerStamina: number;
  creatures: Creature[];
  mushrooms: Mushroom[];
  restRocks: RestRock[];
  streamActive: boolean;
  timeRemaining: number;
  score: number;
  achievements: string[];
  currentObjective: string;
  hints: string[];
  phaseText?: string | undefined;
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
  isPaused,
}) => {
  const [showHints, setShowHints] = useState(false);
  const [selectedTile, setSelectedTile] = useState<Position | null>(null);
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });
  const [showMiniMap, setShowMiniMap] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isPaused) {
        return;
      }

      switch (e.key.toLowerCase()) {
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
      x: Math.max(
        0,
        Math.min(
          gameState.playerPos.x * tileSize - viewportWidth / 2,
          40 * tileSize - viewportWidth,
        ),
      ),
      y: Math.max(
        0,
        Math.min(
          gameState.playerPos.y * tileSize - viewportHeight / 2,
          25 * tileSize - viewportHeight,
        ),
      ),
    });
  }, [gameState.playerPos]);

  // Render game field
  const renderGameField = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

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
    // If the active phase exposes a tile map (RockField), render tiles first so path/rock layout is visible
    try {
      // @ts-ignore
      const activePhase = (window as any).__activePhase;
      if (activePhase && typeof activePhase.getMap === 'function') {
        const map = activePhase.getMap();
        const mapTileSize = tileSize;
        for (let my = 0; my < map.height; my++) {
          const row = map.tiles[my];
          if (!row) continue;
          for (let mx = 0; mx < map.width; mx++) {
            const t = row[mx];
            const tx = mx * mapTileSize - cameraOffset.x;
            const ty = my * mapTileSize - cameraOffset.y;
            if (t === undefined) continue;
            // Rock tile
            if (t === 1) {
              ctx.fillStyle = '#333333';
              ctx.fillRect(tx, ty, mapTileSize, mapTileSize);
              // rock texture lines
              ctx.strokeStyle = 'rgba(0,0,0,0.15)';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(tx + 2, ty + 2);
              ctx.lineTo(tx + mapTileSize - 2, ty + mapTileSize - 2);
              ctx.stroke();
            } else if (t === 0) {
              // Path tile - prominent lighter color with pulsing overlay
              ctx.fillStyle = '#0f3b2d';
              ctx.fillRect(tx, ty, mapTileSize, mapTileSize);
              const pulse = (Math.sin(Date.now() * 0.006 + (mx + my) * 0.2) + 1) * 0.5; // 0..1
              ctx.fillStyle = `rgba(32,200,150,${0.06 * pulse})`;
              ctx.fillRect(tx, ty, mapTileSize, mapTileSize);
              // subtle border
              ctx.strokeStyle = 'rgba(255,255,255,0.02)';
              ctx.strokeRect(tx + 0.5, ty + 0.5, mapTileSize - 1, mapTileSize - 1);
            } else if (t === 2) {
              // Exit tile - bright highlight
              ctx.fillStyle = '#1a8b4a';
              ctx.fillRect(tx, ty, mapTileSize, mapTileSize);
              ctx.fillStyle = 'rgba(255,255,255,0.06)';
              ctx.fillRect(tx + 2, ty + 2, mapTileSize - 4, mapTileSize - 4);
              ctx.strokeStyle = '#7CFFB2';
              ctx.lineWidth = 2;
              ctx.strokeRect(tx + 1, ty + 1, mapTileSize - 2, mapTileSize - 2);
            }
          }
        }
      }
    } catch (e) {
      // ignore map rendering errors
    }

    // Render mushrooms with enhanced visual threat indicators
    gameState.mushrooms.forEach((mushroom) => {
      const x = mushroom.x * tileSize - cameraOffset.x;
      const y = mushroom.y * tileSize - cameraOffset.y;

      if (x >= -tileSize && x <= canvas.width && y >= -tileSize && y <= canvas.height) {
        // Enhanced mushroom base with danger indication
        ctx.fillStyle = mushroom.triggered ? '#4A4A4A' : mushroom.glowing ? '#FF4444' : '#8B4513';
        ctx.beginPath();
        ctx.arc(x + tileSize / 2, y + tileSize / 2, mushroom.triggered ? 6 : 10, 0, Math.PI * 2);
        ctx.fill();

        // Enhanced mushroom cap with danger colors
        ctx.fillStyle = mushroom.triggered ? '#654321' : mushroom.glowing ? '#FF6B6B' : '#CD853F';
        ctx.beginPath();
        ctx.arc(x + tileSize / 2, y + tileSize / 2 - 4, mushroom.triggered ? 4 : 8, 0, Math.PI);
        ctx.fill();

        // Add danger spores effect for untriggered mushrooms
        if (!mushroom.triggered) {
          ctx.fillStyle = 'rgba(255, 100, 100, 0.3)';
          ctx.beginPath();
          ctx.arc(x + tileSize / 2, y + tileSize / 2, 15, 0, Math.PI * 2);
          ctx.fill();

          // Pulsing danger aura
          const pulseEffect = Math.sin(Date.now() * 0.005) * 0.2 + 0.8;
          ctx.fillStyle = `rgba(255, 50, 50, ${pulseEffect * 0.2})`;
          ctx.beginPath();
          ctx.arc(x + tileSize / 2, y + tileSize / 2, 20, 0, Math.PI * 2);
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
        if (rock.occupied) {
          ctx.fillStyle = '#4169E1';
        }

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

    // Render creatures with enhanced aggression visual effects
    gameState.creatures.forEach((creature, index) => {
      const x = creature.x * tileSize - cameraOffset.x;
      const y = creature.y * tileSize - cameraOffset.y;

      if (x >= -tileSize && x <= canvas.width && y >= -tileSize && y <= canvas.height) {
        // Aggressive aura around creature
        const auraIntensity = Math.sin(Date.now() * 0.01 + index) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(220, 20, 60, ${auraIntensity * 0.3})`;
        ctx.beginPath();
        ctx.arc(x + tileSize / 2, y + tileSize / 2, 18, 0, Math.PI * 2);
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
    ctx.arc(playerX + tileSize / 2, playerY + tileSize / 2, 10, 0, Math.PI * 2);
    ctx.fill();

    // Player direction indicator
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(playerX + tileSize / 2 - 2, playerY + 2, 4, 6);

    // Selected tile highlight
    if (selectedTile) {
      const x = selectedTile.x * tileSize - cameraOffset.x;
      const y = selectedTile.y * tileSize - cameraOffset.y;
      ctx.strokeStyle = '#FFFF00';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, tileSize, tileSize);
    }

    // Render rolling rocks from active RockField if present on window
    try {
      // @ts-ignore
      const activeRockField = (window as any).__activeRockField;
      if (activeRockField && typeof activeRockField.getRollingRocks === 'function') {
        const rolling = activeRockField.getRollingRocks();
        // draw asteroids for rolling rocks
        const drawAsteroid = (cx: number, cy: number, radius: number, seed: number, rot: number) => {
          // seeded random helper
          let s = seed || 1;
          const rand = () => {
            s = (s * 9301 + 49297) % 233280;
            return s / 233280;
          };

          const points = 10;
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(rot);

          // main body
          ctx.beginPath();
          for (let i = 0; i < points; i++) {
            const a = (i / points) * Math.PI * 2;
            const r = radius * (0.75 + rand() * 0.6);
            const x = Math.cos(a) * r;
            const y = Math.sin(a) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();

          const grad = ctx.createRadialGradient(-radius * 0.3, -radius * 0.3, radius * 0.1, 0, 0, radius);
          grad.addColorStop(0, '#b08a57');
          grad.addColorStop(0.6, '#8b5a2b');
          grad.addColorStop(1, '#4b2f1a');
          ctx.fillStyle = grad;
          ctx.fill();

          // craters
          const craterCount = 2 + Math.floor(rand() * 3);
          for (let c = 0; c < craterCount; c++) {
            const ca = rand() * Math.PI * 2;
            const cr = rand() * radius * 0.5;
            const cxOff = Math.cos(ca) * cr * 0.6;
            const cyOff = Math.sin(ca) * cr * 0.6;
            ctx.beginPath();
            ctx.fillStyle = 'rgba(0,0,0,0.18)';
            ctx.arc(cxOff, cyOff, Math.max(2, radius * (0.12 + rand() * 0.12)), 0, Math.PI * 2);
            ctx.fill();
          }

          // subtle outline
          ctx.strokeStyle = 'rgba(0,0,0,0.35)';
          ctx.lineWidth = Math.max(1, radius * 0.06);
          ctx.stroke();
          ctx.restore();
        };

        rolling.forEach((r: any) => {
          const rx = r.x * tileSize - cameraOffset.x + tileSize / 2;
          const ry = r.y * tileSize - cameraOffset.y + tileSize / 2;
          const rad = Math.max(6, r.size * 6);
          // rotation based on id + time for motion
          const rot = ((Date.now() / 1000) * 0.6 + (r.id % 17) * 0.37) % (Math.PI * 2);
          if (rx >= -80 && rx <= canvas.width + 80 && ry >= -80 && ry <= canvas.height + 80) {
            drawAsteroid(rx, ry, rad, r.id + 137, rot);
            // shadow
            ctx.fillStyle = 'rgba(0,0,0,0.18)';
            ctx.fillRect(rx - 4, ry + rad * 0.6, Math.max(6, rad * 0.8), 3);
          }
        });
      }
    } catch (e) {
      // ignore
    }

    // Also draw moving rocks from active phase if present (RandomRocks)
    try {
      // @ts-ignore
      const activePhase = (window as any).__activePhase;
      if (activePhase && typeof activePhase.getRocks === 'function') {
        const rocks = activePhase.getRocks();
        rocks.forEach((r: any) => {
          const rx = r.x * tileSize - cameraOffset.x + tileSize / 2;
          const ry = r.y * tileSize - cameraOffset.y + tileSize / 2;
          const rad = Math.max(5, (r.size || 1) * 5);
          const rot = ((Date.now() / 1000) * 0.8 + (r.id % 23) * 0.21) % (Math.PI * 2);
          if (rx >= -80 && rx <= canvas.width + 80 && ry >= -80 && ry <= canvas.height + 80) {
            // reuse drawAsteroid (ensure defined)
            try {
              // drawAsteroid is defined in the rolling rocks block; recreate small helper here to be safe
              let s = r.id || 1;
              const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
              ctx.save(); ctx.translate(rx, ry); ctx.rotate(rot);
              ctx.beginPath();
              const pts = 10;
              for (let i = 0; i < pts; i++) {
                const a = (i / pts) * Math.PI * 2;
                const rr = rad * (0.8 + rand() * 0.5);
                const x = Math.cos(a) * rr; const y = Math.sin(a) * rr;
                if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
              }
              ctx.closePath();
              const grad = ctx.createRadialGradient(-rad * 0.3, -rad * 0.3, rad * 0.1, 0, 0, rad);
              grad.addColorStop(0,'#caa37a'); grad.addColorStop(0.6,'#9a6b3a'); grad.addColorStop(1,'#55321a');
              ctx.fillStyle = grad; ctx.fill();
              ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = Math.max(1, rad * 0.06); ctx.stroke();
              ctx.restore();
            } catch (er) {}
          }
        });
      }
    } catch (e) {}
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
    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left + cameraOffset.x) / 24);
    const y = Math.floor((e.clientY - rect.top + cameraOffset.y) / 24);

    setSelectedTile({ x, y });
  };

  return (
    <div className="trials-interface">
      {/* Header */}
      <div className="trials-header">
        <div className="phase-info">
          <h2 className="phase-title">{gameState.phaseName}</h2>
          {gameState.phaseText && (
            <div className="phase-text" style={{ opacity: 0.95 }}>
              {gameState.phaseText}
            </div>
          )}
          <div className="phase-progress">
            <div className="progress-bar" style={{ width: `${gameState.phaseProgress}%` }} />
          </div>
        </div>

        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">Time Remaining:</span>
            <span className="stat-value">{(gameState.timeRemaining / 60).toFixed(2)} min</span>
          </div>
          <div className="stat">
            <span className="stat-label">Score:</span>
            <span className="stat-value">{gameState.score}</span>
          </div>
        </div>

        <div className="controls">
          <button onClick={isPaused ? onResume : onPause} className="control-btn">
            {isPaused ? '▶️' : '⏸️'}
          </button>
          <button onClick={onQuit} className="control-btn">
            ❌
          </button>
        </div>
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
            <div className="pause-overlay">
              <div className="pause-menu">
                <h3>Game Paused</h3>
                <button onClick={onResume} className="menu-btn">
                  Resume
                </button>
                <button onClick={() => setShowHints(!showHints)} className="menu-btn">
                  {showHints ? 'Hide' : 'Show'} Hints
                </button>
                <button onClick={onQuit} className="menu-btn">
                  Quit to Menu
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="side-panel">
          {/* Player Status */}
          <div className="status-panel">
            <h3>Player Status</h3>
            <div className="status-bars">
              <div className="status-bar">
                <label>Health</label>
                <div className="bar">
                  <div
                    className="bar-fill health"
                    style={{ width: `${gameState.playerHealth}%` }}
                  />
                </div>
                <span>{gameState.playerHealth}%</span>
              </div>

              <div className="status-bar">
                <label>Energy</label>
                <div className="bar">
                  <div
                    className="bar-fill energy"
                    style={{ width: `${gameState.playerEnergy}%` }}
                  />
                </div>
                <span>{gameState.playerEnergy}%</span>
              </div>

              <div className="status-bar">
                <label>Stamina</label>
                <div className="bar">
                  <div
                    className="bar-fill stamina"
                    style={{ width: `${gameState.playerStamina}%` }}
                  />
                </div>
                <span>{gameState.playerStamina}%</span>
              </div>
            </div>
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
              <button onClick={() => onPlayerAction('trigger-mushroom')} className="action-btn">
                Trigger (E)
              </button>
              <button onClick={() => onPlayerAction('hide')} className="action-btn">
                Hide (H)
              </button>
              <button
                onClick={() => onPlayerAction('sprint')}
                className="action-btn"
                disabled={gameState.playerStamina < 20}
              >
                Sprint (Shift)
              </button>
              <button onClick={() => onPlayerAction('examine')} className="action-btn">
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
                    top: `${(gameState.playerPos.y / 25) * 100}%`,
                  }}
                />
                {gameState.creatures.map((creature) => (
                  <div
                    key={creature.id}
                    className="minimap-creature"
                    style={{
                      left: `${(creature.x / 40) * 100}%`,
                      top: `${(creature.y / 25) * 100}%`,
                    }}
                  />
                ))}
                {gameState.restRocks.map((rock) => (
                  <div
                    key={rock.id}
                    className={`minimap-rock ${rock.available ? 'available' : 'unavailable'}`}
                    style={{
                      left: `${(rock.x / 40) * 100}%`,
                      top: `${(rock.y / 25) * 100}%`,
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
            <button onClick={() => setShowHints(false)} className="close-hints">
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
