
import { z } from 'zod';

export const RoomExitSchema = z.object({
  to: z.string().min(1),
  label: z.string().min(1)
});

export const RoomActionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  effects: z.array(z.string().min(1)).default([])
});

export const RoomSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  zone: z.enum(['glitch','nexus','elfhame','maze','default']).default('default'),
  enterText: z.array(z.string()).min(1),
  exits: z.array(RoomExitSchema).default([]),
  teleportStyle: z.enum(['fractal','trek']).optional(),
  unlocksLore: z.array(z.string()).optional(),
  objectiveHints: z.array(z.string()).optional(),
  ambient: z.string().optional(),
  actions: z.array(RoomActionSchema).optional()
});

// Record of rooms keyed by their id. Using explicit key schema for clarity under Zod v4.
export const RoomsRecordSchema = z.record(z.string(), RoomSchema);

export type RoomRecord = z.infer<typeof RoomsRecordSchema>;

export function validateRoomsJson(obj: unknown){
  const parsed = RoomsRecordSchema.safeParse(obj);
  if (!parsed.success){
    const issues = parsed.error.issues.map(i => `${i.path.join('.')} - ${i.message}`);
    throw new Error('rooms.json validation failed:\n' + issues.join('\n'));
  }
  const data = parsed.data; // strongly typed as Record<string, RoomSchema>

  // Key / id consistency + orphan exit detection
  const ids = new Set(Object.keys(data));
  const badExits: string[] = [];
  const mismatchedIds: string[] = [];

  for (const [key, room] of Object.entries(data)){
    if (room.id && room.id !== key){
      mismatchedIds.push(`${key} (key) != ${room.id} (room.id)`);
    }
    for (const ex of room.exits){
      if (!ids.has(ex.to)) badExits.push(`${key} -> ${ex.to}`);
    }
  }
  if (mismatchedIds.length){
    throw new Error('rooms.json contains rooms with id differing from their object key:\n' + mismatchedIds.join('\n'));
  }
  if (badExits.length){
    throw new Error('rooms.json contains exits to missing rooms:\n' + badExits.join('\n'));
  }
  return data;
}
