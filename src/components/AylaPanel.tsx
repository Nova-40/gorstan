
import React, { useState } from 'react';
import { HttpAylaClient, MockAylaClient } from '../core/ayla/AylaClient';
import { useAyla } from '../core/ayla/useAyla';
import { useGameState } from '../state/gameState';

const httpClient = new HttpAylaClient('/api/ayla');
const mockClient = new MockAylaClient();

export default function AylaPanel(){
  const [input, setInput] = useState('');
  const [answer, setAnswer] = useState('');
  const { state, dispatch } = useGameState();
  const [useMock, setUseMock] = useState(false);
  const { ask, isTyping, error } = useAyla(useMock ? mockClient : httpClient);

  async function onSend(){
    setAnswer('');
    const ctx = { room: state.currentRoomId, flags: state.flags, inv: state.player?.inventory || [] };
    try {
      await ask({ model: 'smart', user: 'anon', prompt: input, context: ctx }, (tok)=> setAnswer(prev=> prev + tok));
      dispatch?.({ type: 'RECORD_MESSAGE', payload: { text: 'Ayla: ' + answer, type: 'npc', timestamp: Date.now() } });
    } catch {
      // fall back to mock on failure
      if (!useMock) setUseMock(true);
    }
  }

  return (
    <div className="border border-green-700 rounded-2xl p-3 bg-black/60 space-y-2">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Ayla</div>
        <label className="text-xs opacity-80">
          <input type="checkbox" checked={useMock} onChange={e=>setUseMock(e.target.checked)} /> Offline mock
        </label>
      </div>
      <textarea value={input} onChange={e=>setInput(e.target.value)} className="w-full h-20 bg-black/40 border border-green-700 rounded p-2" placeholder="Ask Ayla…" />
      <button onClick={onSend} className="border border-green-700 rounded-xl px-3 py-1">Send</button>
      {isTyping && <div className="text-green-400/80">…thinking</div>}
      {error && <div className="text-red-400">{error}</div>}
      <div className="whitespace-pre-wrap text-green-200/90 min-h-8">{answer}</div>
    </div>
  );
}
