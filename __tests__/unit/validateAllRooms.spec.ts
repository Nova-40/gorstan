import { describe, it, expect } from 'vitest';
import { roomSchema } from '../../src/schema/roomSchema';
import { roomRegistry } from '../../src/roomRegistry';

describe('all rooms conform to schema', () => {
  it('validates every room in roomRegistry', () => {
    const failures: string[] = [];
    Object.entries(roomRegistry).forEach(([key, room]) => {
      const result = roomSchema.safeParse(room as any);
      if (!result.success) {
        failures.push(`${key}: ${JSON.stringify(result.error.format())}`);
      }
    });

    if (failures.length > 0) {
      console.error('Room schema validation failures:', failures.slice(0, 10));
    }

    expect(failures.length).toBe(0);
  });
});
