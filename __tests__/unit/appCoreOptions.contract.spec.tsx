// @vitest-environment happy-dom
import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import AppCoreModular from '../../src/components/AppCore.modular';

const dispatch = vi.fn();

let mockState: any;

vi.mock('../../src/state/gameState', () => ({
  useGameState: () => ({
    state: mockState,
    dispatch,
  }),
}));

vi.mock('../../src/hooks/useFlags', () => ({
  useFlags: () => ({ hasFlag: vi.fn(() => false) }),
}));

vi.mock('../../src/components/appcore', async () => {
  const ReactModule = await import('react');

  const useAppCoreModalState = () => {
    const [modal, setModal] = ReactModule.useState<any>(null);
    return {
      modal,
      setModal,
      openModal: (name: any) => setModal(name),
      closeModal: () => setModal(null),
    };
  };

  return {
    AppCoreOverlays: ({ modalOpen, modalContent, showPause, onOptions }: any) => (
      <div>
        {showPause ? <button onClick={onOptions}>pause-options</button> : null}
        {modalOpen ? modalContent : null}
      </div>
    ),
    EnhancedNPCConsole: () => null,
    GameShell: () => null,
    GameStageRouter: () => null,
    InventoryPanel: () => null,
    NPCConsole: () => null,
    NPCSelectionModal: () => null,
    PickUpItemModal: () => null,
    SaveGameModal: () => null,
    TrapManagementModal: () => null,
    UseItemChooser: () => null,
    useAppCoreAI: () => ({
      checkForHints: vi.fn().mockResolvedValue(undefined),
      currentHint: null,
      currentGuidance: null,
      gameplayUpdates: [],
      npcBehaviors: {},
      showAIMonitor: false,
      setCurrentHint: vi.fn(),
      setCurrentGuidance: vi.fn(),
      setShowAIMonitor: vi.fn(),
    }),
    useAppCoreCommandHandler: () => ({
      handleCommand: vi.fn(),
      handlePressAction: vi.fn(),
    }),
    useAppCoreDemo: () => ({
      demoBanner: undefined,
      isDemoActive: false,
      setIsDemoActive: vi.fn(),
      startDemoRoute: vi.fn(),
    }),
    useAppCoreInventoryActions: () => ({
      handlePickUpItems: vi.fn(),
      handleUseItem: vi.fn(),
    }),
    useAppCoreKeyboard: ({ setShowPause }: any) => {
      ReactModule.useEffect(() => {
        setShowPause(true);
      }, [setShowPause]);
    },
    useAppCoreLookAround: () => ({
      handleLookAround: vi.fn(),
      lookLines: [],
    }),
    useAppCoreMiniQuests: () => ({
      clearMiniQuest: vi.fn(),
      handleMiniQuestResult: vi.fn(),
      launchMiniQuest: vi.fn(),
      mini: { active: null },
    }),
    useAppCoreModalState,
    useAppCoreNavigationHistory: () => ({
      canBackout: false,
      handleBackout: vi.fn(),
      pushCurrentRoomToHistory: vi.fn(),
      roomHistory: [],
      setRoomHistory: vi.fn(),
    }),
    useAppCoreNPCConsole: () => ({
      handleGroupConversation: vi.fn(),
      handleNPCMessage: vi.fn(),
      handleOpenNPCConsole: vi.fn(),
      handleSelectNPC: vi.fn(),
      handleTalkToAyla: vi.fn(),
      isGroupConversation: false,
      selectedNPC: null,
      setIsGroupConversation: vi.fn(),
      setSelectedNPC: vi.fn(),
    }),
    useAppCoreRoomLifecycle: () => undefined,
    useAppCoreSaveLoad: () => ({
      handleDeleteSave: vi.fn(),
      handleLoad: vi.fn(),
      handleSave: vi.fn(),
      loadSaveSlots: vi.fn(),
      saveSlots: [],
    }),
    useAppCoreSystemControls: () => ({
      isFullscreen: false,
      soundOn: true,
      toggleFullscreen: vi.fn(),
      toggleSound: vi.fn(),
    }),
    useAppCoreTransitions: () => ({
      handleQuickExit: vi.fn(),
      handleRoomChange: vi.fn(),
      handleRoomTransitionComplete: vi.fn(),
      handleTeleportComplete: vi.fn(),
      previousRoom: null,
      roomTransitionActive: false,
      setLastMovementAction: vi.fn(),
      setPreviousRoom: vi.fn(),
      setReadyForTransition: vi.fn(),
      setTeleportCallback: vi.fn(),
      setTeleportType: vi.fn(),
      setTransitionInventory: vi.fn(),
      setTransitionTargetRoom: vi.fn(),
      teleportType: null,
      transitionInfo: {
        fromZone: null,
        shouldAnimate: false,
        toZone: null,
        transitionType: 'normal',
      },
      transitionType: null,
    }),
    useResolvedNPCs: () => [],
    useRoomDirections: () => ({
      availableDirections: {},
      directionRoomTitles: {},
    }),
    useRoomWorldInitialisation: () => undefined,
  };
});

describe('AppCore modular options contract', () => {
  beforeEach(() => {
    cleanup();
    dispatch.mockReset();
    mockState = {
      currentRoomId: 'controlnexus',
      flags: {},
      history: [],
      inventory: [],
      npcsInRoom: [],
      player: {
        inventory: [],
        name: 'Player',
      },
      roomMap: {
        controlnexus: {
          description: ['A quiet room.'],
          exits: {},
          id: 'controlnexus',
          items: [],
          npcs: [],
          title: 'Control Nexus',
        },
      },
      settings: {},
      stage: 'game',
    };
  });

  it('pause-menu Options opens a deterministic modular unavailable modal without dispatching OPEN_OPTIONS', () => {
    render(<AppCoreModular />);

    fireEvent.click(screen.getByRole('button', { name: 'pause-options' }));

    expect(screen.getByRole('heading', { name: 'Options Unavailable' })).toBeTruthy();
    expect(screen.getByText('Options are not available in the modular AppCore yet.')).toBeTruthy();
    expect(dispatch).not.toHaveBeenCalledWith({ type: 'OPEN_OPTIONS' });
  });
});