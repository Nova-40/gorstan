import React from 'react';
import { IS_DEMO } from '../config/mode';

interface DemoCompletionProps {
  roomId: string;
  onContinueDemo?: () => void;
  onViewFullGame?: () => void;
}

export default function DemoCompletion({
  roomId,
  onContinueDemo,
  onViewFullGame,
}: DemoCompletionProps) {
  // Only show in demo mode when reaching the finale room
  if (!IS_DEMO || roomId !== 'faepalacerhianonsroom') {
    return null;
  }

  const handleContinueDemo = () => {
    onContinueDemo?.();
  };

  const handleViewFullGame = () => {
    // Could open a link, show purchase info, etc.
    onViewFullGame?.();

    // For now, show an alert with info
    alert(
      "The full game offers:\n\n• 15+ unique zones to explore\n• Deep storylines and character development\n• Advanced magic and combat systems\n• Multiple endings based on your choices\n\nVisit the game's page for more information!",
    );
  };

  const dialogStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '32px',
    borderRadius: '16px',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
    zIndex: 10001,
    textAlign: 'center',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '12px 24px',
    margin: '8px',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const continueButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '2px solid rgba(255,255,255,0.3)',
  };

  const fullGameButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: '#ffd166',
    color: '#333',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 10000,
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Dialog */}
      <div style={dialogStyle}>
        <div style={{ fontSize: '32px', marginBottom: '16px' }}>🎉</div>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '24px' }}>Thanks for playing the demo!</h2>
        <p style={{ margin: '0 0 24px 0', opacity: 0.9, lineHeight: 1.5 }}>
          You've experienced a taste of Gorstan's magical worlds. The full game offers much more
          adventure!
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            style={fullGameButtonStyle}
            onClick={handleViewFullGame}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.background = '#f0a500';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = '#ffd166';
            }}
          >
            ✨ See Full Game
          </button>

          <button
            style={continueButtonStyle}
            onClick={handleContinueDemo}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            }}
          >
            Keep Exploring (demo)
          </button>
        </div>
      </div>
    </>
  );
}
