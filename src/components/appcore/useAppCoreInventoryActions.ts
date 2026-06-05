/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  Inventory action controller for AppCore modularisation.
*/

import { useCallback } from 'react';

interface UseAppCoreInventoryActionsArgs {
  readonly state: any;
  readonly dispatch: (action: any) => void;
  readonly currentRoomId: string;
  readonly closeModal: () => void;
}

interface UseAppCoreInventoryActionsResult {
  readonly handlePickUpItems: (selectedItems: string[]) => void;
}

export function useAppCoreInventoryActions({
  state,
  dispatch,
  currentRoomId,
  closeModal,
}: UseAppCoreInventoryActionsArgs): UseAppCoreInventoryActionsResult {
  const handlePickUpItems = useCallback(
    (selectedItems: string[]): void => {
      selectedItems.forEach((item) => {
        if (item === 'Run Bag') {
          dispatch({ type: 'SET_RUNBAG_FLAG', payload: true });
          dispatch({ type: 'INCREASE_INVENTORY_CAPACITY' });

          import('../../state/scoreEffects')
            .then(({ applyScoreForEvent }) => applyScoreForEvent('find.hidden.item'))
            .catch((error) => console.warn('Failed to apply score for item pickup:', error));
          return;
        }

        if (item === 'dominic' && currentRoomId === 'dalesapartment') {
          import('../../engine/dominicPickupConversation').then((module) => {
            const preventPickup = module.handleDominicPickupAttempt(state, dispatch);

            if (!preventPickup) {
              dispatch({ type: 'ADD_TO_INVENTORY', payload: 'deadfish' });
              dispatch({ type: 'SET_FLAG', payload: { flag: 'dominicIsDead', value: true } });
              dispatch({
                type: 'REMOVE_ITEM_FROM_ROOM',
                payload: { roomId: 'dalesapartment', item: 'dominic' },
              });
              dispatch({
                type: 'SET_FLAG',
                payload: { flag: 'pollyVengeanceActive', value: true },
              });
            }
          });
          return;
        }

        dispatch({ type: 'ADD_TO_INVENTORY', payload: item });
      });

      closeModal();
    },
    [state, dispatch, currentRoomId, closeModal],
  );

  return { handlePickUpItems };
}
