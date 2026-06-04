/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  You may play Gorstan for free for personal entertainment only.
  You may NOT copy, redistribute, modify, or sell the game, its code,
  artwork, storyline, or any other part without written permission.

  Full licence terms: see EULA.md in the project root.
*/

import type { ClickableHotspot, HotspotCommand } from './types';

function hasInventoryItem(state: any, item: string): boolean {
  const playerInventory = state?.player?.inventory;
  const rootInventory = state?.inventory;
  return Boolean(
    (Array.isArray(playerInventory) && playerInventory.includes(item)) ||
      (Array.isArray(rootInventory) && rootInventory.includes(item)),
  );
}

function hasFlag(state: any, flag: string): boolean {
  return Boolean(state?.flags?.[flag] || state?.player?.flags?.[flag]);
}

export function isHotspotVisible(hotspot: ClickableHotspot, state: any): boolean {
  if (hotspot.visible && !hotspot.visible(state)) return false;
  if (hotspot.visibleFlag && !hasFlag(state, hotspot.visibleFlag)) return false;
  if (hotspot.requiredFlag && !hasFlag(state, hotspot.requiredFlag)) return false;
  if (hotspot.hiddenFlag && hasFlag(state, hotspot.hiddenFlag)) return false;
  if (hotspot.requiredInventoryItem && !hasInventoryItem(state, hotspot.requiredInventoryItem)) {
    return false;
  }
  return true;
}

export function isHotspotEnabled(hotspot: ClickableHotspot, state: any): boolean {
  return hotspot.enabled ? hotspot.enabled(state) : true;
}

export function isCommandVisible(command: HotspotCommand, state: any): boolean {
  if (command.visible && !command.visible(state)) return false;
  if (command.visibleFlag && !hasFlag(state, command.visibleFlag)) return false;
  if (command.hiddenFlag && hasFlag(state, command.hiddenFlag)) return false;
  if (command.requiredInventoryItem && !hasInventoryItem(state, command.requiredInventoryItem)) {
    return false;
  }
  return true;
}

export function getDefaultCommandForHotspot(hotspot: ClickableHotspot): string {
  if (hotspot.defaultCommand) return hotspot.defaultCommand;

  switch (hotspot.kind) {
    case 'exit':
      return `go ${hotspot.commandTarget}`;
    case 'door':
    case 'lockedDoor':
      return `open ${hotspot.commandTarget}`;
    case 'portableObject':
      return `pick up ${hotspot.commandTarget}`;
    case 'readable':
      return `read ${hotspot.commandTarget}`;
    case 'machine':
      return `use ${hotspot.commandTarget}`;
    case 'button':
      return `press ${hotspot.commandTarget}`;
    case 'switch':
      return `switch ${hotspot.commandTarget}`;
    case 'lever':
      return `pull ${hotspot.commandTarget}`;
    case 'container':
      return `open ${hotspot.commandTarget}`;
    case 'character':
      return `talk to ${hotspot.commandTarget}`;
    case 'inventoryObject':
    case 'fixedObject':
    case 'scenery':
    default:
      return `inspect ${hotspot.commandTarget}`;
  }
}

export function getDefaultCommandsForHotspot(hotspot: ClickableHotspot): HotspotCommand[] {
  const target = hotspot.commandTarget;

  switch (hotspot.kind) {
    case 'exit':
      return [
        { label: 'Go', command: hotspot.defaultCommand ?? `go ${target}`, priority: 1 },
        { label: 'Examine', command: `inspect ${target}`, priority: 2 },
      ];

    case 'door':
      return [
        { label: 'Go through', command: hotspot.defaultCommand ?? `go ${target}`, priority: 1 },
        { label: 'Open', command: `open ${target}`, priority: 2 },
        { label: 'Examine', command: `inspect ${target}`, priority: 3 },
        { label: 'Knock', command: `knock on ${target}`, priority: 4 },
      ];

    case 'lockedDoor':
      return [
        { label: 'Open', command: `open ${target}`, priority: 1 },
        { label: 'Examine', command: `inspect ${target}`, priority: 2 },
        { label: 'Knock', command: `knock on ${target}`, priority: 3 },
        { label: 'Use item with...', command: `use item with ${target}`, priority: 4 },
      ];

    case 'portableObject':
      return [
        { label: 'Take', command: `pick up ${target}`, priority: 1 },
        { label: 'Examine', command: `inspect ${target}`, priority: 2 },
        { label: 'Use', command: `use ${target}`, priority: 3 },
      ];

    case 'inventoryObject':
      return [
        { label: 'Examine', command: `inspect ${target}`, priority: 1 },
        { label: 'Use', command: `use ${target}`, priority: 2 },
        { label: 'Use with...', command: `use ${target} with`, priority: 3 },
        { label: 'Drop', command: `drop ${target}`, priority: 4 },
      ];

    case 'readable':
      return [
        { label: 'Read', command: `read ${target}`, priority: 1 },
        { label: 'Examine', command: `inspect ${target}`, priority: 2 },
        { label: 'Search', command: `search ${target}`, priority: 3 },
      ];

    case 'machine':
      return [
        { label: 'Use', command: `use ${target}`, priority: 1 },
        { label: 'Examine', command: `inspect ${target}`, priority: 2 },
        { label: 'Read display', command: `read ${target} display`, priority: 3 },
        { label: 'Press controls', command: `press ${target} controls`, priority: 4 },
      ];

    case 'button':
      return [
        { label: 'Press', command: `press ${target}`, priority: 1 },
        { label: 'Examine', command: `inspect ${target}`, priority: 2 },
      ];

    case 'switch':
      return [
        { label: 'Switch', command: `switch ${target}`, priority: 1 },
        { label: 'Examine', command: `inspect ${target}`, priority: 2 },
      ];

    case 'lever':
      return [
        { label: 'Pull', command: `pull ${target}`, priority: 1 },
        { label: 'Examine', command: `inspect ${target}`, priority: 2 },
      ];

    case 'container':
      return [
        { label: 'Open', command: `open ${target}`, priority: 1 },
        { label: 'Search', command: `search ${target}`, priority: 2 },
        { label: 'Examine', command: `inspect ${target}`, priority: 3 },
      ];

    case 'character':
      return [
        { label: 'Talk', command: `talk to ${target}`, priority: 1 },
        { label: 'Ask about...', command: `ask ${target} about`, priority: 2 },
        { label: 'Show item', command: `show item to ${target}`, priority: 3 },
        { label: 'Give item', command: `give item to ${target}`, priority: 4 },
        { label: 'Examine', command: `inspect ${target}`, priority: 5 },
      ];

    case 'fixedObject':
      return [
        { label: 'Examine', command: `inspect ${target}`, priority: 1 },
        { label: 'Use', command: `use ${target}`, priority: 2 },
        { label: 'Search', command: `search ${target}`, priority: 3 },
      ];

    case 'scenery':
    default:
      return [{ label: 'Examine', command: `inspect ${target}`, priority: 1 }];
  }
}

export function getCommandsForHotspot(hotspot: ClickableHotspot, state: any): HotspotCommand[] {
  const commands = hotspot.commands?.length
    ? hotspot.commands
    : getDefaultCommandsForHotspot(hotspot);

  return commands
    .filter((command) => isCommandVisible(command, state))
    .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));
}
