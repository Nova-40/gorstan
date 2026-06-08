/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  Optional item sprite layer for illustrated/clickable rooms.

  If a room has no itemPlacements, or an item has no sprite metadata, this layer
  renders nothing and does not error. Gameplay state remains parser/engine-owned.
*/

import React from 'react';

import { getItemPresentation, getPresentedItem } from '../../engine/itemPresentation';
import type { RoomItemPlacement } from '../../ui/visualRooms/types';
import { isItemInCurrentRoom, isVisibleByGate, positionToCssValue } from './visualLayerUtils';

interface ItemSpriteLayerProps {
  readonly placements?: readonly RoomItemPlacement[];
  readonly state: any;
  readonly roomId: string;
  readonly debug?: boolean;
}

function anchorTransform(anchor: RoomItemPlacement['anchor']): string {
  switch (anchor) {
    case 'topLeft':
      return 'translate(0, 0)';
    case 'bottomCenter':
      return 'translate(-50%, -100%)';
    case 'center':
    default:
      return 'translate(-50%, -50%)';
  }
}

function getRoomItemName(state: any, roomId: string, itemId: string): string | undefined {
  const roomItems = state?.roomMap?.[roomId]?.items;
  if (!Array.isArray(roomItems)) return undefined;

  const match = roomItems.find((item: any) => {
    if (typeof item === 'string') return item === itemId;
    return item?.id === itemId || item?.itemId === itemId;
  });

  return typeof match === 'object' && match !== null && typeof match.name === 'string'
    ? match.name
    : undefined;
}

function getRoomItemIds(state: any, roomId: string): string[] {
  const roomItems = state?.roomMap?.[roomId]?.items;
  if (!Array.isArray(roomItems)) return [];

  return roomItems
    .map((item: any) => {
      if (typeof item === 'string') return item;
      return item?.id ?? item?.itemId ?? '';
    })
    .filter(Boolean);
}

function autoPlacementFor(itemId: string, index: number, count: number): RoomItemPlacement {
  const columns = Math.min(Math.max(count, 1), 5);
  const column = index % columns;
  const row = Math.floor(index / columns);
  const gap = columns > 1 ? 64 / (columns - 1) : 0;
  const x = columns === 1 ? 50 : 18 + column * gap;
  const y = 82 - (row % 2) * 8;
  const presentation = getItemPresentation(itemId);

  return {
    itemId,
    x,
    y,
    coordinateUnit: 'percent',
    width: presentation?.defaultSpriteSize?.width ?? 46,
    height: presentation?.defaultSpriteSize?.height ?? 46,
    anchor: 'bottomCenter',
    zIndex: 11 + row,
    className: 'room-item-sprite--auto',
    debugLabel: itemId,
  };
}

function mergePlacementsWithRoomItems(
  placements: readonly RoomItemPlacement[],
  state: any,
  roomId: string,
): RoomItemPlacement[] {
  const explicitItemIds = new Set(placements.map((placement) => placement.itemId));
  const missingItemIds = getRoomItemIds(state, roomId).filter((itemId) => !explicitItemIds.has(itemId));
  const autoPlacements = missingItemIds.map((itemId, index) =>
    autoPlacementFor(itemId, index, missingItemIds.length),
  );

  return [...placements, ...autoPlacements];
}

const ItemSpriteLayer: React.FC<ItemSpriteLayerProps> = ({
  placements = [],
  state,
  roomId,
  debug = false,
}) => {
  const allPlacements = mergePlacementsWithRoomItems(placements, state, roomId);

  const visiblePlacements = allPlacements.filter((placement) => {
    if (!isVisibleByGate(placement, state)) return false;
    return isItemInCurrentRoom(state, placement.itemId, roomId);
  });

  if (!visiblePlacements.length) {
    return null;
  }

  return (
    <div className="room-sprite-layer" aria-hidden="true">
      {visiblePlacements.map((placement) => {
        const presentedItem = getPresentedItem(placement.itemId);
        const presentation = presentedItem?.presentation ?? getItemPresentation(placement.itemId);
        const sprite = presentation?.sprite;
        const itemName = presentedItem?.name ?? getRoomItemName(state, roomId, placement.itemId);

        if (!sprite) {
          return debug ? (
            <div
              key={placement.itemId}
              className="room-item-sprite room-item-sprite--missing"
              style={{
                left: positionToCssValue(placement.x, placement.coordinateUnit),
                top: positionToCssValue(placement.y, placement.coordinateUnit),
                width: placement.width ?? presentation?.defaultSpriteSize?.width ?? 48,
                height: placement.height ?? presentation?.defaultSpriteSize?.height ?? 48,
                transform: anchorTransform(placement.anchor),
                zIndex: placement.zIndex ?? 10,
              }}
              title={`Missing sprite: ${placement.itemId}`}
            >
              {placement.debugLabel ?? placement.itemId}
            </div>
          ) : null;
        }

        return (
          <img
            key={placement.itemId}
            src={sprite}
            alt={placement.alt ?? itemName ?? placement.itemId}
            className={`room-item-sprite ${placement.className ?? ''}`.trim()}
            draggable={false}
            style={{
              left: positionToCssValue(placement.x, placement.coordinateUnit),
              top: positionToCssValue(placement.y, placement.coordinateUnit),
              width: placement.width ?? presentation?.defaultSpriteSize?.width,
              height: placement.height ?? presentation?.defaultSpriteSize?.height,
              transform: anchorTransform(placement.anchor),
              zIndex: placement.zIndex ?? 10,
            }}
          />
        );
      })}
    </div>
  );
};

export default ItemSpriteLayer;
