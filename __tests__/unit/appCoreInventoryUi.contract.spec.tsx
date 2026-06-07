// @vitest-environment happy-dom
import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import AppCoreModular from '../../src/components/AppCore.modular';

let mockState: any;

vi.mock('../../src/state/gameState', () => ({
  useGameState: () => ({
    state: mockState,
    dispatch: vi.fn(),
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
    AppCoreOverlays: ({ modalOpen, modalContent }: any) => (modalOpen ? <div>{modalContent}</div> : null),
    EnhancedNPCConsole: () => null,
    GameShell: ({ onShowInventory, onUse }: any) => (
      <div>
        <button onClick={onShowInventory}>show-inventory</button>
        <button onClick={onUse}>show-use-item</button>
      </div>
    ),
    GameStageRouter: () => null,
    InventoryPanel: () => <div data-testid="inventory-panel">inventory-panel</div>,
    NPCConsole: () => null,
    NPCSelectionModal: () => null,
    PickUpItemModal: () => null,
    SaveGameModal: () => null,
    TrapManagementModal: () => null,
    UseItemChooser: () => <div data-testid="use-item-chooser">use-item-chooser</div>,
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
    useAppCoreKeyboard: () => undefined,
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

describe('AppCore modular inventory UI contract', () => {
  beforeEach(() => {
    cleanup();
    mockState = {
      currentRoomId: 'controlnexus',
      flags: {},
      history: [],
      inventory: ['batteries'],
      npcsInRoom: [],
      player: {
        inventory: ['batteries'],
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

  it('modular inventory quick action still opens inventory UI', () => {
    render(<AppCoreModular />);

    fireEvent.click(screen.getByRole('button', { name: 'show-inventory' }));

    expect(screen.getByTestId('inventory-panel')).toBeTruthy();
  });

  it('modular use-item quick action still opens use-item UI', () => {
    render(<AppCoreModular />);

    fireEvent.click(screen.getByRole('button', { name: 'show-use-item' }));

    expect(screen.getByRole('heading', { name: 'Use Item' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Use selected item' })).toBeTruthy();
  });
});