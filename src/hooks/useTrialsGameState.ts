/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Trials Game State Hook - Manages the game state and provides interface controls
*/

import { useState, useEffect, useCallback, useRef } from 'react';
import { getMetaSnapshot } from '../meta/metaProgression';
import { TrialsController } from '../mechanics/trials/TrialsController';
import { MushroomField } from '../mechanics/trials/MushroomField';
// Removed unused RockField and RandomRocks imports (kept MushroomField usage)

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
  x: number; // continuous world coords (tiles)
  y: number;
  vx: number; // tiles per second
  vy: number; // tiles per second
  size: number; // visual size scalar (tile fraction)
  angle: number; // radians
  rotationSpeed: number; // radians per second
}

interface TrialsGameState {
  phase: 'rock-field' | 'random-rocks' | 'mushroom-field' | 'climb-ascent' | 'cave-horrors' | 'cave-maze';
  phaseName: string;
  phaseProgress: number;
  playerPos: Position;
  playerHealth: number;
  playerEnergy: number;
  playerStamina: number;
  creatures: Creature[];
  mushrooms: Mushroom[];
  restRocks: RestRock[];
  movingRocks: MovingRock[]; // Asteroids-style moving rocks for rock-field phase
  streamActive: boolean;
  timeRemaining: number;
  score: number;
  achievements: string[];
  currentObjective: string;
  hints: string[];
  climbGrip?: number;
  echoRevealMs?: number;
  confusion?: boolean;
  runSeed?: number; // deterministic per-run seed for artifact selection & procedural variation
  failureHandicap?: number; // derived from meta failures for adaptive scaling
}

const PHASE_OBJECTIVES = {
  'rock-field': 'Navigate through the rock field safely. Rest at blue rocks to recover energy.',
  'random-rocks': 'Avoid falling rocks and reach the end. Watch for patterns in the chaos.',
  'mushroom-field': '🍄 Navigate the dense mushroom field! Stepping on mushrooms spawns WAVES of ravenous six-legged monsters. Use the 3 safety rocks strategically - creatures despawn near them. Reach the stream for ultimate safety! 🌊',
  'climb-ascent': 'Ascend the unstable cliff face. Manage grip and stamina while avoiding falling debris.',
  'cave-horrors': 'Traverse the horror-filled chamber. Unknown sounds stalk you; light pulses reveal safe tiles.',
  'cave-maze': 'Navigate the procedural cave maze and find the hidden artifact to complete the trials.'
};

const PHASE_HINTS = {
  'rock-field': [
    'Blue rocks restore energy - use them when below 50%',
    'Moving diagonally can help avoid obstacles',
    'Energy depletes faster when moving through rough terrain'
  ],
  'random-rocks': [
    'Watch for safe spots between falling rocks',
    'Rocks fall in predictable patterns - observe before moving',
    'Sprint only when necessary to preserve stamina'
  ],
  'mushroom-field': [
    '🦂 Each mushroom spawns 6-11 coordinated creatures in a wave!',
    '🛡️ Safety rocks make creatures drowsy - they despawn after 20 seconds',
    '⚡ Chain reactions! Triggering one mushroom may trigger nearby ones',
    '🌊 The stream instantly despawns ALL creatures - your ultimate goal!',
    '🏃 Creatures move fast and coordinate - plan your route to safety rocks!',
    '💀 Avoid triggering multiple mushrooms - that means certain doom!'
  ],
  'climb-ascent': [
    'Grip drains faster on overhang sections',
    'Rest briefly on ledges to restore some stamina',
    'Falling debris rattles before it drops – move laterally'
  ],
  'cave-horrors': [
    'You can’t always trust what you see in the dark',
    'Echo pulses (Press E) briefly reveal safe ground',
    'Some horrors react to sound – move after they shriek'
  ],
  'cave-maze': [
    'The artifact is hidden in a dead-end chamber',
    'Mark your path to avoid getting lost',
    'Some walls may be illusory - test suspicious areas'
  ]
};

export function useTrialsGameState() {
  const [gameState, setGameState] = useState<TrialsGameState>({
    phase: 'rock-field',
    phaseName: 'Rock Field Navigation',
    phaseProgress: 0,
    playerPos: { x: 2, y: 12 },
    playerHealth: 100,
    playerEnergy: 100,
    playerStamina: 100,
    creatures: [],
    mushrooms: [],
    restRocks: [],
  movingRocks: [],
    streamActive: false,
    timeRemaining: 600, // 10 minutes
    score: 0,
    achievements: [],
    currentObjective: PHASE_OBJECTIVES['rock-field'],
    hints: PHASE_HINTS['rock-field']
  });

  const [isPaused, setIsPaused] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const gameLoopRef = useRef<number | undefined>(undefined);
  const trialsControllerRef = useRef<TrialsController | undefined>(undefined);
  const mushroomFieldRef = useRef<MushroomField | undefined>(undefined);
  const lastUpdateTime = useRef<number>(Date.now());

  // Initialize game
  const startGame = useCallback(() => {
    setIsActive(true);
    setIsPaused(false);
    trialsControllerRef.current = new TrialsController();
    lastUpdateTime.current = Date.now();
    const meta = getMetaSnapshot();
    const failureCount = meta.trials.failures || 0;
    const failureHandicap = Math.min(failureCount, 6); // cap handicap influence
    const baseTime = 600; // seconds
    // Award extra time for repeated failures (gentle assist), up to +3 min
    const timeBonus = failureHandicap * 30; // seconds per failure
    const runSeed = hashRunSeed(new Date().toISOString());
    
    // Reset game state
    setGameState(prev => ({
      ...prev,
      phase: 'rock-field',
      phaseName: 'Rock Field Navigation',
      phaseProgress: 0,
      playerPos: { x: 2, y: 12 },
      playerHealth: 100,
      playerEnergy: 100,
      playerStamina: 100,
      creatures: [],
      mushrooms: [],
      restRocks: generateInitialRestRocks(),
      movingRocks: generateInitialMovingRocks(failureHandicap),
      timeRemaining: baseTime + timeBonus,
      score: 0,
      achievements: [],
      currentObjective: PHASE_OBJECTIVES['rock-field'],
      hints: PHASE_HINTS['rock-field'],
      runSeed,
      failureHandicap
    }));

    console.log('[TrialsGameState] Game started');
  }, []);

  // Stop game
  const stopGame = useCallback(() => {
    setIsActive(false);
    setIsPaused(false);
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    console.log('[TrialsGameState] Game stopped');
  }, []);

  // Pause/Resume
  const pauseGame = useCallback(() => {
    setIsPaused(true);
    console.log('[TrialsGameState] Game paused');
  }, []);

  const resumeGame = useCallback(() => {
    setIsPaused(false);
    lastUpdateTime.current = Date.now();
    console.log('[TrialsGameState] Game resumed');
  }, []);

  // Generate initial rest rocks
  const generateInitialRestRocks = (): RestRock[] => {
    const rocks: RestRock[] = [];
    for (let i = 0; i < 8; i++) {
      rocks.push({
        id: i,
        x: Math.floor(Math.random() * 38) + 1,
        y: Math.floor(Math.random() * 23) + 1,
        occupied: false,
        available: true,
        cooldownRemaining: 0
      });
    }
    return rocks;
  };

  // Generate moving rocks (Asteroids style) for initial rock-field phase
  const generateInitialMovingRocks = (failureHandicap = 0): MovingRock[] => {
    const rocks: MovingRock[] = [];
    const count = Math.max(6, 14 - failureHandicap * 2); // reduce density on repeated failures
    for (let i = 0; i < count; i++) {
      const speed = 0.6 + Math.random() * 0.9; // tiles / second
      const direction = Math.random() * Math.PI * 2;
      rocks.push({
        id: i,
        x: Math.random() * 40,
        y: Math.random() * 25,
        vx: Math.cos(direction) * speed,
        vy: Math.sin(direction) * speed,
        size: 0.6 + Math.random() * 1.2, // roughly 0.6–1.8 tile radius
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 1.2 // rad/s
      });
    }
    return rocks;
  };

  // Player movement
  const movePlayer = useCallback((direction: 'north' | 'south' | 'east' | 'west') => {
    if (isPaused || !isActive) return;

    setGameState(prev => {
      const newPos = { ...prev.playerPos };
      let dir = direction;
      if (prev.phase === 'cave-horrors' && prev.confusion) {
        const mapping: Record<'north'|'south'|'east'|'west','north'|'south'|'east'|'west'> = { north:'south', south:'north', east:'west', west:'east' };
        dir = mapping[direction];
      }
      
      switch (dir) {
        case 'north':
          newPos.y = Math.max(0, newPos.y - 1);
          break;
        case 'south':
          newPos.y = Math.min(24, newPos.y + 1);
          break;
        case 'west':
          newPos.x = Math.max(0, newPos.x - 1);
          break;
        case 'east':
          newPos.x = Math.min(39, newPos.x + 1);
          break;
      }

      // Energy cost for movement
      const energyCost = prev.playerStamina > 20 ? 1 : 2;
      const newEnergy = Math.max(0, prev.playerEnergy - energyCost);
      
      // Check phase progression
      let newPhaseProgress = prev.phaseProgress;
      let newScore = prev.score + 1;
      
      if (prev.phase === 'rock-field') {
        if (newPos.x > 35 && prev.phaseProgress < 100) { newPhaseProgress = 100; newScore += 100; }
        else newPhaseProgress = Math.max(prev.phaseProgress, (newPos.x / 40) * 100);
      } else if (prev.phase === 'random-rocks') {
        newPhaseProgress = Math.max(prev.phaseProgress, (newPos.x / 40) * 100);
        if (newPhaseProgress >= 100) newScore += 120;
      } else if (prev.phase === 'mushroom-field') {
        newPhaseProgress = Math.max(prev.phaseProgress, (newPos.x / 40) * 100);
      } else if (prev.phase === 'climb-ascent') {
        const ascent = (24 - newPos.y) / 24; newPhaseProgress = Math.max(prev.phaseProgress, ascent * 100);
      } else if (prev.phase === 'cave-horrors') {
        const metric = ((newPos.x/40) + (1 - newPos.y/24)) / 2; newPhaseProgress = Math.max(prev.phaseProgress, metric * 100);
      } else if (prev.phase === 'cave-maze') {
        if (newPos.x > 34 && newPos.y < 5) newPhaseProgress = 100; else newPhaseProgress = Math.max(prev.phaseProgress, ((newPos.x + (24-newPos.y))/ (40+24)) * 100);
      }

      return {
        ...prev,
        playerPos: newPos,
        playerEnergy: newEnergy,
        phaseProgress: newPhaseProgress,
        score: newScore
      };
    });
  }, [isPaused, isActive]);

  // Player actions
  const performAction = useCallback((action: 'rest' | 'trigger-mushroom' | 'hide' | 'sprint' | 'examine') => {
    if (isPaused || !isActive) return;

    setGameState(prev => {
      const newState = { ...prev };

      switch (action) {
        case 'rest':
          // Find nearby rest rock
          const nearbyRock = prev.restRocks.find(rock => 
            Math.abs(rock.x - prev.playerPos.x) <= 1 && 
            Math.abs(rock.y - prev.playerPos.y) <= 1 &&
            rock.available && !rock.occupied
          );
          
          if (nearbyRock && prev.playerEnergy < 80) {
            newState.playerEnergy = Math.min(100, prev.playerEnergy + 30);
            newState.playerStamina = Math.min(100, prev.playerStamina + 20);
            newState.score += 10;
            
            // Set rock cooldown
            newState.restRocks = prev.restRocks.map(rock =>
              rock.id === nearbyRock.id 
                ? { ...rock, occupied: true, available: false, cooldownRemaining: 30 }
                : rock
            );
          }
          break;

        case 'trigger-mushroom':
          if (prev.phase === 'mushroom-field' && mushroomFieldRef.current) {
            // Use the enhanced MushroomField's trigger mechanism
            const mushrooms = mushroomFieldRef.current.getMushrooms();
            const nearbyMushroom = mushrooms.find(mushroom =>
              Math.abs(mushroom.x - prev.playerPos.x) <= 2 &&
              Math.abs(mushroom.y - prev.playerPos.y) <= 2 &&
              !mushroom.triggered
            );

            if (nearbyMushroom) {
              // The MushroomField will handle the triggering internally
              console.log('[TrialsGameState] Player intentionally triggered mushroom', nearbyMushroom.id);
              newState.score += 50; // Bonus for intentional triggering
            }
          }
          break;

        case 'hide':
          // Reduce creature aggression
          newState.creatures = prev.creatures.map(creature => ({
            ...creature,
            aggressive: creature.aggressive && Math.random() > 0.3
          }));
          newState.playerEnergy = Math.max(0, prev.playerEnergy - 5);
          break;

        case 'sprint':
          if (prev.playerStamina >= 20) {
            newState.playerStamina = prev.playerStamina - 20;
            newState.playerEnergy = Math.max(0, prev.playerEnergy - 10);
            // Sprint effect handled in movement
          }
          break;

        case 'examine':
          // Add contextual information
          const examineHints = [...prev.hints];
          if (prev.phase === 'mushroom-field') {
            examineHints.push('You sense the mushrooms contain volatile energy...');
          }
          newState.hints = examineHints;
          break;
      }

      return newState;
    });
  }, [isPaused, isActive]);

  // Game loop
  useEffect(() => {
    if (!isActive || isPaused) {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      return;
    }

    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = now - lastUpdateTime.current;
      lastUpdateTime.current = now;

      setGameState(prev => {
        const newState = { ...prev };

        // Update time
        newState.timeRemaining = Math.max(0, prev.timeRemaining - deltaTime / 1000);

        // Update rest rock cooldowns
        newState.restRocks = prev.restRocks.map(rock => {
          if (rock.cooldownRemaining > 0) {
            const newCooldown = Math.max(0, rock.cooldownRemaining - deltaTime / 1000);
            return {
              ...rock,
              cooldownRemaining: newCooldown,
              available: newCooldown === 0,
              occupied: newCooldown > 0
            };
          }
          return rock;
        });

        // Update moving rocks only during rock-field phase (Asteroids-style)
        if (prev.phase === 'rock-field') {
          const width = 40;
            const height = 25;
            newState.movingRocks = prev.movingRocks.map(r => {
              let x = r.x + r.vx * (deltaTime / 1000);
              let y = r.y + r.vy * (deltaTime / 1000);
              // Wrap around edges for continuous field
              if (x < 0) x += width;
              if (x >= width) x -= width;
              if (y < 0) y += height;
              if (y >= height) y -= height;
              const angle = (r.angle + r.rotationSpeed * (deltaTime / 1000)) % (Math.PI * 2);
              return { ...r, x, y, angle };
            });
        } else {
          // Clear movingRocks for other phases to avoid unnecessary rendering
          if (prev.movingRocks.length) newState.movingRocks = [];
        }

        // Update creatures (basic AI for non-mushroom phases, sync with MushroomField for mushroom phase)
        if (prev.phase === 'mushroom-field' && mushroomFieldRef.current) {
          // Sync with enhanced MushroomField
          const fieldMushrooms = mushroomFieldRef.current.getMushrooms();
          const fieldCreatures = mushroomFieldRef.current.getAllCreatures();
          const fieldRocks = mushroomFieldRef.current.getRestRocks();
          
          newState.mushrooms = fieldMushrooms.map(m => ({
            id: m.id,
            x: m.x,
            y: m.y,
            triggered: m.triggered,
            glowing: Math.random() > 0.8 // Add some visual variety
          }));
          
          newState.creatures = fieldCreatures.map(c => ({
            id: c.id,
            x: c.x,
            y: c.y,
            health: c.health,
            aggressive: c.aggressive,
            type: 'six-legged-mutant' as const
          }));
          
          newState.restRocks = fieldRocks.map(r => ({
            id: r.id,
            x: r.x,
            y: r.y,
            occupied: r.occupied,
            available: Date.now() >= r.cooldownUntil,
            cooldownRemaining: Math.max(0, (r.cooldownUntil - Date.now()) / 1000)
          }));
          
          // Update MushroomField player position
          // (The MushroomField's internal logic will handle creature AI and triggering)
        } else {
          // Basic AI for other phases
          newState.creatures = prev.creatures.map(creature => {
            if (creature.aggressive) {
              // Move towards player
              const dx = prev.playerPos.x - creature.x;
              const dy = prev.playerPos.y - creature.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance > 0.5) {
                const speed = 0.02; // creatures move slower than player
                creature.x += (dx / distance) * speed * deltaTime;
                creature.y += (dy / distance) * speed * deltaTime;
              }

              // Random chance to become less aggressive
              if (Math.random() < 0.001) {
                creature.aggressive = false;
              }
            }

            return creature;
          });
        }

        // Check for creature collisions
        const playerCreatureDistance = newState.creatures.some(creature => {
          const dx = creature.x - prev.playerPos.x;
          const dy = creature.y - prev.playerPos.y;
          return Math.sqrt(dx * dx + dy * dy) < 1.5;
        });

        if (playerCreatureDistance) {
          newState.playerHealth = Math.max(0, prev.playerHealth - 1);
        }

        // Collisions with moving rocks (continuous damage scaled by deltaTime)
        if (prev.phase === 'rock-field' && prev.movingRocks.length) {
          const playerRadius = 0.5; // in tiles
          let collision = false;
          for (const rock of prev.movingRocks) {
            const dx = rock.x - prev.playerPos.x;
            const dy = rock.y - prev.playerPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const rockRadius = rock.size * 0.6; // approximate radius
            if (dist < playerRadius + rockRadius) {
              collision = true;
              break;
            }
          }
          if (collision) {
            // 10 health per second while colliding
            const damage = 10 * (deltaTime / 1000);
            newState.playerHealth = Math.max(0, prev.playerHealth - damage);
          }
        }

        // Regenerate energy slowly
        if (prev.playerEnergy < 100) {
          newState.playerEnergy = Math.min(100, prev.playerEnergy + 0.05);
        }

        // Regenerate stamina
        if (prev.playerStamina < 100) {
          newState.playerStamina = Math.min(100, prev.playerStamina + 0.1);
        }

        // Phase transitions
        if (prev.phaseProgress >= 100 && prev.phase === 'rock-field') {
          newState.phase = 'random-rocks';
          newState.phaseName = 'Random Rock Challenge';
          newState.phaseProgress = 0;
          newState.currentObjective = PHASE_OBJECTIVES['random-rocks'];
          newState.hints = PHASE_HINTS['random-rocks'];
          newState.achievements = [...prev.achievements, 'Rock Field Master'];
          newState.playerPos = { x: 2, y: 12 }; // Reset position
          newState.movingRocks = []; // clear asteroids
        } else if (prev.phaseProgress >= 100 && prev.phase === 'random-rocks') {
          newState.phase = 'mushroom-field';
          newState.phaseName = 'Mushroom Field Trials';
          newState.phaseProgress = 0;
          newState.currentObjective = PHASE_OBJECTIVES['mushroom-field'];
          newState.hints = PHASE_HINTS['mushroom-field'];
          newState.achievements = [...prev.achievements, 'Rock Dodger'];
          newState.playerPos = { x: 2, y: 12 };
          
          // Initialize the enhanced MushroomField
          mushroomFieldRef.current = new MushroomField();
          newState.mushrooms = mushroomFieldRef.current.getMushrooms().map(m => ({
            id: m.id,
            x: m.x,
            y: m.y,
            triggered: m.triggered,
            glowing: Math.random() > 0.7
          }));
          newState.restRocks = mushroomFieldRef.current.getRestRocks().map(r => ({
            id: r.id,
            x: r.x,
            y: r.y,
            occupied: r.occupied,
            available: Date.now() >= r.cooldownUntil,
            cooldownRemaining: Math.max(0, (r.cooldownUntil - Date.now()) / 1000)
          }));
        } else if (prev.phaseProgress >= 100 && prev.phase === 'mushroom-field') {
          newState.phase = 'climb-ascent';
          newState.phaseName = 'Cliff Ascent';
          newState.phaseProgress = 0;
          newState.currentObjective = PHASE_OBJECTIVES['climb-ascent'];
          newState.hints = PHASE_HINTS['climb-ascent'];
          newState.achievements = [...prev.achievements, 'Mushroom Survivor'];
          newState.playerPos = { x: 20, y: 24 };
          newState.climbGrip = 100;
        } else if (prev.phaseProgress >= 100 && prev.phase === 'climb-ascent') {
          newState.phase = 'cave-horrors';
          newState.phaseName = 'Cave of Horrors';
          newState.phaseProgress = 0;
          newState.currentObjective = PHASE_OBJECTIVES['cave-horrors'];
          newState.hints = PHASE_HINTS['cave-horrors'];
          newState.achievements = [...prev.achievements, 'Cliff Conqueror'];
          newState.playerPos = { x: 2, y: 22 };
          newState.echoRevealMs = 0;
          newState.confusion = false;
        } else if (prev.phaseProgress >= 100 && prev.phase === 'cave-horrors') {
          newState.phase = 'cave-maze';
          newState.phaseName = 'Cave Maze';
          newState.phaseProgress = 0;
          newState.currentObjective = PHASE_OBJECTIVES['cave-maze'];
          newState.hints = PHASE_HINTS['cave-maze'];
          newState.achievements = [...prev.achievements, 'Horror Endurer'];
          newState.playerPos = { x: 2, y: 22 };
        }

        // Game over conditions
        if (newState.timeRemaining <= 0 || newState.playerHealth <= 0) {
          setIsActive(false);
        }

        // Climb grip drain
        if (prev.phase === 'climb-ascent') {
          newState.climbGrip = Math.max(0, (prev.climbGrip ?? 100) - (deltaTime/1000)*2);
          if ((newState.climbGrip ?? 0) <= 0) newState.playerHealth = Math.max(0, prev.playerHealth - 5);
        }
        // Cave horrors effects
        if (prev.phase === 'cave-horrors') {
          if (prev.phaseProgress > 35 && prev.phaseProgress < 70 && !prev.confusion) newState.confusion = true;
          if (prev.confusion && prev.phaseProgress >= 70) newState.confusion = false;
          if ((prev.echoRevealMs ?? 0) > 0) newState.echoRevealMs = Math.max(0, (prev.echoRevealMs ?? 0) - deltaTime);
          if ((prev.echoRevealMs ?? 0) === 0 && Math.random() < 0.01) newState.playerHealth = Math.max(0, prev.playerHealth - 1);
        }
        return newState;
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [isActive, isPaused]);

  return {
    gameState,
    isPaused,
    isActive,
    startGame,
    stopGame,
    pauseGame,
    resumeGame,
    movePlayer,
    performAction
  };
}

// Simple string hash -> 32-bit unsigned int
function hashRunSeed(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
