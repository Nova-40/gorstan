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
import { searchTraps, attemptDisarmTrap } from './canonicalTrapEngine';
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


const getBooleanFlag = (gameState: any, flagName: string): boolean =>
  Boolean(gameState?.flags?.[flagName] ?? gameState?.gameFlags?.[flagName] ?? gameState?.[flagName]);

const getExistingFlags = (gameState: any): Record<string, boolean> => ({
  ...(gameState?.flags || {}),
  ...(gameState?.gameFlags || {}),
});

const setBooleanFlagUpdate = (
  gameState: LocalGameState,
  flagName: string
): Partial<LocalGameState> =>
  ({
    flags: {
      ...getExistingFlags(gameState),
      [flagName]: true,
    },
  }) as Partial<LocalGameState>;

const mergeBooleanFlagUpdates = (
  gameState: LocalGameState,
  ...flagNames: string[]
): Partial<LocalGameState> =>
  ({
    flags: {
      ...getExistingFlags(gameState),
      ...Object.fromEntries(flagNames.map((flagName) => [flagName, true])),
    },
  }) as Partial<LocalGameState>;

const roomTransitionUpdate = (
  gameState: LocalGameState,
  roomId: string
): Partial<LocalGameState> =>
  ({
    currentRoomId: roomId,
    currentRoom: roomId,
    player: {
      ...((gameState as any).player || {}),
      currentRoom: roomId,
    },
  }) as Partial<LocalGameState>;

const handleCafeOfficeChairCommand = (
  input: string,
  currentRoom: Room,
  gameState: LocalGameState
): CommandResult | null => {
  const normalized = input.trim().toLowerCase().replace(/\s+/g, ' ');

  if (currentRoom?.id !== 'cafeoffice') {
    return null;
  }

  const mentionsChair =
    normalized.includes('chair') ||
    normalized.includes('office chair') ||
    normalized.includes('seat');

  const inspectionVerb =
    normalized.startsWith('inspect') ||
    normalized.startsWith('examine') ||
    normalized.startsWith('look at') ||
    normalized.startsWith('look');

  const activationVerb =
    normalized.startsWith('sit') ||
    normalized.startsWith('use') ||
    normalized.startsWith('activate');

  if (!mentionsChair) {
    return null;
  }

  if (inspectionVerb && !activationVerb) {
    return {
      messages: [
        {
          text:
            'It is a comfortable office chair with a faint, precise vibration running through it. It feels less like furniture and more like a high-tech gadget making a very poor attempt at office camouflage.',
          type: 'lore',
        },
      ],
    };
  }

  if (!activationVerb) {
    return null;
  }

  const hasSatBefore = getBooleanFlag(gameState, 'cafe_office_chair_sat_once');

  if (!hasSatBefore) {
    return {
      messages: [
        {
          text:
            'It is a comfortable office chair. There is a strange vibration through it, and it feels warm — not warm like someone was just sitting here, warm like some sort of high-tech gadget pretending not to be.',
          type: 'system',
        },
      ],
      updates: setBooleanFlagUpdate(gameState, 'cafe_office_chair_sat_once'),
    };
  }

  return {
    messages: [
      {
        text:
          'You sit in the office chair again. The vibration recognises the repetition with bureaucratic satisfaction. Something inside the chair wakes up, but it is clearly waiting for its destination logic to be wired before doing anything rash.',
        type: 'system',
      },
    ],
    updates: setBooleanFlagUpdate(gameState, 'cafe_office_chair_ready'),
  };
};



const hasAnyFlag = (gameState: any, ...flagNames: string[]): boolean =>
  flagNames.some((flagName) => getBooleanFlag(gameState, flagName));

const handleNewYorkChainCommand = (
  input: string,
  currentRoom: Room,
  gameState: LocalGameState
): CommandResult | null => {
  const normalized = input.trim().toLowerCase().replace(/\s+/g, ' ');
  const roomId = currentRoom?.id;

  if (roomId === 'burgerjoint') {
    const mentionsChef = normalized.includes('chef') || normalized.includes('burger_chef') || normalized.includes('tony');
    const asksInstructions = mentionsChef && (normalized.includes('instruction') || normalized.includes('passcode') || normalized.includes('password') || normalized.includes('code'));
    const rudeToChef = mentionsChef && (normalized.includes('rude') || normalized.includes('insult') || normalized.includes('shout') || normalized.includes('threaten'));

    if (rudeToChef) {
      return {
        messages: [{ text: 'The chef stops wiping the counter and gives you a look that has ended better careers than yours. Whatever instructions he may have had are no longer on offer.', type: 'system' }],
        updates: mergeBooleanFlagUpdates(gameState, 'chef_offended', 'chef_refuses_instructions'),
      };
    }

    if (asksInstructions) {
      if (hasAnyFlag(gameState, 'chef_offended', 'chef_refuses_instructions')) {
        return {
          messages: [{ text: 'The chef hears the word “instructions” and becomes very interested in cleaning an already clean patch of counter. You are not getting the passcode from him now.', type: 'system' }],
          updates: mergeBooleanFlagUpdates(gameState, 'chef_refuses_instructions'),
        };
      }

      return {
        messages: [{ text: 'The chef leans in just far enough to make this feel unofficial. “Warehouse. Ask for Albie. The passcode is AEVIRA. Say it cleanly, and do not improvise. People who improvise make paperwork.”', type: 'system' }],
        updates: mergeBooleanFlagUpdates(gameState, 'chef_instruction_hint_received', 'chef_instructions_received', 'warehouse_route_unlocked', 'warehouse_passcode_known', 'chef_likes_player', 'chef_authorization_received'),
      };
    }

    if (mentionsChef && normalized.startsWith('speak')) {
      if (hasAnyFlag(gameState, 'chef_offended', 'chef_refuses_instructions')) {
        return {
          messages: [{ text: 'The chef keeps his expression professionally flat. “Kitchen is open. Conversation is closed.”', type: 'system' }],
          updates: mergeBooleanFlagUpdates(gameState, 'chef_refuses_instructions'),
        };
      }

      return {
        messages: [{ text: 'The chef gives you a short nod. “You look like someone who has been sent somewhere without being told enough. Happens more than you’d think. I might have instructions, if you ask properly.”', type: 'system' }],
        updates: mergeBooleanFlagUpdates(gameState, 'chef_instruction_hint_received', 'warehouse_route_unlocked', 'chef_likes_player'),
      };
    }

    if (normalized === 'go storeroom' || normalized === 'go store room' || normalized === 'go storage') {
      if (!hasAnyFlag(gameState, 'chef_likes_player', 'chef_authorization_received')) {
        return { messages: [{ text: 'The chef shifts half a step, which is somehow enough to make the storeroom door stop being an option.', type: 'system' }] };
      }

      return {
        messages: [{ text: 'The chef nods toward the door. “Mind the floor. It has opinions.”', type: 'system' }],
        updates: roomTransitionUpdate(gameState, 'greasystoreroom'),
      };
    }
  }

  if (roomId === 'centralpark') {
    const wantsWarehouse = normalized === 'go warehouse' || normalized === 'go east' || normalized.includes('aevira warehouse');

    if (wantsWarehouse) {
      if (!hasAnyFlag(gameState, 'warehouse_route_unlocked', 'chef_instruction_hint_received')) {
        return { messages: [{ text: 'You scan the paths out of Central Park, but nothing resolves into a warehouse route yet. It feels like someone else needs to give the city permission to unfold.', type: 'system' }] };
      }

      return {
        messages: [{ text: 'A service route between trees and traffic resolves into something much less public. The Aevira Warehouse waits ahead.', type: 'system' }],
        updates: roomTransitionUpdate(gameState, 'aevirawarehouse'),
      };
    }

    const wantsWorkshop =
      normalized === 'go down' ||
      normalized === 'go workshop' ||
      normalized.includes('alveira workshop') ||
      normalized.includes('hidden workshop');

    if (wantsWorkshop) {
      if (!hasAnyFlag(gameState, 'alveira_workshop_unlocked', 'briefcase_puzzle_solved')) {
        return {
          messages: [
            {
              text:
                'The park remains stubbornly ordinary. No concealed workshop route presents itself yet, which is either reassuring or very poor customer service.',
              type: 'system',
            },
          ],
        };
      }

      return {
        messages: [
          {
            text:
              'A maintenance stair that was definitely not there before resolves beneath the trees. You descend into the hidden Alveira Workshop.',
            type: 'system',
          },
        ],
        updates: roomTransitionUpdate(gameState, 'alveiraworkshop'),
      };
    }

    const wantsHub = normalized === 'go south' || normalized.includes('new york hub') || normalized.includes('manhattan hub') || normalized.includes('manhattanhub');

    if (wantsHub) {
      if (!hasAnyFlag(gameState, 'briefcase_puzzle_solved', 'new_york_hub_unlocked')) {
        return { messages: [{ text: 'The route toward the New York Hub refuses to become definite. Apparently Manhattan now requires a briefcase-based precondition. Typical.', type: 'system' }] };
      }

      return {
        messages: [
          {
            text:
              'The city folds its transit logic into something more useful. The route to Manhattan Hub is now open.',
            type: 'system',
          },
        ],
        updates: roomTransitionUpdate(gameState, 'manhattanhub'),
      };
    }
  }

  if (roomId === 'alveiraworkshop') {
    const mentionsWorkshopChair =
      normalized.includes('chair') ||
      normalized.includes('transporter');

    const inspectsWorkshopChair =
      mentionsWorkshopChair &&
      (normalized.startsWith('inspect') ||
        normalized.startsWith('examine') ||
        normalized.startsWith('look'));

    const activatesWorkshopChair =
      mentionsWorkshopChair &&
      (normalized.startsWith('sit') ||
        normalized.startsWith('use') ||
        normalized.startsWith('activate'));

    if (inspectsWorkshopChair && !activatesWorkshopChair) {
      return {
        messages: [
          {
            text:
              'The workshop chair looks plain only in the way a trapdoor looks like flooring. Its arm panel is warm, live, and waiting for the one command chairs traditionally fear most: sitting.',
            type: 'lore',
          },
        ],
      };
    }

    if (activatesWorkshopChair) {
      return {
        messages: [
          {
            text:
              'You sit in the workshop chair. The relays click with professional satisfaction, the room folds inward, and the chair deposits you in the Ancients’ Room with only a mild sense of administrative judgement.',
            type: 'system',
          },
        ],
        updates: {
          ...roomTransitionUpdate(gameState, 'ancientsroom'),
          flags: {
            ...getExistingFlags(gameState),
            alveira_workshop_chair_used: true,
            off_world_route_opened: true,
          },
        } as Partial<LocalGameState>,
      };
    }
  }

  if (roomId === 'aevirawarehouse') {
    const givesCode = normalized.includes('aevira') || normalized.includes('passcode') || normalized.includes('password') || normalized.includes('code');
    const mentionsAlbie = normalized.includes('albie') || normalized.includes('guard') || normalized.includes('security');

    if (givesCode || mentionsAlbie || normalized.startsWith('speak')) {
      if (!hasAnyFlag(gameState, 'warehouse_passcode_known', 'chef_instructions_received')) {
        return {
          messages: [{ text: 'Albie listens, waits, and then points back toward Central Park with the professional courtesy of a man returning misdelivered post. “No passcode, no warehouse.”', type: 'system' }],
          updates: roomTransitionUpdate(gameState, 'centralpark'),
        };
      }

      if (!normalized.includes('aevira')) {
        return { messages: [{ text: 'Albie folds his arms. “I need the actual passcode. Hints, vibes and interpretive mumbling are not accepted.”', type: 'system' }] };
      }

      return {
        messages: [{ text: '“AEVIRA,” you say. Albie studies you for a long second, then steps aside. “Briefcase is on the table. Open it, and the city will know what to do next.”', type: 'system' }],
        updates: mergeBooleanFlagUpdates(gameState, 'warehouse_access_granted', 'albie_passcode_accepted', 'briefcase_puzzle_active'),
      };
    }

    if (normalized.includes('briefcase') || normalized.includes('solve puzzle') || normalized.includes('open case')) {
      if (!hasAnyFlag(gameState, 'briefcase_puzzle_active', 'warehouse_access_granted')) {
        return { messages: [{ text: 'The briefcase remains present but institutionally unavailable. Albie has not yet approved this level of curiosity.', type: 'system' }] };
      }

      return {
        messages: [{ text: 'The briefcase lock gives way with a precise, expensive click. Somewhere back in Central Park, two routes quietly become official: down to the hidden Alveira Workshop, and onward to Manhattan Hub.', type: 'system' }],
        updates: mergeBooleanFlagUpdates(gameState, 'briefcase_puzzle_solved', 'briefcase_opened', 'alveira_workshop_unlocked', 'new_york_hub_unlocked'),
      };
    }
  }

  return null;
};

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
  const cafeOfficeChairResult = handleCafeOfficeChairCommand(resolvedInput, currentRoom, gameState);
  if (cafeOfficeChairResult) {
    return cafeOfficeChairResult;
  }

  const newYorkChainResult = handleNewYorkChainCommand(resolvedInput, currentRoom, gameState);
  if (newYorkChainResult) {
    return newYorkChainResult;
  }

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
        const searchResult = searchTraps(currentRoom, gameState);
        const messages: TerminalMessage[] = [...searchResult.messages];

        if (searchResult.detected && searchResult.trap?.disarmable !== false) {
          messages.push({
            text: '💡 This trap might be disarmable. Try "disarm trap" if you have the right tools.',
            type: 'system',
          });
        }

        return {
          messages,
          updates: searchResult.updates,
        };
      }

      return {
        messages: [
          { text: 'What do you want to search for? Try "search for traps".', type: 'system' },
        ],
      };
    }

    case 'disarm': {
      if (noun.includes('trap') || noun === 'trap') {
        const disarmResult = attemptDisarmTrap(currentRoom, gameState);

        const legacyTrapUpdates =
          disarmResult.updates?.flags && currentRoom.traps?.some((trap: any) => trap.id === disarmResult.trap?.id)
            ? {
                roomMap: {
                  ...gameState.roomMap,
                  [currentRoom.id]: {
                    ...currentRoom,
                    traps: currentRoom.traps.map((trap: any) =>
                      trap.id === disarmResult.trap?.id ? { ...trap, triggered: true } : trap,
                    ),
                  },
                },
              }
            : {};

        return {
          messages: disarmResult.messages,
          updates: {
            ...disarmResult.updates,
            ...legacyTrapUpdates,
          },
        };
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
