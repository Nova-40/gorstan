/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  Public import surface for the modular AppCore layer.
*/

export type {
  GameStage,
  OpenModalType,
  TeleportType,
  IntroCompletionData,
  AppCoreSaveSlot,
  AppCoreDirectionAvailability,
  AppCoreDirectionTitles,
} from './AppCoreTypes';

export {
  DramaticWaitTransition,
  JumpTransition,
  SipTransition,
  WaitTransition,
  MultiverseRebootSequence,
  PlayerNameCapture,
  PlayerStatsPanel,
  PresentNPCsPanel,
  InventoryPanel,
  DebugPanel,
  RoomRenderer,
  RoomTransition,
  SplashScreen,
  TeletypeIntro,
  TerminalConsole,
  WelcomeScreen,
  MainMenu,
  PauseMenu,
  RouteSelectScreen,
  TeleportManager,
  QuickActionsPanel,
  CombatActionsPanel,
  BlueButtonWarningModal,
  QuickWinNotifications,
  ProgressDashboard,
  ModalOverlay,
  PickUpItemModal,
  SaveGameModal,
  NPCConsole,
  EnhancedNPCConsole,
  UnifiedAIPopup,
  AIMonitorDisplay,
  TrapManagementModal,
  NPCSelectionModal,
  PerformanceDashboard,
  DemoScreen,
  TrialsGame,
} from './AppCoreLazyComponents';

export { default as GameStageRouter } from './GameStageRouter';
export { default as GameShell } from './GameShell';
export { default as AppCoreOverlays } from './AppCoreOverlays';
export type { RoomTransitionKind } from './AppCoreOverlays';

export { useResolvedNPCs, createAylaHelper } from './useResolvedNPCs';
export { useRoomDirections } from './useRoomDirections';
export { useAppCoreSaveLoad } from './useAppCoreSaveLoad';
export { useRoomWorldInitialisation } from './useRoomWorldInitialisation';
export { useAppCoreModalState } from './useAppCoreModalState';
export { useAppCoreKeyboard } from './useAppCoreKeyboard';
export { useAppCoreNPCConsole } from './useAppCoreNPCConsole';
export { useAppCoreDemo } from './useAppCoreDemo';
export { useAppCoreLookAround } from './useAppCoreLookAround';
export { useAppCoreSystemControls } from './useAppCoreSystemControls';
export { useAppCoreTransitions } from './useAppCoreTransitions';
export { useAppCoreRoomLifecycle } from './useAppCoreRoomLifecycle';
export { useAppCoreAI } from './useAppCoreAI';
export { useAppCoreCommandHandler } from './useAppCoreCommandHandler';
export { useAppCoreInventoryActions } from './useAppCoreInventoryActions';
