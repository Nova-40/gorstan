// @vitest-environment happy-dom
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useAppCoreInventoryActions } from '../../src/components/appcore/useAppCoreInventoryActions';
import { gameStateReducer, initialGameState } from '../../src/state/gameState';

const handleDominicPickupAttempt = vi.fn();

vi.mock('../../src/engine/dominicPickupConversation', () => ({
  handleDominicPickupAttempt,
}));

vi.mock('../../src/state/scoreEffects', () => ({
  applyScoreForEvent: vi.fn(),
}));

describe('AppCore modular use-item contract', () => {
  it('dispatches structured USE_ITEM for standalone modular item use', () => {
    const dispatch = vi.fn();
    const closeModal = vi.fn();

    const { result } = renderHook(() =>
      useAppCoreInventoryActions({
        state: initialGameState,
        dispatch,
        currentRoomId: 'controlnexus',
        closeModal,
      }),
    );

    result.current.handleUseItem('batteries');

    expect(dispatch).toHaveBeenCalledWith({ type: 'USE_ITEM', payload: { item: 'batteries' } });
    expect(dispatch).not.toHaveBeenCalledWith({ type: 'COMMAND_INPUT', payload: 'use batteries' });
    expect(closeModal).toHaveBeenCalledTimes(1);
  });

  it('preserves legacy reducer-backed batteries behavior for modular standalone use', () => {
    const nextState = gameStateReducer(initialGameState as any, {
      type: 'USE_ITEM',
      payload: { item: 'batteries' },
    } as any);

    expect(nextState.flags.batteriesInserted).toBe(true);
    expect(nextState.messages.at(-1)).toMatchObject({
      text: 'You insert the batteries.',
      type: 'system',
    });
  });

  it('dispatches structured USE_ITEM_WITH for modular item targeting', () => {
    const dispatch = vi.fn();
    const closeModal = vi.fn();

    const { result } = renderHook(() =>
      useAppCoreInventoryActions({
        state: initialGameState,
        dispatch,
        currentRoomId: 'controlnexus',
        closeModal,
      }),
    );

    result.current.handleUseItem('batteries', 'torch');

    expect(dispatch).toHaveBeenCalledWith({
      type: 'USE_ITEM_WITH',
      payload: { item: 'batteries', target: 'torch' },
    });
    expect(dispatch).not.toHaveBeenCalledWith({
      type: 'COMMAND_INPUT',
      payload: 'use batteries with torch',
    });
    expect(closeModal).toHaveBeenCalledTimes(1);
  });

  it('preserves legacy reducer-backed batteries-with-torch behavior for modular item use', () => {
    const withBatteriesInserted = {
      ...initialGameState,
      flags: { ...initialGameState.flags, batteriesInserted: true },
    } as any;

    const nextState = gameStateReducer(withBatteriesInserted, {
      type: 'USE_ITEM_WITH',
      payload: { item: 'batteries', target: 'torch' },
    } as any);

    expect(nextState.flags.torchReady).toBe(true);
    expect(nextState.messages.at(-1)).toMatchObject({
      text: 'You insert the batteries into the torch. It flickers to life.',
      type: 'system',
    });
  });

  it('preserves Run Bag pickup special handling', () => {
    const dispatch = vi.fn();
    const closeModal = vi.fn();

    const { result } = renderHook(() =>
      useAppCoreInventoryActions({
        state: initialGameState,
        dispatch,
        currentRoomId: 'controlnexus',
        closeModal,
      }),
    );

    result.current.handlePickUpItems(['Run Bag']);

    expect(dispatch).toHaveBeenCalledWith({ type: 'SET_RUNBAG_FLAG', payload: true });
    expect(dispatch).toHaveBeenCalledWith({ type: 'INCREASE_INVENTORY_CAPACITY' });
    expect(closeModal).toHaveBeenCalledTimes(1);
  });

  it('preserves Dominic pickup special handling', async () => {
    handleDominicPickupAttempt.mockReset();
    handleDominicPickupAttempt.mockReturnValue(false);

    const dispatch = vi.fn();
    const closeModal = vi.fn();

    const { result } = renderHook(() =>
      useAppCoreInventoryActions({
        state: initialGameState,
        dispatch,
        currentRoomId: 'dalesapartment',
        closeModal,
      }),
    );

    result.current.handlePickUpItems(['dominic']);
    await waitFor(() => {
      expect(handleDominicPickupAttempt).toHaveBeenCalledWith(initialGameState, dispatch);
    });

    expect(dispatch).toHaveBeenCalledWith({ type: 'ADD_TO_INVENTORY', payload: 'deadfish' });
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_FLAG',
      payload: { flag: 'dominicIsDead', value: true },
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: 'REMOVE_ITEM_FROM_ROOM',
      payload: { roomId: 'dalesapartment', item: 'dominic' },
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_FLAG',
      payload: { flag: 'pollyVengeanceActive', value: true },
    });
    expect(closeModal).toHaveBeenCalledTimes(1);
  });
});