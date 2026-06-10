/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  You may play Gorstan for free for personal entertainment only.
  You may NOT copy, redistribute, modify, or sell the game, its code, 
  artwork, storyline, or any other part without written permission.
  
  Gorstan includes third-party libraries and assets:
    - React © Meta Platforms, Inc. – MIT Licence
    - Lucide Icons © Lucide Contributors – ISC Licence
    - Flaticon icons © Flaticon.com – Free Licence with attribution
    - Other packages under their respective licences (see package.json)

  Full licence terms: see EULA.md in the project root.
*/

// Gorstan and characters (c) Geoff Webster 2025
// Parses and processes player commands.

import { Room, RoomItem } from '../types/Room';
import { TerminalMessage } from '../components/TerminalConsole';

import { resolveBlueButtonPress } from './buttonPress';
import { handleCrossingInteraction, resetCrossingState } from './crossingController';
import { resolveDominicPickupAttempt } from './dominicPickupConversation';
import { searchForTraps, canPlayerDisarmTrap } from './trapDetection';
import {
  disarmTrap as disarmProceduralTrap,
  getTrapByRoom,
  resetTrap as resetProceduralTrap,
  triggerTrap as triggerProceduralTrap,
} from './trapController';
import { LocalGameState } from '../state/gameState';
import { getCanonicalHotspots } from './worldModel';

function normaliseLookupValue(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function resolveInputAlias(input: string): string {
  const trimmedInput = input.toLowerCase().trim();
  const directAlias = aliases[trimmedInput];

  if (directAlias) {
    return directAlias;
  }

  const prefixAlias = Object.entries(aliases)
    .sort((left, right) => right[0].length - left[0].length)
    .find(([alias]) => trimmedInput.startsWith(`${alias} `));

  if (!prefixAlias) {
    return trimmedInput;
  }

  const [alias, replacement] = prefixAlias;
  return `${replacement} ${trimmedInput.slice(alias.length + 1)}`.trim();
}

function findRoomItem(currentRoom: Room, noun: string): { inventoryName: string; roomValue: string | RoomItem } | null {
  if (!noun || !currentRoom.items?.length) {
    return null;
  }

  const wanted = normaliseLookupValue(noun);

  for (const item of currentRoom.items) {
    if (typeof item === 'string') {
      if (normaliseLookupValue(item) === wanted) {
        return { inventoryName: item, roomValue: item };
      }
      continue;
    }

    const candidateNames = [item.name, item.id].filter((value): value is string => Boolean(value));
    if (candidateNames.some((value) => normaliseLookupValue(value) === wanted)) {
      return { inventoryName: item.name || item.id, roomValue: item };
    }
  }

  return null;
}

function resolveRoomId(gameState: LocalGameState, rawTarget: string): string | null {
  if (!rawTarget) {
    return null;
  }

  const wanted = normaliseLookupValue(rawTarget);

  for (const [roomId, room] of Object.entries(gameState.roomMap || {})) {
    const labels = [roomId, room.id, room.title, (room as Record<string, unknown>).name]
      .filter((value): value is string => typeof value === 'string' && value.length > 0);

    if (labels.some((value) => normaliseLookupValue(value) === wanted)) {
      return roomId;
    }
  }

  return null;
}

function withAchievement(metadata: LocalGameState['metadata'], achievementId: string) {
  const existing = metadata?.achievements || [];
  if (existing.includes(achievementId)) {
    return metadata;
  }

  return {
    ...metadata,
    achievements: [...existing, achievementId],
  };
}

function canUseDebugCommands(gameState: LocalGameState): boolean {
  return Boolean(gameState.settings?.debugMode) || gameState.player?.name === 'Geoff';
}

function getStaticTrap(currentRoom: Room): any | null {
  const roomTraps = currentRoom.traps?.filter((trap: any) => !trap.triggered) || [];
  return roomTraps[0] || null;
}

function getTrapSeverityLabel(trap: any): string {
  return trap?.severity || 'dangerous';
}

function updateStaticTrapState(
  currentRoom: Room,
  gameState: LocalGameState,
  trapId: string,
  patch: (trap: any) => any,
): Partial<LocalGameState> {
  const updatedRoom = {
    ...currentRoom,
    traps:
      currentRoom.traps?.map((trap: any) =>
        trap.id === trapId
          ? patch(trap)
          : trap,
      ) || [],
  };

  return {
    roomMap: {
      ...gameState.roomMap,
      [currentRoom.id]: updatedRoom,
    },
  };
}

function buildStaticTrapTriggerResult(currentRoom: Room, gameState: LocalGameState, trap: any): CommandResult {
  const damage = trap.effect?.damage || trap.damage || 0;
  const nextHealth = Math.max(0, (gameState.player.health || 100) - damage);
  const nextFlags = { ...gameState.flags };

  if (trap.effect?.flagsSet) {
    trap.effect.flagsSet.forEach((flagName: string) => {
      nextFlags[flagName] = true;
    });
  }

  return {
    messages: [
      { text: `⚠️ Trap triggered: ${trap.description || 'A hidden mechanism snaps into action.'}`, type: 'error' },
      ...(damage > 0
        ? [{ text: `You take ${damage} damage! Health: ${nextHealth}`, type: 'error' as const }]
        : []),
    ],
    updates: {
      flags: nextFlags,
      player: {
        ...gameState.player,
        health: nextHealth,
      },
      ...updateStaticTrapState(currentRoom, gameState, trap.id, (existingTrap: any) => ({
        ...existingTrap,
        triggered: true,
      })),
    },
  };
}

function getTrapInspectionMessage(currentRoom: Room, gameState: LocalGameState): CommandResult {
  const proceduralTrap = getTrapByRoom(currentRoom.id);
  if (proceduralTrap && !proceduralTrap.triggered) {
    const disarmability = proceduralTrap.disarmable ? 'It looks disarmable.' : 'It does not look safely disarmable.';
    return {
      messages: [
        {
          text: `You inspect the trap: ${proceduralTrap.description}. ${disarmability}`,
          type: 'info',
        },
      ],
    };
  }

  const staticTrap = getStaticTrap(currentRoom);
  if (staticTrap) {
    const disarmResult = canPlayerDisarmTrap(
      staticTrap,
      gameState.player.traits || [],
      gameState.player.inventory || [],
    );

    return {
      messages: [
        {
          text: `You inspect the trap: ${staticTrap.description || 'A dangerous mechanism blocks your path.'}`,
          type: 'info',
        },
        {
          text: disarmResult.canDisarm
            ? `It may be disarmed with ${disarmResult.method || 'careful handling'}${disarmResult.chance ? ` (${Math.round(disarmResult.chance * 100)}% chance)` : ''}.`
            : 'You do not yet have the skills or tools to safely disarm it.',
          type: disarmResult.canDisarm ? 'system' : 'error',
        },
      ],
    };
  }

  return { messages: [{ text: 'There is no active trap here to inspect.', type: 'error' }] };
}

/**
 * CommandParserParams interface for processing commands
 */
export interface CommandParserParams {
  input: string;
  currentRoom: Room;
  gameState: LocalGameState;
}

/**
 * CommandResult interface for processing outcomes
 */
export interface CommandResult {
  messages: TerminalMessage[];
  updates?: Partial<LocalGameState>;
}

/**
 * Aliases for common commands
 */
const aliases: Record<string, string> = {
  grab: 'pick up',
  take: 'pick up',
  get: 'pick up',
  examine: 'inspect',
  look: 'inspect',
  read: 'inspect',
  toss: 'drop',
  throw: 'drop',
  discard: 'drop',
  move: 'go',
  walk: 'go',
  travel: 'go',
  inv: 'inventory',
  i: 'inventory',
  items: 'inventory',
  talk: 'speak',
  chat: 'speak',
  ask: 'speak',
  hint: 'ayla',
  guidance: 'ayla',
  detect: 'search',
  find: 'search',
  'look for': 'search',
  'check for': 'search',
  n: 'go north',
  s: 'go south',
  e: 'go east',
  w: 'go west',
  u: 'go up',
  d: 'go down',
};

const DIRECTION_COMMANDS = new Set(['north', 'south', 'east', 'west', 'up', 'down']);

function findInspectableTarget(currentRoom: Room, noun: string): { label: string; description?: string } | null {
  if (!noun) {
    return null;
  }

  const lowered = noun.toLowerCase();
  const itemMatch = currentRoom.items?.find((item) => {
    const name = typeof item === 'string' ? item : item.name;
    return name.toLowerCase() === lowered;
  });

  if (itemMatch) {
    return {
      label: typeof itemMatch === 'string' ? itemMatch : itemMatch.name,
      description: typeof itemMatch === 'string' ? undefined : itemMatch.description,
    };
  }

  const hotspotMatch = getCanonicalHotspots(currentRoom).find(
    (hotspot) => hotspot.label.toLowerCase() === lowered || hotspot.id === lowered,
  );

  if (hotspotMatch) {
    return {
      label: hotspotMatch.label,
      description: hotspotMatch.description,
    };
  }

  return null;
}

/**
 * Parses and processes player commands
 */
export function processCommand({
  input,
  currentRoom,
  gameState,
}: CommandParserParams): CommandResult {
  // Validate input parameter
  if (!input || typeof input !== 'string') {
    return {
      messages: [{ text: 'Invalid command input.', type: 'error' }],
    };
  }

  const trimmedOriginalInput = input.trim();
  const resolvedInput = resolveInputAlias(input);
  const commandParts = resolvedInput.split(' ');
  const verb = commandParts[0];
  const noun = commandParts.slice(1).join(' ');

  if (DIRECTION_COMMANDS.has(verb)) {
    return processCommand({
      input: `go ${verb}`,
      currentRoom,
      gameState,
    });
  }

  const messages: TerminalMessage[] = [];
  let updates: Partial<LocalGameState> = {};

  switch (verb) {
    case 'go':
    case 'move': {
      const direction = noun;
      if (currentRoom.exits && currentRoom.exits[direction]) {
        const targetRoomId = currentRoom.exits[direction];
        const targetRoom = gameState.roomMap[targetRoomId];

        if (!targetRoom) {
          return {
            messages: [
              {
                text: `The exit marked "${direction}" resolves to "${targetRoomId}", but that room is not currently loaded.`,
                type: 'error',
              },
            ],
          };
        }

        messages.push({ text: `You go ${direction}.`, type: 'info' });
        updates = {
          currentRoomId: targetRoomId,
          player: {
            ...gameState.player,
            currentRoom: targetRoomId,
          },
        };

        const entryResult = processRoomEntry(targetRoom, gameState);
        messages.push(...entryResult.messages);
        if (entryResult.updates) {
          updates = { ...updates, ...entryResult.updates };
        }

        return { messages, updates };
      }
      return { messages: [{ text: "You can't go that way.", type: 'error' }] };
    }

    case 'ally': {
      // Handle alliance choices
      if (gameState.flags?.awaitingAllianceChoice) {
        // Import and use the group chat logic
        const { GroupChatManager } = require('../npc/groupChatLogic');
        const context = {
          state: gameState,
          dispatch: (action: any) => {
            // Apply the action to updates
            if (action.type === 'SET_FLAG') {
              updates.flags = { ...gameState.flags, [action.payload.flag]: action.payload.value };
            }
          },
          roomId: gameState.currentRoomId,
          npcsInRoom: gameState.npcsInRoom,
        };

        const wasProcessed = GroupChatManager.processAllianceChoice(input, context);
        if (wasProcessed) {
          return {
            messages: [{ text: `You consider your alliance carefully...`, type: 'lore' }],
            updates,
          };
        }
      }

      return {
        messages: [{ text: 'You can choose an ally when the opportunity arises.', type: 'info' }],
      };
    }

    case 'cost':
    case 'price': {
      // Handle asking about Morthos's cost
      if (gameState.flags?.alliancePitchStarted && !gameState.flags?.allianceChosen) {
        const hasAl = gameState.npcsInRoom.some((npc) => npc.id === 'al');
        const hasMorthos = gameState.npcsInRoom.some((npc) => npc.id === 'morthos');

        if (hasAl && hasMorthos) {
          const { GroupChatManager } = require('../npc/groupChatLogic');
          const context = {
            state: gameState,
            dispatch: (action: any) => {
              if (action.type === 'SET_FLAG') {
                updates.flags = { ...gameState.flags, [action.payload.flag]: action.payload.value };
              }
            },
            roomId: gameState.currentRoomId,
            npcsInRoom: gameState.npcsInRoom,
          };

          GroupChatManager.handleMorthosCostInquiry(context);
          return {
            messages: [
              { text: 'You press Morthos about the cost of his alliance...', type: 'lore' },
            ],
            updates,
          };
        }
      }

      return {
        messages: [{ text: "You're not sure what you're asking about the cost of.", type: 'info' }],
      };
    }

    case 'inspect':
    case 'look': {
      if (noun === 'trap') {
        return getTrapInspectionMessage(currentRoom, gameState);
      }

      const target = findInspectableTarget(currentRoom, noun);
      if (target) {
        return {
          messages: [
            {
              text: target.description || `You study the ${target.label}, but it remains inscrutable.`,
              type: 'lore',
            },
          ],
        };
      }

      const descriptionLines = Array.isArray(currentRoom.description)
        ? currentRoom.description
        : [currentRoom.description];

      messages.push(
        { text: `--- ${currentRoom.title} ---`, type: 'lore' },
        ...descriptionLines.map((line) => ({ text: line, type: 'lore' as const })),
      );

      if (currentRoom.items && currentRoom.items.length > 0) {
        messages.push({ text: 'You see:', type: 'info' });
        currentRoom.items.forEach((item) => {
          const itemName = typeof item === 'string' ? item : item.name;
          messages.push({ text: `- ${itemName}`, type: 'info' });
        });
      }

      if (currentRoom.npcs && currentRoom.npcs.length > 0) {
        messages.push({ text: 'People here:', type: 'info' });
        currentRoom.npcs.forEach((npc) => {
          messages.push({ text: `- ${npc}`, type: 'info' });
        });
      }

      if (currentRoom.exits && Object.keys(currentRoom.exits).length > 0) {
        messages.push({ text: 'Exits:', type: 'info' });
        Object.keys(currentRoom.exits).forEach((exit) => {
          messages.push({ text: `- ${exit}`, type: 'info' });
        });
      }

      return { messages };
    }

    case 'inventory': {
      if (gameState.player.inventory.length === 0) {
        return { messages: [{ text: 'You are not carrying anything.', type: 'info' }] };
      }
      return {
        messages: [
          { text: 'You are carrying:', type: 'info' },
          ...gameState.player.inventory.map((item) => ({
            text: `- ${item}`,
            type: 'info' as const,
          })),
        ],
      };
    }

    case 'use': {
      if (!noun) {
        return { messages: [{ text: 'What do you want to use?', type: 'error' }] };
      }

      if (noun.includes(' with ')) {
        const [rawItem, rawTarget] = noun.split(' with ');
        const item = rawItem.trim();
        const target = rawTarget.trim();

        if (!gameState.player.inventory.includes(item)) {
          return { messages: [{ text: `You don't have a ${item} to use.`, type: 'error' }] };
        }

        if (
          (item === 'batteries' && target === 'torch') ||
          (item === 'torch' && target === 'batteries')
        ) {
          if (gameState.flags?.batteriesInserted) {
            return {
              messages: [{ text: 'You insert the batteries into the torch. It flickers to life.', type: 'info' }],
              updates: {
                flags: {
                  ...gameState.flags,
                  torchReady: true,
                },
              },
            };
          }

          return {
            messages: [{ text: 'You need to insert the batteries first.', type: 'error' }],
          };
        }

        return {
          messages: [{ text: `You try using the ${item} with the ${target}.`, type: 'info' }],
        };
      }

      if (!gameState.player.inventory.includes(noun)) {
        return { messages: [{ text: `You don't have a ${noun} to use.`, type: 'error' }] };
      }

      if (noun === 'batteries') {
        return {
          messages: [{ text: 'You insert the batteries.', type: 'info' }],
          updates: {
            flags: {
              ...gameState.flags,
              batteriesInserted: true,
            },
          },
        };
      }

      messages.push({ text: `You use the ${noun}.`, type: 'info' });
      return { messages };
    }

    case 'pick': {
      const requestedItem = noun === 'up' ? '' : noun.startsWith('up ') ? noun.slice(3).trim() : noun;

      if (!requestedItem) {
        return { messages: [{ text: 'What do you want to pick up?', type: 'error' }] };
      }

      const roomItem = findRoomItem(currentRoom, requestedItem);
      if (!roomItem) {
        return {
          messages: [{ text: `There is no ${requestedItem} here to pick up.`, type: 'error' }],
        };
      }

      if (gameState.player.inventory.includes(roomItem.inventoryName)) {
        return {
          messages: [{ text: `You already have ${roomItem.inventoryName}.`, type: 'info' }],
        };
      }

      if (
        normaliseLookupValue(roomItem.inventoryName) === 'dominic' &&
        currentRoom.id === 'dalesapartment'
      ) {
        const outcome = resolveDominicPickupAttempt(gameState);

        if (!outcome.completePickup) {
          return {
            messages: outcome.messages.map((text) => ({ text, type: text.startsWith('*DOMINIC') ? 'lore' : 'info' })),
            updates: {
              flags: outcome.nextFlags,
            },
          };
        }

        const dominicRoomUpdates =
          currentRoom.items?.length && typeof currentRoom.items[0] === 'string'
            ? (currentRoom.items as string[]).filter((item) => item !== roomItem.roomValue)
            : (currentRoom.items as RoomItem[]).filter(
                (item) => item.id !== (roomItem.roomValue as RoomItem).id,
              );

        return {
          messages: outcome.messages.map((text) => ({ text, type: text.startsWith('*DOMINIC') ? 'lore' : 'info' })),
          updates: {
            flags: outcome.nextFlags,
            player: {
              ...gameState.player,
              inventory: [...gameState.player.inventory, 'deadfish'],
            },
            roomMap: {
              ...gameState.roomMap,
              [currentRoom.id]: {
                ...currentRoom,
                items: dominicRoomUpdates,
              },
            },
          },
        };
      }

      let updatedItems: Room['items'];

      if (currentRoom.items?.length && typeof currentRoom.items[0] === 'string') {
        updatedItems = (currentRoom.items as string[]).filter((item) => item !== roomItem.roomValue);
      } else {
        const matchedItem = roomItem.roomValue as RoomItem;
        updatedItems = (currentRoom.items as RoomItem[]).filter(
          (item) => item.id !== matchedItem.id && item.name !== matchedItem.name,
        );
      }

      const updatedFlags = { ...gameState.flags };

      if (normaliseLookupValue(roomItem.inventoryName) === 'runbag') {
        updatedFlags.hasRunbag = true;
      }

      return {
        messages: [{ text: `You pick up ${roomItem.inventoryName}.`, type: 'info' }],
        updates: {
          flags: updatedFlags,
          player: {
            ...gameState.player,
            inventory: [...gameState.player.inventory, roomItem.inventoryName],
          },
          roomMap: {
            ...gameState.roomMap,
            [currentRoom.id]: {
              ...currentRoom,
              items: updatedItems,
            },
          },
        },
      };
    }

    case 'press': {
      if (currentRoom.id === 'introreset' || noun === 'button' || noun === 'blue button') {
        const outcome = resolveBlueButtonPress(gameState);
        return {
          messages: outcome.nextState.history.slice(gameState.history.length).map((message) => ({
            text: message.text,
            type:
              message.type === 'error' || message.type === 'warning'
                ? 'error'
                : message.type === 'narrative' || message.type === 'dialogue'
                  ? 'lore'
                  : 'info',
          })),
          updates: {
            flags: outcome.nextState.flags,
            player: outcome.nextState.player,
          },
        };
      }

      if (noun === 'reboot') {
        return processCommand({
          input: 'start reboot',
          currentRoom,
          gameState,
        });
      }

      return {
        messages: [{ text: 'You press something, but nothing happens.', type: 'info' }],
      };
    }

    case 'start': {
      if (noun !== 'reboot') {
        break;
      }

      if (gameState.flags?.multiverse_reboot_pending || gameState.flags?.multiverse_reboot_active) {
        return {
          messages: [{ text: 'The reboot sequence is already underway.', type: 'info' }],
        };
      }

      return {
        messages: [{ text: 'Reality shudders. A multiverse reboot sequence begins.', type: 'system' }],
        updates: {
          flags: {
            ...gameState.flags,
            multiverse_reboot_pending: true,
          },
        },
      };
    }

    case 'confirm': {
      if (noun !== 'reboot') {
        break;
      }

      if (!gameState.flags?.multiverse_reboot_pending) {
        return {
          messages: [{ text: 'There is no reboot waiting to be confirmed.', type: 'error' }],
        };
      }

      return {
        messages: [{ text: 'Reboot confirmation accepted. Hold on to whatever still feels real.', type: 'system' }],
        updates: {
          flags: {
            ...gameState.flags,
            multiverse_reboot_pending: true,
            multiverse_reboot_active: true,
            show_reset_sequence: true,
          },
        },
      };
    }

    case 'complete': {
      if (noun !== 'reboot') {
        break;
      }

      if (!gameState.flags?.multiverse_reboot_active) {
        return {
          messages: [{ text: 'The reboot sequence is not active.', type: 'error' }],
        };
      }

      return {
        messages: [
          { text: 'You awaken with a faint sense of déjà vu. The multiverse has been rebooted.', type: 'lore' },
        ],
        updates: {
          currentRoomId: 'introstart',
          metadata: withAchievement(gameState.metadata, 'multiverse_rebooter'),
          player: {
            ...gameState.player,
            currentRoom: 'introstart',
            flags: {
              ...gameState.player.flags,
              bluePressCount: 0,
            },
          },
          flags: {
            ...gameState.flags,
            multiverse_reboot_pending: false,
            multiverse_reboot_active: false,
            show_reset_sequence: false,
          },
        },
      };
    }

    case 'cancel': {
      if (noun !== 'reboot') {
        break;
      }

      if (!gameState.flags?.multiverse_reboot_pending && !gameState.flags?.multiverse_reboot_active) {
        return {
          messages: [{ text: 'No reboot is currently in progress.', type: 'error' }],
        };
      }

      return {
        messages: [{ text: 'The reboot sequence is cancelled.', type: 'system' }],
        updates: {
          flags: {
            ...gameState.flags,
            multiverse_reboot_pending: false,
            multiverse_reboot_active: false,
            show_reset_sequence: false,
          },
        },
      };
    }

    case 'help':
    case 'about':
    case 'instructions': {
      const helpMessages: TerminalMessage[] = [
        { text: '--- Gorstan Beta 4 Field Briefing ---', type: 'system' },
        { text: 'This is a parser-first illustrated adventure. Type commands; click mapped room controls when available. Both routes go through the same command parser, because dual paperwork is how realities collapse.', type: 'system' },
        { text: 'look / inspect [thing] - Inspect the room, an item, a hotspot, or a suspiciously confident machine.', type: 'system' },
        { text: 'go [direction] - Move through an exit. Direction buttons and exit interactions issue the same movement commands.', type: 'system' },
        { text: 'take [item] / inventory / use [item] - Manage what you are carrying.', type: 'system' },
        { text: 'talk to [npc] - Start a conversation if someone is present. Ayla may be helpful, which she will deny for procedural reasons.', type: 'system' },
        { text: 'status - Show current room, route state, and exits.', type: 'system' },
        { text: 'save/load - Use the save modal. If a save is missing or malformed, Gorstan should complain politely and continue.', type: 'system' },
        { text: 'debug hotspots - Toggle hotspot outlines where debug mode is enabled or you are repairing reality with a ruler.', type: 'system' },
      ];

      return { messages: helpMessages };
    }

    case 'speak': {
      if (!noun) {
        if (gameState.npcsInRoom && gameState.npcsInRoom.length > 0) {
          const npcNames = gameState.npcsInRoom
            .map((npc: any) => (typeof npc === 'string' ? npc : npc.name))
            .join(', ');
          return {
            messages: [
              { text: 'Who do you want to talk to?', type: 'info' },
              { text: `Available: ${npcNames}`, type: 'info' },
              { text: 'Use: talk [name] or click on them directly', type: 'info' },
            ],
          };
        } else {
          return { messages: [{ text: 'There is no one here to talk to.', type: 'error' }] };
        }
      }

      const npcQuery = noun.startsWith('to ') ? noun.slice(3).trim() : noun;

      // Check if the specified NPC is in the room
      const targetNPC = gameState.npcsInRoom?.find((npc: any) => {
        const name = typeof npc === 'string' ? npc : npc.name;
        return name.toLowerCase().includes(npcQuery.toLowerCase());
      });

      if (!targetNPC) {
        return {
          messages: [{ text: `You don't see anyone named "${npcQuery}" here.`, type: 'error' }],
        };
      }

      // Return a special message that AppCore can intercept to open the NPC console
      return {
        messages: [
          {
            text: `Opening conversation with ${typeof targetNPC === 'string' ? targetNPC : targetNPC.name}...`,
            type: 'info',
          },
        ],
        updates: {
          flags: {
            ...gameState.flags,
            openNPCConsole: typeof targetNPC === 'string' ? targetNPC : targetNPC.id,
          },
        },
      };
    }

    // Debug commands (dev mode only)
    case 'test': {
      if (noun === 'fractal' && gameState.settings?.debugMode) {
        return {
          messages: [{ text: 'Triggering fractal teleport overlay test...', type: 'system' }],
          updates: {
            flags: {
              ...gameState.flags,
              triggerTeleport: 'fractal',
            },
          },
        };
      }
      if (noun === 'trek' && gameState.settings?.debugMode) {
        return {
          messages: [{ text: 'Triggering trek teleport overlay test...', type: 'system' }],
          updates: {
            flags: {
              ...gameState.flags,
              triggerTeleport: 'trek',
            },
          },
        };
      }
      return { messages: [{ text: 'test fractal | test trek (debug mode only)', type: 'system' }] };
    }

    case 'status': {
      const statusMessages: TerminalMessage[] = [
        { text: '=== GAME STATUS ===', type: 'system' },
        { text: `Current Stage: ${gameState.stage}`, type: 'system' },
        { text: `Current Room: ${gameState.currentRoomId}`, type: 'system' },
        { text: `Player Name: ${gameState.player?.name || 'Not set'}`, type: 'system' },
        {
          text: `Room Map Loaded: ${Object.keys(gameState.roomMap || {}).length} rooms`,
          type: 'system',
        },
        {
          text: `Available Exits: ${Object.keys(currentRoom.exits || {}).join(', ') || 'None'}`,
          type: 'system',
        },
      ];
      return { messages: statusMessages };
    }

    case 'teleport':
    case 'warp': {
      const targetRoomId = resolveRoomId(gameState, noun);

      if (!targetRoomId) {
        return {
          messages: [{ text: `Unknown destination: ${noun || 'unspecified'}.`, type: 'error' }],
        };
      }

      const targetRoom = gameState.roomMap[targetRoomId];
      if (!targetRoom) {
        return {
          messages: [{ text: `Destination ${targetRoomId} is not currently loaded.`, type: 'error' }],
        };
      }

      const achievementId = 'interdimensional_traveler';
      return {
        messages: [
          {
            text: `Reality bends. You arrive at ${targetRoom.title || targetRoom.id}.`,
            type: 'lore',
          },
        ],
        updates: {
          currentRoomId: targetRoomId,
          metadata: withAchievement(gameState.metadata, achievementId),
          player: {
            ...gameState.player,
            currentRoom: targetRoomId,
          },
        },
      };
    }

    case 'debug': {
      if (!canUseDebugCommands(gameState)) {
        return {
          messages: [{ text: 'Debug commands are disabled.', type: 'error' }],
        };
      }

      if (noun === 'clear flags') {
        return {
          messages: [{ text: '[DEBUG] All flags cleared.', type: 'system' }],
          updates: {
            flags: {},
          },
        };
      }

      if (noun.startsWith('set flag ')) {
        const originalPrefix = 'debug set flag ';
        const rawArgs = trimmedOriginalInput.toLowerCase().startsWith(originalPrefix)
          ? trimmedOriginalInput.slice(originalPrefix.length).trim()
          : noun.slice('set flag '.length).trim();
        const [flagName, ...rawValueParts] = rawArgs.split(' ');
        const rawValue = rawValueParts.join(' ').trim();

        if (!flagName) {
          return {
            messages: [{ text: 'Usage: debug set flag <name> [value]', type: 'error' }],
          };
        }

        const value =
          rawValue === ''
            ? true
            : rawValue === 'true'
              ? true
              : rawValue === 'false'
                ? false
                : /^-?\d+(\.\d+)?$/.test(rawValue)
                  ? Number(rawValue)
                  : rawValue;

        return {
          messages: [{ text: `[DEBUG] Flag ${flagName} set to ${String(value)}.`, type: 'system' }],
          updates: {
            flags: {
              ...gameState.flags,
              [flagName]: value,
            },
          },
        };
      }

      if (noun.startsWith('warp ')) {
        return processCommand({
          input: `teleport ${noun.slice(5).trim()}`,
          currentRoom,
          gameState,
        });
      }

      if (noun.startsWith('give ')) {
        const itemId = noun.slice(5).trim();
        if (!itemId) {
          return {
            messages: [{ text: 'Usage: debug give <item>', type: 'error' }],
          };
        }

        return {
          messages: [{ text: `[DEBUG] Added ${itemId} to inventory.`, type: 'system' }],
          updates: {
            player: {
              ...gameState.player,
              inventory: gameState.player.inventory.includes(itemId)
                ? gameState.player.inventory
                : [...gameState.player.inventory, itemId],
            },
          },
        };
      }

      if (noun.startsWith('unlock achievement ')) {
        const achievementId = noun.replace('unlock achievement ', '').trim();
        if (!achievementId) {
          return {
            messages: [{ text: 'Usage: debug unlock achievement <id>', type: 'error' }],
          };
        }

        return {
          messages: [{ text: `[DEBUG] Achievement ${achievementId} unlocked.`, type: 'system' }],
          updates: {
            metadata: withAchievement(gameState.metadata, achievementId),
          },
        };
      }

      if (noun === 'show exits') {
        const exits = Object.keys(currentRoom.exits || {});
        return {
          messages: [{ text: exits.length > 0 ? `Exits: ${exits.join(', ')}` : 'Exits: none', type: 'system' }],
        };
      }

      if (noun === 'show flags') {
        const visibleFlags = Object.entries(gameState.flags || {})
          .filter(([, value]) => Boolean(value))
          .map(([flag]) => flag);
        return {
          messages: [{ text: visibleFlags.length > 0 ? `Flags: ${visibleFlags.join(', ')}` : 'Flags: none', type: 'system' }],
        };
      }

      if (noun === 'validate world') {
        const invalidExits = Object.entries(gameState.roomMap).flatMap(([roomId, roomEntry]) =>
          Object.entries(roomEntry.exits || {})
            .filter(([, targetRoomId]) => targetRoomId && !gameState.roomMap[targetRoomId])
            .map(([direction, targetRoomId]) => `${roomId}:${direction}->${targetRoomId}`),
        );

        return {
          messages: [
            {
              text:
                invalidExits.length > 0
                  ? `World validation found invalid exits: ${invalidExits.join(', ')}`
                  : 'World validation passed for loaded exits.',
              type: invalidExits.length > 0 ? 'error' : 'system',
            },
          ],
        };
      }

      if (noun === 'reset trap') {
        const proceduralReset = resetProceduralTrap(currentRoom.id);
        const staticTrap = getStaticTrap({
          ...currentRoom,
          traps: currentRoom.traps?.filter((trap: any) => trap.triggered),
        } as Room);

        if (proceduralReset) {
          return {
            messages: [{ text: 'Trap reset for debugging.', type: 'system' }],
          };
        }

        if (staticTrap) {
          return {
            messages: [{ text: 'Trap reset for debugging.', type: 'system' }],
            updates: updateStaticTrapState(currentRoom, gameState, staticTrap.id, (trap: any) => ({
              ...trap,
              triggered: false,
            })),
          };
        }

        return {
          messages: [{ text: 'No trap is available to reset.', type: 'error' }],
        };
      }

      return {
        messages: [
          {
            text: 'Available debug commands: debug warp <room>, debug set flag <name> [value], debug clear flags',
            type: 'system',
          },
        ],
      };
    }

    case 'search': {
      if (noun.includes('trap') || noun === '' || noun.includes('danger')) {
        const searchResult = searchForTraps(currentRoom, gameState);

        const messages: TerminalMessage[] = [
          {
            text: searchResult.warning || 'You search the area carefully.',
            type: searchResult.detected ? 'info' : 'system',
          },
        ];

        if (searchResult.detected && searchResult.canDisarm) {
          messages.push({
            text: '💡 This trap might be disarmable. Try "disarm trap" if you have the right tools.',
            type: 'system',
          });
        }

        return { messages };
      }

      return {
        messages: [
          { text: 'What do you want to search for? Try "search for traps".', type: 'system' },
        ],
      };
    }

    case 'disarm': {
      if (noun.includes('trap') || noun === 'trap') {
        const proceduralTrap = getTrapByRoom(currentRoom.id);
        if (proceduralTrap && !proceduralTrap.triggered) {
          if (!proceduralTrap.disarmable) {
            return {
              messages: [{ text: 'This trap cannot be safely disarmed.', type: 'error' }],
            };
          }

          const disarmed = disarmProceduralTrap(currentRoom.id, 'careful manipulation');
          return {
            messages: [
              {
                text: disarmed
                  ? `🔧 Success! You disarm the ${getTrapSeverityLabel(proceduralTrap)} trap.`
                  : 'Disarmament failed.',
                type: disarmed ? 'lore' : 'error',
              },
            ],
          };
        }

        // Find traps in the current room
        const roomTraps = currentRoom.traps?.filter((trap: any) => !trap.triggered) || [];

        if (roomTraps.length === 0) {
          return {
            messages: [{ text: 'There are no active traps here to disarm.', type: 'system' }],
          };
        }

        const trap = roomTraps[0]; // Disarm the first active trap
        const playerTraits = gameState.player.traits || [];
        const playerItems = gameState.player.inventory || [];

        const disarmResult = canPlayerDisarmTrap(trap, playerTraits, playerItems);

        if (!disarmResult.canDisarm) {
          return {
            messages: [
              {
                text: 'This trap cannot be disarmed, or you lack the necessary skills/tools.',
                type: 'error',
              },
            ],
          };
        }

        // Attempt disarmament
        const success = Math.random() < (disarmResult.chance || 0.3);

        if (success) {
          // Mark trap as triggered/disarmed
          const updatedTraps =
            currentRoom.traps?.map((t: any) =>
              t.id === trap.id ? { ...t, triggered: true } : t,
            ) || [];

          const messages: TerminalMessage[] = [
            {
              text: `🔧 Success! You carefully disarm the ${trap.severity || 'dangerous'} trap using ${disarmResult.method}.`,
              type: 'lore',
            },
            { text: '✅ The area is now safe to proceed.', type: 'system' },
          ];

          // Update room state
          const updatedRoom = { ...currentRoom, traps: updatedTraps };

          return {
            messages,
            updates: {
              roomMap: {
                ...gameState.roomMap,
                [currentRoom.id]: updatedRoom,
              },
            },
          };
        } else {
          return {
            messages: [
              { text: `💥 Your disarmament attempt fails! The trap activates!`, type: 'error' },
              { text: `${trap.description || 'The trap springs, causing harm!'}`, type: 'error' },
              {
                text: `💔 You take ${Math.min(trap.damage || 10, 15)} damage. Be more careful next time.`,
                type: 'error',
              },
            ],
          };
        }
      }

      return {
        messages: [{ text: 'What do you want to disarm? Try "disarm trap".', type: 'system' }],
      };
    }

    case 'trigger': {
      if (noun !== 'trap') {
        break;
      }

      const proceduralTrap = getTrapByRoom(currentRoom.id);
      if (proceduralTrap && !proceduralTrap.triggered) {
        const triggeredTrap = triggerProceduralTrap(currentRoom.id);
        if (!triggeredTrap) {
          return { messages: [{ text: 'The trap refuses to trigger.', type: 'error' }] };
        }

        return {
          messages: [
            {
              text: `💥 The ${getTrapSeverityLabel(triggeredTrap)} trap activates! ${triggeredTrap.description}`,
              type: 'error',
            },
          ],
        };
      }

      const staticTrap = getStaticTrap(currentRoom);
      if (staticTrap) {
        return buildStaticTrapTriggerResult(currentRoom, gameState, staticTrap);
      }

      return { messages: [{ text: 'There is no active trap here to trigger.', type: 'error' }] };
    }

    case 'escape': {
      if (noun !== 'trap') {
        break;
      }

      const activeTrap = getTrapByRoom(currentRoom.id) || getStaticTrap(currentRoom);
      if (!activeTrap) {
        return {
          messages: [{ text: 'There is no active trap here to escape from.', type: 'error' }],
        };
      }

      if (Math.random() < 0.5) {
        return {
          messages: [
            { text: '🏃‍♂️💨 You panic and retreat quickly, just avoiding the trap!', type: 'system' },
          ],
        };
      }

      return processCommand({
        input: 'trigger trap',
        currentRoom,
        gameState,
      });
    }

    default: {
      // Try crossing interaction handler first
      const crossingResult = handleCrossingInteraction(input, gameState);
      if (crossingResult.handled) {
        const messages: TerminalMessage[] =
          crossingResult.messages?.map((msg) => ({
            text: msg.text,
            type:
              msg.type === 'description'
                ? 'lore'
                : msg.type === 'narrative'
                  ? 'lore'
                  : msg.type === 'hint'
                    ? 'info'
                    : msg.type === 'success'
                      ? 'lore'
                      : msg.type === 'error'
                        ? 'error'
                        : 'system',
          })) || [];

        return {
          messages,
          updates: crossingResult.updates,
        };
      }

      return { messages: [{ text: "I don't understand that command.", type: 'error' }] };
    }
  }

  return { messages: [{ text: "I don't understand that command.", type: 'error' }] };
}

/**
 * Processes room entry logic
 */
function processRoomEntry(room: Room, gameState: LocalGameState): CommandResult {
  const messages: TerminalMessage[] = [];
  const updates: Partial<LocalGameState> = {};

  // Reset crossing state when entering crossing room
  if (room.id === 'crossing') {
    resetCrossingState();
  }

  if ((room as any).events?.onEnter) {
    messages.push({ text: 'You feel something change as you enter the room.', type: 'info' });
  }

  return { messages, updates };
}

export default processCommand;
