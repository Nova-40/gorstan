// @vitest-environment happy-dom
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useAppCoreCommandHandler } from '../../src/components/appcore/useAppCoreCommandHandler';
import { useAppCoreTransitions } from '../../src/components/appcore/useAppCoreTransitions';
import { gameStateReducer, initialGameState } from '../../src/state/gameState';

vi.mock('../../src/engine/npcEngine', () => ({
  npcReact: vi.fn(),
}));

vi.mock('../../src/services/aiUsageMonitor', () => ({
  aiUsageMonitor: {
    trackCommand: vi.fn(),
  },
}));

vi.mock('../../src/demo/demoController', () => ({
  demoController: {
    skipToNext: vi.fn(),
  },
}));

vi.mock('../../src/demo/DemoModeService', () => ({
  demoService: {
    start: vi.fn(),
    stop: vi.fn(),
  },
}));

describe('AppCore quick-action contract', () => {
  const room = {
    id: 'controlnexus',
    title: 'Control Nexus',
    description: ['A quiet test room.'],
    zone: 'introZone',
    exits: {
      jump: 'jumproom',
      sit: 'sitroom',
    },
    items: [],
    npcs: [],
  } as any;

  it.each(['press', 'jump', 'sit'])(
    'modular command handler currently forwards %s as a generic parser string',
    (command) => {
      const dispatch = vi.fn();
      const setCommandHistory = vi.fn();
      const setLastMovementAction = vi.fn();
      const setPreviousRoom = vi.fn();
      const handleLookAround = vi.fn();
      const openModal = vi.fn();
      const checkForHints = vi.fn().mockResolvedValue(undefined);
      const launchMiniQuest = vi.fn();
      const setIsDemoActive = vi.fn();
      const pushCurrentRoomToHistory = vi.fn();

      const { result } = renderHook(() =>
        useAppCoreCommandHandler({
          state: initialGameState,
          dispatch,
          room,
          currentRoomId: room.id,
          inventory: [],
          npcsInRoom: [],
          isDemo: false,
          isDemoActive: false,
          setIsDemoActive,
          setCommandHistory,
          setLastMovementAction,
          setPreviousRoom,
          pushCurrentRoomToHistory,
          handleLookAround,
          openModal,
          checkForHints,
          launchMiniQuest,
        }),
      );

      result.current.handleCommand(command);

      expect(dispatch).toHaveBeenCalledWith({ type: 'COMMAND_INPUT', payload: command });
      expect(openModal).not.toHaveBeenCalled();
      expect(handleLookAround).not.toHaveBeenCalled();
    },
  );

  it('movement commands must push the current room to history before command dispatch', () => {
    const dispatch = vi.fn();
    const setCommandHistory = vi.fn();
    const setLastMovementAction = vi.fn();
    const setPreviousRoom = vi.fn();
    const handleLookAround = vi.fn();
    const openModal = vi.fn();
    const checkForHints = vi.fn().mockResolvedValue(undefined);
    const launchMiniQuest = vi.fn();
    const setIsDemoActive = vi.fn();
    const pushCurrentRoomToHistory = vi.fn();

    const { result } = renderHook(() =>
      useAppCoreCommandHandler({
        state: initialGameState,
        dispatch,
        room,
        currentRoomId: room.id,
        inventory: [],
        npcsInRoom: [],
        isDemo: false,
        isDemoActive: false,
        setIsDemoActive,
        setCommandHistory,
        setLastMovementAction,
        setPreviousRoom,
        handleLookAround,
        openModal,
        checkForHints,
        launchMiniQuest,
        pushCurrentRoomToHistory,
      }),
    );

    result.current.handleCommand('north');

    expect(pushCurrentRoomToHistory).toHaveBeenCalledTimes(1);
    expect(setLastMovementAction).toHaveBeenCalledWith('north');
    expect(setPreviousRoom).toHaveBeenCalledWith(room);
    expect(dispatch).toHaveBeenCalledWith({ type: 'COMMAND_INPUT', payload: 'north' });
  });

  it('non-movement actions must not push room history', () => {
    const dispatch = vi.fn();
    const setCommandHistory = vi.fn();
    const setLastMovementAction = vi.fn();
    const setPreviousRoom = vi.fn();
    const handleLookAround = vi.fn();
    const openModal = vi.fn();
    const checkForHints = vi.fn().mockResolvedValue(undefined);
    const launchMiniQuest = vi.fn();
    const setIsDemoActive = vi.fn();
    const pushCurrentRoomToHistory = vi.fn();

    const { result } = renderHook(() =>
      useAppCoreCommandHandler({
        state: initialGameState,
        dispatch,
        room,
        currentRoomId: room.id,
        inventory: [],
        npcsInRoom: [],
        isDemo: false,
        isDemoActive: false,
        setIsDemoActive,
        setCommandHistory,
        setLastMovementAction,
        setPreviousRoom,
        handleLookAround,
        openModal,
        checkForHints,
        launchMiniQuest,
        pushCurrentRoomToHistory,
      }),
    );

    result.current.handleCommand('inventory');

    expect(pushCurrentRoomToHistory).not.toHaveBeenCalled();
    expect(openModal).toHaveBeenCalledWith('inventory');
  });

  it('explicit modular press action preserves legacy introreset blue-button routing', () => {
    const dispatch = vi.fn();

    const { result } = renderHook(() =>
      useAppCoreCommandHandler({
        state: initialGameState,
        dispatch,
        room,
        currentRoomId: 'introreset',
        inventory: [],
        npcsInRoom: [],
        isDemo: false,
        isDemoActive: false,
        setIsDemoActive: vi.fn(),
        setCommandHistory: vi.fn(),
        setLastMovementAction: vi.fn(),
        setPreviousRoom: vi.fn(),
        pushCurrentRoomToHistory: vi.fn(),
        handleLookAround: vi.fn(),
        openModal: vi.fn(),
        checkForHints: vi.fn().mockResolvedValue(undefined),
        launchMiniQuest: vi.fn(),
      }),
    );

    result.current.handlePressAction();

    expect(dispatch).toHaveBeenCalledWith({ type: 'PRESS_BLUE_BUTTON' });
    expect(dispatch).not.toHaveBeenCalledWith({ type: 'COMMAND_INPUT', payload: 'press' });
  });

  it('explicit modular press action preserves legacy generic press routing outside introreset', () => {
    const dispatch = vi.fn();

    const { result } = renderHook(() =>
      useAppCoreCommandHandler({
        state: initialGameState,
        dispatch,
        room,
        currentRoomId: room.id,
        inventory: [],
        npcsInRoom: [],
        isDemo: false,
        isDemoActive: false,
        setIsDemoActive: vi.fn(),
        setCommandHistory: vi.fn(),
        setLastMovementAction: vi.fn(),
        setPreviousRoom: vi.fn(),
        pushCurrentRoomToHistory: vi.fn(),
        handleLookAround: vi.fn(),
        openModal: vi.fn(),
        checkForHints: vi.fn().mockResolvedValue(undefined),
        launchMiniQuest: vi.fn(),
      }),
    );

    result.current.handlePressAction();

    expect(dispatch).toHaveBeenCalledWith({ type: 'PRESS_ACTION' });
    expect(dispatch).not.toHaveBeenCalledWith({ type: 'COMMAND_INPUT', payload: 'press' });
  });

  it('legacy reducer preserves explicit press action semantics', () => {
    const nextState = gameStateReducer(initialGameState as any, { type: 'PRESS_ACTION' } as any);

    expect(nextState.history.at(-1)).toMatchObject({
      text: 'You press something, but nothing happens.',
      type: 'system',
    });
  });

  it('legacy reducer preserves blue-button semantics on first press', () => {
    const nextState = gameStateReducer(initialGameState as any, { type: 'PRESS_BLUE_BUTTON' } as any);

    expect(nextState.player.flags.showBlueButtonWarning).toBe(true);
    expect(nextState.flags.multiverse_reboot_pending).toBeUndefined();
    expect(nextState.history.at(-1)).toMatchObject({
      type: 'system',
    });
  });

  it('explicit transition handling still moves to a resolved jump target room id', () => {
    const dispatch = vi.fn();

    const { result } = renderHook(() =>
      useAppCoreTransitions({
        state: initialGameState,
        dispatch,
        room,
        roomMap: {
          controlnexus: room,
          jumproom: {
            id: 'jumproom',
            title: 'Jump Room',
            description: ['Reached via jump.'],
            zone: 'introZone',
            exits: {},
            items: [],
            npcs: [],
          },
        },
        currentRoomId: 'controlnexus',
        stage: 'game',
      }),
    );

    result.current.handleRoomChange('jumproom');

    expect(dispatch).toHaveBeenCalledWith({ type: 'MOVE_TO_ROOM', payload: 'jumproom' });
  });

  it('explicit modular jump action resolves room.exits.jump without using parser strings', () => {
    const dispatch = vi.fn();

    const { result } = renderHook(() =>
      useAppCoreTransitions({
        state: initialGameState,
        dispatch,
        room,
        roomMap: {
          controlnexus: room,
          jumproom: {
            id: 'jumproom',
            title: 'Jump Room',
            description: ['Reached via jump.'],
            zone: 'introZone',
            exits: {},
            items: [],
            npcs: [],
          },
          sitroom: {
            id: 'sitroom',
            title: 'Sit Room',
            description: ['Reached via sit.'],
            zone: 'introZone',
            exits: {},
            items: [],
            npcs: [],
          },
        },
        currentRoomId: 'controlnexus',
        stage: 'game',
      }),
    );

    result.current.handleQuickExit('jump');

    expect(dispatch).toHaveBeenCalledWith({ type: 'MOVE_TO_ROOM', payload: 'jumproom' });
    expect(dispatch).not.toHaveBeenCalledWith({ type: 'COMMAND_INPUT', payload: 'jump' });
  });

  it('explicit modular sit action resolves room.exits.sit without using parser strings', () => {
    const dispatch = vi.fn();

    const { result } = renderHook(() =>
      useAppCoreTransitions({
        state: initialGameState,
        dispatch,
        room,
        roomMap: {
          controlnexus: room,
          jumproom: {
            id: 'jumproom',
            title: 'Jump Room',
            description: ['Reached via jump.'],
            zone: 'introZone',
            exits: {},
            items: [],
            npcs: [],
          },
          sitroom: {
            id: 'sitroom',
            title: 'Sit Room',
            description: ['Reached via sit.'],
            zone: 'introZone',
            exits: {},
            items: [],
            npcs: [],
          },
        },
        currentRoomId: 'controlnexus',
        stage: 'game',
      }),
    );

    result.current.handleQuickExit('sit');

    expect(dispatch).toHaveBeenCalledWith({ type: 'MOVE_TO_ROOM', payload: 'sitroom' });
    expect(dispatch).not.toHaveBeenCalledWith({ type: 'COMMAND_INPUT', payload: 'sit' });
  });
});