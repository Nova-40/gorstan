/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Trials Game State Hook - Manages the game state and provides interface controls
*/

import { useState, useEffect, useCallback, useRef } from 'react';
import { TrialsController } from '../mechanics/trials/TrialsController';
import { MushroomField } from '../mechanics/trials/MushroomField';

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
}

const PHASE_OBJECTIVES = {
  'rock-field': 'Navigate through the rock field safely. Rest at blue rocks to recover energy.',
  'random-rocks': 'Avoid falling rocks and reach the end. Watch for patterns in the chaos.',
  'mushroom-field':
    '🍄 Navigate the dense mushroom field! Stepping on mushrooms spawns WAVES of ravenous six-legged monsters. Use the 3 safety rocks strategically - creatures despawn near them. Reach the stream for ultimate safety! 🌊',
  'stream-reset': 'Avoid the Cleaners that reset your progress. Find alternative paths.',
  'cave-maze':
    'Navigate the procedural cave maze and find the hidden artifact to complete the trials.',
};

const PHASE_HINTS = {
  'rock-field': [
    'Blue rocks restore energy - use them when below 50%',
    'Moving diagonally can help avoid obstacles',
    'Energy depletes faster when moving through rough terrain',
  ],
  'random-rocks': [
    'Watch for safe spots between falling rocks',
    'Rocks fall in predictable patterns - observe before moving',
    'Sprint only when necessary to preserve stamina',
  ],
  'mushroom-field': [
    '🦂 Each mushroom spawns 6-11 coordinated creatures in a wave!',
    '🛡️ Safety rocks make creatures drowsy - they despawn after 20 seconds',
    '⚡ Chain reactions! Triggering one mushroom may trigger nearby ones',
    '🌊 The stream instantly despawns ALL creatures - your ultimate goal!',
    '🏃 Creatures move fast and coordinate - plan your route to safety rocks!',
    '💀 Avoid triggering multiple mushrooms - that means certain doom!',
  ],
  'stream-reset': [
    'Cleaners move in set patterns - learn their routes',
    'Getting caught by a Cleaner resets your progress',
    'Look for hidden passages around the main stream',
  ],
  'cave-maze': [
    'The artifact is hidden in a dead-end chamber',
    'Mark your path to avoid getting lost',
    'Some walls may be illusory - test suspicious areas',
  ],
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
    streamActive: false,
    timeRemaining: 600, // 10 minutes
    score: 0,
    achievements: [],
    currentObjective: PHASE_OBJECTIVES['rock-field'],
    hints: PHASE_HINTS['rock-field'],
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

    // Reset game state
    setGameState((prev) => ({
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
      timeRemaining: 600,
      score: 0,
      achievements: [],
      currentObjective: PHASE_OBJECTIVES['rock-field'],
      hints: PHASE_HINTS['rock-field'],
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
        cooldownRemaining: 0,
      });
    }
    return rocks;
  };

  // Player movement
  const movePlayer = useCallback(
    (direction: 'north' | 'south' | 'east' | 'west') => {
      if (isPaused || !isActive) {
        return;
      }

      setGameState((prev) => {
        const newPos = { ...prev.playerPos };

        switch (direction) {
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

        if (newPos.x > 35 && prev.phaseProgress < 100) {
          newPhaseProgress = 100;
          newScore += 100;
        } else {
          newPhaseProgress = Math.max(prev.phaseProgress, (newPos.x / 40) * 100);
        }

        return {
          ...prev,
          playerPos: newPos,
          playerEnergy: newEnergy,
          phaseProgress: newPhaseProgress,
          score: newScore,
        };
      });
    },
    [isPaused, isActive],
  );

  // Player actions
  const performAction = useCallback(
    (action: 'rest' | 'trigger-mushroom' | 'hide' | 'sprint' | 'examine') => {
      if (isPaused || !isActive) {
        return;
      }

      setGameState((prev) => {
        const newState = { ...prev };

        switch (action) {
          case 'rest':
            // Find nearby rest rock
            const nearbyRock = prev.restRocks.find(
              (rock) =>
                Math.abs(rock.x - prev.playerPos.x) <= 1 &&
                Math.abs(rock.y - prev.playerPos.y) <= 1 &&
                rock.available &&
                !rock.occupied,
            );

            if (nearbyRock && prev.playerEnergy < 80) {
              newState.playerEnergy = Math.min(100, prev.playerEnergy + 30);
              newState.playerStamina = Math.min(100, prev.playerStamina + 20);
              newState.score += 10;

              // Set rock cooldown
              newState.restRocks = prev.restRocks.map((rock) =>
                rock.id === nearbyRock.id
                  ? { ...rock, occupied: true, available: false, cooldownRemaining: 30 }
                  : rock,
              );
            }
            break;

          case 'trigger-mushroom':
            if (prev.phase === 'mushroom-field' && mushroomFieldRef.current) {
              // Use the enhanced MushroomField's trigger mechanism
              const mushrooms = mushroomFieldRef.current.getMushrooms();
              const nearbyMushroom = mushrooms.find(
                (mushroom) =>
                  Math.abs(mushroom.x - prev.playerPos.x) <= 2 &&
                  Math.abs(mushroom.y - prev.playerPos.y) <= 2 &&
                  !mushroom.triggered,
              );

              if (nearbyMushroom) {
                // The MushroomField will handle the triggering internally
                console.log(
                  '[TrialsGameState] Player intentionally triggered mushroom',
                  nearbyMushroom.id,
                );
                newState.score += 50; // Bonus for intentional triggering
              }
            }
            break;

          case 'hide':
            // Reduce creature aggression
            newState.creatures = prev.creatures.map((creature) => ({
              ...creature,
              aggressive: creature.aggressive && Math.random() > 0.3,
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
    },
    [isPaused, isActive],
  );

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

      setGameState((prev) => {
        const newState = { ...prev };

        // Update time
        newState.timeRemaining = Math.max(0, prev.timeRemaining - deltaTime / 1000);

        // Update rest rock cooldowns
        newState.restRocks = prev.restRocks.map((rock) => {
          if (rock.cooldownRemaining > 0) {
            const newCooldown = Math.max(0, rock.cooldownRemaining - deltaTime / 1000);
            return {
              ...rock,
              cooldownRemaining: newCooldown,
              available: newCooldown === 0,
              occupied: newCooldown > 0,
            };
          }
          return rock;
        });

        // Update creatures (basic AI for non-mushroom phases, sync with MushroomField for mushroom phase)
        if (prev.phase === 'mushroom-field' && mushroomFieldRef.current) {
          // Sync with enhanced MushroomField
          const fieldMushrooms = mushroomFieldRef.current.getMushrooms();
          const fieldCreatures = mushroomFieldRef.current.getAllCreatures();
          const fieldRocks = mushroomFieldRef.current.getRestRocks();

          newState.mushrooms = fieldMushrooms.map((m) => ({
            id: m.id,
            x: m.x,
            y: m.y,
            triggered: m.triggered,
            glowing: Math.random() > 0.8, // Add some visual variety
          }));

          newState.creatures = fieldCreatures.map((c) => ({
            id: c.id,
            x: c.x,
            y: c.y,
            health: c.health,
            aggressive: c.aggressive,
            type: 'six-legged-mutant' as const,
          }));

          newState.restRocks = fieldRocks.map((r) => ({
            id: r.id,
            x: r.x,
            y: r.y,
            occupied: r.occupied,
            available: Date.now() >= r.cooldownUntil,
            cooldownRemaining: Math.max(0, (r.cooldownUntil - Date.now()) / 1000),
          }));

          // Update MushroomField player position
          // (The MushroomField's internal logic will handle creature AI and triggering)
        } else {
          // Basic AI for other phases
          newState.creatures = prev.creatures.map((creature) => {
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
        const playerCreatureDistance = newState.creatures.some((creature) => {
          const dx = creature.x - prev.playerPos.x;
          const dy = creature.y - prev.playerPos.y;
          return Math.sqrt(dx * dx + dy * dy) < 1.5;
        });

        if (playerCreatureDistance) {
          newState.playerHealth = Math.max(0, prev.playerHealth - 1);
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
          newState.mushrooms = mushroomFieldRef.current.getMushrooms().map((m) => ({
            id: m.id,
            x: m.x,
            y: m.y,
            triggered: m.triggered,
            glowing: Math.random() > 0.7,
          }));
          newState.restRocks = mushroomFieldRef.current.getRestRocks().map((r) => ({
            id: r.id,
            x: r.x,
            y: r.y,
            occupied: r.occupied,
            available: Date.now() >= r.cooldownUntil,
            cooldownRemaining: Math.max(0, (r.cooldownUntil - Date.now()) / 1000),
          }));
        }

        // Game over conditions
        if (newState.timeRemaining <= 0 || newState.playerHealth <= 0) {
          setIsActive(false);
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
    performAction,
  };
}
