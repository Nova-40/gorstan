/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  Modal state controller for AppCore modularisation.
*/

import { useCallback, useState } from 'react';

import type { OpenModalType } from './AppCoreTypes';

interface UseAppCoreModalStateArgs {
  readonly isDemoActive: boolean;
  readonly onCloseGroupConversation?: () => void;
}

interface UseAppCoreModalStateResult {
  readonly modal: OpenModalType;
  readonly openModal: (name: OpenModalType) => void;
  readonly closeModal: () => void;
  readonly setModal: React.Dispatch<React.SetStateAction<OpenModalType>>;
}

export function useAppCoreModalState({
  isDemoActive,
  onCloseGroupConversation,
}: UseAppCoreModalStateArgs): UseAppCoreModalStateResult {
  const [modal, setModal] = useState<OpenModalType>(null);

  const openModal = useCallback(
    (name: OpenModalType): void => {
      if (isDemoActive) {
        console.log('Modal opening blocked during demo mode:', name);
        return;
      }

      setModal(name);
    },
    [isDemoActive],
  );

  const closeModal = useCallback((): void => {
    setModal(null);
    onCloseGroupConversation?.();
  }, [onCloseGroupConversation]);

  return {
    modal,
    openModal,
    closeModal,
    setModal,
  };
}
