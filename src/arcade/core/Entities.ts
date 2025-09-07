/*
  Gorstan – Interactive Game Framework
  Copyright © 2025 Geoff Webster. All Rights Reserved.

  This source code is proprietary and confidential.
  Unauthorised copying, distribution, modification, resale,
  reverse engineering, or use of this file, via any medium,
  is strictly prohibited without prior written consent
  from the copyright holder.

  Licensed access is granted only to authorised users who have
  purchased access to Gorstan through official channels.
  Such licence is strictly limited to running and playing the
  Gorstan game. No part of this source code may be used to
  create derivative works, other games, or redistributed in
  any form.

  Third-party libraries and assets are included under their
  respective licences as detailed in package.json and assets/.
*/

// Entities.ts - core entity interfaces for Catacombe Dash
export type Lane = 0 | 1 | 2; // left, mid, right
export interface Vec3 { x: number; y: number; z: number }
export type EntityId = string;

export interface Runner { lane: Lane; y: number; z: number; velocityZ: number; isSliding: boolean; isPhasing: boolean; hp: number; }
export interface Collectible { id: EntityId; lane: Lane; z: number; type: 'fragment' | 'quantum'; }
export interface Hazard { id: EntityId; lane: Lane; z: number; kind: 'spike' | 'pit' | 'wall' | 'schrodinger'; active?: boolean }
export interface Shadow { id: EntityId; lane: Lane; z: number; mood: 'hunt' | 'scatter' | 'glitch' }
export interface LevelSlice { zStart: number; zEnd: number; collectibles: Collectible[]; hazards: Hazard[]; shadows: Shadow[] }
