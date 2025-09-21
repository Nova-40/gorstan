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
// Credits screen component

import React, { useEffect, useState } from 'react';

interface CreditsScreenProps {
  onRestart: () => void;
}

const CreditsScreen: React.FC<CreditsScreenProps> = ({ onRestart }) => {
  const [lines] = useState([
    '🎮 GORSTAN ADVENTURE COMPLETE',
    '',
    'Created by Geoff Webster',
    '© 2025 All Rights Reserved',
    '',
    'Special Thanks:',
    '• The TypeScript Community',
    '• React Development Team',
    '• Open Source Contributors',
    '',
    '☕ Buy Geoff a Coffee',
    '📚 Buy the Books',
    '',
    '🔁 Play Again?',
  ]);

  const [visibleLines, setVisibleLines] = useState<string[]>([]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < lines.length) {
  setVisibleLines((prev) => [...prev, lines[index] ?? '']);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [lines]);

  return (
    <div className="p-6 bg-black text-green-400 min-h-screen flex flex-col justify-center items-center font-mono">
      <div className="max-w-lg w-full">
        {visibleLines.map((line, i) => (
          <div key={i} className="mb-2 text-center">
            {line === '☕ Buy Geoff a Coffee' ? (
              <a
                href="https://buymeacoffee.com/gorstan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:text-yellow-300 underline"
              >
                {line}
              </a>
            ) : line === '📚 Buy the Books' ? (
              <a
                href="https://geoffwebsterbooks.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                {line}
              </a>
            ) : line === '🔁 Play Again?' ? (
              <button
                onClick={onRestart}
                className="mt-4 px-4 py-2 bg-green-700 hover:bg-green-600 rounded transition-colors"
              >
                {line}
              </button>
            ) : (
              line
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreditsScreen;
