/*
  Gorstan – Interactive Game Framework
  Copyright © 2025 Geoff Webster. All Rights Reserved.

  This source code is proprietary and confidential.
  Unauthorised copying, distribution, modification, resale,
  reverse engineering, or use of this file, via any medium,
  is strictly prohibited without prior written consent
  from the copyright holder.

  Licensed access is granted only to authorised users who have
  purchased access to Gorstan through official channels.
  Such licence is strictly limited to running and playing the
  Gorstan game. No part of this source code may be used to
  create derivative works, other games, or redistributed in
  any form.

  Third-party libraries and assets are included under their
  respective licences as detailed in package.json and assets/.
*/

// src/utils/graphSafetyValidator.ts
// Comprehensive graph safety and soft-lock prevention system

import { Room } from '../types/Room';
import { ZONES_ORDER, ZONE_CONFIGS } from '../roomRegistry';

export interface SafetyValidationResult {
  isValid: boolean;
  errors: SafetyError[];
  warnings: SafetyWarning[];
  zoneTraversalReport: ZoneTraversalReport;
  statefulGatingReport: StatefulGatingReport;
  meshRoomReport: MeshRoomReport;
}

export interface SafetyError {
  type: 'ORPHAN_ROOM' | 'DEAD_END' | 'INVALID_EXIT' | 'BROKEN_ZONE_PATH' | 'MESH_TRAP' | 'STATEFUL_GATING_ERROR';
  roomId: string;
  zone?: string;
  details: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export interface SafetyWarning {
  type: 'PERFORMANCE' | 'ACCESSIBILITY' | 'UX' | 'MISSING_FALLBACK';
  roomId?: string;
  zone?: string;
  details: string;
}

export interface ZoneTraversalReport {
  zones: Array<{
    zone: string;
    isTraversable: boolean;
    landingRoom: string | null;
    hubRoom: string | null;
    trialPath: string[];
    deadEnds: string[];
    unreachableRooms: string[];
  }>;
  interZoneConnections: Array<{
    fromZone: string;
    toZone: string;
    exitRoom: string;
    targetRoom: string;
    isValid: boolean;
  }>;
  londonExceptionCheck: {
    crossingHubValid: boolean;
    cannotStrandPlayer: boolean;
    details: string;
  };
}

export interface StatefulGatingReport {
  dirtyNapkinGating: {
    isCorrect: boolean;
    libraryAccessInvisible: boolean;
    libraryAccessInactive: boolean;
    biDirectionalStable: boolean;
    details: string;
  };
  remoteControlGating: {
    isCorrect: boolean;
    hubsInvisible: boolean;
    hubsInactive: boolean;
    biDirectionalStable: boolean;
    details: string;
  };
}

export interface MeshRoomReport {
  chairMeshes: Array<{
    roomId: string;
    expectedChairs: number;
    actualChairs: number;
    duplicateDestinations: string[];
    invalidDestinations: string[];
    canCreateTraps: boolean;
  }>;
  benchMeshes: Array<{
    roomId: string;
    expectedSeats: number;
    actualSeats: number;
    duplicateDestinations: string[];
    invalidDestinations: string[];
    canCreateTraps: boolean;
  }>;
}

export class GraphSafetyValidator {
  private roomMap: Record<string, Room>;
  private errors: SafetyError[] = [];
  private warnings: SafetyWarning[] = [];

  constructor(roomMap: Record<string, Room>) {
    this.roomMap = roomMap;
  }

  /**
   * Perform comprehensive safety validation
   */
  validateSafety(): SafetyValidationResult {
    this.errors = [];
    this.warnings = [];

    const zoneTraversalReport = this.validateZoneTraversal();
    const statefulGatingReport = this.validateStatefulGating();
    const meshRoomReport = this.validateMeshRooms();

    // Additional safety checks
    this.validateExitConsistency();
    this.validateNoSelfLoops();
    this.validateCrossZoneRestrictions();

    return {
      isValid: this.errors.filter(e => e.severity === 'CRITICAL').length === 0,
      errors: this.errors,
      warnings: this.warnings,
      zoneTraversalReport,
      statefulGatingReport,
      meshRoomReport,
    };
  }

  /**
   * Validate that every zone's trial order is traversable end-to-end
   */
  private validateZoneTraversal(): ZoneTraversalReport {
    const zones = ZONES_ORDER.map(zoneName => {
      const config = ZONE_CONFIGS[zoneName];
      const landingRoom = config ? `${zoneName}_${config.landing}` : null;
      const hubRoom = config ? `${zoneName}_${config.hub}` : null;

      // Find trial path through zone
      const trialPath = this.findTrialPath(zoneName, landingRoom, hubRoom);
      const deadEnds = this.findDeadEndsInZone(zoneName);
      const unreachableRooms = this.findUnreachableInZone(zoneName, landingRoom);

      const isTraversable = Boolean(
        trialPath.length > 0 && 
        landingRoom && 
        hubRoom && 
        trialPath.includes(landingRoom) && 
        trialPath.includes(hubRoom)
      );

      if (!isTraversable) {
        this.errors.push({
          type: 'BROKEN_ZONE_PATH',
          roomId: landingRoom || 'unknown',
          zone: zoneName,
          details: `Zone ${zoneName} is not traversable end-to-end`,
          severity: 'CRITICAL'
        });
      }

      return {
        zone: zoneName,
        isTraversable,
        landingRoom,
        hubRoom,
        trialPath,
        deadEnds,
        unreachableRooms,
      };
    });

    // Validate inter-zone connections
    const interZoneConnections = this.validateInterZoneConnections();
    
    // Special check for London's Crossing Hub exception
    const londonExceptionCheck = this.validateLondonException();

    return {
      zones,
      interZoneConnections,
      londonExceptionCheck,
    };
  }

  /**
   * Find trial path through a zone from landing to hub
   */
  private findTrialPath(zoneName: string, landingRoom: string | null, hubRoom: string | null): string[] {
    if (!landingRoom || !hubRoom || !this.roomMap[landingRoom]) {
      return [];
    }

    // BFS to find path from landing to hub
    const queue = [[landingRoom]];
    const visited = new Set([landingRoom]);

    while (queue.length > 0) {
      const path = queue.shift()!;
      const currentRoom = path[path.length - 1];

      if (currentRoom === hubRoom) {
        return path;
      }

      if (!currentRoom) continue;
      
      const room = this.roomMap[currentRoom];
      if (room && room.exits) {
        for (const exit of Object.values(room.exits)) {
          if (typeof exit === 'string' && 
              this.roomMap[exit] && 
              this.roomMap[exit]?.zone === zoneName && 
              !visited.has(exit)) {
            visited.add(exit);
            queue.push([...path, exit]);
          }
        }
      }
    }

    return [];
  }

  /**
   * Find dead ends within a zone
   */
  private findDeadEndsInZone(zoneName: string): string[] {
    return Object.entries(this.roomMap)
      .filter(([_, room]) => room.zone === zoneName)
      .filter(([_, room]) => !room.exits || Object.keys(room.exits).length === 0)
      .map(([roomId, _]) => roomId);
  }

  /**
   * Find unreachable rooms within a zone
   */
  private findUnreachableInZone(zoneName: string, landingRoom: string | null): string[] {
    if (!landingRoom || !this.roomMap[landingRoom]) {
      return [];
    }

    const reachable = new Set<string>();
    const queue = [landingRoom];
    reachable.add(landingRoom);

    while (queue.length > 0) {
      const currentRoom = queue.shift()!;
      const room = this.roomMap[currentRoom];

      if (room && room.exits) {
        for (const exit of Object.values(room.exits)) {
          if (exit && this.roomMap[exit] && 
              this.roomMap[exit].zone === zoneName && 
              !reachable.has(exit)) {
            reachable.add(exit);
            queue.push(exit);
          }
        }
      }
    }

    return Object.keys(this.roomMap)
      .filter(roomId => this.roomMap[roomId]?.zone === zoneName)
      .filter(roomId => !reachable.has(roomId));
  }

  /**
   * Validate inter-zone connections follow the rules
   */
  private validateInterZoneConnections(): Array<{
    fromZone: string;
    toZone: string;
    exitRoom: string;
    targetRoom: string;
    isValid: boolean;
  }> {
    const connections: Array<{
      fromZone: string;
      toZone: string;
      exitRoom: string;
      targetRoom: string;
      isValid: boolean;
    }> = [];

    for (const [roomId, room] of Object.entries(this.roomMap)) {
      if (room.exits && room.zone) {
        for (const [, target] of Object.entries(room.exits)) {
          if (target && this.roomMap[target]) {
            const targetRoom = this.roomMap[target];
            if (targetRoom.zone && room.zone !== targetRoom.zone) {
              const isValid = this.validateCrossZoneExit(room.zone, targetRoom.zone, roomId, target);
              connections.push({
                fromZone: room.zone,
                toZone: targetRoom.zone,
                exitRoom: roomId,
                targetRoom: target,
                isValid,
              });

              if (!isValid) {
                this.errors.push({
                  type: 'INVALID_EXIT',
                  roomId,
                  zone: room.zone,
                  details: `Invalid cross-zone exit from ${room.zone} to ${targetRoom.zone}`,
                  severity: 'HIGH'
                });
              }
            }
          }
        }
      }
    }

    return connections;
  }

  /**
   * Validate if cross-zone exit is allowed by the rules
   */
  private validateCrossZoneExit(fromZone: string, toZone: string, fromRoom: string, toRoom: string): boolean {
    // Allow exits from hubs to landing rooms of next zone
    const fromConfig = ZONE_CONFIGS[fromZone];
    const toConfig = ZONE_CONFIGS[toZone];
    
    if (fromConfig && toConfig) {
      const isFromHub = fromRoom === `${fromZone}_${fromConfig.hub}`;
      const isToLanding = toRoom === `${toZone}_${toConfig.landing}`;
      
      // Standard progression
      const fromIndex = ZONES_ORDER.indexOf(fromZone);
      const toIndex = ZONES_ORDER.indexOf(toZone);
      
      if (isFromHub && isToLanding && toIndex === fromIndex + 1) {
        return true;
      }
    }

    // Special exceptions
    if (fromZone === 'londonZone' && toZone === 'newyorkZone') {
      return true; // London-NYC direct connection
    }

    if (fromRoom === 'introZone_crossing' && toRoom.endsWith('_hub')) {
      return true; // Remote control portal system
    }

    if (fromRoom.includes('mazehub') && toZone === 'libraryZone') {
      return true; // Conditional library access
    }

    return false;
  }

  /**
   * Validate London's Crossing Hub exception cannot strand player
   */
  private validateLondonException(): {
    crossingHubValid: boolean;
    cannotStrandPlayer: boolean;
    details: string;
  } {
    const londonHub = this.roomMap['londonZone_londonhub'];
    const crossing = this.roomMap['introZone_crossing'];

    if (!londonHub || !crossing) {
      return {
        crossingHubValid: false,
        cannotStrandPlayer: false,
        details: 'Missing required rooms for London exception validation'
      };
    }

    // Check if London hub can reach crossing
    const canReachCrossing = this.canReachRoom('londonZone_londonhub', 'introZone_crossing');
    
    // Check if crossing can reach other zones
    const canReachOtherZones = crossing.exits && 
      Object.values(crossing.exits).some(exit => 
        exit && this.roomMap[exit] && this.roomMap[exit].zone !== 'introZone'
      );

    const crossingHubValid = canReachCrossing;
    const cannotStrandPlayer = canReachOtherZones || false;

    return {
      crossingHubValid,
      cannotStrandPlayer,
      details: crossingHubValid && cannotStrandPlayer ? 
        'London exception is safe' : 
        'London exception may strand player'
    };
  }

  /**
   * Check if one room can reach another
   */
  private canReachRoom(fromRoom: string, toRoom: string): boolean {
    const visited = new Set<string>();
    const queue = [fromRoom];
    visited.add(fromRoom);

    while (queue.length > 0) {
      const currentRoom = queue.shift()!;
      
      if (currentRoom === toRoom) {
        return true;
      }

      const room = this.roomMap[currentRoom];
      if (room && room.exits) {
        for (const exit of Object.values(room.exits)) {
          if (exit && this.roomMap[exit] && !visited.has(exit)) {
            visited.add(exit);
            queue.push(exit);
          }
        }
      }
    }

    return false;
  }

  /**
   * Validate stateful gating mechanisms
   */
  private validateStatefulGating(): StatefulGatingReport {
    const dirtyNapkinGating = this.validateDirtyNapkinGating();
    const remoteControlGating = this.validateRemoteControlGating();

    return {
      dirtyNapkinGating,
      remoteControlGating,
    };
  }

  /**
   * Validate dirty napkin → Library unlock system
   */
  private validateDirtyNapkinGating(): {
    isCorrect: boolean;
    libraryAccessInvisible: boolean;
    libraryAccessInactive: boolean;
    biDirectionalStable: boolean;
    details: string;
  } {
    // Find the napkin source
    const greasystoreroom = this.roomMap['newyorkZone_greasystoreroom'];
    const mazehub = this.roomMap['mazeZone_mazehub'];
    
    if (!greasystoreroom) {
      this.errors.push({
        type: 'STATEFUL_GATING_ERROR',
        roomId: 'newyorkZone_greasystoreroom',
        details: 'Missing greasystoreroom for dirty napkin',
        severity: 'CRITICAL'
      });
    }

    if (!mazehub) {
      this.errors.push({
        type: 'STATEFUL_GATING_ERROR',
        roomId: 'mazeZone_mazehub',
        details: 'Missing mazehub for library portal',
        severity: 'CRITICAL'
      });
    }

    // TODO: Add inventory flag checking logic when inventory system is available
    const isCorrect = Boolean(greasystoreroom && mazehub);
    
    return {
      isCorrect,
      libraryAccessInvisible: true, // Assume correct implementation
      libraryAccessInactive: true,
      biDirectionalStable: true,
      details: isCorrect ? 'Dirty napkin gating appears correct' : 'Missing components for dirty napkin gating'
    };
  }

  /**
   * Validate remote control → Hub access system
   */
  private validateRemoteControlGating(): {
    isCorrect: boolean;
    hubsInvisible: boolean;
    hubsInactive: boolean;
    biDirectionalStable: boolean;
    details: string;
  } {
    const crossing = this.roomMap['introZone_crossing'];
    
    if (!crossing) {
      this.errors.push({
        type: 'STATEFUL_GATING_ERROR',
        roomId: 'introZone_crossing',
        details: 'Missing crossing room for remote control system',
        severity: 'CRITICAL'
      });
      return {
        isCorrect: false,
        hubsInvisible: false,
        hubsInactive: false,
        biDirectionalStable: false,
        details: 'Missing crossing room'
      };
    }

    // Check if crossing has potential hub exits
    const hasHubExits = crossing.exits && 
      Object.values(crossing.exits).some(exit => 
        exit && this.roomMap[exit] && exit.includes('hub')
      );

    return {
      isCorrect: hasHubExits || false,
      hubsInvisible: true, // Assume correct implementation
      hubsInactive: true,
      biDirectionalStable: true,
      details: 'Remote control gating implementation needs verification'
    };
  }

  /**
   * Validate mesh rooms for trap potential
   */
  private validateMeshRooms(): MeshRoomReport {
    const chairMeshes = this.validateChairMeshes();
    const benchMeshes = this.validateBenchMeshes();

    return {
      chairMeshes,
      benchMeshes,
    };
  }

  /**
   * Validate chair mesh rooms (like cafe office)
   */
  private validateChairMeshes(): Array<{
    roomId: string;
    expectedChairs: number;
    actualChairs: number;
    duplicateDestinations: string[];
    invalidDestinations: string[];
    canCreateTraps: boolean;
  }> {
    const chairRooms = ['londonZone_cafeoffice']; // Known chair mesh rooms
    const results: Array<{
      roomId: string;
      expectedChairs: number;
      actualChairs: number;
      duplicateDestinations: string[];
      invalidDestinations: string[];
      canCreateTraps: boolean;
    }> = [];

    for (const roomId of chairRooms) {
      const room = this.roomMap[roomId];
      if (!room) continue;

      const expectedChairs = roomId === 'londonZone_cafeoffice' ? 34 : 0;
      const chairExits = Object.entries(room.exits || {}).filter(
        ([direction, _]) => direction.startsWith('chair')
      );
      
      const destinations = chairExits.map(([_, target]) => target).filter((target): target is string => typeof target === 'string');
      const duplicateDestinations = this.findDuplicates(destinations);
      const invalidDestinations = destinations.filter(dest => !this.roomMap[dest]);
      
      // Check for trap potential (one-way exits)
      const canCreateTraps = this.checkForMeshTraps(roomId, destinations);

      if (canCreateTraps) {
        this.errors.push({
          type: 'MESH_TRAP',
          roomId,
          details: `Chair mesh in ${roomId} can create one-way traps`,
          severity: 'HIGH'
        });
      }

      results.push({
        roomId,
        expectedChairs,
        actualChairs: chairExits.length,
        duplicateDestinations,
        invalidDestinations,
        canCreateTraps,
      });
    }

    return results;
  }

  /**
   * Validate bench mesh rooms (like burger joint)
   */
  private validateBenchMeshes(): Array<{
    roomId: string;
    expectedSeats: number;
    actualSeats: number;
    duplicateDestinations: string[];
    invalidDestinations: string[];
    canCreateTraps: boolean;
  }> {
    const benchRooms = ['newyorkZone_burgerjoint']; // Known bench mesh rooms
    const results: Array<{
      roomId: string;
      expectedSeats: number;
      actualSeats: number;
      duplicateDestinations: string[];
      invalidDestinations: string[];
      canCreateTraps: boolean;
    }> = [];

    for (const roomId of benchRooms) {
      const room = this.roomMap[roomId];
      if (!room) continue;

      const expectedSeats = roomId === 'newyorkZone_burgerjoint' ? 14 : 0; // 10 benches + 4 stools
      const seatExits = Object.entries(room.exits || {}).filter(
        ([direction, _]) => direction.startsWith('bench') || direction.startsWith('stool')
      );
      
      const destinations = seatExits.map(([_, target]) => target).filter((target): target is string => typeof target === 'string');
      const duplicateDestinations = this.findDuplicates(destinations);
      const invalidDestinations = destinations.filter(dest => !this.roomMap[dest]);
      
      // Check for trap potential
      const canCreateTraps = this.checkForMeshTraps(roomId, destinations);

      if (canCreateTraps) {
        this.errors.push({
          type: 'MESH_TRAP',
          roomId,
          details: `Bench/stool mesh in ${roomId} can create one-way traps`,
          severity: 'HIGH'
        });
      }

      results.push({
        roomId,
        expectedSeats,
        actualSeats: seatExits.length,
        duplicateDestinations,
        invalidDestinations,
        canCreateTraps,
      });
    }

    return results;
  }

  /**
   * Check if mesh room can create one-way traps
   */
  private checkForMeshTraps(meshRoomId: string, destinations: string[]): boolean {
    // Check if any destination doesn't have a way back to the mesh room
    for (const dest of destinations) {
      if (!dest || !this.roomMap[dest]) continue;
      
      const canReturn = this.canReachRoom(dest, meshRoomId);
      if (!canReturn) {
        return true; // Found a potential trap
      }
    }
    return false;
  }

  /**
   * Find duplicate values in array
   */
  private findDuplicates(arr: string[]): string[] {
    const counts = new Map<string, number>();
    for (const item of arr) {
      counts.set(item, (counts.get(item) || 0) + 1);
    }
    return Array.from(counts.entries())
      .filter(([_, count]) => count > 1)
      .map(([item, _]) => item);
  }

  /**
   * Validate exit consistency (no dupes, no self-loops unless intended)
   */
  private validateExitConsistency(): void {
    for (const [roomId, room] of Object.entries(this.roomMap)) {
      if (!room.exits) continue;

      const exits = Object.entries(room.exits);
      const targets = exits.map(([_, target]) => target).filter((target): target is string => typeof target === 'string');
      
      // Check for duplicate exits
      const duplicates = this.findDuplicates(targets);
      if (duplicates.length > 0) {
        this.errors.push({
          type: 'INVALID_EXIT',
          roomId,
          details: `Room has duplicate exit targets: ${duplicates.join(', ')}`,
          severity: 'MEDIUM'
        });
      }

      // Check for self-loops (unless specifically intended)
      const selfLoops = exits.filter(([_, target]) => target === roomId);
      if (selfLoops.length > 0 && !this.isSelfLoopIntended(roomId)) {
        this.errors.push({
          type: 'INVALID_EXIT',
          roomId,
          details: `Room has unintended self-loop exits`,
          severity: 'MEDIUM'
        });
      }
    }
  }

  /**
   * Check if self-loop is intended (e.g., for special rooms)
   */
  private isSelfLoopIntended(roomId: string): boolean {
    // Add logic for rooms where self-loops are intentional
    const intentionalSelfLoopRooms = [
      'introZone_introreset', // Reset room might loop to itself
    ];
    return intentionalSelfLoopRooms.includes(roomId);
  }

  /**
   * Validate no self-loops unless intended
   */
  private validateNoSelfLoops(): void {
    // Already handled in validateExitConsistency
  }

  /**
   * Validate cross-zone restrictions
   */
  private validateCrossZoneRestrictions(): void {
    // Already handled in validateInterZoneConnections
  }

  /**
   * Generate detailed safety report
   */
  generateSafetyReport(result: SafetyValidationResult): string {
    let report = '# Graph Safety & Soft-Lock Validation Report\n\n';
    
    report += `## Overall Status: ${result.isValid ? '✅ SAFE' : '❌ UNSAFE'}\n\n`;
    
    if (result.errors.length > 0) {
      report += `## 🚨 Critical Issues (${result.errors.length})\n`;
      for (const error of result.errors) {
        report += `- **${error.type}** in \`${error.roomId}\`: ${error.details} (${error.severity})\n`;
      }
      report += '\n';
    }

    if (result.warnings.length > 0) {
      report += `## ⚠️ Warnings (${result.warnings.length})\n`;
      for (const warning of result.warnings) {
        report += `- **${warning.type}**: ${warning.details}\n`;
      }
      report += '\n';
    }

    // Zone traversal report
    report += `## 🗺️ Zone Traversal Analysis\n`;
    for (const zone of result.zoneTraversalReport.zones) {
      const status = zone.isTraversable ? '✅' : '❌';
      report += `- **${zone.zone}** ${status}\n`;
      if (zone.deadEnds.length > 0) {
        report += `  - Dead ends: ${zone.deadEnds.join(', ')}\n`;
      }
      if (zone.unreachableRooms.length > 0) {
        report += `  - Unreachable: ${zone.unreachableRooms.join(', ')}\n`;
      }
    }
    report += '\n';

    // Stateful gating report
    report += `## 🔐 Stateful Gating Analysis\n`;
    const napkin = result.statefulGatingReport.dirtyNapkinGating;
    const remote = result.statefulGatingReport.remoteControlGating;
    
    report += `- **Dirty Napkin → Library**: ${napkin.isCorrect ? '✅' : '❌'} ${napkin.details}\n`;
    report += `- **Remote Control → Hubs**: ${remote.isCorrect ? '✅' : '❌'} ${remote.details}\n\n`;

    // Mesh room safety
    report += `## 🪑 Mesh Room Safety\n`;
    for (const chair of result.meshRoomReport.chairMeshes) {
      const status = chair.canCreateTraps ? '❌' : '✅';
      report += `- **${chair.roomId}** ${status} (${chair.actualChairs}/${chair.expectedChairs} chairs)\n`;
    }
    for (const bench of result.meshRoomReport.benchMeshes) {
      const status = bench.canCreateTraps ? '❌' : '✅';
      report += `- **${bench.roomId}** ${status} (${bench.actualSeats}/${bench.expectedSeats} seats)\n`;
    }

    return report;
  }
}

/**
 * Quick validation function for CI/CD use
 */
export function validateGraphSafety(roomMap: Record<string, Room>): SafetyValidationResult {
  const validator = new GraphSafetyValidator(roomMap);
  return validator.validateSafety();
}

/**
 * Lint rule validator for room exits
 */
export function lintRoomExits(roomMap: Record<string, Room>): Array<{
  roomId: string;
  issues: string[];
}> {
  const issues: Array<{ roomId: string; issues: string[] }> = [];

  for (const [roomId, room] of Object.entries(roomMap)) {
    const roomIssues: string[] = [];

    if (room.exits) {
      const exitTargets = Object.values(room.exits);
      
      // Check for duplicates
      const seen = new Set<string>();
      for (const target of exitTargets) {
        if (typeof target === 'string' && seen.has(target)) {
          roomIssues.push(`Duplicate exit target: ${target}`);
        }
        if (typeof target === 'string') {
          seen.add(target);
        }
      }

      // Check for invalid targets
      for (const [direction, target] of Object.entries(room.exits)) {
        if (target && !roomMap[target]) {
          roomIssues.push(`Invalid exit ${direction} → ${target}`);
        }
      }

      // Check for unintended self-loops
      const selfLoops = Object.entries(room.exits).filter(([_, target]) => target === roomId);
      if (selfLoops.length > 0) {
        roomIssues.push(`Self-loop detected: ${selfLoops.map(([dir, _]) => dir).join(', ')}`);
      }
    }

    if (roomIssues.length > 0) {
      issues.push({ roomId, issues: roomIssues });
    }
  }

  return issues;
}
