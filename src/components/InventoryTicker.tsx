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

import React, { useEffect, useRef, useState } from 'react';
import { useGameState } from '../state/gameState';

/**
 * InventoryTicker – lightweight, docked top-right scrolling inventory feed.
 * Auto-scrolls when new items are added; collapses if empty.
 */
const MAX_VISIBLE = 6;

export const InventoryTicker: React.FC<{ className?: string }> = ({ className }) => {
  const { state } = useGameState();
  const items: string[] = state.player?.inventory || state.inventory || [];
  const [recent, setRecent] = useState<string[]>(items);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track new items (simple diff)
  useEffect(() => {
    if (items.length > recent.length) {
      setRecent(items);
      // Auto scroll to bottom for newest items
      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      });
    } else if (items.length < recent.length) {
      setRecent(items);
    }
  }, [items, recent]);

  if (!items.length) return null;

  const display = items.slice(-MAX_VISIBLE);

  return (
    <div className={"inventory-ticker pointer-events-auto " + (className || '')}>
      <div className="inv-header">Inventory</div>
      <div ref={containerRef} className="inv-scroll">
        {display.map((it: string, i: number) => (
          <div key={it + i} className="inv-item animate-fade-in">{it}</div>
        ))}
      </div>
    </div>
  );
};

export default InventoryTicker;
