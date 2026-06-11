/*
  Gorstan – Artifact Puzzle
  This puzzle guards the artifact in the Artifact Chamber.
*/

import { Puzzle } from '../types/GameTypes';

const artifactPuzzle: Puzzle = {
  id: 'artifactPuzzle',
  title: 'Quantum Lock Puzzle',
  description: 'The artifact is protected by a quantum lock. Solve the puzzle to unlock it.',
  difficulty: 'expert',
  name: 'Quantum Lock Puzzle',
  solved: false,
  solve: (input: string) => {
    // Example puzzle logic: input must match a specific pattern
    const solution = 'QUANTUM-123';
    return input === solution;
  },
  hints: [
    'The solution is related to quantum mechanics.',
    'Think about the artifact and its purpose.',
    'The code contains the word "QUANTUM" followed by numbers.',
  ],
};

export default artifactPuzzle;
