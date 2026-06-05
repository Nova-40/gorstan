/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  Lazy component registry for AppCore modularisation.

  This keeps heavy UI imports out of the orchestration component and gives the
  refactor a stable place to add/remove screen-level components.
*/

import { lazyFeature } from '../../utils/lazyLoading';

export const DramaticWaitTransition = lazyFeature(() => import('../animations/DramaticWaitTransition'));
export const JumpTransition = lazyFeature(() => import('../animations/JumpTransition'));
export const SipTransition = lazyFeature(() => import('../animations/SipTransition'));
export const WaitTransition = lazyFeature(() => import('../animations/WaitTransition'));
export const MultiverseRebootSequence = lazyFeature(() => import('../MultiverseRebootSequence'));
export const PlayerNameCapture = lazyFeature(() => import('../PlayerNameCapture'));
export const PlayerStatsPanel = lazyFeature(() => import('../PlayerStatsPanel'));
export const PresentNPCsPanel = lazyFeature(() => import('../PresentNPCsPanel'));
export const InventoryPanel = lazyFeature(() => import('../InventoryPanel'));
export const DebugPanel = lazyFeature(() => import('../DebugPanel'));
export const RoomRenderer = lazyFeature(() => import('../RoomRenderer'));
export const RoomTransition = lazyFeature(() => import('../animations/RoomTransition'));
export const SplashScreen = lazyFeature(() => import('../SplashScreen'));
export const TeletypeIntro = lazyFeature(() => import('../TeletypeIntro'));
export const TerminalConsole = lazyFeature(() => import('../TerminalConsole'));
export const WelcomeScreen = lazyFeature(() => import('../WelcomeScreen'));
export const MainMenu = lazyFeature(() => import('../menus/MainMenu'));
export const PauseMenu = lazyFeature(() => import('../menus/PauseMenu'));
export const RouteSelectScreen = lazyFeature(() =>
  import('../RouteSelectScreen').then((module) => ({ default: module.RouteSelectScreen })),
);
export const TeleportManager = lazyFeature(() => import('../animations/TeleportManager'));
export const QuickActionsPanel = lazyFeature(() => import('../QuickActionsPanel'));
export const CombatActionsPanel = lazyFeature(() => import('../../ui/QuickActionsPanel'));
export const BlueButtonWarningModal = lazyFeature(() => import('../BlueButtonWarningModal'));
export const QuickWinNotifications = lazyFeature(() => import('../QuickWinNotifications'));
export const ProgressDashboard = lazyFeature(() => import('../ProgressDashboard'));
export const ModalOverlay = lazyFeature(() => import('../ModalOverlay'));
export const PickUpItemModal = lazyFeature(() => import('../PickUpItemModal'));
export const SaveGameModal = lazyFeature(() => import('../SaveGameModal'));
export const NPCConsole = lazyFeature(() => import('../NPCConsole'));
export const EnhancedNPCConsole = lazyFeature(() => import('../EnhancedNPCConsole'));
export const UnifiedAIPopup = lazyFeature(() => import('../UnifiedAIPopup'));
export const AIMonitorDisplay = lazyFeature(() => import('../AIMonitorDisplay'));
export const TrapManagementModal = lazyFeature(() => import('../TrapManagementModal'));
export const NPCSelectionModal = lazyFeature(() => import('../NPCSelectionModal'));
export const PerformanceDashboard = lazyFeature(() => import('../PerformanceDashboard'));

export const DemoScreen = lazyFeature(() => import('../DemoScreen'));
export const TrialsGame = lazyFeature(() => import('../TrialsGame'));
