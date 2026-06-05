/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  Presentation metadata for visual / clickable room rendering.

  This module deliberately sits beside the canonical item registry in items.ts.
  It does not replace object logic. It supplies the visual layer with sprite,
  inventory icon, hotspot and special UI behaviour for known item ids.
*/

import { ITEMS, Item } from './items';

export interface Point2D {
  readonly x: number;
  readonly y: number;
}

export interface ItemClickAction {
  readonly label: string;
  readonly command: string;
  readonly primary?: boolean;
}

export interface ItemPresentation {
  /** Item id from the canonical ITEMS registry. */
  readonly itemId: string;

  /** Transparent room sprite displayed when the item is physically in a room. */
  readonly sprite?: string;

  /** Smaller inventory-facing icon. Falls back to sprite if omitted. */
  readonly inventoryIcon?: string;

  /** Whether the visual layer should offer Drop in action menus. */
  readonly droppable?: boolean;

  /** Default placement when the item is dropped into a room without a room-specific placement. */
  readonly defaultDropPosition?: Point2D;

  /** Optional display size for the room sprite. */
  readonly defaultSpriteSize?: {
    readonly width: number;
    readonly height: number;
  };

  /** Click menu entries for point-and-click interactions. */
  readonly clickActions?: readonly ItemClickAction[];

  /** Message to show when a drop action is refused or overridden. */
  readonly onDropMessage?: string;

  /** Allows special items to remain in inventory after drop is attempted. */
  readonly retainOnDrop?: boolean;
}

export interface PresentedItem extends Item {
  readonly presentation?: ItemPresentation;
}

export interface ItemCatalogueEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly portable: boolean;
  readonly category?: Item['category'];
  readonly rarity?: Item['rarity'];
  readonly spawnRooms?: readonly string[];
  readonly traits: readonly string[];
  readonly hasSprite: boolean;
  readonly hasInventoryIcon: boolean;
  readonly droppable: boolean;
}

const DEFAULT_ITEM_ACTIONS: readonly ItemClickAction[] = [
  { label: 'Examine', command: 'examine {item}', primary: true },
  { label: 'Take', command: 'take {item}' },
  { label: 'Use', command: 'use {item}' },
  { label: 'Drop', command: 'drop {item}' },
];

export const ITEM_PRESENTATION: Record<string, ItemPresentation> = {
  goldcoin: {
    itemId: 'goldcoin',
    sprite: '/sprites/items/gold-coin.png',
    inventoryIcon: '/sprites/inventory/gold-coin.png',
    droppable: true,
    defaultDropPosition: { x: 0.5, y: 0.82 },
    defaultSpriteSize: { width: 42, height: 42 },
    clickActions: DEFAULT_ITEM_ACTIONS,
  },

  quantumcoin: {
    itemId: 'quantumcoin',
    sprite: '/sprites/items/quantum-coin.png',
    inventoryIcon: '/sprites/inventory/quantum-coin.png',
    droppable: true,
    defaultDropPosition: { x: 0.5, y: 0.82 },
    defaultSpriteSize: { width: 46, height: 46 },
    clickActions: DEFAULT_ITEM_ACTIONS,
  },

  schrodinger_coin: {
    itemId: 'schrodinger_coin',
    sprite: '/sprites/items/schrodinger-coin.png',
    inventoryIcon: '/sprites/inventory/schrodinger-coin.png',
    droppable: false,
    retainOnDrop: true,
    defaultDropPosition: { x: 0.5, y: 0.82 },
    defaultSpriteSize: { width: 48, height: 48 },
    clickActions: [
      { label: 'Examine', command: 'examine schrodinger coin', primary: true },
      { label: 'Take', command: 'take schrodinger coin' },
      { label: 'Use', command: 'use schrodinger coin' },
      { label: 'Drop', command: 'drop schrodinger coin' },
    ],
    onDropMessage:
      'You drop the coin. It remains in your possession, having apparently rejected the premise.',
  },

  coffee: {
    itemId: 'coffee',
    sprite: '/sprites/items/gorstan-coffee.png',
    inventoryIcon: '/sprites/inventory/gorstan-coffee.png',
    droppable: true,
    defaultDropPosition: { x: 0.48, y: 0.78 },
    defaultSpriteSize: { width: 44, height: 44 },
    clickActions: DEFAULT_ITEM_ACTIONS,
  },

  greasynapkin: {
    itemId: 'greasynapkin',
    sprite: '/sprites/items/greasy-napkin.png',
    inventoryIcon: '/sprites/inventory/greasy-napkin.png',
    droppable: true,
    defaultDropPosition: { x: 0.5, y: 0.8 },
    defaultSpriteSize: { width: 56, height: 40 },
    clickActions: [
      { label: 'Examine', command: 'examine greasy napkin', primary: true },
      { label: 'Read', command: 'read greasy napkin' },
      { label: 'Take', command: 'take greasy napkin' },
      { label: 'Drop', command: 'drop greasy napkin' },
    ],
  },

  dominic: {
    itemId: 'dominic',
    sprite: '/sprites/items/dominic-bowl.png',
    inventoryIcon: '/sprites/inventory/dominic-bowl.png',
    droppable: false,
    retainOnDrop: true,
    defaultDropPosition: { x: 0.55, y: 0.76 },
    defaultSpriteSize: { width: 82, height: 64 },
    clickActions: [
      { label: 'Examine', command: 'examine dominic', primary: true },
      { label: 'Talk', command: 'talk to dominic' },
      { label: 'Use', command: 'use dominic' },
    ],
    onDropMessage:
      'Dominic fixes you with the disappointed look of a goldfish who has read the safeguarding policy.',
  },
};

export function getItemPresentation(itemId: string): ItemPresentation | undefined {
  return ITEM_PRESENTATION[itemId];
}

export function getPresentedItem(itemId: string): PresentedItem | undefined {
  const item = ITEMS.find((candidate) => candidate.id === itemId);

  if (!item) {
    return undefined;
  }

  return {
    ...item,
    presentation: getItemPresentation(itemId),
  };
}

export function getPresentedItems(): PresentedItem[] {
  return ITEMS.map((item) => ({
    ...item,
    presentation: getItemPresentation(item.id),
  }));
}

export function listObjectCatalogue(): ItemCatalogueEntry[] {
  return ITEMS.map((item) => {
    const presentation = getItemPresentation(item.id);

    return {
      id: item.id,
      name: item.name,
      description: item.description,
      portable: item.portable,
      category: item.category,
      rarity: item.rarity,
      spawnRooms: item.spawnRooms,
      traits: item.traits,
      hasSprite: Boolean(presentation?.sprite),
      hasInventoryIcon: Boolean(presentation?.inventoryIcon),
      droppable: presentation?.droppable ?? item.portable,
    };
  });
}
