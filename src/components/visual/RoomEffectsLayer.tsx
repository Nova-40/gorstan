/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  Optional ambient effects layer for illustrated/clickable rooms.

  If a room has no effects, this layer renders nothing. Unknown/missing effect data
  is ignored rather than treated as fatal, so rooms can adopt effects gradually.
*/

import React from 'react';

import type { RoomEffect } from '../../ui/visualRooms/types';
import { isVisibleByGate, positionToCssValue } from './visualLayerUtils';

interface RoomEffectsLayerProps {
  readonly effects?: readonly RoomEffect[];
  readonly state: any;
  readonly debug?: boolean;
}

function effectClassName(effect: RoomEffect): string {
  return [
    'room-effect',
    effect.preset ? `room-effect--${effect.preset}` : '',
    effect.type ? `room-effect--type-${effect.type}` : '',
    effect.className ?? '',
  ]
    .filter(Boolean)
    .join(' ');
}

function effectStyle(effect: RoomEffect): React.CSSProperties {
  return {
    left: positionToCssValue(effect.x, effect.coordinateUnit),
    top: positionToCssValue(effect.y, effect.coordinateUnit),
    width: effect.width,
    height: effect.height,
    opacity: effect.opacity,
    zIndex: effect.zIndex ?? 20,
    pointerEvents: effect.pointerEvents ?? 'none',
  };
}

const RoomEffectsLayer: React.FC<RoomEffectsLayerProps> = ({ effects = [], state, debug = false }) => {
  if (!effects.length) {
    return null;
  }

  const visibleEffects = effects.filter((effect) => isVisibleByGate(effect, state));

  if (!visibleEffects.length) {
    return null;
  }

  return (
    <div className="room-effects-layer" aria-hidden="true">
      {visibleEffects.map((effect) => {
        const style = effectStyle(effect);
        const className = effectClassName(effect);

        if ((effect.type === 'image' || effect.type === 'spriteSheet') && effect.src) {
          return (
            <img
              key={effect.id}
              src={effect.src}
              alt=""
              className={className}
              draggable={false}
              style={style}
              title={debug ? effect.label ?? effect.id : undefined}
            />
          );
        }

        if (effect.type === 'svg') {
          return (
            <svg
              key={effect.id}
              className={className}
              style={style}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              role="presentation"
            >
              <path className="room-effect-svg-path" d="M5 75 C30 20 60 85 95 25" />
            </svg>
          );
        }

        if (effect.type === 'canvas') {
          return (
            <div
              key={effect.id}
              className={`${className} room-effect--canvas-placeholder`}
              style={style}
              title={debug ? `${effect.label ?? effect.id} (canvas placeholder)` : undefined}
            />
          );
        }

        return (
          <div
            key={effect.id}
            className={className}
            style={style}
            title={debug ? effect.label ?? effect.id : undefined}
          >
            {debug && <span className="room-effect-debug-label">{effect.label ?? effect.id}</span>}
            {effect.text && <span className="room-effect-text">{effect.text}</span>}
          </div>
        );
      })}
    </div>
  );
};

export default RoomEffectsLayer;
