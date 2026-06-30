/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  You may play Gorstan for free for personal entertainment only.
  You may NOT copy, redistribute, modify, or sell the game, its code, 
  artwork, storyline, or any other part without written permission.
  
  Gorstan includes third-party libraries and assets:
    - React © Meta Platforms, Inc. – MIT Licence
    - Lucide Icons © Lucide Contributors – ISC Licence
    - Other packages under their respective licences (see package.json)

  Full licence terms: see EULA.md in the project root.
*/

// Gorstan and characters (c) Geoff Webster 2025
// Compatibility adapter for trap detection. New behaviour routes through the canonical authored trap engine.

import { LocalGameState } from '../state/gameState';
import { Room } from '../types/Room';
import {
  detectTrap,
  searchTraps,
  getTrapForRoom,
} from './canonicalTrapEngine';

export interface TrapDetectionResult {
  detected: boolean;
  warning?: string;
  canDisarm?: boolean;
  detectionMethod?: string;
  severity?: 'low' | 'medium' | 'high' | 'extreme';
}

function getSeverityLevel(trapSeverity: string | undefined): 'low' | 'medium' | 'high' | 'extreme' {
  switch (trapSeverity) {
    case 'minor':
    case 'light':
      return 'low';
    case 'moderate':
      return 'medium';
    case 'major':
    case 'severe':
      return 'high';
    case 'lethal':
      return 'extreme';
    default:
      return 'medium';
  }
}

function toDetectionResult(
  outcome: ReturnType<typeof detectTrap>,
  fallbackMethod: string,
): TrapDetectionResult {
  if (!outcome.detected || !outcome.trap) {
    return { detected: false };
  }

  return {
    detected: true,
    warning: outcome.messages.map((message) => message.text).join('\n'),
    canDisarm: outcome.trap.disarmable !== false,
    detectionMethod: fallbackMethod,
    severity: getSeverityLevel(outcome.trap.severity),
  };
}

/**
 * Check for traps when entering a room and provide appropriate warnings.
 */
export function detectTrapsOnEntry(room: Room, gameState: LocalGameState): TrapDetectionResult {
  return toDetectionResult(detectTrap(room, gameState, false), 'canonical_entry');
}

/**
 * Allow players to actively search for traps.
 */
export function searchForTraps(room: Room, gameState: LocalGameState): TrapDetectionResult {
  const outcome = searchTraps(room, gameState);

  if (!outcome.detected) {
    return {
      detected: false,
      warning: outcome.messages[0]?.text || '🔍 **Searching carefully...** You find no traps in this area. It appears safe.',
    };
  }

  return toDetectionResult(outcome, 'active_search');
}

/**
 * Check if player can disarm a detected trap.
 * Kept for commandParser compatibility. The canonical disarm operation lives in canonicalTrapEngine.
 */
export function canPlayerDisarmTrap(
  trap: any,
  playerTraits: string[],
  playerItems: string[],
): { canDisarm: boolean; method?: string; chance?: number } {
  if (trap?.disarmable === false) {
    return { canDisarm: false };
  }

  const requirements = Array.isArray(trap?.disarmRequires) ? trap.disarmRequires : [];
  const hasAllRequirements = requirements.every((requirement: string) =>
    playerTraits.includes(requirement) || playerItems.includes(requirement),
  );

  if (!hasAllRequirements) {
    return { canDisarm: false };
  }

  return {
    canDisarm: true,
    method: requirements.length > 0 ? requirements.join(', ') : 'careful inspection',
    chance: 1,
  };
}

export function hasCanonicalTrap(room: Room, gameState: LocalGameState): boolean {
  return Boolean(getTrapForRoom(room, gameState));
}
