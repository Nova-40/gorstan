import { z } from 'zod';

export const ExitSchema = z.object({
  to: z.string().min(1),
  requires: z.array(z.string()).optional(),
  description: z.string().optional(),
});

export const RoomSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  zone: z.string().min(1),
  image: z.string().min(1),
  description: z.string().min(1),
  exits: z.array(ExitSchema).default([]),
  items: z.array(z.string()).optional(),
  npcs: z.array(z.string()).optional(),
});

export type Exit = z.infer<typeof ExitSchema>;
export type Room = z.infer<typeof RoomSchema>;

export const HotspotSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  description: z.string().optional(),
  x: z.number(),
  y: z.number(),
  width: z.number().positive(),
  height: z.number().positive(),
  command: z.string().optional(),
});

export const RoomActionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  command: z.string().min(1),
});

export const CanonicalRoomSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.union([z.string().min(1), z.array(z.string().min(1)).min(1)]),
  exits: z.array(
    z.object({
      direction: z.string().min(1),
      targetRoomId: z.string().min(1),
      label: z.string().optional(),
    }),
  ),
  actions: z.array(RoomActionSchema).default([]),
  hotspots: z.array(HotspotSchema).default([]),
  effects: z
    .array(
      z.object({
        id: z.string().min(1),
        kind: z.enum(['sprite', 'ambient', 'particle', 'overlay']),
        label: z.string().optional(),
        image: z.string().optional(),
      }),
    )
    .default([]),
});

// Game state validation schemas
export const SaveDataSchema = z.object({
  version: z.number().min(1),
  player: z.object({
    name: z.string().optional(),
    currentRoom: z.string(),
    inventory: z.array(z.string()).default([]),
    health: z.number().min(0).max(100).default(100),
  }),
  flags: z.record(z.string(), z.boolean()).default({}),
  visitedRooms: z.array(z.string()).default([]),
  timestamp: z.string().optional(),
});

export const AchievementStateSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  unlocked: z.boolean(),
  hidden: z.boolean().optional(),
  unlockedAt: z.string().optional(),
});

export const SaveStateSchema = z.object({
  version: z.number().min(1),
  currentRoomId: z.string().min(1),
  inventory: z.array(z.string()).default([]),
  flags: z.record(z.string(), z.union([z.boolean(), z.number(), z.string()])).default({}),
  achievements: z.array(AchievementStateSchema).default([]),
  timestamp: z.string().min(1),
});

export type SaveData = z.infer<typeof SaveDataSchema>;
export type CanonicalRoom = z.infer<typeof CanonicalRoomSchema>;
export type SaveState = z.infer<typeof SaveStateSchema>;
