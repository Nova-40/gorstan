/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  Non-live modular AppCore integration draft.

  This component is intentionally not imported by App.tsx yet. It exists to let
  TypeScript/Vercel check the modular AppCore contracts before the live
  AppCore.tsx coordinator is replaced.
*/

import React, { useMemo, useState } from 'react';

import { useGameState } from '../state/gameState';
import { useFlags } from '../hooks/useFlags';
import type { NPC } from '../types/NPCTypes';
import type { Room } from '../types/Room';
import {
  AppCoreOverlays,
  GameShell,
  GameStageRouter,
  useAppCoreAI,
  useAppCoreCommandHandler,
  useAppCoreDemo,
  useAppCoreInventoryActions,
  useAppCoreKeyboard,
  useAppCoreLookAround,
  useAppCoreMiniQuests,
  useAppCoreModalState,
  useAppCoreNavigationHistory,
  useAppCoreNPCConsole,
  useAppCoreRoomLifecycle,
  useAppCoreSaveLoad,
  useAppCoreSystemControls,
  useAppCoreTransitions,
  useResolvedNPCs,
  useRoomDirections,
  useRoomWorldInitialisation,
  type GameStage,
  type RoomTransitionKind,
} from './appcore';

function isActiveTrap(room: Room | undefined): boolean {
  if (!room) return false;
  if (room.trap && !room.trap.triggered) return true;
  return Boolean(room.traps?.some((trap) => !trap.triggered));
}

function resolveMoveTarget(room: Room | undefined, direction: string): string {
  const exits = room?.exits ?? {};
  return exits[direction] ?? direction;
}

const AppCoreModularDraft: React.FC = () => {
  const { state, dispatch } = useGameState();
  const { hasFlag } = useFlags();

  const stage = ((state.stage as GameStage | undefined) ?? 'splash') as GameStage;
  const currentRoomId = state.currentRoomId || 'controlnexus';
  const roomMap = useMemo(() => (state.roomMap || {}) as Record<string, Room>, [state.roomMap]);
  const room = roomMap[currentRoomId];
  const playerName = state.player?.name || state.playerName || 'Player';
  const history = state.history || [];
  const inventory = state.player?.inventory || state.inventory || [];
  const npcsInRoom = useResolvedNPCs(state.npcsInRoom as Array<NPC | string> | undefined, currentRoomId);
  const { availableDirections, directionRoomTitles } = useRoomDirections(room, roomMap);

  const [showPause, setShowPause] = useState(false);
  const [showPerformanceDashboard, setShowPerformanceDashboard] = useState(false);
  const [draftDemoActive, setDraftDemoActive] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [roomEntryTime, setRoomEntryTime] = useState(Date.now());
  const [roomFallbackAttempted, setRoomFallbackAttempted] = useState(false);

  const systemControls = useAppCoreSystemControls({ dispatch });
  const transitions = useAppCoreTransitions({ state, dispatch, room, roomMap, currentRoomId, stage });
  const modalState = useAppCoreModalState({ isDemoActive: draftDemoActive });
  const npcConsole = useAppCoreNPCConsole({ state, dispatch, npcsInRoom, openModal: modalState.openModal });
  const lookAround = useAppCoreLookAround({
    room,
    npcsInRoom,
    openModal: modalState.openModal,
    closeModal: modalState.closeModal,
  });
  const saveLoad = useAppCoreSaveLoad({ state, dispatch, closeModal: modalState.closeModal });
  const inventoryActions = useAppCoreInventoryActions({
    state,
    dispatch,
    currentRoomId,
    closeModal: modalState.closeModal,
  });
  const navigation = useAppCoreNavigationHistory({ dispatch, currentRoomId });
  const miniquests = useAppCoreMiniQuests({ dispatch, currentRoomId });
  const ai = useAppCoreAI({
    state,
    dispatch,
    room,
    currentRoomId,
    npcsInRoom,
    commandHistory,
    roomEntryTime,
  });

  const commandHandler = useAppCoreCommandHandler({
    state,
    dispatch,
    room,
    currentRoomId,
    inventory,
    npcsInRoom,
    isDemo: false,
    isDemoActive: draftDemoActive,
    setIsDemoActive: setDraftDemoActive,
    setCommandHistory,
    setLastMovementAction: transitions.setLastMovementAction,
    setPreviousRoom: transitions.setPreviousRoom,
    handleLookAround: lookAround.handleLookAround,
    openModal: modalState.openModal,
    checkForHints: ai.checkForHints,
    launchMiniQuest: miniquests.launchMiniQuest,
  });

  const demo = useAppCoreDemo({
    dispatch,
    stage,
    hasFlag,
    setTeleportType: transitions.setTeleportType,
    setTeleportCallback: transitions.setTeleportCallback,
    handleCommand: commandHandler.handleCommand,
  });

  useRoomWorldInitialisation({ state, dispatch });
  useAppCoreRoomLifecycle({
    state,
    dispatch,
    room,
    currentRoomId,
    stage,
    previousRoom: transitions.previousRoom,
    setPreviousRoom: transitions.setPreviousRoom,
    setRoomEntryTime,
    setSelectedNPC: npcConsole.setSelectedNPC,
    setIsGroupConversation: npcConsole.setIsGroupConversation,
    openModal: modalState.openModal,
    roomFallbackAttempted,
    setRoomFallbackAttempted,
  });
  useAppCoreKeyboard({
    modal: modalState.modal,
    closeModal: modalState.closeModal,
    openModal: modalState.openModal,
    showPause,
    setShowPause,
    stage,
    hasFlag,
    dispatch,
    isDemoActive: demo.isDemoActive,
    setIsDemoActive: demo.setIsDemoActive,
    setShowPerformanceDashboard,
    showAIMonitor: ai.showAIMonitor,
    setShowAIMonitor: ai.setShowAIMonitor,
    npcsInRoom,
    handleOpenNPCConsole: npcConsole.handleOpenNPCConsole,
  });

  void roomEntryTime;
  void inventoryActions;
  void miniquests.mini;
  void saveLoad.saveSlots;
  void navigation.roomHistory;
  void npcConsole.selectedNPC;
  void npcConsole.isGroupConversation;

  if (stage !== 'game') {
    return (
      <GameStageRouter
        stage={stage}
        transitionType={transitions.transitionType}
        teleportType={transitions.teleportType}
        playerName={playerName}
        dispatch={dispatch}
        setReadyForTransition={transitions.setReadyForTransition}
        setTransitionTargetRoom={transitions.setTransitionTargetRoom}
        setTransitionInventory={transitions.setTransitionInventory}
        handleTeleportComplete={transitions.handleTeleportComplete}
        startDemoRoute={demo.startDemoRoute}
      />
    );
  }

  return (
    <>
      <GameShell
        history={history}
        playerName={playerName}
        npcsInRoom={npcsInRoom}
        availableDirections={availableDirections}
        directionRoomTitles={directionRoomTitles}
        currentRoomId={currentRoomId}
        isFullscreen={systemControls.isFullscreen}
        soundOn={systemControls.soundOn}
        isDemoActive={demo.isDemoActive}
        ctrlClickOnInstructions={Boolean(state.flags?.ctrlClickOnInstructions)}
        canBackout={navigation.canBackout}
        onCommand={commandHandler.handleCommand}
        onTalkToNPC={npcConsole.handleOpenNPCConsole}
        onShowInventory={() => modalState.openModal('inventory')}
        onUse={() => modalState.openModal('useItem')}
        onLookAround={lookAround.handleLookAround}
        onPickUp={() => modalState.openModal('pickUp')}
        onPress={() => commandHandler.handleCommand('press')}
        onCoffee={() => commandHandler.handleCommand('coffee')}
        onFullscreen={systemControls.toggleFullscreen}
        onToggleSound={systemControls.toggleSound}
        onJump={() => commandHandler.handleCommand('jump')}
        onMove={(direction) => transitions.handleRoomChange(resolveMoveTarget(room, direction))}
        onSit={() => commandHandler.handleCommand('sit')}
        onDebugMenu={() => dispatch({ type: 'TOGGLE_DEBUG' })}
        onBackout={navigation.handleBackout}
        onDisarmTrap={() => modalState.openModal('trapManagement')}
        hasActiveTraps={isActiveTrap(room)}
      />

      <AppCoreOverlays
        demoBanner={demo.demoBanner}
        isDemoActive={demo.isDemoActive}
        roomTransitionActive={transitions.roomTransitionActive}
        transitionInfo={{
          shouldAnimate: transitions.transitionInfo.shouldAnimate,
          transitionType: transitions.transitionInfo.transitionType as RoomTransitionKind,
          fromZone: transitions.transitionInfo.fromZone,
          toZone: transitions.transitionInfo.toZone,
        }}
        onRoomTransitionComplete={transitions.handleRoomTransitionComplete}
        showDebugPanel={Boolean(state.settings?.debugMode || state.flags?.showDebugPanel)}
        modalOpen={modalState.modal !== null}
        onCloseModal={modalState.closeModal}
        modalContent={null}
        showPause={showPause}
        onResume={() => setShowPause(false)}
        onSave={() => modalState.openModal('saveGame')}
        onLoad={() => dispatch({ type: 'LOAD_SAVED_GAME' })}
        onOptions={() => dispatch({ type: 'RECORD_MESSAGE', payload: { id: `options-${Date.now()}`, text: 'Options are not wired in the modular draft yet.', type: 'system', timestamp: Date.now() } })}
        onQuitToMain={() => dispatch({ type: 'ADVANCE_STAGE', payload: 'welcome' })}
        showBlueButtonWarning={Boolean(state.flags?.showBlueButtonWarning)}
        onDismissBlueButtonWarning={() => dispatch({ type: 'SET_FLAG', payload: { flag: 'showBlueButtonWarning', value: false } })}
        currentHint={ai.currentHint}
        onDismissHint={() => ai.setCurrentHint(null)}
        onTalkToAylaFromHint={npcConsole.handleTalkToAyla}
        currentGuidance={ai.currentGuidance}
        onDismissGuidance={() => ai.setCurrentGuidance(null)}
        onTalkToAylaFromGuidance={npcConsole.handleTalkToAyla}
        onOpenMiniquestsFromGuidance={() => commandHandler.handleCommand('miniquests')}
        showPerformanceDashboard={showPerformanceDashboard}
        onClosePerformanceDashboard={() => setShowPerformanceDashboard(false)}
        showAIMonitor={ai.showAIMonitor}
        gameplayUpdates={ai.gameplayUpdates}
        npcBehaviors={ai.npcBehaviors}
        onCloseAIMonitor={() => ai.setShowAIMonitor(false)}
      />
    </>
  );
};

export default AppCoreModularDraft;
