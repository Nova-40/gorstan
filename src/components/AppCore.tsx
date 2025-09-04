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
import { useGamepadControls } from '@/hooks/useGamepadControls';
import { GateProvider, useGate } from '@/state/GateContext';
import { GameMode } from '@/types/game';
import LandingScreen from '@/ui/LandingScreen';
import AttractMode from '@/demo/AttractMode';
import DemoManager from '@/demo/DemoManager';
import { BetaCodeDialog, PatreonDialog } from '../ui/UnlockDialogs';
import { UiEffectsLayer } from './effects/UiEffectsLayer';
import { TeleportPulseListener } from './effects/TeleportPulseListener';
import { GlobalAudioListener } from './effects/GlobalAudioListener';
import { AccessibilityPanel } from '../design/accessibility/AccessibilityPanel';
import { AccessibilityAnnouncer } from '../design/accessibility/AccessibilityAnnouncer';
import { RSLoreUnlockListener } from '../runesprint/ui/RSLoreUnlockListener';
import RSNPCQuipListener from '../runesprint/ui/RSNPCQuipListener';
import RSNPCAutoQuips from '../runesprint/ui/RSNPCAutoQuips';
import MetaProgressionListener from '../meta/MetaProgressionListener';
import { RSHUD } from '../runesprint/ui/RS_HUD';
import { RSResults } from '../runesprint/ui/RS_Results';
import { SceneTransition } from '../design/motion/SceneTransition';
import { RUNE_SPRINT_BASE_DURATION_MS } from '../design/constants/timing';
import { getFragmentCount } from '../runesprint/features/RS_LoreRegister';
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
import { installObjectivesNudger, uninstallObjectivesNudger } from '../core/objectives/nudger';
import AylaPanel from './AylaPanel';
import InventoryPanel from './InventoryPanel';
import DebugPanel from './DebugPanel';
import RoomRenderer from './RoomRenderer';
import ArtifactChamberPuzzle from './ArtifactChamberPuzzle';
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
import InventoryTicker from './InventoryTicker';
import { setGameDispatch } from '../utils/dispatchAccess';
import { useUiEffects } from '../hooks/useUiEffects';

import { useFlags } from '../hooks/useFlags';
import { useGameState } from '../state/gameState';
import { useLibrarianLogic } from '../hooks/useLibrarianLogic';
import { useModuleLoader } from '../hooks/useModuleLoader';
import { useOptimizedEffects } from '../hooks/useOptimizedEffects';
import { useRoomTransition } from '../hooks/useRoomTransition';
import { useWendellLogic } from '../hooks/useWendellLogic';

// Lazy-load heavy subsystems (achievement engine, NPC AI, wandering NPCs) to shrink initial bundle.
import { initializeScoreManager } from '../state/scoreManager';
import { initializeCodexTracker } from '../logic/codexTracker';
import { initializeMiniquests } from '../engine/miniquestInitializer';
import { loadCelebrationIndex } from '../celebrate/index';
import { handleRoomEntry } from '../engine/roomEventHandler';
import { getAllRoomsAsObject } from '../utils/roomLoader';
import { performanceMonitor } from '../utils/performanceMonitor';
import { onRoomEntry, periodicConversationCheck } from '../npc/triggers';
import { getTrapByRoom } from '../engine/trapController';

import { UseItemModal } from "./UseItemModal";
import { InventoryModal } from "./InventoryModal";
// ModalOverlay deprecated; using RetroModal-based components directly
import PickUpItemModal from './PickUpItemModal';
import SaveGameModal from './SaveGameModal';
import { SaveManager } from '../services/SaveManager';
import NPCConsole from './NPCConsole';
import EnhancedNPCConsole from './EnhancedNPCConsole';
import Modal from './Modal';
import AylaHintPopup from './AylaHintPopup';
// Legacy debug menu import removed; new gated overlay lives in src/debug
// Legacy DebugMenu removed – replaced by debug/DebugMenuOverlay
import DebugMenuOverlay from '@/debug/DebugMenuOverlay';
import { useDebugMenu } from '@/debug/useDebugMenu';
import { DebugMenu } from '@/debug/DebugMenu';
import { DemoModeService } from '@/demo/DemoModeService';
import { FEATURES, IS_DEV } from '@/config';
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
// npcAI dynamically imported – see lazy loader logic below
import { itemDescriptions } from '../data/itemDescriptions';
// Easter Egg system
import { easterEggEngine } from '../features/easter-eggs/EasterEggEngine';
import { registerDefaultEggs } from '../features/easter-eggs/registry';

import type { Room } from '../types/Room';
import type { NPC, NPCMood } from '../types/NPCTypes';
import { demoController, setDemoDispatch } from '../demo/demoController';
// Removed unused RockFieldArcade import (arcade launched via other controllers)
import { isDemoEnvironment } from '../demo/demoGate';
import type { GameTransition } from '../types/GameTypes';

/**
 * Enhanced type definitions for better type safety
 */
type GameStage = 'splash' | 'welcome' | 'nameCapture' | 'routeSelect' | 'intro' | 'demo' | 'game' | 'trialsGame' |
  'transition_jump' | 'transition_sip' | 'transition_wait' | 'transition_dramatic_wait';

type OpenModalType = 'inventory' | 'useItem' | 'look' | 'pickUp' | 'saveGame' | 'npcConsole' | 'npcSelection' | 'trapManagement' | 'pause' | 'renamePlayer' | null;

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
// Internal component containing the original full game implementation
const FullGameRootImpl: React.FC = () => {
  // original AppCore code begins
  const AppCore: React.FC = () => {
  // Enhanced state with proper typing
  const { state, dispatch } = useGameState();
  performanceMonitor.markRenderStart();
  // Objectives nudger lifecycle
  // Install objectives nudger once (internal interval references getState each tick); avoid reinstall every state change
  useEffect(() => { installObjectivesNudger(()=>state); return () => uninstallObjectivesNudger(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);
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
  // (Easter egg effects relocated below state declarations)
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
  // Demo mode wiring (new autoplay system)
  const debug = useDebugMenu();
  const [demoBanner, setDemoBanner] = useState<string | undefined>();
  const demoRef = useRef<DemoModeService | null>(null);
  // Placeholder helpers (replace with actual implementations present in broader file scope)
  const injectInput = (cmd: string) => {
    try { (window as any).dispatchEvent(new CustomEvent('demoCommand', { detail: { cmd } })); } catch {}
    // Reuse existing command handling path
    if (typeof (handleCommand as any) === 'function') (handleCommand as any)(cmd);
  };
  const getSnapshot = () => ({
    roomId: state.currentRoomId,
    transcript: state.history.map(h => (h as any).text || (h as any).content || '').slice(-10),
    inventory: (state.player?.inventory || []).map((i: any) => i?.id || i?.name || ''),
    visibleWords: [] as string[],
  });
  const warpToRoom = (roomId: string) => {
    if (state.roomMap[roomId]) {
      handleRoomChange(roomId);
    }
  };
  useEffect(() => {
    demoRef.current = new DemoModeService(injectInput, getSnapshot, warpToRoom, setDemoBanner);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!IS_DEV || !FEATURES.DEBUG_MENU_ENABLED) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'F10') { e.preventDefault(); debug.toggle(); }
      if (e.key === 'Escape') { demoRef.current?.stop('aborted'); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [debug]);

  // Modal state with proper typing
  const [modal, setModal] = useState<OpenModalType>(null);
  const [lookLines, setLookLines] = useState<string[]>([]);
  const lookModalTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedNPC, setSelectedNPC] = useState<NPC | null>(null);
  const [isGroupConversation, setIsGroupConversation] = useState(false);
  // Register dispatch with demo controller so demo can start when triggered
  useEffect(() => { try { setDemoDispatch(dispatch); } catch {} }, [dispatch]);
  const [showAylaModal, setShowAylaModal] = useState(false);

  // Ayla hint system state
  const [currentHint, setCurrentHint] = useState<AylaHintResponse | null>(null);
  const [currentGuidance, setCurrentGuidance] = useState<AIGuidanceResponse | null>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [roomEntryTime, setRoomEntryTime] = useState<number>(Date.now());
  const [aylaHintSystem] = useState(() => new AylaHintSystem());
  const [ephemeralAyla, setEphemeralAyla] = useState<Array<{ id: string; content: string; expiresAt: number }>>([]);
  const uiFx = useUiEffects();

  // AI Usage Monitoring state
  const [gameplayUpdates, setGameplayUpdates] = useState<GameplayUpdate[]>([]);
  const [showAIMonitor, setShowAIMonitor] = useState<boolean>(false);
  const [npcBehaviors, _setNpcBehaviors] = useState<Record<string, string>>({});
  // Previously declared state (restored after refactor)
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [roomHistory, setRoomHistory] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Controller pause toggle (currently informational only)
  const [_controllerPaused, setControllerPaused] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [roomFallbackAttempted, setRoomFallbackAttempted] = useState(false);
  const [showPerformanceDashboard, setShowPerformanceDashboard] = useState(false);
  // Easter eggs settings & UI ephemeral visuals
  const [allowEasterEggs, setAllowEasterEggs] = useState(true);
  const [fishGlyphs, setFishGlyphs] = useState<Array<{ id: string; x: number; created: number }>>([]);
  const [aylaOverlay, setAylaOverlay] = useState<null | { id: string; expires: number }>(null);
  // Track last announced / applied Rune Sprint low-time second to debounce audio + announcer fallback (extra safety)
  // Removed unused rsLowTimeLastSecondRef (was unused after refactor)
  // Health & inventory tracking for accessibility announcements
  const lastHealthRef = useRef<number | null>(null);
  const lastInventorySizeRef = useRef<number>(state.player?.inventory?.length || 0);
  const easterEggLastRoomRef = useRef<string | null>(null);
  const playStartRef = useRef<number>(Date.now());
  const periodicEggTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Register easter eggs once (skip in accessibility mode)
  useEffect(() => {
    if (!allowEasterEggs || (state as any).accessibilityMode) return;
    registerDefaultEggs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowEasterEggs, (state as any).accessibilityMode]);

  // Periodic long-session trigger (every 5 min after 10 min)
  useEffect(() => {
    if (!allowEasterEggs || (state as any).accessibilityMode) return;
    if (periodicEggTimerRef.current) clearInterval(periodicEggTimerRef.current);
    periodicEggTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - playStartRef.current;
      if (elapsed > 10 * 60 * 1000) {
        easterEggEngine.maybeFire();
      }
    }, 5 * 60 * 1000);
    return () => { if (periodicEggTimerRef.current) clearInterval(periodicEggTimerRef.current); };
  }, [allowEasterEggs, (state as any).accessibilityMode]);

  // Trigger on room entry (low probability gate)
  useEffect(() => {
    if (!allowEasterEggs || (state as any).accessibilityMode) return;
    const current = state.currentRoomId;
    if (current && current !== easterEggLastRoomRef.current) {
      easterEggLastRoomRef.current = current;
      if (Math.random() < 0.05) easterEggEngine.maybeFire();
    }
  }, [state.currentRoomId, allowEasterEggs, (state as any).accessibilityMode]);

  // UI event listeners for eggs
  useEffect(() => {
    if (!allowEasterEggs || (state as any).accessibilityMode) return;
    const handleGlitch = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.kind === 'fish') {
        const id = Math.random().toString(36).slice(2);
        setFishGlyphs(g => [...g, { id, x: Math.random() * 80 + 10, created: Date.now() }]);
        setTimeout(() => setFishGlyphs(g => g.filter(f => f.id !== id)), 6000);
      }
    };
    const handleTeleport = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.mode === 'fractal' && detail?.source === 'easter-egg') {
        setAylaOverlay({ id: 'ayla-egg', expires: Date.now() + 5000 + Math.random() * 2000 });
      }
    };
    document.addEventListener('ui:glitch', handleGlitch as any);
    document.addEventListener('ui:teleport', handleTeleport as any);
    return () => {
      document.removeEventListener('ui:glitch', handleGlitch as any);
      document.removeEventListener('ui:teleport', handleTeleport as any);
    };
  }, [allowEasterEggs, (state as any).accessibilityMode]);

  // Expire Ayla overlay
  useEffect(() => {
    if (!aylaOverlay) return;
    const t = setInterval(() => {
      if (aylaOverlay && Date.now() > aylaOverlay.expires) setAylaOverlay(null);
    }, 500);
    return () => clearInterval(t);
  }, [aylaOverlay]);

  // Save game state - Enhanced with migration support
  const [saveSlots, setSaveSlots] = useState<Array<{ id: string; name: string; playerName: string; currentRoom: string; timestamp: number; score: number; playTime: number }>>([]);

  // --- Lazy subsystem refs/state (outside of saveSlots state definition) ---
  const npcAIModuleRef = useRef<any>(null);
  const wanderingModuleRef = useRef<any>(null);
  const achievementEngineInitRef = useRef(false);
  // Only need setter – omit state variable to avoid unused warning
  const [, setNpcAIModuleLoaded] = useState(false);

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
  // Dispatch UI micro teleport event immediately (decoupled visual) – safe guarded
  try { document.dispatchEvent(new CustomEvent('ui:teleport', { detail: { mode: teleportType, source: 'zone-change' } })); } catch {}
        
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
  // Floating rename button (initialized later after openModal available)
  // Will be defined via useMemo after openRename; placeholder here for type context.
  let renameButton: React.ReactNode; // reassigned below
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

  // Auto-skip name capture if a persisted name already exists and we're still at welcome/nameCapture.
  useEffect(() => {
    // Only run client-side
    if (typeof window === 'undefined') return;
    if (!state.player?.name) {
      // Try legacy persisted key
      try {
        const raw = localStorage.getItem('gorstan.playerName');
        if (raw && !state.player.name) {
          const parsed = JSON.parse(raw);
          if (parsed?.name && typeof parsed.name === 'string') {
            dispatch({ type: 'SET_PLAYER_NAME', payload: parsed.name });
          }
        }
      } catch {}
    }
    if ((stage === 'welcome' || stage === 'nameCapture') && state.player?.name) {
      // Skip directly to route selection if name already known
      dispatch({ type: 'ADVANCE_STAGE', payload: 'routeSelect' });
    }
  // We intentionally exclude dispatch from deps to avoid looping when it changes identity in strict mode
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, state.player?.name]);

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

  // Dedicated small form component (defined inside to keep file locality)
  const RenamePlayerForm: React.FC<{ initialValue: string; onSubmit: (v:string)=>void; onCancel: ()=>void }> = ({ initialValue, onSubmit, onCancel }) => {
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState<string | null>(null);
    const max = 42;
    const validate = (v: string) => {
      const trimmed = v.trim();
      if (!trimmed) return 'Name cannot be empty';
      if (trimmed.length < 2) return 'Too short';
      if (trimmed.length > max) return 'Too long';
      if (!/^[A-Za-z0-9 _'-]+$/.test(trimmed)) return 'Invalid characters';
      return null;
    };
    const submit = (e: React.FormEvent) => {
      e.preventDefault();
      const err = validate(value);
      setError(err);
      if (!err) onSubmit(value.trim());
    };
    return (
      <form onSubmit={submit} className="space-y-3">
        <label className="block text-xs font-medium text-amber-200/80">
          New Name
          <input
            autoFocus
            value={value}
            onChange={e=>{ setValue(e.target.value); if (error) setError(null); }}
            maxLength={max}
            className="mt-1 w-full rounded bg-zinc-800/70 border border-zinc-600 px-2 py-1 text-amber-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            aria-invalid={!!error}
            aria-describedby={error ? 'rename-error' : undefined}
          />
        </label>
        {error && <p id="rename-error" className="text-[11px] text-red-400">{error}</p>}
        <div className="flex items-center justify-between gap-2 pt-1">
          <button type="button" onClick={onCancel} className="px-2 py-1 rounded bg-zinc-700/60 hover:bg-zinc-600 text-xs">Cancel</button>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-[10px] text-zinc-500 tabular-nums">{value.trim().length}/{max}</span>
            <button type="submit" className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-500 text-xs font-semibold text-black disabled:opacity-40" disabled={!!validate(value)}>
              Save
            </button>
          </div>
        </div>
      </form>
    );
  };

  const openRename = useCallback(() => openModal('renamePlayer'), [openModal]);
  // Memoize button to avoid re-renders unless name changes
  renameButton = useMemo(() => (
    <button
      onClick={openRename}
      className="fixed top-2 left-2 z-[1200] px-2 py-1 rounded bg-zinc-800/70 hover:bg-zinc-700 text-xs text-amber-300 border border-zinc-600 font-mono"
      title="Change player name"
      aria-label="Change player name"
    >{playerName}</button>
  ), [openRename, playerName]);

  // --- Rename Player Modal (lightweight, accessible) ---
  const renameModal = useMemo(() => {
    if (modal !== 'renamePlayer') return null;
    const current = state.player?.name || '';
    return (
      <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="rename-player-title">
        <div className="w-[min(90%,340px)] rounded-lg border border-amber-500/30 bg-zinc-900/95 shadow-xl p-4 animate-fade-in">
          <h2 id="rename-player-title" className="text-sm font-semibold tracking-wide text-amber-300 mb-3">Change Player Name</h2>
          <RenamePlayerForm
            initialValue={current}
            onSubmit={(val) => { dispatch({ type: 'SET_PLAYER_NAME', payload: val }); setModal(null); }}
            onCancel={() => setModal(null)}
          />
        </div>
      </div>
    );
  }, [modal, state.player?.name, dispatch]);

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
  if (isDemoEnvironment() && dispatch) {
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
  }, [dispatch, stage]);

  // (Old NPC AI effect removed – replaced by lazy-loaded implementation near top)

  // NPC Console functions
  const handleOpenNPCConsole = useCallback((npc?: NPC) => {
    if (npc) {
      // Specific NPC provided
      setSelectedNPC(npc);
      openModal('npcConsole');
    } else if (npcsInRoom.length === 1) {
      // Single NPC in room
  if (npcsInRoom[0]) setSelectedNPC(npcsInRoom[0]);
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
      : room.description?.split('\n')[0] || "No description available.";
    
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
    if (!aylaHintSystem || currentHint || currentGuidance) return;

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
      if (room) setPreviousRoom(room);
    }

    // Demo system commands - only available in demo environment
  if (isDemoEnvironment()) {
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
        text: '🎬 Demo stopped. Returning to Welcome Screen.', 
              type: 'system', 
              timestamp: Date.now() 
            } 
          });
      dispatch({ type: 'ADVANCE_STAGE', payload: 'welcome' });
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
  }, [npcsInRoom, room, inventory, dispatch, handleLookAround, openModal, currentRoomId, isDemoActive]);

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

  // (Removed legacy inline startDemoMode automation; using demoController instead)

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

  // Gamepad command handling (minimal integration)
  const issueCommandFromGamepad = useCallback((raw: string) => {
    if (stage !== 'game') return;
    if (modal) return; // avoid conflicts while a modal is open
    try {
      if (raw.startsWith('go ')) {
        const dir = raw.split(' ')[1];
  const exits: Record<string, string> | undefined = room && (room as any).exits ? (room as any).exits : undefined;
  const dirKey = dir as keyof typeof exits;
  const target = exits && dirKey && typeof exits === 'object' ? exits[dirKey] : undefined;
        if (target) dispatch({ type: 'MOVE_TO_ROOM', payload: target });
        return;
      }
      switch (raw) {
        case 'look':
          if (room?.description) {
            dispatch({ type: 'ADD_MESSAGE', payload: { id: Date.now().toString(), text: Array.isArray(room.description) ? room.description.join(' ') : room.description, type: 'system', timestamp: Date.now() } });
          }
          break;
        case 'inventory':
          openModal('inventory');
          break;
        case 'help':
          dispatch({ type: 'ADD_MESSAGE', payload: { id: Date.now().toString(), text: 'Controller: D-Pad/Stick move • A Look • B Inventory • Start Pause', type: 'system', timestamp: Date.now() } });
          break;
      }
    } catch (e) {
      console.warn('[Gamepad] Failed to issue command', raw, e);
    }
  }, [stage, modal, room, dispatch, openModal]);

  useGamepadControls({
    enabled: stage === 'game',
    issueCommand: issueCommandFromGamepad,
    onMeta: (act) => {
      if (act === 'pause') {
        setControllerPaused(p => !p);
        dispatch({ type: 'ADD_MESSAGE', payload: { id: Date.now().toString(), text: 'Pause (controller)', type: 'system', timestamp: Date.now() } });
        openModal('pause');
      }
    },
    log: (msg) => dispatch({ type: 'ADD_MESSAGE', payload: { id: Date.now().toString(), text: msg, type: 'system', timestamp: Date.now() } })
  });

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
    if (!currentHint) return;
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
    if (initialRoomMapRef.current) return; // Already loaded
    try {
      const loadedRoomMap: Record<string, Room> = getAllRoomsAsObject();
      if (!loadedRoomMap || Object.keys(loadedRoomMap).length === 0) console.warn('[AppCore] No rooms loaded from main loader');
      console.log('[AppCore] Loading room map with', Object.keys(loadedRoomMap).length, 'rooms');
      initialRoomMapRef.current = loadedRoomMap;
      dispatch({ type: 'LOAD_ROOM_MAP', payload: loadedRoomMap });
      if (!loadedRoomMap[state.currentRoomId] && loadedRoomMap['controlnexus']) dispatch({ type: 'MOVE_TO_ROOM', payload: 'controlnexus' });
      // Achievement engine (lazy) – import only once at startup
      if (!achievementEngineInitRef.current) {
        import('../logic/achievementEngine')
          .then(mod => { try { mod.initializeAchievementEngine(dispatch); achievementEngineInitRef.current = true; } catch (e) { console.warn('Achievement engine init failed:', e); } })
          .catch(e => console.warn('Achievement engine dynamic import failed:', e));
      }

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
      // Preload NPC AI & Wandering NPC controller in parallel (non-blocking)
    Promise.allSettled([
  import('../services/npcAI').then(mod => { npcAIModuleRef.current = mod; setNpcAIModuleLoaded(true); }).catch(e => console.warn('npcAI preload failed:', e)),
        import('../engine/wanderingNPCController').then(mod => {
          wanderingModuleRef.current = mod;
          try { mod.initializeWanderingNPCs(state, dispatch); } catch (e) { console.warn('Wandering NPC init failed:', e); }
        }).catch(e => console.warn('wanderingNPCController preload failed:', e))
      ]);
    } catch (error) {
      console.error('[AppCore] Error during room map init:', error);
      dispatch({ type: 'ADD_MESSAGE', payload: { id: Date.now().toString(), text: 'Critical error: Unable to load room data.', type: 'error', timestamp: Date.now() } });
    }
  }, [dispatch, state.currentRoomId, state]);

  // Auto-enable debug mode if superuser flag present (set via special beta code)
  useEffect(() => {
    try {
      if (localStorage.getItem('gorstan.superuser') === '1' && !state.settings?.debugMode) {
        dispatch({ type: 'ENABLE_DEBUG_MODE' });
        dispatch({ type: 'ADD_MESSAGE', payload: { id: Date.now().toString(), text: 'Superuser debug mode enabled.', type: 'system', timestamp: Date.now() } });
      }
    } catch {}
  }, [dispatch, state.settings?.debugMode]);

  // Enhanced room description effect with proper typing
  // Track descriptions already shown to prevent spamming on every render
  const shownRoomDescriptionsRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!room) return;
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
  // (Removed setLastShownRoomDescription – legacy state not present)
      // Room entry side-effects (only first time per unique description)
      handleRoomEntry(room, state, dispatch);
      // Lazy call wandering NPC room entry handler
      if (wanderingModuleRef.current?.handleRoomEntryForWanderingNPCs) {
        try { wanderingModuleRef.current.handleRoomEntryForWanderingNPCs(room, state, dispatch); } catch (e) { console.warn('Wandering NPC room entry handler failed:', e); }
      } else {
        import('../engine/wanderingNPCController')
          .then(mod => {
            wanderingModuleRef.current = mod;
            try { mod.handleRoomEntryForWanderingNPCs(room, state, dispatch); } catch (e) { console.warn('Wandering NPC room entry handler (post-load) failed:', e); }
          })
          .catch(e => console.warn('Failed to load wanderingNPCController for room entry:', e));
      }
      onRoomEntry(state, dispatch, room.id, state.previousRoomId);
      const currentZone = room.zone || '';
      // Micro visual: spark glitch when entering glitch zone
      if (currentZone.includes('glitchZone') && !(state as any).accessibilityMode) {
        uiFx.glitch({ kind: 'spark', intensity: 0.8, source: 'zone-entry' });
      }
      const npcsHere = state.npcsInRoom || [];
      if (npcsHere.length > 1) {
        import('../npc/groupChatLogic').then(({ GroupChatManager }) => {
          if (GroupChatManager.shouldForceGroupChat(room.id, currentZone)) {
            dispatch({ type: 'SET_FLAG', payload: { flag: 'forceGroupChat', value: true } });
            if (currentZone === 'stantonZone' || currentZone === 'stantonharcourtZone') {
              setTimeout(() => {
                setIsGroupConversation(true);
                setSelectedNPC(npcsHere[0] || null);
                openModal('npcConsole');
              }, 2000);
            }
          }
        });
      }
    }
  }, [room, isDemoActive, dispatch, state]);

  // Idle ambient glitch pulses in glitch zone (every ~6s after 30s idle)
  useEffect(() => {
    if (!room || !(room.zone || '').includes('glitchZone')) return;
    if ((state as any).accessibilityMode) return;
    let lastLen = state.history.length;
    let idleStart = Date.now();
    const interval = setInterval(() => {
      if (state.history.length !== lastLen) {
        lastLen = state.history.length;
        idleStart = Date.now();
        return;
      }
      const idleMs = Date.now() - idleStart;
      if (idleMs > 30000) {
        uiFx.glitch({ kind: 'spark', intensity: 0.5 + Math.random()*0.3, source: 'idle-glitch' });
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [room?.zone, state.history.length, uiFx, room]);

  // Dynamic document.title updates (room / stage / Rune Sprint urgency)
  useEffect(() => {
    try {
      let base = 'Gorstan';
      if (stage === 'welcome' || stage === 'splash') base = 'Gorstan – Title';
      else if (stage === 'trialsGame') base = 'Gorstan – Trials';
      else if (stage.startsWith('transition_')) base = 'Gorstan – Transition';
      else if (stage === 'demo') base = 'Gorstan – Demo';
      else if (room?.title) base = `Gorstan – ${room.title}`;
      // Rune Sprint urgency overlay: if active and <=10s remaining, prefix countdown
      const rsActiveElem: HTMLElement | null = document.querySelector('[data-rs-active="true"][data-rs-time]');
      if (rsActiveElem) {
       
        const ms = parseInt(rsActiveElem.getAttribute('data-rs-time') || '0', 10);
        if (!isNaN(ms)) {
          const sec = Math.floor(ms / 1000);
          if (sec <= 10) base = `(${sec}) ` + base;
        }
      }
      document.title = base;
    } catch {}
  }, [stage, room?.title, state.currentRoomId]);

  // Inventory & health change live announcements (piggyback on AccessibilityAnnouncer via custom events)
  useEffect(() => {
    const currentHealth = (state.player as any)?.health;
    if (typeof currentHealth === 'number' && lastHealthRef.current !== null && currentHealth !== lastHealthRef.current) {
      const delta = currentHealth - lastHealthRef.current;
      document.dispatchEvent(new CustomEvent('a11y:health-change', { detail: { current: currentHealth, delta } }));
    }
    if (typeof currentHealth === 'number') lastHealthRef.current = currentHealth;
    const invSize = state.player?.inventory?.length || 0;
    if (invSize !== lastInventorySizeRef.current) {
      const added = invSize > lastInventorySizeRef.current;
      document.dispatchEvent(new CustomEvent('a11y:inventory-change', { detail: { size: invSize, diff: invSize - lastInventorySizeRef.current, action: added ? 'added' : 'removed' } }));
      lastInventorySizeRef.current = invSize;
    }
  }, [state.player?.health, state.player?.inventory?.length]);

  // Enhanced transition execution effect with proper error handling and typing
  useEffect(() => {
    console.log('[AppCore] Transition execution effect triggered:', {
      readyForTransition,
      transitionType,
      roomMapLoaded: Object.keys(roomMap).length > 0
    });
    
    if (!readyForTransition || !transitionType || Object.keys(roomMap).length === 0) return;
    
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

  // Demo mode effect - trigger demoController when entering demo stage
  const demoStartedRef = useRef(false);
  useEffect(() => {
    // Bridge: if outer gate switches to DEMO mode (LandingScreen Play Demo), ensure we enter demo stage
    // Previously Quick Demo path set isDemoActive directly; after cleanup we map gate mode to stage here.
    try {
      // We access gate context via useGate earlier; defensive in case of provider changes.
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const gate = (useGate as any)?.();
      if (gate && gate.mode === 'DEMO' && stage !== 'demo' && !demoStartedRef.current) {
        dispatch({ type: 'ADVANCE_STAGE', payload: 'demo' });
      }
    } catch {}
    if (stage === 'demo') {
      if (!demoStartedRef.current) {
        console.log('[AppCore] Entered demo stage – invoking demoController.startDemo soon');
        setIsDemoActive(true);
        demoStartedRef.current = true;
        const demoTimer = setTimeout(() => {
          console.log('[AppCore] Demo timer fired - calling demoController.startDemo()');
          try {
            demoController.startDemo();
          } catch (err) {
            console.error('[AppCore] demoController.startDemo failed', err);
          }
        }, 1200);
        // Keyboard shortcut: Shift+Esc to stop demo
        const keyHandler = (e: KeyboardEvent) => {
          if (e.key === 'Escape' && e.shiftKey) {
            e.preventDefault();
            try { demoController.stopDemo(); } catch (err) { console.error('Failed stopDemo via hotkey', err); }
          }
        };
        window.addEventListener('keydown', keyHandler);
        return () => {
          clearTimeout(demoTimer);
          window.removeEventListener('keydown', keyHandler);
        };
      } else {
        // Debug loop guard
        if (console && typeof console.debug === 'function') {
          console.debug('[AppCore] Demo stage already active; skipping re-init');
        }
      }
    } else {
      // Only clear demo flag if we actually came from a demo stage run
      if (demoStartedRef.current) {
        console.log('[AppCore] Exiting demo stage – stopping demo mode flag');
        setIsDemoActive(false);
        demoStartedRef.current = false;
      }
      // If demoStartedRef was never set (e.g., Quick Demo path sets isDemoActive manually while in game stage)
      // we intentionally keep the banner active.
    }
  }, [stage]);

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

  // Enhanced guard rails with proper type checking.
  // IMPORTANT: Allow the standalone Trials mini-game stage to render even before any room/roomMap is loaded.
  // The trials route selection happens before entering the main world; previously this early return blocked
  // the 'trialsGame' stage (showing a perpetual loading screen). We now exempt that stage.
  if (stage !== 'trialsGame' && (!state.currentRoomId || !state.roomMap || !state.roomMap[state.currentRoomId])) {
    if (import.meta.env.DEV) {
      console.log('Guard rails:', {
        stage,
        currentRoomId: state.currentRoomId,
        roomMapLoaded: Boolean(state.roomMap),
        roomExists: Boolean(state.roomMap?.[state.currentRoomId])
      });
    }
    // If demo mode active, avoid getting stuck – attempt to fallback to original controlnexus
    if (!(demoController.isDemoMode() && state.roomMap['controlnexus'])) {
      return <div className="appcore-loading">Loading game world...</div>;
    }
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
  // Inject micro UI teleport effect when TeleportManager mounts (stage-level transitions)
  // Do this before splash/welcome gating so transitions also show micro overlay
  if (teleportType && typeof document !== 'undefined') {
    try { document.dispatchEvent(new CustomEvent('ui:teleport', { detail: { mode: teleportType, source: 'teleport-manager' } })); } catch {}
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
  // Trials: Rock Field arcade mini-game
  if (state.currentRoomId === 'trials_rockfield') {
  // TrialsRockfield component ref removed during refactor; proceed to built-in trialsGame stage instead
  return null;
  }
  if (state.currentRoomId === 'artifactChamber') {
    return <ArtifactChamberPuzzle />;
  }
  if (stage === 'welcome') {
    return (
      <WelcomeScreen 
        onBegin={() => dispatch({ type: 'ADVANCE_STAGE', payload: 'nameCapture' })} 
        onLoadGame={() => dispatch({ type: 'LOAD_SAVED_GAME' })} 
        onStartDemo={() => {
          // Set demo-specific player name and jump straight into game + start demo script
          dispatch({ type: 'SET_PLAYER_NAME', payload: 'Demo Player' });
          // Move directly to game stage so environment is ready
          dispatch({ type: 'ADVANCE_STAGE', payload: 'game' });
          // Activate demo flag & schedule controller start
          setIsDemoActive(true);
          setTimeout(() => {
            try {
              demoController.startDemo();
            } catch (e) {
              console.error('[AppCore] Failed to start demo from WelcomeScreen:', e);
            }
          }, 600);
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
            // Move player into the Artifact Chamber and transition to main game UI
            dispatch({ type: 'CHANGE_ROOM', payload: 'artifactChamber' });
            dispatch({ type: 'ADD_MESSAGE', payload: { id: Date.now().toString(), text: 'You emerge from the maze into the hidden Artifact Chamber. An ancient glow beckons from the pedestal ahead.', type: 'narrative', timestamp: Date.now() } });
            dispatch({ type: 'ADVANCE_STAGE', payload: 'game' });
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
    const showTrialsPrompt = state.flags?.show_aevira_trials_prompt && (state.flags?.pending_trials_route === 'short10_trialsofgorstan' || state.flags?.pending_trials_route === 'short30_trialsofgorstan');
    const accept = () => {
      dispatch({ type: 'SET_FLAGS', payload: { ...state.flags, show_aevira_trials_prompt: false } });
      dispatch({ type: 'ADVANCE_STAGE', payload: 'trialsGame' });
    };
    const sipCoffee = () => {
      const base = 4;
      const delta = Math.random() < 0.5 ? -2 : 2;
      const finalLives = base + delta;
      try { localStorage.setItem('playerLives', String(finalLives)); } catch {}
      dispatch({ type: 'ADD_MESSAGE', payload: { id: Date.now().toString(), text: `☕ You sip the paradox brew. Trial lives shift to ${finalLives}.`, type: 'system', timestamp: Date.now() } });
      dispatch({ type: 'SET_FLAGS', payload: { ...state.flags, show_aevira_trials_prompt: false } });
      dispatch({ type: 'ADVANCE_STAGE', payload: 'trialsGame' });
    };
    return (
      <>
        <RouteSelectScreen 
          onRouteSelect={(routeId) => {
            dispatch({ type: 'SET_ROUTE', payload: routeId });
            if (routeId === 'demo') {
              dispatch({ type: 'ADVANCE_STAGE', payload: 'demo' });
            } else if (routeId === 'short10_trialsofgorstan' || routeId === 'short30_trialsofgorstan') {
              dispatch({ type: 'SET_FLAGS', payload: { ...state.flags, show_aevira_trials_prompt: true, pending_trials_route: routeId } });
            } else {
              dispatch({ type: 'ADVANCE_STAGE', payload: 'intro' });
            }
          }}
          onCancel={() => dispatch({ type: 'ADVANCE_STAGE', payload: 'welcome' })}
        />
        {showTrialsPrompt && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/90 text-green-300 font-mono p-6 z-[999]">
            <div className="max-w-xl w-full border-2 border-emerald-500 rounded-xl p-8 bg-gradient-to-b from-slate-900 to-black shadow-[0_0_30px_rgba(16,185,129,0.35)]">
              <h1 className="text-2xl mb-4 tracking-wide text-emerald-300">The Aevira Challenge</h1>
              <p className="text-sm leading-relaxed text-green-400/80 mb-6">The Aevira — an ancient and powerful race — have chosen you to be their potential champion. Prove your worth by completing the Trials. Or... delay destiny for a moment of contemplative caffeine.</p>
              <div className="grid gap-4 md:grid-cols-2">
                <button onClick={accept} className="px-4 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 border border-emerald-400/40 font-semibold shadow shadow-emerald-500/25">Accept The Aevira Challenge</button>
                <button onClick={sipCoffee} className="px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-cyan-400/40 font-semibold text-cyan-300 shadow shadow-cyan-500/25">Sip Coffee</button>
              </div>
              <div className="mt-5 text-[11px] text-green-500/60">Coffee effect: Random anomaly alters your starting trial lives (2 or 6).</div>
            </div>
          </div>
        )}
      </>
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
    <div
      className="appcore-grid"
      data-scale={(() => {
        // Auto-scale heuristic: shrink if either dimension is tight
        const w = typeof window !== 'undefined' ? window.innerWidth : 1920;
        const h = typeof window !== 'undefined' ? window.innerHeight : 1080;
        if (w < 900 || h < 700) return 'sm';
        if (w < 780 || h < 620) return 'xs';
        return undefined;
      })()}
    >
      {/* Demo mode indicator */}
      {isDemoActive && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="mx-auto max-w-screen-lg">
            <div className="m-2 rounded-lg bg-black/75 backdrop-blur-sm border border-yellow-400 text-yellow-300 shadow-lg px-4 py-3 flex flex-col md:flex-row items-center gap-3 justify-between">
              <div className="text-sm md:text-base font-semibold tracking-wide flex-1 text-center md:text-left">
                🎬 DEMO MODE ACTIVE
                <span className="hidden md:inline"> – Press ESC to skip</span>
              </div>
              <div className="flex items-center gap-2">
        <button
                  type="button"
                  onClick={() => { 
                    try { demoController.stopDemo(); } catch (e) { console.error('Failed stopDemo', e); } 
                    // Explicitly clear local demo flag so banner disappears when stopping from Quick Demo path
                    setIsDemoActive(false); 
          demoStartedRef.current = false; 
          dispatch({ type: 'ADVANCE_STAGE', payload: 'welcome' });
                  }}
                  className="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-xs md:text-sm font-bold shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                  aria-label="Stop demo mode"
                >
                  Stop Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {demoBanner && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, padding: '6px 10px', background: 'rgba(0,0,0,.7)', color: '#9fe', fontFamily: 'ui-monospace,Menlo,monospace', zIndex: 9998 }}>
          {demoBanner}
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
  {/* Micro-effects layer (glitch / teleport overlays) */}
  <UiEffectsLayer />
  <TeleportPulseListener />
  <GlobalAudioListener />
  <AccessibilityAnnouncer enabled={Boolean((state as any).accessibilityMode)} />
  {/* Rune Sprint lore unlock + fragment toast listener (lightweight, always mounted) */}
  <RSLoreUnlockListener />
  <RSNPCQuipListener />
  <RSNPCAutoQuips />
  <MetaProgressionListener />
  {/* Rune Sprint overlay controller */}
  <RuneSprintOverlayController />

      <div className="quad quad-1">
        <RoomRenderer />
        {/* Compact Progress Display in corner */}
        <div className="absolute top-2 left-2">
          <ProgressDashboard compact={true} className="w-48" />
        </div>
  <InventoryTicker />
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
      {FEATURES.DEBUG_MENU_ENABLED && IS_DEV && debug.open && (
        <DebugMenu
          onStartDemo={(packId) => { demoRef.current?.start(packId); debug.hide(); }}
          onStopDemo={() => demoRef.current?.stop('aborted')}
          onClose={() => debug.hide()}
        />
      )}

      {/* Combat Actions Panel - only show during combat */}
      <CombatActionsPanel />

  {/* Floating Player Rename Button */}
  {renameButton}

  {/* Dynamic modal content (already returns RetroModal-based components) */}
  {Boolean(modal) && renderModalContent()}

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
        <AylaPanel />
      )}

      {/* Performance Dashboard */}
      <PerformanceDashboard
        isOpen={showPerformanceDashboard}
        onClose={() => setShowPerformanceDashboard(false)}
      />

  {/* Rename Player Modal */}
  {renameModal}

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
      {/* Easter Egg Toggle (developer/settings control) */}
      <div className="fixed bottom-2 right-2 z-[650]">
        <button
          onClick={() => setAllowEasterEggs(a => !a)}
          className="px-2 py-1 rounded text-[10px] font-mono bg-black/60 border border-cyan-400/40 text-cyan-200 hover:bg-black/80 hover:border-cyan-300 transition"
          aria-pressed={allowEasterEggs}
          aria-label="Toggle narrative easter eggs"
        >
          Eggs: {allowEasterEggs ? 'ON' : 'OFF'}
        </button>
      </div>
  {/* Accessibility preferences panel & toggle button */}
  <AccessibilityPanel dispatch={dispatch} />
      {/* Easter Egg ephemeral UI layer */}
  {allowEasterEggs && !(state as any).accessibilityMode && (
        <div className="pointer-events-none fixed inset-0 z-[600] select-none">
          {fishGlyphs.map(f => (
            <div
              key={f.id}
              className="absolute text-cyan-300 text-xs"
              style={{ top: `${((Date.now() - f.created)/6000)*40 + 5}vh`, left: `${f.x}%`, opacity: 0.85 }}
            >
              🐟
            </div>
          ))}
          {aylaOverlay && (
            <div className="absolute inset-x-0 top-10 mx-auto w-[420px] bg-fuchsia-900/40 backdrop-blur-md border border-fuchsia-400/40 rounded-lg shadow-lg p-4 text-fuchsia-200 font-mono text-sm">
              <div className="font-bold tracking-wide mb-1 text-fuchsia-300">Ayla Advisory</div>
              <div className="text-fuchsia-100/90">"Temporal resonance stable. Continue exploring; hidden narrative threads are aligning."</div>
            </div>
          )}
        </div>
      )}
  {/* New gated Debug Menu Overlay (F10 / Ctrl+` or command 'debug') */}
  {(() => {
    const dbg = useDebugMenu();
    // Attach one-off event listener (hook safe inside IIFE render pattern)
    React.useEffect(() => {
  const handler = () => dbg.show();
      window.addEventListener('debug:open' as any, handler as any);
      document.addEventListener('debug:open', handler as any);
      return () => {
        window.removeEventListener('debug:open' as any, handler as any);
        document.removeEventListener('debug:open', handler as any);
      };
  }, [dbg]);
  return dbg.open ? <DebugMenuOverlay onClose={dbg.hide} /> : null;
  })()}
    </div>
  );
};

// Performance monitoring cleanup
performanceMonitor.markRenderEnd();
  return <AppCore />; // Render original full game UI
};

// Shell that selects between gate modes and the full game root.
const AppShellInner: React.FC = () => {
  const { mode, setMode, unlock } = useGate();
  // Safety: if mode says FULL but unlock revoked in storage, relock.
  useEffect(() => { if (mode === GameMode.FULL && !unlock.isUnlocked) setMode(GameMode.LOCKED); }, [mode, unlock.isUnlocked, setMode]);
  switch (mode) {
    case GameMode.ATTRACT: return <AttractMode onExit={() => setMode(GameMode.LOCKED)} />;
    case GameMode.DEMO: return <DemoManager onEnd={() => setMode(GameMode.LOCKED)} />;
  case GameMode.FULL: return <FullGameRootImpl />;
    case GameMode.LOCKED:
    default: return <LandingScreen />;
  }
};

// Exported root now wraps gate context; retains previous default export signature.
const AppCoreRoot: React.FC = () => (
  <GateProvider>
    <AppShellInner />
    {/* Global unlock dialogs */}
    <BetaCodeDialog />
    <PatreonDialog />
  </GateProvider>
);
export default AppCoreRoot;

// RuneSprintOverlayController: attaches Rune Sprint HUD & Results to global DOM CustomEvents.
// Minimal integration without altering existing game loop code elsewhere.

interface RSRuntimeState {
  active: boolean;
  timeRemaining: number;
  guardianDistance: number;
  hintCount: number;
  skipsUsed: number;
  perfect: boolean;
  guardianRage: boolean;
  results: { outcome: 'success' | 'fail_time' | 'fail_guardian' | 'fail_rage' | 'fail_skip'; perfect: boolean } | null;
}

const initialRS: RSRuntimeState = { active: false, timeRemaining: 0, guardianDistance: 999, hintCount: 0, skipsUsed: 0, perfect: true, guardianRage: false, results: null };

export const RuneSprintOverlayController: React.FC = () => {
  const [rs, setRS] = useState<RSRuntimeState>(initialRS);
  const [frags, setFrags] = useState<number>(0);

  useEffect(() => {
    const start = (e: Event) => {
      const d = (e as CustomEvent).detail || {};
  setRS(prev => ({ ...prev, active: true, results: null, timeRemaining: d.time || RUNE_SPRINT_BASE_DURATION_MS, hintCount: 0, skipsUsed: 0, perfect: true }));
      setFrags(getFragmentCount());
    };
    const tick = (e: Event) => {
      const d = (e as CustomEvent).detail || {};
      setRS(prev => prev.active ? { ...prev, timeRemaining: d.timeRemaining ?? prev.timeRemaining, guardianDistance: d.guardianDistance ?? prev.guardianDistance } : prev);
    };
    const hint = () => setRS(prev => prev.active ? { ...prev, hintCount: prev.hintCount + 1, perfect: false } : prev);
    const skip = () => setRS(prev => prev.active ? { ...prev, skipsUsed: prev.skipsUsed + 1, perfect: false } : prev);
    const rage = () => setRS(prev => prev.active ? { ...prev, guardianRage: true } : prev);
    const solved = (e: Event) => {
      const d = (e as CustomEvent).detail || {};
      if (d.fragments) setFrags(getFragmentCount());
    };
    const end = (e: Event) => {
      const d = (e as CustomEvent).detail || {};
      if (!rs.active) return;
  setRS(prev => ({ ...prev, results: { outcome: d.outcome || 'success', perfect: prev.perfect }, active: false }));
      setFrags(getFragmentCount());
    };
    document.addEventListener('rs:start', start as any);
    document.addEventListener('rs:tick', tick as any);
    document.addEventListener('rs:hint', hint as any);
    document.addEventListener('rs:skip', skip as any);
    document.addEventListener('rs:guardian-rage', rage as any);
    document.addEventListener('rs:chamber-solved', solved as any);
    document.addEventListener('rs:end', end as any);
    return () => {
      document.removeEventListener('rs:start', start as any);
      document.removeEventListener('rs:tick', tick as any);
      document.removeEventListener('rs:hint', hint as any);
      document.removeEventListener('rs:skip', skip as any);
      document.removeEventListener('rs:guardian-rage', rage as any);
      document.removeEventListener('rs:chamber-solved', solved as any);
      document.removeEventListener('rs:end', end as any);
    };
  }, [rs.active]);

  if (!rs.active && !rs.results) return null;

  return (
    <>
      {rs.active && (
        <RSHUD
          timeRemaining={rs.timeRemaining}
          guardianDistance={rs.guardianDistance}
          fragments={frags}
          hintCount={rs.hintCount}
          skipsUsed={rs.skipsUsed}
          perfectThisChamber={rs.perfect}
          guardianRage={rs.guardianRage}
        />
      )}
      {rs.results && (
        <SceneTransition in={!!rs.results} kind="slide-up">
          <RSResults
            outcome={rs.results.outcome}
            fragments={frags}
            perfect={rs.results.perfect}
            onRestart={() => {
              setRS(initialRS);
              document.dispatchEvent(new CustomEvent('rs:start', { detail: { time: RUNE_SPRINT_BASE_DURATION_MS } }));
            }}
            onExit={() => setRS(initialRS)}
          />
        </SceneTransition>
      )}
    </>
  );
};
