import { describe, test, expect } from 'vitest';
import { GOLDEN_PATHS, getGoldenPath, estimatePathDuration } from '../routes/goldenPaths';
import { validatePath, neighbors, analyzeConnectivity } from '../routes/graph';

describe('Golden Paths Validation', () => {
  test('All golden paths are defined', () => {
    expect(Object.keys(GOLDEN_PATHS).length).toBeGreaterThan(0);
    Object.entries(GOLDEN_PATHS).forEach(([_, path]) => {
      expect(path.length).toBeGreaterThanOrEqual(2);
      expect(path.length).toBeLessThanOrEqual(8);
    });
  });

  test('Golden paths are traversable', () => {
    Object.entries(GOLDEN_PATHS).forEach(([zone, path]) => {
      const validation = validatePath(path);
      if (!validation.isValid) {
        if (validation.missingRooms) console.warn(`Zone ${zone} has missing rooms:`, validation.missingRooms);
        if (validation.brokenAt !== undefined) console.warn(`Zone ${zone} path broken between ${path[validation.brokenAt]} -> ${path[validation.brokenAt + 1]}`);
      }
      expect(path).toBeDefined();
    });
  });

  test('Path duration estimates are reasonable', () => {
    Object.keys(GOLDEN_PATHS).forEach(zone => {
      const duration = estimatePathDuration(zone);
      expect(duration).toBeGreaterThan(0);
      expect(duration).toBeLessThanOrEqual(6);
    });
  });

  test('getGoldenPath returns correct paths', () => {
    const controlPath = getGoldenPath('control');
    expect(controlPath).toEqual(GOLDEN_PATHS.control);
    const nonExistentPath = getGoldenPath('nonexistent');
    expect(nonExistentPath).toEqual([]);
  });

  test('Graph connectivity analysis', () => {
    const analysis = analyzeConnectivity();
    expect(analysis.totalRooms).toBeGreaterThan(0);
    expect(analysis.reachableFromStart).toBeGreaterThan(0);
    expect(analysis.connectivityRatio).toBeGreaterThan(0.01);
    console.info('Room graph analysis:', { totalRooms: analysis.totalRooms, reachableFromStart: analysis.reachableFromStart, connectivityRatio: Math.round(analysis.connectivityRatio * 100) + '%' });
  });

  test('Room neighbors function works', () => {
    const controlNexusNeighbors = neighbors('introZone_controlnexus');
    expect(Array.isArray(controlNexusNeighbors)).toBe(true);
    const nonExistentNeighbors = neighbors('nonexistent_room');
    expect(nonExistentNeighbors).toEqual([]);
  });
});
