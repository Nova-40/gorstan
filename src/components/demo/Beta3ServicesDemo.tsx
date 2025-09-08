/**
 * Example React component demonstrating Beta3 AI services integration
 * Shows how to use NPCs and lore in actual game components
 */

import React, { useState } from 'react';
import { useNPCConversation, useLore, useGameServices } from '../../hooks/useGameServices';
import { Button } from '../ui/Button';

interface NPCChatDemoProps {
  npcId: string;
  zone?: string;
}

export function NPCChatDemo({ npcId, zone = 'nexus' }: NPCChatDemoProps) {
  const [message, setMessage] = useState('');
  const { persona, lastResponse, isLoading, sendMessage, clearHistory } = useNPCConversation(npcId);

  const handleSendMessage = async () => {
    if (!message.trim()) {return;}
    
    await sendMessage(message, { zone, sessionId: 'demo-session' });
    setMessage('');
  };

  return (
    <div className="npc-chat-demo p-4 border border-gray-300 rounded-lg max-w-md">
      <h3 className="text-lg font-semibold mb-3">
        Chat with {persona?.name || npcId}
      </h3>
      
      {persona && (
        <div className="persona-info mb-4 p-2 bg-gray-50 rounded text-sm">
          <p><strong>Personality:</strong> {persona.personality}</p>
          <p><strong>Traits:</strong> {persona.traits.join(', ')}</p>
        </div>
      )}

      {lastResponse && (
        <div className="last-response mb-4 p-3 bg-blue-50 rounded">
          <p className="text-blue-800">{lastResponse.content}</p>
          <div className="text-xs text-blue-600 mt-2">
            Source: {lastResponse.response_source}
            {lastResponse.metadata?.model && ` • Model: ${lastResponse.metadata.model}`}
          </div>
        </div>
      )}

      <div className="input-section space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={isLoading || !message.trim()}
            variant="primary"
          >
            {isLoading ? '...' : 'Send'}
          </Button>
        </div>
        
        <Button 
          onClick={clearHistory}
          variant="secondary"
          size="sm"
        >
          Clear History
        </Button>
      </div>
    </div>
  );
}

export function LoreDiscoveryDemo() {
  const [searchQuery, setSearchQuery] = useState('');
  const { searchResults, randomEntry, isLoading, search, getRandomEntry } = useLore();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      search(searchQuery, { limit: 5 });
    }
  };

  return (
    <div className="lore-discovery-demo p-4 border border-gray-300 rounded-lg max-w-lg">
      <h3 className="text-lg font-semibold mb-3">Lore Discovery</h3>
      
      <div className="search-section mb-4 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search lore..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button onClick={handleSearch} variant="primary">
            Search
          </Button>
        </div>
        
        <Button 
          onClick={getRandomEntry}
          variant="secondary"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Random Entry'}
        </Button>
      </div>

      {randomEntry && (
        <div className="random-entry mb-4 p-3 bg-green-50 rounded">
          <h4 className="font-semibold text-green-800">{randomEntry.title}</h4>
          <div className="text-xs text-green-600 mb-2">
            Type: {randomEntry.type} • Tags: {randomEntry.tags.join(', ')}
          </div>
          <p className="text-sm text-green-700 line-clamp-3">
            {randomEntry.content.substring(0, 200)}...
          </p>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="search-results">
          <h4 className="font-medium mb-2">Search Results:</h4>
          <div className="space-y-2">
            {searchResults.slice(0, 3).map((result: any) => (
              <div key={result.entry.id} className="p-2 bg-gray-50 rounded text-sm">
                <div className="font-medium">{result.entry.title}</div>
                <div className="text-xs text-gray-600">
                  Relevance: {result.relevance_score} • 
                  Matched: {result.matched_fields.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ServiceStatusDemo() {
  const { isInitialized, availableNPCs, stats, isAIAvailable, configureAI } = useGameServices();
  const [showConfig, setShowConfig] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const handleConfigureGroq = () => {
    if (apiKey.trim()) {
      configureAI('groq', apiKey);
      setShowConfig(false);
      setApiKey('');
    }
  };

  return (
    <div className="service-status-demo p-4 border border-gray-300 rounded-lg max-w-lg">
      <h3 className="text-lg font-semibold mb-3">System Status</h3>
      
      <div className="status-grid space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Initialized:</span>
          <span className={isInitialized ? 'text-green-600' : 'text-red-600'}>
            {isInitialized ? '✓' : '✗'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>AI Available:</span>
          <span className={isAIAvailable ? 'text-green-600' : 'text-yellow-600'}>
            {isAIAvailable ? '✓ Configured' : '⚠ Offline Mode'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Available NPCs:</span>
          <span>{availableNPCs.length}</span>
        </div>

        {stats && (
          <div className="flex justify-between">
            <span>Lore Entries:</span>
            <span>{stats.content?.lore || 0}</span>
          </div>
        )}
      </div>

      {!isAIAvailable && (
        <div className="ai-config mt-4">
          <Button 
            onClick={() => setShowConfig(!showConfig)}
            variant="secondary"
            size="sm"
          >
            Configure AI
          </Button>
          
          {showConfig && (
            <div className="config-form mt-2 space-y-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Groq API Key"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <Button onClick={handleConfigureGroq} size="sm">
                  Set Groq
                </Button>
                <Button 
                  onClick={() => setShowConfig(false)} 
                  variant="ghost" 
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {availableNPCs.length > 0 && (
        <div className="npc-list mt-4">
          <h4 className="font-medium mb-2 text-sm">Available NPCs:</h4>
          <div className="flex flex-wrap gap-1">
            {availableNPCs.map((npcId: string) => (
              <span 
                key={npcId}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
              >
                {npcId}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Main demo component combining all examples
export function Beta3ServicesDemo() {
  const [selectedNPC, setSelectedNPC] = useState('ayla');
  const { availableNPCs } = useGameServices();

  return (
    <div className="beta3-services-demo p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Beta3 AI Services Demo</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="npc-section">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Select NPC:
            </label>
            <select 
              value={selectedNPC}
              onChange={(e) => setSelectedNPC(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableNPCs.map((npcId: string) => (
                <option key={npcId} value={npcId}>
                  {npcId}
                </option>
              ))}
            </select>
          </div>
          
          <NPCChatDemo npcId={selectedNPC} zone="nexus" />
        </div>
        
        <div className="discovery-section">
          <LoreDiscoveryDemo />
        </div>
      </div>
      
      <ServiceStatusDemo />
    </div>
  );
}
