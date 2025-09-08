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

// src/components/AppCore.tsx
// Gorstan Game Beta 3
// Gorstan and characters (c) Geoff Webster 2025
// Main game controller UI and logic routing.

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import '../styles/GameUI.css';
import { lazyFeature } from '../utils/lazyLoading';
import { useStableCallback } from '../utils/performanceOptimization';

import CommandInput from './CommandInput';
// Lazy load heavy transition components
const DramaticWaitTransition = lazyFeature(() => import('./animations/DramaticWaitTransition'));
const JumpTransition = lazyFeature(() => import('./animations/JumpTransition'));
const SipTransition = lazyFeature(() => import('./animations/SipTransition'));
const WaitTransition = lazyFeature(() => import('./animations/WaitTransition'));
import MultiverseRebootSequence from './MultiverseRebootSequence';
import PlayerNameCapture from './PlayerNameCapture';
import PlayerStatsPanel from './PlayerStatsPanel';
import PresentNPCsPanel from './PresentNPCsPanel';
import ObjectivePanel from './ObjectivePanel';
import { installObjectivesNudger, registerActivity, uninstallObjectivesNudger } from '../core/objectives/nudger';
import AylaPanel from './AylaPanel';
import InventoryPanel from './InventoryPanel';
import DebugPanel from './DebugPanel';
import RoomRenderer from './RoomRenderer';
import RoomTransition from './animations/RoomTransition';
import SplashScreen from './SplashScreen';
import TeletypeIntro from './TeletypeIntro';
import { ConsoleTerminal } from './game/ConsoleTerminal';
import WelcomeScreen from './WelcomeScreen';
import { RouteSelectScreen } from './RouteSelectScreen';
import TeleportManager from './animations/TeleportManager';
import QuickActionsPanel from './QuickActionsPanel';
import CombatActionsPanel from '../ui/QuickActionsPanel';
import BlueButtonWarningModal from './BlueButtonWarningModal';
import QuickWinNotifications from './QuickWinNotifications';
import ProgressDashboard from './ProgressDashboard';
import { setGameDispatch } from '../utils/dispatchAccess';

import { useFlags } from '../hooks/useFlags';
import { useGameState } from '../state/gameState';
import { useLibrarianLogic } from '../hooks/useLibrarianLogic';
import { useModuleLoader } from '../hooks/useModuleLoader';
import { useOptimizedEffects } from '../hooks/useOptimizedEffects';
import { useRoomTransition } from '../hooks/useRoomTransition';
import { useWendellLogic } from '../hooks/useWendellLogic';

import { initializeAchievementEngine } from '../logic/achievementEngine';
import { initializeScoreManager } from '../state/scoreManager';
import { initializeCodexTracker } from '../logic/codexTracker';
import { initializeMiniquests } from '../engine/miniquestInitializer';
import { loadCelebrationIndex } from '../celebrate/index';
import { initializeWanderingNPCs, handleRoomEntryForWanderingNPCs } from '../engine/wanderingNPCController';
import { handleRoomEntry } from '../engine/roomEventHandler';
import { getAllRoomsAsObject } from '../utils/roomLoader';
// Fallback loader removed / deprecated – dynamic room loader handles absence.
import { performanceMonitor } from '../utils/performanceMonitor';
import { onRoomEntry, periodicConversationCheck } from '../npc/triggers';
import { getTrapByRoom } from '../engine/trapController';

import { UseItemModal } from "./UseItemModal";
import { InventoryModal } from "./InventoryModal";
import ModalOverlay from './ModalOverlay';
import PickUpItemModal from './PickUpItemModal';
import SaveGameModal from './SaveGameModal';
import { SaveManager } from '../services/SaveManager';
import NPCConsole from './NPCConsole';
import EnhancedNPCConsole from './EnhancedNPCConsole';
import Modal from './Modal';
import AylaHintPopup from './AylaHintPopup';
import { npcReact } from '../engine/npcEngine';
import { npcRegistry } from '../npcs/npcMemory';
// Lazy load AI components and modals
const UnifiedAIPopup = lazyFeature(() => import('./UnifiedAIPopup'));
const AIMonitorDisplay = lazyFeature(() => import('./AIMonitorDisplay'));
const TrapManagementModal = lazyFeature(() => import('./TrapManagementModal'));
const NPCSelectionModal = lazyFeature(() => import('./NPCSelectionModal'));
const PerformanceDashboard = lazyFeature(() => import('./PerformanceDashboard'));
import { AylaHintSystem } from '../services/aylaHintSystem';
import type { AylaHintResponse } from '../services/aylaHintSystem';
import { unifiedAI } from '../services/unifiedAI';
import type { AIGuidanceResponse } from '../services/unifiedAI';
import { aiUsageMonitor } from '../services/aiUsageMonitor';
import type { GameplayUpdate } from '../services/aiUsageMonitor';
import { npcAI } from '../services/npcAI';
import { itemDescriptions } from '../data/itemDescriptions';

import type { Room } from '../types/Room';
import type { NPC, NPCMood } from '../types/NPCTypes';
import { demoController } from '../demo/demoController';
import { isDemoEnvironment } from '../demo/demoGate';
import type { GameTransition } from '../types/GameTypes';

/**
 * Enhanced type definitions for better type safety
 */
type GameStage = 'splash' | 'welcome' | 'nameCapture' | 'routeSelect' | 'intro' | 'demo' | 'game' | 'trialsGame' |
  'transition_jump' | 'transition_sip' | 'transition_wait' | 'transition_dramatic_wait';

type OpenModalType = 'inventory' | 'useItem' | 'look' | 'pickUp' | 'saveGame' | 'npcConsole' | 'npcSelection' | 'trapManagement' | null;

type TeleportType = "fractal" | "trek" | null;

/**
 * Interface for intro completion data with proper typing
 */
interface IntroCompletionData {
  route: string;
  targetRoom?: string;
  inventoryBonus?: string[];
}

/**
 * Enhanced item type for better type safety
 */
interface Item {
  name: string;
  [key: string]: any;
}

/**
 * AppCore Component
 * 
 * Core Purpose: Main game controller that orchestrates UI, logic routing,
 * and state management for the Gorstan game.
 * 
 * Fixed Issues:
 * - Removed duplicate function definitions and variable declarations
 * - Fixed syntax errors and malformed code blocks
 * - Corrected component structure and export statement
 * - Maintained all game logic and functionality
 * - Enhanced type safety throughout
 */
const AppCore: React.FC = () => {
  // Enhanced state with proper typing
  const { state, dispatch } = useGameState();
  performanceMonitor.markRenderStart();
  // Objectives nudger lifecycle
  // Install objectives nudger once (internal interval references getState each tick); avoid reinstall every state change
  useEffect(() => { installObjectivesNudger(()=>state); return () => uninstallObjectivesNudger();   }, []);
  // Debounced autosave on key state changes
  // Lightweight autosave on coarse-grained triggers (room change, inventory count change)
  const inventoryCount = state.player?.inventory?.length || 0;
  useEffect(() => {
    const t = setTimeout(() => {
      try { SaveManager.save(0, state as any); } catch {}
    }, 800);
    return () => clearTimeout(t);
  }, [state.currentRoomId, inventoryCount]);
  // Expose dispatch globally for service modules
  useEffect(() => { setGameDispatch(dispatch); return () => setGameDispatch(() => ({} as any)); }, [dispatch]);
  const { hasFlag } = useFlags();
  const { loadModule } = useModuleLoader();

  // Teleport state with proper typing
  const [teleportType, setTeleportType] = useState<TeleportType>(null);
  const [teleportCallback, setTeleportCallback] = useState<() => void>(() => () => {});

  // Transition state with enhanced typing
  const [transitionType, setTransitionType] = useState<string | null>(null);
  const [readyForTransition, setReadyForTransition] = useState<boolean>(false);
  const [transitionTargetRoom, setTransitionTargetRoom] = useState<string>('controlnexus');
  const [transitionInventory, setTransitionInventory] = useState<string[]>([]);
  const [lastMovementAction, setLastMovementAction] = useState<string>('');
  const [roomTransitionActive, setRoomTransitionActive] = useState<boolean>(false);
  const [previousRoom, setPreviousRoom] = useState<Room | null>(null);

  // Modal state with proper typing
  const [modal, setModal] = useState<OpenModalType>(null);
  const [lookLines, setLookLines] = useState<string[]>([]);
  const lookModalTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedNPC, setSelectedNPC] = useState<NPC | null>(null);
  const [isGroupConversation, setIsGroupConversation] = useState(false);
  const [showAylaModal, setShowAylaModal] = useState(false);

  // Ayla hint system state
  const [currentHint, setCurrentHint] = useState<AylaHintResponse | null>(null);
  const [currentGuidance, setCurrentGuidance] = useState<AIGuidanceResponse | null>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [roomEntryTime, setRoomEntryTime] = useState<number>(Date.now());
  const [aylaHintSystem] = useState(() => new AylaHintSystem());
  const [ephemeralAyla, setEphemeralAyla] = useState<Array<{ id: string; content: string; expiresAt: number }>>([]);

  // AI Usage Monitoring state
  const [gameplayUpdates, setGameplayUpdates] = useState<GameplayUpdate[]>([]);
  const [showAIMonitor, setShowAIMonitor] = useState<boolean>(false);
  const [npcBehaviors, setNpcBehaviors] = useState<Record<string, string>>({});

  // Save game state - Enhanced with migration support
  const [saveSlots, setSaveSlots] = useState<Array<{
    id: string;
    name: string;
    playerName: string;
    currentRoom: string;
    timestamp: number;
    score: number;
    playTime: number;
  }>>([]);

  // System state with enhanced typing
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [lastShownRoomDescription, setLastShownRoomDescription] = useState<string | null>(null);
  const [roomFallbackAttempted, setRoomFallbackAttempted] = useState<boolean>(false);
  const [roomHistory, setRoomHistory] = useState<string[]>([]);
  const [showPerformanceDashboard, setShowPerformanceDashboard] = useState<boolean>(false);

  // Demo system state
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [isDemo] = useState<boolean>(isDemoEnvironment());

  const handleRoomChange = useStableCallback((newRoomId: string) => {
    console.log('[AppCore] handleRoomChange called with:', newRoomId);
    if (newRoomId !== currentRoomId) {
      // Store current room in history before moving
      setRoomHistory(prev => [...prev, currentRoomId]);
      // Update previousRoom to current room before changing
      if (room) {
        setPreviousRoom(room);
      }

      // Check if this is a zone change to trigger teleport animation
      const currentZone = room?.zone;
      const newRoom = roomMap[newRoomId];
      const newZone = newRoom?.zone;
      
      if (currentZone && newZone && currentZone !== newZone) {
        console.log('[AppCore] Zone change detected:', currentZone, '→', newZone);
        
        // Determine teleport type based on zones
        const teleportType = newZone === 'glitchZone' ? 'fractal' : 'trek';
        
        // Set up teleport animation with callback to complete the room change
        setTeleportType(teleportType);
        setTeleportCallback(() => () => {
          console.log('[AppCore] Teleport animation complete, changing room');
          dispatch({ type: "MOVE_TO_ROOM", payload: newRoomId });
        });
      } else {
        // Same zone or no zone info - direct room change
        console.log('[AppCore] Same zone movement, direct change');
        dispatch({ type: "MOVE_TO_ROOM", payload: newRoomId });
      }
    }
  }, [state.currentRoomId, setTeleportType, dispatch]);

const handleBackout = useCallback((): void => {
    const count = roomHistory.length;

    if (!roomHistory || count === 0) {
      dispatch({ type: 'ADD_MESSAGE', payload: { id: Date.now().toString(), text: "You can't go back." , type: 'system', timestamp: Date.now() } });
      return;
    }

    const previousRoomId = roomHistory[count - 1];
    setRoomHistory(prev => prev.slice(0, -1));
    dispatch({ type: 'MOVE_TO_ROOM', payload: previousRoomId });

    const sarcasm = count >= 6
      ? "Again? Maybe just stay put."
      : count >= 4
      ? "You're really milking this back button, huh?"
      : count >= 2
      ? "Back we go... again."
      : "You return to the previous room.";

    dispatch({ type: 'ADD_MESSAGE', payload: { id: Date.now().toString(), text: sarcasm , type: 'system', timestamp: Date.now() } });
  }, [roomHistory, dispatch]);

  // Check if current room has active traps
  const hasActiveTraps = useMemo(() => {
    const currentRoomId = state.currentRoomId || 'controlnexus';
    const trap = getTrapByRoom(currentRoomId);
    return Boolean(trap && !trap.triggered);
  }, [state.currentRoomId]);

  const playerName: string = useMemo(() => state.player?.name || 'Player', [state.player?.name]);
  const inventory: string[] = useMemo(() => state.player?.inventory || [], [state.player?.inventory]);
  const npcsInRoom: NPC[] = useMemo(() => {
    // Convert NPC string IDs to actual NPC objects
    const npcData = state.npcsInRoom || [];
    return npcData.map((npcOrId: NPC | string) => {
      if (typeof npcOrId === 'string') {
        // Resolve string ID to NPC object from registry
        const npcFromRegistry = npcRegistry.get(npcOrId);
        if (npcFromRegistry) {
          return npcFromRegistry;
        }
        // Fallback: create basic NPC object from string ID
        return {
          id: npcOrId,
          name: npcOrId.charAt(0).toUpperCase() + npcOrId.slice(1).replace(/_/g, ' '),
          location: state.currentRoomId || 'unknown',
          description: `A character named ${npcOrId}`,
          portrait: `/images/${npcOrId}.png`,
          mood: 'neutral' as NPCMood,
          memory: {
            interactions: 0,
            lastInteraction: Date.now(),
            playerActions: [],
            relationship: 50,
            knownFacts: []
          }
        } as NPC;
      }
      return npcOrId as NPC;
    }).filter(Boolean);
  }, [state.npcsInRoom, state.currentRoomId]);
  const roomMap: Record<string, Room> = useMemo(() => state.roomMap || {}, [state.roomMap]);
  const currentRoomId: string = state.currentRoomId || 'controlnexus';
  const room: Room | undefined = roomMap[currentRoomId];
  const stage: GameStage = (state.stage as GameStage) || 'splash';

  // Initialize hooks with proper typing
  useOptimizedEffects(state, dispatch, room);
  useWendellLogic(state, dispatch, room, loadModule);
  useLibrarianLogic(state, dispatch, room, loadModule);
  
  // Enhanced modal management with proper typing
  const openModal = useCallback((name: OpenModalType): void => {
    // Prevent modal opening during demo mode to avoid interrupting the scripted sequence
    if (isDemoActive) {
      console.log('Modal opening blocked during demo mode:', name);
      return;
    }
    setModal(name);
  }, [isDemoActive]);
  const closeModal = useCallback((): void => {
    setModal(null);
    setIsGroupConversation(false); // Reset group conversation state
  }, []);

  // Handle trap management (opens modal instead of direct disarming)
  const handleDisarmTrap = useCallback(() => {
    openModal('trapManagement');
  }, [openModal]);

  // Enhanced save game functions with migration support
  const loadSaveSlots = useCallback(async () => {
    try {
      // Load traditional save slots for compatibility
      const saved = localStorage.getItem('gorstan_save_slots');
      if (saved) {
        setSaveSlots(JSON.parse(saved));
      }

      // Check for save files that need migration
      const saveSlotInfos = await SaveManager.listSlots();
      setSaveSlots(saveSlotInfos.map(slot => ({
        id: slot.slot.toString(),
        name: slot.playerName,
        playerName: slot.playerName,
        currentRoom: 'Unknown', // Would need to be extracted from gameState if needed
        timestamp: Date.parse(slot.timestamp),
        score: 0, // Would need to be extracted from gameState if needed  
        playTime: 0 // Would need to be extracted from gameState if needed
      })));
    } catch (error) {
      console.error('Failed to load save slots:', error);
    }
  }, [dispatch]);

  const handleSave = useCallback(async (slotId: string, slotName: string) => {
    try {
      // Create enhanced save file structure
      const saveFile = {
        version: 7, // Current version
        playerName: state.player.name || 'Player',
        progress: {
          questsCompleted: 0, // Calculate based on game state
          achievementsUnlocked: (state.metadata?.achievements || []).length,
          totalScore: state.player.score || 0,
          totalPlayTime: state.metadata?.playTime ?? 0,
          roomsVisited: Object.keys(state.flags || {}).filter(key => key.startsWith('visited_')).length || 1,
          secretsFound: Object.keys(state.flags || {}).filter(key => key.startsWith('secret_')).length || 0,
          characterInteractions: Object.keys(state.flags || {}).filter(key => key.startsWith('met_')).length || 0,
          storylineProgress: {
            currentRoom: state.currentRoomId,
            flags: state.flags,
            inventory: state.player.inventory,
            achievements: state.metadata?.achievements || []
          }
        },
        timestamp: new Date().toISOString(),
        gameState: {
          ...state,
          progress: {
            questsCompleted: 0, // Calculate based on game state
            achievementsUnlocked: (state.metadata?.achievements || []).length,
            totalScore: state.player.score || 0,
            totalPlayTime: state.metadata?.playTime ?? 0,
            roomsVisited: Object.keys(state.flags || {}).filter(key => key.startsWith('visited_')).length || 1,
            secretsFound: Object.keys(state.flags || {}).filter(key => key.startsWith('secret_')).length || 0,
            characterInteractions: Object.keys(state.flags || {}).filter(key => key.startsWith('met_')).length || 0,
            storylineProgress: {
              currentRoom: state.currentRoomId,
              flags: state.flags,
              inventory: state.player.inventory,
              achievements: state.metadata?.achievements || []
            }
          },
          transition: state.transition as GameTransition | undefined, // Type assertion for compatibility
          settings: {
            difficulty: (state.settings?.difficulty as 'easy' | 'normal' | 'hard' | 'nightmare') || 'normal',
            autoSave: state.settings?.autoSave ?? true,
            autoSaveInterval: state.settings?.autoSaveInterval ?? 60,
            soundEnabled: state.settings?.soundEnabled ?? true,
            musicEnabled: state.settings?.musicEnabled ?? true,
            animationsEnabled: state.settings?.animationsEnabled ?? true,
            textSpeed: state.settings?.textSpeed ?? 50,
            fontSize: (state.settings?.fontSize as 'small' | 'medium' | 'large') || 'medium',
            theme: (state.settings?.theme as 'light' | 'dark' | 'auto') || 'auto',
            debugMode: state.settings?.debugMode ?? false,
            fullscreen: state.settings?.fullscreen ?? false,
            cheatMode: state.settings?.cheatMode ?? false
          },
          metadata: {
            version: state.metadata?.version || '3.8.8',
            playTime: state.metadata?.playTime ?? 0,
            lastSaved: typeof state.metadata?.lastSaved === 'string' ? Date.now() : (state.metadata?.lastSaved ?? null),
            resetCount: state.metadata?.resetCount ?? 0,
            achievements: state.metadata?.achievements ?? []
          }
        },
        metadata: {
          saveVersion: 7,
          gameVersion: '3.8.8',
          features: [
            'save_migration_v7',
            'backward_compatibility',
            'data_integrity_checking'
          ],
          compatibility: {
            minGameVersion: '3.8.0',
            maxGameVersion: '9.9.9'
          }
        }
      };

      // Use enhanced SaveManager with migration support
  const result = await SaveManager.save(parseInt(slotId), saveFile as any); // TODO refine SaveFile typing
      
      if (result.success) {
        // Update traditional save slots for UI compatibility
        const newSlots = saveSlots.filter(slot => slot.id !== slotId);
        newSlots.push({
          id: slotId,
          name: slotName,
          playerName: saveFile.playerName,
          currentRoom: saveFile.progress.storylineProgress?.currentRoom || state.currentRoomId,
          timestamp: Date.now(),
          score: saveFile.progress.totalScore,
          playTime: state.metadata?.playTime || 0
        });
        
        setSaveSlots(newSlots);
        localStorage.setItem('gorstan_save_slots', JSON.stringify(newSlots));
        
        dispatch({ 
          type: 'RECORD_MESSAGE', 
          payload: { 
            id: `save-success-${Date.now()}`, 
            text: `Game saved as "${slotName}" with migration support`, 
            type: 'system', 
            timestamp: Date.now() 
          } 
        });
      } else {
        throw new Error(result.message);
      }
      
      closeModal();
    } catch (error) {
      console.error('Failed to save game:', error);
      dispatch({ 
        type: 'RECORD_MESSAGE', 
        payload: { 
          id: `save-error-${Date.now()}`, 
          text: `Failed to save game: ${error}`, 
          type: 'error', 
          timestamp: Date.now() 
        } 
      });
    }
  }, [state, saveSlots, dispatch, closeModal]);

  const handleLoad = useCallback(async (slotId: string) => {
    try {
      // Use enhanced SaveManager with automatic migration
      const saveFile = await SaveManager.load(parseInt(slotId));
      
      if (saveFile) {
        // Load the save data
        if (saveFile.gameState) {
          const gameState = saveFile.gameState;
          
          dispatch({ type: 'ADVANCE_STAGE', payload: gameState.stage });
          dispatch({ type: 'SET_PLAYER_NAME', payload: gameState.player.name });
          dispatch({ type: 'MOVE_TO_ROOM', payload: gameState.currentRoomId });
          
          // Restore flags
          Object.entries(gameState.flags || {}).forEach(([flag, value]) => {
            dispatch({ type: 'SET_FLAG', payload: { flag, value } });
          });
          
          // Restore other state if available
          if (gameState.player.inventory) {
            gameState.player.inventory.forEach((item: string) => {
              dispatch({ type: 'ADD_TO_INVENTORY', payload: item });
            });
          }
        }
        
        dispatch({ 
          type: 'RECORD_MESSAGE', 
          payload: { 
            id: `load-success-${Date.now()}`, 
            text: `Game loaded: "${saveFile.playerName}" (v${saveFile.version})`, 
            type: 'system', 
            timestamp: Date.now() 
          } 
        });
        
        // Refresh save slots to reflect any migrations
        await loadSaveSlots();
        closeModal();
      } else {
        throw new Error('Save file not found or corrupted');
      }
    } catch (error) {
      console.error('Failed to load game:', error);
      dispatch({ 
        type: 'RECORD_MESSAGE', 
        payload: { 
          id: `load-error-${Date.now()}`, 
          text: `Failed to load game: ${error}`, 
          type: 'error', 
          timestamp: Date.now() 
        } 
      });
    }
  }, [dispatch, closeModal, loadSaveSlots]);

  const handleDeleteSave = useCallback((slotId: string) => {
    try {
      localStorage.removeItem(`gorstan_save_${slotId}`);
      const newSlots = saveSlots.filter(slot => slot.id !== slotId);
      setSaveSlots(newSlots);
      localStorage.setItem('gorstan_save_slots', JSON.stringify(newSlots));
      
      dispatch({ 
        type: 'RECORD_MESSAGE', 
        payload: { 
          id: `delete-success-${Date.now()}`, 
          text: 'Save deleted successfully', 
          type: 'system', 
          timestamp: Date.now() 
        } 
      });
    } catch (error) {
      console.error('Failed to delete save:', error);
    }
  }, [saveSlots, dispatch]);

  // Load save slots on component mount
  useEffect(() => {
    loadSaveSlots();
  }, [loadSaveSlots]);

  // Setup AI Usage Monitoring and NPC AI Integration
  useEffect(() => {
    // Subscribe to AI usage updates
    const unsubscribe = aiUsageMonitor.onUpdate((update) => {
      setGameplayUpdates(prev => [...prev.slice(-19), update]); // Keep last 20 updates
      
      // Console logging for real-time monitoring
      if (update.type === 'ai_interaction') {
        console.log('[AI Monitor] AI Interaction:', update.data);
      }
    });

    // Track initial room visit
    if (currentRoomId) {
      aiUsageMonitor.trackRoomVisit(currentRoomId, state);
    }

    return unsubscribe;
  }, [currentRoomId, state]);

  // Demo system initialization
  useEffect(() => {
    if (isDemo && dispatch) {
      console.log('[AppCore] Initializing demo system');
      demoController.setDispatch(dispatch);
      
      // Set up teleport trigger function for demo
      const teleportTrigger = (teleportType: 'fractal' | 'trek', callback: () => void) => {
        setTeleportType(teleportType);
        setTeleportCallback(() => callback);
      };
      demoController.setTeleportTrigger(teleportTrigger);
      
      // Check URL parameters for auto-start demo
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('demo') === 'auto' && stage === 'game') {
        console.log('[AppCore] Auto-starting demo mode');
        setIsDemoActive(true);
        demoController.startDemo();
      }
    }
  }, [isDemo, dispatch, stage]);

  // NPC AI Behavior Generation
  useEffect(() => {
    const generateNPCBehaviors = async () => {
      if (!room || npcsInRoom.length === 0) {return;}

      for (const npc of npcsInRoom) {
        try {
          const npcProfile = npcAI.getAllNPCs().find(p => p.npcId === npc.id);
          if (!npcProfile) {continue;}

          const context = {
            npcProfile,
            currentRoom: room,
            playerPresent: true,
            gameState: state,
            recentPlayerActions: commandHistory.slice(-5),
            timeInRoom: Date.now() - roomEntryTime,
            nearbyNPCs: npcsInRoom.map(n => n.id).filter(id => id !== npc.id)
          };

          const behavior = await npcAI.generateNPCBehavior(context);
          if (behavior && behavior.shouldDisplay) {
            setNpcBehaviors(prev => ({
              ...prev,
              [npc.id]: behavior.content
            }));

            // Display behavior in console if significant
            if (behavior.priority === 'high' || behavior.type === 'callout') {
              dispatch({
                type: 'ADD_MESSAGE',
                payload: {
                  id: Date.now().toString(),
                  text: `**${npc.name}**: ${behavior.content}`,
                  type: 'npc',
                  timestamp: Date.now()
                }
              });
            }
          }
        } catch (error) {
          console.warn(`[NPC AI] Behavior generation failed for ${npc.id}:`, error);
        }
      }
    };

    // Generate behaviors after a short delay when room/NPCs change
    const timeout = setTimeout(generateNPCBehaviors, 2000);
    return () => clearTimeout(timeout);
  }, [room, npcsInRoom, commandHistory, roomEntryTime, state, dispatch]);

  // NPC Console functions
  const handleOpenNPCConsole = useCallback((npc?: NPC) => {
    if (npc) {
      // Specific NPC provided
      setSelectedNPC(npc);
      openModal('npcConsole');
    } else if (npcsInRoom.length === 1) {
      // Single NPC in room
  if (npcsInRoom[0]) {setSelectedNPC(npcsInRoom[0]);}
      openModal('npcConsole');
    } else if (npcsInRoom.length > 1) {
      // Multiple NPCs - show selection modal
      openModal('npcSelection');
    } else {
      // No NPCs present - default to Ayla
      const aylaHelper: NPC = {
        id: 'ayla',
        name: 'Ayla',
        location: 'universal', // Ayla is available universally as a helper
        description: 'Your helpful guide through the game',
        portrait: '/images/Ayla.png',
        mood: 'helpful' as NPCMood,
        memory: {
          interactions: 0,
          lastInteraction: Date.now(),
          playerActions: [],
          relationship: 50,
          knownFacts: []
        }
      };
      setSelectedNPC(aylaHelper);
      openModal('npcConsole');
    }
  }, [npcsInRoom, openModal]);

  const handleTalkToAyla = useCallback(() => {
    // Switch from NPC selection to talking to Ayla directly
    const aylaHelper: NPC = {
      id: 'ayla',
      name: 'Ayla',
      location: 'universal',
      description: 'Your helpful guide through the game',
      portrait: '/images/Ayla.png',
      mood: 'helpful' as NPCMood,
      memory: {
        interactions: 0,
        lastInteraction: Date.now(),
        playerActions: [],
        relationship: 50,
        knownFacts: []
      }
    };
    setSelectedNPC(aylaHelper);
    openModal('npcConsole');
  }, [openModal]);

  const handleNPCMessage = useCallback((message: string, npcId: string) => {
    // Send message to NPC engine
    npcReact(npcId, message, state);
    
    // Note: Conversation logging is handled within NPCConsole to prevent double-echo
    // Only log significant game-affecting interactions to main console
  }, [dispatch, state]);

  // Handle NPC selection from selection modal
  const handleSelectNPC = useCallback((npc: NPC) => {
    setSelectedNPC(npc);
    openModal('npcConsole');
  }, [openModal]);

  // Handle group conversation
  const handleGroupConversation = useCallback(() => {
    // Add group conversation history message
    dispatch({ 
      type: 'RECORD_MESSAGE', 
      payload: { 
        id: `group-chat-start-${Date.now()}`, 
        text: `🗣️ You begin a group conversation with ${npcsInRoom.map(npc => npc.name).join(', ')}.`, 
        type: 'narrative', 
        timestamp: Date.now() 
      } 
    });

    // Set group conversation mode and open with first NPC as primary
    setIsGroupConversation(true);
    setSelectedNPC(npcsInRoom[0] || null);
    openModal('npcConsole');
  }, [dispatch, npcsInRoom, openModal]);

  // Monitor for NPC console flag
  useEffect(() => {
    if (state.flags?.openNPCConsole) {
      const npcId = state.flags.openNPCConsole;
      const targetNPC = npcsInRoom.find((npc: NPC) => 
        npc.id === npcId || npc.name.toLowerCase() === npcId.toLowerCase()
      );
      
      if (targetNPC) {
        handleOpenNPCConsole(targetNPC);
        // Clear the flag
        dispatch({ type: 'SET_FLAG', payload: { flag: 'openNPCConsole', value: null } });
      }
    }
  }, [state.flags?.openNPCConsole, npcsInRoom, handleOpenNPCConsole, dispatch]);

  // Monitor for save menu flag
  useEffect(() => {
    if (state.flags?.openSaveMenu) {
      openModal('saveGame');
      // Clear the flag
      dispatch({ type: 'SET_FLAG', payload: { flag: 'openSaveMenu', value: null } });
    }
  }, [state.flags?.openSaveMenu, openModal, dispatch]);

  // Auto-trigger NPC modal when NPCs are detected in room - REMOVED
  // Now using Ask Ayla button for NPC interaction initiation

  // Special trigger for Morthos/Al encounter - flash speech bubble then show modal - REMOVED
  // Now using Ask Ayla button for NPC interaction

  // Enhanced Ask Ayla button - shows NPCs when present, otherwise shows Ayla
  useEffect(() => {
    // This effect just tracks NPC presence for the Ask Ayla button behavior
    // The actual modal triggering is now manual via the Ask Ayla button
  }, [npcsInRoom]);

  // Monitor for teleport test trigger
  useEffect(() => {
    if (state.flags?.triggerTeleport) {
      const teleportType = state.flags.triggerTeleport as TeleportType;
      console.log('[AppCore] Teleport test triggered:', teleportType);
      setTeleportType(teleportType);
      setTeleportCallback(() => () => {
        console.log('[AppCore] Teleport test complete');
      });
      // Clear the flag
      dispatch({ type: 'SET_FLAG', payload: { flag: 'triggerTeleport', value: null } });
    }
  }, [state.flags?.triggerTeleport, dispatch]);

  // Enhanced keyboard handler with proper typing
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape" && modal) {
        closeModal();
      }
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        openModal('saveGame');
      }
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        setShowPerformanceDashboard(true);
      }
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        setShowAIMonitor(!showAIMonitor);
      }
      if (e.key.toLowerCase() === 't' && !modal && stage === 'game') {
        // Talk to NPC shortcut
        if (npcsInRoom.length === 1) {
          handleOpenNPCConsole(npcsInRoom[0]);
        } else if (npcsInRoom.length > 1) {
          // Show list of available NPCs
          dispatch({ 
            type: 'RECORD_MESSAGE', 
            payload: { 
              id: `npc-list-${Date.now()}`, 
              text: `NPCs available: ${npcsInRoom.map(npc => npc.name).join(', ')}. Click on one or use "talk [name]"`, 
              type: 'info', 
              timestamp: Date.now() 
            } 
          });
        } else {
          dispatch({ 
            type: 'RECORD_MESSAGE', 
            payload: { 
              id: `no-npcs-${Date.now()}`, 
              text: 'There is no one here to talk to.', 
              type: 'error', 
              timestamp: Date.now() 
            } 
          });
        }
      }
      if (e.key === 'Escape' && isDemoActive) {
        // Skip demo with ESC key
        e.preventDefault();
        demoController.skipDemo();
        setIsDemoActive(false);
        dispatch({ 
          type: 'RECORD_MESSAGE', 
          payload: { 
            id: `demo-skip-${Date.now()}`, 
            text: '🎬 Demo skipped. You now have full control.', 
            type: 'system', 
            timestamp: Date.now() 
          } 
        });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modal, closeModal, openModal, npcsInRoom, handleOpenNPCConsole, stage, dispatch, isDemoActive]);

  // Enhanced cleanup effect with proper typing
  useEffect(() => {
    return () => { 
      if (lookModalTimeoutRef.current) {
        clearTimeout(lookModalTimeoutRef.current);
        lookModalTimeoutRef.current = null;
      }
    };
  }, []);

  // Enhanced look around handler with better type safety
  const handleLookAround = useCallback((): void => {
    if (lookModalTimeoutRef.current) {
      clearTimeout(lookModalTimeoutRef.current);
      lookModalTimeoutRef.current = null;
    }

    // Type guard for room existence
    if (!room) {
      setLookLines(['❌ Unable to look around - room not found.']);
      openModal('look');
      lookModalTimeoutRef.current = setTimeout(closeModal, 3000);
      return;
    }

    // Enhanced room information with proper type handling
    const roomTitle: string = (room as any).title || (room as any).name || "Unknown room";
    const roomDescription: string = Array.isArray(room.description) 
      ? room.description[0] || "No description available."
      : room.description?.split('')[0] || "No description available.";
    
    // Enhanced item handling with proper typing
    const itemsList: string = room.items && room.items.length > 0
      ? room.items.map((item: Item | string) => 
          typeof item === 'string' ? item : item.name
        ).join(', ')
      : "None";
    
    // Enhanced NPC handling with proper typing
    const npcsList: string = npcsInRoom.length > 0
      ? npcsInRoom.map((npc: NPC | string) => 
          typeof npc === 'string' ? npc : npc.name
        ).join(', ')
      : "None";
    
    // Enhanced exits handling with proper typing
    const exitsList: string = room.exits && Object.keys(room.exits).length > 0
      ? Object.keys(room.exits).join(', ')
      : "None";

    const lines: string[] = [
      `📍 ${roomTitle}`,
      roomDescription,
      `🧺 Items here: ${itemsList}`,
      `🧑‍🤝‍🧑 NPCs here: ${npcsList}`,
      `🚪 Exits: ${exitsList}`
    ];
    
    setLookLines(lines);
    openModal('look');
    lookModalTimeoutRef.current = setTimeout(closeModal, 6000);
  }, [room, npcsInRoom, openModal, closeModal]);

  // Enhanced hint checking function with unified AI
  const checkForHints = useCallback(async (cmd: string, _lowerCmd: string) => {
    if (!aylaHintSystem || currentHint || currentGuidance) {return;}

    // Check if this was a failed command (we can check this by looking at recent messages)
    const recentMessages = state.messages.slice(-3);
    const hasFailureMessage = recentMessages.some(msg => 
      msg.text.includes("don't understand") || 
      msg.text.includes("can't") || 
      msg.text.includes("no one") ||
      msg.text.includes("don't see") ||
      msg.text.includes("not here") ||
      msg.type === 'error'
    );

    // Also check for repeated commands or signs of being stuck
    const recentCommands = commandHistory.slice(-5);
    const hasRepeatedCommands = recentCommands.filter(c => c === cmd).length >= 2;
    const hasVariousFailedAttempts = recentCommands.length >= 3;

    if (hasFailureMessage || hasRepeatedCommands || hasVariousFailedAttempts) {
      try {
        // Try unified AI first for comprehensive guidance
        const unifiedContext = {
          gameState: state,
          currentRoom: room!,
          recentCommands: commandHistory,
          timeInRoom: Date.now() - roomEntryTime,
          failedAttempts: hasFailureMessage ? [cmd] : []
        };

        const unifiedGuidance = await unifiedAI.getUnifiedGuidance(unifiedContext);
        
        if (unifiedGuidance) {
          setCurrentGuidance(unifiedGuidance);
          return;
        }

        // Fallback to traditional Ayla hint system
        const context = {
          currentRoom: room!,
          gameState: state,
          recentCommands: commandHistory,
          timeInRoom: Date.now() - roomEntryTime,
          failedAttempts: hasFailureMessage ? [cmd] : [],
          stuckDuration: Date.now() - roomEntryTime
        };

        const hintResponse = await aylaHintSystem.shouldAylaInterrupt(context);

        if (hintResponse) {
          setCurrentHint(hintResponse);
        }
      } catch (error) {
        console.warn('Failed to generate hint:', error);
      }
    }
  }, [aylaHintSystem, currentHint, currentGuidance, state, commandHistory, room, roomEntryTime]);

  // Enhanced command handler with better type safety
  const handleCommand = useCallback((cmd: string): void => {
    const lowerCmd: string = cmd.toLowerCase().trim();

    // Track command for hint system
    setCommandHistory(prev => [...prev.slice(-9), cmd]); // Keep last 10 commands

    // Enhanced NPC interaction with proper type handling
    if (lowerCmd.startsWith("talk to ")) {
      const npcName: string = lowerCmd.replace("talk to ", "").trim();
      const match: NPC | string | undefined = npcsInRoom.find((npc: NPC | string) => {
        const name: string = typeof npc === 'object' && 'name' in npc ? npc.name : npc as string;
        return name.toLowerCase() === npcName;
      });
      
      if (match) {
        const npcId: string = typeof match === 'object' && 'id' in match ? match.id : match as string;
        npcReact(npcId, "greet", state);
      } else {
        dispatch({ 
          type: 'ADD_MESSAGE', 
          payload: { 
            id: Date.now().toString(), 
            text: `You don't see anyone named "${npcName}".`, 
            type: 'error', 
            timestamp: Date.now() 
          } 
        });
      }
      return;
    }

    // Enhanced modal shortcuts with proper typing
    const modalCommands: Record<string, OpenModalType> = {
      'inv': 'inventory', 
      'inventory': 'inventory', 
      'show inventory': 'inventory', 
      'show inv': 'inventory',
      'look': 'look', 
      'show look': 'look', 
      'show room': 'look', 
      'examine room': 'look',
      'use': 'useItem', 
      'show use': 'useItem', 
      'use item': 'useItem',
      'pickup': 'pickUp', 
      'pick up': 'pickUp', 
      'get': 'pickUp', 
      'take': 'pickUp'
    };
    
  const modalCommand = modalCommands[lowerCmd] as OpenModalType | undefined;
    if (modalCommand) {
      modalCommand === 'look' ? handleLookAround() : openModal(modalCommand);
      return;
    }

    // Enhanced item examination with proper type safety
    if (lowerCmd.startsWith('look at ')) {
      const item: string = lowerCmd.replace('look at ', '').trim();
      if (item) {
        if (inventory.includes(item)) {
          const description: string = itemDescriptions[item] || 
            `You look at the ${item}, but it doesn't seem particularly special.`;
          dispatch({ 
            type: 'ADD_MESSAGE', 
            payload: { 
              id: Date.now().toString(), 
              text: description, 
              type: 'system', 
              timestamp: Date.now() 
            } 
          });
        } else {
          dispatch({ 
            type: 'ADD_MESSAGE', 
            payload: { 
              id: Date.now().toString(), 
              text: `You're not carrying a '${item}'.`, 
              type: 'error', 
              timestamp: Date.now() 
            } 
          });
        }
        return;
      }
    }

    // Enhanced movement tracking with proper typing
    const movementCommands: string[] = ["sit", "north", "south", "east", "west", "up", "down"];
    const isMovementCommand: boolean = movementCommands.includes(lowerCmd) || 
      lowerCmd.includes("portal") || 
      lowerCmd.includes("enter") || 
      lowerCmd.includes("step");
    
    if (isMovementCommand) {
      setLastMovementAction(lowerCmd);
      // For movement commands, store current room in history and update previousRoom
      if (room) {
        setRoomHistory(prev => [...prev, currentRoomId]);
        setPreviousRoom(room);
      }
    } else {
      setLastMovementAction("");
      // For non-movement commands, just update previousRoom as before
      if (room) {setPreviousRoom(room);}
    }

    // Demo system commands - only available in demo environment
    if (isDemo) {
      if (lowerCmd === 'start demo' || lowerCmd === 'demo start') {
        if (!isDemoActive) {
          setIsDemoActive(true);
          demoController.startDemo();
          dispatch({ 
            type: 'ADD_MESSAGE', 
            payload: { 
              id: Date.now().toString(), 
              text: '🎬 Starting scripted demo mode...', 
              type: 'system', 
              timestamp: Date.now() 
            } 
          });
        } else {
          dispatch({ 
            type: 'ADD_MESSAGE', 
            payload: { 
              id: Date.now().toString(), 
              text: '🎬 Demo is already running. Press ESC to skip.', 
              type: 'system', 
              timestamp: Date.now() 
            } 
          });
        }
        return;
      }
      
      if (lowerCmd === 'stop demo' || lowerCmd === 'demo stop' || lowerCmd === 'skip demo') {
        if (isDemoActive) {
          demoController.skipDemo();
          setIsDemoActive(false);
          dispatch({ 
            type: 'ADD_MESSAGE', 
            payload: { 
              id: Date.now().toString(), 
              text: '🎬 Demo stopped. You now have full control.', 
              type: 'system', 
              timestamp: Date.now() 
            } 
          });
        } else {
          dispatch({ 
            type: 'ADD_MESSAGE', 
            payload: { 
              id: Date.now().toString(), 
              text: '🎬 No demo is currently running.', 
              type: 'info', 
              timestamp: Date.now() 
            } 
          });
        }
        return;
      }
      
      if (lowerCmd === 'next demo' || lowerCmd === 'demo next') {
        if (isDemoActive) {
          demoController.skipToNext();
          dispatch({ 
            type: 'ADD_MESSAGE', 
            payload: { 
              id: Date.now().toString(), 
              text: '🎬 Skipping to next demo step...', 
              type: 'system', 
              timestamp: Date.now() 
            } 
          });
        } else {
          dispatch({ 
            type: 'ADD_MESSAGE', 
            payload: { 
              id: Date.now().toString(), 
              text: '🎬 No demo is currently running.', 
              type: 'info', 
              timestamp: Date.now() 
            } 
          });
        }
        return;
      }
    }

    dispatch({ type: 'COMMAND_INPUT', payload: cmd });

    // Track command execution for AI monitoring
    const isSuccessfulCommand = !lowerCmd.includes('unknown') && 
                               !lowerCmd.includes('can\'t') && 
                               !lowerCmd.includes('invalid');
    aiUsageMonitor.trackCommand(cmd, isSuccessfulCommand, currentRoomId);

    // Check for hint opportunities after command processing
    checkForHints(cmd, lowerCmd);
  }, [npcsInRoom, room, inventory, dispatch, handleLookAround, openModal, currentRoomId, isDemo, isDemoActive]);

  // Enhanced pickup handler with proper type safety and Dominic special logic
  const handlePickUpItems = useCallback((selectedItems: string[]): void => {
    selectedItems.forEach((item: string) => {
      if (item === 'Run Bag') {
        dispatch({ type: 'SET_RUNBAG_FLAG', payload: true });
        dispatch({ type: 'INCREASE_INVENTORY_CAPACITY' });
        
        // Score for finding useful items
        try {
          const { applyScoreForEvent } = require('../state/scoreEffects');
          applyScoreForEvent('find.hidden.item');
        } catch (error) {
          console.warn('Failed to apply score for item pickup:', error);
        }
        
      } else if (item === 'dominic' && currentRoomId === 'dalesapartment') {
        // Enhanced Dominic conversation system
        import('../engine/dominicPickupConversation').then(mod => {
          const preventPickup = mod.handleDominicPickupAttempt(state, dispatch);
          
          if (!preventPickup) {
            // Player insisted after warnings - allow pickup with consequences
            dispatch({ type: 'ADD_TO_INVENTORY', payload: 'deadfish' });
            dispatch({ type: 'SET_FLAG', payload: { flag: 'dominicIsDead', value: true } });
            dispatch({ type: 'REMOVE_ITEM_FROM_ROOM', payload: { roomId: 'dalesapartment', item: 'dominic' } });
            
            // Trigger stalker behavior
            dispatch({ type: 'SET_FLAG', payload: { flag: 'pollyVengeanceActive', value: true } });
          }
        });
      } else {
        dispatch({ type: 'ADD_TO_INVENTORY', payload: item });
      }
    });
    closeModal();
  }, [dispatch, closeModal, currentRoomId, state]);

  // Enhanced teleport completion handler with proper typing
  const handleTeleportComplete = useCallback((): void => {
    setTeleportType(null);
    if (teleportCallback) {
      teleportCallback();
      setTeleportCallback(() => () => {});
    }
  }, [teleportCallback]);

  // Demo mode automation - executes predefined commands to showcase gameplay
  const startDemoMode = useCallback((): void => {
    console.log('[AppCore] startDemoMode called - beginning demo automation');
    const demoCommands = [
      { command: 'look', delay: 1000 },
      { command: 'west', delay: 2000 },
      { command: 'look', delay: 1500 },
      { command: 'examine tactical_display', delay: 2000 },
      { command: 'east', delay: 1500 },
      { command: 'sit', delay: 2000 },
      { command: 'look', delay: 1500 },
      { command: 'examine console', delay: 2000 },
      { command: 'status', delay: 1500 },
      { command: 'inventory', delay: 1500 },
      { command: 'help', delay: 2000 }
    ];

    let currentCommandIndex = 0;
    
    const executeDemoCommand = () => {
      if (currentCommandIndex >= demoCommands.length) {
        // Demo completed - show completion message
        dispatch({ 
          type: 'ADD_MESSAGE', 
          payload: { 
            id: Date.now().toString(), 
            text: "🎮 Demo complete! Ayla: \"You've seen a glimpse of what Gorstan offers. Ready to explore on your own?\"",
            type: 'system',
            timestamp: Date.now()
          }
        });
        return;
      }

  const currentDemo = demoCommands[currentCommandIndex];
  if (!currentDemo) {return;}
  const { command, delay } = currentDemo;
      
      // Add demo command to message log
      dispatch({ 
        type: 'ADD_MESSAGE', 
        payload: { 
          id: Date.now().toString(), 
          text: `🤖 Demo: ${command}`,
          type: 'input',
          timestamp: Date.now()
        }
      });

      // Execute the command after a brief delay
      setTimeout(() => {
        handleCommand(command);
        currentCommandIndex++;
        
        // Schedule next command
        setTimeout(executeDemoCommand, delay);
      }, 500);
    };

    // Start the demo sequence
    dispatch({ 
      type: 'ADD_MESSAGE', 
      payload: { 
        id: Date.now().toString(), 
        text: "🎭 Ayla: \"Welcome to your guided tour of Gorstan! Watch as I demonstrate the core gameplay...\"",
        type: 'system',
        timestamp: Date.now()
      }
    });
    
    setTimeout(executeDemoCommand, 2000);
  }, [handleCommand, dispatch]);

  // Enhanced system controls with proper error handling and typing
  const toggleFullscreen = useCallback((): void => {
    const elem: HTMLElement = document.documentElement;
    try {
      if (!document.fullscreenElement) {
        elem.requestFullscreen?.();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen?.();
        setIsFullscreen(false);
      }
    } catch (error: unknown) {
      const errorMessage: string = error instanceof Error ? error.message : 'Unknown error';
      console.warn('Fullscreen toggle failed:', errorMessage);
      dispatch({ 
        type: 'ADD_MESSAGE', 
        payload: { 
          id: Date.now().toString(), 
          text: "Fullscreen toggle failed.", 
          type: "error", 
          timestamp: Date.now() 
        } 
      });
    }
  }, [dispatch]);

  const toggleSound = useCallback((): void => {
    setSoundOn((prev: boolean) => {
      const newSoundState: boolean = !prev;
      try {
        const audioElements: NodeListOf<HTMLAudioElement> = document.querySelectorAll("audio");
        audioElements.forEach((audio: HTMLAudioElement) => { 
          audio.muted = !newSoundState; 
        });
      } catch (error: unknown) {
        const errorMessage: string = error instanceof Error ? error.message : 'Unknown error';
        console.warn('Sound toggle failed:', errorMessage);
        dispatch({ 
          type: 'ADD_MESSAGE', 
          payload: { 
            id: Date.now().toString(), 
            text: "Sound toggle failed.", 
            type: "error", 
            timestamp: Date.now() 
          } 
        });
      }
      return newSoundState;
    });
  }, [dispatch]);

  // Enhanced room transition info with proper typing
  const transitionInfo = useRoomTransition(previousRoom, room ?? null, lastMovementAction);

  // Enhanced direction state with proper typing and memoization
  const availableDirections = useMemo(() => {
    return {
      north: Boolean(room?.exits?.north),
      south: Boolean(room?.exits?.south),
      east: Boolean(room?.exits?.east),
      west: Boolean(room?.exits?.west),
      jump: Boolean(room?.exits?.jump),
      sit: Boolean(room?.exits?.sit),
      up: Boolean(room?.exits?.up),
      down: Boolean(room?.exits?.down)
    };
  }, [room?.exits, currentRoomId, stage]);

  
  const directionRoomTitles = useMemo(() => ({
    north: room?.exits?.north ? roomMap[room.exits.north]?.title ?? room.exits.north : "",
    south: room?.exits?.south ? roomMap[room.exits.south]?.title ?? room.exits.south : "",
    east : room?.exits?.east  ? roomMap[room.exits.east ]?.title ?? room.exits.east  : "",
    west : room?.exits?.west  ? roomMap[room.exits.west ]?.title ?? room.exits.west  : "",
    jump : room?.exits?.jump  ? roomMap[room.exits.jump ]?.title ?? room.exits.jump  : "",
    sit  : room?.exits?.sit   ? roomMap[room.exits.sit  ]?.title ?? room.exits.sit   : "",
    up   : room?.exits?.up    ? roomMap[room.exits.up   ]?.title ?? room.exits.up    : "",
    down : room?.exits?.down  ? roomMap[room.exits.down ]?.title ?? room.exits.down  : "",
    back : room?.exits?.back  ? roomMap[room.exits.back ]?.title ?? room.exits.back  : "",
    out  : room?.exits?.out   ? roomMap[room.exits.out  ]?.title ?? room.exits.out   : ""
  }), [room?.exits, roomMap]);


  // Enhanced room validation effect with proper typing
  useEffect(() => {
    if (!room && currentRoomId && !roomFallbackAttempted) {
      dispatch({ 
        type: 'ADD_MESSAGE', 
        payload: { 
          id: Date.now().toString(), 
          text: `Room transition failed: Room '${currentRoomId}' does not exist. Returning to Control Nexus.`, 
          type: 'error', 
          timestamp: Date.now() 
        } 
      });
      dispatch({ type: 'UPDATE_GAME_STATE', payload: { currentRoomId: 'controlnexus' } });
      setRoomFallbackAttempted(true);
    }
  }, [room, currentRoomId, dispatch, roomFallbackAttempted]);

  // Enhanced room transition effect with proper typing
  useEffect(() => {
    if (room && previousRoom && room.id !== previousRoom.id) {
      setRoomTransitionActive(true);
    }
  }, [room, previousRoom]);

  // Room change tracking effect - maintains previousRoom state for backout functionality
  useEffect(() => {
    if (room && room.id) {
      // If we don't have a previousRoom yet, or if the current room is different from previousRoom
      if (!previousRoom) {
        // First room load - set as previous for future navigation
        setPreviousRoom(room);
        setRoomEntryTime(Date.now());
      } else if (previousRoom.id !== room.id) {
        // Room has changed - update entry time for hint system
        setRoomEntryTime(Date.now());
        // The previous room should remain as it was
        // This allows the backout functionality to work correctly
        // previousRoom is updated in handleCommand before dispatch
      }
    }
  }, [room, previousRoom]);

  // Convert certain Ayla hints into ephemeral console guidance
  useEffect(() => {
    if (!currentHint) {return;}
    // Only show ephemeral for low/medium urgency; high keeps popup
    if (currentHint.urgency === 'low' || currentHint.urgency === 'medium') {
      const id = `ayla-ephemeral-${Date.now()}`;
      const line = `Ayla (hint): ${currentHint.hintText}` + (currentHint.followUp ? ` ${currentHint.followUp}` : '');
      const expiresAt = Date.now() + 8000; // 8s lifetime
      setEphemeralAyla(prev => [...prev.filter(m => m.expiresAt > Date.now()), { id, content: line, expiresAt }]);
      // Auto-dismiss popup silently if it would show
      setCurrentHint(null);
    }
  }, [currentHint]);

  // Periodic conversation check for inter-NPC dialogue
  useEffect(() => {
    if (stage === 'game' && room && room.id) {
      const interval = setInterval(() => {
        periodicConversationCheck(state, dispatch, room.id);
      }, 120000); // Check every 2 minutes

      return () => clearInterval(interval);
    }
  }, [stage, room, state, dispatch]);

  // Handle transition stages by extracting transition type from stage
  useEffect(() => {
    if (stage.startsWith('transition_')) {
      const type = stage.replace('transition_', '');
      console.log('[AppCore] Setting transition type from stage:', stage, '→', type);
      setTransitionType(type);
    }
  }, [stage]);

  // Memoized initial room map reference
  const initialRoomMapRef = useRef<Record<string, Room> | null>(null);

  // Enhanced game initialization with proper error handling and typing
  useEffect(() => {
    if (initialRoomMapRef.current) {return;} // Already loaded
    try {
      const loadedRoomMap: Record<string, Room> = getAllRoomsAsObject();
      if (!loadedRoomMap || Object.keys(loadedRoomMap).length === 0) {console.warn('[AppCore] No rooms loaded from main loader');}
      console.log('[AppCore] Loading room map with', Object.keys(loadedRoomMap).length, 'rooms');
      initialRoomMapRef.current = loadedRoomMap;
      dispatch({ type: 'LOAD_ROOM_MAP', payload: loadedRoomMap });
      if (!loadedRoomMap[state.currentRoomId] && loadedRoomMap['controlnexus']) {dispatch({ type: 'MOVE_TO_ROOM', payload: 'controlnexus' });}
      initializeAchievementEngine(dispatch);

      // Score manager
      try { initializeScoreManager(dispatch); } catch (error) {
        console.warn('Failed to load score manager:', error);
        dispatch({ type: 'ADD_MESSAGE', payload: { id: Date.now().toString(), text: 'Failed to load score manager.', type: 'error', timestamp: Date.now() } });
      }
      // Codex tracker
      try { initializeCodexTracker(dispatch); } catch (error) {
        console.warn('Failed to load codex tracker:', error);
        dispatch({ type: 'ADD_MESSAGE', payload: { id: Date.now().toString(), text: 'Failed to load codex tracker.', type: 'error', timestamp: Date.now() } });
      }
      // Miniquests
      try { initializeMiniquests(); } catch (error) {
        console.warn('Failed to load miniquest initializer:', error);
        dispatch({ type: 'ADD_MESSAGE', payload: { id: Date.now().toString(), text: 'Failed to load miniquest initializer.', type: 'error', timestamp: Date.now() } });
      }
      // Celebrations
      try { loadCelebrationIndex(); } catch (error) { console.warn('Could not load celebration index:', error); }

      // Optional async modules
      try { initializeWanderingNPCs(state, dispatch); } catch (e) { console.warn('Wandering NPC init failed:', e); }
    } catch (error) {
      console.error('[AppCore] Error during room map init:', error);
      dispatch({ type: 'ADD_MESSAGE', payload: { id: Date.now().toString(), text: 'Critical error: Unable to load room data.', type: 'error', timestamp: Date.now() } });
    }
  }, [dispatch, state.currentRoomId, state]);

  // Enhanced room description effect with proper typing
  // Track descriptions already shown to prevent spamming on every render
  const shownRoomDescriptionsRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!room) {return;}
    const currentDescriptionString = Array.isArray(room.description)
      ? room.description.join(' ')
      : (room.description || '');
    // Only emit if new description for this room AND different from last shown global description
    const key = `${room.id}::${currentDescriptionString}`;
    if (currentDescriptionString && !shownRoomDescriptionsRef.current.has(key)) {
      // Suppress during demo automation if we've already printed this room once (prevents console spam in demo stage)
      const isDemoSuppressed = isDemoActive && shownRoomDescriptionsRef.current.has(room.id);
      if (!isDemoSuppressed) {
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            id: Date.now().toString(),
            text: currentDescriptionString,
            type: 'system',
            timestamp: Date.now()
          }
        });
      }
      shownRoomDescriptionsRef.current.add(key);
      shownRoomDescriptionsRef.current.add(room.id); // mark room seen at least once
      setLastShownRoomDescription(currentDescriptionString);
      // Room entry side-effects (only first time per unique description)
      handleRoomEntry(room, state, dispatch);
      handleRoomEntryForWanderingNPCs(room, state, dispatch);
      onRoomEntry(state, dispatch, room.id, state.previousRoomId);
      const currentZone = room.zone || '';
      const npcsHere = state.npcsInRoom || [];
      if (npcsHere.length > 1) {
        // groupChatLogic preloading removed; module is statically imported where needed
            if (currentZone === 'stantonZone' || currentZone === 'stantonharcourtZone') {
              setTimeout(() => {
                setIsGroupConversation(true);
                setSelectedNPC(npcsHere[0] || null);
                openModal('npcConsole');
              }, 2000);            }          }        }  }, [room, isDemoActive, dispatch, state]);

  // Enhanced transition execution effect with proper error handling and typing
  useEffect(() => {
    console.log('[AppCore] Transition execution effect triggered:', {
      readyForTransition,
      transitionType,
      roomMapLoaded: Object.keys(roomMap).length > 0
    });
    
    if (!readyForTransition || !transitionType || Object.keys(roomMap).length === 0) {return;}
    
    try {
      const target: string = transitionTargetRoom.trim().toLowerCase();
      const foundRoom: Room | undefined = roomMap[target];
      const targetRoomId: string = foundRoom ? target : 'controlnexus';
      
      console.log('[AppCore] Executing transition to room:', targetRoomId);
      dispatch({ type: 'MOVE_TO_ROOM', payload: targetRoomId });
      
      transitionInventory.forEach((item: string) => {
        console.log('[AppCore] Adding transition inventory item:', item);
        dispatch({ type: 'ADD_TO_INVENTORY', payload: item });
      });
      
      console.log('[AppCore] Advancing to game stage');
      dispatch({ type: 'ADVANCE_STAGE', payload: 'game' });
      setTransitionType(null);
      setReadyForTransition(false);
    } catch (error: unknown) {
      const errorMessage: string = error instanceof Error ? error.message : 'Unknown error';
      console.error('Transition execution failed:', errorMessage);
      dispatch({ 
        type: 'ADD_MESSAGE', 
        payload: { 
          id: Date.now().toString(), 
          text: "Transition execution failed.", 
          type: "error", 
          timestamp: Date.now() 
        } 
      });
      setTransitionType(null);
      setReadyForTransition(false);
    }
  }, [readyForTransition, transitionType, roomMap, transitionTargetRoom, transitionInventory, dispatch]);

  // Demo mode effect (no stage flip) - starts automation when entering demo stage
  const demoStartedRef = useRef(false);
  useEffect(() => {
    if (stage === 'demo') {
      if (!demoStartedRef.current) {
        console.log('[AppCore] Entered demo stage – preparing automated sequence');
        setIsDemoActive(true);
        demoStartedRef.current = true;
        const demoTimer = setTimeout(() => {
          console.log('[AppCore] Demo timer fired - starting demo automation');
          startDemoMode();
        }, 1200);
        return () => {
          clearTimeout(demoTimer);
        };
      } else {
        // Debug loop guard
        if (console && typeof console.debug === 'function') {
          console.debug('[AppCore] Demo stage already active; skipping re-init');
        }
      }
    } else {
      // Leaving demo stage resets flag so a future re-entry can replay
      if (demoStartedRef.current) {
        console.log('[AppCore] Exiting demo stage – stopping demo mode flag');
      }
      setIsDemoActive(false);
      demoStartedRef.current = false;
    }
  }, [stage, startDemoMode]);

  // Enhanced modal content rendering with proper typing
  const renderModalContent = useStableCallback((): React.ReactNode => {
    switch (modal) {
      case 'inventory': 
        return <InventoryModal items={inventory} onClose={closeModal} />;
      case 'useItem': 
        return (
          <UseItemModal 
            inventory={inventory} 
            environmentItems={room?.environment || []}
            onClose={closeModal} 
            onUse={(item: string, target?: string) => { 
              dispatch({ 
                type: target ? 'USE_ITEM_WITH' : 'USE_ITEM', 
                payload: target ? { item, target } : { item } 
              }); 
              closeModal(); 
            }} 
          />
        );
      case 'pickUp': 
        return (
          <PickUpItemModal 
            isOpen={true}
            items={room?.items?.map((item: Item | string) => 
              typeof item === 'string' ? item : item.name
            ) || []} 
            onClose={closeModal} 
            onPickUp={handlePickUpItems} 
          />
        );
      case 'saveGame':
        return (
          <SaveGameModal
            isOpen={true}
            onClose={closeModal}
            onSave={handleSave}
            onLoad={handleLoad}
            onDelete={handleDeleteSave}
            saveSlots={saveSlots}
          />
        );
      case 'npcConsole':
        return isGroupConversation ? (
          <EnhancedNPCConsole
            isOpen={true}
            npcs={npcsInRoom}
            {...(selectedNPC?.id ? { activeNpcId: selectedNPC.id } : {})}
            isGroupConversation={true}
            onClose={closeModal}
            onSendMessage={handleNPCMessage}
            playerName={playerName}
          />
        ) : (
          <NPCConsole
            isOpen={true}
            npc={selectedNPC}
            onClose={closeModal}
            onSendMessage={handleNPCMessage}
            playerName={playerName}
          />
        );
      case 'npcSelection':
        return (
          <NPCSelectionModal
            isOpen={true}
            npcs={npcsInRoom}
            onSelectNPC={handleSelectNPC}
            onClose={closeModal}
            onTalkToAll={handleGroupConversation}
            onTalkToAyla={handleTalkToAyla}
          />
        );
      case 'look': 
        return (
          <Modal visible={true} onClose={closeModal} title="Look Around">
            <div className="look-modal-content">
              {lookLines.map((line: string, idx: number) => (
                <div key={idx} className="look-line">{line}</div>
              ))}
            </div>
          </Modal>
        );
      case 'trapManagement':
        return (
          <TrapManagementModal
            isOpen={true}
            onClose={closeModal}
            currentRoomId={currentRoomId}
          />
        );
      default: 
        return null;
    }
  }, [modal, inventory, room, selectedNPC, isGroupConversation, playerName, state, npcsInRoom, closeModal, handlePickUpItems, dispatch, roomMap, currentRoomId]);

  // Enhanced guard rails with proper type checking
  if (!state.currentRoomId || !state.roomMap || !state.roomMap[state.currentRoomId]) {
  if (import.meta.env.DEV) {
      console.log('Guard rails:', {
        currentRoomId: state.currentRoomId,
        roomMapLoaded: Boolean(state.roomMap),
        roomExists: Boolean(state.roomMap?.[state.currentRoomId])
      });
    }
    return <div className="appcore-loading">Loading game world...</div>;
  }

  // (Removed DemoStage early-return component to keep hook order stable; demo now overlays main UI)

  // Enhanced teleport rendering with proper typing
  if (teleportType === 'fractal') {
    return <TeleportManager teleportType="fractal" onComplete={handleTeleportComplete} />;
  }
  if (teleportType === 'trek') {
    return <TeleportManager teleportType="trek" onComplete={handleTeleportComplete} />;
  }

  // Enhanced stage-based rendering with proper typing
  if (transitionType === 'jump') {
    console.log('[AppCore] Rendering JumpTransition');
    return <JumpTransition onComplete={() => {
      console.log('[AppCore] JumpTransition completed');
      setReadyForTransition(true);
    }} />;
  }
  if (transitionType === 'sip') {
    console.log('[AppCore] Rendering SipTransition');
    return <SipTransition onComplete={() => {
      console.log('[AppCore] SipTransition completed');
      setReadyForTransition(true);
    }} />;
  }
  if (transitionType === 'wait') {
    console.log('[AppCore] Rendering WaitTransition');
    return <WaitTransition onComplete={() => {
      console.log('[AppCore] WaitTransition completed');
      setReadyForTransition(true);
    }} />;
  }
  if (transitionType === 'dramatic_wait') {
    console.log('[AppCore] Rendering DramaticWaitTransition');
    return <DramaticWaitTransition onComplete={() => {
      console.log('[AppCore] DramaticWaitTransition completed');
      setReadyForTransition(true);
    }} />;
  }
  if (stage === 'splash') {
    return <SplashScreen onComplete={() => dispatch({ type: 'ADVANCE_STAGE', payload: 'welcome' })} />;
  }
  if (stage === 'welcome') {
    return (
      <WelcomeScreen 
        onBegin={() => dispatch({ type: 'ADVANCE_STAGE', payload: 'nameCapture' })} 
        onLoadGame={() => dispatch({ type: 'LOAD_SAVED_GAME' })} 
        onStartDemo={() => {
          // Set demo-specific player name and skip nameCapture
          dispatch({ type: 'SET_PLAYER_NAME', payload: 'Demo Player' });
          dispatch({ type: 'ADVANCE_STAGE', payload: 'demo' });
        }}
      />
    );
  }
  // For demo stage we now fall through and render the main UI with demo automation active
  if (stage === 'trialsGame') {
    const TrialsGame = React.lazy(() => import('./TrialsGame'));
    
    return (
      <React.Suspense fallback={
        <div className="flex items-center justify-center min-h-screen bg-background text-console">
          <div className="text-center space-y-4">
            <div className="animate-spin w-12 h-12 border-4 border-console border-t-transparent rounded-full mx-auto"></div>
            <h2 className="text-2xl font-bold">Loading Trials of Gorstan...</h2>
            <p className="text-lg">Preparing your interactive adventure</p>
          </div>
        </div>
      }>
        <TrialsGame
          onComplete={() => {
            console.log('[AppCore] Trials completed successfully!');
            dispatch({ type: 'ADVANCE_STAGE', payload: 'routeSelect' });
          }}
          onQuit={() => {
            console.log('[AppCore] Player quit the trials');
            dispatch({ type: 'ADVANCE_STAGE', payload: 'routeSelect' });
          }}
          autoStart={true}
        />
      </React.Suspense>
    );
  }
  if (stage === 'nameCapture') {
    return (
      <PlayerNameCapture 
        onNameSubmit={(name: string) => { 
          dispatch({ type: 'SET_PLAYER_NAME', payload: name }); 
          dispatch({ type: 'ADVANCE_STAGE', payload: 'routeSelect' }); 
        }} 
      />
    );
  }
  if (stage === 'routeSelect') {
    return (
      <RouteSelectScreen 
        onRouteSelect={(routeId) => {
          dispatch({ type: 'SET_ROUTE', payload: routeId });
          // Different paths based on route selection
          if (routeId === 'demo') {
            dispatch({ type: 'ADVANCE_STAGE', payload: 'demo' });
          } else if (routeId === 'short10_trialsofgorstan') {
            // Special handling for Trials of Gorstan interactive interface
            dispatch({ type: 'ADVANCE_STAGE', payload: 'trialsGame' });
          } else {
            dispatch({ type: 'ADVANCE_STAGE', payload: 'intro' });
          }
        }}
        onCancel={() => dispatch({ type: 'ADVANCE_STAGE', payload: 'welcome' })}
      />
    );
  }
  if (stage === 'intro') {
    return (
      <TeletypeIntro 
        playerName={playerName} 
        onComplete={(data: IntroCompletionData) => { 
          console.log('[AppCore] Intro completed with data:', data);
          if (data.targetRoom) {
            console.log('[AppCore] Setting transition target room:', data.targetRoom);
            setTransitionTargetRoom(data.targetRoom);
          }
          if (data.inventoryBonus) {
            console.log('[AppCore] Setting transition inventory:', data.inventoryBonus);
            setTransitionInventory(data.inventoryBonus);
          }
          const targetStage = `transition_${data.route}` as GameStage;
          console.log('[AppCore] Advancing to transition stage:', targetStage);
          setTimeout(() => {
            dispatch({ 
              type: 'ADVANCE_STAGE', 
              payload: targetStage
            });
          }, 750); 
        }} 
      />
    );
  }

  if (!room) {
    return <div className="appcore-loading">Loading room context...</div>;
  }

  return (
    <div className="appcore-grid">
      {/* Demo mode indicator */}
      {isDemoActive && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-warning text-background text-center py-2 px-4 font-bold">
          🎬 DEMO MODE ACTIVE - Press ESC to skip • Use "stop demo" to exit
        </div>
      )}
      
      <MultiverseRebootSequence />
      <RoomTransition 
        isActive={roomTransitionActive && transitionInfo.shouldAnimate} 
        transitionType={transitionInfo.transitionType} 
        fromZone={transitionInfo.fromZone ?? null} 
        toZone={transitionInfo.toZone ?? null} 
        onComplete={() => { 
          setRoomTransitionActive(false); 
          setLastMovementAction(''); 
        }} 
      />

      <div className="quad quad-1">
        <RoomRenderer />
        {/* Compact Progress Display in corner */}
        <div className="absolute top-2 left-2">
          <ProgressDashboard compact={true} className="w-48" />
        </div>
      </div>
      
      <div className="quad quad-2">
        <ConsoleTerminal 
          messages={state.history.map(h => ({
            id: h.id,
            content: (h as any).text || (h as any).content || '',
            type: 'system',
            timestamp: (h as any).timestamp || Date.now(),
            skipTyping: false
          }))}
          ephemeralAylaMessages={ephemeralAyla}
        />
      </div>
      
      <div className="quad quad-3">
        <PlayerStatsPanel />
        <PresentNPCsPanel npcs={npcsInRoom} onTalkToNPC={handleOpenNPCConsole} />
      </div>
      
      <div className="quad quad-4">
        <QuickActionsPanel
          availableDirections={availableDirections}
          directionRoomTitles={directionRoomTitles}
          onShowInventory={() => openModal('inventory')}
          onUse={() => openModal('useItem')}
          onLookAround={handleLookAround}
          onPickUp={() => openModal('pickUp')}
          onPress={() => {
            if (currentRoomId === 'introreset') {
              dispatch({ type: 'PRESS_BLUE_BUTTON' });
            } else {
              dispatch({ type: 'PRESS_ACTION' });
            }
          }}
          onCoffee={() => dispatch({ type: 'COFFEE_ACTION' })}
          onFullscreen={toggleFullscreen}
          isFullscreen={isFullscreen}
          soundOn={soundOn}
          onToggleSound={toggleSound}
          isDemoActive={isDemoActive}
          onJump={() => {
            const currentRoom = state.roomMap[state.currentRoomId];
            const jumpRoomId = currentRoom?.exits?.jump;
            if (jumpRoomId) {
              handleRoomChange(jumpRoomId);
            } else {
              console.warn("🚫 Jump exit not found from current room:", state.currentRoomId);
            }
          }}
          onMove={(direction: string) => {
            console.log('[AppCore] onMove called with direction:', direction);
            const currentRoom = state.roomMap[state.currentRoomId];
            console.log('[AppCore] Current room from state.roomMap:', currentRoom);
            const nextRoomId = currentRoom?.exits?.[direction];
            console.log('[AppCore] Next room ID:', nextRoomId);
            if (nextRoomId) {
              handleRoomChange(nextRoomId);
            } else {
              console.warn("🚧 Invalid direction or no exit:", direction);
            }
          }}
          onSit={() => {
            console.log('[AppCore] onSit called');
            const currentRoom = state.roomMap[state.currentRoomId];
            console.log('[AppCore] Current room from state.roomMap:', currentRoom);
            const sitRoomId = currentRoom?.exits?.sit;
            console.log('[AppCore] Sit room ID:', sitRoomId);
            if (sitRoomId) {
              handleRoomChange(sitRoomId);
            } else {
              console.warn("🚫 Sit exit not found from current room:", state.currentRoomId);
            }
          }}
          playerName={playerName}
          ctrlClickOnInstructions={hasFlag('ctrlClickOnInstructions')}
          onDebugMenu={() => dispatch({ type: 'OPEN_DEBUG' })}
          onBackout={handleBackout}
          canBackout={roomHistory.length > 0}
          currentRoomId={currentRoomId}
          npcsInRoom={npcsInRoom}
          onTalkToNPC={handleOpenNPCConsole}
          hasActiveTraps={hasActiveTraps}
          onDisarmTrap={handleDisarmTrap}
          onHelp={() => setShowAylaModal(true)}
        />
        <div className="mt-4">
          <CommandInput onCommand={handleCommand} playerName={playerName} />
        </div>
        <div className="mt-4">
          <ObjectivePanel />
        </div>
      </div>

      {hasFlag('showInventory') && (
        <div className="quad quad-4 inventory-container">
          <InventoryPanel />
        </div>
      )}
      
      {hasFlag('showDebugPanel') && <DebugPanel />}

      {/* Combat Actions Panel - only show during combat */}
      <CombatActionsPanel />

      {/* Enhanced modal overlay with proper typing */}
      <ModalOverlay isOpen={Boolean(modal)} onClose={closeModal}>
        {renderModalContent()}
      </ModalOverlay>

      {/* Blue Button Warning Modal */}
      <BlueButtonWarningModal 
        isOpen={Boolean(state.player.flags?.showBlueButtonWarning)}
        onClose={() => dispatch({ type: 'DISMISS_BLUE_BUTTON_WARNING' })}
      />

      {/* Ayla Hint Popup */}
      {currentHint && (
        <AylaHintPopup
          hint={currentHint}
          onDismiss={() => setCurrentHint(null)}
          onTalkToAyla={() => {
            // Open enhanced NPC console with Ayla
            setSelectedNPC({ id: 'ayla', name: 'Ayla' } as NPC);
            setIsGroupConversation(false);
            openModal('npcConsole');
            setCurrentHint(null);
          }}
        />
      )}

      {/* Unified AI Guidance Popup */}
      {currentGuidance && (
        <UnifiedAIPopup
          guidance={currentGuidance}
          onDismiss={() => setCurrentGuidance(null)}
          onTalkToAyla={() => {
            setSelectedNPC({ id: 'ayla', name: 'Ayla' } as NPC);
            setIsGroupConversation(false);
            openModal('npcConsole');
            setCurrentGuidance(null);
          }}
        />
      )}

      {showAylaModal && (
        <ModalOverlay isOpen={showAylaModal} onClose={() => setShowAylaModal(false)}>
          <AylaPanel />
        </ModalOverlay>
      )}

      {/* Performance Dashboard */}
      <PerformanceDashboard
        isOpen={showPerformanceDashboard}
        onClose={() => setShowPerformanceDashboard(false)}
      />

      {/* AI Usage Monitor */}
      {showAIMonitor && (
        <AIMonitorDisplay
          updates={gameplayUpdates}
          npcBehaviors={npcBehaviors}
          onClose={() => setShowAIMonitor(false)}
        />
      )}

      {/* Celebration System Active */}

      {/* Quick Win Notifications System */}
      <QuickWinNotifications />
    </div>
  );
};

// Performance monitoring cleanup
performanceMonitor.markRenderEnd();

export default AppCore;



