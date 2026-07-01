import type { TerminalMessage } from '../../components/TerminalConsole';
import type { LocalGameState } from '../../state/gameState';
import type { Room } from '../../types/Room';
import { getExistingFlags, hasAnyFlag, mergeBooleanFlagUpdates, roomTransitionUpdate } from './roomCommandState';

type RoomCommandResult = {
  messages: TerminalMessage[];
  updates?: Partial<LocalGameState>;
};

export const handleNewYorkChainCommand = (
  input: string,
  currentRoom: Room,
  gameState: LocalGameState,
): RoomCommandResult | null => {
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
