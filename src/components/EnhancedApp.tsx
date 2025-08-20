/**
 * Enhanced App Component with Mobile and Accessibility Support
 * Integrates responsive design, mobile optimization, and accessibility features
 */

import React, { useEffect, useState } from 'react';
import { ResponsiveProvider, responsiveCSS } from '../components/ui/ResponsiveUI';
import MobileGameLayout, { mobileLayoutCSS } from '../components/layout/MobileGameLayout';
import { initializeAccessibility, type AccessibilityConfig } from '../utils/accessibility';
import { detectDevice, setupMobileViewport, optimizeForTouch } from '../utils/mobileOptimization';

// Game components imports (assuming these exist)
// import GameArea from '../components/game/GameArea';
// import Inventory from '../components/game/Inventory';
// import ActionPanel from '../components/game/ActionPanel';

interface EnhancedAppProps {
  initialGameState?: any;
  onGameStateChange?: (state: any) => void;
}

const EnhancedApp: React.FC<EnhancedAppProps> = ({
  initialGameState = {},
  onGameStateChange
}) => {
  const [gameState, setGameState] = useState(initialGameState);
  const [isAccessibilityEnabled, setIsAccessibilityEnabled] = useState(false);
  const [accessibilityFeatures, setAccessibilityFeatures] = useState<any>(null);

  // Initialize mobile optimizations and accessibility
  useEffect(() => {
    const deviceInfo = detectDevice();
    
    // Setup mobile viewport and optimizations
    if (deviceInfo.isMobile || deviceInfo.isTablet) {
      setupMobileViewport();
      optimizeForTouch();
    }

    // Initialize accessibility features
    const accessibilityConfig: AccessibilityConfig = {
      screenReader: {
        enabled: true,
        announceActions: true,
        announceMovement: true,
        announceStateChanges: true,
        speakRoomDescriptions: true,
        speakCombatResults: true,
      },
      keyboard: {
        navigationEnabled: true,
        shortcuts: new Map(),
        focusVisible: true,
        skipLinks: true,
        tabTrapEnabled: true,
      },
      visual: {
        highContrast: window.matchMedia('(prefers-contrast: high)').matches,
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        fontSize: 'medium',
        colorBlindSupport: 'none',
        focusIndicator: 'normal',
        flashingSuppression: false,
      },
      audio: {
        soundEnabled: true,
        musicEnabled: true,
        sfxEnabled: true,
        voiceEnabled: true,
        volume: 0.7,
        audioDescriptions: false,
      },
      motor: {
        clickDelay: 0,
        holdDuration: 500,
        swipeThreshold: 50,
        largerTouchTargets: deviceInfo.isTouchDevice,
        oneHandMode: deviceInfo.isMobile,
        voiceCommands: false,
      },
    };

    const accessibility = initializeAccessibility(accessibilityConfig);
    setAccessibilityFeatures(accessibility);
    setIsAccessibilityEnabled(true);

    // Add CSS for mobile and accessibility features
    const style = document.createElement('style');
    style.textContent = responsiveCSS + '\n' + mobileLayoutCSS;
    document.head.appendChild(style);

    return () => {
      // Cleanup
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  const handleGameStateUpdate = (newState: any) => {
    setGameState(newState);
    onGameStateChange?.(newState);
    
    // Announce important state changes to screen readers
    if (accessibilityFeatures?.screenReader && isAccessibilityEnabled) {
      if (newState.currentRoom?.name !== gameState.currentRoom?.name) {
        accessibilityFeatures.screenReader.announceRoomEntry(
          newState.currentRoom.name,
          newState.currentRoom.description
        );
      }
      
      if (newState.player?.health !== gameState.player?.health) {
        const healthChange = (newState.player?.health || 0) - (gameState.player?.health || 0);
        accessibilityFeatures.screenReader.announceHealthChange(
          newState.player.health,
          newState.player.maxHealth || 100,
          healthChange
        );
      }
    }
  };

  const handleMenuToggle = () => {
    if (accessibilityFeatures?.screenReader) {
      accessibilityFeatures.screenReader.announceAction('Menu', 'Menu toggled');
    }
  };

  // Placeholder game components - replace with actual components
  const GameArea = () => (
    <div id="game-area" className="p-4 bg-gray-900 text-white rounded">
      <h2 className="text-xl font-bold mb-4">Game Area</h2>
      <p>Current Room: {gameState.currentRoom?.name || 'Starting Room'}</p>
      <p>Player Health: {gameState.player?.health || 100}</p>
      <div className="mt-4 space-y-2">
        <button 
          onClick={() => handleGameStateUpdate({
            ...gameState,
            currentRoom: { name: 'Forest', description: 'A dark and mysterious forest' }
          })}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          Explore Forest
        </button>
        <button 
          onClick={() => handleGameStateUpdate({
            ...gameState,
            player: { ...gameState.player, health: (gameState.player?.health || 100) - 10 }
          })}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
        >
          Take Damage
        </button>
      </div>
    </div>
  );

  const Inventory = () => (
    <div id="inventory" className="p-4 bg-gray-800 text-white rounded">
      <h3 className="text-lg font-bold mb-2">Inventory</h3>
      <div className="space-y-1 text-sm">
        <div>🗡️ Sword</div>
        <div>🛡️ Shield</div>
        <div>🧪 Health Potion</div>
      </div>
    </div>
  );

  const ActionPanel = () => (
    <div id="actions" className="p-4 bg-gray-700 text-white rounded">
      <h3 className="text-lg font-bold mb-2">Actions</h3>
      <div className="grid grid-cols-2 gap-2">
        <button className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors text-sm">
          🔍 Look
        </button>
        <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm">
          🚪 Move
        </button>
        <button className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors text-sm">
          ✨ Cast Spell
        </button>
        <button className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors text-sm">
          ⚔️ Attack
        </button>
      </div>
    </div>
  );

  const FloatingActions = () => (
    <div className="space-y-2">
      <button 
        className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center text-xl shadow-lg"
        onClick={() => accessibilityFeatures?.screenReader?.describeGameState(gameState)}
        title="Describe current game state"
      >
        🔊
      </button>
      <button 
        className="w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center text-xl shadow-lg"
        onClick={() => {
          const help = `
            You are in ${gameState.currentRoom?.name || 'the starting area'}. 
            Your health is ${gameState.player?.health || 100}. 
            Available actions include: Look, Move, Cast Spell, and Attack.
            Use the tab key to navigate between interactive elements.
          `;
          accessibilityFeatures?.screenReader?.speak(help);
        }}
        title="Get help and instructions"
      >
        ❓
      </button>
    </div>
  );

  if (!isAccessibilityEnabled) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Initializing accessibility features...</p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveProvider>
      <div className="enhanced-app min-h-screen bg-gray-900">
        {/* Skip links for accessibility */}
        <div className="sr-only">
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <a href="#game-area" className="skip-link">Skip to game area</a>
          <a href="#inventory" className="skip-link">Skip to inventory</a>
          <a href="#actions" className="skip-link">Skip to actions</a>
        </div>

        <MobileGameLayout
          onMenuToggle={handleMenuToggle}
          gameState={gameState}
          sidebar={<Inventory />}
          bottomPanel={<ActionPanel />}
          floatingActions={<FloatingActions />}
          className="min-h-screen"
        >
          <main id="main-content">
            <GameArea />
          </main>
        </MobileGameLayout>

        {/* Accessibility announcements region */}
        <div aria-live="polite" aria-atomic="true" className="sr-only" id="announcements"></div>
        <div aria-live="assertive" aria-atomic="true" className="sr-only" id="urgent-announcements"></div>
      </div>
    </ResponsiveProvider>
  );
};

export default EnhancedApp;
