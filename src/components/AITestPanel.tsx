/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Simple test component to verify Groq AI integration
*/

import React, { useState } from 'react';
import { generateNpcReply } from '../utils/aiAdapter';
import { useGameState } from '../state/gameState';

export const AITestPanel: React.FC = () => {
  const { state } = useGameState();
  const [isLoading, setIsLoading] = useState(false);
  const [testMessage, setTestMessage] = useState('Hello!');
  const [response, setResponse] = useState('');
  const [selectedNPC, setSelectedNPC] = useState('ayla');

  const testAI = async () => {
    setIsLoading(true);
    setResponse('');

    try {
      const aiResponse = await generateNpcReply(selectedNPC, testMessage, state);
      setResponse(aiResponse || 'No AI response (using fallback)');
    } catch (error) {
      setResponse(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // groqAI status is not exposed through adapter; keep a lightweight status placeholder
  const status = { enabled: true, requestsRemaining: 9999 } as any;

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        zIndex: 1000,
        maxWidth: '300px',
        fontSize: '12px',
      }}
    >
      <h3>🤖 Groq AI Test Panel</h3>

      <div style={{ marginBottom: '10px' }}>
        <strong>Status:</strong> {status.enabled ? '🟢 Active' : '🔴 Disabled'}
        <br />
        <strong>Requests Left:</strong> {status.requestsRemaining}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>NPC:</label>
        <select
          value={selectedNPC}
          onChange={(e) => setSelectedNPC(e.target.value)}
          style={{ marginLeft: '5px', color: 'black' }}
        >
          <option value="ayla">Ayla</option>
          <option value="morthos">Morthos</option>
          <option value="al">Al</option>
          <option value="dominic">Dominic</option>
          <option value="polly">Polly</option>
          <option value="mr_wendell">Mr. Wendell</option>
          <option value="albie">Albie</option>
        </select>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={testMessage}
          onChange={(e) => setTestMessage(e.target.value)}
          placeholder="Test message..."
          style={{ width: '100%', padding: '5px', color: 'black' }}
        />
      </div>

      <button
        onClick={testAI}
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '8px',
          backgroundColor: isLoading ? '#666' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
        }}
      >
        {isLoading ? 'Testing AI...' : 'Test AI Response'}
      </button>

      {response && (
        <div
          style={{
            marginTop: '10px',
            padding: '8px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '4px',
            fontSize: '11px',
          }}
        >
          <strong>Response:</strong>
          <br />
          {response}
        </div>
      )}
    </div>
  );
};
