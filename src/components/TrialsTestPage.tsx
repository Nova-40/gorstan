/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Trials Integration Test - Standalone component for testing the Trials interface
*/

import React, { useState } from 'react';
import TrialsGame from '../components/TrialsGame';

export const TrialsTestPage: React.FC = () => {
  const [showTrials, setShowTrials] = useState(false);

  const handleStartTrials = () => {
    setShowTrials(true);
  };

  const handleComplete = () => {
    console.log('Trials completed!');
    setShowTrials(false);
  };

  const handleQuit = () => {
    console.log('Quit trials');
    setShowTrials(false);
  };

  if (showTrials) {
    return (
      <TrialsGame
        onComplete={handleComplete}
        onQuit={handleQuit}
        autoStart={false}
      />
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      color: '#e0e6ed',
      fontFamily: 'Consolas, Monaco, monospace'
    }}>
      <h1 style={{ color: '#00ff88', marginBottom: '30px' }}>
        Trials of Gorstan - Test Interface
      </h1>
      
      <p style={{ textAlign: 'center', maxWidth: '600px', marginBottom: '30px' }}>
        This is a test page for the Trials of Gorstan interactive interface. 
        Click the button below to experience the engaging human-player interface 
        with visual feedback, real-time controls, and immersive gameplay.
      </p>

      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#00ff88', marginBottom: '15px' }}>Key Features:</h3>
        <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0 }}>
          <li>🎮 Real-time canvas-based game field with smooth animations</li>
          <li>⚡ Interactive player controls (WASD + mouse)</li>
          <li>📊 Live status bars for health, energy, and stamina</li>
          <li>🗺️ Mini-map with creature and object tracking</li>
          <li>🏆 Achievement system with visual feedback</li>
          <li>💡 Dynamic hints and contextual help</li>
          <li>⏸️ Pause/resume functionality</li>
          <li>🎯 Phase progression with clear objectives</li>
          <li>🎨 Beautiful sci-fi console aesthetic</li>
          <li>♿ Full accessibility support</li>
        </ul>
      </div>

      <button
        onClick={handleStartTrials}
        style={{
          background: 'linear-gradient(135deg, #00ff88, #00d4aa)',
          color: '#000000',
          border: 'none',
          padding: '15px 30px',
          fontSize: '1.3rem',
          fontWeight: 'bold',
          borderRadius: '10px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 5px 15px rgba(0, 255, 136, 0.3)'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 255, 136, 0.5)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 255, 136, 0.3)';
        }}
      >
        🚀 Launch Trials Interface
      </button>

      <div style={{ 
        marginTop: '40px', 
        padding: '20px', 
        background: 'rgba(0, 255, 136, 0.05)',
        borderRadius: '10px',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        maxWidth: '600px'
      }}>
        <h4 style={{ color: '#00ff88', marginBottom: '10px' }}>Human Enjoyment Features:</h4>
        <ul style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
          <li><strong>Visual Feedback:</strong> Smooth animations, particle effects, and responsive UI elements</li>
          <li><strong>Strategic Depth:</strong> Energy management, creature AI, and tactical positioning</li>
          <li><strong>Progressive Challenge:</strong> Three distinct phases with increasing complexity</li>
          <li><strong>Immediate Response:</strong> All controls are responsive with instant visual feedback</li>
          <li><strong>Clear Goals:</strong> Objectives and hints guide players without hand-holding</li>
          <li><strong>Sense of Progress:</strong> Phase progression, achievements, and score tracking</li>
        </ul>
      </div>
    </div>
  );
};

export default TrialsTestPage;
