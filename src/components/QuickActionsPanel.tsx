import { getRoom } from '../core/rooms/roomsLoader';
import { executeEffects } from '../utils/roomActions';
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
// Game module.
import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  Coffee, MousePointerClick, Backpack, Eye,
  Maximize2, Minimize2, Volume2, VolumeX,
  Grab, Hand, Armchair, Undo, PersonStanding, Bug, Redo, MessageCircle, MessageCircleQuestion
} from 'lucide-react';
import IconButton from './IconButton';

/**
 * Props interface for the QuickActionsPanel component
 * Enhanced with comprehensive typing for all game actions and controls
 */
interface QuickActionsPanelProps {
  availableDirections: {
    north: boolean;
    south: boolean;
    east: boolean;
    west: boolean;
    jump: boolean;
    sit: boolean;
    up: boolean;
    down: boolean;
  };
  directionRoomTitles: {
    north: string;
    south: string;
    east: string;
    west: string;
    jump: string;
    sit: string;
    up: string;
    down: string;
  };
  onShowInventory: () => void;
  onUse: () => void;
  onLookAround: () => void;
  onPickUp: () => void;
  onPress: () => void;
  onCoffee: () => void;
  onFullscreen: () => void;
  isFullscreen: boolean;
  soundOn: boolean;
  onToggleSound: () => void;
  onJump: () => void;
  onMove: (direction: string) => void;
  onSit: () => void;
  playerName: string;
  ctrlClickOnInstructions: boolean;
  onDebugMenu: () => void;
  onBackout: () => void;
  canBackout: boolean;
  currentRoomId: string; // Add this new prop
  npcsInRoom: any[]; // NPCs currently in the room
  onTalkToNPC: (npc?: any) => void; // Function to handle NPC conversation
  hasActiveTraps: boolean; // Whether current room has active traps
  onDisarmTrap: () => void; // Function to handle trap disarming
  isDemoActive?: boolean; // Whether demo mode is currently active
  onHelp?: () => void; // Open Ayla help modal
}

/**
 * QuickActionsPanel Component
 * 
 * Core Purpose: Provides quick access buttons for game actions with terminal-style UI.
 * 
 * Fixed Issues:
 * - Corrected component function signature syntax
 * - Removed duplicate IconButton elements
 * - Fixed broken JSX structure and missing props
 * - Enhanced error handling and timer management
 * - All buttons correctly wired with proper accessibility
 * - All game logic and functionality preserved
 */
const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({
  availableDirections,
  directionRoomTitles,
  onMove,
  onLookAround,
  onPickUp,
  onShowInventory,
  onUse,
  onPress,
  onCoffee,
  onFullscreen,
  isFullscreen,
  soundOn,
  onToggleSound,
  onJump,
  onSit,
  onDebugMenu,
  playerName,
  ctrlClickOnInstructions,
  onBackout,
  canBackout,
  currentRoomId,
  npcsInRoom,
  onTalkToNPC,
  hasActiveTraps,
  onDisarmTrap,
  isDemoActive = false,
  onHelp,
}) => {
  // State hooks properly placed inside component
  const [isSitting, setIsSitting] = useState<boolean>(false);
  const backoutSoundRef = useRef<HTMLAudioElement | null>(null);
  const sitTimerRef = useRef<number | null>(null);
  const resetTimerRef = useRef<number | null>(null);

  /**
   * Enhanced backout handler with improved audio error handling
   * Core Logic Preserved: Plays fail sound when backout is not available
   */
  const handleBackout = useCallback((): void => {
    if (canBackout) {
      onBackout();
    } else {
      // Play fail sound when backout is not available
      try {
        if (backoutSoundRef.current) {
          backoutSoundRef.current.currentTime = 0;
          const playPromise = backoutSoundRef.current.play();
          
          // Handle promise-based play() method in modern browsers
          if (playPromise !== undefined) {
            playPromise.catch((error: unknown) => {
              console.warn('[QuickActions] Audio play failed:', error);
            });
          }
        }
      } catch (error: unknown) {
        console.warn('[QuickActions] Audio error:', error);
      }
    }
  }, [canBackout, onBackout]);

  /**
   * Enhanced sit handler with proper timer management and cleanup
   * Core Logic Preserved: 3-second sitting animation with visual feedback
   */
  const handleSit = useCallback((): void => {
    if (isSitting) {return;} // Prevent multiple sit actions
    
    setIsSitting(true);
    
    // Call the actual sit function after a brief delay for visual feedback
    sitTimerRef.current = window.setTimeout(() => {
      onSit();
      
      // Reset sitting state after action completes
      resetTimerRef.current = window.setTimeout(() => {
        setIsSitting(false);
      }, 2500); // Slightly shorter than original for better UX
    }, 500);
  }, [onSit]); // Removed isSitting from dependency array for better performance

  /**
   * Enhanced talk handler with Ayla fallback
   * Opens NPC console with available NPCs or defaults to Ayla
   */
  const handleTalk = useCallback((): void => {
    if (npcsInRoom.length === 1) {
      // Single NPC - talk directly
      onTalkToNPC(npcsInRoom[0]);
    } else if (npcsInRoom.length > 1) {
      // Multiple NPCs - let user choose (handled by the onTalkToNPC function)
      onTalkToNPC();
    } else {
      // No NPCs present - default to Ayla
      const aylaHelper = {
        id: 'ayla',
        name: 'Ayla',
        description: 'Your helpful guide through the game',
        portrait: '/images/Ayla.png'
      };
      onTalkToNPC(aylaHelper);
    }
  }, [npcsInRoom, onTalkToNPC]);

  /**
   * Enhanced cleanup effect for proper timer management
   * Prevents memory leaks and handles component unmounting
   */
  useEffect(() => {
    return () => {
      // Clean up all timers when component unmounts
      if (sitTimerRef.current !== null) {
        clearTimeout(sitTimerRef.current);
        sitTimerRef.current = null;
      }
      if (resetTimerRef.current !== null) {
        clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
    };
  }, []); // Empty dependency array - only run on mount/unmount

  /**
   * Memoized debug visibility check for performance
   * Core Logic Preserved: Debug menu only shows for Geoff with Ctrl+Click
   */
  // Show debug if Geoff and either ctrlClickOnInstructions or debugMode is set
  const showDebug = useMemo((): boolean => {
    return playerName === "Geoff" && (ctrlClickOnInstructions || (typeof window !== 'undefined' && (window as any).debugMode));
  }, [playerName, ctrlClickOnInstructions]);

  /**
   * Fixed direction buttons with proper conditional rendering and no duplicates
   * Prevents unnecessary re-renders when other props change
   */
  const directionButtons = useMemo(() => {
    const defs: Array<{dir: keyof typeof availableDirections | 'jump' | 'sit'; icon: React.ReactNode; title: string; onClick?: () => void; dynamic?: boolean}> = [
      { dir: 'north', icon: <ArrowUp />, title: 'North' },
      { dir: 'south', icon: <ArrowDown />, title: 'South' },
      { dir: 'west', icon: <ArrowLeft />, title: 'West' },
      { dir: 'east', icon: <ArrowRight />, title: 'East' },
      { dir: 'up', icon: <ArrowUp />, title: 'Up' },
      { dir: 'down', icon: <ArrowDown />, title: 'Down' },
      { dir: 'jump', icon: <Redo />, title: 'Jump' },
      { dir: 'sit', icon: isSitting ? <PersonStanding /> : <Armchair />, title: isSitting ? 'Standing up...' : 'Sit' }
    ];
    return (
      <>
        {defs.map(d => {
          const available = (availableDirections as any)[d.dir] || false;
          const roomTitle = (directionRoomTitles as any)[d.dir] || '';
          const description = d.dir === 'sit'
            ? (isSitting ? 'You are sitting...' : 'Sit / rest')
            : d.dir === 'jump'
              ? `Special jump / portal${roomTitle ? ` to ${roomTitle}` : ''}`
              : `${available ? 'Move' : 'No exit'} ${d.title.toLowerCase()}${available && roomTitle ? ` to ${roomTitle}` : ''}`;
          const handle = () => {
            if (!available) {return;}
            if (d.dir === 'jump') { onJump(); return; }
            if (d.dir === 'sit') { handleSit(); return; }
            onMove(d.dir);
          };
          return (
            <IconButton
              key={d.dir}
              icon={d.icon}
              title={`${d.title}${roomTitle ? ` (${roomTitle})` : ''}`}
              description={description}
              onClick={handle}
              disabled={d.dir === 'sit' ? isSitting : !available}
            />
          );
        })}
      </>
    );
  }, [availableDirections, directionRoomTitles, onMove, onJump, handleSit, isSitting]);

  /**
   * Fixed core action buttons with missing icon prop
   */
  const coreActionButtons = useMemo(() => (
    <>
      <IconButton 
        key="look"
        icon={<Eye />} 
        title="Look Around" 
        description="Summarize room, items, NPCs and exits"
        onClick={onLookAround}
        aria-label="Look around the current area"
      />
      <IconButton 
        key="pickup"
        icon={<Grab />} 
        title="Pick Up Item" 
        description="Pick up available items in this room"
        onClick={onPickUp}
        aria-label="Pick up items in the area"
      />
      <IconButton 
        key="use"
        icon={<MousePointerClick />} 
        title="Use Item" 
        description="Use an item or interact with something"
        onClick={onUse}
        aria-label="Use or interact with items"
      />
      <IconButton 
        key="inventory"
        icon={<Backpack />} 
        title={isDemoActive ? "Inventory (disabled during demo)" : "Inventory"} 
        description="Open your inventory"
        onClick={isDemoActive ? () => {} : onShowInventory}
        aria-label="Open inventory"
        disabled={isDemoActive}
      />
      <IconButton 
        key="press"
        icon={<Hand />} 
        title={currentRoomId === 'introreset' ? "🟦 BLUE BUTTON" : "Press"} 
        description={currentRoomId === 'introreset' ? 'Press the mysterious blue button' : 'Press context-sensitive control'}
        onClick={onPress}
        aria-label={currentRoomId === 'introreset' ? "Press the mysterious blue button" : "Press buttons or switches"}
      />
      <IconButton 
        key="coffee"
        icon={<Coffee />}
        title="Throw or Drink Coffee (essential game mechanic)" 
        description="Perform a coffee action (throw / drink)"
        onClick={onCoffee}
        aria-label="Coffee-related actions - because caffeine is life"
      />
      <IconButton 
        key="talk"
        icon={npcsInRoom.length > 0 ? <MessageCircle /> : <MessageCircleQuestion />}
        title={npcsInRoom.length > 0 ? 
          `Talk to ${npcsInRoom.length === 1 ? npcsInRoom[0].name || npcsInRoom[0] : 'NPCs'}` : 
          "Talk to NPC/Help"
        }
        description={npcsInRoom.length > 0 ? 'Open conversation interface' : 'Open Ayla help / NPC console'}
        onClick={handleTalk}
        aria-label={npcsInRoom.length > 0 ? "Talk to NPCs in the room" : "Talk to NPCs or get help"}
      />
      {onHelp && (
        <IconButton
          key="help"
          icon={<MessageCircleQuestion />}
          title="Help / Ask Ayla"
          description="Open Ayla assistance panel"
          onClick={onHelp}
          aria-label="Open Ayla help"
        />
      )}
      {hasActiveTraps && (
        <IconButton 
          key="disarm"
          icon={<img src="/images/Caution.png" alt="Trap Warning" style={{ width: 20, height: 20 }} />}
          title="Manage Traps"
          description="Inspect or disarm traps here"
          onClick={onDisarmTrap}
          aria-label="Manage traps in this area"
        />
      )}
    </>
  ), [onLookAround, onPickUp, onUse, onShowInventory, onPress, onCoffee, handleTalk, npcsInRoom, hasActiveTraps, onDisarmTrap]);

  /**
   * Fixed system control buttons with missing closing bracket
   */
  const systemControlButtons = useMemo(() => (
    <>
      <IconButton
        key="sound"
        icon={soundOn ? <Volume2 /> : <VolumeX />}
        title={soundOn ? "Sound On (Click to Mute)" : "Sound Off (Click to Enable)"}
        description={soundOn ? 'Mute all game sounds' : 'Enable game sounds'}
        onClick={onToggleSound}
        aria-label={soundOn ? "Mute audio" : "Enable audio"}
      />
      <IconButton
        key="fullscreen"
        icon={isFullscreen ? <Minimize2 /> : <Maximize2 />}
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        description={isFullscreen ? 'Leave fullscreen mode' : 'Enter fullscreen for immersion'}
        onClick={onFullscreen}
        aria-label={isFullscreen ? "Exit fullscreen mode" : "Enter fullscreen mode"}
      />
  <IconButton 
        key="backout"
        icon={<Undo />} 
        title={canBackout ? "Back to Previous Room" : "Cannot go back (no previous room)"} 
     description={canBackout ? 'Return to the last room visited' : 'No previous room available'}
        onClick={handleBackout} 
        disabled={!canBackout}
        aria-label={canBackout ? "Return to previous room" : "No previous room to return to"}
      />
      {showDebug && (
        <IconButton 
          key="debug"
          icon={<Bug />} 
          title="Debug Menu (Developer Access)" 
          description="Open developer debug tools"
          onClick={onDebugMenu}
          aria-label="Open debug menu"
        />
      )}
    </>
  ), [soundOn, onToggleSound, isFullscreen, onFullscreen, canBackout, handleBackout, showDebug, onDebugMenu]);

  return (
    <div 
      className="quick-actions-panel flex flex-wrap gap-2 justify-center p-4 bg-black/30 backdrop-blur rounded-xl"
      role="toolbar"
      aria-label="Game Action Controls"
    >
      {/* Movement Controls */}
      <div className="contents" role="group" aria-label="Movement">
        {directionButtons}
      </div>

      {/* Core Game Actions */}
      <div className="contents" role="group" aria-label="Game Actions">
        {coreActionButtons}
      </div>

      {/* System Controls */}
      <div className="contents" role="group" aria-label="System Controls">
        {systemControlButtons}
      </div>

      {/* Audio element for backout fail sound - Core Logic Preserved */}
      <audio 
        ref={backoutSoundRef} 
        src="/audio/fail.wav" 
        preload="auto"
        aria-hidden="true"
      />
    </div>
  );
};

export default QuickActionsPanel;
