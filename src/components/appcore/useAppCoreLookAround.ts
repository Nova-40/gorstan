/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  Look-around modal controller for AppCore modularisation.
*/

import { useCallback, useEffect, useRef, useState } from 'react';

import type { Room } from '../../types/Room';
import type { NPC } from '../../types/NPCTypes';
import type { OpenModalType } from './AppCoreTypes';

interface UseAppCoreLookAroundArgs {
  readonly room: Room | undefined;
  readonly npcsInRoom: NPC[];
  readonly openModal: (name: OpenModalType) => void;
  readonly closeModal: () => void;
}

interface UseAppCoreLookAroundResult {
  readonly lookLines: string[];
  readonly setLookLines: React.Dispatch<React.SetStateAction<string[]>>;
  readonly handleLookAround: () => void;
}

function itemLabel(item: unknown): string {
  if (typeof item === 'string') return item;
  if (item && typeof item === 'object' && 'name' in item) {
    return String((item as { name?: unknown }).name ?? 'Unknown item');
  }
  if (item && typeof item === 'object' && 'id' in item) {
    return String((item as { id?: unknown }).id ?? 'Unknown item');
  }
  return 'Unknown item';
}

export function useAppCoreLookAround({
  room,
  npcsInRoom,
  openModal,
  closeModal,
}: UseAppCoreLookAroundArgs): UseAppCoreLookAroundResult {
  const [lookLines, setLookLines] = useState<string[]>([]);
  const lookModalTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (lookModalTimeoutRef.current) {
        clearTimeout(lookModalTimeoutRef.current);
        lookModalTimeoutRef.current = null;
      }
    };
  }, []);

  const handleLookAround = useCallback((): void => {
    if (lookModalTimeoutRef.current) {
      clearTimeout(lookModalTimeoutRef.current);
      lookModalTimeoutRef.current = null;
    }

    if (!room) {
      setLookLines(['❌ Unable to look around - room not found.']);
      openModal('look');
      lookModalTimeoutRef.current = setTimeout(closeModal, 3000);
      return;
    }

    const roomTitle = String((room as any).title || (room as any).name || 'Unknown room');
    const roomDescription = Array.isArray(room.description)
      ? room.description[0] || 'No description available.'
      : room.description?.split('\n')[0] || 'No description available.';

    const itemsList = room.items && room.items.length > 0 ? room.items.map(itemLabel).join(', ') : 'None';
    const npcsList = npcsInRoom.length > 0 ? npcsInRoom.map((npc) => npc.name).join(', ') : 'None';
    const exitsList = room.exits && Object.keys(room.exits).length > 0 ? Object.keys(room.exits).join(', ') : 'None';

    setLookLines([
      `📍 ${roomTitle}`,
      roomDescription,
      `🧺 Items here: ${itemsList}`,
      `🧑‍🤝‍🧑 NPCs here: ${npcsList}`,
      `🚪 Exits: ${exitsList}`,
    ]);

    openModal('look');
    lookModalTimeoutRef.current = setTimeout(closeModal, 6000);
  }, [room, npcsInRoom, openModal, closeModal]);

  return {
    lookLines,
    setLookLines,
    handleLookAround,
  };
}
