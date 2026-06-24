import type { Room } from '../types/Room';

type VisualHotspot = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  command: string;
  description?: string;
};

type VisualSceneRoom = Room & {
  visualScene: {
    id: string;
    ambient?: string;
    testId?: string;
  };
  clickHotspots: VisualHotspot[];
  itemDescriptions?: Record<string, string>;
};

const dalesBedroom = {
  id: 'dales_bedroom',
  title: "Dale's Bedroom",
  zone: 'london',
  RoomDefinition: 'standard',
  description:
    "Dale's bedroom is quiet, tidy in the way rooms become tidy when someone has decided not to disturb them too much. A bed is made with careful corners, a small bedside table holds ordinary domestic archaeology, and the wardrobe door sits just slightly ajar. There is a softness here that does not ask to be noticed, which naturally makes it impossible to ignore.",
  image: 'londonzone_dales_bedroom.png',
  visualScene: {
    id: 'dales-bedroom-visual-slice',
    ambient: 'apartment-light',
    testId: 'dales-bedroom-visual-scene',
  },
  clickHotspots: [
    {
      id: 'apartment-exit',
      x: 4,
      y: 35,
      width: 14,
      height: 34,
      label: 'Back to Apartment',
      command: 'go south',
      description: "Return to Dale and Polly's apartment.",
    },
    {
      id: 'bed',
      x: 34,
      y: 49,
      width: 30,
      height: 28,
      label: 'Bed',
      command: 'inspect bed',
      description: "Inspect Dale's carefully made bed.",
    },
    {
      id: 'bedside-table',
      x: 63,
      y: 47,
      width: 13,
      height: 20,
      label: 'Bedside Table',
      command: 'inspect bedside_table',
      description: 'Inspect the bedside table.',
    },
    {
      id: 'wardrobe',
      x: 77,
      y: 22,
      width: 16,
      height: 48,
      label: 'Wardrobe',
      command: 'inspect wardrobe',
      description: 'Inspect the slightly ajar wardrobe.',
    },
  ],
  exits: {
    south: 'dalesapartment',
    apartment: 'dalesapartment',
    back: 'dalesapartment',
  },
  items: [],
  npcs: [],
  flags: {},
  itemDescriptions: {
    bed:
      'The bed is made with care rather than fuss. It looks like the sort of bed that has heard more thinking than sleeping.',
    bedside_table:
      'A small bedside table holds a lamp, a book turned face-down, and the faint suggestion of a routine interrupted.',
    wardrobe:
      'The wardrobe is slightly ajar. Inside are clothes arranged with the resigned order of someone who knows where everything ought to be.',
  },
} as unknown as VisualSceneRoom;

export default dalesBedroom;
