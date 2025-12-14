import { z } from 'zod';

// Minimal, permissive room schema to validate required shapes at runtime.
export const roomSchema = z.object({
  id: z.string(),
  zone: z.string().optional(),
  title: z.string().optional(),
  // Enforce description as array of strings for consistency
  description: z.array(z.string()),
  image: z.string().optional(),
  ambientAudio: z.string().optional(),
  consoleIntro: z.array(z.string()).optional(),
  // Micro-objectives: short, per-room tasks to surface to players
  microObjectives: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
        // Optional trigger - lightweight: either item collected or a flag set
        trigger: z
          .object({
            type: z.union([z.literal('item_collected'), z.literal('flag_set')]),
            target: z.string(),
          })
          .optional(),
      }),
    )
    .optional(),
  // exits: map of direction -> roomId
  exits: z.record(z.string(), z.string()).optional(),
  // Items should be objects with an id and optional name/description
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
    }),
  ),
  // Interactables must be a record keyed by id (legacy arrays should be converted)
  interactables: z.record(z.string(), z.any()),
  npcs: z.array(z.any()).optional(),
  events: z.record(z.string(), z.any()).optional(),
  flags: z.record(z.string(), z.any()).optional(),
  quests: z.record(z.string(), z.any()).optional(),
  environmental: z.record(z.string(), z.any()).optional(),
  security: z.record(z.string(), z.any()).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  secrets: z.record(z.string(), z.any()).optional(),
  customActions: z.record(z.string(), z.any()).optional(),
});

export type RoomSchema = z.infer<typeof roomSchema>;
