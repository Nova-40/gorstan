import type { LocalGameState } from '../state/gameState';

export interface DominicPickupOutcome {
  messages: string[];
  nextFlags: LocalGameState['flags'];
  completePickup: boolean;
}

function getAttempts(state: LocalGameState): number {
  return typeof state.flags?.dominicPickupAttempts === 'number' ? state.flags.dominicPickupAttempts : 0;
}

function hasInsisted(state: LocalGameState): boolean {
  return Boolean(state.flags?.dominicPickupInsisted);
}

export function resolveDominicPickupAttempt(state: LocalGameState): DominicPickupOutcome {
  const attempts = getAttempts(state) + 1;
  const insisted = hasInsisted(state);
  const nextFlags: LocalGameState['flags'] = {
    ...state.flags,
    dominicPickupAttempts: attempts,
  };

  if (state.currentRoomId !== 'dalesapartment') {
    return {
      messages: [],
      nextFlags,
      completePickup: true,
    };
  }

  if (attempts === 1) {
    return {
      messages: [
        '🐟 As you reach for Dominic, he swims to the far side of his tank and looks at you with intelligent, worried eyes.',
        '*DOMINIC speaks in a voice only you can hear* "Please... I\'m safe here. Taking me from my tank would be... unpleasant for both of us."',
      ],
      nextFlags,
      completePickup: false,
    };
  }

  if (attempts === 2) {
    return {
      messages: [
        '🐟 Dominic swims frantically as you approach again, his distress clearly visible.',
        '*DOMINIC\'s voice grows more desperate* "Listen to me carefully - I\'ve been through this before. It never ends well. There are consequences to taking me from this place."',
        "*DOMINIC continues* \"I'm not just a pet. I'm... aware. And I'm telling you: leave me be. For both our sakes.\"",
      ],
      nextFlags: {
        ...nextFlags,
        dominicPickupWarned: true,
      },
      completePickup: false,
    };
  }

  if (attempts === 3 && !insisted) {
    return {
      messages: [
        '🐟 Despite his previous warnings, you reach for Dominic once more. He stops swimming and fixes you with a steady, knowing gaze.',
        "*DOMINIC's voice is sad but resolute* \"I see. You're determined to ignore my warnings. Very well... but know this: taking me will mark you. Others will know what you've done. Polly will know.\"",
        '*DOMINIC\'s voice drops to a whisper* "If you truly insist on this path, try once more. But remember - I warned you. The guilt is yours to carry."',
      ],
      nextFlags: {
        ...nextFlags,
        dominicPickupInsisted: true,
      },
      completePickup: false,
    };
  }

  return {
    messages: [
      '🐟 Dominic stops resisting and allows you to take him, but his eyes are filled with sadness and resignation.',
      '*DOMINIC\'s final words* "So be it. But remember this moment when the consequences find you. I tried to save us both."',
    ],
    nextFlags: {
      ...nextFlags,
      dominicTakenAfterWarning: true,
      dominicWarningsIgnored: attempts,
      dominicIsDead: true,
      pollyVengeanceActive: true,
    },
    completePickup: true,
  };
}

// Enhanced responses for different conversation contexts
export const dominicConversationResponses = {
  philosophical: [
    'Every tank is both a prison and a universe. The question is whether you choose to see the glass or the water.',
    "I've watched many players make choices. The wise ones listen before they act.",
    "Freedom isn't always about escape. Sometimes it's about understanding where you belong.",
    'The multiverse is vast, but some of us have found our place in it. Have you found yours?',
  ],

  warning: [
    "Taking me from this tank isn't just theft - it's murder with extra steps.",
    'Polly has... feelings... about what happens to me. Strong feelings. Violent feelings.',
    "I've seen this story before. It never has a happy ending.",
    'Some actions echo across the multiverse. This would be one of them.',
  ],

  wise: [
    'Patience, young seeker. Understanding comes to those who observe before they act.',
    'The greatest adventures often begin with choosing not to act rashly.',
    'Wisdom is knowing that not everything that can be taken should be taken.',
    'True strength is shown in restraint, not in taking what you desire.',
  ],

  sad: [
    'I had hoped you were different. That you would listen.',
    'Even knowing the consequences, some choose the dark path.',
    'My warnings fall on deaf ears, as they always do.',
    'The pattern repeats. The fish dies. The guilt remains.',
  ],
};

// Context-aware response selection
export function getDominicResponse(context: 'philosophical' | 'warning' | 'wise' | 'sad'): string {
  const responses = dominicConversationResponses[context];
  return responses[Math.floor(Math.random() * responses.length)];
}
