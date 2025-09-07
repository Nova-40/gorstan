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

// Simple registry to expose game dispatch to systems (e.g., puzzle controller)
import type { GameAction } from '../types/GameTypes';

let _dispatch: React.Dispatch<GameAction> | null = null;

export function setGameDispatch(dispatch: React.Dispatch<GameAction>): void {
  _dispatch = dispatch;
}

export function getGameDispatch(): React.Dispatch<GameAction> | null {
  return _dispatch;
}
