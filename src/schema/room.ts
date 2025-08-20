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

export type SaveData = z.infer<typeof SaveDataSchema>;
