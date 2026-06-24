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

const dalesKitchen = {
  id: 'dales_kitchen',
  title: "Dale's Kitchen",
  zone: 'london',
  RoomDefinition: 'standard',
  description:
    "Dale's kitchen is compact, practical, and faintly over-qualified for toast. Clean counters, a kettle, stacked mugs, and a fridge covered in small reminders make it feel lived-in without being careless. It is the kind of room where serious plans are accidentally made while waiting for water to boil.",
  image: 'londonzone_dales_kitchen.png',
  visualScene: {
    id: 'dales-kitchen-visual-slice',
    ambient: 'apartment-light',
    testId: 'dales-kitchen-visual-scene',
  },
  clickHotspots: [
    {
      id: 'apartment-exit',
      x: 3,
      y: 34,
      width: 14,
      height: 36,
      label: 'Back to Apartment',
      command: 'go south',
      description: "Return to Dale and Polly's apartment.",
    },
    {
      id: 'kettle',
      x: 38,
      y: 45,
      width: 12,
      height: 16,
      label: 'Kettle',
      command: 'inspect kettle',
      description: 'Inspect the kettle.',
    },
    {
      id: 'mugs',
      x: 51,
      y: 42,
      width: 12,
      height: 15,
      label: 'Mugs',
      command: 'inspect mugs',
      description: 'Inspect the mugs.',
    },
    {
      id: 'fridge',
      x: 72,
      y: 25,
      width: 18,
      height: 44,
      label: 'Fridge',
      command: 'inspect fridge',
      description: 'Inspect the fridge and its reminders.',
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
    kettle:
      'The kettle has the alert, slightly smug look of an appliance that knows it is essential infrastructure.',
    mugs:
      'The mugs are stacked neatly. One has a faded design that may once have been amusing before repeated dishwasher diplomacy.',
    fridge:
      'The fridge is covered with notes, magnets, and the quiet evidence of ordinary life trying to remain organised.',
  },
} as unknown as VisualSceneRoom;

export default dalesKitchen;
