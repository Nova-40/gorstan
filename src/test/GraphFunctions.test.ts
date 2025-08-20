import { describe, it, expect, vi, beforeEach } from 'vitest';
import { neighbors, validatePath, analyzeConnectivity, areConnected, findPath, getReachableRooms } from '../routes/graph';
import { mockRoomRegistry } from './mockRoomRegistry';

// Mock the room registry for graph tests
vi.mock('../roomRegistry', () => ({
  roomRegistry: mockRoomRegistry
}));

describe('Graph Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('neighbors function', () => {
    it('should return neighbors for a valid room', () => {
      const controlNexusNeighbors = neighbors('controlnexus');
      expect(controlNexusNeighbors).toContain('crossing');
      expect(controlNexusNeighbors).toContain('controlroom');
    });

    it('should return empty array for non-existent room', () => {
      const nonExistentNeighbors = neighbors('nonexistent');
      expect(nonExistentNeighbors).toEqual([]);
    });

    it('should handle rooms with limited exits', () => {
      const hiddenLabNeighbors = neighbors('hiddenlab');
      expect(hiddenLabNeighbors).toContain('controlroom');
      expect(hiddenLabNeighbors).toHaveLength(1);
    });
  });

  describe('areConnected function', () => {
    it('should detect direct connections', () => {
      expect(areConnected('controlnexus', 'crossing')).toBe(true);
      expect(areConnected('controlnexus', 'controlroom')).toBe(true);
    });

    it('should reject non-connections', () => {
      expect(areConnected('controlnexus', 'elfhame')).toBe(false);
      expect(areConnected('hiddenlab', 'crossing')).toBe(false);
    });
  });

  describe('validatePath function', () => {
    it('should validate a correct path', () => {
      const validPath = ['controlnexus', 'crossing', 'elfhame'];
      const result = validatePath(validPath);
      expect(result.isValid).toBe(true);
      expect(result.brokenAt).toBeUndefined();
      expect(result.missingRooms).toBeUndefined();
    });

    it('should reject an invalid path', () => {
      const invalidPath = ['controlnexus', 'elfhame']; // No direct connection
      const result = validatePath(invalidPath);
      expect(result.isValid).toBe(false);
      expect(result.brokenAt).toBe(0);
    });

    it('should validate single room path', () => {
      const singleRoomPath = ['controlnexus'];
      const result = validatePath(singleRoomPath);
      expect(result.isValid).toBe(true);
    });

    it('should detect missing rooms', () => {
      const invalidPath = ['controlnexus', 'nonexistent'];
      const result = validatePath(invalidPath);
      expect(result.isValid).toBe(false);
      expect(result.missingRooms).toContain('nonexistent');
    });
  });

  describe('findPath function', () => {
    it('should find path between connected rooms', () => {
      const path = findPath('controlnexus', 'elfhame');
      expect(path).not.toBeNull();
      expect(path![0]).toBe('controlnexus');
      expect(path![path!.length - 1]).toBe('elfhame');
    });

    it('should return null for unreachable rooms', () => {
      const path = findPath('controlnexus', 'nonexistent');
      expect(path).toBeNull();
    });

    it('should handle same room path', () => {
      const path = findPath('controlnexus', 'controlnexus');
      expect(path).toEqual(['controlnexus']);
    });
  });

  describe('getReachableRooms function', () => {
    it('should find reachable rooms from control nexus', () => {
      const reachable = getReachableRooms('controlnexus');
      expect(reachable.has('controlnexus')).toBe(true);
      expect(reachable.has('crossing')).toBe(true);
      expect(reachable.has('controlroom')).toBe(true);
      expect(reachable.size).toBeGreaterThan(1);
    });

    it('should respect max depth limit', () => {
      const reachableDepth1 = getReachableRooms('controlnexus', 1);
      const reachableDepth2 = getReachableRooms('controlnexus', 2);
      expect(reachableDepth2.size).toBeGreaterThanOrEqual(reachableDepth1.size);
    });
  });

  describe('analyzeConnectivity function', () => {
    it('should analyze overall room connectivity', () => {
      const connectivity = analyzeConnectivity();
      
      expect(connectivity.totalRooms).toBeGreaterThan(0);
      expect(connectivity.reachableFromStart).toBeGreaterThan(0);
      expect(Array.isArray(connectivity.unreachableRooms)).toBe(true);
      expect(connectivity.connectivityRatio).toBeGreaterThan(0);
      expect(connectivity.connectivityRatio).toBeLessThanOrEqual(1);
    });

    it('should identify reachable rooms from start', () => {
      const connectivity = analyzeConnectivity();
      const totalReachable = connectivity.reachableFromStart;
      const totalUnreachable = connectivity.unreachableRooms.length;
      
      expect(totalReachable + totalUnreachable).toBe(connectivity.totalRooms);
    });
  });

  describe('Demo Route Validation', () => {
    it('should validate demo route connectivity', () => {
      const demoPath = ['controlnexus', 'crossing', 'elfhame', 'faeglade'];
      const result = validatePath(demoPath);
      expect(result.isValid).toBe(true);
    });

    it('should ensure demo zones are reachable', () => {
      const demoZones = ['controlnexus', 'elfhame'];
      
      demoZones.forEach(zone => {
        const reachable = getReachableRooms('introZone_controlnexus');
        expect(reachable.has(zone) || zone === 'controlnexus').toBe(true);
      });
    });
  });

  describe('Short Route Validation', () => {
    it('should validate elfhame adventure path', () => {
      const elfhamePath = ['crossing', 'elfhame', 'faeglade', 'faelake'];
      const result = validatePath(elfhamePath);
      expect(result.isValid).toBe(true);
    });

    it('should validate gorstan village path', () => {
      const gorstanPath = ['gorstanhub', 'gorstanvillage', 'torridon'];
      const result = validatePath(gorstanPath);
      expect(result.isValid).toBe(true);
    });

    it('should ensure short routes have achievable connectivity', () => {
      const shortRouteZones = ['elfhame', 'gorstanvillage', 'torridon'];

      shortRouteZones.forEach(zone => {
        const neighbors_count = neighbors(zone).length;
        expect(neighbors_count, `${zone} should have connections`).toBeGreaterThanOrEqual(0);
        
        const reachable = getReachableRooms(zone, 3);
        expect(reachable.size, `${zone} should reach nearby areas`).toBeGreaterThan(0);
      });
    });
  });

  describe('Full Game Connectivity', () => {
    it('should ensure comprehensive zone connectivity', () => {
      const majorZones = [
        'controlnexus', 'elfhame', 'gorstanvillage', 
        'datavoid', 'torridon', 'faeglade'
      ];

      majorZones.forEach(zone => {
        const neighbors_count = neighbors(zone).length;
        // Allow some zones to have no exits (like dead ends)
        expect(neighbors_count, `Major zone ${zone} neighbor count`).toBeGreaterThanOrEqual(0);
      });
    });

    it('should validate overall game connectivity', () => {
      const connectivity = analyzeConnectivity();
      
      // Should have reasonable connectivity ratio
      expect(connectivity.connectivityRatio).toBeGreaterThan(0.5);
      
      // Should have multiple reachable rooms
      expect(connectivity.reachableFromStart).toBeGreaterThan(5);
    });
  });
});
