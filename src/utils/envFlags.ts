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

// Centralized environment/test mode helpers
// Avoid scattering direct process.env checks.

export function isTestMode(): boolean {
  return (globalThis as any)?.process?.env?.TEST_MODE === 'true';
}

export function isDemoEnv(): boolean {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.has('demo') || params.get('demo') === 'true') return true;
  }
  return (globalThis as any)?.process?.env?.DEMO === 'true' || (globalThis as any)?.process?.env?.NODE_ENV === 'demo';
}

export function isCI(): boolean {
  return (globalThis as any)?.process?.env?.CI === 'true';
}

export default { isTestMode, isDemoEnv, isCI };
