/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  Canonical authored trap adapter.
  Static room metadata is the source of truth. This first slice only handles
  detection, search, disarm state and debug flags. Consequence handling remains
  outside this adapter until covered by tests.
*/

import type { Room } from '../types/Room';
import type { LocalGameState } from '../state/gameState';
import type { TerminalMessage } from '../components/TerminalConsole';

export type TrapKind = 'environmental' | 'magical' | 'mechanical' | 'narrative';
export type TrapSeverity = 'light' | 'moderate' | 'severe' | 'lethal';

export interface AuthoredTrap {
  id: string;
  type: TrapKind;
  severity: TrapSeverity;
  description: string;
  hidden?: boolean;
  disarmable?: boolean;
  disarmRequires?: string[];
  triggerOnEnter?: boolean;
  triggerOnCommand?: string[];
  successMessage?: string;
  failureMessage?: string;
  onceOnly?: boolean;
  flagOnDisarm?: string;
  flagOnTrigger?: string;
}

export interface TrapOutcome {
  trap?: AuthoredTrap;
  detected: boolean;
  disarmed: boolean;
  suppressedByDebug: boolean;
  messages: TerminalMessage[];
  updates?: Partial<LocalGameState>;
}

const severityRank: Record<TrapSeverity, number> = {
  light: 1,
  moderate: 2,
  severe: 3,
  lethal: 4,
};

const isObject = (value: unknown): value is Record<string, any> =>
  Boolean(value && typeof value === 'object' && !Array.isArray(value));

const flagsOf = (gameState: LocalGameState | any): Record<string, any> => ({
  ...(gameState?.flags || {}),
  ...(gameState?.gameFlags || {}),
});

const hasFlag = (gameState: LocalGameState | any, flag: string): boolean =>
  Boolean(flagsOf(gameState)[flag] ?? gameState?.player?.flags?.[flag]);

const disarmedFlag = (trapId: string) => `trap_disarmed_${trapId}`;
const resolvedFlag = (trapId: string) => `trap_resolved_${trapId}`;

function normaliseSeverity(value: unknown): TrapSeverity {
  if (value === 'light' || value === 'moderate' || value === 'severe' || value === 'lethal') {
    return value;
  }
  if (value === 'minor') return 'light';
  if (value === 'major') return 'severe';
  return 'moderate';
}

function normaliseType(value: unknown): TrapKind {
  if (value === 'environmental' || value === 'magical' || value === 'mechanical' || value === 'narrative') {
    return value;
  }
  return 'narrative';
}

function normaliseTrap(rawTrap: unknown, fallbackId: string): AuthoredTrap | null {
  if (!isObject(rawTrap)) return null;

  const id = typeof rawTrap.id === 'string' && rawTrap.id.trim() ? rawTrap.id : fallbackId;

  return {
    id,
    type: normaliseType(rawTrap.type),
    severity: normaliseSeverity(rawTrap.severity),
    description:
      typeof rawTrap.description === 'string' && rawTrap.description.trim()
        ? rawTrap.description
        : 'A risk-assessed trap waits here with suspicious administrative confidence.',
    hidden: Boolean(rawTrap.hidden),
    disarmable: rawTrap.disarmable !== false,
    disarmRequires: Array.isArray(rawTrap.disarmRequires) ? rawTrap.disarmRequires : undefined,
    triggerOnEnter: rawTrap.triggerOnEnter === true || rawTrap.condition === 'onEnter',
    triggerOnCommand: Array.isArray(rawTrap.triggerOnCommand) ? rawTrap.triggerOnCommand : undefined,
    successMessage: typeof rawTrap.successMessage === 'string' ? rawTrap.successMessage : undefined,
    failureMessage: typeof rawTrap.failureMessage === 'string' ? rawTrap.failureMessage : undefined,
    onceOnly: rawTrap.onceOnly !== false,
    flagOnDisarm: typeof rawTrap.flagOnDisarm === 'string' ? rawTrap.flagOnDisarm : undefined,
    flagOnTrigger: typeof rawTrap.flagOnTrigger === 'string' ? rawTrap.flagOnTrigger : undefined,
  };
}

export function getRoomTrapDefinitions(room: Room | any): AuthoredTrap[] {
  if (!room) return [];

  const traps: AuthoredTrap[] = [];

  if (Array.isArray(room.traps)) {
    room.traps.forEach((trap: unknown, index: number) => {
      const normalised = normaliseTrap(trap, `${room.id || 'room'}_trap_${index + 1}`);
      if (normalised) traps.push(normalised);
    });
  }

  const singleTrap = normaliseTrap(room.trap, `${room.id || 'room'}_trap`);
  if (singleTrap) traps.push(singleTrap);

  return traps;
}

function isTrapResolved(trap: AuthoredTrap, gameState: LocalGameState | any): boolean {
  return hasFlag(gameState, disarmedFlag(trap.id)) || hasFlag(gameState, resolvedFlag(trap.id)) || Boolean((trap as any).triggered);
}

export function getTrapForRoom(room: Room | any, gameState: LocalGameState | any): AuthoredTrap | null {
  return (
    getRoomTrapDefinitions(room)
      .filter((trap) => !isTrapResolved(trap, gameState))
      .sort((left, right) => severityRank[right.severity] - severityRank[left.severity])[0] || null
  );
}

function canDetectHidden(gameState: LocalGameState | any): boolean {
  const inventory = gameState?.player?.inventory || gameState?.inventory || [];
  const traits = gameState?.player?.traits || [];

  return (
    traits.includes('trap_expert') ||
    traits.includes('perceptive') ||
    traits.includes('alert') ||
    inventory.includes('trap_detector') ||
    inventory.includes('scanner') ||
    inventory.includes('magnifying_glass')
  );
}

function hasRequirement(gameState: LocalGameState | any, requirement: string): boolean {
  const inventory = gameState?.player?.inventory || gameState?.inventory || [];
  const traits = gameState?.player?.traits || [];
  const flags = flagsOf(gameState);

  return inventory.includes(requirement) || traits.includes(requirement) || Boolean(flags[requirement]);
}

function flagUpdates(gameState: LocalGameState | any, flags: Record<string, any>): Partial<LocalGameState> {
  return { flags: { ...flagsOf(gameState), ...flags } } as Partial<LocalGameState>;
}

export function detectTrap(room: Room | any, gameState: LocalGameState | any, activeSearch = false): TrapOutcome {
  const trap = getTrapForRoom(room, gameState);
  if (!trap) {
    return {
      detected: false,
      disarmed: false,
      suppressedByDebug: false,
      messages: [{ text: '🔍 You find no traps in this area. It appears safe.', type: 'system' }],
    };
  }

  if (trap.hidden && !activeSearch && !canDetectHidden(gameState)) {
    return { trap, detected: false, disarmed: false, suppressedByDebug: false, messages: [] };
  }

  return {
    trap,
    detected: true,
    disarmed: false,
    suppressedByDebug: false,
    messages: [
      {
        text: `${activeSearch ? '🔍 Searching carefully, you discover' : '⚠️ You notice'} a ${trap.severity} ${trap.type} trap: ${trap.description}`,
        type: trap.severity === 'lethal' ? 'error' : 'system',
      },
    ],
  };
}

export function searchTraps(room: Room | any, gameState: LocalGameState | any): TrapOutcome {
  return detectTrap(room, gameState, true);
}

export function attemptDisarmTrap(room: Room | any, gameState: LocalGameState | any): TrapOutcome {
  const trap = getTrapForRoom(room, gameState);
  if (!trap) {
    return {
      detected: false,
      disarmed: false,
      suppressedByDebug: false,
      messages: [{ text: 'There are no active traps here to disarm.', type: 'system' }],
    };
  }

  if (trap.disarmable === false) {
    return {
      trap,
      detected: true,
      disarmed: false,
      suppressedByDebug: false,
      messages: [
        {
          text: trap.failureMessage || 'This trap cannot be disarmed. The paperwork says no, and for once the paperwork is correct.',
          type: 'error',
        },
      ],
    };
  }

  const missing = (trap.disarmRequires || []).filter((requirement) => !hasRequirement(gameState, requirement));
  if (missing.length > 0) {
    return {
      trap,
      detected: true,
      disarmed: false,
      suppressedByDebug: false,
      messages: [{ text: `You cannot disarm this trap yet. Missing requirement: ${missing.join(', ')}.`, type: 'error' }],
    };
  }

  return {
    trap,
    detected: true,
    disarmed: true,
    suppressedByDebug: false,
    messages: [
      { text: trap.successMessage || '🔧 You disarm the trap. A tiny committee somewhere loses interest.', type: 'lore' },
      { text: '✅ The area is now safe to proceed.', type: 'system' },
    ],
    updates: flagUpdates(gameState, {
      [disarmedFlag(trap.id)]: true,
      ...(trap.flagOnDisarm ? { [trap.flagOnDisarm]: true } : {}),
    }),
  };
}

export function resolveTrapOnEntry(room: Room | any, gameState: LocalGameState | any): TrapOutcome {
  if (hasFlag(gameState, 'debug_traps_disabled')) {
    const trap = getTrapForRoom(room, gameState);
    return {
      trap: trap || undefined,
      detected: Boolean(trap),
      disarmed: false,
      suppressedByDebug: Boolean(trap),
      messages: trap ? [{ text: `[DEBUG] Trap suppressed: ${trap.id}.`, type: 'system' }] : [],
    };
  }

  if (hasFlag(gameState, 'debug_trap_warnings_only')) {
    return detectTrap(room, gameState, true);
  }

  return detectTrap(room, gameState, false);
}
