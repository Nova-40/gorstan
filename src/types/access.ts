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

// Access & entitlement related types for landing page / unlock flows
// Spec derived from landing page brief v1.1

export type AccessState = 'locked' | 'demo' | 'beta' | 'patreon';

export interface UserAccess {
  state: AccessState;
  token?: string;        // signed JWT (short‑lived)
  betaCode?: string;     // last used code (masked when shown)
  patreonTier?: string;  // e.g. 'Supporter' | 'Founder'
  expiresAt?: string;    // ISO timestamp for beta expiry
  revoked?: boolean;     // server flagged
}

export interface ValidateCodeRequest { code: string; }
export interface ValidateCodeResponse {
  ok: boolean;
  state?: AccessState;   // expected 'beta'
  token?: string;
  tier?: string;         // for analytics tracking
  expiresAt?: string;
  message?: string;
}

export interface PatreonEntitlement {
  ok: boolean;
  tier?: string;   // 'Supporter' | 'Founder'
  token?: string;
}

export type AnalyticsEventName =
  | 'nav_click'
  | 'demo_start'
  | 'demo_timeout'
  | 'unlock_view'
  | 'beta_validate_attempt'
  | 'beta_validate_success'
  | 'beta_validate_failed'
  | 'beta_validate_error'
  | 'patreon_connect_success'
  | 'patreon_connect_failed'
  | 'patreon_connect_error'
  | 'game_mode_set'
  | 'reel_play'
  | 'pricing_cta_click'
  | 'books_click';
