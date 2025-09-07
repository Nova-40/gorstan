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

// TeleportOverlayBridge.tsx - integrates existing teleport overlays with arcade engine
// Listens for arcade-specific teleport intents and re-emits unified ui:teleport events
import React, { useEffect } from 'react';

interface ArcadeTeleportDetail { style: 'fractal' | 'trek'; source?: string }

export const TeleportOverlayBridge: React.FC = () => {
	useEffect(() => {
		const handler = (e: Event) => {
			const detail = (e as CustomEvent<ArcadeTeleportDetail>).detail;
			if (!detail) return;
			try {
				document.dispatchEvent(new CustomEvent('ui:teleport', { detail: { mode: detail.style, source: detail.source || 'arcade' } }));
			} catch {}
		};
		document.addEventListener('arcade:teleport', handler as any);
		return () => document.removeEventListener('arcade:teleport', handler as any);
	}, []);
	return null;
};

export default TeleportOverlayBridge;
