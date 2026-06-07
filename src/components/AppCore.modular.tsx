/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  Modular AppCore coordinator.

  This component is the live modular AppCore entry point. It wires the extracted
  AppCore hooks and presentation components while keeping the parser/game-state
  pipeline canonical.
*/

import React, { useMemo, useState } from 'react';

import { useGameState } from '../state/gameState';
import { useFlags } from '../hooks/useFlags';
import { MiniQuestOverlay } from '../minigames/core/MiniQuestOverlay';
import type { NPC } from '../types/NPCTypes';
import type { Room } from '../types/Room';
import UseItemChooser from './appcore/UseItemChooser';
import {
  AppCoreOverlays,
  EnhancedNPCConsole,
  GameShell,
  GameStageRouter,
  InventoryPanel,
  NPCConsole,
  NPCSelectionModal,
  PickUpItemModal,
  SaveGameModal,
  TrapManagementModal,
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
  type OpenModalType,
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

function roomItemName(item: unknown): string {
  if (typeof item === 'string') return item;
  if (item && typeof item === 'object' && 'name' in item) {
    return String((item as { name?: unknown }).name ?? 'unknown');
  }
  if (item && typeof item === 'object' && 'id' in item) {
    return String((item as { id?: unknown }).id ?? 'unknown');
  }
  return 'unknown';
}

function modalOwnsOverlay(modal: OpenModalType): boolean {
  return modal === 'pickUp'
    || modal === 'saveGame'
    || modal === 'npcConsole'
    || modal === 'npcSelection'
    || modal === 'trapManagement';
}

function hasRoomExit(room: Room | undefined, exitName: string): boolean {
  return Boolean(room?.exits?.[exitName]);
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
  const roomItems = useMemo(() => room?.items?.map(roomItemName) ?? [], [room?.items]);
  const npcsInRoom = useResolvedNPCs(state.npcsInRoom as Array<NPC | string> | undefined, currentRoomId);
  const useTargets = useMemo(() => {
    const environmentTargets = Array.isArray(room?.environment) ? room.environment.map(roomItemName) : [];
    return Array.from(new Set([...roomItems, ...environmentTargets, ...npcsInRoom.map((npc) => npc.name || npc.id)]));
  }, [room?.environment, roomItems, npcsInRoom]);
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
    pushCurrentRoomToHistory: navigation.pushCurrentRoomToHistory,
    handleLookAround: lookAround.handleLookAround,
    openModal: modalState.openModal,
    checkForHints: ai.checkForHints,
    launchMiniQuest: miniquests.launchMiniQuest,
  });

  const handleDirectionalMove = (direction: string): void => {
    if (hasRoomExit(room, direction)) {
      navigation.pushCurrentRoomToHistory();
    }

    transitions.handleRoomChange(resolveMoveTarget(room, direction));
  };

  const handleQuickExit = (exitName: 'jump' | 'sit'): void => {
    if (hasRoomExit(room, exitName)) {
      navigation.pushCurrentRoomToHistory();
    }

    transitions.handleQuickExit(exitName);
  };

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

  const modalContent = useMemo((): React.ReactNode => {
    switch (modalState.modal) {
      case 'inventory':
        return <InventoryPanel />;
      case 'useItem':
        return (
          <UseItemChooser
            inventory={inventory}
            targets={useTargets}
            onUse={inventoryActions.handleUseItem}
            onClose={modalState.closeModal}
          />
        );
      case 'pickUp':
        return (
          <PickUpItemModal
            isOpen={true}
            items={roomItems}
            onClose={modalState.closeModal}
            onPickUp={inventoryActions.handlePickUpItems}
          />
        );
      case 'saveGame':
        return (
          <SaveGameModal
            isOpen={true}
            onClose={modalState.closeModal}
            onSave={saveLoad.handleSave}
            onLoad={saveLoad.handleLoad}
            onDelete={saveLoad.handleDeleteSave}
            saveSlots={saveLoad.saveSlots}
          />
        );
      case 'npcConsole':
        return npcConsole.isGroupConversation ? (
          <EnhancedNPCConsole
            isOpen={true}
            npcs={npcsInRoom}
            activeNpcId={npcConsole.selectedNPC?.id ?? ''}
            isGroupConversation={true}
            onClose={modalState.closeModal}
            onSendMessage={npcConsole.handleNPCMessage}
            playerName={playerName}
          />
        ) : (
          <NPCConsole
            isOpen={true}
            npc={npcConsole.selectedNPC}
            onClose={modalState.closeModal}
            onSendMessage={npcConsole.handleNPCMessage}
            playerName={playerName}
          />
        );
      case 'npcSelection':
        return (
          <NPCSelectionModal
            isOpen={true}
            npcs={npcsInRoom}
            onSelectNPC={npcConsole.handleSelectNPC}
            onClose={modalState.closeModal}
            onTalkToAll={npcConsole.handleGroupConversation}
            onTalkToAyla={npcConsole.handleTalkToAyla}
          />
        );
      case 'look':
        return (
          <div className="look-modal-content">
            {lookAround.lookLines.map((line, index) => (
              <div key={`${line}-${index}`} className="look-line">
                {line}
              </div>
            ))}
          </div>
        );
      case 'trapManagement':
        return (
          <TrapManagementModal
            isOpen={true}
            onClose={modalState.closeModal}
            currentRoomId={currentRoomId}
          />
        );
      default:
        return null;
    }
  }, [
    modalState.modal,
    modalState.closeModal,
    inventory,
    useTargets,
    inventoryActions.handleUseItem,
    roomItems,
    inventoryActions.handlePickUpItems,
    saveLoad.handleSave,
    saveLoad.handleLoad,
    saveLoad.handleDeleteSave,
    saveLoad.saveSlots,
    npcConsole.isGroupConversation,
    npcConsole.selectedNPC,
    npcConsole.handleNPCMessage,
    npcConsole.handleSelectNPC,
    npcConsole.handleGroupConversation,
    npcConsole.handleTalkToAyla,
    npcsInRoom,
    playerName,
    lookAround.lookLines,
    currentRoomId,
  ]);

  void roomEntryTime;
  void navigation.roomHistory;

  const overlays = (
    <AppCoreOverlays
      demoBanner={demo.demoBanner}
      isDemoActive={demo.isDemoActive}
      showGameplayOverlays={stage === 'game'}
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
      modalContent={modalContent}
      modalContentOwnsOverlay={modalOwnsOverlay(modalState.modal)}
      showPause={showPause}
      onResume={() => setShowPause(false)}
      onSave={() => modalState.openModal('saveGame')}
      onLoad={() => modalState.openModal('saveGame')}
      onOptions={() => dispatch({ type: 'RECORD_MESSAGE', payload: { id: `options-${Date.now()}`, text: 'Options are not wired in the modular AppCore yet.', type: 'system', timestamp: Date.now() } })}
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
  );

  if (stage !== 'game') {
    return (
      <>
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
          onLoadGame={() => modalState.openModal('saveGame')}
        />
        {overlays}
      </>
    );
  }

  return (
    <>
      {miniquests.mini.active && (
        <MiniQuestOverlay
          questId={miniquests.mini.active.id}
          roomId={miniquests.mini.active.roomId}
          seed={miniquests.mini.active.seed}
          onClose={miniquests.clearMiniQuest}
          onResult={miniquests.handleMiniQuestResult}
        />
      )}

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
        onPress={commandHandler.handlePressAction}
        onCoffee={() => commandHandler.handleCommand('coffee')}
        onFullscreen={systemControls.toggleFullscreen}
        onToggleSound={systemControls.toggleSound}
        onJump={() => handleQuickExit('jump')}
        onMove={handleDirectionalMove}
        onSit={() => handleQuickExit('sit')}
        onDebugMenu={() => dispatch({ type: 'TOGGLE_DEBUG' })}
        onBackout={navigation.handleBackout}
        onDisarmTrap={() => modalState.openModal('trapManagement')}
        hasActiveTraps={isActiveTrap(room)}
      />
      {overlays}
    </>
  );
};

export default AppCoreModularDraft;
