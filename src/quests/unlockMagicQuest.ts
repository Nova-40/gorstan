/*
  Gorstan – Unlock Magic Quest
  This quest introduces the player to the magic system and unlocks their ability to use magic.
*/

import { Quest } from '../types/GameTypes';

const unlockMagicQuest: Quest = {
  id: 'unlockMagic',
  title: 'The Path to Magic',
  description: 'Discover the ancient secrets of magic and unlock your potential.',
  steps: [
    {
      id: 'findMentor',
      description: 'Find a mentor who can teach you the ways of magic.',
      completed: false,
    },
    {
      id: 'gatherEssence',
      description: 'Gather magical essence from the Glitch Zone.',
      completed: false,
    },
    {
      id: 'performRitual',
      description: 'Perform the ritual to unlock your magical abilities.',
      completed: false,
    },
  ],
  onComplete: (gameState) => {
    gameState.hasMagic = true;
    console.log('You have unlocked the ability to use magic!');
  },
};

export default unlockMagicQuest;
