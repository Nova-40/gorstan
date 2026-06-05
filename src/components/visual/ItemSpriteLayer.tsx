/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  Optional item sprite layer for illustrated/clickable rooms.

  If a room has no itemPlacements, or an item has no sprite metadata, this layer
  renders nothing and does not error. Gameplay state remains parser/engine-owned.
*/

import React from 'react';

import { getPresentedItem } from '../../engine/itemPresentation';
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

const ItemSpriteLayer: React.FC<ItemSpriteLayerProps> = ({
  placements = [],
  state,
  roomId,
  debug = false,
}) => {
  if (!placements.length) {
    return null;
  }

  const visiblePlacements = placements.filter((placement) => {
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
        const presentation = presentedItem?.presentation;
        const sprite = presentation?.sprite;

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
            alt={placement.alt ?? presentedItem?.name ?? placement.itemId}
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
