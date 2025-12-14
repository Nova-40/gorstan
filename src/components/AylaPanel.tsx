import React, { useState } from 'react';
import { useNPCDialogue } from '../core/hooks/useNPCDialogue';

export function AylaPanel() {
  const { prompt } = useNPCDialogue('ayla', 'Ayla');
  const [history, setHistory] = useState<string[]>([]);

  async function onAsk() {
    const res = await prompt({ recentCommands: ['read book about lattice'] });
    setHistory((h) => [...h, res.text]);
  }

  return (
    <div className="ayla-panel">
      <h3>Ayla</h3>
      <button onClick={onAsk}>Ask Ayla</button>
      <div className="dialogue">
        {history.map((h, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <p key={i}>{h}</p>
        ))}
      </div>
    </div>
  );
}
