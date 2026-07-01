import type { TerminalMessage } from '../../components/TerminalConsole';
import type { LocalGameState } from '../../state/gameState';
import type { Room } from '../../types/Room';
import { getBooleanFlag, setBooleanFlagUpdate } from './roomCommandState';

type RoomCommandResult = {
  messages: TerminalMessage[];
  updates?: Partial<LocalGameState>;
};

export const handleCafeOfficeChairCommand = (
  input: string,
  currentRoom: Room,
  gameState: LocalGameState,
): RoomCommandResult | null => {
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
