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
  const [founders, setFounders] = useState<string[]>([]);

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

  useEffect(() => {
    // import helper lazily to avoid SSR issues and keep initial bundle small
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { readFounders } = require('../../utils/founders');
      const data = readFounders();
      setFounders(data.slice(0, 100));
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="p-6 bg-black text-green-400 min-h-screen flex flex-col justify-center items-center font-mono relative overflow-hidden">
      {/* subtle animated background gradient */}
      <div className="absolute inset-0 pointer-events-none opacity-30 animate-gradient" aria-hidden />

      <div className="max-w-lg w-full z-10">
        {visibleLines.map((line, i) => (
          <div key={i} className="mb-2 text-center opacity-0 animate-fade-in" style={{ animationDelay: `${i * 120}ms`, animationFillMode: 'forwards' }}>
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

        {/* Founders donors section */}
        {founders.length > 0 && (
          <div className="mt-8 text-center">
            <div className="text-xl font-semibold text-yellow-300 mb-2">Founder Donors</div>
            <div className="text-sm text-yellow-200 mb-4">Those who purchased a Founder licence — thank you.</div>
            <div className="grid grid-cols-1 gap-1">
              {founders.map((f, idx) => (
                <div key={idx} className="opacity-0 text-yellow-100 animate-fade-in" style={{ animationDelay: `${500 + idx * 90}ms`, animationFillMode: 'forwards' }}>
                  • {f}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditsScreen;
