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

// src/utils/roomExitLinter.ts
// ESLint-style rules for room exit validation

import { Room } from '../types/Room';
import { ZONES_ORDER, ZONE_CONFIGS } from '../roomRegistry';

export interface LintRule {
  name: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  check: (room: Room, roomMap: Record<string, Room>) => LintViolation[];
}

export interface LintViolation {
  rule: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  roomId: string;
  exitDirection?: string;
  target?: string;
}

export interface LintConfig {
  rules: Record<string, 'error' | 'warning' | 'info' | 'off'>;
  allowSelfLoops: string[]; // Room IDs where self-loops are intentional
  allowedCrossZoneExits: Array<{
    fromZone: string;
    toZone: string;
    description?: string;
  }>;
  meshRoomConfig: Record<string, {
    exitPattern: RegExp;
    expectedCount: number;
    allowDuplicates: boolean;
  }>;
}

export const DEFAULT_LINT_CONFIG: LintConfig = {
  rules: {
    'no-duplicate-exits': 'error',
    'no-invalid-targets': 'error',
    'no-unintended-self-loops': 'warning',
    'no-unauthorized-cross-zone': 'error',
    'mesh-room-consistency': 'error',
    'hub-room-connectivity': 'warning',
    'landing-room-accessibility': 'error',
    'exit-direction-naming': 'warning',
    'zone-progression-order': 'error'
  },
  allowSelfLoops: [
    'introZone_introreset', // Reset room intentionally loops
    'gorstanZone_torridoninn' // Inn might have "stay" option
  ],
  allowedCrossZoneExits: [
    { fromZone: 'introZone', toZone: '*', description: 'Crossing hub can access all zones' },
    { fromZone: 'londonZone', toZone: 'newyorkZone', description: 'London-NYC direct connection' },
    { fromZone: 'mazeZone', toZone: 'libraryZone', description: 'Conditional library access' }
  ],
  meshRoomConfig: {
    'londonZone_cafeoffice': {
      exitPattern: /^chair\d{2}$/,
      expectedCount: 34,
      allowDuplicates: false
    },
    'newyorkZone_burgerjoint': {
      exitPattern: /^(bench|stool)\d{2}$/,
      expectedCount: 14,
      allowDuplicates: false
    }
  }
};

export class RoomExitLinter {
  private config: LintConfig;
  private rules: LintRule[];

  constructor(config: LintConfig = DEFAULT_LINT_CONFIG) {
    this.config = config;
    this.rules = this.initializeRules();
  }

  /**
   * Lint all rooms in the room map
   */
  lintRooms(roomMap: Record<string, Room>): LintViolation[] {
    const violations: LintViolation[] = [];

    for (const [, room] of Object.entries(roomMap)) {
      const roomViolations = this.lintRoom(room, roomMap);
      violations.push(...roomViolations);
    }

    return violations;
  }

  /**
   * Lint a single room
   */
  lintRoom(room: Room, roomMap: Record<string, Room>): LintViolation[] {
    const violations: LintViolation[] = [];

    for (const rule of this.rules) {
      const ruleSeverity = this.config.rules[rule.name];
      if (ruleSeverity === 'off') continue;

      const ruleViolations = rule.check(room, roomMap);
      
      // Override severity based on config
      for (const violation of ruleViolations) {
        violation.severity = ruleSeverity || violation.severity;
        violations.push(violation);
      }
    }

    return violations;
  }

  /**
   * Initialize all lint rules
   */
  private initializeRules(): LintRule[] {
    return [
      this.noDuplicateExitsRule(),
      this.noInvalidTargetsRule(),
      this.noUnintendedSelfLoopsRule(),
      this.noUnauthorizedCrossZoneRule(),
      this.meshRoomConsistencyRule(),
      this.hubRoomConnectivityRule(),
      this.landingRoomAccessibilityRule(),
      this.exitDirectionNamingRule(),
      this.zoneProgressionOrderRule()
    ];
  }

  /**
   * Rule: No duplicate exit targets
   */
  private noDuplicateExitsRule(): LintRule {
    return {
      name: 'no-duplicate-exits',
      description: 'Exits should not point to the same target room',
      severity: 'error',
      check: (room: Room) => {
        const violations: LintViolation[] = [];
        
        if (!room.exits) return violations;

        const exitTargets = Object.values(room.exits);
        const targetCounts = new Map<string, number>();

        for (const target of exitTargets) {
          if (target) {
            targetCounts.set(target, (targetCounts.get(target) || 0) + 1);
          }
        }

        for (const [target, count] of targetCounts) {
          if (count > 1) {
            // Check if duplicates are allowed for this room (mesh rooms)
            const meshConfig = this.config.meshRoomConfig[room.id];
            if (meshConfig && meshConfig.allowDuplicates) {
              continue;
            }

            violations.push({
              rule: 'no-duplicate-exits',
              message: `Room has ${count} exits pointing to ${target}`,
              severity: 'error',
              roomId: room.id,
              target
            });
          }
        }

        return violations;
      }
    };
  }

  /**
   * Rule: No exits to non-existent rooms
   */
  private noInvalidTargetsRule(): LintRule {
    return {
      name: 'no-invalid-targets',
      description: 'All exit targets must point to valid rooms',
      severity: 'error',
      check: (room: Room, roomMap: Record<string, Room>) => {
        const violations: LintViolation[] = [];
        
        if (!room.exits) return violations;

        for (const [direction, target] of Object.entries(room.exits)) {
          if (target && !roomMap[target]) {
            violations.push({
              rule: 'no-invalid-targets',
              message: `Exit ${direction} points to non-existent room: ${target}`,
              severity: 'error',
              roomId: room.id,
              exitDirection: direction,
              target
            });
          }
        }

        return violations;
      }
    };
  }

  /**
   * Rule: No unintended self-loops
   */
  private noUnintendedSelfLoopsRule(): LintRule {
    return {
      name: 'no-unintended-self-loops',
      description: 'Self-loops should only be used when intentional',
      severity: 'warning',
      check: (room: Room) => {
        const violations: LintViolation[] = [];
        
        if (!room.exits) return violations;

        // Check if self-loops are allowed for this room
        if (this.config.allowSelfLoops.includes(room.id)) {
          return violations;
        }

        for (const [direction, target] of Object.entries(room.exits)) {
          if (target === room.id) {
            violations.push({
              rule: 'no-unintended-self-loops',
              message: `Self-loop detected on exit ${direction}`,
              severity: 'warning',
              roomId: room.id,
              exitDirection: direction,
              target
            });
          }
        }

        return violations;
      }
    };
  }

  /**
   * Rule: No unauthorized cross-zone exits
   */
  private noUnauthorizedCrossZoneRule(): LintRule {
    return {
      name: 'no-unauthorized-cross-zone',
      description: 'Cross-zone exits must follow zone progression rules',
      severity: 'error',
      check: (room: Room, roomMap: Record<string, Room>) => {
        const violations: LintViolation[] = [];
        
        if (!room.exits) return violations;

        for (const [direction, target] of Object.entries(room.exits)) {
          if (!target || !roomMap[target]) continue;

          const targetRoom = roomMap[target];
          if (room.zone === targetRoom.zone) continue; // Same zone is fine

          // Check if this cross-zone exit is authorized
          const isAuthorized = this.config.allowedCrossZoneExits.some(allowed => {
            return (allowed.fromZone === room.zone || allowed.fromZone === '*') &&
                   (allowed.toZone === targetRoom.zone || allowed.toZone === '*');
          });

          if (!isAuthorized) {
            violations.push({
              rule: 'no-unauthorized-cross-zone',
              message: `Unauthorized cross-zone exit from ${room.zone} to ${targetRoom.zone}`,
              severity: 'error',
              roomId: room.id,
              exitDirection: direction,
              target
            });
          }
        }

        return violations;
      }
    };
  }

  /**
   * Rule: Mesh room consistency
   */
  private meshRoomConsistencyRule(): LintRule {
    return {
      name: 'mesh-room-consistency',
      description: 'Mesh rooms must have correct number and format of exits',
      severity: 'error',
      check: (room: Room) => {
        const violations: LintViolation[] = [];
        
        const meshConfig = this.config.meshRoomConfig[room.id];
        if (!meshConfig) return violations; // Not a mesh room

        if (!room.exits) {
          violations.push({
            rule: 'mesh-room-consistency',
            message: 'Mesh room has no exits defined',
            severity: 'error',
            roomId: room.id
          });
          return violations;
        }

        // Check exit pattern and count
        const meshExits = Object.entries(room.exits).filter(([direction, _]) => 
          meshConfig.exitPattern.test(direction)
        );

        if (meshExits.length !== meshConfig.expectedCount) {
          violations.push({
            rule: 'mesh-room-consistency',
            message: `Mesh room has ${meshExits.length} exits, expected ${meshConfig.expectedCount}`,
            severity: 'error',
            roomId: room.id
          });
        }

        // Check for proper naming
        for (const [direction] of meshExits) {
          if (!meshConfig.exitPattern.test(direction)) {
            violations.push({
              rule: 'mesh-room-consistency',
              message: `Mesh exit ${direction} doesn't match expected pattern`,
              severity: 'error',
              roomId: room.id,
              exitDirection: direction
            });
          }
        }

        return violations;
      }
    };
  }

  /**
   * Rule: Hub rooms should be well-connected
   */
  private hubRoomConnectivityRule(): LintRule {
    return {
      name: 'hub-room-connectivity',
      description: 'Hub rooms should have multiple connections',
      severity: 'warning',
      check: (room: Room) => {
        const violations: LintViolation[] = [];
        
        // Check if this is a hub room
        const isHub = Object.values(ZONE_CONFIGS).some(config => 
          `${room.zone}_${config.hub}` === room.id
        );

        if (!isHub) return violations;

        const exitCount = room.exits ? Object.keys(room.exits).length : 0;
        
        if (exitCount < 2) {
          violations.push({
            rule: 'hub-room-connectivity',
            message: `Hub room has only ${exitCount} exits, consider adding more connections`,
            severity: 'warning',
            roomId: room.id
          });
        }

        return violations;
      }
    };
  }

  /**
   * Rule: Landing rooms should be accessible
   */
  private landingRoomAccessibilityRule(): LintRule {
    return {
      name: 'landing-room-accessibility',
      description: 'Landing rooms should have incoming connections',
      severity: 'error',
      check: (room: Room, roomMap: Record<string, Room>) => {
        const violations: LintViolation[] = [];
        
        // Check if this is a landing room
        const isLanding = Object.values(ZONE_CONFIGS).some(config => 
          `${room.zone}_${config.landing}` === room.id
        );

        if (!isLanding) return violations;

        // Check for incoming connections
        const hasIncoming = Object.values(roomMap).some(otherRoom => 
          otherRoom.exits && Object.values(otherRoom.exits).includes(room.id)
        );

        if (!hasIncoming && room.id !== 'introZone_introstart') { // Allow introstart to have no incoming
          violations.push({
            rule: 'landing-room-accessibility',
            message: 'Landing room has no incoming connections',
            severity: 'error',
            roomId: room.id
          });
        }

        return violations;
      }
    };
  }

  /**
   * Rule: Exit direction naming conventions
   */
  private exitDirectionNamingRule(): LintRule {
    return {
      name: 'exit-direction-naming',
      description: 'Exit directions should follow naming conventions',
      severity: 'warning',
      check: (room: Room) => {
        const violations: LintViolation[] = [];
        
        if (!room.exits) return violations;

        const validDirections = [
          'north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest',
          'up', 'down', 'in', 'out', 'enter', 'exit', 'portal', 'teleport'
        ];

        const specialPrefixes = ['chair', 'bench', 'stool', 'door', 'gate', 'passage'];

        for (const direction of Object.keys(room.exits)) {
          const isValidDirection = validDirections.includes(direction);
          const hasValidPrefix = specialPrefixes.some(prefix => direction.startsWith(prefix));
          
          if (!isValidDirection && !hasValidPrefix) {
            violations.push({
              rule: 'exit-direction-naming',
              message: `Exit direction '${direction}' doesn't follow naming conventions`,
              severity: 'warning',
              roomId: room.id,
              exitDirection: direction
            });
          }
        }

        return violations;
      }
    };
  }

  /**
   * Rule: Zone progression should follow ZONES_ORDER
   */
  private zoneProgressionOrderRule(): LintRule {
    return {
      name: 'zone-progression-order',
      description: 'Inter-zone exits should follow zone progression order',
      severity: 'error',
      check: (room: Room, roomMap: Record<string, Room>) => {
        const violations: LintViolation[] = [];
        
        if (!room.exits || !room.zone) return violations;

        const roomZoneIndex = ZONES_ORDER.indexOf(room.zone);
        if (roomZoneIndex === -1) return violations; // Unknown zone

        for (const [direction, target] of Object.entries(room.exits)) {
          if (!target || !roomMap[target]) continue;

          const targetRoom = roomMap[target];
          if (!targetRoom.zone || room.zone === targetRoom.zone) continue; // Same zone

          const targetZoneIndex = ZONES_ORDER.indexOf(targetRoom.zone);
          if (targetZoneIndex === -1) continue; // Unknown target zone

          // Check if progression makes sense
          const progressionDiff = targetZoneIndex - roomZoneIndex;
          
          // Allow progression to next zone, or special cases
          const isValidProgression = 
            progressionDiff === 1 || // Next zone
            progressionDiff === -1 || // Previous zone (return path)
            room.id === 'introZone_crossing' || // Crossing can go anywhere
            this.isAllowedSpecialCase(room, targetRoom);

          if (!isValidProgression) {
            violations.push({
              rule: 'zone-progression-order',
              message: `Zone progression skips from ${room.zone} (${roomZoneIndex}) to ${targetRoom.zone} (${targetZoneIndex})`,
              severity: 'error',
              roomId: room.id,
              exitDirection: direction,
              target
            });
          }
        }

        return violations;
      }
    };
  }

  /**
   * Check if a cross-zone exit is a special allowed case
   */
  private isAllowedSpecialCase(fromRoom: Room, toRoom: Room): boolean {
    // London-NYC direct connection
    if (fromRoom.zone === 'londonZone' && toRoom.zone === 'newyorkZone') {
      return true;
    }

    // Library conditional access
    if (fromRoom.zone === 'mazeZone' && toRoom.zone === 'libraryZone') {
      return true;
    }

    return false;
  }

  /**
   * Generate lint report
   */
  generateReport(violations: LintViolation[]): string {
    let report = '# Room Exit Lint Report\n\n';

    const errorCount = violations.filter(v => v.severity === 'error').length;
    const warningCount = violations.filter(v => v.severity === 'warning').length;
    const infoCount = violations.filter(v => v.severity === 'info').length;

    report += `## Summary\n`;
    report += `- Errors: ${errorCount}\n`;
    report += `- Warnings: ${warningCount}\n`;
    report += `- Info: ${infoCount}\n`;
    report += `- Total: ${violations.length}\n\n`;

    if (violations.length === 0) {
      report += '✅ No lint violations found!\n';
      return report;
    }

    // Group by severity
    const groupedViolations = {
      error: violations.filter(v => v.severity === 'error'),
      warning: violations.filter(v => v.severity === 'warning'),
      info: violations.filter(v => v.severity === 'info')
    };

    for (const [severity, severityViolations] of Object.entries(groupedViolations)) {
      if (severityViolations.length === 0) continue;

      const icon = severity === 'error' ? '❌' : severity === 'warning' ? '⚠️' : 'ℹ️';
      report += `## ${icon} ${severity.toUpperCase()} (${severityViolations.length})\n\n`;

      for (const violation of severityViolations) {
        report += `### ${violation.roomId}\n`;
        report += `**Rule:** ${violation.rule}\n`;
        report += `**Message:** ${violation.message}\n`;
        if (violation.exitDirection) {
          report += `**Exit:** ${violation.exitDirection}\n`;
        }
        if (violation.target) {
          report += `**Target:** ${violation.target}\n`;
        }
        report += '\n';
      }
    }

    return report;
  }
}

/**
 * Quick lint function for use in scripts
 */
export function lintRoomExits(roomMap: Record<string, Room>, config?: LintConfig): LintViolation[] {
  const linter = new RoomExitLinter(config);
  return linter.lintRooms(roomMap);
}

/**
 * Check if lint violations are blocking (contain errors)
 */
export function hasBlockingViolations(violations: LintViolation[]): boolean {
  return violations.some(v => v.severity === 'error');
}
