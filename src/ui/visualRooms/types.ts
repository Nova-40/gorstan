/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  Shared types for optional visual room layers.

  These types are deliberately presentation-facing. They do not own game logic;
  item state, movement, inventory and puzzle consequences must still flow through
  the parser / engine pipeline.
*/

export type CoordinateUnit = 'percent' | 'ratio';

export interface VisibilityGate {
  readonly visibleFlag?: string;
  readonly hiddenFlag?: string;
  readonly requiredFlag?: string;
  readonly requiredInventoryItem?: string;
  readonly visible?: (state: any) => boolean;
}

export interface RoomItemPlacement extends VisibilityGate {
  readonly itemId: string;

  /**
   * Position of the sprite anchor. Defaults to ratio coordinates, 0..1.
   * Set coordinateUnit to 'percent' if using 0..100 values.
   */
  readonly x: number;
  readonly y: number;
  readonly coordinateUnit?: CoordinateUnit;

  /** Optional display size in CSS pixels. Falls back to itemPresentation metadata. */
  readonly width?: number;
  readonly height?: number;

  /** Optional position anchor. Defaults to centre. */
  readonly anchor?: 'topLeft' | 'center' | 'bottomCenter';

  readonly zIndex?: number;
  readonly className?: string;
  readonly alt?: string;
  readonly debugLabel?: string;
}

export type RoomEffectType = 'css' | 'image' | 'spriteSheet' | 'svg' | 'canvas';
export type ReducedMotionFallback = 'hide' | 'static' | 'steady';

export interface RoomEffect extends VisibilityGate {
  readonly id: string;
  readonly type: RoomEffectType;
  readonly label?: string;
  readonly preset?: string;
  readonly src?: string;
  readonly className?: string;

  /** Position uses the same coordinate convention as RoomItemPlacement. */
  readonly x: number;
  readonly y: number;
  readonly coordinateUnit?: CoordinateUnit;
  readonly width: number;
  readonly height?: number;

  readonly opacity?: number;
  readonly zIndex?: number;
  readonly pointerEvents?: 'none' | 'auto';
  readonly reducedMotionFallback?: ReducedMotionFallback;

  /** For CSS/SVG presets where src is not needed. */
  readonly text?: string;
}

export interface RoomWithVisualLayers {
  readonly itemPlacements?: readonly RoomItemPlacement[];
  readonly effects?: readonly RoomEffect[];
}
