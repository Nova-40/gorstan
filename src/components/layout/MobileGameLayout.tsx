/**
 * Mobile Game Layout Component
 * Adaptive layout optimized for mobile devices and tablets
 */

import React, { useState, useEffect, useRef } from 'react';
import { useResponsive, ResponsiveButton } from '../ui/ResponsiveUI';
import { setupGestureHandling, type GestureHandlers } from '../../utils/mobileOptimization';

interface MobileGameLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  bottomPanel?: React.ReactNode;
  floatingActions?: React.ReactNode;
  onMenuToggle?: () => void;
  gameState?: any;
  className?: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, children }) => {
  
  return (
    <div className={`mobile-menu ${isOpen ? 'open' : 'closed'}`}>
      <div className="mobile-menu-overlay" onClick={onClose} />
      <div className="mobile-menu-content">
        <div className="mobile-menu-header">
          <ResponsiveButton onClick={onClose} size="large">
            ✕
          </ResponsiveButton>
        </div>
        <div className="mobile-menu-body">
          {children}
        </div>
      </div>
    </div>
  );
};

const MobileGameLayout: React.FC<MobileGameLayoutProps> = ({
  children,
  sidebar,
  bottomPanel,
  floatingActions,
  onMenuToggle,
  gameState,
  className = ''
}) => {
  const { deviceInfo } = useResponsive();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPanel, setCurrentPanel] = useState<'game' | 'inventory' | 'map' | 'settings'>('game');
  const [isBottomPanelExpanded, setIsBottomPanelExpanded] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(deviceInfo.orientation);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const bottomPanelRef = useRef<HTMLDivElement>(null);

  // Handle orientation changes
  useEffect(() => {
    const handleOrientationChange = () => {
      setTimeout(() => {
        setOrientation(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
      }, 100);
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  // Setup gesture handling
  useEffect(() => {
    if (gameAreaRef.current && deviceInfo.isTouchDevice) {
      const gestureHandlers: GestureHandlers = {
        onSwipeLeft: () => {
          if (orientation === 'landscape') {
            setCurrentPanel('inventory');
          }
        },
        onSwipeRight: () => {
          if (orientation === 'landscape') {
            setCurrentPanel('game');
          } else {
            setIsMobileMenuOpen(true);
          }
        },
        onSwipeUp: () => {
          if (orientation === 'portrait' && bottomPanel) {
            setIsBottomPanelExpanded(true);
          }
        },
        onSwipeDown: () => {
          if (orientation === 'portrait' && isBottomPanelExpanded) {
            setIsBottomPanelExpanded(false);
          }
        },
        onLongPress: (x, y) => {
          // Show context menu or action palette
          console.log('Long press at', x, y);
        }
      };

      setupGestureHandling(gameAreaRef.current, gestureHandlers);
    }
  }, [gameAreaRef.current, deviceInfo.isTouchDevice, orientation, bottomPanel, isBottomPanelExpanded]);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    onMenuToggle?.();
  };

  const handlePanelSwitch = (panel: typeof currentPanel) => {
    setCurrentPanel(panel);
    if (deviceInfo.isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const renderMobileHeader = () => (
    <div className="mobile-header">
      <div className="mobile-header-content">
        <ResponsiveButton
          onClick={handleMenuToggle}
          className="menu-button"
          size="large"
        >
          ☰
        </ResponsiveButton>
        
        <div className="game-status">
          {gameState?.currentRoom && (
            <span className="current-room">{gameState.currentRoom.name}</span>
          )}
          {gameState?.player?.health !== undefined && (
            <span className="health-indicator">
              ❤️ {gameState.player.health}
            </span>
          )}
        </div>
        
        <div className="header-actions">
          {gameState?.player?.experience !== undefined && (
            <span className="xp-indicator">
              ⭐ {gameState.player.experience}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const renderTabBar = () => (
    <div className="mobile-tab-bar">
      <ResponsiveButton
        onClick={() => handlePanelSwitch('game')}
        className={`tab-button ${currentPanel === 'game' ? 'active' : ''}`}
        size="medium"
      >
        🎮 Game
      </ResponsiveButton>
      
      <ResponsiveButton
        onClick={() => handlePanelSwitch('inventory')}
        className={`tab-button ${currentPanel === 'inventory' ? 'active' : ''}`}
        size="medium"
      >
        🎒 Items
      </ResponsiveButton>
      
      <ResponsiveButton
        onClick={() => handlePanelSwitch('map')}
        className={`tab-button ${currentPanel === 'map' ? 'active' : ''}`}
        size="medium"
      >
        🗺️ Map
      </ResponsiveButton>
      
      <ResponsiveButton
        onClick={() => handlePanelSwitch('settings')}
        className={`tab-button ${currentPanel === 'settings' ? 'active' : ''}`}
        size="medium"
      >
        ⚙️ Menu
      </ResponsiveButton>
    </div>
  );

  const renderBottomPanel = () => {
    if (!bottomPanel) return null;
    
    return (
      <div 
        ref={bottomPanelRef}
        className={`mobile-bottom-panel ${isBottomPanelExpanded ? 'expanded' : 'collapsed'}`}
      >
        <div 
          className="panel-handle"
          onClick={() => setIsBottomPanelExpanded(!isBottomPanelExpanded)}
        >
          <div className="handle-indicator" />
        </div>
        <div className="panel-content">
          {bottomPanel}
        </div>
      </div>
    );
  };

  const renderFloatingActions = () => {
    if (!floatingActions || !deviceInfo.isMobile) return null;
    
    return (
      <div className="floating-actions">
        {floatingActions}
      </div>
    );
  };

  if (deviceInfo.isDesktop) {
    // Desktop layout
    return (
      <div className={`game-layout desktop-layout ${className}`}>
        <div className="desktop-sidebar">
          {sidebar}
        </div>
        <div className="desktop-main">
          {children}
        </div>
        {bottomPanel && (
          <div className="desktop-bottom-panel">
            {bottomPanel}
          </div>
        )}
      </div>
    );
  }

  if (orientation === 'landscape' && deviceInfo.isTablet) {
    // Tablet landscape layout
    return (
      <div className={`game-layout tablet-landscape ${className}`}>
        {renderMobileHeader()}
        
        <div className="tablet-main">
          <div className="tablet-game-area" ref={gameAreaRef}>
            {children}
          </div>
          
          <div className="tablet-sidebar">
            <div className="panel-switcher">
              <ResponsiveButton
                onClick={() => setCurrentPanel('inventory')}
                className={currentPanel === 'inventory' ? 'active' : ''}
                size="small"
              >
                Inventory
              </ResponsiveButton>
              <ResponsiveButton
                onClick={() => setCurrentPanel('map')}
                className={currentPanel === 'map' ? 'active' : ''}
                size="small"
              >
                Map
              </ResponsiveButton>
            </div>
            
            <div className="panel-content">
              {currentPanel === 'inventory' && sidebar}
              {currentPanel === 'map' && <div>Map content</div>}
            </div>
          </div>
        </div>
        
        {renderBottomPanel()}
        {renderFloatingActions()}
      </div>
    );
  }

  // Mobile portrait layout
  return (
    <div className={`game-layout mobile-layout ${orientation} ${className}`}>
      {renderMobileHeader()}
      
      <div className="mobile-main">
        <div className="mobile-game-area" ref={gameAreaRef}>
          {currentPanel === 'game' && children}
          {currentPanel === 'inventory' && sidebar}
          {currentPanel === 'map' && <div>Map content</div>}
          {currentPanel === 'settings' && <div>Settings content</div>}
        </div>
      </div>
      
      {renderTabBar()}
      {renderBottomPanel()}
      {renderFloatingActions()}
      
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
        {sidebar}
      </MobileMenu>
    </div>
  );
};

// Safe area utilities for mobile browsers
const SafeAreaContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`safe-area-container ${className}`}>
    {children}
  </div>
);

// Virtual keyboard utilities
const useVirtualKeyboard = () => {
  const [isVirtualKeyboardOpen, setIsVirtualKeyboardOpen] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      const newHeight = window.innerHeight;
      const heightDifference = viewportHeight - newHeight;
      
      // If height decreased significantly, assume virtual keyboard opened
      setIsVirtualKeyboardOpen(heightDifference > 150);
      setViewportHeight(newHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewportHeight]);

  return { isVirtualKeyboardOpen };
};

// Mobile-specific CSS
const mobileLayoutCSS = `
  /* Base mobile layout styles */
  .game-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    height: 100dvh; /* Dynamic viewport height for mobile */
    overflow: hidden;
  }
  
  .safe-area-container {
    padding-top: env(safe-area-inset-top);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
    padding-bottom: env(safe-area-inset-bottom);
  }
  
  /* Mobile header */
  .mobile-header {
    background: #1F2937;
    color: white;
    padding: 8px 16px;
    flex-shrink: 0;
    border-bottom: 1px solid #374151;
  }
  
  .mobile-header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  
  .menu-button {
    background: transparent;
    border: 1px solid #6B7280;
    color: white;
    min-width: 44px;
    min-height: 44px;
  }
  
  .game-status {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    font-size: 0.875rem;
  }
  
  .current-room {
    font-weight: 600;
  }
  
  .health-indicator,
  .xp-indicator {
    font-size: 0.75rem;
    color: #D1D5DB;
  }
  
  /* Mobile main content */
  .mobile-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  .mobile-game-area {
    flex: 1;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding: 16px;
  }
  
  /* Tab bar */
  .mobile-tab-bar {
    display: flex;
    background: #1F2937;
    border-top: 1px solid #374151;
    padding: 8px;
    gap: 4px;
    flex-shrink: 0;
  }
  
  .tab-button {
    flex: 1;
    background: transparent;
    border: 1px solid #6B7280;
    color: #D1D5DB;
    padding: 8px 4px;
    font-size: 0.75rem;
    min-height: 44px;
  }
  
  .tab-button.active {
    background: #3B82F6;
    border-color: #3B82F6;
    color: white;
  }
  
  /* Mobile menu */
  .mobile-menu {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    pointer-events: none;
  }
  
  .mobile-menu.open {
    pointer-events: auto;
  }
  
  .mobile-menu-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .mobile-menu.open .mobile-menu-overlay {
    opacity: 1;
  }
  
  .mobile-menu-content {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 280px;
    max-width: 80vw;
    background: #1F2937;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    display: flex;
    flex-direction: column;
  }
  
  .mobile-menu.open .mobile-menu-content {
    transform: translateX(0);
  }
  
  .mobile-menu-header {
    padding: 16px;
    border-bottom: 1px solid #374151;
    display: flex;
    justify-content: flex-end;
  }
  
  .mobile-menu-body {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  /* Bottom panel */
  .mobile-bottom-panel {
    background: #1F2937;
    border-top: 1px solid #374151;
    transition: height 0.3s ease;
    position: relative;
    flex-shrink: 0;
  }
  
  .mobile-bottom-panel.collapsed {
    height: 60px;
  }
  
  .mobile-bottom-panel.expanded {
    height: 40vh;
    max-height: 400px;
  }
  
  .panel-handle {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-bottom: 1px solid #374151;
  }
  
  .handle-indicator {
    width: 40px;
    height: 4px;
    background: #6B7280;
    border-radius: 2px;
  }
  
  .panel-content {
    height: calc(100% - 40px);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 16px;
  }
  
  /* Floating actions */
  .floating-actions {
    position: fixed;
    bottom: 80px;
    right: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 100;
  }
  
  /* Tablet landscape layout */
  .tablet-landscape .tablet-main {
    display: flex;
    flex: 1;
    overflow: hidden;
  }
  
  .tablet-landscape .tablet-game-area {
    flex: 1;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .tablet-landscape .tablet-sidebar {
    width: 300px;
    background: #1F2937;
    border-left: 1px solid #374151;
    display: flex;
    flex-direction: column;
  }
  
  .panel-switcher {
    display: flex;
    padding: 8px;
    gap: 4px;
    border-bottom: 1px solid #374151;
  }
  
  .panel-switcher button {
    flex: 1;
    background: transparent;
    border: 1px solid #6B7280;
    color: #D1D5DB;
  }
  
  .panel-switcher button.active {
    background: #3B82F6;
    border-color: #3B82F6;
    color: white;
  }
  
  /* Desktop layout fallback */
  .desktop-layout {
    flex-direction: row;
  }
  
  .desktop-sidebar {
    width: 300px;
    background: #1F2937;
    border-right: 1px solid #374151;
  }
  
  .desktop-main {
    flex: 1;
    overflow: auto;
  }
  
  .desktop-bottom-panel {
    height: 200px;
    background: #1F2937;
    border-top: 1px solid #374151;
  }
  
  /* Touch optimizations */
  @media (pointer: coarse) {
    .game-layout button,
    .game-layout [role="button"] {
      min-height: 44px;
      min-width: 44px;
    }
    
    .mobile-game-area {
      touch-action: pan-y;
    }
  }
  
  /* Landscape orientation adjustments */
  @media (orientation: landscape) and (max-height: 500px) {
    .mobile-header {
      padding: 4px 16px;
    }
    
    .mobile-tab-bar {
      padding: 4px;
    }
    
    .mobile-bottom-panel.collapsed {
      height: 50px;
    }
    
    .panel-handle {
      height: 30px;
    }
  }
  
  /* Virtual keyboard compensation */
  .virtual-keyboard-open .mobile-bottom-panel {
    display: none;
  }
  
  .virtual-keyboard-open .mobile-tab-bar {
    display: none;
  }
`;

export default MobileGameLayout;
export { SafeAreaContainer, useVirtualKeyboard, mobileLayoutCSS };
