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

import { Room } from '../types/Room';
import { TerminalMessage } from '../components/TerminalConsole';

import { handleCrossingInteraction, resetCrossingState } from './crossingController';
import { searchForTraps, canPlayerDisarmTrap } from './trapDetection';
import { LocalGameState } from '../state/gameState';

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
};

type RoomCommandData = Room & {
  commandAliases?: Record<string, string>;
  itemDescriptions?: Record<string, string>;
  conversationResponses?: Record<string, string>;
};

const normalizeCommandInput = (input: string): string => {
  const cleaned = input.toLowerCase().trim().replace(/\s+/g, ' ');

  if (aliases[cleaned]) {
    return aliases[cleaned];
  }

  const phraseAliases: Array<[RegExp, string]> = [
    [/^look at\s+/, 'inspect '],
    [/^look into\s+/, 'inspect '],
    [/^look through\s+/, 'inspect '],
    [/^talk to\s+/, 'speak '],
    [/^speak to\s+/, 'speak '],
    [/^chat to\s+/, 'speak '],
    [/^ask\s+/, 'speak '],
  ];

  for (const [pattern, replacement] of phraseAliases) {
    if (pattern.test(cleaned)) {
      return cleaned.replace(pattern, replacement);
    }
  }

  const [rawVerb, ...rest] = cleaned.split(' ');
  const verb = aliases[rawVerb] || rawVerb;

  return [verb, ...rest].filter(Boolean).join(' ');
};

const normalizeTargetText = (target: string): string => {
  return target
    .toLowerCase()
    .trim()
    .replace(/^at\s+/, '')
    .replace(/^to\s+/, '')
    .replace(/^(the|a|an)\s+/, '')
    .replace(/[\s-]+/g, '_');
};

const getItemId = (item: unknown): string | null => {
  if (typeof item === 'string') {
    return item;
  }

  if (item && typeof item === 'object') {
    const itemData = item as { id?: string; name?: string };
    return itemData.id || itemData.name || null;
  }

  return null;
};

const getItemDisplayName = (item: unknown): string | null => {
  if (typeof item === 'string') {
    return item.replace(/_/g, ' ');
  }

  if (item && typeof item === 'object') {
    const itemData = item as { id?: string; name?: string };
    return itemData.name || itemData.id?.replace(/_/g, ' ') || null;
  }

  return null;
};

const resolveRoomTarget = (noun: string, currentRoom: Room): string => {
  const roomData = currentRoom as RoomCommandData;
  const normalized = normalizeTargetText(noun);
  const directAlias = roomData.commandAliases?.[normalized] || roomData.commandAliases?.[noun.toLowerCase().trim()];

  if (directAlias) {
    return directAlias;
  }

  const interactableKeys = Object.keys((currentRoom as any).interactables || {});
  const interactableMatch = interactableKeys.find((key) => normalizeTargetText(key) === normalized);

  if (interactableMatch) {
    return interactableMatch;
  }

  const itemMatch = (currentRoom.items || []).find((item) => {
    const id = getItemId(item);
    const name = getItemDisplayName(item);
    return (
      (id && normalizeTargetText(id) === normalized) ||
      (name && normalizeTargetText(name) === normalized)
    );
  });

  return getItemId(itemMatch) || normalized;
};

const describeRoomTarget = (target: string, currentRoom: Room): TerminalMessage[] | null => {
  const roomData = currentRoom as RoomCommandData;
  const interactable = (currentRoom as any).interactables?.[target];

  if (interactable?.description) {
    return [{ text: interactable.description, type: 'lore' }];
  }

  const item = (currentRoom.items || []).find((candidate) => getItemId(candidate) === target);

  if (item) {
    const displayName = getItemDisplayName(item) || target.replace(/_/g, ' ');
    const itemDescription = roomData.itemDescriptions?.[target];

    return [
      {
        text: itemDescription || `You examine the ${displayName}. It seems worth remembering.`,
        type: itemDescription ? 'lore' : 'info',
      },
    ];
  }

  return null;
};

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

  const resolvedInput = normalizeCommandInput(input);
  const commandParts = resolvedInput.split(' ');
  const verb = commandParts[0];
  const noun = commandParts.slice(1).join(' ');

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
      if (noun) {
        const target = resolveRoomTarget(noun, currentRoom);
        const targetMessages = describeRoomTarget(target, currentRoom);

        if (targetMessages) {
          return { messages: targetMessages };
        }

        return {
          messages: [{ text: `You don't see anything obvious called "${noun}" here.`, type: 'error' }],
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

      if (!gameState.player.inventory.includes(noun)) {
        return { messages: [{ text: `You don't have a ${noun} to use.`, type: 'error' }] };
      }

      messages.push({ text: `You use the ${noun}.`, type: 'info' });
      return { messages };
    }

    case 'help':
    case 'about':
    case 'instructions': {
      const helpMessages: TerminalMessage[] = [
        { text: '--- Gorstan Beta 5 Field Briefing ---', type: 'system' },
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

      // Check if the specified NPC is in the room
      const targetNPC = gameState.npcsInRoom?.find((npc: any) => {
        const name = typeof npc === 'string' ? npc : npc.name;
        return name.toLowerCase().includes(noun.toLowerCase());
      });

      if (!targetNPC) {
        const target = resolveRoomTarget(noun, currentRoom);
        const roomData = currentRoom as RoomCommandData;
        const conversationResponse = roomData.conversationResponses?.[target];
        const interactable = (currentRoom as any).interactables?.[target];

        if (conversationResponse || interactable?.description) {
          return {
            messages: [
              {
                text: conversationResponse || interactable.description,
                type: conversationResponse ? 'lore' : 'info',
              },
            ],
          };
        }

        return {
          messages: [{ text: `You don't see anyone named "${noun}" here.`, type: 'error' }],
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
