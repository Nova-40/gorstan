/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  You may play Gorstan for free for personal entertainment only.
  You may NOT copy, redistribute, modify, or sell the game, its code,
  artwork, storyline, or any other part without written permission.

  Full licence terms: see EULA.md in the project root.
*/

import React, { useMemo, useState } from 'react';

import type { ClickableHotspot, HotspotCommand } from '../ui/clickableRooms/types';
import {
  getCommandsForHotspot,
  getDefaultCommandForHotspot,
  isHotspotEnabled,
  isHotspotVisible,
} from '../ui/clickableRooms/menu';

type ContextMenuState = {
  hotspot: ClickableHotspot;
  commands: HotspotCommand[];
  x: number;
  y: number;
} | null;

interface ClickableRoomOverlayProps {
  hotspots?: ClickableHotspot[];
  state: any;
  onCommand: (command: string) => void;
  debug?: boolean;
}

function rectStyle(coords: number[]): React.CSSProperties {
  const [left = 0, top = 0, width = 0, height = 0] = coords;
  return {
    left: `${left}%`,
    top: `${top}%`,
    width: `${width}%`,
    height: `${height}%`,
  };
}

function polygonStyle(coords: number[]): React.CSSProperties {
  const points: string[] = [];
  for (let i = 0; i < coords.length; i += 2) {
    const x = coords[i] ?? 0;
    const y = coords[i + 1] ?? 0;
    points.push(`${x}% ${y}%`);
  }

  return {
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    clipPath: `polygon(${points.join(', ')})`,
  };
}

function hotspotStyle(hotspot: ClickableHotspot): React.CSSProperties {
  return {
    ...(hotspot.shape === 'polygon' ? polygonStyle(hotspot.coords) : rectStyle(hotspot.coords)),
    zIndex: hotspot.zIndex ?? 1,
  };
}

function shouldAutoRun(hotspot: ClickableHotspot, commands: HotspotCommand[]): boolean {
  // Obvious exits should behave like movement buttons; most objects should show the menu.
  return hotspot.kind === 'exit' && commands.length > 0;
}

const ClickableRoomOverlay: React.FC<ClickableRoomOverlayProps> = ({
  hotspots = [],
  state,
  onCommand,
  debug = false,
}) => {
  const [menu, setMenu] = useState<ContextMenuState>(null);

  const visibleHotspots = useMemo(
    () =>
      hotspots
        .filter((hotspot) => isHotspotVisible(hotspot, state))
        .sort((a, b) => (a.zIndex ?? 1) - (b.zIndex ?? 1)),
    [hotspots, state],
  );

  if (!visibleHotspots.length) {
    return null;
  }

  const closeMenu = () => setMenu(null);

  const executeCommand = (command: string) => {
    const trimmed = command.trim();
    if (!trimmed) return;
    closeMenu();
    onCommand(trimmed);
  };

  const handleHotspotClick = (event: React.MouseEvent<HTMLButtonElement>, hotspot: ClickableHotspot) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isHotspotEnabled(hotspot, state)) {
      executeCommand(hotspot.disabledText ?? `inspect ${hotspot.commandTarget}`);
      return;
    }

    const commands = getCommandsForHotspot(hotspot, state);
    if (!commands.length) {
      executeCommand(getDefaultCommandForHotspot(hotspot));
      return;
    }

    if (shouldAutoRun(hotspot, commands)) {
      executeCommand(commands[0]?.command ?? getDefaultCommandForHotspot(hotspot));
      return;
    }

    setMenu({
      hotspot,
      commands,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleContextMenu = (event: React.MouseEvent<HTMLButtonElement>, hotspot: ClickableHotspot) => {
    event.preventDefault();
    event.stopPropagation();
    executeCommand(`inspect ${hotspot.commandTarget}`);
  };

  return (
    <div className="clickable-room-layer" onClick={closeMenu}>
      {visibleHotspots.map((hotspot) => (
        <button
          key={hotspot.id}
          type="button"
          className={`clickable-hotspot clickable-hotspot--${hotspot.kind}${debug ? ' clickable-hotspot--debug' : ''}`}
          style={hotspotStyle(hotspot)}
          title={hotspot.hoverText || hotspot.label}
          aria-label={hotspot.hoverText || hotspot.label}
          onClick={(event) => handleHotspotClick(event, hotspot)}
          onContextMenu={(event) => handleContextMenu(event, hotspot)}
        >
          {debug && <span className="clickable-hotspot-label">{hotspot.label}</span>}
        </button>
      ))}

      {menu && (
        <div
          className="clickable-context-menu"
          style={{ left: menu.x, top: menu.y }}
          role="menu"
          aria-label={`${menu.hotspot.label} actions`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="clickable-context-menu-title">{menu.hotspot.label}</div>
          {menu.commands.map((command) => (
            <button
              key={`${menu.hotspot.id}-${command.label}-${command.command}`}
              type="button"
              className="clickable-context-menu-item"
              role="menuitem"
              onClick={() => executeCommand(command.command)}
            >
              {command.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClickableRoomOverlay;
