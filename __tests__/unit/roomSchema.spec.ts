import { describe, it, expect } from 'vitest';
import { roomSchema } from '../../src/schema/roomSchema';
import centralPark from '../../src/rooms/newyorkZone_centralpark';

describe('roomSchema', () => {
  it('validates a real room (centralpark)', () => {
    const result = roomSchema.safeParse(centralPark as any);
    expect(result.success).toBe(true);
  });

  it('rejects malformed room objects', () => {
    const badRoom = { name: 123, exits: { north: 5 } };
    const result = roomSchema.safeParse(badRoom as any);
    expect(result.success).toBe(false);
  });
});
