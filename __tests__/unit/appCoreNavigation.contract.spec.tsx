// @vitest-environment happy-dom
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useAppCoreNavigationHistory } from '../../src/components/appcore/useAppCoreNavigationHistory';

describe('AppCore navigation history contract', () => {
  it('empty history preserves the legacy backout message', () => {
    const dispatch = vi.fn();

    const { result } = renderHook(() =>
      useAppCoreNavigationHistory({
        dispatch,
        currentRoomId: 'controlnexus',
      }),
    );

    act(() => {
      result.current.handleBackout();
    });

    expect(dispatch).toHaveBeenCalledWith({
      type: 'ADD_MESSAGE',
      payload: expect.objectContaining({
        text: "You can't go back.",
        type: 'system',
      }),
    });
  });

  it('backout returns to the previous room and emits the legacy first-step message', () => {
    const dispatch = vi.fn();

    const { result } = renderHook(() =>
      useAppCoreNavigationHistory({
        dispatch,
        currentRoomId: 'controlnexus',
      }),
    );

    act(() => {
      result.current.setRoomHistory(['villagegreen']);
    });

    act(() => {
      result.current.handleBackout();
    });

    expect(dispatch).toHaveBeenNthCalledWith(1, { type: 'MOVE_TO_ROOM', payload: 'villagegreen' });
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: 'ADD_MESSAGE',
        payload: expect.objectContaining({
          text: 'You return to the previous room.',
          type: 'system',
        }),
      }),
    );
  });

  it('backout preserves the escalating sarcasm for repeated use', () => {
    const dispatch = vi.fn();

    const { result } = renderHook(() =>
      useAppCoreNavigationHistory({
        dispatch,
        currentRoomId: 'controlnexus',
      }),
    );

    act(() => {
      result.current.setRoomHistory(['controlnexus', 'villagegreen']);
    });

    act(() => {
      result.current.handleBackout();
    });

    expect(dispatch).toHaveBeenNthCalledWith(1, { type: 'MOVE_TO_ROOM', payload: 'villagegreen' });
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: 'ADD_MESSAGE',
        payload: expect.objectContaining({
          text: 'Back we go... again.',
          type: 'system',
        }),
      }),
    );
  });
});